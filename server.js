import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static compiled frontend from Vite
app.use(express.static(path.join(__dirname, 'dist')));

const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

let db;
async function initDB() {
  db = await open({ filename: './database.sqlite', driver: sqlite3.Database });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS game_state (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);
}

async function getState() {
  const teamsRow = await db.get(`SELECT value FROM game_state WHERE key = 'teams'`);
  const r2Row = await db.get(`SELECT value FROM game_state WHERE key = 'round2Unlocked'`);
  
  return {
    teams: teamsRow && teamsRow.value ? JSON.parse(teamsRow.value) : {},
    round2Unlocked: r2Row && r2Row.value ? JSON.parse(r2Row.value) : false
  };
}

async function saveState(key, value) {
  await db.run(
    `INSERT INTO game_state (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [key, JSON.stringify(value)]
  );
}

io.on('connection', async (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial state on connection
  const state = await getState();
  socket.emit('initialState', state);

  socket.on('syncTeam', async (teamData) => {
    const currentState = await getState();
    if (!teamData || !teamData.teamName) return;
    currentState.teams[teamData.teamName] = teamData;
    await saveState('teams', currentState.teams);
    // Broadcast to everyone (especially admin board)
    io.emit('teamUpdated', teamData);
  });

  socket.on('triggerUnlockRound2', async () => {
    await saveState('round2Unlocked', true);
    io.emit('round2UnlockedUpdate', true);
  });

  socket.on('triggerClearData', async () => {
    await saveState('teams', {});
    await saveState('round2Unlocked', false);
    io.emit('clearData');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Fallback to React Router 
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
initDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
