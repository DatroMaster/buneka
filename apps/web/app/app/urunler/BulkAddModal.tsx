"use client";

import {
  Camera,
  Download,
  FileText,
  FileSpreadsheet,
  Loader2,
  PackagePlus,
  Plus,
  ReceiptText,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { scanInvoiceAction } from "./invoice-actions";

type BulkRow = {
  barcode: string;
  name: string;
  category: string;
  purchase_price: string;
  sale_price: string;
  stock_quantity: string;
};

const COLS = ["barcode", "name", "category", "purchase_price", "sale_price", "stock_quantity"] as const;

const COLUMN_LABELS: { key: keyof BulkRow; label: string; width: string; numeric?: boolean }[] = [
  { key: "barcode", label: "Barkod", width: "min-w-[130px]" },
  { key: "name", label: "Ürün adı", width: "min-w-[170px]" },
  { key: "category", label: "Kategori", width: "min-w-[120px]" },
  { key: "purchase_price", label: "Alış (TL)", width: "min-w-[90px]", numeric: true },
  { key: "sale_price", label: "Satış (TL)", width: "min-w-[90px]", numeric: true },
  { key: "stock_quantity", label: "Stok", width: "min-w-[80px]", numeric: true },
];

const emptyRow = (): BulkRow => ({
  barcode: "",
  name: "",
  category: "",
  purchase_price: "",
  sale_price: "",
  stock_quantity: "",
});

const TEMPLATE_FILENAME = "buneka-urun-sablonu.xlsx";
const INVOICE_MAX_BYTES = 12 * 1024 * 1024;
const INVOICE_ACCEPT = "image/*,application/pdf,.pdf";

function isInvoiceFile(file: File) {
  return file.type.startsWith("image/") || file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

async function fileToBase64(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read"));
    reader.readAsDataURL(file);
  });
  return dataUrl.split(",")[1] ?? "";
}

// Read a photo, downscale it, and return base64 JPEG. Downscaling keeps the
// upload small (cheaper/faster scan, works on low-end phones) and the image
// is only ever held transiently in memory here — never stored anywhere.
async function fileToDownscaledBase64(file: File, maxEdge = 1600): Promise<{ base64: string; mediaType: string }> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read"));
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("decode"));
    image.src = dataUrl;
  });
  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(img, 0, 0, width, height);
  const base64 = canvas.toDataURL("image/jpeg", 0.85).split(",")[1] ?? "";
  return { base64, mediaType: "image/jpeg" };
}

async function fileToInvoicePayload(file: File): Promise<{ base64: string; mediaType: string; fileName: string }> {
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    return { base64: await fileToBase64(file), mediaType: "application/pdf", fileName: file.name };
  }

  const payload = await fileToDownscaledBase64(file);
  return { ...payload, fileName: file.name };
}

