export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }
  try {
    const { name, email, company, phone, reason, message, updates, source, page } = req.body || {};
    if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: 'Missing or invalid fields' });
    }

    const to = ['chad@deleon-omics.com', 'jose@deleon-omics.com'];
    const subject = `New inquiry — ${reason || 'General'} — ${name}`;
    const created = new Date().toISOString();

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #0b0b0f;">
        <h2 style="margin:0 0 12px; font-size:18px;">New website inquiry</h2>
        <p style="margin:0 0 16px; color:#374151;">${created}</p>
        <table style="border-collapse: collapse; width:100%; max-width:640px;">
          <tr>
            <td style="padding:8px 0; width:140px; color:#6b7280;">Name</td>
            <td style="padding:8px 0;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; width:140px; color:#6b7280;">Email</td>
            <td style="padding:8px 0;">${escapeHtml(email)}</td>
          </tr>
          ${company ? `<tr><td style="padding:8px 0; color:#6b7280;">Company</td><td style=\"padding:8px 0;\">${escapeHtml(company)}</td></tr>` : ''}
          ${phone ? `<tr><td style="padding:8px 0; color:#6b7280;">Phone</td><td style=\"padding:8px 0;\">${escapeHtml(phone)}</td></tr>` : ''}
          ${reason ? `<tr><td style="padding:8px 0; color:#6b7280;">Reason</td><td style=\"padding:8px 0;\">${escapeHtml(reason)}</td></tr>` : ''}
          <tr>
            <td style="padding:8px 0; color:#6b7280;">Updates opt‑in</td>
            <td style="padding:8px 0;">${updates ? 'Yes' : 'No'}</td>
          </tr>
          ${page ? `<tr><td style="padding:8px 0; color:#6b7280;">Page</td><td style=\"padding:8px 0;\"><a href=\"${escapeHtml(page)}\">${escapeHtml(page)}</a></td></tr>` : ''}
        </table>
        <div style="margin-top:16px; padding-top:12px; border-top:1px solid #e5e7eb;"></div>
        <div>
          <div style="margin:0 0 6px; color:#6b7280;">Message</div>
          <div style="white-space:pre-wrap; line-height:1.5;">${escapeHtml(message)}</div>
        </div>
      </div>
    `;
    const text = `New website inquiry\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      (company ? `Company: ${company}\n` : '') +
      (phone ? `Phone: ${phone}\n` : '') +
      (reason ? `Reason: ${reason}\n` : '') +
      `Updates: ${updates ? 'Yes' : 'No'}\n` +
      (page ? `Page: ${page}\n` : '') +
      `\nMessage:\n${message}\n`;

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const EMAIL_FROM = process.env.EMAIL_FROM; // e.g., "Deleon Website <hello@yourdomain.com>"

    if (RESEND_API_KEY && EMAIL_FROM) {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: EMAIL_FROM, to, subject, html, text, reply_to: email }),
      });
      if (!resp.ok) {
        const body = await resp.text().catch(() => '');
        console.error('Resend error', resp.status, body);
        return res.status(502).json({ ok: false, error: 'Email send failed' });
      }
      const out = await resp.json().catch(() => ({}));
      return res.status(200).json({ ok: true, id: out?.id, message: 'Thanks—your message has been sent.' });
    }

    // Fallback: no email provider configured; log for visibility
    console.log('Contact submission (email not configured):', { name, email, company, phone, reason, updates, source, page, ts: created });
    return res.status(200).json({ ok: true, message: 'Thanks—your message has been received.' });
  } catch (e) {
    console.error('Contact error', e);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
