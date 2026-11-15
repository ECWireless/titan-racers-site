import sgMail from "@sendgrid/mail";

const defaultFromEmail = "no-reply@coopallc.com";
const defaultFromName = "Titan Racers";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

/**
 * Returns false when SendGrid isn't configured outside production, so local
 * development can run without it. Production requires the key.
 */
function configureSendGrid() {
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SENDGRID_API_KEY is required to send email.");
    }

    return false;
  }

  sgMail.setApiKey(apiKey);
  return true;
}

function getSender() {
  return {
    email: process.env.SENDGRID_FROM_EMAIL || defaultFromEmail,
    name: process.env.SENDGRID_FROM_NAME || defaultFromName,
  };
}

export async function sendConfirmationEmail({
  to,
  confirmUrl,
  unsubscribeUrl,
}: {
  to: string;
  confirmUrl: string;
  unsubscribeUrl: string;
}) {
  if (!configureSendGrid()) {
    console.info(
      `SendGrid is off; confirmation email not sent.\nConfirm: ${confirmUrl}\nUnsubscribe: ${unsubscribeUrl}`,
    );
    return;
  }

  const confirmHref = escapeHtml(confirmUrl);
  const unsubscribeHref = escapeHtml(unsubscribeUrl);

  await sgMail.send({
    // An object, so SendGrid doesn't parse the address as "Name <email>".
    to: { email: to },
    from: getSender(),
    subject: "Confirm your Titan Racers updates",
    text: [
      "Confirm that you want Titan Racers updates:",
      confirmUrl,
      "",
      "You can unsubscribe at any time:",
      unsubscribeUrl,
      "",
      "If you didn't sign up, ignore this email.",
    ].join("\n"),
    html: `
      <p>Confirm that you want Titan Racers updates.</p>
      <p><a href="${confirmHref}">Confirm your email</a></p>
      <p>You can <a href="${unsubscribeHref}">unsubscribe at any time</a>.</p>
      <p>If you didn't sign up, ignore this email.</p>
    `,
  });
}

/** Tells the site owner about a signup. Best effort: failures are logged. */
export async function notifyAdminOfSignup({
  email,
  source,
}: {
  email: string;
  source: string;
}) {
  const to = process.env.ADMIN_NOTIFY_EMAIL;

  if (!to) {
    return;
  }

  try {
    if (!configureSendGrid()) {
      console.info("SendGrid is off; signup notification not sent.");
      return;
    }

    await sgMail.send({
      to,
      from: getSender(),
      subject: "New Titan Racers signup",
      text: [
        "Someone signed up for Titan Racers updates.",
        "They're added once they confirm their email.",
        "",
        `Email: ${email}`,
        `Source: ${source}`,
      ].join("\n"),
      html: `
        <p>Someone signed up for Titan Racers updates.
        They're added once they confirm their email.</p>
        <ul>
          <li><strong>Email:</strong> ${escapeHtml(email)}</li>
          <li><strong>Source:</strong> ${escapeHtml(source)}</li>
        </ul>
      `,
    });
  } catch (error) {
    console.warn("Signup notification failed", describeError(error));
  }
}

/** An error's name and code only, so logs never carry an email address. */
export function describeError(error: unknown) {
  if (error instanceof Error) {
    const code = (error as { code?: unknown }).code;
    return code === undefined ? error.name : `${error.name} (${String(code)})`;
  }

  return typeof error;
}
