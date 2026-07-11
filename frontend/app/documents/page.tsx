"use client";
import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, FileText, MoreVertical, Eye, Download, Trash2, Users, ListChecks, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge, statusVariant } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { documents } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { UploadDropzone, type UploadDropzoneHandle } from "@/components/documents/upload-dropzone";
import { riskVariant } from "@/components/ui/badge";
import type { UploadResponse } from "@/services/upload";

const categories = ["All Documents", "Master Circulars", "Frameworks", "Clarifications", "Guidelines"];

function DocumentsContent() {
  const [tab, setTab] = React.useState("All Documents");
  const [search, setSearch] = React.useState("");
  const [lastUpload, setLastUpload] = React.useState<UploadResponse | null>(null);
  const dropzoneRef = React.useRef<UploadDropzoneHandle>(null);
  const searchParams = useSearchParams();

  // Lets the FAB's "Upload Circular" quick action (which lives on every page,
  // not just /documents) deep-link here and open the file picker immediately.
  React.useEffect(() => {
    if (searchParams.get("upload") === "1") {
      dropzoneRef.current?.openFilePicker();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filtered = documents.filter((d) => {
    const matchesTab = tab === "All Documents" || d.category.toLowerCase().includes(tab.slice(0, -1).toLowerCase());
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Documents</h1>
          <p className="mt-1 text-sm text-foreground-muted">Every circular, framework and clarification RegIntel-AI has processed.</p>
        </div>
        <Button size="lg" onClick={() => dropzoneRef.current?.openFilePicker()}><Upload className="h-4 w-4" /> Upload Document</Button>
      </div>

      <UploadDropzone ref={dropzoneRef} onUploadComplete={setLastUpload} />

      {lastUpload && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-[15px] font-semibold text-foreground">
              AI extraction results — {lastUpload.filename}
            </h3>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setLastUpload(null)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="mt-1 text-[12px] text-foreground-muted">
            {lastUpload.pages} pages · {lastUpload.chunksProcessed} chunk{lastUpload.chunksProcessed === 1 ? "" : "s"} sent to Gemini · {lastUpload.obligations.length} obligation{lastUpload.obligations.length === 1 ? "" : "s"} extracted
          </p>
          {lastUpload.obligations.length > 0 ? (
            <div className="mt-4 space-y-2">
              {lastUpload.obligations.slice(0, 6).map((ob) => (
                <div key={ob.id} className="flex items-start gap-3 rounded-xl bg-surface-muted px-3 py-2.5 text-[13px]">
                  <Badge variant={riskVariant(ob.risk)}>{ob.risk}</Badge>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">Clause {ob.clause} · {ob.action}</p>
                    <p className="text-[12px] text-foreground-muted">{ob.department} · {ob.frequency} · Due {ob.deadline}</p>
                  </div>
                </div>
              ))}
              {lastUpload.obligations.length > 6 && (
                <p className="text-[12px] text-foreground-muted">
                  +{lastUpload.obligations.length - 6} more — see the Compliance Obligations page for the full list.
                </p>
              )}
            </div>
          ) : (
            <p className="mt-3 text-[13px] text-foreground-muted">No actionable obligations were found in this document.</p>
          )}
        </motion.div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full overflow-x-auto no-scrollbar sm:w-auto">
            {categories.map((c) => <TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}
          </TabsList>
        </Tabs>
        <Input placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:w-64" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((doc, i) => (
          <motion.div key={doc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className="group flex h-full flex-col p-5 transition-shadow hover:shadow-[var(--shadow-elevated)]">
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger-tint text-danger">
                  <FileText className="h-5 w-5" />
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <h3 className="mt-3 line-clamp-2 font-display text-[15px] font-semibold leading-snug text-foreground">{doc.name}</h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-foreground-muted">
                <span>{doc.category}</span><span>·</span><span>{formatDate(doc.uploadedOn)}</span>
              </div>

              <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-foreground-muted">{doc.summary}</p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-[12px]">
                <div className="flex items-center gap-1.5 rounded-lg bg-surface-muted px-2.5 py-1.5">
                  <ListChecks className="h-3.5 w-3.5 text-primary" /> {doc.obligations} obligations
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-surface-muted px-2.5 py-1.5">
                  <Users className="h-3.5 w-3.5 text-accent" /> {doc.departments} departments
                </div>
              </div>

              {doc.status === "Processing" ? (
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-[11px] text-foreground-muted"><span>Processing</span><span>64%</span></div>
                  <Progress value={64} />
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-1.5 text-[12px] font-medium text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Processed
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 border-t border-border-soft pt-4">
                <Badge variant={statusVariant(doc.status)}>{doc.status}</Badge>
                <div className="ml-auto flex gap-1">
                  <Link href="/documents/viewer">
                    <Button variant="outline" size="sm"><Eye className="h-3.5 w-3.5" /> View</Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
          <FileText className="h-10 w-10 text-foreground-subtle" />
          <p className="font-medium text-foreground">No documents match your search</p>
          <p className="text-sm text-foreground-muted">Try a different keyword or clear your filters.</p>
        </div>
      )}
    </div>
  );
}
export default function DocumentsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <DocumentsContent />
    </Suspense>
  );
}
