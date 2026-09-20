import { useState, useCallback, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, ScanLine, AlertCircle } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import AnalysisResultView from '@/components/AnalysisResultView';
import { analyzeScreenshot } from '@/services/analysis';
import { saveAnalysis } from '@/storage/history';
import type { AnalysisResult } from '@/types';

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

export default function ScreenshotChecker() {
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);
    setResult(null);

    if (!ACCEPTED.includes(file.type)) {
      setError('Unsupported file type. Please upload a PNG, JPEG, WebP, or GIF image.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('The image is too large. Please upload an image under 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
        setImageName(file.name);
      }
    };
    reader.onerror = () => setError('Could not read the image file. Please try a different file.');
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setImage(null);
    setImageName('');
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = () => {
    if (!image) {
      setError('Please upload an image first.');
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);

    setTimeout(() => {
      try {
        const res = analyzeScreenshot(image, notes);
        setResult(res);
        saveAnalysis(res);
      } catch {
        setError('Something went wrong during analysis. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 700);
  };

  const handleAnalyzeAnother = () => {
    handleRemove();
    setNotes('');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
      <PageHeader
        title="Screenshot Checker"
        subtitle="Upload a screenshot of a suspicious message, email, or webpage. Add notes about what you see and ScamShield will guide you through a manual review."
      />

      {!result && !loading && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            {!image ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 px-4 cursor-pointer transition-colors ${
                  dragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                }`}
              >
                <UploadCloud className="w-10 h-10 text-slate-400" />
                <p className="mt-3 text-sm font-medium text-slate-700">
                  Drag and drop an image, or click to browse
                </p>
                <p className="mt-1 text-xs text-slate-400">PNG, JPEG, WebP, or GIF — up to 5 MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED.join(',')}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </div>
            ) : (
              <div>
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={image} alt={imageName || 'Uploaded screenshot'} className="w-full max-h-96 object-contain" />
                  <button
                    onClick={handleRemove}
                    className="absolute top-3 right-3 rounded-lg bg-white/90 p-2 text-slate-600 shadow-sm hover:bg-white hover:text-red-600 transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                  <ImageIcon className="w-4 h-4" />
                  <span className="truncate">{imageName || 'Uploaded image'}</span>
                  <button onClick={handleRemove} className="ml-auto text-xs text-red-600 hover:underline font-medium">
                    Remove
                  </button>
                </div>
              </div>
            )}

            <div className="mt-5">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notes about the screenshot <span className="text-slate-400 font-normal">(optional but recommended)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Describe what's in the screenshot — any urgent language, links, payment requests, sender details, or anything that feels suspicious…"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-y"
              />
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                This prototype does not use automated OCR or AI image recognition. Analysis is based on the
                notes you provide. For a detailed analysis, paste the text from the screenshot into the
                Message Analyzer.
              </p>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !image}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition-colors disabled:opacity-50"
            >
              <ScanLine className="w-4 h-4" />
              Analyze Screenshot
            </button>
          </div>
        </div>
      )}

      {loading && <LoadingState message="Reviewing your screenshot…" />}

      {error && !loading && <ErrorState message={error} onRetry={handleAnalyze} />}

      {result && !loading && (
        <AnalysisResultView result={result} onAnalyzeAnother={handleAnalyzeAnother} />
      )}
    </div>
  );
}
