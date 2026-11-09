import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Trash2, 
  Plus, 
  Save, 
  Check 
} from 'lucide-react';
import { triggerHaptic } from '../../utils/hardware';

interface NoteItem {
  id: string;
  title: string;
  body: string;
  date: string;
}

const INITIAL_NOTES: NoteItem[] = [
  { id: 'n1', title: 'AetherOS Microkernel Architecture', body: 'The seL4-derived formal capabilities ensure zero unverified shared memory access. IPC is sub-microsecond.', date: 'Nov 6' },
  { id: 'n2', title: 'Hardware Isolation Protocol', body: 'Physical CMOS power rail cut switches prevent sensor tapping even in case of root privilege compromise.', date: 'Nov 7' },
];

export const NotesApp: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [selectedNote, setSelectedNote] = useState<NoteItem>(INITIAL_NOTES[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorder.start();
        setIsRecording(true);
        triggerHaptic(20);
      } else {
        setIsRecording(true);
      }
    } catch (e) {
      // Fallback recording state
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
    triggerHaptic(15);
    // Add voice memo as a note
    const newMemo: NoteItem = {
      id: Date.now().toString(),
      title: `Voice Memo #${notes.length + 1}`,
      body: `Captured audio note at ${new Date().toLocaleTimeString()} using hardware microphone array.`,
      date: 'Today',
    };
    setNotes([newMemo, ...notes]);
    setSelectedNote(newMemo);
  };

  const handleSaveNote = () => {
    triggerHaptic(10);
    setNotes(prev => prev.map(n => n.id === selectedNote.id ? selectedNote : n));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-white flex flex-col justify-between p-4 select-none overflow-hidden">
      {/* Top Notes Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white">Notes & Voice Memos</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newN: NoteItem = {
                id: Date.now().toString(),
                title: 'New Thought Note',
                body: '',
                date: 'Today',
              };
              setNotes([newN, ...notes]);
              setSelectedNote(newN);
            }}
            className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 cursor-pointer"
            title="Create Note"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor & Notes Split */}
      <div className="flex-1 flex flex-col space-y-3 py-2 overflow-hidden">
        {/* Active Note Editor */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex-1 flex flex-col justify-between">
          <input
            type="text"
            value={selectedNote.title}
            onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
            className="text-sm font-bold text-white bg-transparent border-b border-white/10 pb-1.5 focus:outline-none"
            placeholder="Note Title..."
          />

          <textarea
            value={selectedNote.body}
            onChange={(e) => setSelectedNote({ ...selectedNote, body: e.target.value })}
            className="flex-1 w-full bg-transparent text-xs text-slate-200 resize-none focus:outline-none py-2 leading-relaxed font-sans placeholder:text-slate-600"
            placeholder="Write markdown thoughts, ideas, or meeting notes..."
          />

          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
            <span className="text-[10px] text-slate-400 font-mono">{selectedNote.date}</span>
            <button
              onClick={handleSaveNote}
              className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Voice Recorder Dock */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-slate-600'}`} />
            <span className="text-xs font-semibold text-white">
              {isRecording ? 'Recording Live Audio...' : 'Voice Dictation Standby'}
            </span>
          </div>

          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isRecording ? 'bg-rose-500 text-white' : 'bg-white/10 hover:bg-white/20 text-cyan-300'
            }`}
          >
            {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{isRecording ? 'Stop Memo' : 'Record Memo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
