// src/pages/Indexing.jsx
import React from 'react';
import SidebarLayout from '../layouts/SidebarLayout';
import { Database, Clock, Globe, CheckCircle, Search } from 'lucide-react';

export default function Indexing() {
  return (
    <SidebarLayout
      title="Indexing"
      subtitle="Where ToESS is indexed and abstracted"
      icon={Database}
    >
      <div className="space-y-6">

        {/* Intro */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Indexing Information</h2>
          <p className="text-slate-700 leading-relaxed">
            ToESS is committed to ensuring maximum visibility and discoverability of published research.
            We are actively working on getting indexed in major databases and repositories worldwide.
          </p>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-indigo-300 p-10 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Indexing Details Coming Soon</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            We are in the process of submitting to major indexing databases. Full indexing information
            will be published here once confirmed. Check back regularly for updates.
          </p>
        </div>

        {/* Databases under consideration */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-600" />
            Databases Under Consideration
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'DOAJ (Directory of Open Access Journals)',
              'Scopus',
              'Web of Science',
              'EBSCO',
              'ProQuest',
              'Google Scholar',
            ].map((db, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{db}</p>
                  <p className="text-xs text-amber-600 font-medium">Application in progress</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Access + DOI cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Open Access</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                All articles are freely accessible to readers worldwide under the CC BY 4.0 license.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Unique DOIs</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every published article receives a unique DOI for permanent, citable identification.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-2xl p-8 text-white shadow-xl">
          <h3 className="text-xl font-bold mb-3">Continuous Improvement</h3>
          <p className="text-blue-100 leading-relaxed">
            We are constantly working to expand our indexing coverage to ensure your research reaches
            the widest possible audience. Check back regularly for updates.
          </p>
        </div>

      </div>
    </SidebarLayout>
  );
}