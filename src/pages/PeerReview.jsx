import UsefulSidebar from "../components/UsefulSidebar";

export default function PeerReview() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        <div className="md:col-span-3">
          <h1 className="text-2xl font-bold mb-4">Peer Review Process</h1>

          <p className="text-gray-700 mb-4">
            ToESS follows a rigorous double-blind peer review process to ensure
            the highest quality of published research.
          </p>

          <h3 className="font-semibold mt-6 mb-2">Review Stages</h3>
          <ol className="list-decimal ml-6 text-gray-700 space-y-1">
            <li>Initial editorial screening</li>
            <li>Double-blind peer review</li>
            <li>Revision (minor / major)</li>
            <li>Final decision</li>
          </ol>
        </div>

        <UsefulSidebar />
      </div>
    </div>
  );
}
