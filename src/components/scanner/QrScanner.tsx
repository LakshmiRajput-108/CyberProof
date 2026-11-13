import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { QrCode, UploadCloud, AlertCircle, FileText } from 'lucide-react';

interface QrScannerProps {
  onScan: (payload: string) => void;
  isLoading: boolean;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onScan, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const sampleQrs = [
    { label: 'Restaurant Table QR (Safe Menu)', payload: 'https://bistro-menu-digital.com/table/14' },
    { label: 'Street Parking Meter Sticker (Suspicious)', payload: 'https://pay-city-parking-direct.xyz/quick-pay' },
    { label: 'WiFi Access Code QR (Informational)', payload: 'WIFI:S:GuestNet;T:WPA;P:Welcome2026;;' },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file.name);
      // Simulate reading QR content from file
      onScan('https://verify-order-tracking.xyz/secure-pickup?id=83921');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0].name);
      onScan('https://verify-order-tracking.xyz/secure-pickup?id=83921');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-slate-900 dark:text-white">
          QR Code Image or Screenshot
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload a photo or screenshot of any QR code to inspect its underlying target destination before your phone opens it.
        </p>
      </div>

      {/* Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          dragActive
            ? 'border-teal-500 bg-teal-500/5'
            : 'border-slate-300 dark:border-white/10 hover:border-teal-500/40 bg-slate-50 dark:bg-white/[0.02]'
        }`}
      >
        <input
          type="file"
          id="qr-file-input"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            {selectedFile ? <FileText className="w-7 h-7" /> : <UploadCloud className="w-7 h-7" />}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {selectedFile ? `Loaded: ${selectedFile}` : 'Drop QR code screenshot here, or browse'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports PNG, JPG, WebP, or SVG images
            </p>
          </div>

          <Button type="button" variant="outline" size="sm" isLoading={isLoading} className="mt-2 pointer-events-none">
            Choose QR Image
          </Button>
        </div>
      </div>

      {/* Honest Note */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-xs text-slate-600 dark:text-slate-400">
        <AlertCircle className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
        <span>
          <strong>Safe Sandbox:</strong> Uploading an image extracts the destination link without launching browser windows or activating camera tracking.
        </span>
      </div>

      {/* Sample QR presets */}
      <div className="space-y-2 pt-2">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <QrCode className="w-3.5 h-3.5 text-teal-500" />
          <span>Or test with a sample QR payload:</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {sampleQrs.map(s => (
            <button
              key={s.label}
              type="button"
              onClick={() => onScan(s.payload)}
              className="p-3 text-left rounded-xl bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-xs transition-colors"
            >
              <p className="font-semibold text-slate-900 dark:text-white">{s.label}</p>
              <p className="font-mono text-[11px] text-teal-600 dark:text-teal-400 truncate mt-1">{s.payload}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
