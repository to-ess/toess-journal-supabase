import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { observeAuth, logoutUser } from "../services/authService";
import { supabase } from "../services/supabase";
import { useEffect, useState, useRef } from "react";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  BookOpen,
  Shield,
  Star,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.email === "kmkrphd@gmail.com";
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();
  const dashPath = isAdmin ? "/dashboard/admin" : "/dashboard/author";
  const DashIcon = isAdmin ? Shield : LayoutDashboard;

  useEffect(() => {
    const u = observeAuth(setUser);
    return u;
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/archives", label: "Archives" },
    { to: "/scope", label: "Scope" },
    { to: "/guidelines", label: "Guidelines" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .nb * { font-family: 'Inter', sans-serif; box-sizing: border-box; }

        .nb-shell {
          position: sticky; top: 0; z-index: 999;
          background: #ffffff; border-bottom: 1px solid #e5e7eb;
          transition: box-shadow 0.3s ease;
        }
        .nb-shell.raised { box-shadow: 0 2px 20px rgba(0,0,0,0.07); border-bottom-color: #f3f4f6; }

        /* Inner container */
        .nb-inner {
          max-width: 1320px; margin: 0 auto;
          padding: 0 16px; height: 60px;
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
        }
        @media(min-width:480px)  { .nb-inner { padding: 0 20px; height: 64px; } }
        @media(min-width:768px)  { .nb-inner { padding: 0 24px; height: 68px; } }
        @media(min-width:1024px) { .nb-inner { padding: 0 32px; height: 72px; } }

        /* ── Logo ── */
        .nb-logo { display:flex; align-items:center; gap:9px; text-decoration:none; flex-shrink:0; transition:opacity 0.2s; }
        .nb-logo:hover { opacity: 0.8; }
        .nb-logo img { height:34px; width:34px; object-fit:contain; }
        @media(min-width:480px) { .nb-logo img { height:38px; width:38px; } }
        @media(min-width:768px) { .nb-logo img { height:40px; width:40px; } }

        .nb-logo-text { display:flex; flex-direction:column; }
        .nb-logo-name { font-size:17px; font-weight:800; color:#0f172a; letter-spacing:-0.5px; line-height:1; }
        @media(min-width:480px) { .nb-logo-name { font-size:19px; } }
        @media(min-width:768px) { .nb-logo-name { font-size:20px; } }
        .nb-logo-sub { font-size:9px; font-weight:500; color:#94a3b8; letter-spacing:0.07em; text-transform:uppercase; margin-top:3px; display:none; }
        @media(min-width:480px) { .nb-logo-sub { display:block; } }

        /* ── Nav links (desktop) ── */
        .nb-links { display:none; align-items:center; gap:2px; flex:1; justify-content:center; }
        @media(min-width:1024px) { .nb-links { display:flex; } }

        .nb-link {
          position:relative; padding:7px 12px; font-size:13.5px; font-weight:500;
          color:#4b5563; border-radius:8px; text-decoration:none;
          transition:color 0.15s, background 0.15s; white-space:nowrap;
        }
        @media(min-width:1200px) { .nb-link { padding:7px 15px; font-size:14px; } }
        .nb-link:hover { color:#1d4ed8; background:#eff6ff; }
        .nb-link.active { color:#1d4ed8; font-weight:600; background:#eff6ff; }
        .nb-link.active::after {
          content:''; position:absolute; bottom:5px; left:50%; transform:translateX(-50%);
          width:5px; height:5px; border-radius:50%; background:#2563eb;
        }

        /* ── Right (desktop) ── */
        .nb-right { display:none; align-items:center; gap:8px; flex-shrink:0; }
        @media(min-width:1024px) { .nb-right { display:flex; } }

        .nb-login {
          padding:7px 16px; font-size:13.5px; font-weight:500; color:#374151;
          border-radius:9px; text-decoration:none; border:1.5px solid #e5e7eb;
          background:white; transition:all 0.15s; cursor:pointer; white-space:nowrap;
        }
        .nb-login:hover { color:#1d4ed8; border-color:#bfdbfe; background:#eff6ff; }

        .nb-register {
          padding:7px 18px; font-size:13.5px; font-weight:600; color:white;
          border-radius:9px; text-decoration:none; background:#1d4ed8;
          border:1.5px solid #1d4ed8; transition:all 0.2s; display:inline-block;
          box-shadow:0 1px 3px rgba(29,78,216,0.3); white-space:nowrap;
        }
        .nb-register:hover { background:#1e40af; border-color:#1e40af; transform:translateY(-1px); box-shadow:0 4px 14px rgba(29,78,216,0.35); }

        .nb-dash {
          display:inline-flex; align-items:center; gap:7px;
          padding:7px 14px; font-size:13px; font-weight:600;
          border-radius:9px; text-decoration:none; transition:all 0.18s; white-space:nowrap;
          background:#eff6ff; color:#1d4ed8; border:1.5px solid #bfdbfe;
        }
        .nb-dash:hover { background:#dbeafe; border-color:#93c5fd; transform:translateY(-1px); box-shadow:0 3px 10px rgba(29,78,216,0.12); }
        .nb-dash.admin { background:#f5f3ff; color:#6d28d9; border-color:#ddd6fe; }
        .nb-dash.admin:hover { background:#ede9fe; border-color:#c4b5fd; box-shadow:0 3px 10px rgba(109,40,217,0.12); }

        /* ── Avatar ── */
        .nb-avatar-btn {
          display:flex; align-items:center; gap:7px; padding:4px 10px 4px 4px;
          background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:50px;
          cursor:pointer; transition:all 0.18s;
        }
        .nb-avatar-btn:hover { background:#f1f5f9; border-color:#bfdbfe; box-shadow:0 2px 8px rgba(29,78,216,0.1); }
        .nb-avatar {
          width:32px; height:32px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-size:11px; font-weight:700; color:white; flex-shrink:0;
        }
        @media(min-width:1200px) { .nb-avatar { width:34px; height:34px; font-size:12px; } }
        .nb-avatar-name { font-size:13px; font-weight:600; color:#1e293b; max-width:110px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:none; }
        @media(min-width:1200px) { .nb-avatar-name { display:block; } }
        .nb-chevron { color:#9ca3af; transition:transform 0.22s ease; flex-shrink:0; }
        .nb-chevron.open { transform:rotate(180deg); }

        /* ── Dropdown ── */
        .nb-dropdown {
          position:absolute; right:0; top:calc(100% + 10px);
          width:265px; background:white; border-radius:16px;
          border:1px solid #e5e7eb;
          box-shadow:0 20px 60px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.05);
          overflow:hidden; transform-origin:top right;
          animation:nbDrop 0.2s cubic-bezier(0.34,1.56,0.64,1); z-index:200;
        }
        @keyframes nbDrop { from{opacity:0;transform:scale(0.9) translateY(-8px);} to{opacity:1;transform:scale(1) translateY(0);} }
        .nb-dd-head { padding:14px 16px; background:linear-gradient(135deg,#f8faff,#f0f7ff); border-bottom:1px solid #e5e7eb; display:flex; align-items:center; gap:12px; }
        .nb-dd-name { font-size:13.5px; font-weight:700; color:#0f172a; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .nb-dd-email { font-size:11.5px; color:#6b7280; margin-top:1px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .nb-dd-badge { display:inline-block; margin-top:5px; padding:2px 9px; border-radius:20px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; }
        .nb-dd-sec { padding:6px 0; }
        .nb-dd-sec + .nb-dd-sec { border-top:1px solid #f3f4f6; }
        .nb-dd-item {
          display:flex; align-items:center; gap:11px; padding:9px 16px;
          font-size:13.5px; font-weight:500; color:#374151; text-decoration:none;
          transition:all 0.14s; cursor:pointer; border:none; background:none; width:100%; text-align:left;
        }
        .nb-dd-item:hover { background:#f0f7ff; color:#1d4ed8; }
        .nb-dd-item:hover .nb-dd-ico { background:#dbeafe; color:#1d4ed8; }
        .nb-dd-item.danger:hover { background:#fff1f2; color:#dc2626; }
        .nb-dd-item.danger:hover .nb-dd-ico { background:#fee2e2; color:#dc2626; }
        .nb-dd-ico { width:32px; height:32px; border-radius:8px; background:#f1f5f9; color:#64748b; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.14s; }
        .nb-dd-arrow { margin-left:auto; color:#d1d5db; flex-shrink:0; }

        /* ── Hamburger ── */
        .nb-ham { display:flex; align-items:center; padding:7px; border-radius:8px; border:1.5px solid #e5e7eb; background:white; color:#374151; cursor:pointer; transition:all 0.15s; }
        .nb-ham:hover { background:#f1f5f9; border-color:#d1d5db; }
        @media(min-width:1024px) { .nb-ham { display:none !important; } }

        /* ── Mobile menu ── */
        .nb-mobile { background:white; border-top:1px solid #f1f5f9; padding:10px 16px 18px; animation:nbSlide 0.2s cubic-bezier(0.34,1.2,0.64,1); }
        @keyframes nbSlide { from{opacity:0;transform:translateY(-8px);} to{opacity:1;transform:translateY(0);} }
        .nb-mob-link {
          display:flex; align-items:center; gap:9px; padding:10px 13px;
          font-size:14px; font-weight:500; color:#374151; border-radius:9px;
          text-decoration:none; transition:all 0.14s; border:none; background:none;
          cursor:pointer; width:100%; text-align:left;
        }
        .nb-mob-link:hover, .nb-mob-link.active { background:#eff6ff; color:#1d4ed8; }
        .nb-mob-link.danger { color:#dc2626; }
        .nb-mob-link.danger:hover { background:#fff1f2; }
      `}</style>

      <div className={`nb nb-shell${scrolled ? " raised" : ""}`}>
        <div className="nb-inner">
          {/* ── Logo ── */}
          <Link to="/" className="nb-logo">
            <img src="/toess-logo.svg" alt="ToESS" />
            <div className="nb-logo-text">
              <div className="nb-logo-name">ToESS</div>
              <div className="nb-logo-sub">Evolutionary Smart Systems</div>
            </div>
          </Link>

          {/* ── Center nav (desktop) ── */}
          <nav className="nb-links">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `nb-link${isActive ? " active" : ""}`
                }
              >
                {label}
              </NavLink>
            ))}
            {user && (
              <NavLink
                to="/submit"
                className={({ isActive }) =>
                  `nb-link${isActive ? " active" : ""}`
                }
              >
                Submit
              </NavLink>
            )}
          </nav>

          {/* ── Right (desktop) ── */}
          <div className="nb-right">
            {!user ? (
              <>
                <Link to="/login" className="nb-login">
                  Login
                </Link>
                <Link to="/register" className="nb-register">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={dashPath}
                  className={`nb-dash${isAdmin ? " admin" : ""}`}
                >
                  <DashIcon size={14} />
                  {isAdmin ? "Admin Panel" : "Dashboard"}
                </Link>

                <div style={{ position: "relative" }} ref={dropdownRef}>
                  <button
                    className="nb-avatar-btn"
                    onClick={() => setDropdownOpen((v) => !v)}
                  >
                    <div
                      className="nb-avatar"
                      style={{
                        background: isAdmin
                          ? "linear-gradient(135deg,#7c3aed,#6d28d9)"
                          : "linear-gradient(135deg,#1d4ed8,#2563eb)",
                      }}
                    >
                      {initials}
                    </div>
                    <span className="nb-avatar-name">{displayName}</span>
                    <ChevronDown
                      size={14}
                      className={`nb-chevron${dropdownOpen ? " open" : ""}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="nb-dropdown">
                      <div className="nb-dd-head">
                        <div
                          className="nb-avatar"
                          style={{
                            width: 42,
                            height: 42,
                            fontSize: "14px",
                            flexShrink: 0,
                            background: isAdmin
                              ? "linear-gradient(135deg,#7c3aed,#6d28d9)"
                              : "linear-gradient(135deg,#1d4ed8,#2563eb)",
                          }}
                        >
                          {initials}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div className="nb-dd-name">{displayName}</div>
                          <div className="nb-dd-email">{user.email}</div>
                          <span
                            className="nb-dd-badge"
                            style={{
                              background: isAdmin ? "#ede9fe" : "#dbeafe",
                              color: isAdmin ? "#6d28d9" : "#1d4ed8",
                            }}
                          >
                            {isAdmin ? "Administrator" : "Author"}
                          </span>
                        </div>
                      </div>

                      <div className="nb-dd-sec">
                        <Link
                          to={dashPath}
                          className="nb-dd-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span className="nb-dd-ico">
                            <DashIcon size={14} />
                          </span>
                          {isAdmin ? "Admin Panel" : "Dashboard"}
                          <ChevronRight size={13} className="nb-dd-arrow" />
                        </Link>
                        <Link
                          to="/submit"
                          className="nb-dd-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span className="nb-dd-ico">
                            <FileText size={14} />
                          </span>
                          Submit Paper
                          <ChevronRight size={13} className="nb-dd-arrow" />
                        </Link>
                        {!isAdmin && (
                          <Link
                            to="/reviewer-registration"
                            className="nb-dd-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <span className="nb-dd-ico">
                              <Star size={14} />
                            </span>
                            Apply as Reviewer
                            <ChevronRight size={13} className="nb-dd-arrow" />
                          </Link>
                        )}
                        {isAdmin && (
                          <>
                            <Link
                              to="/dashboard/admin/manage-reviewers"
                              className="nb-dd-item"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <span className="nb-dd-ico">
                                <Users size={14} />
                              </span>
                              Manage Reviewers
                              <ChevronRight size={13} className="nb-dd-arrow" />
                            </Link>
                            <Link
                              to="/dashboard/admin/assign-reviewers"
                              className="nb-dd-item"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <span className="nb-dd-ico">
                                <Sparkles size={14} />
                              </span>
                              Assign Reviewers
                              <ChevronRight size={13} className="nb-dd-arrow" />
                            </Link>
                            <Link
                              to="/dashboard/admin/review-decisions"
                              className="nb-dd-item"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <span className="nb-dd-ico">
                                <BookOpen size={14} />
                              </span>
                              Review Decisions
                              <ChevronRight size={13} className="nb-dd-arrow" />
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="nb-dd-sec">
                        <Link
                          to="/settings/profile"
                          className="nb-dd-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span className="nb-dd-ico">
                            <Settings size={14} />
                          </span>
                          Settings
                          <ChevronRight size={13} className="nb-dd-arrow" />
                        </Link>
                      </div>

                      <div className="nb-dd-sec">
                        <button
                          className="nb-dd-item danger"
                          onClick={handleLogout}
                        >
                          <span className="nb-dd-ico">
                            <LogOut size={14} />
                          </span>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ── Hamburger ── */}
          <button className="nb-ham" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div className="nb-mobile">
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {links.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `nb-mob-link${isActive ? " active" : ""}`
                  }
                >
                  {label}
                </NavLink>
              ))}
              {user && (
                <NavLink
                  to="/submit"
                  className={({ isActive }) =>
                    `nb-mob-link${isActive ? " active" : ""}`
                  }
                >
                  <FileText size={15} /> Submit
                </NavLink>
              )}

              {user ? (
                <div
                  style={{
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: "1px solid #f1f5f9",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {/* User card */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 13px",
                      background: "linear-gradient(135deg,#f8faff,#eff6ff)",
                      border: "1px solid #e0e7ff",
                      borderRadius: 12,
                      marginBottom: 6,
                    }}
                  >
                    <div
                      className="nb-avatar"
                      style={{
                        width: 40,
                        height: 40,
                        fontSize: "13px",
                        flexShrink: 0,
                        background: isAdmin
                          ? "linear-gradient(135deg,#7c3aed,#6d28d9)"
                          : "linear-gradient(135deg,#1d4ed8,#2563eb)",
                      }}
                    >
                      {initials}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#0f172a",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {displayName}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#94a3b8",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.email}
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "2px 9px",
                        borderRadius: 20,
                        flexShrink: 0,
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        background: isAdmin ? "#ede9fe" : "#dbeafe",
                        color: isAdmin ? "#6d28d9" : "#1d4ed8",
                      }}
                    >
                      {isAdmin ? "Admin" : "Author"}
                    </span>
                  </div>

                  <Link to={dashPath} className="nb-mob-link">
                    <DashIcon size={15} />{" "}
                    {isAdmin ? "Admin Panel" : "Dashboard"}
                  </Link>
                  {!isAdmin && (
                    <Link to="/reviewer-registration" className="nb-mob-link">
                      <Star size={15} /> Apply as Reviewer
                    </Link>
                  )}
                  {isAdmin && (
                    <>
                      <Link
                        to="/dashboard/admin/manage-reviewers"
                        className="nb-mob-link"
                      >
                        <Users size={15} /> Manage Reviewers
                      </Link>
                      <Link
                        to="/dashboard/admin/assign-reviewers"
                        className="nb-mob-link"
                      >
                        <Sparkles size={15} /> Assign Reviewers
                      </Link>
                      <Link
                        to="/dashboard/admin/review-decisions"
                        className="nb-mob-link"
                      >
                        <BookOpen size={15} /> Review Decisions
                      </Link>
                    </>
                  )}
                  <Link to="/settings/profile" className="nb-mob-link">
                    <Settings size={15} /> Settings
                  </Link>
                  <button onClick={handleLogout} className="nb-mob-link danger">
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: "1px solid #f1f5f9",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <Link
                    to="/login"
                    className="nb-mob-link"
                    style={{
                      justifyContent: "center",
                      border: "1.5px solid #e5e7eb",
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    style={{
                      display: "block",
                      padding: "10px",
                      textAlign: "center",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "white",
                      borderRadius: 9,
                      background: "#1d4ed8",
                      textDecoration: "none",
                    }}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
