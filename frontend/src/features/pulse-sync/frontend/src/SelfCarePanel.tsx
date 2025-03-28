import axios from "axios";

type Ritual = {
    title: string;
    type: string;
    instructions?: string;
    url?: string;
  };
  
  const SelfCarePanel = ({ ritual }: { ritual: Ritual }) => {
    if (!ritual) return null;
    return (
      <div className="mt-6 p-4 bg-blue-50 border rounded">
        <p className="text-lg font-semibold mb-2">✨ AI Self-Care Suggestion</p>
        <p className="text-indigo-600 font-bold">{ritual.title}</p>
        {ritual.instructions && <p className="mt-2 text-sm">{ritual.instructions}</p>}
        {ritual.url && (
          <a
            href={ritual.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block text-blue-500 underline"
          >
            Launch Ritual
          </a>
        )}
      </div>
    );
  };

  const giveFeedback = (accepted: boolean) => {
    axios.post("http://localhost:8000/feedback", {
      mood: ritual.title,
      nudge,
      accepted
    });
  };
  
  {/* Inside component */}
  <div className="mt-4">
    <p className="text-sm text-gray-600">Did this help?</p>
    <button
      onClick={() => giveFeedback(true)}
      className="px-3 py-1 mr-2 bg-green-500 text-white rounded"
    >
      Yes
    </button>
    <button
      onClick={() => giveFeedback(false)}
      className="px-3 py-1 bg-red-500 text-white rounded"
    >
      No
    </button>
  </div>
  
  export default SelfCarePanel;
  