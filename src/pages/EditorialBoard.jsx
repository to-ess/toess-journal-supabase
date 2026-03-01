import React, { useState } from 'react';
import { Users, Award, Shield, Briefcase, ChevronDown, Mail, MapPin, Building2 } from 'lucide-react';

export default function EditorialBoard() {
  const [expandedSection, setExpandedSection] = useState('editor-in-chief');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJsLTItMnptMC00aDJ2Mmg1djJoLTV2Mmg1djJoLTV2Mmg1djJoLTV2Mmgydi0yaC0ydi0yaC0ydi0yaC0ydi0yaC0ydi0yaDJ2LTJoMnYtMmgydi0yaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <Users className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-100">
            Editorial Board
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
            Our distinguished editorial board comprises leading experts from around the world, 
            dedicated to maintaining the highest standards of academic excellence and integrity.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">40+</div>
              <div className="text-sm text-indigo-200 mt-1">Board Members</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">15+</div>
              <div className="text-sm text-indigo-200 mt-1">Countries</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">10</div>
              <div className="text-sm text-indigo-200 mt-1">Committees</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm text-indigo-200 mt-1">Excellence</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-8">

        {/* Editor-in-Chief */}
        <BoardSection
          id="editor-in-chief"
          title="Editor-in-Chief"
          icon={<Award className="w-6 h-6" />}
          color="indigo"
          expanded={expandedSection === 'editor-in-chief'}
          onToggle={() => toggleSection('editor-in-chief')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MemberCardPro
              name="Dr. Karthick Raghunath. K. M."
              credentials="B.Tech., M.E., Ph.D., PDF (USA)"
              role="Editor-in-Chief"
              location="United States"
              featured={true}
            />
          </div>
        </BoardSection>

        {/* Deputy Editors */}
        <BoardSection
          id="deputy-editors"
          title="Deputy Editors-in-Chief"
          icon={<Award className="w-6 h-6" />}
          color="purple"
          expanded={expandedSection === 'deputy-editors'}
          onToggle={() => toggleSection('deputy-editors')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MemberCardPro name="Dr. Balajee Alphonse" credentials="Ph.D." location="India" role="Deputy Editor-in-Chief" />
            <MemberCardPro name="Dr. Chandrasekar. V" credentials="Ph.D." location="India" role="Deputy Editor-in-Chief" />
            <MemberCardPro name="Dr. Arvind. K. S." credentials="Ph.D., PDF" location="India" role="Deputy Editor-in-Chief" />
            <MemberCardPro name="Prof. Ravi Lanke" credentials="Researcher" affiliation="Lumbini Technologies, Vijayawada" location="India" role="Deputy Editor-in-Chief" />
          </div>
        </BoardSection>

        {/* Associate Editors */}
        <BoardSection
          id="associate-editors"
          title="Associate Editors"
          icon={<Users className="w-6 h-6" />}
          color="blue"
          description="Manage manuscript assignments, oversee peer review process, recommend editorial decisions"
          expanded={expandedSection === 'associate-editors'}
          onToggle={() => toggleSection('associate-editors')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MemberCardPro name="Dr. Dac-Nhuong Le" credentials="Professor" affiliation="Haiphong University" location="Vietnam" role="Associate Editor" />
            <MemberCardPro name="Dr. Basim Mohammad Fadel Alhadidi" credentials="Professor" affiliation="Al-Balqa Applied University" location="Jordan" role="Associate Editor" />
            <MemberCardPro name="Dr. Rajan John" credentials="Professor" affiliation="Jazan University" location="Saudi Arabia" role="Associate Editor" />
            <MemberCardPro name="Dr. Nagarajan, S." credentials="Professor" affiliation="Bahir Dar University" location="Ethiopia" role="Associate Editor" />
            <MemberCardPro name="Mr. Shanmugaraj" credentials="AI Researcher" location="Australia" role="Associate Editor" />
            <MemberCardPro name="Dr. Durga Indira. N." credentials="Ph.D., PDF" location="India" role="Associate Editor" />
            <MemberCardPro name="Dr. Venkatesh. K" credentials="Ph.D., Professor" affiliation="SASTRA Deemed University" location="India" role="Associate Editor" />
            <MemberCardPro name="Dr. Shantha Kumar. D" credentials="Ph.D., Professor" affiliation="Saveetha University" location="India" role="Associate Editor" />
            <MemberCardPro name="Dr. Vanitha S." credentials="Ph.D., Professor" affiliation="PES University" location="Bangalore, India" role="Associate Editor" />
          </div>
        </BoardSection>

        {/* Advisory Committee */}
        <BoardSection
          id="advisory"
          title="Advisory Committee"
          icon={<Shield className="w-6 h-6" />}
          color="emerald"
          description="Define journal vision, scope, mission, strategic direction, and institutional partnerships"
          expanded={expandedSection === 'advisory'}
          onToggle={() => toggleSection('advisory')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MemberCardPro name="Mrs. Latha A" credentials="TL & Layout Manager" affiliation="Eximietas Design" location="India" />
            <MemberCardPro name="Mr. Veeramachaneni Dinesh" credentials="Senior Project Manager" affiliation="Xavient Technologies (TELUS)" location="India" />
            <MemberCardPro name="Ms. Giriyappagari Naga Sowmya" credentials="Data Engineer" affiliation="SARGAD" location="USA" />
            <MemberCardPro name="Mr. Yashraj M." credentials="Managing Director" affiliation="LUMBINI Technologies" location="USA" />
            <MemberCardPro name="Mr. Ramesh Chigurupati" credentials="ETL Analyst" affiliation="DataPro" location="USA" />
            <MemberCardPro name="Mrs. Sathya. J. S." affiliation="Wipro Technologies" location="USA" />
            <MemberCardPro name="Mrs. Anisha Mullamuri" affiliation="CloudPay" location="United Kingdom" />
            <MemberCardPro name="Mr. Siddhartha Reddem" credentials="Senior Manager" affiliation="Demandbase" location="India" />
          </div>
        </BoardSection>

        {/* Other Committees - Collapsed by default */}
        <BoardSection
          id="section-editors"
          title="Section Editors Committee"
          icon={<Briefcase className="w-6 h-6" />}
          color="amber"
          description="Handle submissions within subject areas, ensure topical relevance"
          expanded={expandedSection === 'section-editors'}
          onToggle={() => toggleSection('section-editors')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MemberCardPro name="Dr. Manikandan. V" credentials="Ph.D." location="India" />
            <MemberCardPro name="Dr. Vairavel. S" credentials="Ph.D." location="India" />
          </div>
        </BoardSection>

        <BoardSection
          id="copyediting"
          title="Copyediting & Proofreading"
          icon={<Briefcase className="w-6 h-6" />}
          color="rose"
          expanded={expandedSection === 'copyediting'}
          onToggle={() => toggleSection('copyediting')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MemberCardPro name="Dr. Shanmugavalli" credentials="Ph.D., Senior Assistant Professor" affiliation="MAHE" location="Bangalore" />
            <MemberCardPro name="Dr. Umamaheswaran. S." credentials="Ph.D., Professor" affiliation="New Horizon College" location="India" />
          </div>
        </BoardSection>

        <BoardSection
          id="digital-it"
          title="Digital Publishing & IT"
          icon={<Briefcase className="w-6 h-6" />}
          color="cyan"
          description="Website functionality, submission systems, cybersecurity"
          expanded={expandedSection === 'digital-it'}
          onToggle={() => toggleSection('digital-it')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MemberCardPro name="Mr. Nikhil Krishna Sathvik" location="India" />
          </div>
        </BoardSection>

        <BoardSection
          id="marketing"
          title="Marketing & Communications"
          icon={<Briefcase className="w-6 h-6" />}
          color="pink"
          description="Promotion strategies, newsletters, branding"
          expanded={expandedSection === 'marketing'}
          onToggle={() => toggleSection('marketing')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MemberCardPro name="Prof. Ravi Lanke" location="Vijayawada, India" />
          </div>
        </BoardSection>

        <BoardSection
          id="legal"
          title="Legal & Compliance"
          icon={<Briefcase className="w-6 h-6" />}
          color="red"
          description="Contracts, copyright policies, regulatory compliance"
          expanded={expandedSection === 'legal'}
          onToggle={() => toggleSection('legal')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MemberCardPro name="Mr. Yashraj M." credentials="Managing Director" affiliation="LUMBINI Technologies" location="USA" />
            <MemberCardPro name="Mr. Nagarajan Dasam" credentials="Senior Architect" affiliation="QualiZeal" location="India" />
            <MemberCardPro name="Mr. Shyam Sandeep Dunnala" credentials="Senior Software Engineer" affiliation="ValueLabs" location="India" />
          </div>
        </BoardSection>

        <BoardSection
          id="privacy"
          title="Data Protection & Privacy"
          icon={<Briefcase className="w-6 h-6" />}
          color="violet"
          description="Data compliance, author/reviewer data security"
          expanded={expandedSection === 'privacy'}
          onToggle={() => toggleSection('privacy')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MemberCardPro name="Ms. Giriyappagari Naga Sowmya" credentials="Data Engineer" affiliation="SARGAD" location="USA" />
            <MemberCardPro name="Mr. Velicheti Sree Harsha" credentials="GenAI Engineer" affiliation="Datasmith AI" location="India" />
          </div>
        </BoardSection>

        <BoardSection
          id="special-issues"
          title="Special Issues Committee"
          icon={<Briefcase className="w-6 h-6" />}
          color="teal"
          description="Plan themed issues, coordinate special calls"
          expanded={expandedSection === 'special-issues'}
          onToggle={() => toggleSection('special-issues')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MemberCardPro name="Mrs. Meena. A." credentials="Team Lead" affiliation="ACCENTURE" location="India" />
            <MemberCardPro name="Mrs. Indhumathi J." credentials="B.Tech., M.E." location="India" />
          </div>
        </BoardSection>

        <BoardSection
          id="finance"
          title="Finance & Budget"
          icon={<Briefcase className="w-6 h-6" />}
          color="orange"
          description="Budget planning, financial reporting, resource allocation"
          expanded={expandedSection === 'finance'}
          onToggle={() => toggleSection('finance')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MemberCardPro name="Priya C" credentials="B.Tech., M.E." location="India" />
            <MemberCardPro name="Dr. Durga Indira. N." credentials="Ph.D., PDF" location="India" />
          </div>
        </BoardSection>

      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Editorial Team</h2>
          <p className="text-lg text-indigo-100 mb-8">
            We're always looking for qualified experts to join our editorial board
          </p>
          <button className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
}

// Board Section Component with collapse/expand
function BoardSection({ id, title, icon, color, description, children, expanded, onToggle }) {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600 border-indigo-200',
    purple: 'from-purple-500 to-purple-600 border-purple-200',
    blue: 'from-blue-500 to-blue-600 border-blue-200',
    emerald: 'from-emerald-500 to-emerald-600 border-emerald-200',
    amber: 'from-amber-500 to-amber-600 border-amber-200',
    rose: 'from-rose-500 to-rose-600 border-rose-200',
    cyan: 'from-cyan-500 to-cyan-600 border-cyan-200',
    pink: 'from-pink-500 to-pink-600 border-pink-200',
    red: 'from-red-500 to-red-600 border-red-200',
    violet: 'from-violet-500 to-violet-600 border-violet-200',
    teal: 'from-teal-500 to-teal-600 border-teal-200',
    orange: 'from-orange-500 to-orange-600 border-orange-200',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-md`}>
            {icon}
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
        </div>
        <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      
      {expanded && (
        <div className="p-6 pt-0 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
}

// Professional Member Card
function MemberCardPro({ name, credentials, affiliation, location, role, featured }) {
  return (
    <div className={`group relative bg-white rounded-xl border-2 ${featured ? 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-white' : 'border-gray-100'} p-6 hover:shadow-xl hover:border-indigo-300 transition-all duration-300`}>
      {featured && (
        <div className="absolute -top-3 -right-3">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Featured
          </div>
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className={`w-14 h-14 rounded-full ${featured ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-gradient-to-br from-gray-400 to-gray-500'} flex items-center justify-center text-white text-xl font-bold shadow-md`}>
            {name.charAt(0)}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors leading-tight">
            {name}
          </h3>
          
          {role && (
            <p className="text-xs font-semibold text-indigo-600 mb-2">{role}</p>
          )}
          
          {credentials && (
            <p className="text-sm text-gray-600 mb-2">{credentials}</p>
          )}
          
          {affiliation && (
            <div className="flex items-start gap-1.5 text-xs text-gray-500 mb-1">
              <Building2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>{affiliation}</span>
            </div>
          )}
          
          {location && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}