interface ModelSelectorProps {
  value: "gpt-4" | "gpt-3.5-turbo";
  onChange: (model: "gpt-4" | "gpt-3.5-turbo") => void;
}

export default function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        Model
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as "gpt-4" | "gpt-3.5-turbo")}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        <option value="gpt-4">GPT-4</option>
        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
      </select>
    </div>
  );
}
