export default function TestSimple() {
  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>Simple Test Page</h1>
      <p>If you see this, the Next.js server is working correctly.</p>
      <p>Time: {new Date().toISOString()}</p>
    </div>
  );
}
