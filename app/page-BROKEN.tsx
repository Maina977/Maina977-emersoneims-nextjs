'use client';

export default function HomePage() {
  return (
    <div style={{ padding: '40px', minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Emerson EiMS</h1>
      <p style={{ fontSize: '24px', marginBottom: '40px' }}>Reliable Power. Without Limits.</p>
      
      <div style={{ maxWidth: '800px' }}>
        <h2 style={{ fontSize: '32px', marginTop: '40px', marginBottom: '20px' }}>Our Services</h2>
        <ul style={{ fontSize: '18px', lineHeight: '2' }}>
          <li>Diesel Generators - Sales, Installation & Maintenance</li>
          <li>Solar Energy Solutions</li>
          <li>UPS Systems</li>
          <li>High Voltage Electrical Systems</li>
          <li>HVAC Systems</li>
          <li>Water Systems</li>
        </ul>
        
        <h2 style={{ fontSize: '32px', marginTop: '60px', marginBottom: '20px' }}>Contact Us</h2>
        <p style={{ fontSize: '18px', lineHeight: '1.8' }}>
          📧 Email: info@emersoneims.com<br />
          📞 Phone: +254 XXX XXX XXX<br />
          📍 Location: Nairobi, Kenya
        </p>
        
        <a 
          href="/contact" 
          style={{
            display: 'inline-block',
            marginTop: '40px',
            padding: '16px 32px',
            background: '#d4af37',
            color: '#000',
            fontSize: '18px',
            fontWeight: 'bold',
            textDecoration: 'none',
            borderRadius: '8px'
          }}
        >
          Get Quote
        </a>
      </div>
    </div>
  );
}
