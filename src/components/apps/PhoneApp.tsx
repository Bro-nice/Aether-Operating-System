import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  PhoneOff, 
  User, 
  Users, 
  Clock, 
  Delete, 
  Mic, 
  MicOff, 
  Volume2, 
  Grid, 
  Plus, 
  Search,
  Star,
  Check
} from 'lucide-react';
import { ContactItem } from '../../types/os';
import { playDtmfTone, triggerHaptic } from '../../utils/hardware';

const INITIAL_CONTACTS: ContactItem[] = [
  { id: 'c1', name: 'Alex Rivera', phone: '+1 (415) 890-2134', avatarColor: 'bg-cyan-500', isFavorite: true },
  { id: 'c2', name: 'Maya Lin', phone: '+1 (650) 412-9876', avatarColor: 'bg-emerald-500', isFavorite: true },
  { id: 'c3', name: 'Kernel Core Team', phone: '+1 (800) 555-0199', avatarColor: 'bg-indigo-500' },
  { id: 'c4', name: 'Sovereign Enclave Support', phone: '911', avatarColor: 'bg-rose-500' },
];

interface PhoneAppProps {
  onStartCall?: (number: string) => void;
  onEndCall?: () => void;
  isCallActive?: boolean;
}

export const PhoneApp: React.FC<PhoneAppProps> = ({
  onStartCall,
  onEndCall,
  isCallActive = false,
}) => {
  const [activeTab, setActiveTab] = useState<'keypad' | 'recents' | 'contacts'>('keypad');
  const [dialedNumber, setDialedNumber] = useState('');
  const [inCall, setInCall] = useState(isCallActive);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [contacts, setContacts] = useState<ContactItem[]>(INITIAL_CONTACTS);
  const [searchContact, setSearchContact] = useState('');

  // Call timer
  useEffect(() => {
    let interval: any = null;
    if (inCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [inCall]);

  const handleKeyClick = (key: string) => {
    playDtmfTone(key, 120);
    setDialedNumber(prev => prev + key);
  };

  const handleDelete = () => {
    triggerHaptic(10);
    setDialedNumber(prev => prev.slice(0, -1));
  };

  const handleStartCall = (numberToCall?: string) => {
    const num = numberToCall || dialedNumber;
    if (!num) return;
    triggerHaptic([30, 40]);
    setInCall(true);
    if (onStartCall) onStartCall(num);
  };

  const handleHangUp = () => {
    triggerHaptic([20, 20]);
    setInCall(false);
    if (onEndCall) onEndCall();
  };

  const formatCallTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-white flex flex-col justify-between p-4 select-none overflow-hidden">
      {/* If Currently In-Call */}
      {inCall ? (
        <div className="flex-1 flex flex-col items-center justify-between py-12 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="w-24 h-24 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 mx-auto flex items-center justify-center text-3xl font-bold shadow-2xl">
              {dialedNumber ? dialedNumber[0] : 'U'}
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{dialedNumber || 'Active Call'}</h2>
            <p className="text-sm font-mono text-emerald-400 tabular-nums">
              Connected · {formatCallTime(callDuration)}
            </p>
          </div>

          {/* In-Call Actions Matrix */}
          <div className="grid grid-cols-3 gap-6 w-full max-w-xs">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-14 h-14 rounded-full flex flex-col items-center justify-center mx-auto transition-all cursor-pointer ${
                isMuted ? 'bg-amber-500 text-slate-950' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsSpeaker(!isSpeaker)}
              className={`w-14 h-14 rounded-full flex flex-col items-center justify-center mx-auto transition-all cursor-pointer ${
                isSpeaker ? 'bg-cyan-500 text-slate-950' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Volume2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('keypad')}
              className="w-14 h-14 rounded-full bg-white/10 text-white hover:bg-white/20 flex flex-col items-center justify-center mx-auto transition-all cursor-pointer"
            >
              <Grid className="w-5 h-5" />
            </button>
          </div>

          {/* Big Red Hang-Up Button */}
          <button
            onClick={handleHangUp}
            className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl transition-transform active:scale-90 cursor-pointer"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
        </div>
      ) : (
        /* Regular Phone Interface */
        <div className="flex-1 flex flex-col justify-between">
          {/* Keypad View */}
          {activeTab === 'keypad' && (
            <div className="flex-1 flex flex-col justify-between py-2">
              {/* Dialed Number Display */}
              <div className="min-h-[64px] flex items-center justify-center relative px-6">
                <span className="text-3xl font-bold tracking-wider text-white tabular-nums truncate">
                  {dialedNumber || ''}
                </span>
                {dialedNumber && (
                  <button
                    onClick={handleDelete}
                    className="absolute right-4 p-2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <Delete className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* 3x4 DTMF Dialpad Grid */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-xs mx-auto my-auto">
                {[
                  { key: '1', letters: '' },
                  { key: '2', letters: 'ABC' },
                  { key: '3', letters: 'DEF' },
                  { key: '4', letters: 'GHI' },
                  { key: '5', letters: 'JKL' },
                  { key: '6', letters: 'MNO' },
                  { key: '7', letters: 'PQRS' },
                  { key: '8', letters: 'TUV' },
                  { key: '9', letters: 'WXYZ' },
                  { key: '*', letters: '' },
                  { key: '0', letters: '+' },
                  { key: '#', letters: '' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleKeyClick(item.key)}
                    className="w-16 h-16 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/10 flex flex-col items-center justify-center mx-auto transition-all active:scale-90 active:bg-cyan-500/20 cursor-pointer shadow-lg"
                  >
                    <span className="text-2xl font-bold leading-none">{item.key}</span>
                    {item.letters && (
                      <span className="text-[8px] text-slate-400 font-mono tracking-widest mt-0.5">{item.letters}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Call Green Button */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => handleStartCall()}
                  disabled={!dialedNumber}
                  className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-slate-950 flex items-center justify-center shadow-xl transition-all active:scale-90 cursor-pointer"
                >
                  <Phone className="w-7 h-7 fill-slate-950" />
                </button>
              </div>
            </div>
          )}

          {/* Contacts View */}
          {activeTab === 'contacts' && (
            <div className="flex-1 flex flex-col overflow-y-auto space-y-3 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h2 className="text-base font-bold text-white">Contacts</h2>
                <span className="text-xs text-slate-400">{contacts.length} people</span>
              </div>

              {/* Search contacts */}
              <div className="relative">
                <input
                  type="text"
                  value={searchContact}
                  onChange={(e) => setSearchContact(e.target.value)}
                  placeholder="Search contacts..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 overflow-y-auto max-h-[360px]">
                {contacts
                  .filter(c => c.name.toLowerCase().includes(searchContact.toLowerCase()))
                  .map(contact => (
                    <div
                      key={contact.id}
                      onClick={() => handleStartCall(contact.phone)}
                      className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-white/5 flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${contact.avatarColor} text-white font-bold text-xs flex items-center justify-center`}>
                          {contact.name[0]}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">{contact.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{contact.phone}</span>
                        </div>
                      </div>

                      <Phone className="w-4 h-4 text-emerald-400" />
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Recents View */}
          {activeTab === 'recents' && (
            <div className="flex-1 flex flex-col space-y-2 pt-2">
              <h2 className="text-base font-bold text-white pb-2 border-b border-white/10">Recent Calls</h2>
              {[
                { name: 'Alex Rivera', time: '10:14 AM', type: 'incoming', duration: '4m 12s' },
                { name: 'Maya Lin', time: 'Yesterday', type: 'outgoing', duration: '12m 45s' },
                { name: 'Kernel Core Team', time: 'Nov 6', type: 'missed', duration: 'Missed' },
              ].map((call, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className={`text-xs font-bold block ${call.type === 'missed' ? 'text-rose-400' : 'text-white'}`}>
                      {call.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{call.time} · {call.duration}</span>
                  </div>
                  <Phone className="w-4 h-4 text-cyan-400" />
                </div>
              ))}
            </div>
          )}

          {/* Bottom Tabs: Recents, Keypad, Contacts */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-around text-xs">
            <button
              onClick={() => setActiveTab('recents')}
              className={`flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === 'recents' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Recents</span>
            </button>

            <button
              onClick={() => setActiveTab('keypad')}
              className={`flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === 'keypad' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Keypad</span>
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === 'contacts' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Contacts</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
