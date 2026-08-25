import { llmsResponse } from "@/lib/llms-response";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export const GET = async (_request: Request, { params }: Props) => {
  const { slug = [] } = await params;
  return llmsResponse(slug);
};
