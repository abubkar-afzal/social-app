export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-text mb-4">About</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-primary">Our Story</a></li>
              <li><a href="#" className="hover:text-primary">Careers</a></li>
              <li><a href="#" className="hover:text-primary">Press</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-primary">Blog</a></li>
              <li><a href="#" className="hover:text-primary">Help Center</a></li>
              <li><a href="#" className="hover:text-primary">Guidelines</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-primary">Terms</a></li>
              <li><a href="#" className="hover:text-primary">Privacy</a></li>
              <li><a href="#" className="hover:text-primary">Cookies</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text mb-4">Follow Us</h3>
            <div className="flex space-x-4 text-text-secondary">
              {/* Social icons can be added here */}
              <a href="#" className="hover:text-primary" aria-label="Twitter">Twitter</a>
              <a href="#" className="hover:text-primary" aria-label="Instagram">Instagram</a>
              <a href="#" className="hover:text-primary" aria-label="YouTube">YouTube</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-text-secondary">
          © {new Date().getFullYear()} PinShare. All rights reserved.
        </div>
      </div>
    </footer>
  );
}