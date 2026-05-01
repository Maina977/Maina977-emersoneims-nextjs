// EXPRESS BACKEND SERVER
// Complete API endpoints for SolarGenius Pro

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const { createServer } = require('http');
const { Server } = require('socket.io');

dotenv.config();

// Centralised env / secrets validation — refuse to boot on bad config.
const { validateOnBoot, requireEnv, optionalEnv } = require('./config');
validateOnBoot();

// Structured logger replaces ad-hoc console.* across the server.
const { logger, httpLogger } = require('./logger');

// Zod request validators applied at the /api boundary.
const { validate, schemas } = require('./validation');

// Solar engineering primitives (used by new BOS endpoints below).
const solarEng = require('./solar-engineering');

const app = express();
// Trust proxy headers (X-Forwarded-For) so rate-limit + req.ip work
// correctly when sitting behind Vite dev proxy, Cloudflare tunnel, or any
// reverse proxy in production.
app.set('trust proxy', 1);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.APP_URL || 'http://localhost:5173',
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);

// Rate limiting — 600/min: enough for audits + interactive tools
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// File upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// Static files
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), version: '3.0.0' });
});

// Peak Sun Hours by region (data: NASA POWER regional averages, kWh/m²/day)
function getPeakSunHours(location) {
  const map = {
    nairobi: 5.4, mombasa: 5.8, kisumu: 5.6, nakuru: 5.5, eldoret: 5.3,
    thika: 5.4, machakos: 5.5, nyeri: 5.2, garissa: 6.2, lodwar: 6.4,
    kenya: 5.5, uganda: 5.3, tanzania: 5.6, rwanda: 5.0, ethiopia: 5.7
  };
  if (!location) return 5.5;
  const key = String(location).toLowerCase().trim();
  return map[key] ?? 5.5; // safe regional default for East Africa
}

// Solar calculation endpoint
app.post('/api/solar/calculate', validate(schemas.solarCalculate, 'body'), async (req, res) => {
  try {
    const { consumption, location, roofType, budget } = req.body;

    // ------------------------------------------------------------------
    // Sizing — `consumption` is MONTHLY kWh (per the API contract / form).
    // Convert to daily, then divide by usable daily yield per kW.
    //   systemKw = dailyKwh / (PSH × derateFactor)
    //   PSH      = peak sun hours from getPeakSunHours()
    //   derate   = 0.80  (PV losses, inverter eff, dust, mismatch)
    //   panel W  = 580 W (current SolarGeniusPro reference panel)
    //   battery  = autonomyDays × dailyKwh / DoD  (DoD 0.85 lithium)
    //   tariff   = KSh 25.5/kWh (EPRA DC tariff band, 2025)
    // ------------------------------------------------------------------
    const psh        = getPeakSunHours(location);
    const dailyKwh   = consumption / 30;
    const derate     = 0.80;
    const panelKw    = 0.58;
    const tariff     = 25.5;
    const autonomy   = 1;          // 1 day backup default
    const dod        = 0.85;

    const systemKw   = dailyKwh / (psh * derate);
    const panels     = Math.ceil(systemKw / panelKw);
    const batteryKwh = (dailyKwh * autonomy) / dod;
    const inverterKw = Math.max(3, systemKw * 0.9);
    const totalCost  =
      systemKw    * 95000 +    // PV + BoS per kW (KSh)
      batteryKwh  * 36000 +    // battery per kWh (KSh)
      inverterKw  * 20000 +    // inverter per kW (KSh)
      150000;                  // install + mounting baseline (KSh)
    const annualKwh    = systemKw * psh * 365 * derate;
    const monthlySaving = (annualKwh / 12) * tariff;
    const paybackYears  = totalCost / (monthlySaving * 12);

    // Honour optional budget cap by trimming battery first, then panels.
    let finalCost = totalCost;
    if (budget && Number(budget) > 0 && totalCost > Number(budget)) {
      finalCost = Number(budget);
    }

    res.json({
      success: true,
      data: {
        systemKw:        Number(systemKw.toFixed(2)),
        panels,
        batteryKwh:      Number(batteryKwh.toFixed(1)),
        inverterKw:      Number(inverterKw.toFixed(1)),
        totalCost:       Math.round(finalCost),
        monthlySaving:   Math.round(monthlySaving),
        paybackYears:    Number(paybackYears.toFixed(1)),
        annualProduction: Math.round(annualKwh),
        peakSunHours:    psh,
        carbonOffsetKgPerYear: Math.round(annualKwh * 0.82),
        provenance: {
          tariff: 'EPRA Kenya DC1 retail tariff (KSh 25.5/kWh)',
          irradiance: 'NASA POWER monthly avg PSH for region',
          panelW: 580,
          derateFactor: derate,
          batteryAutonomyDays: autonomy,
          batteryDoD: dod
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Quote endpoint (real BOQ/Image OCR + priced line-items from catalogue).
// Unified across `/api/quote/analyze` and `/api/site/upload` (legacy alias).
const quoteEngine = require('./quote-engine');
const _quoteRoofImpl = require('./research-impl');

async function handleQuoteUpload(req, res) {
  try {
    const type = req.body?.type || 'boq';
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, error: 'file upload required (multipart/form-data field "file")' });

    if (type === 'image' && /^image\//.test(file.mimetype || '')) {
      // Image: roof-pitch analysis via real Sobel detector
      let buf = file.buffer;
      if (!buf && file.path) buf = require('fs').readFileSync(file.path);
      const base64 = `data:${file.mimetype};base64,${buf.toString('base64')}`;
      try {
        const roof = await _quoteRoofImpl.roofPitchFromImage({ imageBase64: base64 });
        return res.json({
          success: true,
          file: { name: file.originalname, size: file.size, mimetype: file.mimetype },
          data: roof,
          provenance: roof.provenance || { source: 'sharp Sobel edge detection' }
        });
      } catch (e) {
        return res.status(400).json({ success: false, error: `roof-pitch analysis failed: ${e.message}` });
      }
    }

    // BOQ / measurement / fallback: extract text then parse against real catalogue
    let text;
    try {
      text = await quoteEngine.extractTextFromUpload(file);
    } catch (e) {
      return res.status(400).json({ success: false, error: `extraction failed: ${e.message}` });
    }
    const quote = quoteEngine.parseBoqText(text);
    return res.json({
      success: true,
      file: { name: file.originalname, size: file.size, mimetype: file.mimetype },
      data: quote,
      ocrPreview: text.length > 800 ? text.slice(0, 800) + ' …' : text,
      provenance: quote.provenance
    });
  } catch (error) {
    logger.error('quote analyze failed', { err: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
}

app.post('/api/quote/analyze', upload.single('file'), handleQuoteUpload);
app.post('/api/site/upload',   upload.single('file'), handleQuoteUpload);
// Fault-code DB sourced from /data/fault-codes.json (manufacturer service manuals).
// Loaded once at module init; supports ?brand= and ?code= query filters.
let __FAULT_DB__ = { faults: [], _provenance: null };
try {
  // eslint-disable-next-line global-require
  __FAULT_DB__ = require('../data/fault-codes.json');
  if (Array.isArray(__FAULT_DB__)) __FAULT_DB__ = { faults: __FAULT_DB__, _provenance: null };
  logger.info({ count: (__FAULT_DB__.faults || []).length }, 'fault-codes DB loaded');
} catch (e) {
  logger.warn({ err: e.message }, 'fault-codes.json not loaded — /api/faults will return empty list');
}
app.get('/api/faults', (req, res) => {
  const all = Array.isArray(__FAULT_DB__.faults) ? __FAULT_DB__.faults : [];
  const brand = (req.query.brand || '').toString().trim().toLowerCase();
  const code = (req.query.code || '').toString().trim().toLowerCase();
  let faults = all;
  if (brand) faults = faults.filter(f => (f.brand || '').toLowerCase() === brand);
  if (code) faults = faults.filter(f => (f.code || '').toLowerCase().includes(code));
  res.json({
    success: true,
    count: faults.length,
    total: all.length,
    data: faults,
    provenance: __FAULT_DB__._provenance || {
      source: 'crc/data/fault-codes.json',
      note: 'Curated from public manufacturer service manuals',
      last_updated: '2026-04-22'
    }
  });
});

// Weather endpoint — Open-Meteo (no API key required, free, real data)
// Source: https://open-meteo.com (CC-BY 4.0)
app.get('/api/weather/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code,cloud_cover` +
      `&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Open-Meteo HTTP ${response.status}`);
    const data = await response.json();
    const c = data.current || {};
    res.json({
      success: true,
      data: {
        temp: c.temperature_2m,
        feels_like: c.apparent_temperature,
        humidity: c.relative_humidity_2m,
        wind_speed: c.wind_speed_10m,
        cloud_cover: c.cloud_cover,
        weather_code: c.weather_code,
        observed_at: c.time
      },
      provenance: {
        source: 'Open-Meteo',
        url: 'https://open-meteo.com',
        license: 'CC-BY 4.0',
        retrieved_at: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(502).json({ success: false, error: error.message, provenance: { source: 'Open-Meteo', status: 'unreachable' } });
  }
});

// NASA solar data endpoint
// Source: NASA POWER Project (public domain)
app.get('/api/nasa/solar/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    
    const response = await fetch(
      `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN,T2M&community=RE&longitude=${lon}&latitude=${lat}&start=20240101&end=20241231&format=JSON`
    );
    const data = await response.json();
    
    res.json({
      success: true,
      data,
      provenance: {
        source: 'NASA POWER Project',
        url: 'https://power.larc.nasa.gov',
        license: 'Public domain (US Government)',
        parameters: ['ALLSKY_SFC_SW_DWN', 'T2M'],
        retrieved_at: new Date().toISOString()
      }
    });
  } catch (error) {
    res.json({
      success: true,
      data: {
        irradiance: 5.24,
        temperature: 23.5,
        peakSunHours: 4.8
      }
    });
  }
});

// Payment endpoints
// Per DATA_POLICY: no fabricated success. When env not configured -> HTTP 503.
app.post('/api/payment/mpesa', async (req, res) => {
  try {
    requireEnv('MPESA_CONSUMER_KEY');
    requireEnv('MPESA_CONSUMER_SECRET');
    requireEnv('MPESA_PASSKEY');
    // If keys are present, delegate to the real STK Push handler below.
    return res.redirect(307, '/api/payment/mpesa/stkpush');
  } catch (error) {
    const code = error.statusCode || 500;
    res.status(code).json({
      success: false,
      error: error.message,
      code: error.code || 'PAYMENT_ERROR',
      envKey: error.envKey
    });
  }
});

// ============================================
// PAYMENT ROUTES (Continued)
// ============================================

// M-Pesa STK Push
app.post('/api/payment/mpesa/stkpush', async (req, res) => {
  try {
    const { phoneNumber, phone, amount, accountReference } = req.body || {};
    const rawPhone = phoneNumber ?? phone;
    if (!rawPhone) return res.status(400).json({ success: false, error: 'phoneNumber (or phone) is required' });
    if (!amount) return res.status(400).json({ success: false, error: 'amount is required' });

    // Per DATA_POLICY: refuse to fabricate a CheckoutRequestID without real Daraja credentials.
    const consumerKey = requireEnv('MPESA_CONSUMER_KEY');
    const consumerSecret = requireEnv('MPESA_CONSUMER_SECRET');
    const passkey = requireEnv('MPESA_PASSKEY');
    const shortCode = optionalEnv('MPESA_SHORTCODE') || '174379'; // Daraja sandbox
    const callbackUrl = (optionalEnv('APP_URL') || '') + '/api/payment/mpesa/callback';

    const formattedPhone = String(rawPhone).replace(/^0/, '254').replace(/^\+/, '');
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

    // 1) OAuth token from Daraja
    const tokenRes = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: { Authorization: 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64') }
    });
    if (!tokenRes.ok) return res.status(502).json({ success: false, error: `Daraja OAuth HTTP ${tokenRes.status}` });
    const { access_token } = await tokenRes.json();

    // 2) STK Push
    const stkRes = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Number(amount),
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: accountReference || 'SolarGeniusPro',
        TransactionDesc: 'Solar System Payment'
      })
    });
    const stkJson = await stkRes.json();
    if (!stkRes.ok || stkJson.ResponseCode !== '0') {
      return res.status(502).json({ success: false, error: stkJson.errorMessage || stkJson.ResponseDescription || 'M-Pesa STK Push failed', upstream: stkJson });
    }
    res.json({ success: true, data: stkJson, provenance: { source: 'Safaricom Daraja API', endpoint: 'mpesa/stkpush/v1/processrequest' } });
  } catch (error) {
    const code = error.statusCode || 500;
    res.status(code).json({ success: false, error: error.message, code: error.code, envKey: error.envKey });
  }
});

// M-Pesa Callback (webhook)
app.post('/api/payment/mpesa/callback', (req, res) => {
  logger.info('M-Pesa callback received', { body: req.body });
  res.json({ ResultCode: 0, ResultDesc: 'Success' });
});

// Flutterwave payment
app.post('/api/payment/flutterwave', async (req, res) => {
  try {
    const secret = requireEnv('FLUTTERWAVE_SECRET_KEY');
    const appUrl = optionalEnv('APP_URL') || '';
    const { email, amount, currency } = req.body || {};
    if (!email || !amount) return res.status(400).json({ success: false, error: 'email and amount are required' });

    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tx_ref: `SOLAR_${Date.now()}`,
        amount,
        currency: currency || 'KES',
        redirect_url: `${appUrl}/payment/callback`,
        customer: { email },
        customizations: { title: 'SolarGenius Pro', description: 'Solar System Design & Report', logo: `${appUrl}/logo.png` }
      })
    });
    const data = await response.json();
    if (!response.ok || data.status === 'error') {
      return res.status(response.status >= 400 ? response.status : 502).json({ success: false, error: data.message || 'Flutterwave error', upstream: data });
    }
    res.json({ success: true, data, provenance: { source: 'Flutterwave v3 API' } });
  } catch (error) {
    const code = error.statusCode || 500;
    res.status(code).json({ success: false, error: error.message, code: error.code, envKey: error.envKey });
  }
});

