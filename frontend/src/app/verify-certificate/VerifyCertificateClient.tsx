"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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

export default function VerifyCertificateClient({ initialId }: { initialId?: string } = {}) {
  const router = useRouter();
  const [certId, setCertId] = useState(initialId ? initialId.toUpperCase() : "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Certificate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (result) {
      document.title = `${result.recipientName} - Verify Certificate | StackX`;
    }
    if (!result || !containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        if (width < 1123) {
          setScale(width / 1123);
        } else {
          setScale(1);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [result]);

  const verifyId = async (idToVerify: string) => {
    const formattedId = idToVerify.trim().toUpperCase();
    if (!formattedId) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setHasSearched(true);

    try {
      const res = await fetch(`${SERVER_API}/api/certificates/${formattedId}`);
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

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = certId.trim().toUpperCase();
    if (!cleanId) return;

    // Open verification details in a new browser taBB
    window.open(`/verify-certificate/${cleanId}`, "_blank");
  };

  useEffect(() => {
    if (initialId) {
      setCertId(initialId.toUpperCase());
      verifyId(initialId);
    }
  }, [initialId]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  const formatDateDMY = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloadingPdf(true);

      // Re-fetch certificate data from the backend to ensure untampered data
      if (result?.certificateId) {
        const res = await fetch(`${SERVER_API}/api/certificates/${result.certificateId}`);
        if (res.ok) {
          const freshData = await res.json();
          setResult(freshData);
          setRenderKey(prev => prev + 1); // Force complete re-render of the certificate card
          
          // Wait a short duration to ensure React has fully updated the DOM
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      const element = document.getElementById("certificate-card");
      if (!element) return;
      
      const { toPng } = await import("html-to-image");
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.default || (jsPDFModule as any).jsPDF;

      const imgData = await toPng(element, {
        pixelRatio: 3,
        backgroundColor: "#ffffff",
        width: 1123,
        height: 794,
      });

      const pdf = new jsPDF("l", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (794 * pdfWidth) / 1123;
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
        {!initialId && (
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
        )}

        {/* Search Bar */}
        {!initialId && (
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
                  onChange={(e) => setCertId(e.target.value.toUpperCase())}
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
        )}

        {/* Loading Spinner for Direct Route Verification */}
        {loading && initialId && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
            <p className="text-gray-400 animate-pulse">Verifying credential on the fly...</p>
          </div>
        )}

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {hasSearched && !loading && (
            <motion.div
              key={result ? "success" : "error"}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
              className="max-w-6xl mx-auto"
            >
              {error ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center backdrop-blur-md">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiXCircle className="text-red-400 w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Verification Failed</h3>
                  <p className="text-red-300 mb-6">{error}</p>
                  {initialId && (
                    <a
                      href="/verify-certificate"
                      className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-colors"
                    >
                      Go to Search Page
                    </a>
                  )}
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
                  <div className="w-full max-w-[1100px] mx-auto">
                    
                    {/* ── Verified Badge + Context Header ── */}
                    <div className="text-center mb-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.4, delay: 0.1 }}
                        className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 mb-6"
                      >
                        <HiBadgeCheck className="text-emerald-400 w-5 h-5" />
                        <span className="text-emerald-300 text-sm font-semibold tracking-wide">Verified &amp; Authentic</span>
                      </motion.div>

                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                        Certificate of Internship
                      </h2>
                      <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
                        This is to certify that <span className="text-white font-semibold capitalize">{result.recipientName}</span> has 
                        successfully completed the <span className="text-purple-300 font-semibold capitalize">{result.courseOrRole}</span> internship 
                        program at <span className="text-white font-semibold">StackX</span>.
                      </p>
                    </div>

                    {/* ── Certificate Details Grid ── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-3xl mx-auto">
                      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                        <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1.5">Recipient</p>
                        <p className="text-white font-semibold text-sm capitalize truncate">{result.recipientName}</p>
                      </div>
                      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                        <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1.5">Program</p>
                        <p className="text-purple-300 font-semibold text-sm capitalize truncate">{result.courseOrRole}</p>
                      </div>
                      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                        <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1.5">Issued On</p>
                        <p className="text-white font-semibold text-sm">{formatDateDMY(result.issueDate)}</p>
                      </div>
                      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                        <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1.5">Certificate ID</p>
                        <p className="text-cyan-300 font-mono font-semibold text-sm truncate">{result.certificateId}</p>
                      </div>
                    </div>

                    {/* ── Framed Certificate Preview ── */}
                    <div className="relative group w-full max-w-[950px] mx-auto">
                      {/* Glowing frame effect */}
                      <div className="absolute -inset-3 bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20 rounded-xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
                      <div className="absolute -inset-[1px] bg-gradient-to-br from-purple-500/30 via-white/5 to-cyan-500/30 rounded-xl" />
                      
                      {/* Certificate container with inner padding */}
                      <div className="relative bg-[#0a0a0f] rounded-xl p-3">

                        {/* Scale wrapper to keep layout identical on mobile and desktop */}
                        <div
                          ref={containerRef}
                          className="w-full overflow-hidden flex items-center justify-center rounded-lg"
                          style={{ height: `${794 * scale}px` }}
                        >
                          <div
                            style={{
                              transform: `scale(${scale})`,
                              transformOrigin: "center center",
                              width: "1123px",
                              height: "794px",
                              flexShrink: 0
                            }}
                          >
                            {/* ═══ THE CERTIFICATE CARD ═══ */}
                            <div
                              id="certificate-card"
                              key={renderKey}
                              className="relative text-[#1a1a2e] overflow-hidden w-full h-full select-none"
                              style={{
                                background: "transparent",
                                fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif"
                              }}
                            >
                          {/* ─── PREMIUM DARK THEME BORDER ─── */}
                          <div className="absolute inset-[10px] border-[8px] border-double border-[#8b5cf6]/20 pointer-events-none z-[5]" />
                          <div className="absolute inset-0 border border-white/5 pointer-events-none z-[5]" />

                          {/* ─── PREMIUM DARK GEOMETRIC BACKGROUND ─── */}
                          <img
                            src="/premium-bg.png?v=4"
                            alt="Certificate Background"
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
                          />
                          {/* Dark overlay to ensure text visibility */}
                          <div className="absolute inset-0 bg-black/50 pointer-events-none z-0" />


                          {/* ═══ CONTENT ═══ */}
                          <div className="relative z-10 w-full h-full flex flex-col" style={{ padding: "34px 60px 52px" }}>

                            {/* ── HEADER (Logo + Badges) ── */}
                            <div className="relative w-full flex justify-center items-start mb-4 h-[84px]">
                              {/* LOGO — Centered */}
                              <img
                                src="/stackx.svg"
                                alt="StackX"
                                className="h-[84px] filter invert brightness-0 invert drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                              />

                              {/* Government Badges — Top Right */}
                              <div className="absolute right-0 top-1 flex flex-col items-end gap-2">
                                <span className="text-[8px] text-white font-semibold tracking-[0.25em] uppercase opacity-80">Recognized By</span>
                                <div className="flex items-center gap-4">
                                  {/* MSME - Sized up */}
                                  <img src="/msme.png" alt="MSME" className="h-[46px] w-auto object-contain filter invert grayscale contrast-200 mix-blend-screen opacity-90" />
                                  <div className="w-[1px] h-[30px] bg-white/20 mx-1" />
                                  {/* Startup India - Restored original colors */}
                                  <div className="bg-white px-3 py-1.5 rounded-md shadow-sm">
                                    <img src="/startupindia.png" alt="Startup India" className="h-[34px] w-auto object-contain mix-blend-multiply" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* ── TITLE ── */}
                            <div className="flex flex-col items-center mt-0">
                              <h1
                                className="text-[60px] tracking-[0.25em] text-white uppercase leading-none font-light drop-shadow-md"
                                style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                              >
                                CERTIFICATE
                              </h1>
                              {/* Accent bar */}
                              <div className="relative mt-4">
                                <div className="absolute inset-0 -inset-x-12 bg-gradient-to-r from-transparent via-[#8b5cf6]/30 to-transparent rounded-sm" />
                                <p className="relative text-[21px] tracking-[0.4em] text-[#d8b4fe] uppercase font-semibold px-12 py-1.5 drop-shadow-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  OF INTERNSHIP
                                </p>
                              </div>
                              <p className="text-[17px] text-[#a78bfa] tracking-[0.12em] mt-5 uppercase font-medium">
                                This certificate is proudly presented to
                              </p>
                            </div>

                            {/* ── NAME ── */}
                            <div className="flex flex-col items-center mt-6">
                              {/* Top line */}
                              <div className="flex items-center gap-4 w-[650px]">
                                <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent to-[#8b5cf6]/50" />
                                <div className="w-3 h-3 rotate-45 border-[2px] border-[#a78bfa]/60 bg-[#2e1065] shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                                <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent to-[#8b5cf6]/50" />
                              </div>

                              <h2
                                className={`capitalize text-white text-center max-w-[900px] leading-tight my-4 drop-shadow-lg ${
                                  result.recipientName.length > 50
                                    ? "text-[24px]"
                                    : result.recipientName.length > 30
                                      ? "text-[28px]"
                                      : "text-[35px]"
                                }`}
                                style={{
                                  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
                                  fontStyle: "normal",
                                  fontWeight: 700,
                                  letterSpacing: "0.01em"
                                }}
                              >
                                {result.recipientName}
                              </h2>

                              {/* Bottom line */}
                              <div className="flex items-center gap-4 w-[650px]">
                                <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent to-[#8b5cf6]/50" />
                                <div className="w-3 h-3 rotate-45 border-[2px] border-[#a78bfa]/60 bg-[#2e1065] shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                                <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent to-[#8b5cf6]/50" />
                              </div>
                            </div>

                            {/* ── DETAILS (Continuous Format) ── */}
                            <div className="flex flex-col items-center mt-7 px-10">
                              <p className="text-[18px] text-[#e5e7eb] text-center leading-[1.8] max-w-[850px] font-medium">
                                for the successful completion of their internship program as a <span className="font-bold text-white capitalize tracking-wide text-[20px] mx-1 drop-shadow-sm">{result.courseOrRole}</span> 
                                from <span className="font-bold text-white border-b border-[#a78bfa]/40 pb-0.5 mx-1">{formatDateDMY(result.startDate)}</span> 
                                to <span className="font-bold text-white border-b border-[#a78bfa]/40 pb-0.5 mx-1">{formatDateDMY(result.endDate)}</span>. 
                                During this tenure, the candidate demonstrated exceptional dedication, continuous skill development, and outstanding professional growth.
                              </p>
                              
                              {/* Issue date & ID */}
                              <div className="flex items-center gap-6 mt-6">
                                <p className="text-[14px] text-[#a78bfa] tracking-wider uppercase">
                                  Issued: <span className="text-white font-semibold">{formatDateDMY(result.issueDate)}</span>
                                </p>
                                <div className="w-[4px] h-[4px] rounded-full bg-[#d8b4fe] shadow-[0_0_5px_#c084fc]" />
                                <p className="text-[14px] font-mono text-[#c084fc] tracking-[0.1em] font-semibold drop-shadow-sm">
                                  {result.certificateId}
                                </p>
                              </div>
                            </div>

                            {/* ── SPACER ── */}
                            <div className="min-h-[16px]" />

                            {/* ── BOTTOM — QR + Signatures ── */}
                            <div className="w-full flex items-end justify-between mt-auto">

                              {/* QR + Verify */}
                              <div className="flex items-center gap-4">
                                <div className="bg-white/95 p-2 rounded border border-white/20 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                                  <QRCode
                                    value={`https://stackx.co.in/verify-certificate/${result.certificateId}`}
                                    size={64}
                                    level="L"
                                    bgColor="transparent"
                                    fgColor="#170535"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-[#a78bfa] font-semibold tracking-widest uppercase">Verify Authenticity</span>
                                  <a
                                    href={`https://stackx.co.in/verify-certificate/${result.certificateId}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] font-mono text-[#e5e7eb] hover:text-white transition-colors leading-tight"
                                  >
                                    stackx.co.in/verify-certificate/{result.certificateId}
                                  </a>
                                </div>
                              </div>



                              {/* Signatures */}
                              <div className="flex items-end gap-12">
                                {/* Signature 1 */}
                                <div className="flex flex-col items-center w-[210px]">
                                  <div className="h-20 flex items-end justify-center">
                                    <img
                                      src={`${SERVER_API}/uploads/signatures/nurajsign.PNG`}
                                      alt="K. Nuraj Mani Sai"
                                      crossOrigin="anonymous"
                                      className="max-h-[70px] w-auto object-contain filter invert brightness-200 grayscale drop-shadow-md mix-blend-screen"
                                    />
                                  </div>
                                  <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#a78bfa]/60 to-transparent mt-1.5" />
                                  <p className="text-[16px] font-semibold text-white mt-2 tracking-wide drop-shadow-sm">K. Nuraj Mani Sai</p>
                                  <p className="text-[11px] text-[#a78bfa] uppercase tracking-[0.15em] font-medium">Co-Founder</p>
                                </div>

                                {/* Signature 2 */}
                                <div className="flex flex-col items-center w-[210px]">
                                  <div className="h-20 flex items-end justify-center">
                                    <img
                                      src={`${SERVER_API}/uploads/signatures/roshansign.PNG`}
                                      alt="P. Roshan"
                                      crossOrigin="anonymous"
                                      className="max-h-[70px] w-auto object-contain filter invert brightness-200 grayscale drop-shadow-md mix-blend-screen"
                                    />
                                  </div>
                                  <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#a78bfa]/60 to-transparent mt-1.5" />
                                  <p className="text-[16px] font-semibold text-white mt-2 tracking-wide drop-shadow-sm">P. Roshan</p>
                                  <p className="text-[11px] text-[#a78bfa] uppercase tracking-[0.15em] font-medium">Co-Founder</p>
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                    </div>

                    {/* ── Download Section ── */}
                    <div className="mt-12 text-center max-w-2xl mx-auto">
                      <p className="text-gray-400 text-sm mb-2">
                        Your certificate has been verified successfully. You can download an official copy below.
                      </p>
                      <p className="text-gray-500 text-xs mb-6">
                        The PDF will be generated in A4 landscape format, ready for printing or digital use.
                      </p>

                      <button
                        onClick={handleDownloadPDF}
                        disabled={downloadingPdf}
                        className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-10px_rgba(16,185,129,0.7)]"
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

                      {/* Footer note */}
                      <div className="mt-10 flex items-center justify-center gap-3 text-gray-600 text-xs">
                        <HiOutlineOfficeBuilding size={14} />
                        <span>Issued by StackX · MSME & Startup India Recognized</span>
                      </div>
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
