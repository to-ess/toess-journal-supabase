export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">

        <div>
          <h3 className="text-white font-semibold mb-3">ToESS</h3>
          <p>
            Transactions on Evolutionary Smart Systems is a peer-reviewed
            international journal publishing high-quality research.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Journal</h4>
          <ul className="space-y-2">
            <li>About</li>
            <li>Scope</li>
            <li>Editorial Board</li>
            <li>Archives</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Authors</h4>
          <ul className="space-y-2">
            <li>Submit Manuscript</li>
            <li>Author Guidelines</li>
            <li>Publication Ethics</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <p>Email: contact@toess.org</p>
          <p>ISSN: XXXX-XXXX</p>
        </div>

      </div>

      <div className="text-center py-4 border-t border-gray-700">
        © {new Date().getFullYear()} ToESS. All rights reserved.
      </div>
    </footer>
  );
}
