import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Missing 'url' query parameter");
  }

  try {
    const response = await fetch(url);
    let html = await response.text();

    // Remove headers perigosos do conteúdo HTML (tipo CSP)
    html = html.replace(/<meta[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, "");
    html = html.replace(/X-Frame-Options:[^\n\r]+/gi, "");

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    res.status(500).send("Erro ao carregar a página: " + err.message);
  }
}
