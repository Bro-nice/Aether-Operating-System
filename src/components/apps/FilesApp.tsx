import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Upload, 
  Plus, 
  Trash2, 
  Download, 
  HardDrive, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { FileItem } from '../../types/os';
import { triggerHaptic } from '../../utils/hardware';

const INITIAL_FILES: FileItem[] = [
  { id: 'f1', name: 'kernel_specs_v15.pdf', path: '/Documents', type: 'document', sizeBytes: 2450000, updatedAt: 'Nov 6, 2026' },
  { id: 'f2', name: 'wallpaper_cosmic.jpg', path: '/Photos', type: 'image', sizeBytes: 4200000, updatedAt: 'Nov 7, 2026', dataUrl: '/src/assets/images/wallpaper_cosmic_fluid_1793976580569.jpg' },
  { id: 'f3', name: 'ambient_theta_432.wav', path: '/Audio', type: 'audio', sizeBytes: 15400000, updatedAt: 'Nov 8, 2026' },
  { id: 'f4', name: 'main_kernel.rs', path: '/Documents', type: 'code', sizeBytes: 84000, updatedAt: 'Nov 9, 2026' },
];

export const FilesApp: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const folders = ['Documents', 'Photos', 'Downloads', 'Audio'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    triggerHaptic(20);
    const reader = new FileReader();
    reader.onload = () => {
      const newFile: FileItem = {
        id: Date.now().toString(),
        name: uploaded.name,
        path: currentFolder === 'root' ? '/Documents' : `/${currentFolder}`,
        type: uploaded.type.startsWith('image/') ? 'image' : uploaded.type.startsWith('audio/') ? 'audio' : 'document',
        sizeBytes: uploaded.size,
        updatedAt: 'Just now',
        dataUrl: reader.result as string,
      };
      setFiles(prev => [newFile, ...prev]);
    };
    reader.readAsDataURL(uploaded);
  };

  const handleDelete = (id: string) => {
    triggerHaptic(15);
    setFiles(prev => prev.filter(f => f.id !== id));
    if (previewFile?.id === id) setPreviewFile(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
    return `${Math.round(bytes / 1000)} KB`;
  };

  const displayedFiles = currentFolder === 'root' 
    ? files 
    : files.filter(f => f.path.toLowerCase().includes(currentFolder.toLowerCase()));

  return (
    <div className="flex-1 w-full h-full bg-slate-950 text-white flex flex-col justify-between p-4 select-none overflow-hidden">
      <div className="flex-1 flex flex-col space-y-4 overflow-y-auto">
        {/* Header & Storage Capacity Bar */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">Sovereign NVMe Storage</span>
            </div>
            <span className="font-mono text-slate-400">48.2 GB / 256 GB Used</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
            <div className="h-full bg-cyan-400 w-[20%]" title="System" />
            <div className="h-full bg-emerald-400 w-[15%]" title="Media" />
            <div className="h-full bg-amber-400 w-[10%]" title="Apps" />
          </div>
        </div>

        {/* Directory Navigator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs font-mono text-slate-300">
            {currentFolder !== 'root' && (
              <button
                onClick={() => setCurrentFolder('root')}
                className="p-1 text-cyan-400 hover:text-cyan-300 cursor-pointer mr-1"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <span className="text-slate-400">Root</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-bold text-white capitalize">{currentFolder}</span>
          </div>

          {/* Upload Real File Button */}
          <label className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all active:scale-95">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Folders Row (when at root) */}
        {currentFolder === 'root' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {folders.map(folder => (
              <button
                key={folder}
                onClick={() => {
                  triggerHaptic(10);
                  setCurrentFolder(folder);
                }}
                className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-white/5 flex items-center gap-2.5 cursor-pointer transition-all active:scale-95"
              >
                <Folder className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold text-white truncate">{folder}</span>
              </button>
            ))}
          </div>
        )}

        {/* Files List */}
        <div className="space-y-2">
          {displayedFiles.map(file => (
            <div
              key={file.id}
              onClick={() => setPreviewFile(file)}
              className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-white/5 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  {file.type === 'image' && <ImageIcon className="w-4 h-4 text-emerald-400" />}
                  {file.type === 'audio' && <Music className="w-4 h-4 text-cyan-400" />}
                  {file.type !== 'image' && file.type !== 'audio' && <FileText className="w-4 h-4 text-amber-400" />}
                </div>

                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate">{file.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatSize(file.sizeBytes)} · {file.updatedAt}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(file.id);
                }}
                className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-white/20 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white truncate">{previewFile.name}</h3>

            {previewFile.type === 'image' && previewFile.dataUrl && (
              <img src={previewFile.dataUrl} alt={previewFile.name} className="w-full h-48 object-cover rounded-xl" />
            )}

            <p className="text-xs text-slate-300 font-mono">Size: {formatSize(previewFile.sizeBytes)}</p>

            <button
              onClick={() => setPreviewFile(null)}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
