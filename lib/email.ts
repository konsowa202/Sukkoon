export const sendAdminNotification = async (subject: string, htmlContent: string) => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not found in .env. Skipping email notification.');
    console.log(`[Mock Email] To: mahmoudkonsowa678@gmail.com | Subject: ${subject}`);
    return;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Sukoon Notifications <onboarding@resend.dev>',
        to: 'mahmoudkonsowa678@gmail.com',
        subject,
        html: htmlContent
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Failed to send email via Resend:', errorData);
      throw new Error(`Resend API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Admin notification email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    // Don't throw to avoid crashing the request if email fails
  }
};
