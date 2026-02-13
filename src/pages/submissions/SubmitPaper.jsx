import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, storage } from "../../services/firebase";
import { createSubmission } from "../../services/submissionService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  User,
  Users,
  BookOpen,
  FileCheck,
} from "lucide-react";

/* ===============================
   CONSTANTS
================================ */

const ARTICLE_TYPES = [
  "Research Article",
  "Short Paper",
  "Survey Paper",
];

const PREFIXES = [
  "Dr.",
  "Mr.",
  "Mrs.",
  "Ms.",
  "Prof.",
];

const CATEGORIES = [
  "Evolutionary Algorithms",
  "Artificial Intelligence",
  "Smart & Adaptive Systems",
  "Optimization Techniques",
  "Swarm Intelligence",
  "Nature-Inspired Computing",
  "Machine Learning",
  "Neural Networks",
  "IoT & Smart Applications",
];

/* ===============================
   HELPERS
================================ */

const emptyAuthor = () => ({
  id: Date.now() + Math.random(),
  prefix: "",
  firstName: "",
  lastName: "",
  email: "",
  institution: "",
  address: "",
  mobile: "",
  isCorresponding: false,
});

const emptyReviewer = () => ({
  id: Date.now() + Math.random(),
  prefix: "",
  firstName: "",
  lastName: "",
  email: "",
  institution: "",
  address: "",
  mobile: "",
});

/* ===============================
   PERSON CARD
================================ */

function PersonCard({
  person,
  index,
  label,
  onChange,
  onRemove,
  canRemove,
  showCorrespondingOption,
  isCorresponding,
  onCorrespondingChange,
}) {

  const update = (field, value) =>
    onChange(index, field, value);

  return (
    <div className="border rounded-lg bg-white">

      {/* HEADER */}
      <div className="flex justify-between bg-gray-50 px-4 py-2 border-b">
        <span className="font-semibold">
          {label} #{index + 1}
        </span>

        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* BODY */}
      <div className="p-4 space-y-3">

        <div className="grid grid-cols-3 gap-3">

          <select
            value={person.prefix}
            onChange={(e) =>
              update("prefix", e.target.value)
            }
            className="border p-2 rounded"
          >
            <option value="">Prefix</option>
            {PREFIXES.map(p =>
              <option key={p}>{p}</option>
            )}
          </select>

          <input
            required
            placeholder="First Name"
            value={person.firstName}
            onChange={(e) =>
              update("firstName", e.target.value)
            }
            className="border p-2 rounded"
          />

          <input
            required
            placeholder="Last Name"
            value={person.lastName}
            onChange={(e) =>
              update("lastName", e.target.value)
            }
            className="border p-2 rounded"
          />

        </div>

        <input
          required
          placeholder="Email"
          value={person.email}
          onChange={(e) =>
            update("email", e.target.value)
          }
          className="border p-2 rounded w-full"
        />

        <input
          required
          placeholder="Institution"
          value={person.institution}
          onChange={(e) =>
            update("institution", e.target.value)
          }
          className="border p-2 rounded w-full"
        />

        {showCorrespondingOption && (
          <label className="flex gap-2">

            <input
              type="radio"
              checked={isCorresponding}
              onChange={() =>
                onCorrespondingChange(index)
              }
            />

            Corresponding Author

          </label>
        )}

      </div>

    </div>
  );
}

/* ===============================
   MAIN COMPONENT
================================ */

export default function SubmitPaper() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({

    articleType: "",
    title: "",
    abstract: "",
    keywords: "",
    category: ""

  });

  const [authors, setAuthors] =
    useState([{ ...emptyAuthor(), isCorresponding: true }]);

  const [reviewers, setReviewers] = useState([]);

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  const [manuscriptId, setManuscriptId] = useState("");

/* ===============================
   HANDLERS
================================ */

const handleChange = (e) => {

  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });

};

const addAuthor = () =>
  setAuthors([...authors, emptyAuthor()]);

const removeAuthor = (index) =>
  setAuthors(authors.filter((_, i) => i !== index));

