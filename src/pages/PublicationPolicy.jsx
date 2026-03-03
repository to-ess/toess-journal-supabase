import { Link } from "react-router-dom";
import {
  BookOpen,
  Shield,
  Users,
  Eye,
  Database,
  FileCheck,
  AlertCircle,
} from "lucide-react";

const sections = [
  {
    number: "01",
    icon: BookOpen,
    title: "Originality and Exclusivity",
    content:
      "Submitted manuscripts must be original, unpublished, and not under consideration elsewhere. Authors are responsible for ensuring that their work does not contain plagiarism, fabricated data, falsified results, or improper citations. All submissions may be subjected to plagiarism detection screening.",
  },
  {
    number: "02",
    icon: Eye,
    title: "Peer Review Process",
    content:
      "ToESS follows a rigorous double-blind peer review process. Each manuscript is evaluated by at least two independent expert reviewers to ensure scientific validity, technical quality, originality, and relevance to the journal's scope. Editorial decisions are based solely on scholarly merit and reviewer recommendations.",
  },
  {
    number: "03",
    icon: Users,
    title: "Authorship and Contributions",
    content:
      "Authorship must be limited to individuals who have made significant intellectual contributions to the research. All authors must approve the final version of the manuscript prior to submission. The corresponding author is responsible for ensuring transparency in authorship contributions and communication with the editorial office.",
  },
  {
    number: "04",
    icon: Shield,
    title: "Ethical Standards",
    content:
      "Research involving human participants, animals, or sensitive data must comply with recognized ethical standards and institutional guidelines. Authors must disclose any conflicts of interest that could influence the research outcomes or interpretation of results.",
  },
  {
    number: "05",
    icon: Database,
    title: "Data Integrity and Reproducibility",
    content:
      "Authors are expected to present accurate data and sufficient methodological detail to enable replication of results. Upon reasonable request, authors should be prepared to provide supporting data or code where applicable.",
  },
  {
    number: "06",
    icon: FileCheck,
    title: "Copyright and Licensing",
    content:
      "Upon acceptance, authors grant the journal the right to publish the work. Copyright and licensing terms will be clearly specified at the time of publication. Proper acknowledgment of previously published material is mandatory.",
  },
  {
    number: "07",
    icon: AlertCircle,
    title: "Corrections and Retractions",
    content:
      "The journal reserves the right to issue corrections, expressions of concern, or retractions in cases of significant errors, ethical violations, or research misconduct, in accordance with established publication ethics guidelines.",
  },
];

export default function PublicationPolicy() {
  return (
    <div className="bg-white text-gray-900">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">

          {/* Breadcrumb */}
          <div className="text-sm mb-8 text-blue-200">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <span>Publication Policy</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Publication Policy
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl leading-relaxed">
            Transactions of Evolutionary Smart Systems (ToESS) is committed to maintaining the
            highest standards of academic integrity, transparency, and scholarly excellence.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-blue-700">
            {[
              { label: "Review Type", value: "Double-Blind" },
              { label: "Min. Reviewers", value: "2 Experts" },
              { label: "Plagiarism Screening", value: "All Submissions" },
              { label: "Ethics Standard", value: "COPE Compliant" },
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

      {/* About This Policy */}
      <section className="py-16 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">About This Policy</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            The following publication policy governs all manuscripts submitted to and published in
            Transactions on Evolutionary Smart Systems. It outlines the responsibilities of authors,
            reviewers, and editors, and defines the standards expected throughout the publication lifecycle.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            This policy is reviewed periodically and updated in alignment with evolving international
            standards for scholarly publication and research ethics.
          </p>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-16 bg-gray-50 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Core Principles</h2>

          <div className="flex flex-col gap-5">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.number}
                  className="bg-white border-l-4 border-indigo-600 shadow-sm hover:shadow-md transition p-6 flex gap-5 items-start"
                >
                  <div className="flex-shrink-0 w-11 h-11 bg-indigo-50 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-indigo-400 tracking-widest uppercase">
                        {sec.number}
                      </span>
                      <h3 className="font-semibold text-gray-900 text-lg">{sec.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{sec.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compliance & Standards */}
      <section className="py-16 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Compliance & Standards</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">COPE Guidelines</h3>
              <p className="text-sm text-gray-600">
                ToESS adheres to the Committee on Publication Ethics (COPE) guidelines for all
                editorial processes and dispute resolution.
              </p>
            </div>
            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Plagiarism Detection</h3>
              <p className="text-sm text-gray-600">
                All submitted manuscripts undergo screening using industry-standard plagiarism
                detection software before entering peer review.
              </p>
            </div>
            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Conflict of Interest</h3>
              <p className="text-sm text-gray-600">
                All authors, reviewers, and editors are required to declare any competing interests
                that could affect the objectivity of the research.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Questions About Our Policy?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Reach out to the editorial office for any clarifications regarding submission
            requirements, ethical standards, or publication terms.
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
              to="/submit"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-700 transition text-lg"
            >
              Submit Manuscript
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}