const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.get("/", (req, res) => {
  res.send("Proxy is working. Use /proxy?url=...");
});

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Missing url param.");

  try {
    const response = await fetch(targetUrl);
    let body = await response.text();

    // Remove cabeçalhos de proteção
    body = body.replace(/X-Frame-Options:.+?\r?\n/gi, "");
    body = body.replace(/<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]*>/gi, "");

    res.set("Content-Type", "text/html");
    res.send(body);
  } catch (err) {
    res.status(500).send("Erro ao buscar a URL.");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Servidor rodando na porta", port);
});
