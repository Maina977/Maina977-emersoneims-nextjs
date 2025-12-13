export default function Header() {
    return (
      <header className="w-full bg-black text-white flex items-center justify-between px-8 py-4 border-b border-gray-800 shadow-lg">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <img
            src="https://www.emersoneims.com/wp-content/uploads/2025/10/cropped-Emerson-EIMS-Logo-and-Tagline-PNG-Picsart-BackgroundRemover.png"
            alt="EmersonEIMS Logo"
            className="h-12 w-auto drop-shadow-glow"
          />
          <span className="text-yellow-400 font-bold tracking-widest text-lg">
            Reliable Power. Without Limits.
          </span>
        </div>
  
        {/* Navigation */}
        <nav className="flex space-x-8 text-sm uppercase font-semibold">
          <a href="/" className="hover:text-yellow-400 transition">Home</a>
          <a href="/diagnostics" className="hover:text-yellow-400 transition">Diagnostics Hub</a>
          <a href="/solutions" className="hover:text-yellow-400 transition">Solutions</a>
          <a href="/contact" className="hover:text-yellow-400 transition">Contact</a>
        </nav>
      </header>
    );
  }
  