const updateAuthor = (index, field, value) => {

  const copy = [...authors];

  copy[index][field] = value;

  setAuthors(copy);

};

const setCorrespondingAuthor = (index) => {

  setAuthors(authors.map((a, i) => ({
    ...a,
    isCorresponding: i === index
  })));

};

const handleFileChange = (e) => {

  const f = e.target.files[0];

  if (!f) return;

  if (f.type !== "application/pdf")
    return setError("Only PDF allowed");

  setFile(f);

};

/* ===============================
   SUBMIT
================================ */

const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    setLoading(true);
    setError("");

    const user = auth.currentUser;

    if (!user)
      throw new Error("Login required");

    if (!file)
      throw new Error("Upload PDF");

    /* Upload file */

    const fileRef = ref(
      storage,
      `submissions/${user.uid}/${Date.now()}_${file.name}`
    );

    await uploadBytes(fileRef, file);

    const fileUrl =
      await getDownloadURL(fileRef);

    /* Call Cloud Function */

    const result =
      await createSubmission({

        articleType: formData.articleType,

        title: formData.title,

        abstract: formData.abstract,

        keywords: formData.keywords
          .split(",")
          .map(k => k.trim()),

        category: formData.category,

        authors,

        suggestedReviewers: reviewers,

        fileUrl,

        authorEmail: user.email

      });

    setManuscriptId(result.manuscriptId);

    setSuccess(true);

  }

  catch (err) {

    setError(err.message);

  }

  finally {

    setLoading(false);

  }

};

/* ===============================
   SUCCESS SCREEN
================================ */

if (success)
return (

<div className="flex items-center justify-center h-screen">

<div className="bg-white p-8 border rounded">

<CheckCircle
size={50}
className="text-green-600 mx-auto"
/>

<h2 className="text-xl mt-4">
Submission Successful
</h2>

<p className="mt-2">
Manuscript ID:
</p>

<p className="font-bold text-indigo-600">
{manuscriptId}
</p>

</div>

</div>

);

/* ===============================
   FORM
================================ */

return (

<div className="max-w-3xl mx-auto p-6">

<h1 className="text-2xl font-bold mb-4">
Submit Manuscript
</h1>

{error &&
<div className="text-red-600 mb-4">
{error}
</div>
}

<form onSubmit={handleSubmit}
className="space-y-4">

<select
name="articleType"
required
onChange={handleChange}
className="border p-2 w-full"
>
<option value="">
Select Article Type
</option>

{ARTICLE_TYPES.map(t =>
<option key={t}>{t}</option>
)}

</select>

<input
name="title"
required
placeholder="Title"
onChange={handleChange}
className="border p-2 w-full"
/>

<textarea
name="abstract"
required
placeholder="Abstract"
onChange={handleChange}
className="border p-2 w-full"
/>

<input
name="keywords"
placeholder="Keywords"
onChange={handleChange}
className="border p-2 w-full"
/>

<select
name="category"
required
onChange={handleChange}
className="border p-2 w-full"
>
<option value="">
Select Category
</option>

{CATEGORIES.map(c =>
<option key={c}>{c}</option>
)}

</select>

{/* AUTHORS */}

{authors.map((author, i) =>

<PersonCard

key={author.id}

person={author}

index={i}

label="Author"

onChange={updateAuthor}

onRemove={removeAuthor}

canRemove={authors.length > 1}

showCorrespondingOption

isCorresponding={author.isCorresponding}

onCorrespondingChange={setCorrespondingAuthor}

/>

)}

<button
type="button"
onClick={addAuthor}
className="bg-gray-200 px-3 py-1 rounded"
>
Add Author
</button>

{/* FILE */}

<input
type="file"
accept="application/pdf"
onChange={handleFileChange}
/>

<button
type="submit"
disabled={loading}
className="bg-indigo-600 text-white px-4 py-2 rounded"
>

{loading
? "Submitting..."
: "Submit Paper"}

</button>

</form>

</div>

);

}
