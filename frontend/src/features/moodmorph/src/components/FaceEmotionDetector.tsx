import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

type Mode = 'focus' | 'calm' | 'power' | 'restore';

interface Props {
  onDetect: (mode: Mode) => void;
}

const mapExpressionToMode = (expression: string): Mode => {
  switch (expression) {
    case 'happy': return 'power';
    case 'neutral': return 'focus';
    case 'sad': return 'calm';
    case 'angry': return 'restore';
    default: return 'focus';
  }
};

const FaceEmotionDetector: React.FC<Props> = ({ onDetect }) => {
  const webcamRef = useRef<Webcam>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      setReady(true);
    };

    loadModels();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        ready
      ) {
        const detections = await faceapi.detectSingleFace(
          webcamRef.current.video as HTMLVideoElement,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceExpressions();

        if (detections?.expressions) {
          const topExpression = Object.entries(detections.expressions)
            .sort((a, b) => b[1] - a[1])[0][0];

          const mode = mapExpressionToMode(topExpression);
          onDetect(mode);
        }
      }
    }, 3000); // scan every 3 seconds

    return () => clearInterval(interval);
  }, [ready, onDetect]);

  return (
    <div className="hidden">
      <Webcam
        ref={webcamRef}
        audio={false}
        width={320}
        height={240}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'user' }}
      />
    </div>
  );
};

export default FaceEmotionDetector;