function parseTrDate(value: string): string | null {
  const match = value.match(/(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{2,4})/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3].length === 2 ? `20${match[3]}` : match[3]);
  const date = new Date(year, month - 1, day, 12, 0, 0);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function BulkAddModal({
  open,
  onClose,
  organizationId,
  storeId,
  onImported,
}: {
  open: boolean;
  onClose: () => void;
  organizationId: string;
  storeId: string | null;
  onImported: (message: string) => void;
}) {
  const [mode, setMode] = useState<"photo" | "grid" | "excel">("grid");
  const [rows, setRows] = useState<BulkRow[]>(() => Array.from({ length: 6 }, emptyRow));
  const [supplier, setSupplier] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [isDraggingInvoice, setIsDraggingInvoice] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const photoCaptureRef = useRef<HTMLInputElement>(null);
  const photoUploadRef = useRef<HTMLInputElement>(null);
  const supabase = useMemo(() => createClient(), []);

  if (!open) return null;

  const validRows = rows.filter((row) => row.barcode.trim() && row.name.trim() && row.sale_price.trim());

  function updateCell(rowIndex: number, key: keyof BulkRow, value: string) {
    setRows((current) => {
      const next = current.map((row, index) => (index === rowIndex ? { ...row, [key]: value } : row));
      if (rowIndex === next.length - 1 && value.trim()) next.push(emptyRow());
      return next;
    });
  }

  function removeRow(rowIndex: number) {
    setRows((current) => {
      const next = current.filter((_, index) => index !== rowIndex);
      return next.length ? next : [emptyRow()];
    });
  }

  function handlePaste(rowIndex: number, colIndex: number, event: React.ClipboardEvent<HTMLInputElement>) {
    const text = event.clipboardData.getData("text");
    if (!/[\t\n]/.test(text)) return;
    event.preventDefault();
    const lines = text.replace(/\r/g, "").split("\n");
    while (lines.length && lines[lines.length - 1] === "") lines.pop();

    setRows((current) => {
      const next = [...current];
      lines.forEach((line, lineOffset) => {
        const targetRow = rowIndex + lineOffset;
        while (next.length <= targetRow) next.push(emptyRow());
        const row = { ...next[targetRow] };
        line.split("\t").forEach((cell, cellOffset) => {
          const key = COLS[colIndex + cellOffset];
          if (key) row[key] = cell.trim();
        });
        next[targetRow] = row;
      });
      next.push(emptyRow());
      return next;
    });
  }

  async function downloadTemplate() {
    const XLSX = await import("xlsx");
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["Barkod", "Ürün Adı", "Kategori", "Alış Fiyatı (TL)", "Satış Fiyatı (TL)", "Stok"],
      ["8690000000011", "Örnek Su 500 ml", "İçecek", 8, 12, 48],
      ["8690000000028", "Örnek Çikolata", "Atıştırmalık", 12, 18.5, 24],
    ]);
    worksheet["!cols"] = [{ wch: 16 }, { wch: 26 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 8 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ürünler");
    XLSX.writeFile(workbook, TEMPLATE_FILENAME);
  }

  async function handleFile(file: File) {
    setMessage("");
    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const matrix = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1, blankrows: false });

      const firstRow = matrix[0]?.map((cell) => String(cell ?? "").toLowerCase()).join(" ") ?? "";
      const startIndex = /barkod|barcode|ürün|urun|\bad\b|fiyat/.test(firstRow) ? 1 : 0;

      const parsed: BulkRow[] = matrix
        .slice(startIndex)
        .map((cells) => ({
          barcode: String(cells[0] ?? "").trim(),
          name: String(cells[1] ?? "").trim(),
          category: String(cells[2] ?? "").trim(),
          purchase_price: cells[3] != null && cells[3] !== "" ? String(cells[3]).trim() : "",
          sale_price: cells[4] != null && cells[4] !== "" ? String(cells[4]).trim() : "",
          stock_quantity: cells[5] != null && cells[5] !== "" ? String(cells[5]).trim() : "",
        }))
        .filter((row) => row.barcode || row.name);

      if (parsed.length === 0) {
        setMessage("Dosyada geçerli satır bulunamadı. Lütfen şablonu kullanın.");
        return;
      }

      setRows([...parsed, emptyRow()]);
      setMode("grid");
      setMessage(`${parsed.length} satır okundu. Kaydetmeden önce kontrol edebilirsiniz.`);
    } catch {
      setMessage("Dosya okunamadı. Lütfen .xlsx veya .csv formatında bir dosya seçin.");
    }
  }

  async function handlePhoto(file: File) {
    setMessage("");
    if (!isInvoiceFile(file)) {
      setMessage("Lütfen fatura fotoğrafı veya PDF fatura yükleyin.");
      return;
    }
    if (file.size > INVOICE_MAX_BYTES) {
      setMessage("Fatura dosyası 12 MB altında olmalı. Daha küçük bir PDF veya daha net sıkıştırılmış görsel deneyin.");
      return;
    }
    setScanning(true);
    try {
      const payload = await fileToInvoicePayload(file);
      const result = await scanInvoiceAction(payload);
      // The file payload goes out of scope here; it is never stored on the
      // server or in component state after the scan completes.

      if (!result.ok) {
        setMessage(
          result.error === "no-key"
            ? "Fatura tarama için önce yöneticinizin bir yapay zekâ anahtarı (ANTHROPIC_API_KEY) tanımlaması gerekiyor. Şimdilik ürünleri elle veya Excel ile ekleyebilirsiniz."
            : `Fatura okunamadı: ${result.message ?? "lütfen daha net bir fotoğrafla tekrar deneyin"}.`
        );
        setScanning(false);
        return;
      }

      if (result.items.length === 0) {
        setMessage("Faturada ürün kalemi okunamadı. Fotoğrafın net ve tam olduğundan emin olup tekrar deneyin.");
        setScanning(false);
        return;
      }

      if (result.supplier) setSupplier(result.supplier);
      if (result.invoiceDate) setInvoiceDate(result.invoiceDate);
      setRows([
        ...result.items.map((item) => ({
          barcode: item.barcode,
          name: item.name,
          category: "",
          purchase_price: item.unitPrice ? String(item.unitPrice) : "",
          sale_price: "",
          stock_quantity: item.quantity ? String(item.quantity) : "",
        })),
        emptyRow(),
      ]);
      setMode("grid");
      setMessage(
        `Fatura okundu: ${result.items.length} kalem geldi. Dosya işlendi ve saklanmadı. Satış fiyatlarını girip kaydedin.`
      );
    } catch {
      setMessage("Fatura dosyası işlenemedi. Lütfen daha net bir fotoğraf veya okunabilir PDF ile tekrar deneyin.");
    }
    setScanning(false);
  }

  async function recordInvoiceMovements(inserted: { id: string; barcode: string }[]) {
    if (!supplier.trim() && !invoiceDate.trim()) return;
    const byBarcode = new Map(validRows.map((row) => [row.barcode.trim(), row]));
    const createdAt = parseTrDate(invoiceDate);
    const note = ["Fatura", supplier.trim(), invoiceDate.trim()].filter(Boolean).join(" · ");

    const movements = inserted
      .map(({ id, barcode }) => {
        const row = byBarcode.get(barcode);
        const quantity = Number(row?.stock_quantity) || 0;
        if (quantity <= 0) return null;
        return {
          organization_id: organizationId,
          store_id: storeId,
          product_id: id,
          movement_type: "purchase",
          quantity,
          unit_price: row?.purchase_price?.trim() ? Number(row.purchase_price) : null,
          note,
          ...(createdAt ? { created_at: createdAt } : {}),
        };
      })
      .filter((movement): movement is NonNullable<typeof movement> => movement !== null);

    if (movements.length > 0) {
      // Best-effort — the products are already saved; a movement failure
      // shouldn't undo the import.
      await supabase.from("stock_movements").insert(movements);
    }
  }

  async function saveAll() {
    if (validRows.length === 0) return;
    setSaving(true);
    setMessage("");

    const payloads = validRows.map((row) => ({
      organization_id: organizationId,
      store_id: storeId,
      barcode: row.barcode.trim(),
      name: row.name.trim(),
      category: row.category.trim() || null,
      purchase_price: row.purchase_price.trim() ? Number(row.purchase_price) : null,
      sale_price: Number(row.sale_price),
      stock_quantity: row.stock_quantity.trim() ? Number(row.stock_quantity) : 0,
      min_stock: 0,
    }));

    const { data: insertedBatch, error } = await supabase
      .from("products")
      .insert(payloads)
      .select("id, barcode");

    if (!error && insertedBatch) {
      await recordInvoiceMovements(insertedBatch as { id: string; barcode: string }[]);
      onImported(`${insertedBatch.length} ürün eklendi.`);
      resetAndClose();
      setSaving(false);
      return;
    }

    // Batch failed (often a barcode that already exists) — retry row by row so
    // the good rows still go in and we can report exactly what was skipped.
    const inserted: { id: string; barcode: string }[] = [];
    const skipped: string[] = [];
    for (const payload of payloads) {
      const { data: row, error: rowError } = await supabase
        .from("products")
        .insert(payload)
        .select("id, barcode")
        .single();
      if (rowError || !row) skipped.push(payload.barcode);
      else inserted.push(row as { id: string; barcode: string });
    }

    if (inserted.length === 0) {
      setMessage(`Hiçbir ürün eklenemedi. İlk hata: ${error?.message ?? "bilinmiyor"}`);
    } else {
      await recordInvoiceMovements(inserted);
      onImported(
        skipped.length
          ? `${inserted.length} ürün eklendi. ${skipped.length} satır atlandı (zaten kayıtlı olabilir): ${skipped.slice(0, 5).join(", ")}${skipped.length > 5 ? "…" : ""}`
          : `${inserted.length} ürün eklendi.`
      );
      resetAndClose();
    }

    setSaving(false);
  }

  function resetAndClose() {
    setRows(Array.from({ length: 6 }, emptyRow));
    setSupplier("");
    setInvoiceDate("");
    setMessage("");
    setMode("grid");
    onClose();
  }

  const modeButton = (value: "photo" | "grid" | "excel", icon: React.ReactNode, label: string) => (
    <button
      type="button"
      onClick={() => setMode(value)}
      className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-bold transition-all active:scale-[0.98] sm:text-sm ${
        mode === value
          ? "border-cyan-400 bg-cyan-50 text-slate-800 dark:bg-cyan-500/10 dark:text-cyan-200"
          : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      }`}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-[var(--color-bg)] text-slate-950 shadow-2xl dark:text-slate-50">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-5 dark:border-slate-800">
          <div>
            <h2 className="font-display text-2xl font-black">Toplu Ürün Ekle</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Faturanın fotoğrafını çekin, satır satır girin veya Excel dosyanızı yükleyin.
            </p>
          </div>
          <button
            className="rounded-full bg-white p-2 text-slate-950 transition-transform active:scale-90 dark:bg-slate-800 dark:text-slate-50"
            type="button"
            onClick={resetAndClose}
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 p-4">
          {modeButton("photo", <Camera size={15} />, "Fatura Fotoğrafı")}
          {modeButton("grid", <ReceiptText size={15} />, "Elle Giriş")}
          {modeButton("excel", <FileSpreadsheet size={15} />, "Excel ile")}
        </div>

        <div className="grid grid-cols-1 gap-2 px-4 sm:grid-cols-2">
          <label className="grid gap-1 text-xs font-bold text-slate-600 dark:text-slate-400">
            Tedarikçi (opsiyonel)
            <input
              value={supplier}
              onChange={(event) => setSupplier(event.target.value)}
              placeholder="Örn. Yıldız Toptan Gıda"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-950 focus:border-cyan-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50"
            />
          </label>
          <label className="grid gap-1 text-xs font-bold text-slate-600 dark:text-slate-400">
            Fatura tarihi (opsiyonel)
            <input
              value={invoiceDate}
              onChange={(event) => setInvoiceDate(event.target.value)}
              placeholder="GG.AA.YYYY"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-950 focus:border-cyan-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50"
            />
          </label>
        </div>

        {message && (
          <div className="mx-4 mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
            {message}
          </div>
        )}

        {mode === "photo" && (
          <div className="px-4 pb-4 pt-2">
            <div
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDraggingInvoice(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDraggingInvoice(true);
              }}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setIsDraggingInvoice(false);
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDraggingInvoice(false);
                const file = event.dataTransfer.files?.[0];
                if (file) void handlePhoto(file);
              }}
              className={`rounded-xl border border-dashed p-5 text-center transition-all ${
                isDraggingInvoice
                  ? "border-emerald-300 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(52,211,153,0.28),0_18px_50px_rgba(52,211,153,0.12)]"
                  : "border-cyan-300 bg-cyan-50/50 dark:border-cyan-500/30 dark:bg-cyan-500/5"
              }`}
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-300">
                <FileText size={22} />
              </div>
              <p className="font-display text-base font-bold">Faturayı sürükle bırak, ürünler otomatik gelsin</p>
              <p className="mx-auto mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
                Tedarikçi faturasının fotoğrafını çek; ürünler, adetler ve fiyatlar saniyeler içinde işlensin.
                PDF faturayı da buraya sürükleyip bırakabilirsiniz. Dosya işlendikten sonra saklanmaz.
              </p>

              <input
                ref={photoCaptureRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handlePhoto(file);
                  event.target.value = "";
                }}
              />
              <input
                ref={photoUploadRef}
                type="file"
                accept={INVOICE_ACCEPT}
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handlePhoto(file);
                  event.target.value = "";
                }}
              />

              {scanning ? (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-cyan-600 dark:text-cyan-300">
                  <Loader2 size={18} className="animate-spin" /> Fatura okunuyor…
                </div>
              ) : (
                <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => photoCaptureRef.current?.click()}
                    className="premium-button-primary text-sm"
                  >
                    <Camera size={16} /> Fatura Fotoğrafı Çek
                  </button>
                  <button
                    type="button"
                    onClick={() => photoUploadRef.current?.click()}
                    className="premium-button-secondary text-sm"
                  >
                    <Upload size={16} /> Foto/PDF Yükle
                  </button>
                </div>
              )}
              <p className="mt-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Desteklenen formatlar: PDF, JPG, PNG, WebP. En fazla 12 MB.
              </p>
            </div>
          </div>
        )}

        {mode === "excel" && (
          <div className="border-b border-slate-100 px-4 pb-4 pt-2 dark:border-slate-800">
            <div className="grid gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50 sm:grid-cols-2">
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-sm font-black text-slate-800 dark:text-slate-200">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[11px] text-white">1</span>
                  Şablonu indirin
                </p>
                <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                  Sütunları hazır Excel şablonunu indirin, ürünlerinizi satır satır doldurun.
                </p>
                <button type="button" onClick={downloadTemplate} className="premium-button-secondary w-full text-sm">
                  <Download size={16} /> Şablonu İndir (.xlsx)
                </button>
              </div>
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-sm font-black text-slate-800 dark:text-slate-200">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[11px] text-white">2</span>
                  Doldurup yükleyin
                </p>
                <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                  Doldurduğunuz dosyayı seçin; ürünler aşağıda önizlemeye gelir.
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void handleFile(file);
                    event.target.value = "";
                  }}
                />
                <button type="button" onClick={() => fileRef.current?.click()} className="premium-button-secondary w-full text-sm">
                  <Upload size={16} /> Dosya Seç
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-auto px-4">
          <table className="w-full border-separate border-spacing-0 text-left">
            <thead className="sticky top-0 z-10 bg-[var(--color-bg)]">
              <tr>
                <th className="w-8 py-2 pr-1 text-xs font-bold text-slate-400">#</th>
                {COLUMN_LABELS.map((col) => (
                  <th key={col.key} className="px-1 py-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    {col.label}
                    {(col.key === "barcode" || col.key === "name" || col.key === "sale_price") && (
                      <span className="text-rose-500"> *</span>
                    )}
                  </th>
                ))}
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="group">
                  <td className="py-1 pr-1 text-center text-xs text-slate-400">{rowIndex + 1}</td>
                  {COLUMN_LABELS.map((col, colIndex) => (
                    <td key={col.key} className={`px-1 py-1 ${col.width}`}>
                      <input
                        value={row[col.key]}
                        inputMode={col.numeric ? "decimal" : undefined}
                        onChange={(event) => updateCell(rowIndex, col.key, event.target.value)}
                        onPaste={(event) => handlePaste(rowIndex, colIndex, event)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm text-slate-950 placeholder-slate-400 focus:border-cyan-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50"
                      />
                    </td>
                  ))}
                  <td className="px-1">
                    <button
                      type="button"
                      onClick={() => removeRow(rowIndex)}
                      className="text-slate-300 transition-colors hover:text-rose-500 dark:text-slate-600"
                      aria-label="Satırı sil"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="button"
            onClick={() => setRows((current) => [...current, emptyRow()])}
            className="my-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-500 transition-colors hover:border-cyan-400 hover:text-cyan-600 dark:border-slate-700 dark:text-slate-400"
          >
            <Plus size={14} /> Satır ekle
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-100 p-4 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-black text-slate-800 dark:text-slate-200">{validRows.length}</span> ürün kaydedilmeye hazır
            <span className="ml-2 hidden text-xs sm:inline">İpucu: Excel&apos;den kopyalayıp tabloya yapıştırabilirsiniz.</span>
          </p>
          <button
            type="button"
            onClick={saveAll}
            disabled={saving || validRows.length === 0}
            className="premium-button-primary shrink-0"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <PackagePlus size={18} />}
            {validRows.length > 0 ? `${validRows.length} Ürünü Kaydet` : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
