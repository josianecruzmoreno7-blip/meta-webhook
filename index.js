import express from "express";

const app = express();

app.use(express.json());

const VERIFY_TOKEN = "mi_token";

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verificado");
      return res.status(200).send(challenge);
    }
  }

  return res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
  console.log("MENSAJE RECIBIDO:");
  console.log(JSON.stringify(req.body, null, 2));

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor iniciado");
});