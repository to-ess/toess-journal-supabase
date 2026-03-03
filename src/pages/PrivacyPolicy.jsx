import { Link } from "react-router-dom";
import { Lock, UserCheck, Database, EyeOff, ShieldCheck, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="bg-white text-gray-900">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-sm mb-8 text-blue-200">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <span>Privacy Policy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Privacy Policy</h1>
          <p className="text-blue-200 text-lg max-w-2xl leading-relaxed">
            ToESS is committed to protecting the privacy of its contributors and users. Learn how
            we collect, use, and safeguard your personal information.
          </p>

          <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-blue-700">
            {[
              { label: "Data Sharing", value: "No Third Parties" },
              { label: "Storage", value: "Secure & Encrypted" },
              { label: "Access", value: "Authorized Only" },
              { label: "Your Rights", value: "Access & Correction" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-white font-bold text-lg">{s.value}</div>
                <div className="text-blue-300 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-700">
            {["Data Protection", "No Third-Party Sharing", "Secure Storage", "User Rights Respected"].map((label) => (
              <div key={label} className="flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Intro */}
      <section className="py-16 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Commitment to Privacy</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            ToESS is committed to protecting the privacy of its contributors and users. Personal
            information collected during the submission process, registration, or other interactions
            is used solely for the journal's administrative and communication purposes.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            We do not share this information with third parties without explicit consent, unless
            required by law. All data is stored securely, and access is restricted to authorized
            personnel only.
          </p>
        </div>
      </section>

      {/* Policy Details */}
      <section className="py-16 bg-gray-50 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Privacy Principles</h2>

          <div className="flex flex-col gap-5">
            {[
              {
                icon: Database,
                title: "Data Collection",
                content:
                  "Personal information is collected only when you register on the website, submit a manuscript, or interact with ToESS in an official capacity. This includes your name, email address, institutional affiliation, and related professional details.",
              },
              {
                icon: UserCheck,
                title: "Purpose of Use",
                content:
                  "Information collected is used exclusively for journal-related administrative purposes including manuscript processing, peer review coordination, author communications, and publication notifications.",
              },
              {
                icon: EyeOff,
                title: "No Third-Party Sharing",
                content:
                  "ToESS does not sell, trade, or share your personal information with third parties without your explicit consent. Disclosure may occur only when required by applicable law or regulation.",
              },
              {
                icon: Lock,
                title: "Secure Storage",
                content:
                  "All personal data is stored securely using appropriate technical and organizational measures. Access to personal information is strictly restricted to authorized ToESS personnel who require it for legitimate journal operations.",
              },
              {
                icon: ShieldCheck,
                title: "Your Rights",
                content:
                  "Subscribers and contributors have the right to access their personal information held by ToESS and may request corrections or updates if the information is inaccurate or incomplete.",
              },
              {
                icon: Mail,
                title: "Contact for Privacy Concerns",
                content:
                  "For any questions, concerns, or requests related to your personal data, please contact our editorial office directly. We are committed to addressing all privacy-related inquiries promptly.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white border-l-4 border-indigo-600 shadow-sm hover:shadow-md transition p-6 flex gap-5 items-start"
                >
                  <div className="flex-shrink-0 w-11 h-11 bg-indigo-50 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Related Policies</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Disclaimer</h3>
              <p className="text-sm text-gray-600 mb-4">
                Understand the scope of liability and editorial independence of content published in ToESS.
              </p>
              <Link to="/disclaimer" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition">
                Read Disclaimer →
              </Link>
            </div>
            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Publication Policy</h3>
              <p className="text-sm text-gray-600 mb-4">
                Review our editorial standards, peer review process, and authorship guidelines.
              </p>
              <Link to="/publication-policy" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition">
                Read Publication Policy →
              </Link>
            </div>
            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
              <p className="text-sm text-gray-600 mb-4">
                For privacy-related queries or data access requests, contact the editorial office.
              </p>
              <Link to="/contact" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition">
                Contact Editorial Office →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Questions About Your Data?</h2>
          <p className="text-xl mb-8 text-blue-100">
            If you would like to access, update, or request deletion of your personal information,
            our editorial office is here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:editor@toess.org"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-blue-50 transition shadow-lg text-lg"
            >
              Contact Editorial Office
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <Link
              to="/disclaimer"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-700 transition text-lg"
            >
              View Disclaimer
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}