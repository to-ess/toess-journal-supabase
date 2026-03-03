import React, { useState } from 'react';
import { Link } from "react-router-dom";

export default function CopyrightPolicy() {
  const [openSection, setOpenSection] = useState(null);

  const toggle = (i) => setOpenSection(openSection === i ? null : i);

  const sections = [
    {
      number: "01",
      title: "Copyright Transfer",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      content: (
        <div className="space-y-5 text-gray-700 leading-relaxed">
          <p>
            Upon acceptance of a manuscript for publication, authors are required to transfer copyright to the Journal. The transfer of copyright includes, but is not limited to:
          </p>
          <ul className="space-y-3">
            {[
              "The right to publish, reproduce, distribute, and archive the article in all formats (print, electronic, and any future media).",
              "The right to authorize third-party indexing, abstracting, and database inclusion.",
              "The right to disseminate the article globally."
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-2">Authors Warrant That:</p>
            <ul className="space-y-1 text-blue-800 text-sm">
              <li>• The work is original.</li>
              <li>• It has not been published elsewhere.</li>
              <li>• It does not infringe upon any third-party rights.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      number: "02",
      title: "Open Access Policy",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
      ),
      content: (
        <div className="space-y-5 text-gray-700 leading-relaxed">
          <p>
            This Journal is an open-access publication. All articles are published under the <strong className="text-indigo-700">Creative Commons Attribution 4.0 International License (CC BY 4.0)</strong>.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Share & Redistribute", desc: "Share and redistribute the material in any medium or format.", icon: "🔗" },
              { label: "Adapt & Remix", desc: "Adapt, remix, transform, and build upon the material.", icon: "✏️" },
              { label: "Commercial Use", desc: "Use permitted for both commercial and non-commercial purposes.", icon: "💼" },
              { label: "Irrevocable License", desc: "The license is irrevocable once granted to users.", icon: "🔒" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{item.label}</div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="font-semibold text-amber-900 mb-2">Provided That:</p>
            <ul className="space-y-1 text-amber-800 text-sm">
              <li>• Proper attribution is given to the original author(s).</li>
              <li>• A link to the license is provided.</li>
              <li>• Indication of changes (if any) is made.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      number: "03",
      title: "Author Rights After Transfer",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      content: (
        <div className="space-y-5 text-gray-700 leading-relaxed">
          <p>Although copyright is transferred to the Journal, authors retain the right to:</p>
          <ul className="space-y-3">
            {[
              "Use the article for educational and research purposes.",
              "Include the article in theses and dissertations.",
              "Share the published version with proper citation.",
              "Deposit the article in institutional repositories with acknowledgment of the Journal as the original publisher.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      number: "04",
      title: "Third-Party Reuse",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      content: (
        <div className="space-y-5 text-gray-700 leading-relaxed">
          <p>Any third party may reuse the content under the terms of CC BY 4.0, provided:</p>
          <ul className="space-y-3">
            {[
              "Full citation is given.",
              "The Journal is acknowledged as the original publisher.",
              "No misleading representation is made.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      number: "05",
      title: "Archiving & Indexing",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      content: (
        <div className="space-y-5 text-gray-700 leading-relaxed">
          <p>The Journal reserves the right to:</p>
          <ul className="space-y-3">
            {[
              "Archive content permanently.",
              "Submit articles to indexing databases.",
              "Preserve digital copies through archiving systems.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
  ];

  return (
    <div className="bg-white text-gray-900">

      {/* Hero — mirrors Home page hero */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">

          {/* Breadcrumb */}
          <div className="text-sm mb-8 text-blue-200">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <span>Copyright &amp; Licensing Policy</span>
          </div>

          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-indigo-700/60 border border-indigo-500/40 px-4 py-1.5 rounded-full text-sm font-medium text-blue-200 mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
              Model 2 — Journal Holds Copyright + CC BY 4.0
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Copyright &amp; Licensing Policy
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed max-w-2xl">
              ToESS is committed to transparent and ethical publishing. This policy outlines the copyright terms, author rights, and open access conditions governing all published works.
            </p>
          </div>
        </div>
      </section>

      {/* Quick-reference trust bar */}
      <div className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-700">
            {[
              { icon: "🔓", label: "Open Access — CC BY 4.0" },
              { icon: "©", label: "Copyright Transferred to Journal" },
              { icon: "✅", label: "Authors Retain Key Rights" },
              { icon: "🌍", label: "Global Redistribution Permitted" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 font-medium">
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CC BY 4.0 License Banner */}
      <section className="py-10 border-b bg-indigo-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-white rounded-xl border border-indigo-100 shadow-sm p-6">
            {/* CC Logo block */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="font-bold text-indigo-900 text-lg leading-none">CC BY</div>
                <div className="text-indigo-600 text-sm font-medium">4.0 International</div>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-gray-700 text-sm leading-relaxed">
                All articles published in ToESS are made freely available under the{" "}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 font-semibold underline underline-offset-2 hover:text-indigo-800"
                >
                  Creative Commons Attribution 4.0 International License
                </a>
                . This license allows maximum reuse while ensuring authors receive proper credit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Sections — accordion-style cards */}
      <section className="py-16 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-gray-900">Policy Details</h2>

          <div className="space-y-4">
            {sections.map((sec, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center gap-5 px-6 py-5 bg-white hover:bg-gray-50 transition text-left"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {sec.number}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900 text-lg">{sec.title}</span>
                  </div>
                  <div className={`flex-shrink-0 text-indigo-600 transition-transform duration-200 ${openSection === i ? "rotate-180" : ""}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {openSection === i && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-white">
                    {sec.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submission Checkbox Notice */}
      <section className="py-16 bg-gray-50 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Submission Agreement</h2>
          <p className="text-gray-600 mb-8 text-lg">
            During manuscript submission, authors must confirm the following declaration:
          </p>

          <div className="bg-white border-2 border-indigo-300 rounded-xl p-8 shadow-sm max-w-3xl">
            <div className="flex items-start gap-4">
              {/* Checked checkbox visual */}
              <div className="flex-shrink-0 mt-1 w-6 h-6 bg-indigo-600 rounded border-2 border-indigo-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-800 leading-relaxed text-base">
                I have read and agree to the Journal's{" "}
                <strong className="text-indigo-700">Copyright & Licensing Policy</strong>
                , and consent to transfer copyright upon acceptance. I acknowledge the article will be published under the{" "}
                <strong className="text-indigo-700">Creative Commons Attribution 4.0 International License (CC BY 4.0)</strong>.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                ⚠️ This checkbox is <strong>mandatory</strong> during the online submission process. Submissions will not be processed without this agreement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ethics policies — mirrors home Ethics section */}
      <section className="py-16 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Related Policies</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Publication Ethics",
                desc: "ToESS follows COPE guidelines for ethical publishing practices across all submissions and editorial decisions.",
              },
              {
                title: "Plagiarism Policy",
                desc: "All manuscripts are screened for originality. Copyright violations or self-plagiarism will result in rejection.",
              },
              {
                title: "Retraction Policy",
                desc: "In cases of copyright infringement or misconduct, the Journal reserves the right to retract published articles.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — mirrors home CTA */}
      <section className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Submit Your Research?</h2>
          <p className="text-xl mb-8 text-blue-100">
            By submitting to ToESS, you agree to our copyright and licensing terms. Your work will reach a global audience under an open-access CC BY 4.0 license.
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
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-700 transition text-lg"
            >
              View CC BY 4.0 License
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}