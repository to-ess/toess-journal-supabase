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
    <footer
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        color: "#cbd5e1",
        marginTop: "auto",
      }}
    >
      {/* ── Main content ── */}
      <div
        style={{ maxWidth: 1320, margin: "0 auto", padding: "48px 16px 40px" }}
      >
        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 36,
          }}
          className="ft-grid"
        >
          {/* ── Brand ── same logo as Navbar ── */}
          <div>
            {/* Logo: identical structure to Navbar */}
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 11,
                textDecoration: "none",
                marginBottom: 16,
                opacity: 1,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <img
                src="/toess-logo.svg"
                alt="ToESS"
                style={{
                  height: 40,
                  width: 40,
                  objectFit: "contain",
                  filter: "drop-shadow(0 0 2px rgba(255,255,255,0.8))",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#ffffff",
                    letterSpacing: "-0.5px",
                    lineHeight: 1,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  ToESS
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    color: "#94a3b8",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    marginTop: 3,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Evolutionary Smart Systems
                </span>
              </div>
            </Link>

            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: "#94a3b8",
                maxWidth: 320,
                marginBottom: 20,
              }}
            >
              Transactions on Evolutionary Smart Systems is a peer-reviewed
              international journal publishing high-quality research in
              evolutionary algorithms, AI, and smart systems.
            </p>

            {/* Social links */}
            <div style={{ display: "flex", gap: 10 }}>
              {[
                {
                  href: "https://facebook.com",
                  icon: Facebook,
                  label: "Facebook",
                },
                {
                  href: "https://twitter.com",
                  icon: Twitter,
                  label: "Twitter",
                },
                {
                  href: "https://linkedin.com",
                  icon: Linkedin,
                  label: "LinkedIn",
                },
                {
                  href: "https://youtube.com",
                  icon: Youtube,
                  label: "YouTube",
                },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "#1e293b",
                    border: "1px solid #334155",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8",
                    transition: "all 0.2s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4f46e5";
                    e.currentTarget.style.borderColor = "#4f46e5";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#1e293b";
                    e.currentTarget.style.borderColor = "#334155";
                    e.currentTarget.style.color = "#94a3b8";
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Journal links ── */}
          <div>
            <h4
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 18,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <BookOpen size={16} style={{ color: "#818cf8", flexShrink: 0 }} />
              Journal
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {[
                { to: "/", label: "Home" },
                { to: "/scope", label: "Aims & Scope" },
                { to: "/editorial-board", label: "Editorial Board" },
                { to: "/archives", label: "Archives" },
                { to: "/current-issue", label: "Current Issue" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{
                      color: "#94a3b8",
                      textDecoration: "none",
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#818cf8")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#94a3b8")
                    }
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#334155",
                        flexShrink: 0,
                        transition: "background 0.15s",
                      }}
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── For Authors ── */}
          <div>
            <h4
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 18,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Users size={16} style={{ color: "#818cf8", flexShrink: 0 }} />
              For Authors
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {[
                { to: "/submit", label: "Submit Manuscript" },
                { to: "/guidelines", label: "Author Guidelines" },
                { to: "/publication-policy", label: "Publication Policy" },
                { to: "/peer-review", label: "Peer Review Process" },
                { to: "/faqs", label: "FAQs" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{
                      color: "#94a3b8",
                      textDecoration: "none",
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#818cf8")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#94a3b8")
                    }
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#334155",
                        flexShrink: 0,
                      }}
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 18,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Mail size={16} style={{ color: "#818cf8", flexShrink: 0 }} />
              Contact Us
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
              >
                <Mail
                  size={15}
                  style={{ color: "#475569", marginTop: 2, flexShrink: 0 }}
                />
                <div>
                  <p
                    style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}
                  >
                    Editorial Office
                  </p>
                  <a
                    href="mailto:editor@toess.org"
                    style={{
                      color: "#cbd5e1",
                      textDecoration: "none",
                      fontSize: 14,
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#818cf8")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#cbd5e1")
                    }
                  >
                    editor@toess.org
                  </a>
                </div>
              </div>
              <div
                style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
              >
                <FileText
                  size={15}
                  style={{ color: "#475569", marginTop: 2, flexShrink: 0 }}
                />
                <div>
                  <p
                    style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}
                  >
                    ISSN
                  </p>
                  <p style={{ color: "#cbd5e1", fontSize: 14 }}>
                    0000-0000 (Online)
                  </p>
                </div>
              </div>
              <Link
                to="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 18px",
                  background: "#4f46e5",
                  color: "#fff",
                  borderRadius: 9,
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  transition: "background 0.2s",
                  alignSelf: "flex-start",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#4338ca")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#4f46e5")
                }
              >
                Contact Page <ExternalLink size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            borderTop: "1px solid #1e293b",
            marginTop: 44,
            paddingTop: 28,
          }}
        >
          <div className="ft-bottom">
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#64748b", fontSize: 14 }}>
                © {currentYear}{" "}
                <span style={{ color: "#fff", fontWeight: 700 }}>ToESS</span>.
                All rights reserved.
              </p>
              <p style={{ color: "#475569", fontSize: 12, marginTop: 4 }}>
                Transactions on Evolutionary Smart Systems
              </p>
            </div>

            {/* Legal links */}
            <div className="ft-legal">
              {[
                { to: "/privacy-policy", label: "Privacy Policy" },
                { to: "/terms-of-service", label: "Terms of Service" },
                { to: "/disclaimer", label: "Disclaimer" },
                { to: "/sitemap", label: "Sitemap" },
              ].map(({ to, label }, i, arr) => (
                <span
                  key={to}
                  style={{ display: "flex", alignItems: "center", gap: 16 }}
                >
                  <Link
                    to={to}
                    style={{
                      color: "#64748b",
                      textDecoration: "none",
                      fontSize: 13,
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#818cf8")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#64748b")
                    }
                  >
                    {label}
                  </Link>
                  {i < arr.length - 1 && (
                    <span style={{ color: "#1e293b" }} className="ft-dot">
                      •
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Attribution ── */}
      <div style={{ background: "#020617", padding: "12px 16px" }}>
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#334155",
            margin: 0,
          }}
        >
          Open Access &nbsp;•&nbsp; Peer-Reviewed &nbsp;•&nbsp; International
          Publication
        </p>
      </div>

      {/* Responsive styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        footer * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        footer p, footer h4, footer span, footer a { margin: 0; }

        /* Grid: 1 col → 2 col → 4 col */
        .ft-grid {
          grid-template-columns: 1fr !important;
        }
        @media(min-width: 640px) {
          .ft-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media(min-width: 1024px) {
          .ft-grid {
            grid-template-columns: 1.6fr 1fr 1fr 1.2fr !important;
          }
        }

        /* Bottom bar */
        .ft-bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
        }
        @media(min-width: 640px) {
          .ft-bottom {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
          .ft-bottom > div:first-child { text-align: left; }
        }

        /* Legal links */
        .ft-legal {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px 0;
        }
        @media(min-width: 640px) {
          .ft-legal { justify-content: flex-end; }
        }

        /* Hide separator dots on mobile (they stack oddly) */
        @media(max-width: 639px) {
          .ft-dot { display: none; }
          .ft-legal { gap: 8px 16px; }
        }

        /* Padding scales with screen */
        @media(min-width: 480px)  { footer > div:first-child { padding-left: 20px; padding-right: 20px; } }
        @media(min-width: 768px)  { footer > div:first-child { padding-left: 32px; padding-right: 32px; padding-top: 56px; } }
        @media(min-width: 1024px) { footer > div:first-child { padding-left: 48px; padding-right: 48px; } }
      `}</style>
    </footer>
  );
}
