'use client';

export default function Error({ error, reset }: any) {
  console.error(error);
  return (
    <div style={{ padding: 40 }}>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}