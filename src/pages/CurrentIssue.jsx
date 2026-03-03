import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";

export default function CurrentIssue() {

  return (
    <div className="bg-white text-gray-900">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-sm mb-8 text-blue-200">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <span>Current Issue</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Current Issue</h1>
          <p className="text-blue-200 text-lg max-w-2xl leading-relaxed">
            Transactions on Evolutionary Smart Systems — Volume 1, Issue 1
          </p>
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

      {/* Coming Soon Content */}
      <section className="py-24 bg-gray-50 border-b">
        <div className="max-w-3xl mx-auto px-6 text-center">

          {/* Icon + Badge */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-24 h-24 bg-indigo-50 border-2 border-indigo-100 rounded-full mb-5">
              <BookOpen className="w-10 h-10 text-indigo-600" />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Coming Soon
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            We're Preparing the First Issue
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            ToESS is currently in its inaugural publication cycle. Our editorial team is working
            diligently to review and process the first batch of submitted manuscripts.
          </p>

          <p className="text-gray-500 leading-relaxed mb-12">
            The first issue will feature original research articles, review papers, and technical
            contributions in evolutionary algorithms, intelligent systems, and smart computing.
            Stay tuned — we'll notify you as soon as it's live.
          </p>


        </div>
      </section>

      {/* What to expect */}
      <section className="py-16 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">What to Expect</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Original Research",
                desc: "Peer-reviewed original research articles presenting novel findings in evolutionary and smart systems.",
              },
              {
                title: "Review Articles",
                desc: "Comprehensive survey papers covering recent advances and open challenges in the field.",
              },
              {
                title: "Technical Notes",
                desc: "Short communications and technical contributions addressing specific problems or datasets.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse archives / submit */}
      <section className="py-16 border-b bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">In the Meantime</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Browse Archives</h3>
              <p className="text-sm text-gray-600 mb-4">
                Explore previously published volumes and issues in the ToESS archive.
              </p>
              <Link to="/archives" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition">
                View Archives <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Submit Your Manuscript</h3>
              <p className="text-sm text-gray-600 mb-4">
                Contribute to the upcoming issue by submitting your research manuscript today.
              </p>
              <Link to="/submit" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition">
                Submit Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Contribute?</h2>
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
              to="/guidelines"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-700 transition text-lg"
            >
              Author Guidelines
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}