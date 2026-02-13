import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";

export default function DashboardNavbar({ title }) {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">{title}</h1>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
