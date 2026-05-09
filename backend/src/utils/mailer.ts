import nodemailer from "nodemailer";
import path from "path";

const LOGO_PATH = path.resolve(
  __dirname,
  "../../../frontend/public/StackX .png"
);

export async function sendApplicationConfirmation(
  to: string,
  fullName: string,
  position: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER || "nurajkandregula@gmail.com",
      pass: process.env.GMAIL_APP_PASS,
    },
  });

  const year = new Date().getFullYear();
  const firstName = fullName.split(" ")[0];

  const mailOptions = {
    from: `"StackX Careers" <${process.env.CAREERS_EMAIL || "careers@stackx.co.in"}>`,
    to,
    replyTo: process.env.CAREERS_EMAIL || "careers@stackx.co.in",
    subject: `🎉 Application Received – ${position} | StackX`,
    attachments: [
      {
        filename: "stackx-logo.png",
        path: LOGO_PATH,
        cid: "stackx-logo",
      },
    ],

    html: `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="x-apple-disable-message-reformatting"/>
  <title>Application Received – StackX</title>
  <style>
    /* ── RESET ────────────────────────────────────────── */
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse}
    img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;display:block}

    /* ── ANIMATIONS ────────────────────────────────────── */
    @keyframes shimmer {
      0%   { background-position: -800px 0; }
      100% { background-position:  800px 0; }
    }
    @keyframes float {
      0%,100% { transform: translateY(0); }
      50%      { transform: translateY(-7px); }
    }
    @keyframes pop {
      0%  { transform:scale(0.75); opacity:0; }
      75% { transform:scale(1.05); }
      100%{ transform:scale(1);    opacity:1; }
    }

    .shimmer-bar {
      background: linear-gradient(90deg,#7c3aed 0%,#a855f7 25%,#38bdf8 50%,#a855f7 75%,#7c3aed 100%);
      background-size: 800px 100%;
      animation: shimmer 3s linear infinite;
    }
    .logo-float { animation: float 4s ease-in-out infinite; }
    .pop        { animation: pop  .5s cubic-bezier(.34,1.56,.64,1) .2s both; }

    /* ── LIGHT MODE (default) ─────────────────────────── */
    body          { background-color: #eeeaf8 !important; }
    .bg-page      { background-color: #eeeaf8 !important; }
    .bg-logo      { background: linear-gradient(150deg,#13003d 0%,#200655 45%,#0a1850 100%) !important; }
    .bg-hero      { background: linear-gradient(160deg,#ede9fe 0%,#e0edff 60%,#f0fafb 100%) !important; }
    .bg-card      { background: #ffffff !important; }
    .bg-steps     { background: linear-gradient(135deg,#f5f0ff 0%,#edf4ff 100%) !important; }
    .bg-cta       { background: linear-gradient(135deg,#6d28d9 0%,#4f46e5 50%,#0891b2 100%) !important; }
    .bg-footer    { background-color: #ede9fe !important; }
    .col-h1       { color: #1e1b4b !important; }
    .col-h2       { color: #1e1b4b !important; }
    .col-body     { color: #4b5563 !important; }
    .col-label    { color: #9ca3af !important; }
    .col-val      { color: #1e1b4b !important; }
    .col-step-h   { color: #1e1b4b !important; }
    .col-step-b   { color: #6b7280 !important; }
    .col-footer   { color: #7c3aed !important; }
    .col-foot-sub { color: #6b7280 !important; }
    .col-foot-min { color: #9ca3af !important; }
    .card-border  { border: 1px solid rgba(124,58,237,.18) !important; }
    .sep-line     { border-top: 1px solid rgba(124,58,237,.1) !important; }
    .steps-border { border-left: 2px solid rgba(124,58,237,.2) !important; }

    /* ── DARK MODE overrides ──────────────────────────── */
    @media (prefers-color-scheme: dark) {
      body          { background-color: #0c0c1a !important; }
      .bg-page      { background-color: #0c0c1a !important; }
      .bg-hero      { background: linear-gradient(160deg,#170830 0%,#0e1840 60%,#071820 100%) !important; }
      .bg-card      { background: #131326 !important; }
      .bg-steps     { background: linear-gradient(135deg,#110b25 0%,#0b1530 100%) !important; }
      .bg-footer    { background-color: #100828 !important; }
      .col-h1       { color: #f1f5f9 !important; }
      .col-h2       { color: #f1f5f9 !important; }
      .col-body     { color: #94a3b8 !important; }
      .col-label    { color: #4b5563 !important; }
      .col-val      { color: #e2e8f0 !important; }
      .col-step-h   { color: #e2e8f0 !important; }
      .col-step-b   { color: #64748b !important; }
      .col-footer   { color: #a78bfa !important; }
      .col-foot-sub { color: #4b5563 !important; }
      .col-foot-min { color: #1e293b !important; }
      .card-border  { border: 1px solid rgba(124,58,237,.35) !important; }
      .sep-line     { border-top: 1px solid rgba(255,255,255,.06) !important; }
      .steps-border { border-left: 2px solid rgba(124,58,237,.3) !important; }
    }

    /* ── RESPONSIVE ───────────────────────────────────── */
    @media screen and (max-width:600px) {
      .ew          { width:100% !important; min-width:100% !important; }
      .p-hero      { padding:36px 20px 32px !important; }
      .p-sec       { padding:32px 20px !important; }
      .p-logo      { padding:40px 20px 34px !important; }
      .p-cta       { padding:40px 20px 44px !important; }
      .p-foot      { padding:28px 20px 32px !important; }
      .mob-h1      { font-size:26px !important; line-height:1.2 !important; }
      .mob-h2      { font-size:19px !important; }
      .step-num    { width:36px !important; height:36px !important; line-height:36px !important; font-size:12px !important; }
      .mob-btn     { padding:13px 28px !important; font-size:14px !important; }
      .dl-lbl      { display:block !important; width:100% !important; padding-bottom:2px !important; }
      .dl-val      { display:block !important; width:100% !important; }
    }
  </style>
</head>

<body style="margin:0;padding:0;width:100%;-webkit-font-smoothing:antialiased;">

<!-- preheader -->
<div style="display:none;font-size:1px;max-height:0;overflow:hidden;mso-hide:all;color:#eeeaf8;">
  Hey ${firstName}! Your ${position} application at StackX is in — we'll be in touch soon. 🚀&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;
</div>

<!-- ═══════════ ROOT ═══════════ -->
<table class="bg-page" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
  style="background-color:#eeeaf8;width:100%;margin:0;padding:0;">
<tr><td align="center" valign="top">

  <!-- ╔══ TOP SHIMMER ══╗ -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td class="shimmer-bar" height="4"
        style="background:linear-gradient(90deg,#7c3aed,#a855f7,#38bdf8,#a855f7,#7c3aed);
        height:4px;line-height:4px;font-size:0;">&nbsp;</td>
    </tr>
  </table>

  <!-- ╔══ LOGO HEADER — always dark (white logo needs dark bg) ══╗ -->
  <table class="bg-logo" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:linear-gradient(150deg,#13003d 0%,#200655 45%,#0a1850 100%);">
    <tr>
      <td align="center" valign="top">
        <table class="ew" role="presentation" cellpadding="0" cellspacing="0" border="0"
          width="620" style="width:620px;max-width:100%;">
          <tr>
            <td class="p-logo" align="center"
              style="padding:48px 40px 40px;text-align:center;">
              <div class="logo-float">
                <img src="cid:stackx-logo" alt="StackX" width="155"
                  style="display:block;margin:0 auto;max-width:155px;height:auto;
                  filter:drop-shadow(0 2px 16px rgba(167,139,250,.7));" />
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Smooth curve into hero -->
    <tr>
      <td style="line-height:0;font-size:0;">
        <table class="bg-hero" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
          style="background:linear-gradient(160deg,#ede9fe 0%,#e0edff 60%,#f0fafb 100%);">
          <tr>
            <td height="32" style="border-radius:0;background:transparent;
              font-size:0;line-height:0;">&nbsp;</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- ╔══ HERO ══╗ -->
  <table class="bg-hero" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:linear-gradient(160deg,#ede9fe 0%,#e0edff 60%,#f0fafb 100%);">
    <tr>
      <td align="center" valign="top">
        <table class="ew" role="presentation" cellpadding="0" cellspacing="0" border="0"
          width="620" style="width:620px;max-width:100%;">
          <tr>
            <td class="p-hero" align="center"
              style="padding:16px 48px 44px;text-align:center;">

              <!-- Pill badge -->
              <div class="pop" style="display:inline-block;
                background:linear-gradient(135deg,rgba(124,58,237,.15),rgba(56,189,248,.12));
                border:1px solid rgba(124,58,237,.3);border-radius:40px;
                padding:7px 22px;margin-bottom:22px;">
                <span style="font-size:12px;font-weight:700;letter-spacing:.6px;
                  color:#6d28d9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                  🎉 &nbsp;Application Confirmed
                </span>
              </div>

              <h1 class="mob-h1 col-h1"
                style="margin:0 0 16px;font-size:34px;font-weight:800;line-height:1.18;
                letter-spacing:-1.2px;color:#1e1b4b;
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                You're In, <span style="white-space:nowrap;">${firstName}! 🚀</span>
              </h1>

              <p class="col-body"
                style="margin:0;font-size:16px;line-height:1.8;color:#4b5563;
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;
                max-width:420px;margin-left:auto;margin-right:auto;">
                Your application for
                <strong style="color:#6d28d9;">${position}</strong>
                has been received. Our team is already excited to review it!
              </p>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- ╔══ SUMMARY CARD ══╗ -->
  <table class="bg-hero" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:linear-gradient(160deg,#ede9fe 0%,#e0edff 60%,#f0fafb 100%);">
    <tr>
      <td align="center" valign="top">
        <table class="ew" role="presentation" cellpadding="0" cellspacing="0" border="0"
          width="620" style="width:620px;max-width:100%;">
          <tr>
            <td class="p-sec" style="padding:0 40px 40px;">

              <table class="bg-card card-border" role="presentation" width="100%"
                cellpadding="0" cellspacing="0" border="0"
                style="background:#ffffff;border-radius:18px;
                border:1px solid rgba(124,58,237,.18);overflow:hidden;">
                <!-- card top stripe -->
                <tr>
                  <td style="height:3px;font-size:0;line-height:0;
                    background:linear-gradient(90deg,#7c3aed,#4f46e5,#38bdf8);">&nbsp;</td>
                </tr>
                <tr><td style="padding:26px 28px 22px;">

                  <p style="margin:0 0 18px;font-size:10px;font-weight:700;
                    letter-spacing:2.5px;text-transform:uppercase;color:#a78bfa;
                    font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                    Application Summary
                  </p>

                  <!-- Position -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="margin-bottom:10px;">
                    <tr>
                      <td class="dl-lbl col-label" width="110"
                        style="color:#9ca3af;font-size:11px;font-weight:700;
                        text-transform:uppercase;letter-spacing:.8px;
                        vertical-align:middle;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                        Position
                      </td>
                      <td class="dl-val col-val"
                        style="color:#1e1b4b;font-size:15px;font-weight:700;
                        vertical-align:middle;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                        ${position}
                      </td>
                    </tr>
                  </table>
                  <div class="sep-line"
                    style="border-top:1px solid rgba(124,58,237,.1);margin:0 0 10px;"></div>

                  <!-- Applicant -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="margin-bottom:10px;">
                    <tr>
                      <td class="dl-lbl col-label" width="110"
                        style="color:#9ca3af;font-size:11px;font-weight:700;
                        text-transform:uppercase;letter-spacing:.8px;
                        vertical-align:middle;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                        Applicant
                      </td>
                      <td class="dl-val col-val"
                        style="color:#1e1b4b;font-size:15px;font-weight:700;
                        vertical-align:middle;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                        ${fullName}
                      </td>
                    </tr>
                  </table>
                  <div class="sep-line"
                    style="border-top:1px solid rgba(124,58,237,.1);margin:0 0 12px;"></div>

                  <!-- Status -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td class="dl-lbl col-label" width="110"
                        style="color:#9ca3af;font-size:11px;font-weight:700;
                        text-transform:uppercase;letter-spacing:.8px;
                        vertical-align:middle;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                        Status
                      </td>
                      <td class="dl-val" style="vertical-align:middle;">
                        <span class="pop"
                          style="display:inline-block;background:#f0fdf4;
                          border:1px solid #86efac;border-radius:40px;
                          padding:5px 16px;color:#15803d;font-size:12px;
                          font-weight:700;letter-spacing:.3px;
                          font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                          ✓ &nbsp;Received &amp; Under Review
                        </span>
                      </td>
                    </tr>
                  </table>

                </td></tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- ╔══ BODY COPY ══╗ -->
  <table class="bg-page" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background-color:#eeeaf8;">
    <tr>
      <td align="center" valign="top">
        <table class="ew" role="presentation" cellpadding="0" cellspacing="0" border="0"
          width="620" style="width:620px;max-width:100%;">
          <tr>
            <td class="p-sec" style="padding:36px 48px;">
              <p class="col-body"
                style="margin:0;font-size:15px;line-height:1.9;color:#4b5563;
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;text-align:center;">
                Hi <strong class="col-h1" style="color:#1e1b4b;">${firstName}</strong>,
                we truly appreciate your interest in joining StackX. Every application
                means a lot to us — we'll get back to you with updates as soon as possible.
                Good luck! 🤞
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- ╔══ WHAT'S NEXT ══╗ -->
  <table class="bg-steps" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:linear-gradient(135deg,#f5f0ff 0%,#edf4ff 100%);">
    <tr>
      <td align="center" valign="top">
        <table class="ew" role="presentation" cellpadding="0" cellspacing="0" border="0"
          width="620" style="width:620px;max-width:100%;">
          <tr>
            <td class="p-sec" style="padding:40px 48px 44px;">

              <p style="margin:0 0 28px;font-size:10px;font-weight:700;letter-spacing:2.5px;
                text-transform:uppercase;color:#a78bfa;text-align:center;
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;">What Happens Next</p>

              <!-- Step 1 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                border="0" style="margin-bottom:20px;">
                <tr>
                  <td width="52" valign="top">
                    <div class="step-num"
                      style="width:42px;height:42px;line-height:42px;border-radius:50%;
                      background:linear-gradient(135deg,#7c3aed,#38bdf8);
                      text-align:center;font-size:14px;font-weight:800;
                      color:#fff;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">1</div>
                  </td>
                  <td class="steps-border" valign="top"
                    style="border-left:2px solid rgba(124,58,237,.2);
                    padding-left:20px;padding-top:4px;padding-bottom:4px;">
                    <p class="col-step-h"
                      style="margin:0 0 4px;font-size:14px;font-weight:700;color:#1e1b4b;
                      font-family:'Segoe UI',Helvetica,Arial,sans-serif;">Application Review</p>
                    <p class="col-step-b"
                      style="margin:0;font-size:13px;line-height:1.7;color:#6b7280;
                      font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                      We read every application with full attention.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Step 2 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                border="0" style="margin-bottom:20px;">
                <tr>
                  <td width="52" valign="top">
                    <div class="step-num"
                      style="width:42px;height:42px;line-height:42px;border-radius:50%;
                      background:linear-gradient(135deg,#7c3aed,#38bdf8);
                      text-align:center;font-size:14px;font-weight:800;
                      color:#fff;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">2</div>
                  </td>
                  <td class="steps-border" valign="top"
                    style="border-left:2px solid rgba(124,58,237,.2);
                    padding-left:20px;padding-top:4px;padding-bottom:4px;">
                    <p class="col-step-h"
                      style="margin:0 0 4px;font-size:14px;font-weight:700;color:#1e1b4b;
                      font-family:'Segoe UI',Helvetica,Arial,sans-serif;">Shortlisting</p>
                    <p class="col-step-b"
                      style="margin:0;font-size:13px;line-height:1.7;color:#6b7280;
                      font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                      Best-fit candidates are selected and move forward.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Step 3 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="52" valign="top">
                    <div class="step-num"
                      style="width:42px;height:42px;line-height:42px;border-radius:50%;
                      background:linear-gradient(135deg,#7c3aed,#38bdf8);
                      text-align:center;font-size:14px;font-weight:800;
                      color:#fff;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">3</div>
                  </td>
                  <td valign="top" style="padding-left:20px;padding-top:4px;">
                    <p class="col-step-h"
                      style="margin:0 0 4px;font-size:14px;font-weight:700;color:#1e1b4b;
                      font-family:'Segoe UI',Helvetica,Arial,sans-serif;">We Reach Out</p>
                    <p class="col-step-b"
                      style="margin:0;font-size:13px;line-height:1.7;color:#6b7280;
                      font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                      If selected, we email you to schedule your interview.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- ╔══ CTA SECTION ══╗ -->
  <table class="bg-cta" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:linear-gradient(135deg,#6d28d9 0%,#4f46e5 50%,#0891b2 100%);">
    <tr>
      <td align="center" valign="top">
        <table class="ew" role="presentation" cellpadding="0" cellspacing="0" border="0"
          width="620" style="width:620px;max-width:100%;">
          <tr>
            <td class="p-cta" align="center"
              style="padding:48px 48px 52px;text-align:center;">

              <h2 class="mob-h2"
                style="margin:0 0 12px;font-size:22px;font-weight:800;color:#ffffff;
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;line-height:1.3;">
                Explore More Opportunities
              </h2>
              <p style="margin:0 0 28px;font-size:14px;line-height:1.75;
                color:rgba(255,255,255,.8);
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                While your application is under review, browse other open<br/>
                roles at StackX — your perfect match might be one click away.
              </p>

              <a href="https://stackx.co.in/careers" target="_blank"
                class="mob-btn"
                style="display:inline-block;background:#ffffff;color:#6d28d9;
                font-size:15px;font-weight:800;text-decoration:none;
                padding:15px 40px;border-radius:50px;letter-spacing:.2px;
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;
                box-shadow:0 8px 32px rgba(0,0,0,.25);">
                View Open Roles &rarr;
              </a>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- ╔══ FOOTER ══╗ -->
  <table class="bg-footer" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background-color:#ede9fe;border-top:1px solid rgba(124,58,237,.12);">
    <tr>
      <td align="center" valign="top">
        <table class="ew" role="presentation" cellpadding="0" cellspacing="0" border="0"
          width="620" style="width:620px;max-width:100%;">
          <tr>
            <td class="p-foot" align="center"
              style="padding:30px 48px 34px;text-align:center;">
              <p style="margin:0 0 10px;font-size:13px;
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                <a href="https://stackx.co.in" target="_blank"
                  class="col-footer"
                  style="color:#7c3aed;text-decoration:none;font-weight:700;">
                  stackx.co.in
                </a>
                &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                <a href="mailto:careers@stackx.co.in"
                  class="col-footer"
                  style="color:#7c3aed;text-decoration:none;font-weight:700;">
                  careers@stackx.co.in
                </a>
              </p>
              <p class="col-foot-sub"
                style="margin:0 0 4px;font-size:11px;color:#6b7280;line-height:1.6;
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                © ${year} StackX Technologies. All rights reserved.
              </p>
              <p class="col-foot-min"
                style="margin:0;font-size:11px;color:#9ca3af;line-height:1.6;
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                You received this because you applied for a role at stackx.co.in
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- ╔══ BOTTOM SHIMMER ══╗ -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td class="shimmer-bar" height="4"
        style="background:linear-gradient(90deg,#7c3aed,#a855f7,#38bdf8,#a855f7,#7c3aed);
        height:4px;line-height:4px;font-size:0;">&nbsp;</td>
    </tr>
  </table>

</td></tr>
</table>
</body>
</html>
    `,

    text: `Hey ${firstName}! 🎉\n\nYou're In! Your application for "${position}" at StackX has been received.\n\nSummary:\n- Position: ${position}\n- Applicant: ${fullName}\n- Status: Received & Under Review\n\nWe truly appreciate your interest. Our team will review your application carefully and reach out with next steps soon.\n\nWhat happens next:\n1. Application Review — every application is read with full attention.\n2. Shortlisting — best-fit candidates move forward.\n3. We Reach Out — if selected, we'll email you to schedule an interview.\n\nExplore more roles: https://stackx.co.in/careers\n\nBest,\nStackX Careers Team\ncareers@stackx.co.in\n© ${year} StackX Technologies`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ Confirmation email sent to ${to}`);
}

// ─── sendContactConfirmation ────────────────────────────────────────────────────
/**
 * Sends a professional thank-you email to someone who submitted the contact form.
 *
 * @param to          - Sender's email addresss
 * @param name        - Sender's full name
 * @param service     - Service they enquired about
 * @param company     - Their company name (optional)
 */
export async function sendContactConfirmation(
  to: string,
  name: string,
  service: string,
  company?: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER || "nurajkandregula@gmail.com",
      pass: process.env.GMAIL_APP_PASS,
    },
  });

  const year = new Date().getFullYear();
  const firstName = name.split(" ")[0];

  const mailOptions = {
    from: `"StackX" <${process.env.CONTACT_EMAIL || "contact@stackx.co.in"}>`,
    to,
    replyTo: process.env.CONTACT_EMAIL || "contact@stackx.co.in",
    subject: `✅ We got your message – StackX`,
    attachments: [
      {
        filename: "stackx-logo.png",
        path: LOGO_PATH,
        cid: "stackx-logo",
      },
    ],

    html: `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="x-apple-disable-message-reformatting"/>
  <title>Message Received – StackX</title>
  <style>
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse}
    img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;display:block}

    @keyframes shimmer {
      0%   { background-position: -800px 0; }
      100% { background-position:  800px 0; }
    }
    @keyframes float {
      0%,100% { transform: translateY(0); }
      50%      { transform: translateY(-7px); }
    }
    @keyframes pop {
      0%  { transform:scale(0.75); opacity:0; }
      75% { transform:scale(1.05); }
      100%{ transform:scale(1);    opacity:1; }
    }

    .shimmer-bar {
      background: linear-gradient(90deg,#0891b2 0%,#6d28d9 25%,#a855f7 50%,#6d28d9 75%,#0891b2 100%);
      background-size: 800px 100%;
      animation: shimmer 3s linear infinite;
    }
    .logo-float { animation: float 4s ease-in-out infinite; }
    .pop        { animation: pop .5s cubic-bezier(.34,1.56,.64,1) .2s both; }

    /* Light mode */
    body       { background-color: #eef6fb !important; }
    .bg-page   { background-color: #eef6fb !important; }
    .bg-logo   { background: linear-gradient(150deg,#03002e 0%,#0a1850 45%,#051428 100%) !important; }
    .bg-hero   { background: linear-gradient(160deg,#e0f2fe 0%,#ede9fe 55%,#f0fafb 100%) !important; }
    .bg-card   { background: #ffffff !important; }
    .bg-steps  { background: linear-gradient(135deg,#f0f9ff 0%,#f5f0ff 100%) !important; }
    .bg-cta    { background: linear-gradient(135deg,#0891b2 0%,#4f46e5 50%,#6d28d9 100%) !important; }
    .bg-footer { background-color: #e0f2fe !important; }
    .col-h1    { color: #0c1a4d !important; }
    .col-body  { color: #4b5563 !important; }
    .col-label { color: #9ca3af !important; }
    .col-val   { color: #0c1a4d !important; }
    .col-step-h{ color: #0c1a4d !important; }
    .col-step-b{ color: #6b7280 !important; }
    .col-link  { color: #0891b2 !important; }
    .col-fsub  { color: #6b7280 !important; }
    .col-fmin  { color: #9ca3af !important; }
    .card-border{ border: 1px solid rgba(8,145,178,.2) !important; }
    .sep-line  { border-top: 1px solid rgba(8,145,178,.12) !important; }
    .step-left { border-left: 2px solid rgba(8,145,178,.25) !important; }

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      body       { background-color: #030d1a !important; }
      .bg-page   { background-color: #030d1a !important; }
      .bg-hero   { background: linear-gradient(160deg,#041428 0%,#130830 55%,#021020 100%) !important; }
      .bg-card   { background: #0a1628 !important; }
      .bg-steps  { background: linear-gradient(135deg,#051520 0%,#100825 100%) !important; }
      .bg-footer { background-color: #041428 !important; }
      .col-h1    { color: #f1f5f9 !important; }
      .col-body  { color: #94a3b8 !important; }
      .col-label { color: #4b5563 !important; }
      .col-val   { color: #e2e8f0 !important; }
      .col-step-h{ color: #e2e8f0 !important; }
      .col-step-b{ color: #64748b !important; }
      .col-link  { color: #38bdf8 !important; }
      .col-fsub  { color: #4b5563 !important; }
      .col-fmin  { color: #1e293b !important; }
      .card-border{ border: 1px solid rgba(56,189,248,.25) !important; }
      .sep-line  { border-top: 1px solid rgba(255,255,255,.06) !important; }
      .step-left { border-left: 2px solid rgba(56,189,248,.25) !important; }
    }

    @media screen and (max-width:600px) {
      .ew      { width:100% !important; min-width:100% !important; }
      .p-hero  { padding:32px 18px 28px !important; }
      .p-logo  { padding:38px 18px 32px !important; }
      .p-sec   { padding:28px 18px !important; }
      .p-cta   { padding:36px 18px 40px !important; }
      .p-foot  { padding:24px 18px 28px !important; }
      .mob-h1  { font-size:26px !important; line-height:1.2 !important; }
      .mob-btn { padding:13px 28px !important; font-size:14px !important; }
      .dl-lbl  { display:block !important; width:100% !important; }
      .dl-val  { display:block !important; width:100% !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;width:100%;-webkit-font-smoothing:antialiased;">

<!-- preheader -->
<div style="display:none;font-size:1px;max-height:0;overflow:hidden;mso-hide:all;color:#eef6fb;">
  Hey ${firstName}! We got your message about ${service} and will get back to you very soon. 💬&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;
</div>

<!-- ROOT -->
<table class="bg-page" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
  style="background-color:#eef6fb;width:100%;margin:0;padding:0;">
<tr><td align="center" valign="top">

  <!-- TOP SHIMMER -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td class="shimmer-bar" height="4"
        style="background:linear-gradient(90deg,#0891b2,#6d28d9,#a855f7,#6d28d9,#0891b2);
        height:4px;line-height:4px;font-size:0;">&nbsp;</td>
    </tr>
  </table>

  <!-- LOGO HEADER -->
  <table class="bg-logo" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:linear-gradient(150deg,#03002e 0%,#0a1850 45%,#051428 100%);">
    <tr>
      <td align="center" valign="top">
        <table class="ew" role="presentation" cellpadding="0" cellspacing="0" border="0"
          width="620" style="width:620px;max-width:100%;">
          <tr>
            <td class="p-logo" align="center" style="padding:48px 40px 40px;text-align:center;">
              <div class="logo-float">
                <img src="cid:stackx-logo" alt="StackX" width="155"
                  style="display:block;margin:0 auto;max-width:155px;height:auto;
                  filter:drop-shadow(0 2px 16px rgba(56,189,248,.6));" />
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="line-height:0;font-size:0;">
        <table class="bg-hero" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
          style="background:linear-gradient(160deg,#e0f2fe 0%,#ede9fe 55%,#f0fafb 100%);">
          <tr><td height="32" style="font-size:0;line-height:0;">&nbsp;</td></tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- HERO -->
  <table class="bg-hero" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:linear-gradient(160deg,#e0f2fe 0%,#ede9fe 55%,#f0fafb 100%);">
    <tr>
      <td align="center" valign="top">
        <table class="ew" role="presentation" cellpadding="0" cellspacing="0" border="0"
          width="620" style="width:620px;max-width:100%;">
          <tr>
            <td class="p-hero" align="center" style="padding:16px 48px 44px;text-align:center;">

              <!-- Pill -->
              <div class="pop" style="display:inline-block;
                background:linear-gradient(135deg,rgba(8,145,178,.12),rgba(109,40,217,.1));
                border:1px solid rgba(8,145,178,.35);border-radius:40px;
                padding:7px 22px;margin-bottom:22px;">
                <span style="font-size:12px;font-weight:700;letter-spacing:.6px;
                  color:#0891b2;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                  ✅ &nbsp;Message Received
                </span>
              </div>

              <h1 class="mob-h1 col-h1"
                style="margin:0 0 16px;font-size:34px;font-weight:800;line-height:1.18;
                letter-spacing:-1.2px;color:#0c1a4d;
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                Thanks for reaching out, <span style="white-space:nowrap;">${firstName}! 💬</span>
              </h1>

              <p class="col-body"
                style="margin:0;font-size:16px;line-height:1.8;color:#4b5563;
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;
                max-width:430px;margin-left:auto;margin-right:auto;">
                We've received your enquiry about
                <strong style="color:#0891b2;">${service}</strong>${company ? ` from <strong style="color:#6d28d9;">${company}</strong>` : ""}.
                Our team will get back to you shortly!
              </p>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- SUMMARY CARD -->
  <table class="bg-hero" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:linear-gradient(160deg,#e0f2fe 0%,#ede9fe 55%,#f0fafb 100%);">
    <tr>
      <td align="center" valign="top">
        <table class="ew" role="presentation" cellpadding="0" cellspacing="0" border="0"
          width="620" style="width:620px;max-width:100%;">
          <tr>
            <td class="p-sec" style="padding:0 40px 40px;">
              <table class="bg-card card-border" role="presentation" width="100%"
                cellpadding="0" cellspacing="0" border="0"
                style="background:#ffffff;border-radius:18px;
                border:1px solid rgba(8,145,178,.2);overflow:hidden;">
                <tr>
                  <td style="height:3px;font-size:0;line-height:0;
                    background:linear-gradient(90deg,#0891b2,#4f46e5,#6d28d9);">&nbsp;</td>
                </tr>
                <tr><td style="padding:26px 28px 22px;">

                  <p style="margin:0 0 18px;font-size:10px;font-weight:700;
                    letter-spacing:2.5px;text-transform:uppercase;color:#38bdf8;
                    font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                    Enquiry Summary
                  </p>

                  <!-- Name -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                    border="0" style="margin-bottom:10px;">
                    <tr>
                      <td class="dl-lbl col-label" width="110"
                        style="color:#9ca3af;font-size:11px;font-weight:700;
                        text-transform:uppercase;letter-spacing:.8px;vertical-align:middle;
                        font-family:'Segoe UI',Helvetica,Arial,sans-serif;">Name</td>
                      <td class="dl-val col-val"
                        style="color:#0c1a4d;font-size:15px;font-weight:700;
                        vertical-align:middle;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                        ${name}
                      </td>
                    </tr>
                  </table>
                  <div class="sep-line" style="border-top:1px solid rgba(8,145,178,.12);margin:0 0 10px;"></div>

                  <!-- Service -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                    border="0" style="margin-bottom:10px;">
                    <tr>
                      <td class="dl-lbl col-label" width="110"
                        style="color:#9ca3af;font-size:11px;font-weight:700;
                        text-transform:uppercase;letter-spacing:.8px;vertical-align:middle;
                        font-family:'Segoe UI',Helvetica,Arial,sans-serif;">Service</td>
                      <td class="dl-val col-val"
                        style="color:#0c1a4d;font-size:15px;font-weight:700;
                        vertical-align:middle;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                        ${service}
                      </td>
                    </tr>
                  </table>
                  ${company ? `
                  <div class="sep-line" style="border-top:1px solid rgba(8,145,178,.12);margin:0 0 10px;"></div>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                    border="0" style="margin-bottom:10px;">
                    <tr>
                      <td class="dl-lbl col-label" width="110"
                        style="color:#9ca3af;font-size:11px;font-weight:700;
                        text-transform:uppercase;letter-spacing:.8px;vertical-align:middle;
                        font-family:'Segoe UI',Helvetica,Arial,sans-serif;">Company</td>
                      <td class="dl-val col-val"
                        style="color:#0c1a4d;font-size:15px;font-weight:700;
                        vertical-align:middle;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                        ${company}
                      </td>
                    </tr>
                  </table>` : ""}
                  <div class="sep-line" style="border-top:1px solid rgba(8,145,178,.12);margin:0 0 12px;"></div>

                  <!-- Status -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td class="dl-lbl col-label" width="110"
                        style="color:#9ca3af;font-size:11px;font-weight:700;
                        text-transform:uppercase;letter-spacing:.8px;vertical-align:middle;
                        font-family:'Segoe UI',Helvetica,Arial,sans-serif;">Status</td>
                      <td class="dl-val" style="vertical-align:middle;">
                        <span class="pop"
                          style="display:inline-block;background:#f0fdf4;
                          border:1px solid #86efac;border-radius:40px;
                          padding:5px 16px;color:#15803d;font-size:12px;
                          font-weight:700;letter-spacing:.3px;
                          font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                          ✓ &nbsp;Received — We'll Be In Touch
                        </span>
                      </td>
                    </tr>
                  </table>

                </td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- BODY COPY -->
  <table class="bg-page" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background-color:#eef6fb;">
    <tr>
      <td align="center" valign="top">
        <table class="ew" role="presentation" cellpadding="0" cellspacing="0" border="0"
          width="620" style="width:620px;max-width:100%;">
          <tr>
            <td class="p-sec" style="padding:36px 48px;">
              <p class="col-body"
                style="margin:0;font-size:15px;line-height:1.9;color:#4b5563;
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;text-align:center;">
                Hi <strong class="col-h1" style="color:#0c1a4d;">${firstName}</strong>,
                thank you for getting in touch with us! One of our team members will
                review your message and respond within <strong style="color:#0891b2;">1–2 business days</strong>.
                We look forward to connecting with you. 🤝
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- WHAT HAPPENS NEXT -->
  <table class="bg-steps" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:linear-gradient(135deg,#f0f9ff 0%,#f5f0ff 100%);">
    <tr>
      <td align="center" valign="top">
        <table class="ew" role="presentation" cellpadding="0" cellspacing="0" border="0"
          width="620" style="width:620px;max-width:100%;">
          <tr>
            <td class="p-sec" style="padding:40px 48px 44px;">

              <p style="margin:0 0 28px;font-size:10px;font-weight:700;letter-spacing:2.5px;
                text-transform:uppercase;color:#38bdf8;text-align:center;
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;">What Happens Next</p>

              <!-- Step 1 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                border="0" style="margin-bottom:20px;">
                <tr>
                  <td width="52" valign="top">
                    <div style="width:42px;height:42px;line-height:42px;border-radius:50%;
                      background:linear-gradient(135deg,#0891b2,#6d28d9);
                      text-align:center;font-size:14px;font-weight:800;
                      color:#fff;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">1</div>
                  </td>
                  <td class="step-left" valign="top"
                    style="border-left:2px solid rgba(8,145,178,.25);
                    padding-left:20px;padding-top:4px;padding-bottom:4px;">
                    <p class="col-step-h"
                      style="margin:0 0 4px;font-size:14px;font-weight:700;color:#0c1a4d;
                      font-family:'Segoe UI',Helvetica,Arial,sans-serif;">Message Review</p>
                    <p class="col-step-b"
                      style="margin:0;font-size:13px;line-height:1.7;color:#6b7280;
                      font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                      Our team reviews your enquiry and assigns it to the right person.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Step 2 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                border="0" style="margin-bottom:20px;">
                <tr>
                  <td width="52" valign="top">
                    <div style="width:42px;height:42px;line-height:42px;border-radius:50%;
                      background:linear-gradient(135deg,#0891b2,#6d28d9);
                      text-align:center;font-size:14px;font-weight:800;
                      color:#fff;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">2</div>
                  </td>
                  <td class="step-left" valign="top"
                    style="border-left:2px solid rgba(8,145,178,.25);
                    padding-left:20px;padding-top:4px;padding-bottom:4px;">
                    <p class="col-step-h"
                      style="margin:0 0 4px;font-size:14px;font-weight:700;color:#0c1a4d;
                      font-family:'Segoe UI',Helvetica,Arial,sans-serif;">We Prepare a Response</p>
                    <p class="col-step-b"
                      style="margin:0;font-size:13px;line-height:1.7;color:#6b7280;
                      font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                      We put together the most helpful, tailored answer for your needs.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Step 3 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="52" valign="top">
                    <div style="width:42px;height:42px;line-height:42px;border-radius:50%;
                      background:linear-gradient(135deg,#0891b2,#6d28d9);
                      text-align:center;font-size:14px;font-weight:800;
                      color:#fff;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">3</div>
                  </td>
                  <td valign="top" style="padding-left:20px;padding-top:4px;">
                    <p class="col-step-h"
                      style="margin:0 0 4px;font-size:14px;font-weight:700;color:#0c1a4d;
                      font-family:'Segoe UI',Helvetica,Arial,sans-serif;">You Hear Back!</p>
                    <p class="col-step-b"
                      style="margin:0;font-size:13px;line-height:1.7;color:#6b7280;
                      font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                      Expect a reply within 1–2 business days — usually sooner!
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- CTA -->
  <table class="bg-cta" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:linear-gradient(135deg,#0891b2 0%,#4f46e5 50%,#6d28d9 100%);">
    <tr>
      <td align="center" valign="top">
        <table class="ew" role="presentation" cellpadding="0" cellspacing="0" border="0"
          width="620" style="width:620px;max-width:100%;">
          <tr>
            <td class="p-cta" align="center" style="padding:48px 48px 52px;text-align:center;">
              <h2 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#ffffff;
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;line-height:1.3;">
                Explore What We Do
              </h2>
              <p style="margin:0 0 28px;font-size:14px;line-height:1.75;
                color:rgba(255,255,255,.8);
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                While you wait, take a look at our services and portfolio
                to see how StackX can help bring your vision to life.
              </p>
              <a href="https://stackx.co.in/services" target="_blank"
                class="mob-btn"
                style="display:inline-block;background:#ffffff;color:#0891b2;
                font-size:15px;font-weight:800;text-decoration:none;
                padding:15px 40px;border-radius:50px;letter-spacing:.2px;
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;
                box-shadow:0 8px 32px rgba(0,0,0,.25);">
                View Our Services &rarr;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- FOOTER -->
  <table class="bg-footer" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background-color:#e0f2fe;border-top:1px solid rgba(8,145,178,.12);">
    <tr>
      <td align="center" valign="top">
        <table class="ew" role="presentation" cellpadding="0" cellspacing="0" border="0"
          width="620" style="width:620px;max-width:100%;">
          <tr>
            <td class="p-foot" align="center" style="padding:30px 48px 34px;text-align:center;">
              <p style="margin:0 0 10px;font-size:13px;
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                <a href="https://stackx.co.in" target="_blank"
                  class="col-link"
                  style="color:#0891b2;text-decoration:none;font-weight:700;">
                  stackx.co.in
                </a>
                &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                <a href="mailto:contact@stackx.co.in"
                  class="col-link"
                  style="color:#0891b2;text-decoration:none;font-weight:700;">
                  contact@stackx.co.in
                </a>
              </p>
              <p class="col-fsub"
                style="margin:0 0 4px;font-size:11px;color:#6b7280;line-height:1.6;
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                © ${year} StackX Technologies. All rights reserved.
              </p>
              <p class="col-fmin"
                style="margin:0;font-size:11px;color:#9ca3af;line-height:1.6;
                font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                You received this because you submitted a contact form on stackx.co.in
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- BOTTOM SHIMMER -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td class="shimmer-bar" height="4"
        style="background:linear-gradient(90deg,#0891b2,#6d28d9,#a855f7,#6d28d9,#0891b2);
        height:4px;line-height:4px;font-size:0;">&nbsp;</td>
    </tr>
  </table>

</td></tr>
</table>
</body>
</html>
    `,

    text: `Hey ${firstName}! ✅\n\nThanks for reaching out to StackX!\n\nEnquiry Summary:\n- Name: ${name}\n- Service: ${service}${company ? `\n- Company: ${company}` : ""}\n- Status: Received — We'll Be In Touch\n\nOne of our team members will review your message and respond within 1–2 business days.\n\nWhat happens next:\n1. Message Review — we assign your enquiry to the right person.\n2. We Prepare a Response — a tailored answer for your needs.\n3. You Hear Back! — expect a reply within 1–2 business days.\n\nExplore our services: https://stackx.co.in/services\n\nBest,\nStackX Team\ncontact@stackx.co.in\n© ${year} StackX Technologies`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ Contact confirmation email sent to ${to}`);
}
