export default function DesktopFooter() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <span className="text-sm text-text-secondary">
          © {new Date().getFullYear()} PinShare Desktop
        </span>
        <nav className="flex gap-4 text-sm text-text-secondary">
          <a href="#" className="hover:text-primary">About</a>
          <a href="#" className="hover:text-primary">Help</a>
          <a href="#" className="hover:text-primary">Terms</a>
          <a href="#" className="hover:text-primary">Privacy</a>
        </nav>
      </div>
    </footer>
  );
}