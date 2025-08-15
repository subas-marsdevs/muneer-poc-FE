import {
  useSelectedSource,
  useSidebarActions,
} from "../../store/sidebar-store";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { MemoizedReactMarkdown } from "./markdown";
import { useState, useEffect, useRef } from "react";
import pdfToText from "react-pdftotext";

export default function SourceViewer() {
  const selectedSource = useSelectedSource();
  const { closeSourceViewer } = useSidebarActions();
  const [fileContent, setFileContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch file content when source changes
  useEffect(() => {
    if (selectedSource?.file_url) {
      const updated_url = selectedSource.file_url.replace(
        "http://localhost:8000",
        "https://api-muneer.marsdevs.com"
      );
      fetchFileContent(updated_url);
    }
  }, [selectedSource]);

  // Scroll to highlighted text when content loads
  useEffect(() => {
    if (fileContent && contentRef.current) {
      const highlightedElement = contentRef.current.querySelector("mark");
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [fileContent]);

  const fetchFileContent = async (url: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      // Check content type to determine how to handle the response
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/pdf")) {
        const blob = await response.blob(); // Convert response to a Blob

        // Extract text from the Blob using react-pdftotext
        const text = await pdfToText(blob);

        // For PDFs, we might need to handle differently
        // For now, we'll try to get text content
        // const arrayBuffer = await response.arrayBuffer();
        // const arrayBuffer = await response.text();
        // const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

        // let fullText = "";
        // const numPages = pdf.numPages;

        // // Loop through each page and extract the text
        // for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        //   const page = await pdf.getPage(pageNum);
        //   const content = await page.getTextContent();

        //   // Extract text from the page
        //   const pageText = content.items
        //     .map((item) => (item as any).str)
        //     .join(" ");
        //   fullText += pageText + "\n";
        // }

        setFileContent(text);
      } else if (
        contentType?.includes("text/") ||
        contentType?.includes("application/json")
      ) {
        const content = await response.text();
        setFileContent(content);
      } else {
        // For other file types, try to get as text
        const content = await response.text();
        setFileContent(content);
      }
    } catch (err) {
      console.error("Error fetching file content:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch file content"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to highlight the chunk text in the complete file content
  const highlightChunkText = (fullContent: string, chunkText: string) => {
    if (!chunkText.trim() || !fullContent) return fullContent;

    // Clean up the chunk text for better matching
    const cleanChunkText = chunkText.replace(/\s+/g, " ").trim();
    const cleanFullContent = fullContent.replace(/\s+/g, " ");

    // Try to find the exact chunk text in the full content
    const index = cleanFullContent.indexOf(cleanChunkText);

    if (index === -1) {
      // If exact match not found, try to find partial matches
      const words = cleanChunkText.split(" ").filter((word) => word.length > 3);
      if (words.length > 0) {
        const highlightedContent = words.reduce((content, word) => {
          const regex = new RegExp(
            `(${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
            "gi"
          );
          return content.replace(
            regex,
            '<mark class="bg-yellow-200 text-black px-1 rounded animate-pulse">$1</mark>'
          );
        }, fullContent);

        return <div dangerouslySetInnerHTML={{ __html: highlightedContent }} />;
      } else {
        // If no significant words found, just return the content
        return <div>{fullContent}</div>;
      }
    }

    // If exact match found, highlight the specific section
    const beforeMatch = fullContent.substring(0, index);
    const match = fullContent.substring(index, index + cleanChunkText.length);
    const afterMatch = fullContent.substring(index + cleanChunkText.length);

    return (
      <>
        {beforeMatch}
        <mark className="bg-yellow-200 text-black px-1 rounded animate-pulse">
          {match}
        </mark>
        {afterMatch}
      </>
    );
  };

  if (!selectedSource) return null;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-foreground truncate max-w-48">
              {selectedSource.filename}
            </h3>
            <p className="text-xs text-muted-foreground">
              Page {selectedSource.page_number} • Similarity:{" "}
              {(selectedSource.similarity * 100).toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={selectedSource.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 hover:bg-accent rounded-md transition-colors"
            title="Open original file"
          >
            <span className="text-xs">🔗</span>
          </a>
          <button
            onClick={closeSourceViewer}
            className="p-1 hover:bg-accent rounded-md transition-colors"
            title="Close viewer"
          >
            <span className="text-xs">✕</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto h-full">
        <div className="space-y-4 flex-1">
          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">
                Loading file content...
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-red-800 mb-2">
                Error Loading File
              </h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* File content with highlighted chunk */}
          {!isLoading && !error && fileContent && (
            <div className="flex flex-col">
              <div className="p-3 flex-1">
                <div
                  ref={contentRef}
                  className="h-full text-sm text-foreground leading-relaxed overflow-y-auto"
                >
                  {/* <MemoizedReactMarkdown
                    rehypePlugins={[
                      [rehypeExternalLinks, { target: "_blank" }],
                      [rehypeKatex],
                    ]}
                    remarkPlugins={[remarkGfm, remarkMath]}
                  >
                    {highlightChunkText(fileContent, selectedSource.chunk_text)}
                  </MemoizedReactMarkdown> */}

                  {highlightChunkText(fileContent, selectedSource.chunk_text)}
                </div>
              </div>
            </div>
          )}

          {/* Show chunk text if file content couldn't be loaded */}
          {!isLoading && (error || !fileContent) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">
                Source Chunk Text:
              </h4>
              <div className="bg-muted/30 border border-border rounded-lg p-3">
                <div className="text-sm text-foreground leading-relaxed">
                  <MemoizedReactMarkdown
                    rehypePlugins={[
                      [rehypeExternalLinks, { target: "_blank" }],
                      [rehypeKatex],
                    ]}
                    remarkPlugins={[remarkGfm, remarkMath]}
                  >
                    {selectedSource.chunk_text}
                  </MemoizedReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
