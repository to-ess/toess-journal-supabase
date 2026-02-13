import { Link, NavLink, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, FileText, Settings } from "lucide-react";
// Import your logo
import LogoSVG from "../assets/toessfl.svg"; // Adjust path as needed

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown-container')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  const handleLogout = async () => {
    await signOut(auth);
    setUserDropdownOpen(false);
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1"
      : "text-gray-700 hover:text-indigo-600 transition pb-1";

  const mobileLinkClass = ({ isActive }) =>
    isActive
      ? "block px-4 py-3 text-indigo-600 font-semibold bg-indigo-50 rounded-lg"
      : "block px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition";

  const isAdmin = user?.email === "kmkrphd@gmail.com";
  
  // Get display name or fallback to email
  const displayName = user?.displayName || user?.email?.split('@')[0] || "User";

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
            {/* SVG Logo */}
            <img 
              src={LogoSVG} 
              alt="ToESS Logo" 
              className="h-10 w-10 object-contain"
            />
            
            {/* Logo Text */}
            <div className="hidden sm:flex flex-col">
              <span className="text-xl font-bold text-gray-900 tracking-tight leading-tight">ToESS</span>
              <span className="text-[10px] text-gray-500 -mt-0.5 leading-tight">
                Evolutionary Smart Systems
              </span>
            </div>
            
            {/* Mobile - Just abbreviation */}
            <span className="sm:hidden text-xl font-bold text-gray-900">ToESS</span>
          </Link>

          {/* Rest of navbar remains the same... */}
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" className={linkClass}>
              <span className="px-4 py-2 block">Home</span>
            </NavLink>
            <NavLink to="/archives" className={linkClass}>
              <span className="px-4 py-2 block">Archives</span>
            </NavLink>
            <NavLink to="/scope" className={linkClass}>
              <span className="px-4 py-2 block">Scope</span>
            </NavLink>
            <NavLink to="/guidelines" className={linkClass}>
              <span className="px-4 py-2 block">Guidelines</span>
            </NavLink>
            <NavLink to="/contact" className={linkClass}>
              <span className="px-4 py-2 block">Contact</span>
            </NavLink>
            {user && (
              <NavLink to="/submit" className={linkClass}>
                <span className="px-4 py-2 block">Submit</span>
              </NavLink>
            )}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center gap-3">
            {!user ? (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition rounded-lg hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg text-sm font-semibold hover:from-indigo-700 hover:to-blue-700 transition shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative user-dropdown-container">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition border border-gray-200 group"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-sm font-bold text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col items-start max-w-[140px]">
                    <span className="text-xs text-gray-500 font-medium">
                      {isAdmin ? "Admin" : "Author"}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 truncate w-full">
                      {displayName}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Enhanced Dropdown */}
                {userDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)}></div>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Header */}
                      <div className="px-4 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-xl font-bold text-white">
                              {displayName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {displayName}
                            </p>
                            <p className="text-xs text-gray-600 truncate">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                                {isAdmin ? "Administrator" : "Author"}
                              </span>
                              {user.emailVerified && (
                                <span className="inline-block px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                  Verified
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Navigation */}
                      <div className="py-2">
                        <div className="px-4 py-2">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Navigation</p>
                        </div>
                        <Link
                          to={isAdmin ? "/dashboard/admin" : "/dashboard/author"}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition group"
                        >
                          <div className="w-8 h-8 bg-gray-100 group-hover:bg-indigo-100 rounded-lg flex items-center justify-center transition">
                            <LayoutDashboard className="w-4 h-4 text-gray-600 group-hover:text-indigo-600" />
                          </div>
                          <span className="font-medium">Dashboard</span>
                        </Link>
                        <Link
                          to="/submit"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition group"
                        >
                          <div className="w-8 h-8 bg-gray-100 group-hover:bg-indigo-100 rounded-lg flex items-center justify-center transition">
                            <FileText className="w-4 h-4 text-gray-600 group-hover:text-indigo-600" />
                          </div>
                          <span className="font-medium">Submit Paper</span>
                        </Link>
                      </div>

                      {/* Settings */}
                      <div className="border-t border-gray-100 py-2">
                        <div className="px-4 py-2">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Settings</p>
                        </div>
                        <Link 
                          to="/profile-settings" 
                          onClick={() => setUserDropdownOpen(false)} 
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition group"
                        >
                          <div className="w-8 h-8 bg-gray-100 group-hover:bg-indigo-100 rounded-lg flex items-center justify-center transition">
                            <Settings className="w-4 h-4 text-gray-600 group-hover:text-indigo-600" />
                          </div>
                          <span className="font-medium">Profile Settings</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-2">
                        <button 
                          onClick={handleLogout} 
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-medium group"
                        >
                          <div className="w-8 h-8 bg-red-50 group-hover:bg-red-100 rounded-lg flex items-center justify-center transition">
                            <LogOut className="w-4 h-4 text-red-600" />
                          </div>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-1 border-t border-gray-100">
            <NavLink to="/" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/archives" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
              Archives
            </NavLink>
            <NavLink to="/scope" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
              Scope
            </NavLink>
            <NavLink to="/guidelines" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
              Guidelines
            </NavLink>
            <NavLink to="/contact" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
              Contact
            </NavLink>
            
            {user ? (
              <>
                <NavLink to="/submit" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
                  Submit Paper
                </NavLink>
                <div className="border-t border-gray-200 mt-2 pt-3 space-y-2">
                  <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                        <p className="text-xs text-gray-600 truncate">{user.email}</p>
                      </div>
                    </div>
                    <span className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                      {isAdmin ? "Administrator" : "Author"}
                    </span>
                  </div>
                  <NavLink 
                    to={isAdmin ? "/dashboard/admin" : "/dashboard/author"} 
                    className={mobileLinkClass} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </div>
                  </NavLink>
                  <NavLink 
                    to="/profile-settings" 
                    className={mobileLinkClass} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </div>
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-200 mt-2 pt-3 space-y-2">
                <Link 
                  to="/login" 
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition font-medium text-center border border-gray-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition text-center shadow-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}