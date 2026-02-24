export const CheckFeature = ({ label }: { label: string }) => {
    return (
        <div className="flex items-center gap-2.5">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L3.5 7L8.5 2.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <span className="text-sm text-gray-700">{label}</span>
        </div>
    );
};

// export const CheckFeature = ({label}: {
//     label: string;
// }) => {
//     return <div className="flex">
//         <div className="pr-4">
//             <CheckMark />
//         </div>
//         {label}
//     </div>
// }

// function CheckMark() {
//     return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="green" className="size-5">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
//     </svg>
  
// }