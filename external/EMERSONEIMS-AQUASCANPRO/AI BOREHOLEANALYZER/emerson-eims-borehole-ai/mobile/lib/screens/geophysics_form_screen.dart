import 'package:flutter/material.dart';
import '../services/api_service.dart';

/// Form screen for entering field geophysical survey data.
/// Supports all 6 survey methods: ERT, EM/TDEM, Seismic, GPR, Magnetic/Gravity, NMR.
class GeophysicsFormScreen extends StatefulWidget {
  final double latitude;
  final double longitude;

  const GeophysicsFormScreen({
    super.key,
    required this.latitude,
    required this.longitude,
  });

  @override
  State<GeophysicsFormScreen> createState() => _GeophysicsFormScreenState();
}

class _GeophysicsFormScreenState extends State<GeophysicsFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final ApiService _apiService = ApiService();
  bool _isSubmitting = false;

  // ERT
  bool _hasErt = false;
  final _ertResistivityCtrl = TextEditingController();
  final _ertDepthCtrl = TextEditingController();
  final _ertLayersCtrl = TextEditingController();

  // Seismic
  bool _hasSeismic = false;
  final _seismicVelocityCtrl = TextEditingController();
  final _seismicDepthCtrl = TextEditingController();
  String _seismicMethod = 'Refraction';

  // GPR
  bool _hasGpr = false;
  final _gprWaterTableCtrl = TextEditingController();
  final _gprPenetrationCtrl = TextEditingController();
  final _gprFreqCtrl = TextEditingController(text: '100');

  // EM / TDEM
  bool _hasEm = false;
  final _emConductivityCtrl = TextEditingController();
  final _emDepthCtrl = TextEditingController();

  // Magnetic / Gravity
  bool _hasMagnetic = false;
  final _magAnomalyCtrl = TextEditingController();
  final _magBasementDepthCtrl = TextEditingController();
  bool _hasFaultDetected = false;

  // NMR
  bool _hasNmr = false;
  final _nmrWaterContentCtrl = TextEditingController();
  final _nmrT2Ctrl = TextEditingController();
  final _nmrFreeWaterDepthCtrl = TextEditingController();
  final _nmrKCtrl = TextEditingController();

  @override
  void dispose() {
    _ertResistivityCtrl.dispose();
    _ertDepthCtrl.dispose();
    _ertLayersCtrl.dispose();
    _seismicVelocityCtrl.dispose();
    _seismicDepthCtrl.dispose();
    _gprWaterTableCtrl.dispose();
    _gprPenetrationCtrl.dispose();
    _gprFreqCtrl.dispose();
    _emConductivityCtrl.dispose();
    _emDepthCtrl.dispose();
    _magAnomalyCtrl.dispose();
    _magBasementDepthCtrl.dispose();
    _nmrWaterContentCtrl.dispose();
    _nmrT2Ctrl.dispose();
    _nmrFreeWaterDepthCtrl.dispose();
    _nmrKCtrl.dispose();
    super.dispose();
  }

  Map<String, dynamic> _buildPayload() {
    final payload = <String, dynamic>{
      'latitude': widget.latitude,
      'longitude': widget.longitude,
      'surveys': <String>[],
    };

    if (_hasErt) {
      (payload['surveys'] as List).add('ERT');
      payload['ert'] = {
        'resistivity_ohm_m': double.tryParse(_ertResistivityCtrl.text) ?? 0,
        'investigation_depth_m': double.tryParse(_ertDepthCtrl.text) ?? 0,
        'num_layers': int.tryParse(_ertLayersCtrl.text) ?? 0,
      };
    }

    if (_hasSeismic) {
      (payload['surveys'] as List).add('Seismic');
      payload['seismic'] = {
        'velocity_m_s': double.tryParse(_seismicVelocityCtrl.text) ?? 0,
        'bedrock_depth_m': double.tryParse(_seismicDepthCtrl.text) ?? 0,
        'method': _seismicMethod,
      };
    }

    if (_hasGpr) {
      (payload['surveys'] as List).add('GPR');
      payload['gpr'] = {
        'water_table_depth_m': double.tryParse(_gprWaterTableCtrl.text) ?? 0,
        'max_penetration_m': double.tryParse(_gprPenetrationCtrl.text) ?? 0,
        'antenna_freq_mhz': double.tryParse(_gprFreqCtrl.text) ?? 100,
      };
    }

    if (_hasEm) {
      (payload['surveys'] as List).add('EM');
      payload['em'] = {
        'conductivity_mS_m': double.tryParse(_emConductivityCtrl.text) ?? 0,
        'investigation_depth_m': double.tryParse(_emDepthCtrl.text) ?? 0,
      };
    }

    if (_hasMagnetic) {
      (payload['surveys'] as List).add('Magnetic');
      payload['magnetic'] = {
        'anomaly_nT': double.tryParse(_magAnomalyCtrl.text) ?? 0,
        'basement_depth_m': double.tryParse(_magBasementDepthCtrl.text) ?? 0,
        'fault_detected': _hasFaultDetected,
      };
    }

    if (_hasNmr) {
      (payload['surveys'] as List).add('NMR');
      payload['nmr'] = {
        'water_content_pct': double.tryParse(_nmrWaterContentCtrl.text) ?? 0,
        't2_mean_ms': double.tryParse(_nmrT2Ctrl.text) ?? 0,
        'free_water_depth_m': double.tryParse(_nmrFreeWaterDepthCtrl.text) ?? 0,
        'hydraulic_conductivity_m_day': double.tryParse(_nmrKCtrl.text) ?? 0,
      };
    }

    return payload;
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (!_hasErt && !_hasSeismic && !_hasGpr && !_hasEm && !_hasMagnetic && !_hasNmr) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Enable at least one survey method')),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    try {
      final payload = _buildPayload();
      await _apiService.submitGeophysicsData(payload);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Geophysics data submitted successfully')),
        );
        Navigator.pop(context, payload);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Field Geophysics Data'),
        backgroundColor: Colors.green,
        foregroundColor: Colors.white,
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text(
              'Location: ${widget.latitude.toStringAsFixed(4)}, ${widget.longitude.toStringAsFixed(4)}',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 8),
            const Text(
              'Enter field geophysical survey results to improve borehole analysis accuracy.',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 16),

            // ERT Section
            _buildSurveySection(
              title: 'Electrical Resistivity Tomography (ERT)',
              icon: Icons.electric_bolt,
              enabled: _hasErt,
              onToggle: (v) => setState(() => _hasErt = v),
              children: [
                _numField(_ertResistivityCtrl, 'Avg Resistivity (Ω·m)'),
                _numField(_ertDepthCtrl, 'Investigation Depth (m)'),
                _numField(_ertLayersCtrl, 'Number of Layers'),
              ],
            ),

            // Seismic Section
            _buildSurveySection(
              title: 'Seismic Survey',
              icon: Icons.vibration,
              enabled: _hasSeismic,
              onToggle: (v) => setState(() => _hasSeismic = v),
              children: [
                DropdownButtonFormField<String>(
                  value: _seismicMethod,
                  items: const [
                    DropdownMenuItem(value: 'Refraction', child: Text('Refraction')),
                    DropdownMenuItem(value: 'MASW', child: Text('MASW')),
                    DropdownMenuItem(value: 'Reflection', child: Text('Reflection')),
                  ],
                  onChanged: (v) => setState(() => _seismicMethod = v ?? 'Refraction'),
                  decoration: const InputDecoration(labelText: 'Method'),
                ),
                _numField(_seismicVelocityCtrl, 'P-wave Velocity (m/s)'),
                _numField(_seismicDepthCtrl, 'Bedrock Depth (m)'),
              ],
            ),

            // GPR Section
            _buildSurveySection(
              title: 'Ground Penetrating Radar (GPR)',
              icon: Icons.radar,
              enabled: _hasGpr,
              onToggle: (v) => setState(() => _hasGpr = v),
              children: [
                _numField(_gprWaterTableCtrl, 'Water Table Depth (m)'),
                _numField(_gprPenetrationCtrl, 'Max Penetration (m)'),
                _numField(_gprFreqCtrl, 'Antenna Frequency (MHz)'),
              ],
            ),

            // EM / TDEM Section
            _buildSurveySection(
              title: 'EM / TDEM Survey',
              icon: Icons.waves,
              enabled: _hasEm,
              onToggle: (v) => setState(() => _hasEm = v),
              children: [
                _numField(_emConductivityCtrl, 'Conductivity (mS/m)'),
                _numField(_emDepthCtrl, 'Investigation Depth (m)'),
              ],
            ),

            // Magnetic / Gravity Section
            _buildSurveySection(
              title: 'Magnetic / Gravity Survey',
              icon: Icons.explore,
              enabled: _hasMagnetic,
              onToggle: (v) => setState(() => _hasMagnetic = v),
              children: [
                _numField(_magAnomalyCtrl, 'Max Anomaly (nT)'),
                _numField(_magBasementDepthCtrl, 'Basement Depth (m)'),
                SwitchListTile(
                  title: const Text('Fault Detected'),
                  value: _hasFaultDetected,
                  onChanged: _hasMagnetic ? (v) => setState(() => _hasFaultDetected = v) : null,
                ),
              ],
            ),

            // NMR Section
            _buildSurveySection(
              title: 'Surface NMR (SNMR)',
              icon: Icons.water_drop,
              enabled: _hasNmr,
              onToggle: (v) => setState(() => _hasNmr = v),
              children: [
                _numField(_nmrWaterContentCtrl, 'Water Content (%)'),
                _numField(_nmrT2Ctrl, 'Mean T2 (ms)'),
                _numField(_nmrFreeWaterDepthCtrl, 'Free Water Depth (m)'),
                _numField(_nmrKCtrl, 'Hydraulic K (m/day)'),
              ],
            ),

            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isSubmitting ? null : _submit,
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 50),
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
              ),
              child: _isSubmitting
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  : const Text('Submit Geophysics Data', style: TextStyle(fontSize: 16)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSurveySection({
    required String title,
    required IconData icon,
    required bool enabled,
    required ValueChanged<bool> onToggle,
    required List<Widget> children,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Column(
        children: [
          SwitchListTile(
            secondary: Icon(icon, color: enabled ? Colors.green : Colors.grey),
            title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
            value: enabled,
            onChanged: onToggle,
          ),
          if (enabled)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: Column(children: children),
            ),
        ],
      ),
    );
  }

  Widget _numField(TextEditingController ctrl, String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: TextFormField(
        controller: ctrl,
        keyboardType: const TextInputType.numberWithOptions(decimal: true),
        decoration: InputDecoration(
          labelText: label,
          border: const OutlineInputBorder(),
          isDense: true,
        ),
      ),
    );
  }
}
