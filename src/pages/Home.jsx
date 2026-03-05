import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/lottie/loading.json";

export default function Home() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [minTimerDone, setMinTimerDone] = useState(false);

  // Loading screen shows until BOTH auth resolves AND minimum timer fires
  const loading = !authReady || !minTimerDone;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    // Minimum 3 seconds of loader visibility
    const timer = setTimeout(() => setMinTimerDone(true), 2000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  /* ---------- LOADING SCREEN ---------- */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-64">
          <Lottie animationData={loadingAnimation} loop={true} speed={3} />
          <p className="text-center text-gray-600 mt-4 font-medium">
            Loading journal portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section with Deep Blue Background */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Breadcrumb */}
          <div className="text-sm mb-8 text-blue-200">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">›</span>
            <span>Transactions on Evolutionary Smart Systems</span>
          </div>

          <div className="grid md:grid-cols-[200px_1fr] gap-8 items-start">
            {/* Journal Cover */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <img
                src="/journal-cover.jpeg"
                alt="Transactions on Evolutionary Smart Systems - Journal Cover"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Title and Details */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Transactions on Evolutionary Smart Systems
              </h1>

              {/* Publishing Model */}
              <div className="mb-6">
                <div className="text-sm text-blue-200 mb-2">
                  Publishing model
                </div>
                <div className="inline-block bg-blue-800 px-4 py-2 rounded-md font-semibold">
                  Open access
                </div>
              </div>

              {/* Submit Button */}
              <Link
                to="/submit"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg"
              >
                Submit your manuscript
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>

              {/* Login/Register Button */}
              {!user && (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-3 ml-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Peer-Reviewed Journal</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">International Publication</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span className="font-medium">Expert Editorial Board</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Open Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-16 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            About the Journal
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Transactions on Evolutionary Smart Systems (ToESS) is a scholarly
            international journal dedicated to advancing research in
            evolutionary algorithms, artificial intelligence, adaptive systems,
            and intelligent computing. The journal aims to bridge theoretical
            foundations and practical applications through a rigorous
            peer-review process.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            The primary aim of ToESS is to provide a high-quality platform for
            researchers, academicians, and industry professionals to publish
            innovative and impactful research in evolutionary and smart systems.
          </p>
        </div>
      </section>

      {/* Aims & Objectives */}
      <section className="py-16 bg-gray-50 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Aims & Objectives
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Interdisciplinary Research",
                desc: "Promote innovative research across multiple disciplines",
              },
              {
                title: "Real-World Applications",
                desc: "Encourage practical and industrial implementations",
              },
              {
                title: "Emerging Technologies",
                desc: "Support cutting-edge research trends and methodologies",
              },
              {
                title: "Ethical Publishing",
                desc: "Ensure transparent and ethical publication practices",
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scope Section */}
      <section className="py-16 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Scope & Focus Areas
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                className="bg-white p-4 border-l-4 border-indigo-600 shadow-sm hover:shadow-md transition"
              >
                <span className="font-medium text-gray-800 text-sm">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Board */}
      <section className="py-16 bg-gray-50 border-b">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Editorial Board
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
            Our editorial board comprises distinguished researchers and
            academicians from leading institutions worldwide, ensuring the
            highest standards of peer review and academic excellence.
          </p>

          <Link
            to="/editorial-board"
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
          >
            View Full Editorial Board
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Publication Process */}
      <section className="py-16 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Publication Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Register & Verify Email",
                desc: "Create your account",
              },
              {
                step: "2",
                title: "Submit Manuscript",
                desc: "Upload your research",
              },
              {
                step: "3",
                title: "Peer Review Process",
                desc: "Expert evaluation",
              },
              {
                step: "4",
                title: "Publication with DOI",
                desc: "Get published",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white text-2xl font-bold rounded-full mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ethics & Policies */}
      <section className="py-16 bg-gray-50 border-b">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Publication Ethics & Policies
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Peer Review</h3>
              <p className="text-sm text-gray-600">
                Double-blind peer review by subject experts ensuring quality and
                rigor.
              </p>
            </div>

            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Plagiarism Check
              </h3>
              <p className="text-sm text-gray-600">
                All manuscripts are screened for originality using advanced
                tools.
              </p>
            </div>

            <div className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                COPE Compliance
              </h3>
              <p className="text-sm text-gray-600">
                Ethical standards following COPE guidelines for academic
                publishing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call for Papers */}
      <section className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Call for Papers – Current Issue
          </h2>

          <p className="text-xl mb-8 text-blue-100">
            ToESS invites original research articles, review papers, and
            technical notes in all areas within the journal scope.
          </p>

          <Link
            to="/submit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-blue-50 transition shadow-lg text-lg"
          >
            Submit Your Manuscript
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
