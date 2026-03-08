export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8 text-sm text-gray-500 text-center">
        &copy; {new Date().getFullYear()} biza. All rights reserved.
      </div>
    </footer>
  )
}
