"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import ReferenceForm from "@/components/admin/ReferenceForm";
import type { Reference } from "@/types/reference";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

export default function EditReferencePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [reference, setReference] = useState<Reference | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReference = async () => {
      try {
        const res = await fetch(`${API}/api/references/${resolvedParams.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
        });
        if (!res.ok) throw new Error("Failed to fetch reference");
        const data = await res.json();
        setReference(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReference();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !reference) {
    return (
      <div className="py-12 text-center text-red-400">
        {error || "Reference not found."}
        <button onClick={() => router.push("/references")} className="block mx-auto mt-4 text-white underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="py-6">
      <ReferenceForm initialData={reference} />
    </div>
  );
}
