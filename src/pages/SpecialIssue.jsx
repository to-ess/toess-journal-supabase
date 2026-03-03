import { Star, Calendar, Users, FileText, Mail, CheckCircle, AlertCircle, BookOpen, TrendingUp, Award, Send } from "lucide-react";
import SidebarLayout from "../layouts/SidebarLayout";

export default function SpecialIssue() {
  const currentTopics = [
    {
      title: "Evolutionary AI in Healthcare",
      deadline: "June 30, 2026",
      status: "Open",
      color: "emerald",
      description: "Exploring evolutionary algorithms and AI applications in medical diagnostics, treatment optimization, and healthcare systems."
    },
    {
      title: "Smart Systems for Sustainability",
      deadline: "August 15, 2026",
      status: "Open",
      color: "blue",
      description: "Innovative smart systems addressing environmental challenges, energy efficiency, and sustainable development."
    },
    {
      title: "Bio-inspired Optimization",
      deadline: "September 30, 2026",
      status: "Open",
      color: "violet",
      description: "Novel bio-inspired algorithms and their applications in complex optimization problems."
    }
  ];

  const proposalComponents = [
    {
      icon: FileText,
      title: "Title of Special Issue",
      description: "Provide a catchy and informative title that encapsulates the theme of the special issue."
    },
    {
      icon: Users,
      title: "Guest Editor(s)",
      description: "Include your name, affiliation, and co-editors if any, with their credentials and expertise."
    },
    {
      icon: Calendar,
      title: "Proposed Timeline",
      description: "Define clear dates for: Call for Papers, Submission Deadline, Review Completion, Revisions, and Publication Date."
    },
    {
      icon: BookOpen,
      title: "Background and Rationale",
      description: "Explain the importance, timeliness, and gaps in current literature this issue will address."
    },
    {
      icon: TrendingUp,
      title: "Scope and Topics",
      description: "List specific topics the special issue will cover with detailed descriptions to guide contributors."
    },
    {
      icon: Award,
      title: "Target Audience",
      description: "Identify who will benefit: academics, practitioners, students, or industry professionals."
    },
    {
      icon: FileText,
      title: "Types of Articles",
      description: "Specify submission types: original research, reviews, case studies, position papers, etc."
    },
    {
      icon: Users,
      title: "Editorial Team Bios",
      description: "Brief biographies highlighting expertise and relevant publications of guest editors."
    },
    {
      icon: Send,
      title: "Marketing Plan",
      description: "Outline promotion strategies for the call for papers and final published issue."
    }
  ];

  return (
    <SidebarLayout
      title="Special Issues"
      subtitle="Focused collections on emerging research themes"
      icon={Star}
      sidebarExtra={
        <>
          {/* Important Dates */}
          <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h4 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Important Timeline
            </h4>
            <div className="space-y-3 text-sm">
              {[
                { color: "bg-indigo-600", label: "Proposal Review", value: "2–3 weeks" },
                { color: "bg-blue-600",   label: "Call Duration",   value: "3–6 months" },
                { color: "bg-emerald-600",label: "Publication",     value: "6–12 months" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2">
                  <div className={`w-2 h-2 ${item.color} rounded-full mt-1.5 flex-shrink-0`} />
                  <div>
                    <p className="font-medium text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-600">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Card */}
          <div className="mt-6 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl border border-indigo-200 p-6">
            <Mail className="w-8 h-8 text-indigo-600 mb-3" />
            <h4 className="font-bold text-slate-900 text-sm mb-2">Questions?</h4>
            <p className="text-xs text-slate-700 mb-3">
              Contact our Special Issues Editor for guidance on your proposal.
            </p>
            <a
              href="/contact"
              className="block w-full px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition text-center"
            >
              Contact Us
            </a>
          </div>
        </>
      }
    >
      <div className="space-y-8">

        {/* Introduction */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Star className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">About Special Issues</h2>
              <p className="text-slate-700 leading-relaxed">
                ToESS periodically publishes special issues focusing on emerging research themes and cutting-edge
                developments in evolutionary computing and smart systems. These focused collections bring together
                leading experts and innovative research on specific topics of high impact and relevance.
              </p>
            </div>
          </div>
        </div>

        {/* Current Special Issues */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Current Open Calls</h2>
          <div className="space-y-6">
            {currentTopics.map((topic, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-${topic.color}-100 rounded-lg flex items-center justify-center`}>
                      <BookOpen className={`w-6 h-6 text-${topic.color}-600`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{topic.title}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1 text-xs text-slate-600">
                          <Calendar className="w-3 h-3" />
                          Deadline: {topic.deadline}
                        </span>
                        <span className={`px-2 py-0.5 bg-${topic.color}-100 text-${topic.color}-700 text-xs font-semibold rounded-full`}>
                          {topic.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <a
                    href="/submit"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition"
                  >
                    Submit Paper
                  </a>
                </div>
                <div className="p-6">
                  <p className="text-slate-700 leading-relaxed">{topic.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Propose a Special Issue */}
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-xl p-8 shadow-lg">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 flex-shrink-0">
              <Send className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Propose a Special Issue</h2>
              <p className="text-blue-100 leading-relaxed">
                We welcome proposals from researchers and experts who wish to guest edit a special issue.
                A well-prepared proposal should demonstrate the significance and timeliness of the topic.
              </p>
            </div>
          </div>
          <a
            href="mailto:specialissues@toess.org"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-900 rounded-lg font-semibold hover:bg-blue-50 transition shadow-md"
          >
            <Mail className="w-5 h-5" />
            Submit Proposal
          </a>
        </div>

        {/* Proposal Guidelines */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 px-8 py-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600" />
              Proposal Submission Guidelines
            </h2>
            <p className="text-slate-600 mt-2 text-sm">
              Your proposal should include the following components for consideration
            </p>
          </div>
          <div className="p-8">
            <div className="space-y-6">
              {proposalComponents.map((component, i) => {
                const Icon = component.icon;
                return (
                  <div key={i} className="flex items-start gap-4 pb-6 border-b border-slate-200 last:border-0 last:pb-0">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">{component.title}</h3>
                      <p className="text-sm text-slate-700 leading-relaxed">{component.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Email Submission Guide */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Mail className="w-6 h-6 text-indigo-600" />
            How to Submit Your Proposal
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm font-semibold text-slate-900 mb-1">Email Subject Line:</p>
              <p className="text-sm text-slate-700 font-mono bg-white px-3 py-2 rounded border border-slate-200">
                Special Issue Proposal Submission: [Title of Special Issue]
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm font-semibold text-slate-900 mb-3">Email Body Structure:</p>
              <ul className="space-y-2 text-sm text-slate-700">
                {[
                  "Greet the recipient professionally",
                  "Briefly introduce yourself and the purpose",
                  "Mention the attached proposal document",
                  "Express willingness to provide additional information",
                  "Attach proposal in professional format (PDF)",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Send To:</p>
                  <p className="text-sm text-blue-800 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    specialissues@toess.org
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Benefits of Guest Editing</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Increase visibility in your field",
              "Network with leading researchers",
              "Shape research directions",
              "Enhance your editorial experience",
              "Build your academic portfolio",
              "Contribute to the community"
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-4 border border-slate-200">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-900">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}