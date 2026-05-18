interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
  disabled?: boolean;
  maxLength?: number;
}

export default function TextArea({ label, value, onChange, placeholder, hint, rows = 4, disabled, maxLength }: Props) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[11px] uppercase tracking-[0.15em] text-gray-500 font-medium">{label}</span>
        {maxLength && (
          <span className={`text-[11px] ${value.length > maxLength * 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        maxLength={maxLength}
        className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:bg-white transition disabled:opacity-50 resize-y leading-relaxed"
      />
      {hint && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    </label>
  );
}
