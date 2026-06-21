import type { Metadata } from "next";
import VerifyCertificateClient from "./VerifyCertificateClient";

export const metadata: Metadata = {
  title: "Verify Certificate | StackX",
  description: "Verify the authenticity of digital certificates issued by StackX.",
};

export default function VerifyCertificatePage() {
  return <VerifyCertificateClient />;
}
