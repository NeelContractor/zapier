export const ZapCell = ({
    name,
    index,
    onClick,
}: {
    name?: string;
    index: number;
    onClick: () => void;
}) => {
    return (
        <div
            onClick={onClick}
            className="group flex items-center gap-3 w-[320px] px-5 py-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 hover:shadow-md hover:shadow-orange-50 transition-all"
        >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-orange-50 group-hover:text-orange-600 flex items-center justify-center text-sm font-bold text-gray-500 transition-colors">
                {index}
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                {name || "Click to select"}
            </span>
            <div className="ml-auto text-gray-300 group-hover:text-orange-400 transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </div>
    );
};
