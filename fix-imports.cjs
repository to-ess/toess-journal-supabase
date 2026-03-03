const fs = require("fs");
const path = require("path");

// Files to fix based on the errors
const fixes = [
  // Each entry: [filePath, replacements[]]
  {
    file: "src/pages/PaperDetail.jsx",
    replacements: [
      { from: `import { doc, getDoc } from "firebase/firestore";`, to: `` },
      { from: `import { db } from "../services/firebase";`, to: `import { supabase } from "../services/supabase";` },
    ]
  },
  {
    file: "src/pages/Home.jsx",
    replacements: [
      { from: `import { useAuthState } from "react-firebase-hooks/auth";`, to: `` },
      { from: `import { auth } from "../services/firebase";`, to: `import { supabase } from "../services/supabase";` },
    ]
  },
  {
    file: "src/pages/Register.jsx",
    replacements: [
      { from: `import { auth } from "../services/firebase";`, to: `import { supabase } from "../services/supabase";` },
    ]
  },
  {
    file: "src/pages/ForgotPassword.jsx",
    replacements: [
      { from: `import { sendPasswordResetEmail } from "firebase/auth";`, to: `` },
      { from: `import { auth } from "../services/firebase";`, to: `import { supabase } from "../services/supabase";` },
    ]
  },
  {
    file: "src/pages/ReviewerRegistration.jsx",
    replacements: [
      { from: `import { onAuthStateChanged } from "firebase/auth";`, to: `import { observeAuth } from "../services/authService";` },
      { from: `import { auth } from "../services/firebase";`, to: `import { supabase } from "../services/supabase";` },
    ]
  },
  {
    file: "src/pages/dashboard/AdminDashboard.jsx",
    replacements: [
      { from: `import { auth } from "../../services/firebase";`, to: `import { supabase } from "../../services/supabase";` },
    ]
  },
  {
    file: "src/pages/dashboard/AuthorDashboard.jsx",
    replacements: [
      { from: `import { auth } from "../../services/firebase";`, to: `import { supabase } from "../../services/supabase";` },
    ]
  },
  {
    file: "src/pages/dashboard/ReviewerDashboard.jsx",
    replacements: [
      { from: `import { onAuthStateChanged } from "firebase/auth";`, to: `import { observeAuth } from "../../services/authService";` },
      { from: `import { auth } from "../../services/firebase";`, to: `import { supabase } from "../../services/supabase";` },
    ]
  },
  {
    file: "src/pages/submissions/SubmitPaper.jsx",
    replacements: [
      { from: `import { auth, storage } from "../../services/firebase";`, to: `import { supabase } from "../../services/supabase";` },
    ]
  },
  {
    file: "src/pages/submissions/MySubmissions.jsx",
    replacements: [
      { from: `import { auth } from "../../services/firebase";`, to: `import { supabase } from "../../services/supabase";` },
    ]
  },
  {
    file: "src/pages/settings/ChangePassword.jsx",
    replacements: [
      { from: `import { auth } from "../../services/firebase";`, to: `import { supabase } from "../../services/supabase";` },
      { from: `import {\n  reauthenticateWithCredential,\n  EmailAuthProvider,\n  updatePassword\n} from "firebase/auth";`, to: `` },
      { from: `import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";`, to: `` },
    ]
  },
  {
    file: "src/pages/settings/ProfileSettings.jsx",
    replacements: [
      { from: `import { auth } from "../../services/firebase";`, to: `import { supabase } from "../../services/supabase";` },
      { from: `import { updateProfile } from "firebase/auth";`, to: `` },
    ]
  },
  {
    file: "src/pages/settings/Security.jsx",
    replacements: [
      { from: `import { auth } from "../../services/firebase";`, to: `import { supabase } from "../../services/supabase";` },
      { from: `import { sendPasswordResetEmail } from "firebase/auth";`, to: `` },
    ]
  },
  {
    file: "src/routes/ProtectedRoute.jsx",
    replacements: [
      { from: `import { auth } from "../services/firebase";`, to: `import { supabase } from "../services/supabase";` },
    ]
  },
  {
    file: "src/routes/AdminRoute.jsx",
    replacements: [
      { from: `import { auth } from "../services/firebase";`, to: `import { supabase } from "../services/supabase";` },
    ]
  },
  {
    file: "src/components/Navbar.jsx",
    replacements: [
      { from: `import { onAuthStateChanged, signOut } from "firebase/auth";`, to: `import { observeAuth, logoutUser } from "../services/authService";` },
      { from: `import { auth } from "../services/firebase";`, to: `import { supabase } from "../services/supabase";` },
    ]
  },
];

// Also do a global sweep for any remaining firebase imports
function globalSweep(content) {
  return content
    // Remove any leftover firebase imports
    .replace(/import \{[^}]+\} from ["']firebase\/firestore["'];?\n?/g, "")
    .replace(/import \{[^}]+\} from ["']firebase\/auth["'];?\n?/g, "")
    .replace(/import \{[^}]+\} from ["']firebase\/storage["'];?\n?/g, "")
    .replace(/import \{[^}]+\} from ["']firebase\/functions["'];?\n?/g, "")
    .replace(/import \{[^}]+\} from ["']react-firebase-hooks\/auth["'];?\n?/g, "")
    // Replace auth.currentUser → supabase.auth.getUser()
    .replace(/auth\.currentUser/g, "supabase.auth.getUser()")
    // Replace onAuthStateChanged(auth, ...) → observeAuth(...)
    .replace(/onAuthStateChanged\(auth,\s*/g, "observeAuth(")
    // Replace signOut(auth) → logoutUser()
    .replace(/signOut\(auth\)/g, "logoutUser()")
    // Replace sendPasswordResetEmail(auth, email) → supabase.auth.resetPasswordForEmail(email)
    .replace(/sendPasswordResetEmail\(auth,\s*([^)]+)\)/g, "supabase.auth.resetPasswordForEmail($1)")
    // Replace useAuthState(auth) → supabase session (just flag it)
    .replace(/useAuthState\(auth\)/g, "/* TODO: use supabase session */ useState(null)");
}

let totalFixed = 0;
let totalFiles = 0;

for (const { file, replacements } of fixes) {
  const fullPath = path.join(process.cwd(), file);

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  File not found: ${file}`);
    continue;
  }

  let content = fs.readFileSync(fullPath, "utf8");
  let changed = false;

  for (const { from, to } of replacements) {
    if (content.includes(from)) {
      content = content.replace(from, to);
      changed = true;
      totalFixed++;
    }
  }

  // Always run global sweep
  const swept = globalSweep(content);
  if (swept !== content) {
    content = swept;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fullPath, content, "utf8");
    console.log(`✅ Fixed: ${file}`);
    totalFiles++;
  } else {
    console.log(`⏭️  No changes needed: ${file}`);
  }
}

console.log(`\n🎉 Done! Fixed ${totalFiles} files (${totalFixed} import replacements)`);
console.log(`\n⚠️  NOTE: Some pages may still need manual fixes for:`);
console.log(`   - auth.currentUser usage (now async with Supabase)`);
console.log(`   - ChangePassword page (needs Supabase password update logic)`);
console.log(`   - ProfileSettings page (needs Supabase profile update logic)`);