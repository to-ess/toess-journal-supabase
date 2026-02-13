import { BrowserRouter, Routes, Route } from "react-router-dom";

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

/* ================= ROUTES & LAYOUT ================= */
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import MainLayout from "./layouts/MainLayout";

export default function App() {
  return (
    <BrowserRouter>
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

        {/* ================= USEFUL / SIDEBAR ================= */}
        <Route path="/plagiarism-policy" element={<MainLayout><PlagiarismPolicy /></MainLayout>} />
        <Route path="/peer-review" element={<MainLayout><PeerReview /></MainLayout>} />
        <Route path="/special-issue" element={<MainLayout><SpecialIssue /></MainLayout>} />
        <Route path="/reviewer-guidelines" element={<MainLayout><ReviewerGuidelines /></MainLayout>} />
        <Route path="/indexing" element={<MainLayout><Indexing /></MainLayout>} />

        {/* ================= SETTINGS (AUTH REQUIRED) ================= */}
        <Route
          path="/settings/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfileSettings />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/change-password"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ChangePassword />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/email"
          element={
            <ProtectedRoute>
              <MainLayout>
                <EmailPreferences />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/notifications"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Notifications />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/security"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Security />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ================= AUTHOR ================= */}
        <Route
          path="/dashboard/author"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AuthorDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/submit"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SubmitPaper />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-submissions"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MySubmissions />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <MainLayout>
                  <AdminDashboard />
                </MainLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/submissions"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <MainLayout>
                  <AdminSubmissions />
                </MainLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
