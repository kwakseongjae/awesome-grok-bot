import { NextResponse } from "next/server";
import { verificationFileBody } from "@/lib/site-verify";

type Props = {
  params: Promise<{ file: string }>;
};

export const GET = async (_request: Request, { params }: Props) => {
  const { file } = await params;
  const match = verificationFileBody(file);
  if (!match) {
    return new NextResponse("Not found\n", { status: 404 });
  }
  return new NextResponse(match.body, {
    headers: {
      "Content-Type": match.type,
      "Cache-Control": "public, max-age=300",
    },
  });
};
