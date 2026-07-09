"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2, XCircle, X, RotateCcw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { uploadDocument, type UploadResponse } from "@/services/upload";
import { ApiError } from "@/services/api";

type UploadState = "idle" | "uploading" | "success" | "error";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export interface UploadDropzoneHandle {
  /** Opens the native file picker, same as clicking the dropzone itself. */
  openFilePicker: () => void;
}

interface UploadDropzoneProps {
  /** Called with the backend's structured result after a successful extraction. */
  onUploadComplete?: (result: UploadResponse) => void;
}

export const UploadDropzone = React.forwardRef<UploadDropzoneHandle, UploadDropzoneProps>(function UploadDropzone(
  { onUploadComplete },
  ref
) {
  const [dragging, setDragging] = React.useState(false);
  const [state, setState] = React.useState<UploadState>("idle");
  const [progress, setProgress] = React.useState(0);
  const [file, setFile] = React.useState<{ name: string; size: number } | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const pendingFileRef = React.useRef<File | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useImperativeHandle(ref, () => ({
    openFilePicker: () => {
      if (state === "idle") inputRef.current?.click();
    },
  }));

  async function startUpload(nativeFile: File) {
    const okType = /\.pdf$/i.test(nativeFile.name);
    if (!okType) {
      toast({ variant: "error", title: "Unsupported file type", description: "RegIntel-AI currently extracts obligations from PDF files only." });
      return;
    }

    pendingFileRef.current = nativeFile;
    setFile({ name: nativeFile.name, size: nativeFile.size });
    setState("uploading");
    setErrorMessage(null);

    // We don't get real byte-level progress from fetch(), so climb toward 90%
    // while the request is in flight and snap to 100% when it resolves —
    // this keeps the UI honest (never claims "done" before it is) while
    // still feeling responsive during the Gemini extraction call.
    setProgress(8);
    const tick = setInterval(() => {
      setProgress((p) => (p < 88 ? p + Math.random() * 10 : p));
    }, 400);

    try {
      const result = await uploadDocument(nativeFile);
      clearInterval(tick);
      setProgress(100);
      setState("success");
      toast({
        variant: "success",
        title: "Upload complete",
        description: `${result.obligations.length} obligation${result.obligations.length === 1 ? "" : "s"} extracted from ${result.filename}.`,
      });
      onUploadComplete?.(result);
      setTimeout(() => { setState("idle"); setFile(null); }, 2400);
    } catch (err) {
      clearInterval(tick);
      setProgress(100);
      setState("error");
      const message = err instanceof ApiError ? err.message : "Could not reach the RegIntel-AI backend. Is it running?";
      setErrorMessage(message);
      toast({ variant: "error", title: "Upload failed", description: message });
    }
  }

  function reset() {
    setState("idle");
    setFile(null);
    setProgress(0);
    setErrorMessage(null);
    pendingFileRef.current = null;
  }

  function retry() {
    if (pendingFileRef.current) startUpload(pendingFileRef.current);
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (state === "idle") setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault(); setDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f && state === "idle") startUpload(f);
      }}
      onClick={() => state === "idle" && inputRef.current?.click()}
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
        dragging ? "border-primary bg-primary-tint" : "border-border bg-surface hover:border-primary/40",
        state !== "idle" && "cursor-default"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) startUpload(f); e.target.value = ""; }}
      />
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-tint text-primary">
              <UploadCloud className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-foreground">Drag & drop a SEBI circular here, or click to browse</p>
            <p className="text-xs text-foreground-muted">Supports PDF up to 25MB — AI extraction starts automatically</p>
          </motion.div>
        )}

        {state === "uploading" && file && (
          <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex w-full max-w-sm flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface-muted p-3 text-left">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary"><FileText className="h-4 w-4" /></div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-foreground">{file.name}</p>
                <p className="text-[11px] text-foreground-muted">{formatBytes(file.size)}</p>
              </div>
            </div>
            <Progress value={Math.min(progress, 100)} className="w-full" />
            <p className="text-xs text-foreground-muted">Extracting obligations · {Math.round(Math.min(progress, 100))}%</p>
          </motion.div>
        )}

        {state === "success" && file && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }} className="flex h-12 w-12 items-center justify-center rounded-full bg-success-tint text-success">
              <CheckCircle2 className="h-6 w-6" />
            </motion.div>
            <p className="text-sm font-medium text-foreground">{file.name} processed — obligations extracted</p>
          </motion.div>
        )}

        {state === "error" && file && (
          <motion.div key="error" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-tint text-danger">
              <XCircle className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-foreground">{file.name} failed to upload</p>
            {errorMessage && <p className="max-w-xs text-xs text-foreground-muted">{errorMessage}</p>}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={reset}><X className="h-3.5 w-3.5" /> Cancel</Button>
              <Button size="sm" onClick={retry}><RotateCcw className="h-3.5 w-3.5" /> Retry</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});