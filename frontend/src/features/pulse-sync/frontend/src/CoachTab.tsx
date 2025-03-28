import { useState } from "react";
import axios from "axios";

const CoachTab = () => {
  const [response, setResponse] = useState("");

  const runCoach = async () => {
    const res = await axios.post("http://localhost:8000/ai-coach", {});
    setResponse(res.data.response);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🤖 PulseSync AI Coach</h2>
      <button onClick={runCoach} className="bg-indigo-600 text-white px-4 py-2 rounded">
        Get Today’s Guidance
      </button>
      {response && (
        <div className="mt-4 p-4 bg-white rounded shadow whitespace-pre-wrap">
          {response}
        </div>
      )}
    </div>
  );
};

export default CoachTab;
