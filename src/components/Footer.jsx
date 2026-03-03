import { Link } from "react-router-dom";
import { 
  Mail, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube,
  ExternalLink,
  FileText,
  BookOpen,
  Users,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-auto">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">

          {/* About Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-xl">ToESS</h3>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              Transactions on Evolutionary Smart Systems is a peer-reviewed international journal 
              publishing high-quality research in evolutionary algorithms, AI, and smart systems.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Journal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-indigo-400 transition"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/scope" className="text-gray-400 hover:text-indigo-400 transition flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-indigo-400 transition"></span>
                  Aims & Scope
                </Link>
              </li>
              <li>
                <Link to="/editorial-board" className="text-gray-400 hover:text-indigo-400 transition flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-indigo-400 transition"></span>
                  Editorial Board
                </Link>
              </li>
              <li>
                <Link to="/archives" className="text-gray-400 hover:text-indigo-400 transition flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-indigo-400 transition"></span>
                  Archives
                </Link>
              </li>
              <li>
                <Link to="/current-issue" className="text-gray-400 hover:text-indigo-400 transition flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-indigo-400 transition"></span>
                  Current Issue
                </Link>
              </li>
            </ul>
          </div>

          {/* For Authors */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              For Authors
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/submit" className="text-gray-400 hover:text-indigo-400 transition flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-indigo-400 transition"></span>
                  Submit Manuscript
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-gray-400 hover:text-indigo-400 transition flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-indigo-400 transition"></span>
                  Author Guidelines
                </Link>
              </li>
              <li>
                <Link to="/publication-policy" className="text-gray-400 hover:text-indigo-400 transition flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-indigo-400 transition"></span>
                  Publication Policy
                </Link>
              </li>
              <li>
                <Link to="/peer-review" className="text-gray-400 hover:text-indigo-400 transition flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-indigo-400 transition"></span>
                  Peer Review Process
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-400 hover:text-indigo-400 transition flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-indigo-400 transition"></span>
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400" />
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Editorial Office</p>
                  <a href="mailto:editor@toess.org" className="text-gray-300 hover:text-indigo-400 transition">
                    editor@toess.org
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">ISSN</p>
                  <p className="text-gray-300">0000-0000 (Online)</p>
                </div>
              </li>
              <li className="pt-2">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm font-medium"
                >
                  Contact Page
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © {currentYear} <span className="text-white font-semibold">ToESS</span>. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Transactions on Evolutionary Smart Systems
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-indigo-400 transition">
                Privacy Policy
              </Link>
              <span className="text-gray-700">•</span>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-indigo-400 transition">
                Terms of Service
              </Link>
              <span className="text-gray-700">•</span>
              <Link to="/disclaimer" className="text-gray-400 hover:text-indigo-400 transition">
                Disclaimer
              </Link>
              <span className="text-gray-700">•</span>
              <Link to="/sitemap" className="text-gray-400 hover:text-indigo-400 transition">
                Sitemap
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Attribution */}
      <div className="bg-gray-950 py-3">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs text-gray-500">
            Open Access • Peer-Reviewed • International Publication
          </p>
        </div>
      </div>

    </footer>
  );
}