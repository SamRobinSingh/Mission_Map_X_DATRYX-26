import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs/promises';
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

const DB_FILE = path.join(__dirname, 'database.json');



let inMemoryState = { teams: {}, round2Unlocked: false };

async function initDB() {
  try {
    await fs.access(DB_FILE);
    const data = await fs.readFile(DB_FILE, 'utf-8');
    inMemoryState = JSON.parse(data);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify(inMemoryState, null, 2));
  }
}

async function saveState(key, value) {
  inMemoryState[key] = value;
  await fs.writeFile(DB_FILE, JSON.stringify(inMemoryState, null, 2));
}

function getStateSync() {
  return inMemoryState;
}

io.on('connection', async (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial state on connection
  const state = getStateSync();
  socket.emit('initialState', state);

  socket.on('syncTeam', async (teamData) => {
    const currentState = getStateSync();
    if (!teamData || !teamData.teamName) return;
    currentState.teams[teamData.teamName] = teamData;
    await saveState('teams', currentState.teams);
    // Broadcast to everyone (especially admin board)
    io.emit('teamUpdated', teamData);
  });

  // Delete / Eliminate a team
  socket.on('eliminateTeam', async (teamName) => {
    const currentState = getStateSync();
    if(currentState.teams[teamName]) {
      currentState.teams[teamName].isEliminated = true;
      currentState.teams[teamName].isFinished = true;
      currentState.teams[teamName].endTime = Date.now();
      await saveState('teams', currentState.teams);
      io.emit('teamUpdated', currentState.teams[teamName]);
    }
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
