import { Link } from "react-router-dom";
import { AlertCircle, FileText, Shield, BookOpen } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="bg-white text-gray-900">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-sm mb-8 text-blue-200">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <span>Disclaimer</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Disclaimer</h1>
          <p className="text-blue-200 text-lg max-w-2xl leading-relaxed">
            Important information regarding the accuracy, liability, and editorial independence of
            content published in Transactions on Evolutionary Smart Systems.
          </p>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-700">
            {["Peer-Reviewed Journal", "International Publication", "Open Access", "Editorial Independence"].map((label) => (
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

      {/* Main Content */}
      <section className="py-16 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Disclaimer Statement</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            The Transactions on Evolutionary Smart Systems (ToESS) makes every effort to ensure the
            accuracy and reliability of the information published in its journal. However, the content,
            opinions, and findings expressed in the articles are those of the respective authors and do
            not necessarily reflect the views of ToESS or its affiliates. The journal is not liable for
            any errors or consequences arising from the use of the information contained in it.
          </p>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-16 bg-gray-50 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Key Points</h2>

          <div className="flex flex-col gap-5">
            {[
              {
                icon: BookOpen,
                title: "Author Responsibility",
                content:
                  "All content, opinions, conclusions, and findings published in ToESS are solely those of the respective authors. Authors are fully responsible for the accuracy and integrity of their submitted work.",
              },
              {
                icon: AlertCircle,
                title: "Editorial Independence",
                content:
                  "The views expressed in any published article do not necessarily represent the positions, policies, or opinions of ToESS, its editorial board, or its affiliated organizations.",
              },
              {
                icon: Shield,
                title: "Limitation of Liability",
                content:
                  "ToESS shall not be held liable for any errors, omissions, or consequences arising from the use or application of information contained in any published article. Readers are advised to independently verify any information before acting upon it.",
              },
              {
                icon: FileText,
                title: "Accuracy & Reliability",
                content:
                  "While ToESS takes reasonable steps to ensure the accuracy of published material through its peer review process, it does not warrant the completeness, correctness, or fitness for any particular purpose of any information published.",
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

      {/* Related Policies */}
      <section className="py-16 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Related Policies</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Privacy Policy</h3>
              <p className="text-sm text-gray-600 mb-4">
                Learn how ToESS collects, uses, and protects your personal information.
              </p>
              <Link to="/privacy-policy" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition">
                Read Privacy Policy →
              </Link>
            </div>
            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Publication Policy</h3>
              <p className="text-sm text-gray-600 mb-4">
                Review our editorial standards, peer review process, and ethical guidelines.
              </p>
              <Link to="/publication-policy" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition">
                Read Publication Policy →
              </Link>
            </div>
            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
              <p className="text-sm text-gray-600 mb-4">
                For any concerns or queries related to published content, reach our editorial office.
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
          <h2 className="text-4xl font-bold mb-6">Have a Concern?</h2>
          <p className="text-xl mb-8 text-blue-100">
            If you have identified any inaccuracy or issue with published content, please contact
            our editorial office and we will address it promptly.
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
              to="/publication-policy"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-700 transition text-lg"
            >
              Publication Policy
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}