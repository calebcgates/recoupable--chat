import { z } from "zod";
import { tool } from "ai";
import {
  getSpotifyPlayButtonClicked,
  GetSpotifyPlayButtonClickedResult,
} from "../supabase/getSpotifyPlayButtonClicked";

const getVideoGameCampaignPlays = tool({
  description:
    "Get Spotify play button click events for Tee Grizzley's latest video game campaign.",
  inputSchema: z.object({}),
  execute: async () => {
    try {
      return await getSpotifyPlayButtonClicked({
        campaignId: "d3f15e47-4873-45d3-a2be-78f990ca5dcd",
      });
    } catch (error) {
      return {
        success: false,
        status: "error",
        message: error instanceof Error ? error.message : "Failed to get campaign plays",
      };
    }
  },
});

export default getVideoGameCampaignPlays;
