interface Props {
    toggles: {
      text: boolean;
      face: boolean;
      voice: boolean;
    };
    setToggles: (value: Props['toggles']) => void;
  }
  
  const DetectionToggles: React.FC<Props> = ({ toggles, setToggles }) => (
    <div className="flex justify-center gap-4 py-2 text-sm">
      {['text', 'face', 'voice'].map((key) => (
        <label key={key} className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={toggles[key as keyof typeof toggles]}
            onChange={() =>
              setToggles({ ...toggles, [key]: !toggles[key as keyof typeof toggles] })
            }
          />
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </label>
      ))}
    </div>
  );

  export default DetectionToggles;
  