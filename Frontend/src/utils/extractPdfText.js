import * as pdfjsLib from "pdfjs-dist";
import { createWorker } from "tesseract.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).href;

/**
 * Extracts text from a PDF file.
 * First tries native text extraction (works for text-based PDFs).
 * If that yields nothing, falls back to OCR (Tesseract) for scanned PDFs.
 *
 * @param {File} file - The PDF file
 * @param {(status: string) => void} onStatus - Optional callback for progress messages
 * @returns {Promise<{ text: string, pages: number, method: "native" | "ocr" }>}
 */
export async function extractPdfText(file, onStatus = () => {}) {
    const ab = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
    const numPages = pdf.numPages;

    // ── Step 1: try native text extraction ──
    let nativeText = "";
    for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent({ includeMarkedContent: false });
        const pageText = content.items
            .filter((item) => typeof item.str === "string")
            .map((item) => item.str)
            .join(" ");
        nativeText += pageText + "\n";
    }

    const trimmedNative = nativeText.trim();
    if (trimmedNative.length > 50) {
        return { text: trimmedNative, pages: numPages, method: "native" };
    }

    // ── Step 2: OCR fallback for scanned / image-based PDFs ──
    onStatus("ocr");
    let ocrText = "";
    const ocrWorker = await createWorker("eng", 1, {
        logger: () => {},
    });

    for (let i = 1; i <= numPages; i++) {
        onStatus(`ocr-page-${i}-${numPages}`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // higher scale = better OCR
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        await page.render({ canvasContext: ctx, viewport }).promise;

        const dataUrl = canvas.toDataURL("image/png");
        const { data } = await ocrWorker.recognize(dataUrl);
        ocrText += data.text + "\n";
    }

    await ocrWorker.terminate();
    return { text: ocrText.trim(), pages: numPages, method: "ocr" };
}
