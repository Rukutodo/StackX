import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | StackX",
  description: "Learn how StackX collects, uses, and protects your personal information.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "April 10, 2026";

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      {/* Header */}
      <div className="relative pt-32 pb-12 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #8B5CF6 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest uppercase rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 mb-4">
            Legal
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            Privacy Policy
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
              StackX (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you visit our website{" "}
              <a href="https://stackx.co.in" className="text-purple-400 hover:underline">stackx.co.in</a> or use
              our services. Please read this policy carefully. If you disagree with its terms, please discontinue
              use of our site.
            </p>
          </section>

          <Divider />

          <Section title="1. Information We Collect">
            <p>We may collect the following types of information:</p>
            <SubList items={[
              "<strong>Contact Information</strong> — Name, email address, phone number, and company name when you fill out our contact or application forms.",
              "<strong>Project Details</strong> — Information you provide about your project, budget, and requirements when requesting a consultation.",
              "<strong>Resume / CV</strong> — Documents you submit when applying for a job at StackX.",
              "<strong>Usage Data</strong> — Browser type, IP address, pages visited, and time spent on our website (collected via cookies and analytics tools).",
              "<strong>Communications</strong> — Emails or messages you send to us directly.",
            ]} />
          </Section>

          <Divider />

          <Section title="2. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <SubList items={[
              "Respond to your inquiries and provide requested services",
              "Process and evaluate job applications",
              "Send project proposals and consultation follow-ups",
              "Improve our website and user experience",
              "Comply with legal obligations",
              "Send important service-related communications",
            ]} />
            <p className="mt-4">We will <strong>never</strong> sell, rent, or trade your personal information to third parties.</p>
          </Section>

          <Divider />

          <Section title="3. Cookies & Tracking">
            <p>
              Our website may use cookies and similar tracking technologies to enhance your browsing experience.
              You can control cookie settings through your browser. Disabling cookies may affect some functionality
              of our site. We use analytics tools (such as Google Analytics) to understand how visitors interact
              with our website — this data is aggregated and anonymized.
            </p>
          </Section>

          <Divider />

          <Section title="4. Data Sharing & Disclosure">
            <p>We do not sell your data. We may share your information only in the following situations:</p>
            <SubList items={[
              "<strong>Service Providers</strong> — Trusted third-party tools we use to operate our business (e.g., email services, analytics), bound by confidentiality agreements.",
              "<strong>Legal Requirements</strong> — If required by law, court order, or governmental authority.",
              "<strong>Business Transfer</strong> — In connection with a merger, acquisition, or sale of company assets.",
            ]} />
          </Section>

          <Divider />

          <Section title="5. Data Retention">
            <p>
              We retain your personal information only for as long as necessary to fulfil the purposes outlined
              in this policy, or as required by law. Contact form submissions are retained for up to 2 years.
              Job applications are retained for up to 1 year from the date of submission. You may request
              deletion of your data at any time.
            </p>
          </Section>

          <Divider />

          <Section title="6. Your Rights">
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <SubList items={[
              "Right to access — request a copy of data we hold about you",
              "Right to rectification — request correction of inaccurate data",
              "Right to erasure — request deletion of your personal data",
              "Right to restrict processing — request that we limit how we use your data",
              "Right to data portability — request your data in a machine-readable format",
              "Right to object — object to how we process your data",
            ]} />
            <p className="mt-4">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:hello@stackx.co.in" className="text-purple-400 hover:underline">hello@stackx.co.in</a>.
            </p>
          </Section>

          <Divider />

          <Section title="7. Security">
            <p>
              We implement industry-standard security measures to protect your information, including SSL/TLS
              encryption for data in transit, secure server infrastructure, and access controls. However, no
              internet transmission or electronic storage is 100% secure. We cannot guarantee absolute security
              but are committed to protecting your data to the best of our ability.
            </p>
          </Section>

          <Divider />

          <Section title="8. Children's Privacy">
            <p>
              Our services are not directed to individuals under the age of 18. We do not knowingly collect
              personal information from children. If you believe we have inadvertently collected such information,
              please contact us immediately and we will delete it.
            </p>
          </Section>

          <Divider />

          <Section title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any significant changes
              by updating the &quot;Last Updated&quot; date at the top of this page. Continued use of our website after
              changes constitutes acceptance of the revised policy.
            </p>
          </Section>

          <Divider />

          <Section title="10. Contact Us">
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:</p>
            <div className="mt-4 p-5 rounded-xl border border-white/[0.08] bg-white/[0.03] space-y-2 text-sm text-gray-300">
              <p><span className="text-gray-500">Company:</span> StackX</p>
              <p>
                <span className="text-gray-500">Email:</span>{" "}
                <a href="mailto:hello@stackx.co.in" className="text-purple-400 hover:underline">hello@stackx.co.in</a>
              </p>
              <p>
                <span className="text-gray-500">Phone:</span>{" "}
                <a href="tel:+919490973391" className="text-purple-400 hover:underline">+91 93478 58844</a>
              </p>
              <p><span className="text-gray-500">Location:</span> Visakhapatnam, India</p>
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
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}
