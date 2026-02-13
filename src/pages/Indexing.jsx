// src/pages/Indexing.jsx
import React from 'react';
import SidebarLayout from '../layouts/SidebarLayout';
import { Database } from 'lucide-react';

export default function Indexing() {
  return (
    <SidebarLayout
      title="Indexing"
      subtitle="Where ToESS is indexed and abstracted"
      icon={Database}
    >
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Indexing Information</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            ToESS is committed to ensuring maximum visibility and discoverability of published research. 
            We are actively working on getting indexed in major databases and repositories.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-slate-900 mb-2">Currently Indexed In:</h3>
              <ul className="space-y-2 text-slate-700">
                <li>• Google Scholar</li>
                <li>• ResearchGate</li>
                <li>• Academia.edu</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="font-semibold text-slate-900 mb-2">Application Submitted:</h3>
              <ul className="space-y-2 text-slate-700">
                <li>• DOAJ (Directory of Open Access Journals)</li>
                <li>• Scopus</li>
                <li>• Web of Science</li>
                <li>• EBSCO</li>
                <li>• ProQuest</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-slate-900 mb-2">Open Access Compliance:</h3>
              <p className="text-slate-700">
                All articles are published with unique DOIs and are freely accessible to readers worldwide.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-xl p-8 text-white">
          <h3 className="text-xl font-bold mb-3">Continuous Improvement</h3>
          <p className="text-blue-100">
            We are constantly working to expand our indexing coverage to ensure your research reaches 
            the widest possible audience. Check back regularly for updates.
          </p>
        </div>
      </div>
    </SidebarLayout>
  );
}