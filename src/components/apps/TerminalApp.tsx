import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
}

export const TerminalApp: React.FC = () => {
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState('/home/user');
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: '1', type: 'system', text: 'AetherOS Linux 6.12.4-aether-arm64 (tty1)' },
    { id: '2', type: 'system', text: 'Formal capability-based microkernel. Type "help" or "neofetch".' },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const newLines: TerminalLine[] = [
      ...lines,
      { id: Date.now().toString(), type: 'input', text: `user@aether:${currentDir}$ ${cmd}` },
    ];

    const parts = cmd.split(' ');
    const root = parts[0].toLowerCase();

    switch (root) {
      case 'help':
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: `AetherOS Shell Utilities:
  neofetch    - Display system specs, kernel, and hardware branding
  uname -a    - Print operating system & kernel architecture
  ls          - List directory contents
  pwd         - Print working directory
  cd <dir>    - Change current directory
  cat <file>  - Display file contents
  top         - Process monitor and CPU core loads
  free -m     - Memory and cache usage
  ping <host> - Send ICMP packet probe
  clear       - Clear screen buffer`,
        });
        break;

      case 'neofetch':
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: `        /\         user@aether-phone-one
       /  \        ---------------------
      /\   \       OS: AetherOS v15.2 LTS aarch64
     /  \   \      Host: Aether Phone Pro (ARMv9.4)
    /    \   \     Kernel: 6.12.4-aether-formal
   /  /\  \   \    Uptime: 2 days, 14 hours
  /__/  \__\___\   Shell: aether-sh 5.2.15
                   Resolution: 1200x2640 @ 120Hz
                   CPU: Aether Octa-Core (8) @ 3.40GHz
                   Memory: 2480MiB / 12288MiB (20%)`,
        });
        break;

      case 'uname':
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: 'Linux aether-core 6.12.4-aether-arm64 #1 SMP PREEMPT_DYNAMIC GNU/Linux',
        });
        break;

      case 'pwd':
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: currentDir,
        });
        break;

      case 'ls':
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: 'Documents  Photos  Downloads  Audio  kernel_specs_v15.pdf  main_kernel.rs',
        });
        break;

      case 'top':
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: `Tasks: 84 total, 1 running, 83 sleeping
%Cpu(s):  2.4 us,  1.1 sy,  0.0 ni, 96.5 id
MiB Mem :  12288.0 total,   9808.0 free,   2480.0 used
PID USER      PR  NI    VIRT    RES  %CPU  COMMAND
101 root      20   0  184.2M  48.1M   1.2  aether-compositor
104 user      20   0   92.4M  28.4M   0.8  synapse-assistant
112 user      20   0  210.0M  62.1M   0.4  aura-audio-server`,
        });
        break;

      case 'free':
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: `               total        used        free      shared  buff/cache   available
Mem:           12288        2480        9120         140         688        9668
Swap:           4096           0        4096`,
        });
        break;

      case 'ping':
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: `PING ${parts[1] || 'aetheros.org'} (104.21.48.12): 56 data bytes
64 bytes from 104.21.48.12: icmp_seq=0 ttl=58 time=12.4 ms
64 bytes from 104.21.48.12: icmp_seq=1 ttl=58 time=11.8 ms
--- ${parts[1] || 'aetheros.org'} ping statistics ---
2 packets transmitted, 2 packets received, 0.0% packet loss`,
        });
        break;

      case 'clear':
        setLines([]);
        setInput('');
        return;

      default:
        newLines.push({
          id: (Date.now() + 1).toString(),
          type: 'error',
          text: `aether-sh: command not found: ${cmd}. Type "help" for commands.`,
        });
    }

    setLines(newLines);
    setInput('');
  };

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-white flex flex-col justify-between p-4 select-none overflow-hidden font-mono text-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white">aether@kernel:~#</span>
        </div>
        <span className="text-[10px] text-emerald-400">SESSION: TTY1</span>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 overflow-y-auto space-y-1.5 py-2">
        {lines.map((l) => (
          <div
            key={l.id}
            className={`whitespace-pre-wrap leading-relaxed ${
              l.type === 'input'
                ? 'text-cyan-300 font-bold'
                : l.type === 'error'
                ? 'text-rose-400'
                : l.type === 'system'
                ? 'text-slate-400 italic'
                : 'text-slate-200'
            }`}
          >
            {l.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Command Input Bar */}
      <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2 border-t border-white/10">
        <span className="text-emerald-400 select-none">user@aether:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="neofetch, top, ls, ping..."
          className="flex-1 bg-transparent text-white focus:outline-none text-xs"
          autoFocus
        />
      </form>
    </div>
  );
};
