"use client";

import { FileTree } from "@/components/ai-elements/file-tree";
import FileNodeComponent from "./FileNodeComponent";
import SandboxFilePreview from "./SandboxFilePreview";
import SandboxDropZone from "./SandboxDropZone";
import useSandboxes from "@/hooks/useSandboxes";
import useSandboxFileContent from "@/hooks/useSandboxFileContent";
import { useSandboxFileDrop } from "@/hooks/useSandboxFileDrop";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { Loader, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SandboxFileTree() {
  const { filetree, isLoading, error, refetch } = useSandboxes();
  const fileContent = useSandboxFileContent();
  const { handleFilesDropped, uploading } = useSandboxFileDrop({
    selectedPath: fileContent.selectedPath,
    filetree,
    refetch,
  });

  const { getRootProps, getInputProps, isDragging } = useDragAndDrop({
    onDrop: handleFilesDropped,
    maxFiles: 100,
    maxSizeMB: 100,
    disabled: uploading,
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader className="h-4 w-4 animate-spin" />
        <span>Loading files...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive">
        <p>Failed to load files</p>
        <button
          onClick={() => refetch()}
          className="text-sm underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (filetree.length === 0) {
    return (
      <div
        {...getRootProps()}
        role="region"
        aria-label="File upload dropzone"
        className={cn(
          "w-full max-w-md rounded-lg p-8 border-2 border-dashed transition-all",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
        )}
      >
        <input {...getInputProps()} aria-label="Upload files" />
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Upload className="h-8 w-8" />
          <p className="text-sm">
            No files yet. Drag and drop files here to upload.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SandboxDropZone onDrop={handleFilesDropped} uploading={uploading}>
      <div className="w-full lg:max-w-md lg:shrink-0">
        <h2 className="mb-2 text-lg font-medium">Repository Files</h2>
        <FileTree
          selectedPath={fileContent.selectedPath}
          onSelect={fileContent.select}
        >
          {filetree.map((node) => (
            <FileNodeComponent key={node.path} node={node} />
          ))}
        </FileTree>
      </div>
      {fileContent.selectedPath && (
        <SandboxFilePreview
          selectedPath={fileContent.selectedPath}
          content={fileContent.content}
          loading={fileContent.loading}
          error={fileContent.error}
        />
      )}
    </SandboxDropZone>
  );
}
