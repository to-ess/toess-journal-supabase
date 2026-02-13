import { Users, Shield, FileSearch, CheckCircle, AlertCircle, Clock, Mail, BookOpen, Award, Eye } from "lucide-react";

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

export default function ReviewerGuidelines() {
  const sections = [
    {
      icon: FileSearch,
      title: "Submission Review",
      color: "indigo",
      content: "Reviewers are requested to submit their reports via a secure online system. Initial screening is conducted by the editorial staff to ensure manuscripts meet editorial criteria before sending them for formal review."
    },
    {
      icon: Users,
      title: "Reviewer Selection",
      color: "blue",
      content: "Selection is based on expertise, reputation, and past performance. Reviewers are expected to handle confidential information with discretion."
    },
    {
      icon: CheckCircle,
      title: "Review Process",
      color: "emerald",
      content: "Reviewers are asked to evaluate manuscripts based on key results, originality, validity, data & methodology, statistical use, clarity, and potential ethical issues. They should provide constructive feedback, pointing out strengths and weaknesses."
    },
    {
      icon: Award,
      title: "Decision Making",
      color: "violet",
      content: "Reviewers' assessments play a crucial role in editorial decisions, which may include acceptance, revision requests, or rejection."
    },
    {
      icon: Shield,
      title: "Confidentiality and Anonymity",
      color: "rose",
      content: "The review process is confidential and anonymous. Reviewers must not disclose their identity to authors or discuss manuscript details without the editor's consent."
    },
    {
      icon: Clock,
      title: "Timeliness",
      color: "amber",
      content: "Prompt responses are appreciated to maintain an efficient review process. Reviewers should inform the editorial team if they anticipate delays."
    },
    {
      icon: BookOpen,
      title: "Resources and Assistance",
      color: "cyan",
      content: "If reviewers require access to specific papers for evaluation, the journal will provide them. An online help guide and technical support are available for the review system."
    }
  ];

  const principles = [
    { icon: Shield, text: "Maintain confidentiality", color: "indigo" },
    { icon: Eye, text: "Provide unbiased feedback", color: "blue" },
    { icon: Clock, text: "Submit reviews within deadlines", color: "emerald" },
    { icon: AlertCircle, text: "Declare conflicts of interest", color: "rose" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Reviewer Guidelines</h1>
              <p className="text-blue-100 mt-2">
                Essential information for peer reviewers at ToESS
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Introduction Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-7 h-7 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    The Role of Peer Reviewers
                  </h2>
                  <p className="text-slate-700 leading-relaxed">
                    Reviewers play a vital role in maintaining the academic integrity of ToESS. 
                    Your expertise and dedication ensure that only high-quality, rigorous research 
                    is published, advancing the field of evolutionary smart systems.
                  </p>
                </div>
              </div>

              {/* Core Principles */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  Core Principles
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {principles.map((principle, i) => {
                    const Icon = principle.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-4 border border-slate-200">
                        <div className={`w-10 h-10 bg-${principle.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 text-${principle.color}-600`} />
                        </div>
                        <p className="text-sm font-medium text-slate-900">{principle.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Detailed Guidelines */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Detailed Guidelines</h2>
              
              {sections.map((section, i) => {
                const Icon = section.icon;
                return (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-${section.color}-100 rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 text-${section.color}-600`} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{section.title}</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-slate-700 leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Evaluation Criteria */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Manuscript Evaluation Criteria</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Originality and significance",
                  "Research methodology",
                  "Data analysis and results",
                  "Statistical validity",
                  "Clarity of presentation",
                  "References and citations",
                  "Ethical considerations",
                  "Contribution to the field"
                ].map((criterion, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                    <span className="text-sm font-medium">{criterion}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Need Assistance?</h3>
                  <p className="text-sm text-blue-800 mb-3">
                    If you have questions about the review process or need technical support, 
                    our editorial team is here to help.
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
            
            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h4 className="font-bold text-slate-900 mb-4 text-sm">Review Process</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs text-slate-600">Average Review Time</span>
                  <span className="text-sm font-bold text-indigo-600">2-4 weeks</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs text-slate-600">Reviewers per Paper</span>
                  <span className="text-sm font-bold text-indigo-600">2-3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Review Type</span>
                  <span className="text-sm font-bold text-indigo-600">Double-blind</span>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 text-sm mb-1">Important</h4>
                  <p className="text-xs text-amber-800">
                    All manuscripts are confidential. Do not share or discuss review materials without explicit permission.
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