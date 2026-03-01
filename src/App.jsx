import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef } from "react";

/* ================= PUBLIC PAGES ================= */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Archives from "./pages/Archives";
import PaperDetail from "./pages/PaperDetail";
import Scope from "./pages/Scope";
import Guidelines from "./pages/Guidelines";
import Contact from "./pages/Contact";
import EditorialBoard from "./pages/EditorialBoard";

/* ================= USEFUL / SIDEBAR ================= */
import PlagiarismPolicy from "./pages/PlagiarismPolicy";
import PeerReview from "./pages/PeerReview";
import SpecialIssue from "./pages/SpecialIssue";
import ReviewerGuidelines from "./pages/ReviewerGuidelines";
import Indexing from "./pages/Indexing";

/* ================= SETTINGS ================= */
import ProfileSettings from "./pages/settings/ProfileSettings";
import ChangePassword from "./pages/settings/ChangePassword";
import EmailPreferences from "./pages/settings/EmailPreferences";
import Notifications from "./pages/settings/Notifications";
import Security from "./pages/settings/Security";

/* ================= DASHBOARDS ================= */
import AuthorDashboard from "./pages/dashboard/AuthorDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

/* ================= SUBMISSIONS ================= */
import SubmitPaper from "./pages/submissions/SubmitPaper";
import MySubmissions from "./pages/submissions/MySubmissions";
import AdminSubmissions from "./pages/submissions/AdminSubmissions";

/* ================= ADMIN ================= */
import ManageSpecialIssues from "./pages/admin/ManageSpecialIssues";
import AdminAssignReviewers from "./pages/admin/AdminAssignReviewers";
import AdminManageReviewers from "./pages/admin/AdminManageReviewers";
import AdminReviewDecisions from "./pages/admin/AdminReviewDecisions";

/* ================= REVIEWER ================= */
import ReviewerRegistration from "./pages/ReviewerRegistration";
import ReviewerDashboard from "./pages/dashboard/ReviewerDashboard";

/* ================= ROUTES & LAYOUT ================= */
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import MainLayout from "./layouts/MainLayout";

/* ─────────────────────────────────────────
   Global animation styles injected once
───────────────────────────────────────── */
const GLOBAL_STYLES = `
  /* Page enter animation */
  @keyframes pageEnter {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Subtle top progress bar */
  @keyframes progressBar {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  /* Progress bar fade out */
  @keyframes progressFade {
    0%   { opacity: 1; }
    80%  { opacity: 1; }
    100% { opacity: 0; }
  }

  .page-transition {
    animation: pageEnter 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  /* Top loading bar */
  .progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 2.5px;
    background: linear-gradient(90deg, #1d4ed8, #6366f1, #3b82f6);
    transform-origin: left;
    z-index: 9999;
    border-radius: 0 2px 2px 0;
    animation:
      progressBar 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards,
      progressFade 0.6s ease 0.3s forwards;
    box-shadow: 0 0 8px rgba(99, 102, 241, 0.6);
  }
`;

