import { useAccessToken } from "@/hooks/useAccessToken";
import { useApiOverride } from "@/hooks/useApiOverride";
import { NEW_API_BASE_URL } from "@/lib/consts";

/**
 * Deletes a chat by ID via the API service.
 * Returns a hook with a deleteChat function.
 */
export function useDeleteChat() {
  const accessToken = useAccessToken();
  const apiOverride = useApiOverride();
  const baseUrl = apiOverride || NEW_API_BASE_URL;

  const deleteChat = async (roomId: string): Promise<void> => {
    if (!accessToken) {
      throw new Error("Authentication token is missing. Please refresh and try again.");
    }

    const response = await fetch(`${baseUrl}/api/chats`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ id: roomId }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to delete chat");
    }
  };

  return { deleteChat, isAuthenticated: !!accessToken };
}
