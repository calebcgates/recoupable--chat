import { useState, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { uploadSandboxFiles } from "@/lib/sandboxes/uploadSandboxFiles";
import { toast } from "sonner";
import type { FileNode } from "@/lib/sandboxes/parseFileTree";

/**
 * Finds a node in the file tree by path.
 */
function findNode(nodes: FileNode[], path: string): FileNode | undefined {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.children) {
      const found = findNode(node.children, path);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Hook that handles sandbox file upload logic.
 * Manages uploading state, auth, target path resolution, and toast notifications.
 */
export function useSandboxFileDrop({
  selectedPath,
  filetree,
  refetch,
}: {
  selectedPath: string | null;
  filetree: FileNode[];
  refetch: () => void;
}) {
  const { getAccessToken } = usePrivy();
  const [uploading, setUploading] = useState(false);

  const handleFilesDropped = useCallback(
    async (files: File[]) => {
      setUploading(true);
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          toast.error("Please sign in to upload files");
          return;
        }

        let targetPath: string | undefined;
        if (selectedPath) {
          const node = findNode(filetree, selectedPath);
          if (node?.type === "file") {
            const parts = selectedPath.split("/");
            targetPath = parts.slice(0, -1).join("/");
          } else {
            targetPath = selectedPath;
          }
        }

        const result = await uploadSandboxFiles({
          accessToken,
          files,
          path: targetPath,
        });

        if (result.errors?.length) {
          toast.warning(
            `Uploaded ${result.uploaded.length} files, ${result.errors.length} failed`,
          );
        } else {
          toast.success(
            `Uploaded ${result.uploaded.length} file${result.uploaded.length === 1 ? "" : "s"}`,
          );
        }

        refetch();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [getAccessToken, selectedPath, filetree, refetch],
  );

  return { handleFilesDropped, uploading };
}
