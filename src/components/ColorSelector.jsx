const ColorSelector = ({ detectedColors, selectedColors, setSelectedColors, maxSelectable }) => {
    const toggleColor = (rgb) => {
      const isSelected = selectedColors.some(sel => sel.join(",") === rgb.join(","));
  
      if (isSelected) {
        setSelectedColors(selectedColors.filter(c => c.join(",") !== rgb.join(",")));
      } else {
        if (selectedColors.length >= maxSelectable) {
          alert(`⚠️ Solo puedes seleccionar hasta ${maxSelectable} colores.`);
          return;
        }
        setSelectedColors([...selectedColors, rgb]);
      }
    };
  
    return (
      <div>
        <p><strong>Selecciona hasta {maxSelectable} colores:</strong></p>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {detectedColors.map((rgb, index) => {
            const selected = selectedColors.some(sel => sel.join(",") === rgb.join(","));
            return (
              <div
                key={index}
                onClick={() => toggleColor(rgb)}
                style={{
                  backgroundColor: `rgb(${rgb.join(",")})`,
                  border: selected ? "3px solid #333" : "1px solid #ccc",
                  width: 30,
                  height: 30,
                  margin: 4,
                  cursor: "pointer",
                  borderRadius: 4,
                }}
                title={`rgb(${rgb.join(",")})`}
              />
            );
          })}
        </div>
        <p>Seleccionados: {selectedColors.length} / {maxSelectable}</p>
      </div>
    );
  };
export default ColorSelector;  