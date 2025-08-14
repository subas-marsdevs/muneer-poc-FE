// import { useState } from "react";

// Custom Paragraph Component with Citation Popovers
export default function CustomParagraph({
  children,
  sources,
}: {
  children: React.ReactNode;
  sources?: any;
}) {
  // Check if the text contains numbered citations [1], [2], [3], etc.
  if (!children || typeof children !== "string") {
    return children;
  }
  // Check if there are any citations in the text
  if (!/\[\d+\]/.test(children)) {
    return children;
  }

  console.log("sources", sources);
  // Replace citations with badge components
  const parts = children.split(/(\[\d+\])/g);
  return parts.map((part: string, index: number) => {
    // Check if this part is a citation (matches [number] pattern)
    const citationMatch = part.match(/^\[(\d+)\]$/);
    if (citationMatch) {
      return (
        <span
          key={index}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "12px",
            padding: "2px 8px",
            fontSize: "0.75rem",
            fontWeight: "500",
            cursor: "pointer",
            display: "inline-block",
            margin: "0 2px",
          }}
          title={`Source ${citationMatch[1]}`}
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

// import { useState } from "react";

// // Custom Paragraph Component with Citation Popovers
// export default function CustomParagraph({
//   children,
//   sources,
// }: {
//   children: React.ReactNode;
//   sources?: any;
// }) {
//   const [hoveredCitation, setHoveredCitation] = useState<string | null>(null);

//   const processText = (text: string) => {
//     if (!/\[\d+\]/.test(text)) {
//       return text;
//     }

//     const parts = text.split(/(\[\d+\])/g);

//     return parts.map((part: string, index: number) => {
//       const citationMatch = part.match(/^\[(\d+)\]$/);
//       if (citationMatch) {
//         const citationNumber = citationMatch[1];
//         const source = sources?.[citationNumber];

//         return (
//           <span
//             key={index}
//             className="relative inline-block"
//             onMouseEnter={() => setHoveredCitation(citationNumber)}
//             onMouseLeave={() => setHoveredCitation(null)}
//           >
//             <span
//               style={{
//                 backgroundColor: "#007bff",
//                 color: "white",
//                 borderRadius: "12px",
//                 padding: "2px 8px",
//                 fontSize: "0.75rem",
//                 fontWeight: "500",
//                 cursor: "pointer",
//                 display: "inline-block",
//                 margin: "0 2px",
//               }}
//             >
//               {part}
//             </span>

//             {/* Popover */}
//             {hoveredCitation === citationNumber && source && (
//               <div
//                 className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
//                 style={{ minWidth: "300px" }}
//               >
//                 <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
//                   <div className="text-sm">
//                     <div className="font-medium text-foreground mb-1">
//                       {source.filename}
//                     </div>
//                     <div className="text-muted-foreground text-xs mb-2">
//                       Page {source.page_number} • Similarity:{" "}
//                       {(source.similarity * 100).toFixed(1)}%
//                     </div>
//                     <div className="text-xs text-muted-foreground max-h-32 overflow-y-auto">
//                       {source.chunk_text}
//                     </div>
//                   </div>
//                   {/* Arrow */}
//                   <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
//                 </div>
//               </div>
//             )}
//           </span>
//         );
//       }
//       return part;
//     });
//   };

//   const processChildren = (children: React.ReactNode): React.ReactNode => {
//     if (typeof children === "string") {
//       return processText(children);
//     }

//     if (Array.isArray(children)) {
//       console.log("children", children);
//       return children.map((child, index) => (
//         <span key={index}>{processChildren(child)}</span>
//       ));
//     }

//     return children;
//   };

//   return (
//     <p className="whitespace-pre-wrap mb-4">{processChildren(children)}</p>
//   );
// }

// p: ({ children }) => {
//     // Check if the text contains numbered citations [1], [2], [3], etc.
//     if (!children || typeof children !== "string") {
//       return children;
//     }

//     // Check if there are any citations in the text
//     if (!/\[\d+\]/.test(children)) {
//       return children;
//     }

//     // Replace citations with badge components
//     const parts = children.split(/(\[\d+\])/g);

//     return parts.map((part: string, index: number) => {
//       // Check if this part is a citation (matches [number] pattern)
//       const citationMatch = part.match(/^\[(\d+)\]$/);
//       if (citationMatch) {
//         return (
//           <span
//             key={index}
//             style={{
//               backgroundColor: "#007bff",
//               color: "white",
//               borderRadius: "12px",
//               padding: "2px 8px",
//               fontSize: "0.75rem",
//               fontWeight: "500",
//               cursor: "pointer",
//               display: "inline-block",
//               margin: "0 2px",
//             }}
//             title={`Source ${citationMatch[1]}`}
//           >
//             {part}
//           </span>
//         );
//       }
//       return part;
//     });
//   },
