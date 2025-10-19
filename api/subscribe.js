export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }
  try {
    const { email, source } = req.body || {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: 'Invalid email' });
    }
    // Placeholder implementation: in production, store to your CRM/DB or forward via email.
    console.log('Early access signup:', { email, source, ts: new Date().toISOString() });
    return res.status(200).json({ ok: true, message: 'Thanks—your request has been received.' });
  } catch (e) {
    console.error('Subscribe error', e);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}

