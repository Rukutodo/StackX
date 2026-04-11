import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | StackX",
  description: "Read the terms and conditions governing your use of StackX services.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "April 10, 2026";

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      {/* Header */}
      <div className="relative pt-32 pb-12 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #06B6D4 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest uppercase rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 mb-4">
            Legal
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div
          className="rounded-2xl border border-white/[0.08] p-8 sm:p-12 space-y-10"
          style={{ background: "rgba(19,19,26,0.7)", backdropFilter: "blur(20px)" }}
        >
          {/* Intro */}
          <section>
            <p className="text-gray-400 text-sm leading-relaxed">
              Please read these Terms of Service (&quot;Terms&quot;) carefully before using the website{" "}
              <a href="https://stackx.co.in" className="text-cyan-400 hover:underline">stackx.co.in</a> or engaging
              any services provided by StackX. By accessing or using our website, you agree to be bound by
              these Terms. If you do not agree, please do not use our services.
            </p>
          </section>

          <Divider />

          <Section title="1. Services">
            <p>
              StackX provides software development services including but not limited to: web application
              development, SaaS products, business automation, advertising technology solutions, and related
              consulting services. All services are subject to a separate written agreement or Statement of Work
              (SOW) signed between StackX and the client.
            </p>
          </Section>

          <Divider />

          <Section title="2. Use of Website">
            <p>You agree to use our website only for lawful purposes. You must not:</p>
            <SubList items={[
              "Use the website in any way that violates applicable local, national, or international laws or regulations",
              "Transmit any unsolicited or unauthorized advertising or promotional material (spam)",
              "Attempt to gain unauthorized access to any part of the website or its related systems",
              "Engage in any conduct that restricts or inhibits anyone&apos;s use or enjoyment of the website",
              "Introduce viruses, trojans, worms, or other malicious or harmful material",
            ]} />
          </Section>

          <Divider />

          <Section title="3. Intellectual Property">
            <p>
              All content on this website — including text, graphics, logos, images, and software — is the
              property of StackX and is protected by applicable intellectual property laws. You may not
              reproduce, distribute, or create derivative works without our express written permission.
            </p>
            <p className="mt-3">
              Upon full payment for a project, clients receive ownership of the final deliverables as specified
              in the relevant agreement. StackX retains the right to display work in its portfolio unless
              explicitly agreed otherwise.
            </p>
          </Section>

          <Divider />

          <Section title="4. Project Engagements">
            <p>For any official project engagements with StackX:</p>
            <SubList items={[
              "<strong>Quotes &amp; Proposals</strong> — All project quotes are valid for 14 days from the date of issue unless otherwise stated.",
              "<strong>Payment Terms</strong> — Payment schedules will be defined in the project agreement. Late payments may result in work being paused.",
              "<strong>Revisions</strong> — The number of revisions included is specified per project. Additional revisions are billed at our standard hourly rate.",
              "<strong>Timelines</strong> — Estimated timelines are provided in good faith. Delays caused by client feedback, content delivery, or scope changes are the client&apos;s responsibility.",
              "<strong>Cancellations</strong> — Work completed up to the point of cancellation will be invoiced. Deposits are non-refundable.",
            ]} />
          </Section>

          <Divider />

          <Section title="5. Confidentiality">
            <p>
              Both parties agree to keep confidential any proprietary, sensitive, or business-critical
              information shared during the course of a project engagement. This obligation survives the
              termination of any project or agreement. StackX signs NDAs upon client request.
            </p>
          </Section>

          <Divider />

          <Section title="6. Disclaimer of Warranties">
            <p>
              Our website is provided on an &quot;as is&quot; and &quot;as available&quot; basis without any representations or
              warranties, express or implied. StackX makes no warranties that the website will be uninterrupted,
              error-free, or free of viruses. We reserve the right to modify or discontinue any part of the
              website at any time without notice.
            </p>
          </Section>

          <Divider />

          <Section title="7. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, StackX shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising from your use of our website or services,
              even if we have been advised of the possibility of such damages. Our total liability for any
              claim related to our services shall not exceed the amount paid by you to StackX in the 3
              months preceding the claim.
            </p>
          </Section>

          <Divider />

          <Section title="8. Third-Party Links">
            <p>
              Our website may contain links to third-party websites. These links are provided for your
              convenience only. We have no control over the content of those sites and accept no responsibility
              for them or for any loss or damage that may arise from your use of them.
            </p>
          </Section>

          <Divider />

          <Section title="9. Privacy">
            <p>
              Your use of our website is also governed by our{" "}
              <a href="/privacy-policy" className="text-cyan-400 hover:underline">Privacy Policy</a>, which is
              incorporated into these Terms by reference. By using our website, you consent to our privacy
              practices as described in that policy.
            </p>
          </Section>

          <Divider />

          <Section title="10. Governing Law">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes
              arising in connection with these Terms shall be subject to the exclusive jurisdiction of the courts
              located in Visakhapatnam, Andhra Pradesh, India.
            </p>
          </Section>

          <Divider />

          <Section title="11. Changes to Terms">
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon
              posting on this website. Your continued use of our services after any changes constitutes your
              acceptance of the new Terms. We encourage you to review these Terms periodically.
            </p>
          </Section>

          <Divider />

          <Section title="12. Contact Us">
            <p>If you have any questions about these Terms, please contact us:</p>
            <div className="mt-4 p-5 rounded-xl border border-white/[0.08] bg-white/[0.03] space-y-2 text-sm text-gray-300">
              <p><span className="text-gray-500">Company:</span> StackX</p>
              <p>
                <span className="text-gray-500">Email:</span>{" "}
                <a href="mailto:hello@stackx.co.in" className="text-cyan-400 hover:underline">hello@stackx.co.in</a>
              </p>
              <p>
                <span className="text-gray-500">Phone:</span>{" "}
                <a href="tel:+919347858844" className="text-cyan-400 hover:underline">+91 93478 58844</a>
              </p>
              <p><span className="text-gray-500">Location:</span> Visakhapatnam, Andhra Pradesh, India</p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────── */
function Divider() {
  return <hr className="border-white/[0.06]" />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2
        className="text-lg font-bold text-white mb-4"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        {title}
      </h2>
      <div className="text-sm text-gray-400 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

function SubList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mt-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}
