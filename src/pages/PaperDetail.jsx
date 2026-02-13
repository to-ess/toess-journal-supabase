import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useEffect, useState } from "react";

export default function PaperDetail() {
  const { id } = useParams();
  const [paper, setPaper] = useState(null);

  useEffect(() => {
    getDoc(doc(db, "submissions", id)).then(snap =>
      setPaper(snap.data())
    );
  }, [id]);

  if (!paper) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">{paper.title}</h1>
      <p className="text-gray-600 mb-2">{paper.authors}</p>
      <p className="text-sm text-gray-500 mb-6">DOI: {paper.doi}</p>

      <h3 className="font-semibold mb-2">Abstract</h3>
      <p className="text-gray-700">{paper.abstract}</p>
    </div>
  );
}
