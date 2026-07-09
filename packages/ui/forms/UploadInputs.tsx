"use client";

import { forwardRef, useState } from "react";
import { UploadCloud, File, X } from "lucide-react";
import { cn } from "../../utils/cn";
import { FormFieldWrapper } from "./FormFieldWrapper";
import type { EditableProps } from "../../types";

export interface UploadProps extends EditableProps {
  label?: string;
  error?: string;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
}

const FileUpload = forwardRef<HTMLInputElement, UploadProps & { onFileSelect?: (files: FileList | null) => void }>(
  ({ label, error, required, accept, multiple = false, onFileSelect, className, ...props }, ref) => {
    const [selected, setSelected] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      onFileSelect?.(files);
      if (files && files.length > 0) {
        setSelected(multiple ? `${files.length} files selected` : files[0].name);
      } else {
        setSelected(null);
      }
    };

    return (
      <FormFieldWrapper label={label} error={error} required={required} className={className}>
        <div className="flex items-center gap-3">
          <label className="flex items-center justify-center px-4 h-10 rounded-xl border border-[#0F1020]/10 hover:border-[#0F1020]/25 bg-white text-[#0F1020]/80 hover:text-[#0F1020] transition duration-300 font-semibold text-xs cursor-pointer select-none">
            Choose File
            <input
              type="file"
              ref={ref}
              accept={accept}
              multiple={multiple}
              onChange={handleFileChange}
              className="sr-only"
              {...props}
            />
          </label>
          <span className="text-xs font-semibold text-[#0F1020]/50 truncate max-w-[200px]">
            {selected || "No file chosen"}
          </span>
        </div>
      </FormFieldWrapper>
    );
  }
);
FileUpload.displayName = "FileUpload";

const DragUpload = forwardRef<HTMLDivElement, UploadProps & { onFileSelect?: (files: FileList | null) => void }>(
  ({ label, error, required, accept, multiple = false, onFileSelect, className, ...props }, ref) => {
    const [dragging, setDragging] = useState(false);
    const [filesList, setFilesList] = useState<File[]>([]);

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragging(true);
      } else if (e.type === "dragleave") {
        setDragging(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      const dropped = e.dataTransfer.files;
      if (dropped && dropped.length > 0) {
        onFileSelect?.(dropped);
        setFilesList(Array.from(dropped));
      }
    };

    const clearFiles = () => {
      setFilesList([]);
      onFileSelect?.(null);
    };

    return (
      <FormFieldWrapper label={label} error={error} required={required} className={className}>
        <div
          ref={ref}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#0F1020]/10 rounded-2xl bg-[#FAFBFC] transition-all cursor-pointer min-h-[160px]",
            dragging && "border-primary bg-primary/5",
            filesList.length > 0 && "border-solid border-[#0F1020]/15"
          )}
          {...props}
        >
          {filesList.length > 0 ? (
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between border-b border-[#0F1020]/5 pb-2">
                <span className="text-xs font-bold text-[#0F1020]/40 uppercase tracking-wider">Uploaded Files</span>
                <button onClick={clearFiles} className="text-xs text-red-500 font-semibold hover:underline">
                  Clear All
                </button>
              </div>
              <ul className="space-y-1.5">
                {filesList.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#0F1020]/5 text-xs text-[#0F1020]/80">
                    <File className="h-4 w-4 text-[#0F1020]/40 shrink-0" />
                    <span className="flex-1 truncate">{f.name}</span>
                    <span className="text-[10px] text-[#0F1020]/40 font-mono">{(f.size / 1024).toFixed(1)} KB</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <UploadCloud className="h-9 w-9 text-[#0F1020]/30 mb-2" />
              <span className="text-sm font-semibold text-[#0F1020]">Drag & drop files here</span>
              <span className="text-xs text-[#0F1020]/40 mt-0.5">or click to browse your system</span>
            </>
          )}
        </div>
      </FormFieldWrapper>
    );
  }
);
DragUpload.displayName = "DragUpload";

export { FileUpload, DragUpload };
