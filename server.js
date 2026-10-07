const path = require("path");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;
const players = new Map();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_req, res) => {
  res.json({ ok: true, game: "Living in Owerri", online: players.size });
});

app.get("/api/player", (req, res) => {
  const id = String(req.query.id || "guest");
  if (!players.has(id)) {
    players.set(id, {
      id,
      name: "Guest",
      cash: 1000,
      home: "Starter Apartment",
      car: "No car",
      job: "Looking for work"
    });
  }
  res.json(players.get(id));
});

app.post("/api/transfer", (req, res) => {
  const { from, to, amount } = req.body;
  const value = Number(amount);
  if (!from || !to || !Number.isFinite(value) || value <= 0) {
    return res.status(400).json({ error: "Invalid transfer." });
  }
  const sender = players.get(from);
  const receiver = players.get(to);
  if (!sender || !receiver) return res.status(404).json({ error: "Player not found." });
  if (sender.cash < value) return res.status(400).json({ error: "Not enough virtual money." });
  sender.cash -= value;
  receiver.cash += value;
  io.emit("wallet:update", { from, to, amount: value });
  res.json({ ok: true, sender, receiver });
});

io.on("connection", (socket) => {
  socket.on("join", ({ id, name }) => {
    const playerId = String(id || socket.id);
    const playerName = String(name || "Player").slice(0, 24);
    if (!players.has(playerId)) {
      players.set(playerId, {
        id: playerId,
        name: playerName,
        cash: 1000,
        home: "Starter Apartment",
        car: "No car",
        job: "Looking for work"
      });
    } else {
      players.get(playerId).name = playerName;
    }
    socket.data.playerId = playerId;
    socket.join("owerri");
    io.to("owerri").emit("presence", { online: players.size });
    socket.emit("player", players.get(playerId));
  });

  socket.on("chat", (message) => {
    const text = String(message || "").trim().slice(0, 300);
    if (!text) return;
    const player = players.get(socket.data.playerId);
    io.to("owerri").emit("chat", {
      name: player?.name || "Player",
      text,
      time: new Date().toISOString()
    });
  });

  socket.on("disconnect", () => {
    io.emit("presence", { online: players.size });
  });
});

server.listen(PORT, () => {
  console.log("Living in Owerri running on port " + PORT);
});