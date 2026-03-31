import { useEffect, useRef } from "react";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useUserProvider } from "@/providers/UserProvder";
import type { ArtistRecord } from "@/types/Artist";
import { useAccessToken } from "@/hooks/useAccessToken";
import { useApiOverride } from "@/hooks/useApiOverride";
import { NEW_API_BASE_URL } from "@/lib/consts";

/**
 * A hook that automatically selects the artist associated with a room.
 * @param roomId The ID of the room to get the artist for
 */
export function useArtistFromRoom(roomId: string) {
  const { userData } = useUserProvider();
  const { selectedArtist, artists, setSelectedArtist, getArtists } = useArtistProvider();
  const hasRun = useRef(false);
  const accessToken = useAccessToken();
  const apiOverride = useApiOverride();
  const baseUrl = apiOverride || NEW_API_BASE_URL;
  
  useEffect(() => {
    if (hasRun.current || !roomId || !userData?.id || !accessToken) return;

    (async () => {
      try {
        const response = await fetch(`${baseUrl}/api/chats/${encodeURIComponent(roomId)}/artist`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) return;
        hasRun.current = true;
        const data = await response.json();

        if (!data.artist_id || selectedArtist?.account_id === data.artist_id) return;
        
        const artistList = artists as ArtistRecord[];
        const artist = artistList.find(a => a.account_id === data.artist_id);
        
        if (artist) {
          setSelectedArtist(artist);
        } else {
          await getArtists(data.artist_id);
        }
      } catch (error) {
        console.error("Error selecting artist for room:", error);
      }
    })();
  }, [roomId, userData, selectedArtist, artists, setSelectedArtist, getArtists, accessToken, baseUrl]);
}
