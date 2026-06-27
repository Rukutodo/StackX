import type { Metadata } from "next";
import VerifyCertificateClient from "../VerifyCertificateClient";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Verify Certificate | StackX",
  description: "Verify the authenticity of digital certificates issued by StackX.",
};

export const dynamic = "force-dynamic";

export default async function VerifyCertificateDynamicPage({ params }: Props) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  return <VerifyCertificateClient initialId={id} />;
}
