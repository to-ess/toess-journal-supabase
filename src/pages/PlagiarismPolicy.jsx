import { Shield, FileSearch, AlertTriangle, XCircle, CheckCircle, Eye, Scale, FileX } from "lucide-react";

// Import this in your actual file:
// import UsefulSidebar from "../components/UsefulSidebar";

// Demo Sidebar Component
function UsefulSidebar() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-4">Quick Links</h3>
      <div className="space-y-2 text-sm text-slate-600">
        <div className="p-2 hover:bg-slate-50 rounded">Author Guidelines</div>
        <div className="p-2 hover:bg-slate-50 rounded">Contact Us</div>
      </div>
    </div>
  );
}

export default function PlagiarismPolicy() {
  const policyAreas = [
    {
      icon: FileSearch,
      title: "Prior to Submission",
      color: "blue",
      content: "Authors are responsible for ensuring that their manuscript content is free from plagiarized material. All work must be original and properly attributed."
    },
    {
      icon: Eye,
      title: "Plagiarism Detection",
      color: "indigo",
      content: "ToESS employs advanced plagiarism detection software to screen all submitted manuscripts for plagiarism, including self-plagiarism and improper citations."
    },
    {
      icon: XCircle,
      title: "Handling Plagiarism",
      color: "rose",
      content: "In cases where plagiarism is detected, the manuscript will be rejected outright. If plagiarism is discovered after publication, the article may be retracted, and the author's affiliation will be notified."
    },
    {
      icon: CheckCircle,
      title: "Authorial Responsibility",
      color: "emerald",
      content: "Authors must cite appropriately and comprehensively. It is the author's responsibility to acknowledge the original sources of content and ideas in accordance with academic standards."
    },
    {
      icon: AlertTriangle,
      title: "Consequences of Plagiarism",
      color: "amber",
      content: "Engaging in plagiarism can lead to serious academic and professional consequences for the author(s), including loss of credibility, institutional sanctions, and legal ramifications in severe cases."
    },
    {
      icon: FileX,
      title: "Retraction and Correction",
      color: "violet",
      content: "In cases where plagiarism is identified post-publication, ToESS will follow COPE (Committee on Publication Ethics) guidelines to address the issue, which may include issuing a correction or retracting the paper."
    },
    {
      icon: Shield,
      title: "Continuous Monitoring",
      color: "cyan",
      content: "ToESS is committed to continuous monitoring and safeguarding the integrity of its publications through regular audits and quality checks."
    }
  ];

  const plagiarismTypes = [
    { type: "Direct Plagiarism", description: "Copying text word-for-word without citation" },
    { type: "Self-Plagiarism", description: "Reusing own published work without proper citation" },
    { type: "Mosaic Plagiarism", description: "Mixing copied phrases with original text" },
    { type: "Accidental Plagiarism", description: "Failing to cite sources or misquoting" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-900 to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Plagiarism Policy</h1>
              <p className="text-red-100 mt-2">
                Maintaining academic integrity and ethical standards
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Zero Tolerance Statement */}
            <div className="bg-gradient-to-br from-rose-50 to-red-50 border-2 border-rose-200 rounded-xl p-8 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-rose-900 mb-3">
                    Zero-Tolerance Policy
                  </h2>
                  <p className="text-rose-800 leading-relaxed mb-3">
                    ToESS upholds a <strong>zero-tolerance policy</strong> towards plagiarism in any form. 
                    This includes self-plagiarism, where an author reuses significant parts of their own 
                    published work without proper citation.
                  </p>
                  <p className="text-rose-800 leading-relaxed">
                    All submissions are rigorously checked using advanced plagiarism detection tools to 
                    ensure the highest standards of academic integrity and originality.
                  </p>
                </div>
              </div>
            </div>

            {/* Policy Areas */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Policy Guidelines</h2>
              <div className="space-y-6">
                {policyAreas.map((area, i) => {
                  const Icon = area.icon;
                  return (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden">
                      <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 bg-${area.color}-100 rounded-lg flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 text-${area.color}-600`} />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">{area.title}</h3>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-slate-700 leading-relaxed">{area.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Types of Plagiarism */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 px-8 py-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                  Types of Plagiarism
                </h2>
                <p className="text-slate-600 mt-2">
                  Understanding different forms of plagiarism
                </p>
              </div>
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-4">
                  {plagiarismTypes.map((item, i) => (
                    <div key={i} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-4 border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        {item.type}
                      </h4>
                      <p className="text-sm text-slate-700">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-emerald-900 mb-3">
                    Best Practices for Authors
                  </h2>
                  <p className="text-emerald-800 mb-4">
                    Follow these guidelines to ensure your work maintains academic integrity:
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Always cite sources properly and consistently",
                  "Use quotation marks for direct quotes",
                  "Paraphrase in your own words, not word-for-word",
                  "Keep detailed notes of all sources used",
                  "Use plagiarism checkers before submission",
                  "Declare any reuse of your own published work",
                  "Follow citation style guidelines (APA, IEEE, etc.)",
                  "When in doubt, cite the source"
                ].map((practice, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-4 border border-emerald-200">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-900">{practice}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* COPE Guidelines */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Scale className="w-7 h-7 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">COPE Compliance</h3>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    ToESS follows the guidelines set by the Committee on Publication Ethics (COPE) 
                    for handling cases of suspected plagiarism and other publication misconduct.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    We are committed to fair, transparent, and ethical handling of all submissions 
                    and publications, ensuring that authors, reviewers, and readers can trust the 
                    integrity of our published research.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact for Questions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Questions About Plagiarism?</h3>
                  <p className="text-sm text-blue-800 mb-3">
                    If you have questions about what constitutes plagiarism or need guidance on 
                    proper citation practices, please contact our editorial office.
                  </p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                    Contact Editorial Office
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <UsefulSidebar />

            {/* Quick Facts */}
            <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h4 className="font-bold text-slate-900 mb-4 text-sm">Quick Facts</h4>
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <p className="text-xs text-slate-600 mb-1">Detection Tool</p>
                  <p className="text-sm font-bold text-indigo-600">Advanced AI Software</p>
                </div>
                <div className="pb-3 border-b border-slate-100">
                  <p className="text-xs text-slate-600 mb-1">Check Timing</p>
                  <p className="text-sm font-bold text-indigo-600">Before Review</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Policy Type</p>
                  <p className="text-sm font-bold text-rose-600">Zero Tolerance</p>
                </div>
              </div>
            </div>

            {/* Warning Notice */}
            <div className="mt-6 bg-gradient-to-br from-rose-50 to-red-50 border-2 border-rose-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-rose-900 text-sm mb-2">Warning</h4>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    Manuscripts found to contain plagiarized content will be immediately rejected. 
                    Repeated violations may result in a ban from future submissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}