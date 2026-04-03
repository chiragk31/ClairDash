// ─── InputField ───────────────────────────────────────────────────────────────
// Reusable labeled input — sharp edges per spec (no border-radius).

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id:    string;
  label: string;
  rightSlot?: React.ReactNode; // e.g. "Forgot password?" link
}

export default function InputField({ id, label, rightSlot, ...rest }: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label
          htmlFor={id}
          className="text-xs font-bold uppercase tracking-widest text-[#aba9b9]"
        >
          {label}
        </label>
        {rightSlot}
      </div>
      <input
        id={id}
        className="w-full bg-[#12121e] border border-[#474754] text-[#e9e6f7] placeholder-[#474754] px-4 py-3 rounded-none outline-none focus:border-[#8a4cfc] transition-colors duration-300 text-sm"
        {...rest}
      />
    </div>
  );
}
