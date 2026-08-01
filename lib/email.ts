import {welcomeEmailHtml} from 'lib/email-templates/welcome';
import {winnerEmailHtml} from 'lib/email-templates/winner';
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

export async function sendWelcomeEmail({email}: {email: string}) {
  const resend = getResend();
  const {data, error} = await resend.emails.send({
    from: FROM_EMAIL,
    to: [email],
    subject: 'Welcome to Yeasty Boys Sourdough!',
    html: welcomeEmailHtml,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function sendWinnerEmail({
  email,
  numWins,
}: {
  email: string;
  numWins: string;
}) {
  const resend = getResend();
  const {data, error} = await resend.emails.send({
    from: FROM_EMAIL,
    to: [email],
    bcc: [BCC_EMAIL],
    subject: `You've won your ${numWins} loaf of Yeasty Boys bread!`,
    html: winnerEmailHtml,
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
    // Contact sync is secondary to signup / welcome email.
    console.log('Resend contact create failed:', error);
    return null;
  }

  return data;
}

export async function removeContact(email: string) {
  const resend = getResend();
  const {data, error} = await resend.contacts.remove({email});

  if (error) {
    // Contact may never have been synced to Resend; ignore cleanup failures.
    console.log('Resend contact remove failed:', error);
    return null;
  }

  return data;
}
