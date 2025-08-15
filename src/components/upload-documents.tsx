import { useRef, useState } from "react";

import { Upload } from "../assets/icons";
import axios from "axios";
import { useSidebarActions, useUploadProgress } from "../store/sidebar-store";
interface FileUploadCardProps {
  label: string | React.ReactNode;
  accept?: string;
  placeholder?: string;
  uploadedDate?: string;
}

export default function DocumentUpload({
  label,
  accept = ".pdf,.pptx,.xlsx",
  placeholder = "Attach File",
}: FileUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");

  const { setUploadProgress } = useSidebarActions();
  const uploadProgress = useUploadProgress();

  const handleAttachClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;

    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      const totalFiles = files.length + newFiles.length;

      // Check if total files exceed 5
      if (totalFiles > 5) {
        setError("Note: maximum 5 files can be uploaded");
        return;
      }

      // Clear any previous errors
      setError("");

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);

      // Track if any upload failed
      let uploadFailed = false;

      // Only proceed with upload if no errors
      for (const [index, file] of newFiles.entries()) {
        // Break the loop if a previous upload failed
        if (uploadFailed) {
          break;
        }

        setUploadProgress({
          file: file,
          progress: 0,
          fileNumber: index + 1,
          totalFiles: newFiles.length,
        });

        // Upload file and check if it failed
        const success = await uploadFile(file, index, newFiles.length);
        if (!success) {
          uploadFailed = true;
          break; // Stop uploading remaining files
        }
      }
      setUploadProgress(null);
    }
  };

  const uploadFile = async (
    file: File,
    index: number,
    totalFiles: number
  ): Promise<boolean> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        // "https://api.escuelajs.co/api/v1/files/upload",
        `https://api-muneer.marsdevs.com/api/v1/documents/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent: any) => {
            setUploadProgress({
              file: file,
              progress: Math.round(progressEvent.progress * 100) - 10,
              fileNumber: index + 1,
              totalFiles: totalFiles,
            });
          },
        }
      );
      setUploadProgress({
        file: file,
        progress: 100,
        fileNumber: index + 1,
        totalFiles: totalFiles,
      });
      return true; // Upload successful
    } catch (error) {
      setError("Failed to uploading file");
      setUploadProgress(null);
      return false; // Upload failed
    }
  };

  // const handleFileChange = async (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const selectedFiles = event.target.files;

  //   console.log("uploaded files", selectedFiles);
  //   if (selectedFiles) {
  //     const newFiles = Array.from(selectedFiles);
  //     setFiles((prevFiles) => [...prevFiles, ...newFiles]);

  //     await uploadFile(newFiles);
  //   }
  // };

  // const uploadFile = async (files: File[]) => {
  //   const formData = new FormData();
  //   files.forEach((file) => {
  //     formData.append("file", file);
  //   });

  //   try {
  //     await axios.post(
  //       "https://api.pdfrest.com/upload",

  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           "Api-Key": "80baf848-f5b9-4bb2-aeb2-62221cdb0db4",
  //         },
  //         onUploadProgress: (progressEvent: any) => {
  //           console.log("progressEvent", progressEvent);
  //           // const percentage = Math.round((loaded * 100) / total);
  //           // console.log(`Upload progress for ${file.name}: ${percentage}%`);
  //           // setUploadProgress((prev) => ({ ...prev, [file.name]: percentage }));
  //         },
  //       }
  //     );

  //     // console.log(`File ${file.name} uploaded successfully`);
  //   } catch (error) {
  //   } finally {
  //     // setIsUploading(false);
  //   }
  // };

  return (
    <div className="flex flex-col gap-5 text-foreground pb-3">
      <div className="flex flex-col gap-2">
        <h5 className="text-xl font-medium font-poppins text-popover-foreground">
          {label}
        </h5>
        <p className="text-sm font-normal font-poppins text-card-foreground">
          Sources let MuneerAI base its responses on the information that
          matters most to you. (Examples: marketing plans, course reading,
          research notes, meeting transcripts, sales documents, etc.)
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div
          onClick={handleAttachClick}
          className={`relative border-1 border-dashed rounded-sm cursor-pointer w-full px-4 py-10 flex flex-col justify-between ${
            error ? "border-red-500" : "border-border"
          }`}
        >
          <input
            type="file"
            ref={inputRef}
            accept={accept}
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
          <div className="flex flex-col gap-16 items-center justify-center h-full">
            <div className="flex flex-col gap-1 items-center justify-center">
              <button
                className={`inline-flex items-center justify-center p-1 h-12 w-12 rounded-full cursor-pointer ${
                  error
                    ? "bg-red-500 text-white"
                    : "bg-accent-blue text-sidebar-primary"
                }`}
              >
                <Upload />
              </button>
              <span
                className={`text-sm font-medium font-poppins ${
                  error ? "text-red-600" : "text-foreground"
                }`}
              >
                {error ? "Too many files selected" : placeholder}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-normal font-poppins text-muted-foreground">
              Supported file types: {accept}
            </span>
          </div>
          {files.length > 0 && (
            <div className="absolute bottom-3 left-5 flex items-end justify-between float-end">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold font-poppins text-foreground">
                  {files.length} files selected
                </span>
              </div>
            </div>
          )}
        </div>
        <span
          className={`text-xs font-normal font-poppins ${
            error ? "text-red-600" : "text-secondary-dark"
          }`}
        >
          {error ? error : "Note: maximum 5 files can be uploaded"}
        </span>
        {uploadProgress && (
          <div className="flex flex-col gap-1 w-full overflow-hidden">
            <div className="flex justify-between gap-1">
              <span className="text-xs text-card-foreground font-normal text-left">
                Uploading {uploadProgress?.file?.name} (
                {uploadProgress?.progress}%)
              </span>
              <span className="text-xs text-card-foreground font-normal whitespace-nowrap">
                {uploadProgress?.fileNumber} /{uploadProgress?.totalFiles}
              </span>
            </div>
            <div className="bg-muted-foreground rounded-full h-2">
              <div
                className="bg-chart-1 h-2 rounded-full"
                style={{ width: `${uploadProgress?.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
