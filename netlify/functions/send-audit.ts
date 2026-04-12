import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, auditData, websiteUrl } = JSON.parse(event.body || '{}');

    if (!email || !auditData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and auditData are required' }),
      };
    }

    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465');
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Email configuration is missing on the server' }),
      };
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const leaksHtml = auditData.leaks
      .map(
        (leak: any, index: number) => `
        <div style="margin-bottom: 20px; padding: 15px; background: #fff5f5; border-left: 4px solid #ff4444;">
          <h3 style="margin-top: 0; color: #cc0000;">${index + 1}. ${leak.title}</h3>
          <p style="margin-bottom: 0; color: #333;"><strong>How we fix it:</strong> ${leak.fix}</p>
        </div>
      `
      )
      .join('');

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="color: #000;">Your Solarsis Revenue Audit</h1>
        <p>Here is the automated breakdown for <strong>${websiteUrl}</strong>.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">The Verdict</h2>
          <p><strong>Industry:</strong> ${auditData.industry}</p>
          <p><strong>Estimated Monthly Lost Revenue:</strong> <span style="color: #cc0000; font-weight: bold; font-size: 1.2em;">$${auditData.estimatedLostRevenue?.toLocaleString() || 'Unknown'}</span></p>
        </div>

        <h2>Critical Conversion Leaks Found:</h2>
        ${leaksHtml}

        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
        
        <h3>Want to plug these leaks?</h3>
        <p>If you're losing revenue due to these exactly bottlenecks, we can fix them. Reply to this email or book a call on our website to see how our AI infrastructure can scale your conversions.</p>
        
        <p>Best,<br/>Bhanu Teja<br/>Solarsis Agency</p>
      </div>
    `;

    const subject = auditData.estimatedLostRevenue 
      ? `Is ${websiteUrl} losing $${auditData.estimatedLostRevenue.toLocaleString()}/mo?`
      : `Critical conversion leaks found on ${websiteUrl}`;

    await transporter.sendMail({
      from: \`"Solarsis Agency" <\${smtpUser}>\`,
      to: email,
      subject: subject,
      html: htmlContent,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ success: true }),
    };

  } catch (error: any) {
    console.error('Email error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to send email' }),
    };
  }
};