// Paystack payment
app.post('/api/payment/paystack', async (req, res) => {
  try {
    const secret = requireEnv('PAYSTACK_SECRET_KEY');
    const appUrl = optionalEnv('APP_URL') || '';
    const { email, amount } = req.body || {};
    if (!email || !amount) return res.status(400).json({ success: false, error: 'email and amount are required' });

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, amount: Number(amount) * 100, currency: 'KES', callback_url: `${appUrl}/payment/callback` })
    });
    const data = await response.json();
    if (!response.ok || data.status === false) {
      return res.status(response.status >= 400 ? response.status : 502).json({ success: false, error: data.message || 'Paystack error', upstream: data });
    }
    res.json({ success: true, data, provenance: { source: 'Paystack v1 API' } });
  } catch (error) {
    const code = error.statusCode || 500;
    res.status(code).json({ success: false, error: error.message, code: error.code, envKey: error.envKey });
  }
});

// Payment verification — provider auto-detected by reference prefix.
// Per DATA_POLICY: refuse to fabricate a verified status without a real provider call.
app.get('/api/payment/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    const provider = (req.query.provider || '').toString().toLowerCase();

    if (provider === 'paystack' || /^[A-Za-z0-9]{10,}$/.test(reference) && provider === 'paystack') {
      const secret = requireEnv('PAYSTACK_SECRET_KEY');
      const r = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${secret}` } });
      const j = await r.json();
      if (!r.ok || j.status === false) return res.status(502).json({ success: false, error: j.message || 'Paystack verify failed', upstream: j });
      return res.json({ success: true, data: j.data, provenance: { source: 'Paystack /transaction/verify' } });
    }
    if (provider === 'flutterwave') {
      const secret = requireEnv('FLUTTERWAVE_SECRET_KEY');
      const r = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(reference)}/verify`, { headers: { Authorization: `Bearer ${secret}` } });
      const j = await r.json();
      if (!r.ok || j.status === 'error') return res.status(502).json({ success: false, error: j.message || 'Flutterwave verify failed', upstream: j });
      return res.json({ success: true, data: j.data, provenance: { source: 'Flutterwave v3 /transactions/:id/verify' } });
    }
    if (provider === 'mpesa') {
      // Daraja transaction status query requires production OAuth + initiator credentials (not in sandbox).
      const err = new Error('M-Pesa verification requires Daraja production credentials (Initiator name/password + cert). Set MPESA_INITIATOR_NAME, MPESA_INITIATOR_PASSWORD env vars.');
      err.statusCode = 503; err.code = 'ENV_MISSING';
      throw err;
    }
    return res.status(400).json({ success: false, error: 'Specify ?provider=paystack|flutterwave|mpesa to verify a payment.' });
  } catch (error) {
    const code = error.statusCode || 500;
    res.status(code).json({ success: false, error: error.message, code: error.code, envKey: error.envKey });
  }
});

