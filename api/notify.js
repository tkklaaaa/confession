// Vercel serverless function: forwards a one-bit answer to Discord.
// The real webhook URL lives ONLY in the Vercel env var DISCORD_WEBHOOK_URL
// and is never committed to the repo.
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  var url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return res.status(500).json({ ok: false, error: "webhook not configured" });
  var choice = "unknown";
  try {
    if (req.body && typeof req.body.choice === "string") choice = req.body.choice.slice(0, 50);
  } catch (e) { /* keep default */ }
  try {
    var r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: 'มีคนกด "' + choice + '" ในเว็บขอจีบ (' + new Date().toLocaleString("th-TH") + ')' })
    });
    return res.status(r.ok ? 200 : 502).json({ ok: r.ok });
  } catch (e) {
    return res.status(502).json({ ok: false });
  }
};
