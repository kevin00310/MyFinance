import emailjs from '@emailjs/browser';

export const sendEmail = async (email, name) => {
  try {
    const emailParams = {
      to_email: email,
      to_name: name,
      message: `Hi ${name}, welcome to MyFinance! Your sign-up was successful. Enjoy your journey here!!`,
    };

    await emailjs.send(
      'service_mb3fmk5', 
      'template_3ivz7qi',
      emailParams,
      '1WDN9ycI63BfAOVJ6' 
    );

    console.log('Sign-up email sent successfully.');
  } catch (error) {
    console.error('Failed to send sign-up email:', error);
    throw error; // Optionally rethrow to handle errors in the calling function
  }
};