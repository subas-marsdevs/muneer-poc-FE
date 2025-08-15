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

  console.log("fileContent", fileContent);
  console.log("chunkText", selectedSource?.chunk_text);

  // Function to normalize text for better matching
  const normalizeText = (text: string): string => {
    return text
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .replace(/\n+/g, " ") // Replace newlines with spaces
      .replace(/\r+/g, " ") // Replace carriage returns with spaces
      .replace(/\t+/g, " ") // Replace tabs with spaces
      .replace(/[^\w\s.,!?;:()\-]/g, "") // Remove special characters except basic punctuation
      .trim()
      .toLowerCase();
  };

  // Function to extract meaningful sentences from text
  const extractSentences = (text: string): string[] => {
    // Split by sentence endings and filter out very short fragments
    return text
      .split(/[.!?]+/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 15) // Only sentences longer than 15 characters
      .map((sentence) => normalizeText(sentence));
  };

  // Function to highlight the chunk text in the complete file content
  const highlightChunkText = (fullContent: string, chunkText: string) => {
    if (!chunkText.trim() || !fullContent) return fullContent;

    console.log("Original chunk text:", chunkText);
    console.log("Original full content length:", fullContent.length);

    // Normalize both texts for comparison
    const normalizedChunkText = normalizeText(chunkText);
    const normalizedFullContent = normalizeText(fullContent);

    console.log("Normalized chunk text:", normalizedChunkText);
    console.log(
      "Normalized full content length:",
      normalizedFullContent.length
    );

    // Try to find the exact normalized chunk text in the normalized full content
    const index = normalizedFullContent.indexOf(normalizedChunkText);

    console.log("Found at normalized index:", index);

    if (index === -1) {
      console.log(
        "No exact normalized match found, trying alternative methods..."
      );

      // If exact match not found, try to find the chunk text in the original content
      const originalIndex = fullContent
        .toLowerCase()
        .indexOf(chunkText.toLowerCase());

      console.log("Found at original index:", originalIndex);

      if (originalIndex !== -1) {
        // Found match in original content
        const beforeMatch = fullContent.substring(0, originalIndex);
        const match = fullContent.substring(
          originalIndex,
          originalIndex + chunkText.length
        );
        const afterMatch = fullContent.substring(
          originalIndex + chunkText.length
        );

        console.log("Highlighting original match");

        return (
          <>
            {beforeMatch}
            <mark className="bg-yellow-200 text-black px-1 rounded animate-pulse">
              {match}
            </mark>
            {afterMatch}
          </>
        );
      }

      // If still no match, try to find sentence-level matches
      const chunkSentences = extractSentences(chunkText);
      const fullSentences = extractSentences(fullContent);

      console.log(
        "Trying sentence-level matching with chunk sentences:",
        chunkSentences
      );
      console.log("Available full content sentences:", fullSentences.length);

      if (chunkSentences.length > 0) {
        // Find all sentence matches and create a map of positions
        const matches: Array<{ start: number; end: number; text: string }> = [];

        chunkSentences.forEach((sentence) => {
          const sentenceIndex = fullContent.toLowerCase().indexOf(sentence);
          console.log(`Sentence "${sentence}" found at index:`, sentenceIndex);

          if (sentenceIndex !== -1) {
            matches.push({
              start: sentenceIndex,
              end: sentenceIndex + sentence.length,
              text: sentence,
            });
          }
        });

        if (matches.length > 0) {
          // Sort matches by start position
          matches.sort((a, b) => a.start - b.start);

          // Create highlighted content using React elements
          const parts: React.ReactNode[] = [];
          let lastIndex = 0;

          matches.forEach((match, index) => {
            // Add text before this match
            if (match.start > lastIndex) {
              parts.push(fullContent.substring(lastIndex, match.start));
            }

            // Add highlighted match
            parts.push(
              <mark
                key={index}
                className="bg-yellow-200 text-black px-1 rounded animate-pulse"
              >
                {fullContent.substring(match.start, match.end)}
              </mark>
            );

            lastIndex = match.end;
          });

          // Add remaining text after last match
          if (lastIndex < fullContent.length) {
            parts.push(fullContent.substring(lastIndex));
          }

          return <>{parts}</>;
        }
      }

      // If no sentence matches found, try to find the longest common substring
      console.log(
        "No sentence matches found, trying longest common substring..."
      );

      const words = chunkText.split(/\s+/).filter((word) => word.length > 3);
      if (words.length > 0) {
        // Find the longest consecutive sequence of words that appears in the full content
        let maxLength = 0;
        let bestMatch = "";

        for (let i = 0; i < words.length; i++) {
          for (let j = i + 1; j <= words.length; j++) {
            const phrase = words.slice(i, j).join(" ");
            if (
              phrase.length > maxLength &&
              fullContent.toLowerCase().includes(phrase.toLowerCase())
            ) {
              maxLength = phrase.length;
              bestMatch = phrase;
            }
          }
        }

        if (bestMatch.length > 10) {
          console.log("Found best phrase match:", bestMatch);
          const phraseIndex = fullContent
            .toLowerCase()
            .indexOf(bestMatch.toLowerCase());
          const beforePhrase = fullContent.substring(0, phraseIndex);
          const phraseMatch = fullContent.substring(
            phraseIndex,
            phraseIndex + bestMatch.length
          );
          const afterPhrase = fullContent.substring(
            phraseIndex + bestMatch.length
          );

          return (
            <>
              {beforePhrase}
              <mark className="bg-yellow-200 text-black px-1 rounded animate-pulse">
                {phraseMatch}
              </mark>
              {afterPhrase}
            </>
          );
        }
      }

      // If no matches found, return original content
      console.log("No matches found, returning original content");
      return <div>{fullContent}</div>;
    }

    console.log("Exact normalized match found, mapping to original content...");

    // If exact normalized match found, find the corresponding position in original content
    let originalIndex = 0;
    let normalizedIndex = 0;

    while (normalizedIndex < index && originalIndex < fullContent.length) {
      const normalizedChar = normalizedFullContent[normalizedIndex];
      const originalChar = fullContent[originalIndex];

      if (normalizeText(originalChar) === normalizedChar) {
        normalizedIndex++;
      }
      originalIndex++;
    }

    console.log("Mapped to original index:", originalIndex);

    // Now highlight the actual chunk text at the found position
    const beforeMatch = fullContent.substring(0, originalIndex);
    const match = fullContent.substring(
      originalIndex,
      originalIndex + chunkText.length
    );
    const afterMatch = fullContent.substring(originalIndex + chunkText.length);

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
