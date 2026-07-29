import {Resend} from 'resend';

const FROM_EMAIL = 'Yeasty Boys Bread <bread@yeastyboysbread.com>';
const BCC_EMAIL = 'mattdgregg@gmail.com';

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set');
  }
  return new Resend(apiKey);
}

export async function sendWinnerEmail({
  email,
  name,
  numWins,
  address,
}: {
  email: string;
  name: string;
  numWins: string;
  address: string;
}) {
  const resend = getResend();
  const {data, error} = await resend.emails.send({
    from: FROM_EMAIL,
    to: [email],
    bcc: [BCC_EMAIL],
    subject: `You've won your ${numWins} loaf of Yeasty Boys bread!`,
    html: `
      <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="font-size: 28px; line-height: 1.2;">Congratulations, ${escapeHtml(name)}!</h1>
        <p style="font-size: 16px; line-height: 1.5;">
          You've become a Breadwinner for the
          <strong>${escapeHtml(numWins)}</strong> time.
        </p>
        <p style="font-size: 16px; line-height: 1.5;">
          I'll bake a loaf and deliver it to:
        </p>
        <p style="font-size: 16px; line-height: 1.5; white-space: pre-line;">
          ${escapeHtml(address)}
        </p>
        <p style="font-size: 16px; line-height: 1.5;">
          — Matt / Yeasty Boys Bread
        </p>
      </div>
    `,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function addContact({email, name}: {email: string; name: string}) {
  const resend = getResend();
  const [firstName, ...rest] = name.trim().split(/\s+/);
  const lastName = rest.join(' ') || undefined;

  const {data, error} = await resend.contacts.create({
    email,
    firstName: firstName || undefined,
    lastName,
    unsubscribed: false,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function removeContact(email: string) {
  const resend = getResend();
  const {data, error} = await resend.contacts.remove({email});

  if (error) {
    // Contact may already be gone; treat not-found as success for delete flow.
    const message = error.message?.toLowerCase?.() ?? '';
    if (
      message.includes('not found') ||
      (error as {statusCode?: number}).statusCode === 404
    ) {
      return null;
    }
    throw error;
  }

  return data;
}

function escapeHtml(value: string) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
