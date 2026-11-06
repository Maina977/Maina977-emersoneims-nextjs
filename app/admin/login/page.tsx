import type { Metadata } from 'next';
import AdminLoginForm from './AdminLoginForm';

export const metadata: Metadata = {
  title: 'Staff sign-in',
  robots: { index: false, follow: false },
};

/** The one /admin page reachable without a session (middleware isAdminPath). */
export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-semibold text-white">Staff sign-in</h1>
      <p className="mt-2 text-sm text-white/60">For the EmersonEIMS team: lead pipeline and analytics.</p>
      <AdminLoginForm />
    </main>
  );
}
