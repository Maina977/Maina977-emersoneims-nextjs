import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans">
      {/* Futuristic Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow px-6 md:px-12 py-8">
        {children}
      </main>

      {/* Premium Footer */}
      <Footer />
    </div>
  );
}
