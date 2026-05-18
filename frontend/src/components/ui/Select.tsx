interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  disabled?: boolean;
}

export default function Select({ label, value, onChange, options, disabled }: Props) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.15em] text-gray-500 font-medium mb-2">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2.5 text-sm text-black focus:outline-none focus:border-black transition disabled:opacity-50 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}
