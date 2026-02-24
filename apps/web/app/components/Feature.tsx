export const Feature = ({ title, subtitle }: { title: string; subtitle: string }) => {
    return (
        <div className="flex items-center gap-2 pl-8">
            <div className="flex-shrink-0 w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 4L3 6L7 1.5" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-gray-900">{title}</span>
                <span className="text-sm text-gray-500">{subtitle}</span>
            </div>
        </div>
    );
};

// export const Feature = ({title, subtitle}: {
//     title: string,
//     subtitle: string
// }) => {
//     return <div className="flex pl-8">
//         <Check />
//         <div className="flex flex-col justify-center pl-2">
//             <div className="flex">
//                 <div className="font-bold text-sm">
//                     {title}
//                 </div>

//                 <div className="pl-1 text-sm">
//                     {subtitle}
//                 </div>
//             </div>
//         </div>
//     </div>
// }

// function Check () {
//     return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
//     <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
//   </svg>
  
// }