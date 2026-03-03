import { Link } from "react-router-dom";
import {
  FileText,
  Users,
  Send,
  Eye,
  Copyright,
  ShieldAlert,
  RefreshCw,
  AlertTriangle,
  Scale,
  UserX,
  Wrench,
  Mail,
} from "lucide-react";

const sections = [
  {
    id: "scope",
    icon: FileText,
    title: "Scope of Services",
    content: (
      <>
        <p className="text-gray-600 leading-relaxed mb-3">
          ToESS provides the following services for academic, research, and educational purposes only:
        </p>
        <ul className="space-y-2">
          {[
            "Online manuscript submission",
            "Peer-review management",
            "Editorial evaluation",
            "Publication of scholarly articles",
            "Access to published research content",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-gray-600 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "accounts",
    icon: Users,
    title: "User Accounts",
    content: (
      <>
        <p className="text-gray-600 leading-relaxed mb-3">
          To access certain features, users may be required to create an account. By doing so, users agree to:
        </p>
        <ul className="space-y-2">
          {[
            "Provide accurate and complete information",
            "Maintain confidentiality of login credentials",
            "Refrain from creating multiple or fraudulent accounts",
            "Notify ToESS of any unauthorized account use",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-gray-600 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-gray-600 leading-relaxed mt-3">
          ToESS reserves the right to suspend or terminate accounts that violate these Terms.
        </p>
      </>
    ),
  },
  {
    id: "submission",
    icon: Send,
    title: "Manuscript Submission & Author Responsibilities",
    content: (
      <>
        <p className="text-gray-600 leading-relaxed mb-3">
          By submitting a manuscript, authors confirm that:
        </p>
        <ul className="space-y-2 mb-3">
          {[
            "The work is original and has not been published elsewhere",
            "The manuscript is not under consideration by another journal",
            "All co-authors have approved the submission",
            "The research complies with recognized ethical standards",
            "Proper citations and acknowledgments are provided",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-gray-600 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-gray-600 leading-relaxed">
          Plagiarism, data fabrication, falsification, or unethical research practices are strictly prohibited.
          ToESS reserves the right to reject, retract, or remove any manuscript found in violation of ethical standards.
        </p>
      </>
    ),
  },
  {
    id: "peer-review",
    icon: Eye,
    title: "Peer Review Process",
    content: (
      <>
        <p className="text-gray-600 leading-relaxed mb-3">
          ToESS follows a structured double-blind peer-review process. Editors exercise full discretion regarding:
        </p>
        <ul className="space-y-2 mb-3">
          {[
            "Selection of reviewers",
            "Acceptance or rejection decisions",
            "Requests for revision",
            "Retraction of published articles when necessary",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-gray-600 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-gray-600 leading-relaxed">All editorial decisions are final.</p>
      </>
    ),
  },
  {
    id: "copyright",
    icon: Copyright,
    title: "Copyright and Licensing",
    content: (
      <>
        <p className="text-gray-600 leading-relaxed mb-3">
          Upon acceptance, authors transfer copyright to ToESS. All published articles are distributed
          under the <span className="font-medium text-indigo-600">Creative Commons Attribution 4.0 International License (CC BY 4.0)</span>. Under this license:
        </p>
        <ul className="space-y-2 mb-3">
          {[
            "Users may freely share and adapt the material",
            "Both commercial and non-commercial use is permitted",
            "Proper attribution to authors and ToESS is required",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-gray-600 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-gray-600 leading-relaxed">The license is irrevocable once applied.</p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    icon: ShieldAlert,
    title: "Acceptable Use of the Platform",
    content: (
      <>
        <p className="text-gray-600 leading-relaxed mb-3">Users agree NOT to:</p>
        <ul className="space-y-2 mb-3">
          {[
            "Attempt unauthorized access to the system",
            "Interfere with website functionality or infrastructure",
            "Upload malicious software or harmful content",
            "Misuse reviewer or editorial privileges",
            "Harvest data without permission",
            "Misrepresent institutional affiliation or credentials",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-gray-600 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-gray-600 leading-relaxed">
          Violation may result in immediate account termination and possible legal action.
        </p>
      </>
    ),
  },
  {
    id: "retractions",
    icon: RefreshCw,
    title: "Retractions and Corrections",
    content: (
      <p className="text-gray-600 leading-relaxed">
        ToESS reserves the right to issue corrections, expressions of concern, or retractions for
        content that violates ethical standards or contains significant errors. Policies may be
        updated periodically in line with publishing best practices.
      </p>
    ),
  },
  {
    id: "disclaimers",
    icon: AlertTriangle,
    title: "Disclaimer of Warranties",
    content: (
      <>
        <p className="text-gray-600 leading-relaxed mb-3">
          ToESS provides all content "as is" without warranties of any kind. The journal does not guarantee:
        </p>
        <ul className="space-y-2">
          {[
            "Accuracy or completeness of research findings",
            "Absence of errors in published articles",
            "Fitness for any particular purpose",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-gray-600 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-gray-600 leading-relaxed mt-3">
          Opinions expressed in articles are solely those of the respective authors.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    icon: Scale,
    title: "Limitation of Liability",
    content: (
      <>
        <p className="text-gray-600 leading-relaxed mb-3">ToESS shall not be liable for:</p>
        <ul className="space-y-2">
          {[
            "Misuse or misapplication of published research",
            "Errors in interpretation of published material",
            "Third-party use of published content",
            "Technical interruptions or system downtime",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-gray-600 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "indemnification",
    icon: UserX,
    title: "Indemnification",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Users agree to indemnify and hold harmless ToESS, its editors, and staff from any claims,
        damages, or liabilities arising from the submission of infringing content, violation of
        these Terms, or breach of intellectual property rights.
      </p>
    ),
  },
  {
    id: "modifications",
    icon: Wrench,
    title: "Modifications to Terms",
    content: (
      <p className="text-gray-600 leading-relaxed">
        ToESS reserves the right to update or modify these Terms at any time without prior notice.
        Continued use of the Platform after any changes constitutes acceptance of the revised Terms.
        Users are encouraged to review this page periodically.
      </p>
    ),
  },
];

const tocItems = [
  { label: "Scope of Services", href: "#scope" },
  { label: "User Accounts", href: "#accounts" },
  { label: "Manuscript Submission", href: "#submission" },
  { label: "Peer Review Process", href: "#peer-review" },
  { label: "Copyright & Licensing", href: "#copyright" },
  { label: "Acceptable Use", href: "#acceptable-use" },
  { label: "Retractions & Corrections", href: "#retractions" },
  { label: "Disclaimer of Warranties", href: "#disclaimers" },
  { label: "Limitation of Liability", href: "#liability" },
  { label: "Indemnification", href: "#indemnification" },
  { label: "Modifications to Terms", href: "#modifications" },
];

export default function TermsOfService() {
  return (
    <div className="bg-white text-gray-900">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-sm mb-8 text-blue-200">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <span>Terms of Service</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Terms of Service</h1>
          <p className="text-blue-200 text-lg max-w-2xl leading-relaxed">
            By accessing or using the ToESS platform, you agree to comply with and be bound by these
            Terms of Service. Please read them carefully before using our services.
          </p>
          <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-blue-700">
            {[
              { label: "License", value: "CC BY 4.0" },
              { label: "Review Type", value: "Double-Blind" },
              { label: "Ethics Standard", value: "COPE Compliant" },
              { label: "Access", value: "Open Access" },
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
            {["Peer-Reviewed Journal", "International Publication", "Open Access", "COPE Guidelines"].map((label) => (
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

      {/* Body — sidebar + content */}
      <section className="py-16 bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-[220px_1fr] gap-10 items-start">

            {/* Sticky TOC */}
            <div className="hidden md:block sticky top-8">
              <div className="bg-white border border-gray-200 shadow-sm p-5">
                <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Contents</h3>
                <nav className="flex flex-col gap-1">
                  {tocItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="text-sm text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1.5 rounded transition flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-indigo-400 flex-shrink-0 transition" />
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Sections */}
            <div>
              {/* Intro notice */}
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-5 mb-8">
                <p className="text-sm text-indigo-800 leading-relaxed">
                  <span className="font-semibold">Please read carefully.</span> These Terms of Service govern your use of the
                  ToESS platform. If you do not agree with any part of these Terms, you must not use the platform.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                {sections.map((sec, i) => {
                  const Icon = sec.icon;
                  return (
                    <div
                      key={sec.id}
                      id={sec.id}
                      className="bg-white border-l-4 border-indigo-600 shadow-sm hover:shadow-md transition p-6 scroll-mt-8"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-11 h-11 bg-indigo-50 rounded-full flex items-center justify-center">
                          <Icon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs font-bold text-indigo-400 tracking-widest uppercase">
                              {String(i + 2).padStart(2, "0")}
                            </span>
                            <h3 className="font-semibold text-gray-900 text-lg">{sec.title}</h3>
                          </div>
                          {sec.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Contact block */}
              <div id="contact" className="mt-5 bg-white border-l-4 border-indigo-600 shadow-sm p-6 scroll-mt-8">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-11 h-11 bg-indigo-50 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold text-indigo-400 tracking-widest uppercase">12</span>
                      <h3 className="font-semibold text-gray-900 text-lg">Contact Information</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      For questions or concerns regarding these Terms of Service, please contact us:
                    </p>
                    <div className="flex flex-col gap-2">
                      <a href="mailto:editor@toess.org" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition text-sm">
                        <Mail className="w-4 h-4" /> editor@toess.org
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Related Policies</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Privacy Policy</h3>
              <p className="text-sm text-gray-600 mb-4">
                Understand how ToESS collects, stores, and protects your personal information.
              </p>
              <Link to="/privacy-policy" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition">
                Read Privacy Policy →
              </Link>
            </div>
            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Disclaimer</h3>
              <p className="text-sm text-gray-600 mb-4">
                Review the scope of liability and editorial independence of content published in ToESS.
              </p>
              <Link to="/disclaimer" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition">
                Read Disclaimer →
              </Link>
            </div>
            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Publication Policy</h3>
              <p className="text-sm text-gray-600 mb-4">
                Learn about our peer review standards, authorship criteria, and ethical requirements.
              </p>
              <Link to="/publication-policy" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition">
                Read Publication Policy →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Submit your manuscript to ToESS and contribute to advancing research in
            evolutionary algorithms, AI, and smart systems.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-blue-50 transition shadow-lg text-lg"
            >
              Submit Your Manuscript
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-700 transition text-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}