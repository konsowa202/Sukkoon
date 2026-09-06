export const sendAdminNotification = async (subject: string, htmlContent: string) => {
  try {
    const response = await fetch('https://formsubmit.co/ajax/mahmoudkonsowa678@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://sukoon.com',
        'Referer': 'https://sukoon.com'
      },
      body: JSON.stringify({
        _subject: subject,
        // _template: 'box', // Optional styling
        message: 'يوجد طلب حجز جديد. يرجى مراجعة التفاصيل أدناه أو في لوحة التحكم.',
        'تفاصيل الحجز': htmlContent.replace(/<[^>]*>?/gm, '') // Strip HTML for plain text readability if needed, or pass HTML
      })
    });

    const data = await response.json();
    
    if (data.success === "false" || data.success === false) {
      console.warn('FormSubmit notice:', data.message);
      // The first time it runs, FormSubmit sends an activation email.
    } else {
      console.log('Admin notification email sent successfully via FormSubmit');
    }
    return data;
  } catch (error) {
    console.error('Error sending admin notification email:', error);
  }
};
