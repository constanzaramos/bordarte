import { useState, useEffect } from "react";

const hueCategories = [
  "red", "orange", "yellow", "green", "cyan", "blue", "purple", "magenta", "pink", "gray"
];

const defaultProportions = {
  red: 0,
  orange: 0,
  yellow: 1,
  green: 2,
  cyan: 1,
  blue: 2,
  purple: 1,
  magenta: 0,
  pink: 0,
  gray: 2
};

const ToneSelector = ({ totalColors, onChange }) => {
  const [tonePrefs, setTonePrefs] = useState(defaultProportions);

  useEffect(() => {
    onChange(tonePrefs);
  }, [tonePrefs, onChange]);

  const handleChange = (tone, value) => {
    const newPrefs = {
      ...tonePrefs,
      [tone]: parseInt(value)
    };
    setTonePrefs(newPrefs);
  };

  const totalSelected = Object.values(tonePrefs).reduce((a, b) => a + b, 0);

  return (
    <div className="tone-selector">
      <h3>Distribuye los {totalColors} colores entre tonos:</h3>
      {hueCategories.map((tone) => (
        <div key={tone} className="tone-slider">
          <label>
            {tone.charAt(0).toUpperCase() + tone.slice(1)} ({tonePrefs[tone]})
          </label>
          <input
            type="range"
            min="0"
            max={totalColors}
            value={tonePrefs[tone]}
            onChange={(e) => handleChange(tone, e.target.value)}
          />
        </div>
      ))}
      <p><strong>Total seleccionado:</strong> {totalSelected} / {totalColors}</p>
    </div>
  );
};

export default ToneSelector;
