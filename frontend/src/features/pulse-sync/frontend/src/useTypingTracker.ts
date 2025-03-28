import * as faceapi from "face-api.js";
import { useState, useEffect } from "react";

export const useFacialEmotion = () => {
    const [emotion, setEmotion] = useState("Neutral");
  
    useEffect(() => {
      const loadModels = async () => {
        const MODEL_URL = "/models"; // make sure you copy models into public/models
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  
        const video = document.getElementById("video") as HTMLVideoElement;
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          video.srcObject = stream;
          video.play();
        });
  
        video.addEventListener("play", () => {
          const interval = setInterval(async () => {
            const detections = await faceapi
              .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
              .withFaceExpressions();
            if (detections.length > 0) {
              const emotions = detections[0].expressions;
              const topEmotion = Object.entries(emotions).reduce((a, b) =>
                a[1] > b[1] ? a : b
              );
              setEmotion(topEmotion[0]);
            }
          }, 1000);
          return () => clearInterval(interval);
        });
      };
  
      loadModels();
    }, []);
  
    return emotion;
  };

export const useTypingTracker = () => {
  const [text, setText] = useState("");
  const [metrics, setMetrics] = useState({ speed: 0, hesitation: 0 });
  let lastTime = Date.now();
  let hesitationCount = 0;

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const now = Date.now();
    const delta = now - lastTime;
    if (delta > 1000) hesitationCount++;
    const chars = e.target.value.length;
    const speed = chars / (delta / 1000);

    setText(e.target.value);
    setMetrics({ speed, hesitation: hesitationCount });
    lastTime = now;
  };

  return { text, metrics, onChange };
};
