/**
 * Easy Labs Ltd — Backend Server & Brevo Email Dispatcher
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from current directory
app.use(express.static(path.join(__dirname)));

// Configuration Settings
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_NAME = process.env.SENDER_NAME || "Easy Labs Ltd";
const SENDER_EMAIL = process.env.SENDER_EMAIL || "info@easylabsltd.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "info@easylabsltd.com";

// Optional Brevo SMTP Fallback Configuration
const BREVO_SMTP_LOGIN = process.env.BREVO_SMTP_LOGIN;
const BREVO_SMTP_KEY = process.env.BREVO_SMTP_KEY;

let smtpTransporter = null;
if (BREVO_SMTP_LOGIN && BREVO_SMTP_KEY) {
  smtpTransporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: BREVO_SMTP_LOGIN,
      pass: BREVO_SMTP_KEY,
    },
  });
}

/**
 * Send an email via Brevo REST API v3 (Preferred) or Brevo SMTP
 */
async function sendBrevoEmail({ to, subject, htmlContent, replyTo }) {
  // If Brevo REST API Key is configured
  if (BREVO_API_KEY && BREVO_API_KEY !== "YOUR_BREVO_API_KEY_HERE") {
    const payload = {
      sender: {
        name: SENDER_NAME,
        email: SENDER_EMAIL,
      },
      to: Array.isArray(to)
        ? to
        : [{ email: to.email, name: to.name || to.email }],
      subject: subject,
      htmlContent: htmlContent,
    };

    if (replyTo) {
      payload.replyTo = {
        email: replyTo.email,
        name: replyTo.name || replyTo.email,
      };
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Brevo API returned status ${response.status}`,
      );
    }

    return await response.json();
  }

  // Fallback to Brevo SMTP if configured
  if (smtpTransporter) {
    const mailOptions = {
      from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
      to:
        typeof to === "object" && to.email
          ? `"${to.name || ""}" <${to.email}>`
          : to,
      subject: subject,
      html: htmlContent,
      replyTo: replyTo
        ? `"${replyTo.name || ""}" <${replyTo.email}>`
        : undefined,
    };

    return await smtpTransporter.sendMail(mailOptions);
  }

  // If no credentials configured yet, simulate dispatch in development mode
  console.warn(
    "[DEV MODE] Brevo credentials not set in .env. Email simulated successfully.",
  );
  return { messageId: "simulated-dev-id-" + Date.now() };
}

/**
 * Map product slugs to human-readable names
 */
function getInterestLabel(interest) {
  const map = {
    easyworkflow: "EasyWorkFlow™ (Enterprise Digital & e-Signature Suite)",
    tracesign: "EasyWorkFlow™ (Enterprise Digital & e-Signature Suite)",
    docsign: "EasyWorkFlow™ (Enterprise Digital & e-Signature Suite)",
    easyschoolflow: "EasySchoolFlow™ (Education Management / Campus OS)",
    easylearn: "EasySchoolFlow™ (Education Management / Campus OS)",
    eserp: "EsERP™ (Enterprise Resource Planning)",
    careflowhms: "CareflowHMS™ (Hospital Management Information System)",
    esmed: "CareflowHMS™ (Hospital Management Information System)",
    "ai-apps": "Custom AI-Native Application",
    "web-mobile": "Web & Mobile Development",
    consulting: "Technology Consulting & Cloud Advisory",
  };
  return map[interest] || interest || "General Product Inquiry";
}

/* --------------------------------------------------------------------------
   API Routes
   -------------------------------------------------------------------------- */

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    timestamp: new Date().toISOString(),
    brevoConfigured: Boolean(
      BREVO_API_KEY && BREVO_API_KEY !== "YOUR_BREVO_API_KEY_HERE",
    ),
  });
});

// Contact & Lead Submission Endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, company, interest, message } = req.body;

    // Basic Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields (Name, Email, and Message are required).",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address.",
      });
    }

    const interestTitle = getInterestLabel(interest);
    const companyDisplay = company
      ? company.trim()
      : "Individual / Not Specified";
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMessage = message.trim().replace(/\n/g, "<br>");

    // ------------------------------------------------------------------------
    // 1. Email to Easy Labs Team (Admin Notification)
    // ------------------------------------------------------------------------
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0b0f19; color: #f3f6fc; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: auto; background: #131b2e; border: 1px solid #24324f; border-radius: 12px; padding: 32px; }
          .header { border-bottom: 1px solid #24324f; padding-bottom: 20px; margin-bottom: 24px; }
          .badge { display: inline-block; background: rgba(0, 229, 153, 0.15); color: #00e599; border: 1px solid rgba(0, 229, 153, 0.3); padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: bold; }
          h2 { color: #ffffff; margin-top: 12px; margin-bottom: 0; }
          .field-group { margin-bottom: 16px; }
          .field-label { font-size: 12px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; margin-bottom: 4px; }
          .field-val { font-size: 15px; color: #ffffff; font-weight: 500; }
          .message-box { background: #07090e; border: 1px solid #24324f; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #cbd5e1; }
          .reply-btn { display: inline-block; margin-top: 24px; background: #00e599; color: #07090e; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; }
          .footer { margin-top: 24px; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">NEW LEAD / INQUIRY</span>
            <h2>Inquiry from ${cleanName}</h2>
          </div>

          <div class="field-group">
            <div class="field-label">Lead Name</div>
            <div class="field-val">${cleanName}</div>
          </div>

          <div class="field-group">
            <div class="field-label">Work Email</div>
            <div class="field-val"><a href="mailto:${cleanEmail}" style="color:#38bdf8;">${cleanEmail}</a></div>
          </div>

          <div class="field-group">
            <div class="field-label">Company / Institution</div>
            <div class="field-val">${companyDisplay}</div>
          </div>

          <div class="field-group">
            <div class="field-label">Area of Interest</div>
            <div class="field-val" style="color:#00e599;">${interestTitle}</div>
          </div>

          <div class="field-group">
            <div class="field-label">Project Scope & Requirements</div>
            <div class="message-box">${cleanMessage}</div>
          </div>

          <a href="mailto:${cleanEmail}?subject=Re:%20Easy%20Labs%20Consultation%20-%20${encodeURIComponent(interestTitle)}" class="reply-btn">Reply to ${cleanName}</a>

          <div class="footer">
            Easy Labs Ltd — Lead Telemetry Dispatcher &bull; ${new Date().toUTCString()}
          </div>
        </div>
      </body>
      </html>
    `;

    // ------------------------------------------------------------------------
    // 2. Email to the User (Auto-Responder Confirmation)
    // ------------------------------------------------------------------------
    const userHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #07090e; color: #f3f6fc; margin: 0; padding: 24px; }
          .card { max-width: 600px; margin: auto; background: #0f1422; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
          .brand-banner { background: linear-gradient(135deg, #0d121d 0%, #131b2e 100%); padding: 32px; border-bottom: 1px solid #1e293b; text-align: center; }
          .logo-text { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
          .logo-dot { color: #00e599; }
          .body-content { padding: 32px; line-height: 1.7; font-size: 15px; color: #cbd5e1; }
          h3 { color: #ffffff; font-size: 18px; margin-top: 0; }
          .summary-card { background: #07090e; border: 1px solid #1e293b; border-radius: 10px; padding: 20px; margin: 24px 0; }
          .summary-row { margin-bottom: 10px; font-size: 14px; }
          .summary-row:last-child { margin-bottom: 0; }
          .summary-label { color: #94a3b8; font-weight: 600; }
          .summary-val { color: #ffffff; }
          .badge { display: inline-block; background: rgba(0, 229, 153, 0.15); color: #00e599; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
          .product-links { margin-top: 24px; border-top: 1px solid #1e293b; padding-top: 20px; }
          .footer { background: #07090e; padding: 24px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="brand-banner">
            <div class="logo-text">Easy Labs<span class="logo-dot">.</span></div>
            <div style="font-size: 13px; color: #94a3b8; margin-top: 4px;">Technology Consulting & Enterprise Product Lab</div>
          </div>

          <div class="body-content">
            <h3>Hello ${cleanName},</h3>
            <p>
              Thank you for contacting <strong>Easy Labs Ltd</strong>. We have successfully received your inquiry regarding <strong>${interestTitle}</strong>.
            </p>
            <p>
              Our Principal Solutions Engineering team is reviewing your specifications and will respond with architectural insights, timeline estimates, or product access details within <strong>24 business hours</strong>.
            </p>

            <div class="summary-card">
              <div style="font-weight: 700; color: #ffffff; font-size: 14px; margin-bottom: 12px;">Summary of Your Request:</div>
              <div class="summary-row"><span class="summary-label">Area of Focus:</span> <span class="badge">${interestTitle}</span></div>
              ${company ? `<div class="summary-row"><span class="summary-label">Organization:</span> <span class="summary-val">${companyDisplay}</span></div>` : ""}
              <div class="summary-row"><span class="summary-label">Status:</span> <span class="summary-val" style="color:#00e599;">In Review by Solutions Team</span></div>
            </div>

            <p style="font-size: 14px; color: #94a3b8;">
              If you have urgent requirements or need immediate enterprise assistance, feel free to reply directly to this email or reach us at <a href="mailto:${SENDER_EMAIL}" style="color:#00e599;">${SENDER_EMAIL}</a>.
            </p>

            <div class="product-links">
              <div style="font-size: 13px; color: #94a3b8; margin-bottom: 8px;">Explore Our Flagship Solutions:</div>
              <div style="font-size: 13px; color: #38bdf8;">
                &bull; <strong>EasySchoolFlow™</strong> — Unified Campus &amp; Learning Operating System<br>
                &bull; <strong>EasyWorkFlow™</strong> — Enterprise e-Signature &amp; Contract Automation<br>
                &bull; <strong>EsERP™</strong> — Intelligent Enterprise Resource Planning<br>
                &bull; <strong>CareflowHMS™</strong> — Hospital &amp; Clinical Information System
              </div>
            </div>
          </div>

          <div class="footer">
            &copy; ${new Date().getFullYear()} Easy Labs Ltd. All rights reserved.<br>
            Protected by enterprise encryption and zero-trust standards.
          </div>
        </div>
      </body>
      </html>
    `;

    // ------------------------------------------------------------------------
    // Execute Parallel Dispatch
    // ------------------------------------------------------------------------
    await Promise.all([
      // Send Lead notification to Easy Labs Team
      sendBrevoEmail({
        to: [{ email: ADMIN_EMAIL, name: "Easy Labs Engineering Team" }],
        subject: `[Lead Alert] ${interestTitle} - ${cleanName} (${companyDisplay})`,
        htmlContent: adminHtml,
        replyTo: { email: cleanEmail, name: cleanName },
      }),

      // Send Instant Confirmation Auto-Responder to User
      sendBrevoEmail({
        to: [{ email: cleanEmail, name: cleanName }],
        subject: `Thank you for contacting Easy Labs — We've received your request`,
        htmlContent: userHtml,
        replyTo: { email: SENDER_EMAIL, name: SENDER_NAME },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Consultation request received. Confirmation email sent.",
    });
  } catch (error) {
    console.error("Error processing contact form submission:", error);
    return res.status(500).json({
      success: false,
      error:
        "Failed to dispatch email. Please verify your settings or try again later.",
    });
  }
});

// Clean Route Aliases for Dedicated Product Pages
app.get("/easyworkflow", (req, res) => {
  res.sendFile(path.join(__dirname, "easyworkflow.html"));
});

app.get("/easyschoolflow", (req, res) => {
  res.sendFile(path.join(__dirname, "easyschoolflow.html"));
});

app.get("/careflowhms", (req, res) => {
  res.sendFile(path.join(__dirname, "careflowhms.html"));
});

app.get("/easylearn", (req, res) => {
  res.redirect(301, "/easyschoolflow.html");
});

app.get("/tracesign", (req, res) => {
  res.redirect(301, "/easyworkflow.html");
});

app.get("/docsign", (req, res) => {
  res.redirect(301, "/easyworkflow.html");
});

app.get("/esmed", (req, res) => {
  res.redirect(301, "/careflowhms.html");
});

app.get("/eserp", (req, res) => {
  res.sendFile(path.join(__dirname, "eserp.html"));
});

// Pricing Routes
app.get("/pricing", (req, res) => {
  res.sendFile(path.join(__dirname, "pricing.html"));
});

// Legal & Trust Routes
app.get(["/privacy", "/privacy-policy"], (req, res) => {
  res.sendFile(path.join(__dirname, "privacy.html"));
});

app.get(["/terms", "/terms-and-conditions", "/terms-of-service"], (req, res) => {
  res.sendFile(path.join(__dirname, "terms.html"));
});

app.get(["/refund", "/refund-policy", "/refunds"], (req, res) => {
  res.sendFile(path.join(__dirname, "refund.html"));
});

app.get("/security", (req, res) => {
  res.sendFile(path.join(__dirname, "security.html"));
});

// Blog & Engineering Insights Routes
app.get("/blog", (req, res) => {
  res.sendFile(path.join(__dirname, "blog.html"));
});

app.get("/insights", (req, res) => {
  res.sendFile(path.join(__dirname, "blog.html"));
});

app.get("/blog-ai-native-architecture", (req, res) => {
  res.sendFile(path.join(__dirname, "blog-ai-native-architecture.html"));
});

app.get("/blog-hipaa-ehr-interoperability", (req, res) => {
  res.sendFile(path.join(__dirname, "blog-hipaa-ehr-interoperability.html"));
});

app.get("/blog-cryptographic-esignature-standards", (req, res) => {
  res.sendFile(path.join(__dirname, "blog-cryptographic-esignature-standards.html"));
});

app.get("/blog-campus-digital-transformation", (req, res) => {
  res.sendFile(path.join(__dirname, "blog-campus-digital-transformation.html"));
});

// Fallback route for Single Page App
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Easy Labs Server is live on http://localhost:${PORT}`);
  console.log(
    ` Brevo API Key Configured: ${Boolean(BREVO_API_KEY && BREVO_API_KEY !== "YOUR_BREVO_API_KEY_HERE")}`,
  );
  console.log(` Sender: ${SENDER_NAME} <${SENDER_EMAIL}>`);
  console.log(` Admin Notification Target: ${ADMIN_EMAIL}`);
  console.log(`====================================================`);
});
