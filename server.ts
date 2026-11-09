import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client if API key is present
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const isValidKey = (key?: string) => 
  Boolean(key && key !== 'MY_GEMINI_API_KEY' && !key.startsWith('MY_') && key.length > 15);

// AetherOS Intelligent System Assistant
app.post('/api/os/assistant', async (req: Request, res: Response) => {
  try {
    const { prompt, systemState } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    if (isValidKey(process.env.GEMINI_API_KEY)) {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('AI assistant timeout')), 4500)
        );

        const aiCall = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `User command/query: "${prompt}"\nSystem State Context: ${JSON.stringify(systemState || {})}`,
          config: {
            systemInstruction: `You are Aura AI, the deeply integrated intelligence engine of AetherOS (a revolutionary next-generation mobile operating system).
You are helpful, concise, intelligent, and action-oriented.
When the user asks you to do something in the OS (like open an app, adjust settings, turn on flashlight, check battery, set alarm, take a note), return an appropriate action.
Return JSON strictly conforming to schema:
{
  "reply": "Conversational, natural 1-2 sentence response",
  "action": "OPEN_APP" | "TOGGLE_FLASHLIGHT" | "SET_ALARM" | "TOGGLE_WIFI" | "TAKE_PHOTO" | "NONE",
  "target": "app_id or parameter (e.g. 'camera', 'phone', 'settings', 'clock', 'weather', 'terminal')",
  "data": {}
}`,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                reply: { type: Type.STRING },
                action: { type: Type.STRING },
                target: { type: Type.STRING },
                data: { type: Type.OBJECT },
              },
              required: ['reply', 'action'],
            },
          },
        });

        const response: any = await Promise.race([aiCall, timeoutPromise]);
        const parsed = JSON.parse(response.text?.trim() || '{}');
        return res.json(parsed);
      } catch (err) {
        console.warn('Gemini OS assistant fallback:', err);
      }
    }

    // High quality deterministic local rule engine
    const query = prompt.toLowerCase();
    let reply = `I'm on it. Processing "${prompt}".`;
    let action = 'NONE';
    let target = '';

    if (query.includes('camera') || query.includes('photo') || query.includes('picture') || query.includes('selfie')) {
      reply = 'Opening Camera to capture the moment.';
      action = 'OPEN_APP';
      target = 'camera';
    } else if (query.includes('call') || query.includes('phone') || query.includes('dial')) {
      reply = 'Launching Phone dialer.';
      action = 'OPEN_APP';
      target = 'phone';
    } else if (query.includes('message') || query.includes('text') || query.includes('chat')) {
      reply = 'Opening Messages.';
      action = 'OPEN_APP';
      target = 'messages';
    } else if (query.includes('browser') || query.includes('web') || query.includes('internet') || query.includes('search')) {
      reply = 'Opening Quantum Web Browser.';
      action = 'OPEN_APP';
      target = 'browser';
    } else if (query.includes('setting') || query.includes('wifi') || query.includes('bluetooth') || query.includes('display')) {
      reply = 'Navigating to System Settings.';
      action = 'OPEN_APP';
      target = 'settings';
    } else if (query.includes('terminal') || query.includes('shell') || query.includes('bash') || query.includes('command line')) {
      reply = 'Opening Kernel Terminal.';
      action = 'OPEN_APP';
      target = 'terminal';
    } else if (query.includes('music') || query.includes('song') || query.includes('play audio')) {
      reply = 'Launching High-Res Music Player.';
      action = 'OPEN_APP';
      target = 'music';
    } else if (query.includes('weather') || query.includes('rain') || query.includes('temperature') || query.includes('forecast')) {
      reply = 'Checking current live weather forecast.';
      action = 'OPEN_APP';
      target = 'weather';
    } else if (query.includes('calculator') || query.includes('calculate') || query.includes('math')) {
      reply = 'Opening Calculator.';
      action = 'OPEN_APP';
      target = 'calculator';
    } else if (query.includes('alarm') || query.includes('timer') || query.includes('clock') || query.includes('stopwatch')) {
      reply = 'Opening Clock and Timers.';
      action = 'OPEN_APP';
      target = 'clock';
    } else if (query.includes('file') || query.includes('storage') || query.includes('folder') || query.includes('download')) {
      reply = 'Opening Files and Virtual Disk.';
      action = 'OPEN_APP';
      target = 'files';
    } else if (query.includes('flashlight') || query.includes('torch')) {
      reply = 'Toggling hardware torch.';
      action = 'TOGGLE_FLASHLIGHT';
    } else {
      reply = `AuraOS is running smoothly on the current hardware. How can I assist your workflow today?`;
    }

    return res.json({ reply, action, target });
  } catch (error) {
    console.error('Error in /api/os/assistant:', error);
    return res.status(500).json({ error: 'Failed to process assistant prompt.' });
  }
});

// System telemetry & hardware sync endpoint
app.get('/api/system/health', (_req: Request, res: Response) => {
  res.json({
    os: 'AetherOS v15.2 LTS (Kernel 6.12.4-aether-arm64)',
    architecture: 'Formal Capability-Based Microkernel + Neural IPC',
    uptimeSeconds: Math.floor(process.uptime()),
    status: 'SYSTEM_OPTIMAL',
    securityStatus: 'HARDWARE_ENCLAVE_ACTIVE',
    storage: {
      totalGb: 256,
      usedGb: 48.2,
      freeGb: 207.8,
    },
    batteryHealth: '100% (Cycle count: 42)',
    npuStatus: 'Online (45 TOPS inference engine)',
    activeServices: ['Compositor-120Hz', 'AudioServer-DSP', 'NetManager-6G', 'SecurityDaemon-L4'],
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`AetherOS Core Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
