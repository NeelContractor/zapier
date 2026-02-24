"use client";

export const Input = ({
    label,
    placeholder,
    onChange,
    type = "text",
}: {
    label: string;
    placeholder: string;
    onChange: (e: any) => void;
    type?: "text" | "password";
}) => {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
            />
        </div>
    );
};
