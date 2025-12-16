export default function Footer() {
    return (
      <footer className="w-full bg-gradient-to-r from-black via-gray-900 to-black text-white px-8 py-10 mt-12 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Logo + Tagline */}
          <div className="flex flex-col items-start space-y-2">
            <img
              src="https://www.emersoneims.com/wp-content/uploads/2025/10/cropped-Emerson-EIMS-Logo-and-Tagline-PNG-Picsart-BackgroundRemover.png"
              alt="EmersonEIMS Logo"
              className="h-14 w-auto drop-shadow-glow"
            />
            <span className="text-yellow-400 font-bold tracking-widest">
              Reliable Power. Without Limits.
            </span>
          </div>
  
          {/* Contact Info */}
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-yellow-400">Contact Us</p>
            <p>Tel: 0768860655 / 0782914717</p>
            <p>P.O. Box 387-00521, Old North Airport Road, Nairobi</p>
            <p>Email: info@emersoneims.com / emersoneimservices@gmail.com</p>
            <p>Website: <a href="https://www.emersoneims.com" className="hover:text-yellow-400">www.emersoneims.com</a></p>
          </div>
  
          {/* CTA */}
          <div className="flex flex-col items-start space-y-4">
            <p className="font-semibold text-yellow-400">Partner With Us</p>
            <p>World-class solar, power, and engineering solutions tailored to your needs.</p>
            <a
              href="/contact"
              className="px-4 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 transition"
            >
              Schedule a Consultation →
            </a>
          </div>
        </div>
  
        {/* Footer Bottom */}
        <div className="mt-8 text-center text-xs text-gray-400">
          © 2025 EmersonEIMS. All Rights Reserved.
        </div>
      </footer>
    );
  }
  