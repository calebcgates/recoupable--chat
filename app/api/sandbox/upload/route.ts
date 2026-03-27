import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

/**
 * POST /api/sandbox/upload
 *
 * Handles client-side Vercel Blob uploads by generating presigned tokens.
 * Requires an Authorization header to prevent unauthenticated uploads.
 * Files are temporarily stored in Vercel Blob, then the client passes
 * the blob URLs to the API which commits them to GitHub and cleans up.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          maximumSizeInBytes: 100 * 1024 * 1024, // 100MB
        };
      },
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}
