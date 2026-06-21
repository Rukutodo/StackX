"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiSearch, HiBadgeCheck, HiXCircle, HiDownload, HiOutlineOfficeBuilding } from "react-icons/hi";
import QRCode from "react-qr-code";

const SERVER_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Certificate {
  certificateId: string;
  recipientName: string;
  courseOrRole: string;
  issueDate: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  signature1Url?: string;
  signature2Url?: string;
  status: "valid" | "revoked";
}

export default function VerifyCertificateClient() {
  const [certId, setCertId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Certificate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setHasSearched(true);

    try {
      const res = await fetch(`${SERVER_API}/api/certificates/${certId.trim()}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Certificate not found. Please check the ID and try again.");
        }
        throw new Error("Failed to verify certificate. Please try again later.");
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("certificate-card");
    if (!element) return;
    
    try {
      setDownloadingPdf(true);
      const { toPng } = await import("html-to-image");
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.default || (jsPDFModule as any).jsPDF;
      
      const imgData = await toPng(element, { 
        pixelRatio: 2,
        backgroundColor: "#0d1117",
      });
      
      const pdf = new jsPDF("l", "mm", "a4");
      const rect = element.getBoundingClientRect();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (rect.height * pdfWidth) / rect.width;
      const yPos = pdfHeight < 210 ? (210 - pdfHeight) / 2 : 0;
      
      pdf.addImage(imgData, "PNG", 0, yPos, pdfWidth, pdfHeight);
      pdf.save(`StackX-Certificate-${result?.certificateId}.pdf`);
    } catch (err: any) {
      console.error("Failed to generate PDF", err);
      alert(`Failed to download PDF: ${err.message || "Unknown error"}`);
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden" style={{ background: "var(--color-background)" }}>
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08),transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header section */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-widest mb-6">
            <HiBadgeCheck size={16} /> Credential Verification
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Verify Certificate
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Enter the unique Certificate ID to verify the authenticity of a credential issued by StackX.
          </p>
        </div>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleVerify}
          className="relative max-w-2xl mx-auto mb-16"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
            <div className="relative flex items-center bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-xl">
              <div className="pl-6 text-gray-400">
                <HiSearch size={24} />
              </div>
              <input
                type="text"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="Enter Certificate ID (e.g. STX-2026-001)"
                className="w-full bg-transparent text-white text-lg px-6 py-5 focus:outline-none placeholder:text-gray-600 font-mono tracking-wider uppercase"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !certId.trim()}
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-8 py-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-full whitespace-nowrap"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : "Verify"}
              </button>
            </div>
          </div>
        </motion.form>

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {hasSearched && !loading && (
            <motion.div
              key={result ? "success" : "error"}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              {error ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center backdrop-blur-md">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiXCircle className="text-red-400 w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Verification Failed</h3>
                  <p className="text-red-300">{error}</p>
                </div>
              ) : result ? (
                result.status === "revoked" ? (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-8 text-center backdrop-blur-md">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <HiXCircle className="text-amber-400 w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Certificate Revoked</h3>
                    <p className="text-amber-300">
                      The certificate <strong>{result.certificateId}</strong> issued to <strong>{result.recipientName}</strong> has been revoked and is no longer valid.
                    </p>
                  </div>
                ) : (
                  <div className="relative group w-full max-w-[950px] mx-auto">
                    {/* Outer shadow for the paper */}
                    <div className="absolute -inset-4 bg-black/20 blur-2xl rounded-sm transition duration-1000" />
                    
                    {/* The Certificate Card (A4 Landscape Aspect Ratio) */}
                    <div 
                      id="certificate-card" 
                      className="relative bg-white text-black overflow-hidden shadow-2xl mx-auto flex flex-col items-center justify-center p-8 sm:p-12"
                      style={{ aspectRatio: "1.414 / 1" }}
                    >
                      {/* Classic Double Border */}
                      <div className="absolute inset-4 border-[3px] border-black pointer-events-none" />
                      <div className="absolute inset-[22px] border border-black pointer-events-none" />

                      <div className="relative z-10 w-full h-full flex flex-col justify-between p-2">
                        
                        {/* Header: Logo (Left) and URL/ID (Right) */}
                        <div className="flex justify-between items-start w-full">
                          {/* Top Left: LOGO */}
                          <div className="flex justify-start">
                            <img src="/stackx.svg" alt="StackX" className="h-8 sm:h-10 filter invert grayscale" />
                          </div>
                          
                          {/* Top Right: URL and ID */}
                          <div className="text-right flex flex-col gap-1 justify-end items-end">
                            <a 
                              href={`https://stackx.co.in/verify-certificate?id=${result.certificateId}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-black text-[10px] sm:text-xs font-mono hover:text-blue-600 transition-colors underline underline-offset-4 font-bold"
                            >
                              stackx.co.in/verify
                            </a>
                            <p className="text-black text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                              Credential ID: {result.certificateId}
                            </p>
                          </div>
                        </div>

                        {/* Title: CERTIFICATE OF INTERNSHIP */}
                        <div className="text-center w-full mt-4 sm:mt-6">
                          <h1 className="text-3xl sm:text-5xl font-serif text-black tracking-widest uppercase font-bold leading-[1.3]">
                            CERTIFICATE OF <br /> INTERNSHIP
                          </h1>
                        </div>

                        {/* Body: Concise Paragraph */}
                        <div className="flex flex-col items-center w-full my-6 sm:my-8">
                          <div className="text-black text-sm sm:text-[15px] font-serif leading-loose text-justify w-[85%] mx-auto">
                            This is to certify that <span className="text-black font-bold text-base sm:text-lg tracking-wide border-b border-black pb-0.5 mx-1 uppercase">{result.recipientName}</span> has successfully completed an intensive internship in the role of <strong className="text-black font-bold uppercase">{result.courseOrRole}</strong> at StackX Technologies. 
                            {result.startDate && result.endDate ? ` During the period from ${formatDate(result.startDate)} to ${formatDate(result.endDate)}${result.duration ? ` (${result.duration})` : ""}, the candidate demonstrated strong dedication and professional competence.` : ` The candidate demonstrated strong dedication and professional competence.`} We appreciate their efforts and wish them continued success in their future endeavors.
                          </div>
                        </div>

                        {/* Footer: Date/QR (Left) and Signatures (Right) */}
                        <div className="w-full flex items-end justify-between mt-auto">
                          {/* Bottom Left: QR Code and Date */}
                          <div className="flex items-center gap-4 sm:gap-6">
                            <div className="bg-white p-1 border-[2px] border-black shadow-sm flex-shrink-0">
                              <QRCode 
                                value={`https://stackx.co.in/verify-certificate?id=${result.certificateId}`}
                                size={60}
                                level="L"
                              />
                            </div>
                            <div className="text-left flex flex-col justify-end">
                              <p className="text-black text-[9px] font-bold uppercase tracking-widest mb-1">Date of Issue</p>
                              <p className="text-black font-bold font-serif text-sm sm:text-base leading-none border-b border-black pb-1 min-w-[120px]">{formatDate(result.issueDate)}</p>
                            </div>
                          </div>

                          {/* Bottom Right: Signatures Container */}
                          <div className="flex items-end gap-6 sm:gap-12">
                            {/* Signature 1 */}
                            <div className="text-center w-28 sm:w-40 flex flex-col justify-end">
                              <div className="h-10 sm:h-12 flex items-end justify-center mb-1">
                                {result.signature1Url ? (
                                  <img src={`${SERVER_API}${result.signature1Url}`} alt="Co-founder" className="h-10 object-contain mix-blend-multiply filter grayscale contrast-125" />
                                ) : (
                                  <span className="text-gray-400 italic font-serif text-sm">Signature</span>
                                )}
                              </div>
                              <div className="w-full h-[2px] bg-black mb-1" />
                              <p className="text-black text-[8px] sm:text-[9px] font-bold uppercase tracking-widest">Co-founder</p>
                            </div>

                            {/* Signature 2 */}
                            <div className="text-center w-28 sm:w-40 flex flex-col justify-end">
                              <div className="h-10 sm:h-12 flex items-end justify-center mb-1">
                                {result.signature2Url ? (
                                  <img src={`${SERVER_API}${result.signature2Url}`} alt="Authorized Signature" className="h-10 object-contain mix-blend-multiply filter grayscale contrast-125" />
                                ) : (
                                  <span className="text-gray-400 italic font-serif text-sm">Signature</span>
                                )}
                              </div>
                              <div className="w-full h-[2px] bg-black mb-1" />
                              <p className="text-black text-[8px] sm:text-[9px] font-bold uppercase tracking-widest">Authorized Signatory</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 text-center flex justify-center">
                      <button 
                        onClick={handleDownloadPDF}
                        disabled={downloadingPdf}
                        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-10px_rgba(16,185,129,0.7)]"
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
                        
                        <div className="relative flex items-center gap-3">
                          {downloadingPdf ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <HiDownload size={24} className="group-hover:-translate-y-0.5 transition-transform" />
                          )}
                          <span>{downloadingPdf ? "Generating Premium PDF..." : "Download Official PDF"}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
