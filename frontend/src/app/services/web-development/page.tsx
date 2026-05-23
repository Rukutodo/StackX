import WebDevelopmentServiceClient from "./WebDevelopmentServiceClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Web Development | StackX",
  description: "We engineer high-performance, visually stunning web applications tailored to elevate your brand and drive conversion.",
  keywords: ["web development", "next.js", "react", "full-stack development"],
  alternates: {
    canonical: "/services/web-development",
  },
};

export default function WebDevelopmentPage() {
  return <WebDevelopmentServiceClient />;
}
