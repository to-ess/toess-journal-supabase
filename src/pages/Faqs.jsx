import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    number: "01",
    question: "What types of papers does ToESS accept for publication?",
    answer:
      "ToESS accepts a range of manuscript types, including original research, review articles, case studies, and short communications in the field of evolutionary smart systems.",
  },
  {
    number: "02",
    question: "How can I submit my manuscript to ToESS?",
    answer:
      "Manuscripts can be submitted via our online submission system. New users need to register on the website before submission.",
  },
  {
    number: "03",
    question: "What is the review process at ToESS?",
    answer:
      "Manuscripts undergo an initial plagiarism check followed by a double-blind peer review process, where they are reviewed by external experts without revealing the author's identity.",
  },
  {
    number: "04",
    question: "How long does the review process take?",
    answer:
      "The review process typically takes around 21 days, depending on the availability of editors and reviewers.",
  },
  {
    number: "05",
    question: "Can I submit images with my manuscript?",
    answer:
      "Yes, you can submit high-resolution images (300 DPI) in JPEG, JPG, PNG, or TIFF formats. Please ensure each image has a corresponding legend.",
  },
  {
    number: "06",
    question: "What happens if my paper is accepted?",
    answer:
      "Accepted papers undergo copyediting, are formatted into a PDF, and then published online with a unique DOI. Authors receive a PDF proof prior to publication.",
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="bg-white text-gray-900">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">

          {/* Breadcrumb */}
          <div className="text-sm mb-8 text-blue-200">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <span>FAQs</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl leading-relaxed">
            Everything you need to know about submitting, reviewing, and publishing your
            manuscript in Transactions on Evolutionary Smart Systems.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-blue-700">
            {[
              { label: "Review Timeline", value: "~21 Days" },
              { label: "Review Type", value: "Double-Blind" },
              { label: "Image Formats", value: "JPEG / PNG / TIFF" },
              { label: "Resolution Required", value: "300 DPI" },
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
            {["Peer-Reviewed Journal", "International Publication", "Open Access", "Double-Blind Review"].map((label) => (
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

      {/* FAQ Accordion */}
      <section className="py-16 bg-gray-50 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Common Questions</h2>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={faq.number}
                  className={`bg-white border-l-4 shadow-sm transition ${isOpen ? "border-indigo-600 shadow-md" : "border-gray-200 hover:border-indigo-400 hover:shadow-md"}`}
                >
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center gap-5 px-6 py-5 text-left"
                  >
                    {/* Number badge */}
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {faq.number}
                    </span>

                    {/* Question */}
                    <span className="flex-1 font-semibold text-gray-900 text-base">
                      {faq.question}
                    </span>

                    {/* Chevron */}
                    <span className="flex-shrink-0 text-indigo-600">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>

                  {/* Answer */}
                  {isOpen && (
                    <div className="px-6 pb-5 pl-[72px]">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Still Have Questions?</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Author Guidelines</h3>
              <p className="text-sm text-gray-600 mb-4">
                Review our detailed submission guidelines for formatting, referencing, and manuscript preparation requirements.
              </p>
              <Link to="/guidelines" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition">
                View Guidelines →
              </Link>
            </div>
            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Publication Policy</h3>
              <p className="text-sm text-gray-600 mb-4">
                Learn about our peer review standards, authorship criteria, ethical requirements, and publication process.
              </p>
              <Link to="/publication-policy" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition">
                Read Policy →
              </Link>
            </div>
            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
              <p className="text-sm text-gray-600 mb-4">
                Can't find your answer here? Get in touch with our editorial office directly and we'll be happy to help.
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
          <h2 className="text-4xl font-bold mb-6">Ready to Submit Your Research?</h2>
          <p className="text-xl mb-8 text-blue-100">
            ToESS invites original research articles, review papers, and technical notes
            in all areas within the journal scope.
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