/* ─────────────────────────────────────────
   Scroll to top + page transition wrapper
───────────────────────────────────────── */
function PageTransition({ children }) {
  const { pathname } = useLocation();
  const barRef = useRef(null);

  useLayoutEffect(() => {
    // Instant scroll reset
    window.scrollTo({ top: 0, behavior: "instant" });

    // Inject progress bar
    const bar = document.createElement("div");
    bar.className = "progress-bar";
    document.body.appendChild(bar);
    barRef.current = bar;

    const timer = setTimeout(() => {
      bar.remove();
    }, 900);

    return () => {
      clearTimeout(timer);
      bar.remove();
    };
  }, [pathname]);

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   Inject global styles once on mount
───────────────────────────────────────── */
function GlobalStyles() {
  useEffect(() => {
    const id = "app-global-styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = GLOBAL_STYLES;
      document.head.appendChild(style);
    }
  }, []);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <PageTransition>
        <Routes>

          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
          <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
          <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
          <Route path="/archives" element={<MainLayout><Archives /></MainLayout>} />
          <Route path="/paper/:id" element={<MainLayout><PaperDetail /></MainLayout>} />
          <Route path="/scope" element={<MainLayout><Scope /></MainLayout>} />
          <Route path="/guidelines" element={<MainLayout><Guidelines /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
          <Route path="/editorial-board" element={<MainLayout><EditorialBoard /></MainLayout>} />

          {/* ================= USEFUL ================= */}
          <Route path="/plagiarism-policy" element={<MainLayout><PlagiarismPolicy /></MainLayout>} />
          <Route path="/peer-review" element={<MainLayout><PeerReview /></MainLayout>} />
          <Route path="/special-issue" element={<MainLayout><SpecialIssue /></MainLayout>} />
          <Route path="/reviewer-guidelines" element={<MainLayout><ReviewerGuidelines /></MainLayout>} />
          <Route path="/indexing" element={<MainLayout><Indexing /></MainLayout>} />

          {/* ================= REVIEWER REGISTRATION ================= */}
          <Route
            path="/reviewer-registration"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ReviewerRegistration />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* ================= SETTINGS ================= */}
          <Route path="/settings/profile" element={<ProtectedRoute><MainLayout><ProfileSettings /></MainLayout></ProtectedRoute>} />
          <Route path="/settings/change-password" element={<ProtectedRoute><MainLayout><ChangePassword /></MainLayout></ProtectedRoute>} />
          <Route path="/settings/email" element={<ProtectedRoute><MainLayout><EmailPreferences /></MainLayout></ProtectedRoute>} />
          <Route path="/settings/notifications" element={<ProtectedRoute><MainLayout><Notifications /></MainLayout></ProtectedRoute>} />
          <Route path="/settings/security" element={<ProtectedRoute><MainLayout><Security /></MainLayout></ProtectedRoute>} />

          {/* ================= AUTHOR ================= */}
          <Route path="/dashboard/author" element={<ProtectedRoute><MainLayout><AuthorDashboard /></MainLayout></ProtectedRoute>} />
          <Route path="/submit" element={<ProtectedRoute><MainLayout><SubmitPaper /></MainLayout></ProtectedRoute>} />
          <Route path="/my-submissions" element={<ProtectedRoute><MainLayout><MySubmissions /></MainLayout></ProtectedRoute>} />

          {/* ================= REVIEWER ================= */}
          <Route path="/reviewer/dashboard" element={<ProtectedRoute><MainLayout><ReviewerDashboard /></MainLayout></ProtectedRoute>} />

          {/* ================= ADMIN ================= */}
          <Route path="/dashboard/admin" element={<ProtectedRoute><AdminRoute><MainLayout><AdminDashboard /></MainLayout></AdminRoute></ProtectedRoute>} />
          <Route path="/dashboard/admin/submissions" element={<ProtectedRoute><AdminRoute><MainLayout><AdminSubmissions /></MainLayout></AdminRoute></ProtectedRoute>} />
          <Route path="/dashboard/admin/special-issues" element={<ProtectedRoute><AdminRoute><MainLayout><ManageSpecialIssues /></MainLayout></AdminRoute></ProtectedRoute>} />
          <Route path="/dashboard/admin/assign-reviewers" element={<ProtectedRoute><AdminRoute><MainLayout><AdminAssignReviewers /></MainLayout></AdminRoute></ProtectedRoute>} />
          <Route path="/dashboard/admin/manage-reviewers" element={<ProtectedRoute><AdminRoute><MainLayout><AdminManageReviewers /></MainLayout></AdminRoute></ProtectedRoute>} />
          <Route path="/dashboard/admin/review-decisions" element={<ProtectedRoute><AdminRoute><MainLayout><AdminReviewDecisions /></MainLayout></AdminRoute></ProtectedRoute>} />

        </Routes>
      </PageTransition>
    </BrowserRouter>
  );
}