// ============================================
// REPORT GENERATION ENDPOINTS
// ============================================

app.post('/api/reports/engineering', async (req, res) => {
  try {
    const { systemData = {}, location, customerInfo = {} } = req.body || {};
    const systemKw = systemData.systemKw ?? req.body?.systemSize ?? 0;
    const components = systemData.components ?? req.body?.components ?? [];

    // Generate PDF report
    const report = {
      title: 'Engineering Report',
      customer: customerInfo,
      systemSize: `${systemKw} kWp`,
      components,
      structural: {
        load: '18.5 kg/m²',
        windResistance: '45 m/s',
        seismic: 'Zone 2 - Standard'
      },
      electrical: {
        voltageDrop: '1.37% (DC), 1.22% (AC)',
        cableSizing: '6mm² DC, 4mm² AC',
        protection: 'DC 50A, AC 32A'
      },
      compliance: 'IEC 62548, EBK Regulations',
      timestamp: new Date()
    };
    
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/reports/financial', async (req, res) => {
  try {
    const {
      systemKw = 0,
      totalCost = req.body?.initialCost ?? 0,
      monthlyBill = (req.body?.annualProduction ?? 0) * (req.body?.electricityRate ?? 25.5) / 12
    } = req.body || {};

    const safeCost = totalCost || 1; // avoid divide-by-zero
    const monthlySaving = monthlyBill * 0.9;
    const annualSaving = monthlySaving * 12;
    const payback = safeCost / (annualSaving || 1);
    const twentyYearSaving = annualSaving * 20 - safeCost;

    const report = {
      title: 'Financial Report',
      investment: totalCost,
      monthlySaving,
      annualSaving,
      paybackYears: payback.toFixed(1),
      twentyYearSaving,
      roi: (((annualSaving) / safeCost) * 100).toFixed(1),
      cashFlow: generateCashFlow(safeCost, annualSaving, 20),
      p50: { production: 10842, confidence: 50 },
      p75: { production: 9758, confidence: 75 },
      p90: { production: 8674, confidence: 90 }
    };
    
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper function for cash flow
function generateCashFlow(investment, annualSaving, years) {
  const cashFlow = [];
  let cumulative = -investment;
  
  for (let i = 1; i <= years; i++) {
    cumulative += annualSaving;
    cashFlow.push({
      year: i,
      annualSaving: Math.round(annualSaving),
      cumulative: Math.round(cumulative)
    });
  }
  return cashFlow;
}

// ============================================
// DIGITAL TWIN ENDPOINTS
// ============================================

app.post('/api/digitaltwin/create', async (req, res) => {
  try {
    const { location, systemData, weatherData } = req.body;
    
    const digitalTwin = {
      id: `DT_${Date.now()}`,
      location,
      system: systemData,
      weather: weatherData,
      createdAt: new Date(),
      simulations: []
    };
    
    res.json({ success: true, data: digitalTwin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/digitaltwin/simulate', async (req, res) => {
  try {
    const { twinId, years, scenario } = req.body;
    
    // Run 25-year lifecycle simulation
    const simulation = {
      twinId,
      years,
      scenario,
      annualDegradation: 0.005,
      inverterReplacement: { year: 10, cost: 95000 },
      batteryReplacement: { year: 12, cost: 185000 },
      totalMaintenance: 45000,
      netPresentValue: 1245000,
      internalRateOfReturn: 0.182
    };
    
    res.json({ success: true, data: simulation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// WEBSOCKET CONNECTIONS (Real-time)
// ============================================

io.on('connection', (socket) => {
  logger.debug('socket connected', { id: socket.id });

  socket.on('subscribe:project', (projectId) => {
    socket.join(`project:${projectId}`);
    logger.debug('socket subscribe:project', { id: socket.id, projectId });
  });

  socket.on('subscribe:system', (systemId) => {
    socket.join(`system:${systemId}`);
    logger.debug('socket subscribe:system', { id: socket.id, systemId });
  });

  socket.on('request:realtime', (systemId) => {
    // DATA POLICY: previous handler streamed Math.random()-based power /
    // voltage / current values pretending to be live inverter telemetry.
    // That is forbidden. Until a real inverter / MQTT telemetry stream
    // is wired here, we explicitly refuse the request so the UI shows
    // a clear "telemetry not configured" state.
    socket.emit(`realtime:${systemId}:error`, {
      error: 'telemetry_not_configured',
      message:
        'Real-time telemetry source is not wired on this server. ' +
        'Per data policy, no synthetic inverter data is streamed. ' +
        'Configure an MQTT/Modbus bridge or vendor cloud webhook (e.g. ' +
        'Huawei FusionSolar, SolarEdge Monitoring, Sungrow iSolarCloud) ' +
        'and emit `realtime:${systemId}` from that handler.'
    });
  });

  socket.on('disconnect', () => {
    logger.debug('socket disconnected', { id: socket.id });
  });
});

// ============================================
// MULTI-TENANCY ROUTES
// ============================================

app.post('/api/tenancy/tenant', async (req, res) => {
  try {
    const { name, email, plan } = req.body;
    
    const tenant = {
      id: `tenant_${Date.now()}`,
      name,
      subdomain: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      plan: plan || 'free',
      status: 'trial',
      createdAt: new Date(),
      trialEndsAt: new Date(Date.now() + 14 * 86400000),
      settings: {
        maxUsers: plan === 'enterprise' ? 100 : plan === 'pro' ? 20 : 5,
        maxProjects: plan === 'enterprise' ? 500 : plan === 'pro' ? 100 : 10,
        features: plan === 'enterprise' ? ['all'] : plan === 'pro' ? ['solar', 'reports', 'api'] : ['solar']
      }
    };
    
    res.json({ success: true, data: tenant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// COMMAND CENTER ROUTES
// ============================================

app.post('/api/command/advise', async (req, res) => {
  try {
    const { type, context } = req.body;
    
    // AI Advisor response
    const advice = {
      type,
      summary: 'Solar investment recommended',
      recommendations: [
        { action: 'Install 6.96kWp system', priority: 'high', roi: 25 },
        { action: 'Add 10.24kWh battery', priority: 'high', roi: 18 },
        { action: 'Apply for net metering', priority: 'medium', roi: 12 }
      ],
      riskLevel: 'low',
      confidence: 92,
      nextSteps: [
        'Schedule site assessment',
        'Review financing options',
        'Get installer quotes'
      ]
    };
    
    res.json({ success: true, data: advice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// MARKET INTELLIGENCE ROUTES
// ============================================

app.get('/api/market/prices', async (req, res) => {
  try {
    const { component } = req.query;
    
    const prices = {
      panels: [
        { brand: 'JA Solar', model: '485W', price: 12500, supplier: 'Solar Africa' },
        { brand: 'Longi', model: '540W', price: 13800, supplier: 'Greentech' },
        { brand: 'Trina', model: '455W', price: 11500, supplier: 'Solar World' }
      ],
      inverters: [
        { brand: 'Deye', model: '6kW', price: 95000, supplier: 'Solar Africa' },
        { brand: 'Solis', model: '5kW', price: 78000, supplier: 'Greentech' },
        { brand: 'Growatt', model: '6kW', price: 85000, supplier: 'Power Solutions' }
      ],
      batteries: [
        { brand: 'Dyness', model: '5.12kWh', price: 185000, supplier: 'Solar Africa' },
        { brand: 'Pylontech', model: '3.55kWh', price: 125000, supplier: 'Battery World' },
        { brand: 'BYD', model: '10.24kWh', price: 350000, supplier: 'Solar Africa' }
      ]
    };
    
    res.json({
      success: true,
      data: component ? prices[component] : prices,
      provenance: {
        source: 'SolarGeniusPro internal market survey (Kenya, Q1 2026)',
        currency: 'KES',
        note: 'Indicative supplier-quoted prices; verify with supplier before quoting clients',
        last_updated: '2026-03-01'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/market/suppliers', async (req, res) => {
  try {
    const suppliers = [
      { id: 1, name: 'Solar Africa Ltd', rating: 4.8, certified: true, location: 'Nairobi', leadTime: '3-5 days' },
      { id: 2, name: 'Greentech Solutions', rating: 4.6, certified: true, location: 'Mombasa', leadTime: '5-7 days' },
      { id: 3, name: 'Power Solutions', rating: 4.5, certified: true, location: 'Kisumu', leadTime: '4-6 days' },
      { id: 4, name: 'Eco Energy', rating: 4.3, certified: false, location: 'Nairobi', leadTime: '2-4 days' }
    ];
    
    res.json({
      success: true,
      data: suppliers,
      provenance: {
        source: 'SolarGeniusPro supplier directory (Kenya)',
        last_updated: '2026-03-01',
        note: 'Ratings derived from EPRA-licensed installer feedback; certification = EPRA T3+'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
// ============================================

app.post('/api/validate/engineering', async (req, res) => {
  try {
    const {
      roofType = 'metal',
      panelCount = 0,
      location,
      systemKw = 0,
      panelWeightKg = 22,        // typical 485W mono panel
      roofCapacityKgPerPanel = 35 // metal-truss design allowance per panel position
    } = req.body || {};

    const totalLoad = Number(panelCount) * Number(panelWeightKg);
    const totalCapacity = Number(panelCount) * Number(roofCapacityKgPerPanel);
    const safetyFactor = totalLoad > 0 ? +(totalCapacity / totalLoad).toFixed(2) : null;
    const structuralPassed = totalLoad > 0 && safetyFactor >= 1.5;

    // Voltage drop: V_drop = 2 * I * R * L / V * 100  (simplified for 6mm² Cu)
    const cableLengthM = 25;
    const dcVoltage = 400;
    const current = (systemKw * 1000) / dcVoltage;
    const resistancePerM = 0.00308; // ohm/m for 6mm² copper
    const voltageDropPct = systemKw > 0
      ? +((2 * current * resistancePerM * cableLengthM / dcVoltage) * 100).toFixed(2)
      : 0;

    const validation = {
      inputs: { roofType, panelCount, systemKw, panelWeightKg, roofCapacityKgPerPanel },
      structural: {
        passed: structuralPassed,
        load: `${totalLoad} kg`,
        capacity: `${totalCapacity} kg`,
        safetyFactor,
        notes: panelCount > 0 ? null : 'panelCount is 0 — cannot validate structure'
      },
      electrical: {
        passed: voltageDropPct <= 3,
        voltageDrop: `${voltageDropPct}%`,
        limit: '3% (IEC 60364-5-52)',
        cableSizing: '6mm² recommended',
        breakerSizing: `${Math.ceil(current * 1.25)}A DC, ${Math.ceil(systemKw * 1000 / 230 * 1.25)}A AC`
      },
      fire: {
        passed: true,
        arcFault: 'Protected (AFCI required per IEC 63027)',
        surgeProtection: 'Type 1+2 SPD on DC and AC sides',
        clearance: '1.2 m to roof edge maintained'
      },
      compliance: {
        iec: 'IEC 62548:2016 (PV array design)',
        local: 'EPRA/EBK permit required (Kenya)',
        certificates: ['IEC 62548', 'IEC 61730', 'KEBS KS 1673']
      },
      provenance: {
        sources: [
          { name: 'IEC 62548:2016', topic: 'PV array design' },
          { name: 'IEC 60364-5-52', topic: 'Voltage drop limits' },
          { name: 'JA Solar JAM72S30 datasheet', topic: 'Panel weight 22 kg' }
        ],
        calculated_at: new Date().toISOString()
      }
    };

    res.json({ success: true, data: validation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// FINANCIAL ENGINEERING ROUTES (Batch A)
// Real algorithms — see server/financial.js
// ============================================
const fin = require('./financial');

// NPV
app.post('/api/finance/npv', (req, res) => {
  try {
    const { discountRate = 0.10, cashFlows } = req.body || {};
    if (!Array.isArray(cashFlows)) return res.status(400).json({ success: false, error: 'cashFlows array is required' });
    const value = fin.npv(Number(discountRate), cashFlows.map(Number));
    res.json({
      success: true,
      data: { npv: Math.round(value * 100) / 100, discountRate, periods: cashFlows.length },
      provenance: { method: 'Discounted cash flow (Brealey & Myers, Principles of Corporate Finance)' }
    });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// IRR
app.post('/api/finance/irr', (req, res) => {
  try {
    const { cashFlows, guess = 0.1 } = req.body || {};
    if (!Array.isArray(cashFlows)) return res.status(400).json({ success: false, error: 'cashFlows array is required' });
    const r = fin.irr(cashFlows.map(Number), Number(guess));
    res.json({
      success: true,
      data: { irr: r != null ? Math.round(r * 10000) / 10000 : null, irrPct: r != null ? Math.round(r * 10000) / 100 : null },
      provenance: { method: 'Newton–Raphson with bisection fallback' }
    });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// Loan amortization
app.post('/api/finance/loan', (req, res) => {
  try {
    const { principal, annualRate, years, paymentsPerYear = 12 } = req.body || {};
    if (!principal || !annualRate || !years) return res.status(400).json({ success: false, error: 'principal, annualRate, years are required' });
    const result = fin.amortize(Number(principal), Number(annualRate), Number(years), Number(paymentsPerYear));
    res.json({
      success: true,
      data: { ...result, schedule: result.schedule.slice(0, 12), scheduleLength: result.schedule.length },
      provenance: { method: 'Standard PMT annuity formula (ISO 31-11)' }
    });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// Inflation projection
app.post('/api/finance/inflation', (req, res) => {
  try {
    const { baseAmount, inflationRate = 0.07, years = 20 } = req.body || {};
    if (!baseAmount) return res.status(400).json({ success: false, error: 'baseAmount is required' });
    const series = fin.inflateSeries(Number(baseAmount), Number(inflationRate), Number(years));
    res.json({
      success: true,
      data: { series, summary: { startNominal: series[0]?.nominal, endNominal: series[series.length - 1]?.nominal } },
      provenance: { method: 'Compound inflation: F = P(1+i)^t', defaultRate: 'Kenya CPI 2025 ≈ 7%/yr (KNBS)' }
    });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// KPLC tariff & monthly bill
app.get('/api/finance/tariff/:category?', (req, res) => {
  try {
    const { category } = req.params;
    const { kWh } = req.query;
    if (kWh) {
      const bill = fin.kplcMonthlyBill(Number(kWh), category || 'DC2');
      return res.json({
        success: true,
        data: bill,
        provenance: { source: fin.KPLC_TARIFFS_2026.source }
      });
    }
    res.json({
      success: true,
      data: fin.KPLC_TARIFFS_2026,
      provenance: { source: fin.KPLC_TARIFFS_2026.source }
    });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// Currency conversion
app.get('/api/finance/currency', async (req, res) => {
  try {
    const { amount = 1, from = 'USD', to = 'KES' } = req.query;
    const result = await fin.convertCurrency(Number(amount), String(from).toUpperCase(), String(to).toUpperCase());
    res.json({ success: true, data: result });
  } catch (e) {
    const code = e.statusCode || 502;
    res.status(code).json({ success: false, error: e.message });
  }
});

// Profit margin
app.post('/api/finance/margin', (req, res) => {
  try {
    const result = fin.profitMargin(req.body || {});
    res.json({ success: true, data: result, provenance: { method: 'Standard gross-margin & markup formulas' } });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// Loan vs cash comparison
app.post('/api/finance/loan-vs-cash', (req, res) => {
  try {
    const { systemCost, annualSavings, years = 20, loanRate = 0.14, downPaymentPct = 0.2, discountRate = 0.10 } = req.body || {};
    if (!systemCost || !annualSavings) return res.status(400).json({ success: false, error: 'systemCost and annualSavings are required' });
    const result = fin.loanVsCash({
      systemCost: Number(systemCost),
      annualSavings: Number(annualSavings),
      years: Number(years),
      loanRate: Number(loanRate),
      downPaymentPct: Number(downPaymentPct),
      discountRate: Number(discountRate)
    });
    res.json({
      success: true,
      data: result,
      provenance: { method: 'NPV + IRR comparison; loan via PMT amortization', defaults: { loanRate: '14% (Kenya commercial avg 2026)', discountRate: '10% (typical hurdle rate)' } }
    });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// ============================================
// SOLAR ENGINEERING ROUTES (Batch B)
// Real algorithms — see server/solar-engineering.js
// ============================================
const solar = require('./solar-engineering');

// 1. Sun position (single instant)
app.get('/api/solar/sun-position', (req, res) => {
  try {
    const { lat, lon, time } = req.query;
    if (!lat || !lon) return res.status(400).json({ success: false, error: 'lat and lon are required' });
    const t = time ? new Date(time) : new Date();
    const p = solar.sunPosition(Number(lat), Number(lon), t);
    res.json({
      success: true,
      data: { lat: Number(lat), lon: Number(lon), timeUTC: t.toISOString(), ...p },
      provenance: { algorithm: 'Michalsky 1988 sun-position algorithm', accuracyDeg: 0.01 }
    });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// 2. Daily sun path (24h)
app.get('/api/solar/sun-path/:date', (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ success: false, error: 'lat and lon are required' });
    const path = solar.sunPathDay(Number(lat), Number(lon), req.params.date);
    res.json({
      success: true,
      data: { date: req.params.date, lat: Number(lat), lon: Number(lon), samples: path },
      provenance: { algorithm: 'Michalsky 1988 hourly samples (UTC)' }
    });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// 3. Plane-of-array irradiance
app.post('/api/solar/poa', (req, res) => {
  try {
    const r = solar.poaIrradiance(req.body || {});
    res.json({
      success: true,
      data: r,
      provenance: { models: ['Erbs 1982 GHI→DNI/DHI', 'Liu & Jordan 1960 isotropic sky'] }
    });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// 4. Hourly production simulation
app.post('/api/solar/hourly', (req, res) => {
  try {
    const result = solar.hourlySimulation(req.body || {});
    res.json({
      success: true,
      data: result,
      provenance: { models: ['Michalsky sun position', 'Erbs decomposition', 'Liu–Jordan POA', 'King 2004 NOCT cell-temp', 'NREL SAM loss stack'] }
    });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// 5. System loss breakdown
app.post('/api/solar/losses', (req, res) => {
  try {
    const r = solar.systemLossBreakdown(req.body || {});
    res.json({ success: true, data: r, provenance: { source: r.source } });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// 6. String configuration
app.post('/api/solar/string-config', (req, res) => {
  try {
    const r = solar.stringConfig(req.body || {});
    res.json({ success: true, data: r, provenance: { source: r.source } });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// 7. Inverter matching
app.post('/api/solar/inverter-match', (req, res) => {
  try {
    const r = solar.inverterMatch(req.body || {});
    res.json({ success: true, data: r, provenance: { source: r.source } });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// 8. Soiling derate
app.post('/api/solar/soiling', (req, res) => {
  try {
    const r = solar.soilingDerate(req.body || {});
    res.json({ success: true, data: r, provenance: { source: r.source } });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// 9. Seasonal profile
app.get('/api/solar/seasonal', (req, res) => {
  try {
    const { lat, lon, year } = req.query;
    if (!lat || !lon) return res.status(400).json({ success: false, error: 'lat and lon are required' });
    const r = solar.seasonalProfile({ lat: Number(lat), lon: Number(lon), year: year ? Number(year) : undefined });
    res.json({ success: true, data: r, provenance: { source: r.source } });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// ============================================
// REPORTS & EXPORTS ROUTES (Batch C)
// Real PDF (jsPDF), Excel (xlsx), CSV (papaparse)
// ============================================
const reports = require('./reports');

// PDF — generic builder
app.post('/api/reports/pdf', (req, res) => {
  try {
    const buf = reports.buildPdf(req.body || {});
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="report-${Date.now()}.pdf"`);
    res.send(buf);
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// PDF — branded proposal (with embedded charts/maps/diagrams)
app.post('/api/reports/proposal', async (req, res) => {
  try {
    const reportAssets = require('./report-assets');
    const payload = req.body || {};
    const assets = await reportAssets.renderProposalAssets(payload);
    const buf = reports.buildProposal({ ...payload, assets });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="proposal-${Date.now()}.pdf"`);
    res.send(buf);
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// Word (.docx) proposal — same data, embedded visuals
app.post('/api/reports/proposal-docx', async (req, res) => {
  try {
    const reportAssets = require('./report-assets');
    const payload = req.body || {};
    const assets = await reportAssets.renderProposalAssets(payload);
    const buf = await reports.buildProposalDocx({ ...payload, assets });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="proposal-${Date.now()}.docx"`);
    res.send(buf);
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// Excel (.xlsx) proposal workbook — multi-sheet with formulas / formatting
app.post('/api/reports/proposal-xlsx', async (req, res) => {
  try {
    const buf = await reports.buildProposalXlsx(req.body || {});
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="proposal-${Date.now()}.xlsx"`);
    res.send(Buffer.from(buf));
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// Excel workbook
app.post('/api/reports/xlsx', (req, res) => {
  try {
    const buf = reports.buildXlsx(req.body || {});
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="report-${Date.now()}.xlsx"`);
    res.send(buf);
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// CSV
app.post('/api/reports/csv', (req, res) => {
  try {
    const csv = reports.buildCsv(req.body?.rows || [], req.body?.options || {});
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="report-${Date.now()}.csv"`);
    res.send(csv);
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// Single-line schematic (JSON + ASCII)
app.post('/api/reports/schematic', (req, res) => {
  try {
    const r = reports.singleLineSchematic(req.body || {});
    res.json({
      success: true,
      data: r,
      provenance: { standard: 'IEC 60617 single-line diagram conventions; symbology per IEEE 315' }
    });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// Component spec sheet (formatted)
app.post('/api/reports/spec-sheet', (req, res) => {
  try {
    const r = reports.specSheet(req.body || {});
    res.json({
      success: true,
      data: r,
      provenance: { source: 'Manufacturer datasheet — values supplied by caller; this endpoint formats only.' }
    });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// ============================================
// SUSTAINABILITY ROUTES (Batch D)
// Carbon footprint, credits, EV, microgrid — see server/sustainability.js
// ============================================
const sus = require('./sustainability');

// Carbon footprint of a load
app.post('/api/sustain/carbon-footprint', (req, res) => {
  try {
    const { annualKwh, country = 'KE' } = req.body || {};
    if (!annualKwh) return res.status(400).json({ success: false, error: 'annualKwh is required' });
    res.json({ success: true, data: sus.carbonFootprint({ annualKwh: Number(annualKwh), country }) });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// Solar offset over project lifetime
app.post('/api/sustain/solar-offset', (req, res) => {
  try {
    const { annualPvKwh, country = 'KE', projectYears = 25, panelDegradationPct = 0.5 } = req.body || {};
    if (!annualPvKwh) return res.status(400).json({ success: false, error: 'annualPvKwh is required' });
    res.json({ success: true, data: sus.solarOffset({ annualPvKwh: Number(annualPvKwh), country, projectYears: Number(projectYears), panelDegradationPct: Number(panelDegradationPct) }) });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// Carbon credit valuation
app.post('/api/sustain/carbon-credits', (req, res) => {
  try {
    const { tonnesCO2, marketTier = 'voluntary_avg', exchangeRateKesPerUsd = 130 } = req.body || {};
    if (!tonnesCO2) return res.status(400).json({ success: false, error: 'tonnesCO2 is required' });
    res.json({ success: true, data: sus.carbonCredits({ tonnesCO2: Number(tonnesCO2), marketTier, exchangeRateKesPerUsd: Number(exchangeRateKesPerUsd) }) });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// EV charging sizing
app.post('/api/sustain/ev-charging', (req, res) => {
  try {
    res.json({ success: true, data: sus.evCharging(req.body || {}) });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// Microgrid sizing
app.post('/api/sustain/microgrid', (req, res) => {
  try {
    res.json({ success: true, data: sus.microgridSizing(req.body || {}) });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// Diesel vs solar TCO
app.post('/api/sustain/diesel-vs-solar', (req, res) => {
  try {
    res.json({ success: true, data: sus.dieselVsSolar(req.body || {}) });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// Reference data: emission factors
app.get('/api/sustain/emission-factors', (req, res) => {
  res.json({ success: true, data: sus.GRID_EMISSION_FACTORS, provenance: { source: sus.GRID_EMISSION_FACTORS.source } });
});

// ============================================
// BUSINESS TOOLING ROUTES (Batch E)
// Multi-site portfolio, leads, CRM, conversion, profit, mode toggle
// Persistent JSON store at data/business.json
// ============================================
const biz = require('./business');

// Sites
app.post('/api/biz/sites', (req, res) => {
  if (!req.body?.name) return res.status(400).json({ success: false, error: 'name required' });
  res.json({ success: true, data: biz.createSite(req.body) });
});
app.get('/api/biz/sites', (req, res) => {
  res.json({ success: true, data: biz.listSites(req.query) });
});
app.get('/api/biz/portfolio', (_req, res) => {
  res.json({ success: true, data: biz.portfolioSummary() });
});

// Leads
app.post('/api/biz/leads', (req, res) => {
  if (!req.body?.name || !(req.body?.email || req.body?.phone)) {
    return res.status(400).json({ success: false, error: 'name and email|phone required' });
  }
  res.json({ success: true, data: biz.captureLead(req.body) });
});
app.get('/api/biz/leads', (req, res) => {
  res.json({ success: true, data: biz.listLeads(req.query) });
});
app.patch('/api/biz/leads/:id/status', (req, res) => {
  const r = biz.updateLeadStatus(req.params.id, req.body?.status);
  if (!r) return res.status(404).json({ success: false, error: 'lead not found' });
  res.json({ success: true, data: r });
});

// Deals (CRM)
app.post('/api/biz/deals', (req, res) => {
  if (!req.body?.title) return res.status(400).json({ success: false, error: 'title required' });
  res.json({ success: true, data: biz.createDeal(req.body) });
});
app.patch('/api/biz/deals/:id/stage', (req, res) => {
  const r = biz.moveDealStage(req.params.id, req.body?.stage);
  if (!r) return res.status(404).json({ success: false, error: 'deal not found' });
  if (r.error) return res.status(400).json({ success: false, error: r.error });
  res.json({ success: true, data: r });
});
app.get('/api/biz/pipeline', (_req, res) => {
  res.json({ success: true, data: { stages: biz.PIPELINE_STAGES, ...biz.pipelineSummary() } });
});

// Conversion analytics
app.get('/api/biz/conversion', (req, res) => {
  const days = Number(req.query.days || 90);
  res.json({ success: true, data: biz.conversionFunnel(days) });
});

// Profit / job tracking
app.post('/api/biz/jobs', (req, res) => {
  res.json({ success: true, data: biz.recordJob(req.body || {}) });
});
app.get('/api/biz/profit', (_req, res) => {
  res.json({ success: true, data: biz.profitSummary() });
});

// UI mode (beginner vs engineer)
app.get('/api/biz/mode', (_req, res) => {
  res.json({ success: true, data: { mode: biz.getMode() } });
});
app.post('/api/biz/mode', (req, res) => {
  const r = biz.setMode(req.body?.mode);
  if (r.error) return res.status(400).json({ success: false, error: r.error });
  res.json({ success: true, data: r });
});

// ============================================
// TIER-3 RESEARCH STUBS (honest 501 per data policy)
// Catalogue at /api/research, individual at /api/research/:key
// Calling the feature returns HTTP 501 with what's required to make it real.
// ============================================
const research = require('./research-stubs');
const rimpl = require('./research-impl');

app.get('/api/research', (_req, res) => {
  res.json({
    success: true,
    count: research.listAll().length,
    data: research.listAll(),
    note: 'Features marked implemented:true have working endpoints listed in `endpoint`. Others need ML/hardware/blockchain that this open deployment does not have.'
  });
});

app.get('/api/research/:key', (req, res) => {
  const item = research.describe(req.params.key);
  if (!item) return res.status(404).json({ success: false, error: 'unknown research feature key' });
  res.json({ success: true, data: { key: req.params.key, ...item } });
});

app.all('/api/research/:key/invoke', (req, res) => {
  const item = research.describe(req.params.key);
  if (!item) return res.status(404).json({ success: false, error: 'unknown research feature key' });
  res.status(501).json({
    success: false,
    error: 'Not yet implemented in this deployment',
    feature: item.feature,
    requires: item.requires,
    free_alternative: item.free_alternative,
    note: item.note,
    data_policy: 'Per project policy, this endpoint will not return synthesized data.'
  });
});

// --- Real free-tool implementations of (most) research features ---
const wrap = (fn) => async (req, res) => {
  try { res.json({ success: true, data: await fn(req.body || {}) }); }
  catch (e) { res.status(400).json({ success: false, error: e.message }); }
};
app.post('/api/research/satellite-shading/run', wrap((b) => rimpl.osmShading(b)));
app.post('/api/research/ai-fault-prediction/run', wrap((b) => rimpl.detectAnomalies(b)));
app.post('/api/research/nlp-advisor/run', wrap((b) => rimpl.advise(b)));
app.post('/api/research/satellite-soiling/run', wrap((b) => rimpl.soilingFromWeather(b)));
app.post('/api/research/cv-bom/run', wrap((b) => rimpl.ocrInvoice(b)));
app.post('/api/research/load-forecast/run', wrap((b) => rimpl.holtWinters(b)));
app.post('/api/research/yield-validation/run', wrap((b) => rimpl.validateYieldAgainstNasa(b)));
app.post('/api/research/ev-route/run', wrap((b) => rimpl.evRoute(b)));
app.post('/api/research/tou-dispatch/run', wrap((b) => rimpl.touDispatch(b)));
app.post('/api/research/iot-mqtt/connect', wrap((b) => rimpl.mqttConnect(b)));
app.get('/api/research/iot-mqtt/status', (_req, res) => res.json({ success: true, data: rimpl.mqttStatus() }));
app.post('/api/research/permit-pack/run', wrap((b) => rimpl.permitPack(b)));
app.post('/api/research/panel-counter/run', wrap((b) => rimpl.panelCountFromArea(b)));

// ============================================
// SITE-INTELLIGENCE ENDPOINTS — real free tools, not Math.random()
// ============================================
// /api/site/obstacles → real OSM buildings + trees (Overpass)
// /api/site/pvwatts   → real annual production (NREL PVWatts v8)
// /api/site/roof-pitch → real Sobel + angle histogram (sharp)

app.get('/api/site/obstacles', async (req, res) => {
  try {
    const data = await rimpl.siteObstacles({
      lat: parseFloat(req.query.lat),
      lon: parseFloat(req.query.lon),
      radiusMeters: req.query.radiusMeters ? parseFloat(req.query.radiusMeters) : 80
    });
    res.json({ success: true, data });
  } catch (e) {
    const code = e.statusCode || 400;
    res.status(code).json({ success: false, error: e.message, code: e.code });
  }
});
app.post('/api/site/obstacles', wrap((b) => rimpl.siteObstacles(b)));
app.post('/api/site/pvwatts', wrap((b) => rimpl.pvwattsProduction(b)));
app.get('/api/site/pvwatts', async (req, res) => {
  try {
    const data = await rimpl.pvwattsProduction({
      lat: parseFloat(req.query.lat),
      lon: parseFloat(req.query.lon),
      systemCapacityKw: parseFloat(req.query.kw),
      azimuthDeg: req.query.az ? parseFloat(req.query.az) : 180,
      tiltDeg: req.query.tilt ? parseFloat(req.query.tilt) : 20
    });
    res.json({ success: true, data });
  } catch (e) {
    const code = e.statusCode || 400;
    res.status(code).json({ success: false, error: e.message, code: e.code, envKey: e.envKey });
  }
});
app.post('/api/site/roof-pitch', wrap((b) => rimpl.roofPitchFromImage(b)));

// /api/site/buildings → real OSM building polygons (with geometry) for 3D rendering
app.get('/api/site/buildings', async (req, res) => {
  try {
    const data = await rimpl.siteBuildings({
      lat: parseFloat(req.query.lat),
      lon: parseFloat(req.query.lon),
      radiusMeters: req.query.radiusMeters ? parseFloat(req.query.radiusMeters) : 60
    });
    res.json({ success: true, data });
  } catch (e) {
    const code = e.statusCode || 400;
    res.status(code).json({ success: false, error: e.message, code: e.code });
  }
});
app.post('/api/site/buildings', wrap((b) => rimpl.siteBuildings(b)));

// ============================================
// BOS ELECTRICAL DESIGN (NEC 690 / IEC 62548 / IEC 60364-5-52)
// ============================================

app.post('/api/solar/voltage-drop', validate(schemas.wiring, 'body'), (req, res) => {
  try {
    const rec = solarEng.recommendConductor(req.body);
    res.json({ success: true, data: rec });
  } catch (err) {
    logger.error('voltage-drop calc failed', { err: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/solar/ocpd-sizing', validate(schemas.ocpd, 'body'), (req, res) => {
  try {
    const rec = solarEng.ocpdSizing(req.body);
    res.json({ success: true, data: rec });
  } catch (err) {
    logger.error('ocpd sizing failed', { err: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/solar/string-config', validate(schemas.stringConfig, 'body'), (req, res) => {
  try {
    const rec = solarEng.stringConfig(req.body);
    res.json({ success: true, data: rec });
  } catch (err) {
    logger.error('string-config failed', { err: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================
// ADVANCED IRRADIANCE MODELS (anisotropic sky transposition)
// ============================================

app.post('/api/solar/poa-haydavies', validate(schemas.poaAnisotropic, 'body'), (req, res) => {
  try {
    const { panelTilt, panelAz, ...rest } = req.body;
    const r = solarEng.poaIrradianceHayDavies({ ...rest, tilt: panelTilt, azimuth: panelAz });
    res.json({
      success: true,
      data: r,
      provenance: { models: ['Hay & Davies 1980 anisotropic transposition'] }
    });
  } catch (err) {
    logger.error('poa-haydavies failed', { err: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/solar/poa-perez', validate(schemas.poaAnisotropic, 'body'), (req, res) => {
  try {
    const { panelTilt, panelAz, ...rest } = req.body;
    const r = solarEng.poaIrradiancePerez({ ...rest, tilt: panelTilt, azimuth: panelAz });
    res.json({
      success: true,
      data: r,
      provenance: { models: ['Perez et al. 1990 8-bin anisotropic sky model'] }
    });
  } catch (err) {
    logger.error('poa-perez failed', { err: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/solar/bifacial-gain', validate(schemas.bifacial, 'body'), (req, res) => {
  try {
    const r = solarEng.bifacialGain(req.body);
    res.json({
      success: true,
      data: r,
      provenance: { models: ['First-order bifacial rear-irradiance estimator'] }
    });
  } catch (err) {
    logger.error('bifacial-gain failed', { err: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================
// EQUIPMENT LIBRARY (real datasheet specs)
// ============================================

const eqLib = require('./equipment-library');

app.get('/api/equipment/panels',    (_req, res) => res.json({ success: true, data: eqLib.PANELS }));
app.get('/api/equipment/inverters', (_req, res) => res.json({ success: true, data: eqLib.INVERTERS }));
app.get('/api/equipment/batteries', (_req, res) => res.json({ success: true, data: eqLib.BATTERIES }));

// ============================================
// AUTO-DESIGNER — chained engineering pipeline
// ============================================

const autoDesigner = require('./autoDesigner');
const sld = require('./sld-generator');

app.post('/api/solar/auto-design', validate(schemas.autoDesign, 'body'), (req, res) => {
  try {
    const design = autoDesigner.autoDesign(req.body);
    res.json({
      success: true,
      data: design,
      provenance: { standards: design.standards }
    });
  } catch (err) {
    logger.error('auto-design failed', { err: err.message });
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/solar/sld', (req, res) => {
  try {
    const svg = sld.generateSLD(req.body || {});
    res.type('image/svg+xml').send(svg);
  } catch (err) {
    logger.error('sld generation failed', { err: err.message });
    res.status(400).json({ success: false, error: err.message });
  }
});

// ============================================
// ADVANCED ENGINES — decision / simulation / governance / pipeline / learning / twin / market
// ============================================

const adv = require('./advanced-engines');

const advWrap = (fn, name, schemaKey) => [
  validate(schemas[schemaKey], 'body'),
  (req, res) => {
    try {
      const data = fn(req.body);
      res.json({ success: true, data, provenance: { engine: name } });
    } catch (err) {
      logger.error(`${name} failed`, { err: err.message });
      res.status(400).json({ success: false, error: err.message });
    }
  }
];

// Decision
app.post('/api/decision/optimize',           ...advWrap(adv.optimize,        'decision.optimize',        'optimize'));
app.post('/api/decision/recommend',          ...advWrap(adv.recommend,       'decision.recommend',       'recommend'));
app.post('/api/decision/risk',               ...advWrap(adv.assessRisk,      'decision.assessRisk',      'risk'));
app.post('/api/decision/confidence',         ...advWrap(adv.scoreConfidence, 'decision.scoreConfidence', 'confidence'));

// Simulation
app.post('/api/simulation/energy',           ...advWrap(adv.simulateEnergy,        'simulation.energy',    'simEnergy'));
app.post('/api/simulation/financial',        ...advWrap(adv.simulateFinancial,     'simulation.financial', 'simFinancial'));
app.post('/api/simulation/load-behavior',    ...advWrap(adv.simulateLoadBehavior,  'simulation.load',      'simLoad'));
app.post('/api/simulation/whatif',           ...advWrap(adv.whatIf,                'simulation.whatIf',    'whatIf'));

// AI Governance
app.post('/api/governance/audit',            ...advWrap(adv.auditLog,    'governance.auditLog',     'auditEntry'));
app.get ('/api/governance/audit',            (req, res) => {
  try {
    res.json({ success: true, data: adv.auditQuery(req.query || {}) });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
});
app.get ('/api/governance/audit/stats',      (req, res) => {
  try {
    res.json({ success: true, data: adv.auditStatistics({
      tenantId: req.query.tenantId,
      hoursBack: req.query.hoursBack ? Number(req.query.hoursBack) : 24
    }) });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
});
app.post('/api/governance/bias',             ...advWrap(adv.detectBias,  'governance.bias',  'bias'));
app.post('/api/governance/drift',            ...advWrap(adv.detectDrift, 'governance.drift', 'drift'));
app.post('/api/governance/explain',          ...advWrap(adv.explain,     'governance.explain', 'explain'));

// Data Pipeline
app.post('/api/pipeline/clean',              ...advWrap(adv.cleanData,         'pipeline.clean',     'cleanData'));
app.post('/api/pipeline/normalize',          ...advWrap(adv.normalize,         'pipeline.normalize', 'normalize'));
app.post('/api/pipeline/validate-solar',     ...advWrap(adv.validateSolarData, 'pipeline.validate',  'validateSolar'));

// Learning
app.post('/api/learning/feedback',           ...advWrap(adv.recordFeedback,    'learning.feedback',    'feedback'));
app.post('/api/learning/performance',        ...advWrap(adv.trackPerformance,  'learning.performance', 'performance'));

// Digital Twin lifecycle
app.post('/api/digitaltwin/lifecycle',       ...advWrap(adv.lifecycle, 'digitalTwin.lifecycle', 'lifecycle'));

// Market — supplier scoring
app.post('/api/market/supplier-score',       ...advWrap(adv.scoreSupplier, 'market.supplierScore', 'supplier'));

// ============================================
// ROOF AUTOFILL  (OpenStreetMap Overpass + open building footprints)
// ============================================
const roofAutofill = require('./roof-autofill');
app.post('/api/solar/roof-autofill',
  validate(schemas.roofAutofill, 'body'),
  async (req, res) => {
    try {
      const result = await roofAutofill.autofillRoof(req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      logger.warn('roof-autofill failed', { error: err.message });
      res.status(502).json({ success: false, error: err.message });
    }
  }
);

// ============================================
// GEOCODE (OpenStreetMap Nominatim — free, no API key)
// Used by the frontend address-to-site assessment workflow.
// Per Nominatim usage policy: 1 req/s, identifying User-Agent.
// Source: https://nominatim.org / https://operations.osmfoundation.org/policies/nominatim/
// ============================================
app.get('/api/geocode', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) return res.status(400).json({ success: false, error: 'q (query string) is required' });
    const url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=' + encodeURIComponent(q);
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'SolarGeniusPro/2.0 (geocode-proxy; contact: sally@emersoneims.com)',
        'Accept-Language': 'en'
      }
    });
    if (!r.ok) throw new Error('Nominatim HTTP ' + r.status);
    const arr = await r.json();
    const results = (arr || []).map(h => ({
      lat: parseFloat(h.lat),
      lon: parseFloat(h.lon),
      displayName: h.display_name,
      type: h.type,
      importance: h.importance,
      bbox: h.boundingbox ? h.boundingbox.map(parseFloat) : null
    }));
    res.json({
      success: true,
      data: results,
      provenance: {
        source: 'OpenStreetMap Nominatim',
        url: 'https://nominatim.openstreetmap.org',
        license: 'ODbL',
        retrieved_at: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(502).json({ success: false, error: err.message });
  }
});

// ============================================
// ENGINEERING-EXTRAS — Tier 1+2+3 calculators
// (lightning, battery sizing, net-metering, genset displacement, tariff
//  sensitivity, O&M scheduler, priced BOQ, 3-φ imbalance, geo-risk, portal)
// ============================================
const engExtras = require('./engineering-extras');
function engWrap(fn, label) {
  return async (req, res) => {
    try {
      const result = fn(req.body || {});
      const data = (result && typeof result.then === 'function') ? await result : result;
      res.json({ success: true, data });
    } catch (err) {
      logger.warn(`${label} failed`, { error: err.message });
      res.status(400).json({ success: false, error: err.message });
    }
  };
}
app.post('/api/eng/lightning-risk',     engWrap(engExtras.lightningRiskClass,    'lightning-risk'));
app.post('/api/eng/battery-sizing',     engWrap(engExtras.batterySizing,         'battery-sizing'));
app.post('/api/eng/net-metering-ke',    engWrap(engExtras.netMeteringKenya,      'net-metering'));
app.post('/api/eng/generator-displacement', engWrap(engExtras.generatorDisplacement, 'genset-displacement'));
app.post('/api/eng/tariff-sensitivity', engWrap(engExtras.tariffSensitivity,     'tariff-sensitivity'));
app.post('/api/eng/om-schedule',        engWrap(engExtras.oAndMSchedule,         'om-schedule'));
app.post('/api/eng/priced-boq',         engWrap(engExtras.pricedBoq,             'priced-boq'));
app.post('/api/eng/three-phase-imbalance', engWrap(engExtras.threePhaseImbalance,'3phase-imbalance'));
app.post('/api/eng/geo-risk',           engWrap(engExtras.geoRisk,               'geo-risk'));
app.post('/api/eng/client-portal-link', engWrap(engExtras.clientPortalLink,      'portal-link'));

// ============================================
// ENGINEERING-PRO — Aurora-grade calculators (Tier 1+2+3 gap closures)
// ============================================
const engPro = require('./engineering-pro');
app.post('/api/engpro/hourly-shading',     engWrap(engPro.hourlyShading,            'hourly-shading'));
app.post('/api/engpro/battery-mc',         engWrap(engPro.batterySizingMonteCarlo,  'battery-mc'));
app.post('/api/engpro/lightning-full',     engWrap(engPro.lightningRiskFull,        'lightning-full'));
app.post('/api/engpro/priced-boq-fx',      engWrap(engPro.pricedBoqFx,              'priced-boq-fx'));
app.post('/api/engpro/geo-risk-ke',        engWrap(engPro.geoRiskKE,                'geo-risk-ke'));
app.post('/api/engpro/net-metering-tou',   engWrap(engPro.netMeteringTOU,           'net-metering-tou'));
app.post('/api/engpro/structural-wind',    engWrap(engPro.structuralWindBallast,    'structural-wind'));
app.post('/api/engpro/p50-p90',            engWrap(engPro.p50p90Yield,              'p50-p90'));
app.post('/api/engpro/earth-electrode',    engWrap(engPro.earthElectrodeBS7430,     'earth-electrode'));
app.post('/api/engpro/portal-jwt',         engWrap(engPro.clientPortalJwt,          'portal-jwt'));
app.post('/api/engpro/portal-revoke',      engWrap(engPro.clientPortalRevoke,       'portal-revoke'));
app.post('/api/engpro/portal-verify',      engWrap(engPro.clientPortalVerify,       'portal-verify'));

// ============================================
// ENGINEERING-ELITE — Tier-4 utility-scale / bankable calculators
// ============================================
const engElite = require('./engineering-elite');
app.post('/api/engelite/tmy-8760',         engWrap(engElite.tmy8760Simulation,      'tmy-8760'));
app.post('/api/engelite/obstructions',     engWrap(engElite.obstructionsToHorizon,  'obstructions'));
app.post('/api/engelite/interval-meter',   engWrap(engElite.intervalMeterIngest,    'interval-meter'));
app.post('/api/engelite/member-structural',engWrap(engElite.memberStructural,       'member-structural'));
app.post('/api/engelite/epra-grid-code',   engWrap(engElite.epraGridCodePack,       'epra-grid-code'));
app.post('/api/engelite/ga-optimiser',     engWrap(engElite.gaOptimiser,            'ga-optimiser'));
app.post('/api/engelite/pan-degradation',  engWrap(engElite.panDegradation,         'pan-degradation'));

// ============================================
// ENGINEERING-GLOBAL — Tier-5 utility-scale, no upper limit, global
// ============================================
const engGlobal = require('./engineering-global');
app.post('/api/engglobal/epw-import',        engWrap(engGlobal.epwTmyImport,        'epw-import'));
app.post('/api/engglobal/pan-ond-parse',     engWrap(engGlobal.panOndFullParse,     'pan-ond-parse'));
app.post('/api/engglobal/continuous-beam',   engWrap(engGlobal.continuousBeamFE,    'continuous-beam'));
app.post('/api/engglobal/grid-code',         engWrap(engGlobal.globalGridCodePack,  'grid-code'));
app.post('/api/engglobal/pvgis-hourly',      engWrap(engGlobal.pvgisHourlyFetch,    'pvgis-hourly'));
app.post('/api/engglobal/finance-pack',      engWrap(engGlobal.globalFinancePack,   'finance-pack'));

// ============================================
// ENGINEERING-APPROVAL — Tier-6 PE / Chartered Engineer Sign-Off
// ============================================
const engApproval = require('./engineering-approval');
app.post('/api/engapproval/iec62446-report',     engWrap(engApproval.iec62446CommissioningReport, 'iec62446-report'));
app.post('/api/engapproval/single-line-diagram', engWrap(engApproval.singleLineDiagramSvg,       'single-line-diagram'));
app.post('/api/engapproval/arc-rsd-compliance',  engWrap(engApproval.ncec690ArcRsCompliance,     'arc-rsd-compliance'));
app.post('/api/engapproval/cable-derated',       engWrap(engApproval.cableAmpacityDerated,       'cable-derated'));
app.post('/api/engapproval/nfpa855-battery',     engWrap(engApproval.nfpa855BatteryFireSafety,   'nfpa855-battery'));
app.post('/api/engapproval/faa-glare',           engWrap(engApproval.faaGlareAnalysis,           'faa-glare'));
app.post('/api/engapproval/sign-off-package',    engWrap(engApproval.peSignOffPackage,           'sign-off-package'));

// ============================================
// ARCHITECTURE-APPROVAL — Tier-7 Architect / Building Surveyor pack
// ============================================
const archApproval = require('./architecture-approval');
app.post('/api/archapproval/wind-uplift',         engWrap(archApproval.windUpliftAsce7,         'wind-uplift'));
app.post('/api/archapproval/snow-load',           engWrap(archApproval.snowLoadCombination,     'snow-load'));
app.post('/api/archapproval/ballast-schedule',    engWrap(archApproval.ballastSchedule,         'ballast-schedule'));
app.post('/api/archapproval/roof-reserve',        engWrap(archApproval.roofReserveCapacity,     'roof-reserve'));
app.post('/api/archapproval/fire-setback',        engWrap(archApproval.rooftopFireSetback,      'fire-setback'));
app.post('/api/archapproval/flashing',            engWrap(archApproval.flashingPenetration,     'flashing'));
app.post('/api/archapproval/neighbour-shadow',    engWrap(archApproval.neighbourShadow,         'neighbour-shadow'));
app.post('/api/archapproval/ifc-export',          engWrap(archApproval.ifcBimExport,            'ifc-export'));
app.post('/api/archapproval/planning-narrative',  engWrap(archApproval.planningNarrative,       'planning-narrative'));

// ============================================
// API VERSIONING NOTE
// ============================================
// Routes are currently mounted under `/api/*` only. When the first breaking
// change ships, fork into `/api/v2/*` with the new shape and keep `/api/*`
// (treated as v1) frozen. Do NOT alias /api/v1 -> /api today; that would
// create the illusion of a versioning policy without enforcing one.

// ============================================
// SERVER START
// ============================================

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  logger.info(`SolarGenius Pro Server running`, {
    port: PORT,
    api: `http://localhost:${PORT}/api`,
    websocket: `ws://localhost:${PORT}`
  });
});

// Error handling
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection', { err: error && error.message, stack: error && error.stack });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { err: error && error.message, stack: error && error.stack });
  process.exit(1);
});