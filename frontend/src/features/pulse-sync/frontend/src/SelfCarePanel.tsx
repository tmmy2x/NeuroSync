import React from "react";
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

  const giveFeedback = (ritual: Ritual, accepted: boolean) => {
      const nudge = "defaultNudgeValue"; // Replace with an appropriate value or logic
      axios.post("http://localhost:8000/feedback", {
        mood: ritual.title,
        nudge,
        accepted
      });
    };
  
  <div className="mt-4">
    <p className="text-sm text-gray-600">Did this help?</p>
    <button
      onClick={() => giveFeedback(ritual, true)}
      className="px-3 py-1 mr-2 bg-green-500 text-white rounded"
    >
      Yes
    </button>
    <button
      onClick={() => giveFeedback(ritual, false)}
      className="px-3 py-1 bg-red-500 text-white rounded"
    >
      No
    </button>
  </div>
  
  export default SelfCarePanel;
  