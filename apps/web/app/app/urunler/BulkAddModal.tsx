"use client";

import {
  Download,
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
  const [mode, setMode] = useState<"grid" | "excel">("grid");
  const [rows, setRows] = useState<BulkRow[]>(() => Array.from({ length: 6 }, emptyRow));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = useMemo(() => createClient(), []);

  if (!open) return null;

  const validRows = rows.filter((row) => row.barcode.trim() && row.name.trim() && row.sale_price.trim());

  function updateCell(rowIndex: number, key: keyof BulkRow, value: string) {
    setRows((current) => {
      const next = current.map((row, index) => (index === rowIndex ? { ...row, [key]: value } : row));
      // Keep a trailing empty row so the grid always grows as you type.
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
    if (!/[\t\n]/.test(text)) return; // single value — let the normal paste happen
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

    const { error } = await supabase.from("products").insert(payloads);

    if (!error) {
      onImported(`${payloads.length} ürün eklendi.`);
      resetAndClose();
      setSaving(false);
      return;
    }

    // Batch failed (often a barcode that already exists) — retry row by row so
    // the good rows still go in and we can report exactly what was skipped.
    let added = 0;
    const skipped: string[] = [];
    for (const payload of payloads) {
      const { error: rowError } = await supabase.from("products").insert(payload);
      if (rowError) skipped.push(payload.barcode);
      else added += 1;
    }

    if (added === 0) {
      setMessage(`Hiçbir ürün eklenemedi. İlk hata: ${error.message}`);
    } else {
      onImported(
        skipped.length
          ? `${added} ürün eklendi. ${skipped.length} satır atlandı (zaten kayıtlı olabilir): ${skipped.slice(0, 5).join(", ")}${skipped.length > 5 ? "…" : ""}`
          : `${added} ürün eklendi.`
      );
      resetAndClose();
    }

    setSaving(false);
  }

  function resetAndClose() {
    setRows(Array.from({ length: 6 }, emptyRow));
    setMessage("");
    setMode("grid");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-[var(--color-bg)] text-slate-950 shadow-2xl dark:text-slate-50">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-5 dark:border-slate-800">
          <div>
            <h2 className="font-display text-2xl font-black">Toplu Ürün Ekle</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Faturadaki ürünleri hızlıca girin veya Excel dosyanızı yükleyin.
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

        <div className="grid grid-cols-2 gap-2 p-4 sm:max-w-md">
          <button
            type="button"
            onClick={() => setMode("grid")}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all active:scale-[0.98] ${
              mode === "grid"
                ? "border-cyan-400 bg-cyan-50 text-slate-800 dark:bg-cyan-500/10 dark:text-cyan-200"
                : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            }`}
          >
            <ReceiptText size={16} /> Faturadan / Hızlı Giriş
          </button>
          <button
            type="button"
            onClick={() => setMode("excel")}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all active:scale-[0.98] ${
              mode === "excel"
                ? "border-cyan-400 bg-cyan-50 text-slate-800 dark:bg-cyan-500/10 dark:text-cyan-200"
                : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            }`}
          >
            <FileSpreadsheet size={16} /> Excel ile
          </button>
        </div>

        {message && (
          <div className="mx-4 mb-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
            {message}
          </div>
        )}

        {mode === "excel" && (
          <div className="border-b border-slate-100 px-4 pb-4 dark:border-slate-800">
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
