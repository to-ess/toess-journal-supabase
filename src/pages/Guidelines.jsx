import React from 'react';
import { FileText, CheckCircle, Upload, Clock, AlertCircle, BookOpen, Download, Send, Shield, Scale } from "lucide-react";
import SidebarLayout from '../layouts/SidebarLayout';
import { Link } from "react-router-dom";

export default function Guidelines() {
  const submissionSteps = [
    {
      step: "1",
      title: "Prepare Your Manuscript",
      description: "Format your paper according to COPE standards and our template.",
      icon: FileText
    },
    {
      step: "2",
      title: "Online Submission",
      description: "Submit through our online system with no submission fee.",
      icon: Upload
    },
    {
      step: "3",
      title: "Peer Review",
      description: "Anonymous expert review (typically 21 days).",
      icon: Clock
    },
    {
      step: "4",
      title: "Publication",
      description: "Open access publication with unique DOI.",
      icon: CheckCircle
    }
  ];

  return (
    <SidebarLayout
      title="Author Guidelines"
      subtitle="Transaction on Evolutionary Smart Systems"
      icon={FileText}
    >
      <div className="space-y-12">
        {/* Quick Links */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
          <h3 className="font-bold text-slate-900 mb-4">Quick Links</h3>
          <div className="flex flex-wrap gap-3">
            <a href="#preparation" className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition text-sm font-medium">
              Manuscript Preparation
            </a>
            <a href="#submission" className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition text-sm font-medium">
              Submission Process
            </a>
            <a href="#review" className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition text-sm font-medium">
              Review Process
            </a>
            <a href="#copyright" className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition text-sm font-medium">
              Copyright
            </a>
          </div>
        </div>

        {/* Scope and Mission */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Scope and Mission</h2>
          <p className="text-slate-700 leading-relaxed">
            ToESS is dedicated to publishing groundbreaking research in the field of evolutionary smart systems. Covering a broad spectrum of topics, we emphasize innovative approaches and applications in this dynamic field. For detailed scope and areas, please visit our <a href="/scope" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">Scope page</a>.
          </p>
        </div>

        {/* Submission Process Overview */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Submission Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {submissionSteps.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center hover:shadow-lg hover:border-indigo-300 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Manuscript Preparation */}
        <div id="preparation" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <h2 className="text-2xl font-bold text-slate-900">Manuscript Preparation</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Format Requirements</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Manuscripts must adhere to the standards set by the <strong>Committee on Publication Ethics (COPE)</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Submit in <strong>Word format (.docx)</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Activate <strong>page and line numbering</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Avoid headers and footers</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Manuscript Structure</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Title", desc: "Clear and descriptive title" },
                  { title: "Author Information", desc: "Names, affiliations, and contact details" },
                  { title: "Abstract", desc: "Concise summary of the work" },
                  { title: "Keywords", desc: "Relevant keywords for indexing" },
                  { title: "Main Text", desc: "Introduction, methodology, results, discussion" },
                  { title: "Figures & Tables", desc: "High-resolution with appropriate legends" },
                  { title: "References", desc: "Following specified formatting style" },
                  { title: "Headings", desc: "Clear distinction for headings and subheadings" }
                ].map((section) => (
                  <div key={section.title} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-1">{section.title}</h4>
                    <p className="text-sm text-slate-600">{section.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submission Requirements */}
        <div id="submission" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <Send className="w-8 h-8 text-indigo-600" />
            <h2 className="text-2xl font-bold text-slate-900">Submission Requirements</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">No Submission or Publication Fees</h3>
                  <p className="text-sm text-slate-700">Manuscripts should be submitted through our online system. There are <strong>no submission fees or publication charges</strong>.</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">Cover Letter</h3>
                <p className="text-sm text-slate-700">A <strong>signed cover letter</strong> must be included, addressing conflicts of interest.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">Consent Forms</h3>
                <p className="text-sm text-slate-700">Include consent forms from clients/customers/end-users/resource providers where applicable.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Image and Table Guidelines */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Image and Table Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Images
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Submit <strong>high-resolution</strong> images</li>
                <li>• Accepted formats: <strong>JPEG, JPG, PNG, or TIFF</strong></li>
                <li>• Include appropriate legends for all images</li>
              </ul>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Tables
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Supply tables with legends</li>
                <li>• If <strong>more than four tables</strong>, provide them in a separate Word or Excel file</li>
                <li>• Ensure clear formatting and readability</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Review and Decision Process */}
        <div id="review" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-8 h-8 text-indigo-600" />
            <h2 className="text-2xl font-bold text-slate-900">Review and Decision Process</h2>
          </div>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">Step 1</div>
                <p className="text-sm font-semibold text-slate-900 mb-2">Initial Check</p>
                <p className="text-sm text-slate-600">Plagiarism check and editor assignment</p>
              </div>
              <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="text-3xl font-bold text-indigo-600 mb-2">Step 2</div>
                <p className="text-sm font-semibold text-slate-900 mb-2">Peer Review</p>
                <p className="text-sm text-slate-600">Anonymous review by experts</p>
              </div>
              <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-600 mb-2">Step 3</div>
                <p className="text-sm font-semibold text-slate-900 mb-2">Editorial Decision</p>
                <p className="text-sm text-slate-600">Accept, revise, or reject</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg p-6 border border-indigo-200">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Timeline
              </h3>
              <p className="text-slate-700">The review process typically takes <strong>21 days</strong>, subject to reviewer availability.</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 flex gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Review Process Details</h3>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Submissions are reviewed <strong>anonymously</strong> by experts</li>
                  <li>• Ensures an unbiased and fair review process</li>
                  <li>• Decisions range from immediate acceptance to rejection, with possibilities for revisions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* After Acceptance */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">After Acceptance</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-slate-900 mb-2">Editing & Production</h3>
              <p className="text-sm text-slate-600">Copyediting and PDF production (<strong>~3 working days</strong>)</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-slate-900 mb-2">Open Access</h3>
              <p className="text-sm text-slate-600">Articles published with <strong>unique DOI</strong> for global recognition</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-slate-900 mb-2">Promotion</h3>
              <p className="text-sm text-slate-600">Promoted on social and academic platforms</p>
            </div>
          </div>
        </div>

        {/* Copyright and Licensing */}
        <div id="copyright" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <Scale className="w-8 h-8 text-indigo-600" />
            <h2 className="text-2xl font-bold text-slate-900">Copyright and Licensing</h2>
          </div>
          
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-4">
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span>Upon acceptance, <strong>copyright is transferred to the Journal</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span>Authors retain the right to use the work for <strong>educational and research purposes</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span>All publications are licensed under the <strong>Creative Commons Attribution 4.0 International License (CC BY 4.0)</strong></span>
              </li>
            </ul>
          </div>
          <Link
            to="/copyright-policy"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
          >
            <Scale className="w-4 h-4" />
            Read the full Copyright & Licensing Policy →
          </Link>
        </div>

        {/* Reference Style */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Reference Style</h2>
          <p className="text-slate-700">
            Adhere to the specific formatting for various types of references, as detailed on our website.
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-2xl p-8 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Submit?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-lg">
            For any inquiries or issues during submission, please contact us via the email provided on our website.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="/submit" 
              className="px-8 py-3 bg-white text-indigo-900 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Submit Your Paper
            </a>
            <a 
              href="/contact" 
              className="px-8 py-3 bg-indigo-800 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all border-2 border-white/30 hover:border-white/50 flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Contact Editorial Team
            </a>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}