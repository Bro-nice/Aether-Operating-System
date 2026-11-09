import React, { useState } from 'react';
import { 
  Send, 
  ArrowLeft, 
  Search, 
  Smile, 
  CheckCheck, 
  Image as ImageIcon,
  MoreVertical
} from 'lucide-react';
import { MessageItem, ContactItem } from '../../types/os';
import { triggerHaptic } from '../../utils/hardware';

const INITIAL_THREADS = [
  {
    id: 'c1',
    name: 'Alex Rivera',
    avatar: 'bg-cyan-500',
    messages: [
      { id: 'm1', contactId: 'c1', sender: 'contact', text: 'Hey! Did you check out the new AetherOS microkernel benchmark?', timestamp: '10:12 AM' },
      { id: 'm2', contactId: 'c1', sender: 'user', text: 'Yes, 0.42ms IPC latency over UWB is unreal.', timestamp: '10:14 AM' },
      { id: 'm3', contactId: 'c1', sender: 'contact', text: 'Totally. The hardware circuit isolation is a game-changer for privacy.', timestamp: '10:15 AM' },
    ] as MessageItem[],
  },
  {
    id: 'c2',
    name: 'Maya Lin',
    avatar: 'bg-emerald-500',
    messages: [
      { id: 'm4', contactId: 'c2', sender: 'contact', text: 'Sending you the revised architectural whitepaper now.', timestamp: 'Yesterday' },
    ] as MessageItem[],
  },
  {
    id: 'c4',
    name: 'Aether Enclave Security',
    avatar: 'bg-rose-500',
    messages: [
      { id: 'm5', contactId: 'c4', sender: 'contact', text: 'Zero-trust perimeter active. 482 telemetry trackers deflected today.', timestamp: 'Nov 6' },
    ] as MessageItem[],
  },
];

export const MessagesApp: React.FC = () => {
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');

  const activeThread = threads.find(t => t.id === activeThreadId);

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeThreadId) return;
    triggerHaptic(15);

    const newMessage: MessageItem = {
      id: Date.now().toString(),
      contactId: activeThreadId,
      sender: 'user',
      text: inputText.trim(),
      timestamp: 'Just now',
    };

    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return { ...t, messages: [...t.messages, newMessage] };
      }
      return t;
    }));

    setInputText('');

    // Simulate smart contact response after 1.2s
    setTimeout(() => {
      const replyMessage: MessageItem = {
        id: (Date.now() + 1).toString(),
        contactId: activeThreadId,
        sender: 'contact',
        text: 'Received via encrypted zero-copy IPC channel.',
        timestamp: 'Just now',
      };
      setThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          return { ...t, messages: [...t.messages, replyMessage] };
        }
        return t;
      }));
    }, 1200);
  };

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-white flex flex-col justify-between select-none overflow-hidden">
      {!activeThread ? (
        /* Threads List */
        <div className="flex-1 flex flex-col p-4 space-y-3 overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h1 className="text-lg font-bold text-white">Messages</h1>
            <span className="text-xs text-cyan-400 font-mono">End-to-End Encrypted</span>
          </div>

          <div className="space-y-2">
            {threads.map((thread) => {
              const lastMsg = thread.messages[thread.messages.length - 1];
              return (
                <div
                  key={thread.id}
                  onClick={() => {
                    triggerHaptic(15);
                    setActiveThreadId(thread.id);
                  }}
                  className="p-3 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-white/5 flex items-center gap-3 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <div className={`w-11 h-11 rounded-full ${thread.avatar} text-white font-bold flex items-center justify-center shrink-0`}>
                    {thread.name[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{thread.name}</span>
                      <span className="text-[10px] text-slate-400">{lastMsg?.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-300 truncate mt-0.5">{lastMsg?.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Active Conversation Chat View */
        <div className="flex-1 flex flex-col justify-between">
          {/* Chat Header */}
          <div className="p-3.5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveThreadId(null)}
                className="p-1 rounded-full text-slate-300 hover:text-white cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className={`w-8 h-8 rounded-full ${activeThread.avatar} text-white font-bold text-xs flex items-center justify-center`}>
                {activeThread.name[0]}
              </div>
              <div>
                <span className="text-xs font-bold text-white block">{activeThread.name}</span>
                <span className="text-[9px] text-emerald-400 font-mono">Quantum Mesh Encrypted</span>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {activeThread.messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-900 border border-white/10 text-slate-100 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 font-mono">{m.timestamp}</span>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-900/90 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type message..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 cursor-pointer transition-transform active:scale-90"
            >
              <Send className="w-4 h-4 fill-slate-950" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
