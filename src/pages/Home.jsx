import React from 'react';
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-gray-50 text-gray-900">

      {/* Trust Bar */}
      <div className="bg-indigo-900 text-white text-sm">
        <div className="max-w-7xl mx-auto px-6 py-2 flex flex-wrap justify-center gap-6">
          <span>Peer-Reviewed Journal</span>
          <span>International Publication</span>
          <span>Expert Editorial Board</span>
          <span>Open Access</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-28 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Transactions on Evolutionary Smart Systems
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          An international peer-reviewed journal publishing high-quality
          research in evolutionary computation, intelligent systems,
          and smart technologies.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/submit"
            className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Submit Manuscript
          </Link>

          <Link
            to="/login"
            className="px-8 py-4 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Login / Register
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">About the Journal</h2>

          <p className="text-gray-600 text-lg max-w-4xl mx-auto">
            Transactions on Evolutionary Smart Systems (ToESS) is a scholarly
            international journal dedicated to advancing research in
            evolutionary algorithms, artificial intelligence, adaptive systems,
            and intelligent computing. The journal aims to bridge theoretical
            foundations and practical applications through a rigorous
            peer-review process.
          </p>
        </div>
      </section>

      {/* Aims & Objectives */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Aims & Objectives
          </h2>

          <p className="text-gray-600 text-lg max-w-4xl mx-auto text-center">
            The primary aim of ToESS is to provide a high-quality platform for
            researchers, academicians, and industry professionals to publish
            innovative and impactful research in evolutionary and smart systems.
          </p>

          <ul className="mt-10 grid md:grid-cols-2 gap-6 text-gray-700 max-w-4xl mx-auto">
            <li>• Promote interdisciplinary and innovative research</li>
            <li>• Encourage real-world and industrial applications</li>
            <li>• Support emerging research trends and technologies</li>
            <li>• Ensure ethical and transparent publication practices</li>
          </ul>
        </div>
      </section>

      {/* Scope Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Scope & Focus Areas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Evolutionary Algorithms",
              "Artificial Intelligence",
              "Smart & Adaptive Systems",
              "Optimization Techniques",
              "Swarm Intelligence",
              "Nature-Inspired Computing",
              "Intelligent Decision Systems",
              "Smart Applications & IoT",
            ].map((item) => (
              <div
                key={item}
                className="bg-gray-50 p-6 rounded-xl border hover:shadow-md transition text-center font-semibold"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Board Preview */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Editorial Board
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              ["Dr. Karthick Raghunath", "Editor-in-Chief"],
            ].map(([name, role]) => (
              <div
                key={name}
                className="bg-white p-6 rounded-xl border text-center"
              >
                <h3 className="font-semibold">{name}</h3>
                <p className="text-indigo-600 text-sm mt-1">{role}</p>
                <p className="text-xs text-gray-500 mt-2">
                  International Researcher
                </p>
              </div>
            ))}
          </div>

          <p className="text-center mt-10 text-indigo-600 font-semibold cursor-pointer">
            View Full Editorial Board →
          </p>
        </div>
      </section>

      {/* Publication Process */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Publication Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {[
              "Register & Verify Email",
              "Submit Manuscript",
              "Peer Review Process",
              "Publication with DOI",
            ].map((step, index) => (
              <div
                key={step}
                className="p-6 border rounded-xl font-semibold bg-gray-50"
              >
                <div className="text-indigo-600 text-2xl mb-2">
                  {index + 1}
                </div>
                {step}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ethics & Policies */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Publication Ethics & Policies
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-2">Peer Review</h3>
              <p className="text-sm text-gray-600">
                Double-blind peer review by subject experts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-2">Plagiarism Check</h3>
              <p className="text-sm text-gray-600">
                All manuscripts are screened for originality.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-2">COPE Compliance</h3>
              <p className="text-sm text-gray-600">
                Ethical standards following COPE guidelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call for Papers */}
      <section className="bg-indigo-700 text-white py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Call for Papers – Current Issue
        </h2>

        <p className="max-w-3xl mx-auto mb-8 text-lg">
          ToESS invites original research articles, review papers, and
          technical notes in all areas within the journal scope.
        </p>

        <Link
          to="/submit"
          className="inline-block px-8 py-4 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-gray-100"
        >
          Submit Your Manuscript
        </Link>
      </section>

    </div>
  );
}
