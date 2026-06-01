import express from "express";

const app = express();

app.use(express.json());

const VERIFY_TOKEN = "my_token";

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK VERIFICADO");
      return res.status(200).send(challenge);
    }
  }

  return res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
  console.log("====== NUEVO EVENTO ======");
  console.log(JSON.stringify(req.body, null, 2));

  // Responder rápido a Meta
  res.sendStatus(200);

  // Enviar a n8n en segundo plano
  fetch("https://josianecristhian.app.n8n.cloud/webhook/meta-events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req.body)
  })
    .then(() => console.log("Evento enviado a n8n"))
    .catch((error) => console.error("Error enviando a n8n:", error));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor iniciado");
});