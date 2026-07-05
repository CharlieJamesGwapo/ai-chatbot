interface TemperatureSliderProps {
  value: number;
  onChange: (temperature: number) => void;
}

export default function TemperatureSlider({ value, onChange }: TemperatureSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Temperature (Creativity)
        </label>
        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
          {value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="2"
        step="0.01"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
        <span>Precise (0)</span>
        <span>Balanced (1)</span>
        <span>Creative (2)</span>
      </div>
    </div>
  );
}
