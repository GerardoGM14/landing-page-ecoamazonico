interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
  maxLength?: number;
  type?: 'text' | 'url' | 'email' | 'tel';
}

export default function TextField({ label, value, onChange, placeholder, hint, disabled, maxLength, type = 'text' }: Props) {
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
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className="w-full bg-transparent border-0 border-b border-gray-300 px-0 py-2.5 text-black placeholder-gray-400 focus:outline-none focus:border-black transition disabled:opacity-50"
      />
      {hint && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    </label>
  );
}
