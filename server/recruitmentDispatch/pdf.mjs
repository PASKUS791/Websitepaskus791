/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Server / Recruitment Dispatch PDF
 * Purpose: Mengubah payload dispatch recruiter menjadi file PDF yang lebih rapi dengan heading, paragraf, tabel data, dan jarak antarsipil yang konsisten.
 */

import { RECRUITMENT_DISPATCH_CONFIG } from "./config.mjs";
import { normalizeMultilineText, normalizeText } from "./shared.mjs";

const {
  width: A4_WIDTH,
  height: A4_HEIGHT,
  marginX: PAGE_MARGIN_X,
  marginTop: PAGE_MARGIN_TOP = 56,
  marginBottom: PAGE_MARGIN_BOTTOM = 54,
  sectionSpacing: SECTION_SPACING = 24,
  reportSpacing: REPORT_SPACING = 28,
  tableLabelWidth: TABLE_LABEL_WIDTH = 156,
} = RECRUITMENT_DISPATCH_CONFIG.pdf;

const PAGE_TOP_Y = A4_HEIGHT - PAGE_MARGIN_TOP;
const PAGE_BOTTOM_Y = PAGE_MARGIN_BOTTOM;
const CONTENT_WIDTH = A4_WIDTH - PAGE_MARGIN_X * 2;

const FONT_REGULAR = "F1";
const FONT_BOLD = "F2";
const FONT_ITALIC = "F3";

function clampColor(value) {
  return Math.min(1, Math.max(0, value));
}

function hexToRgb(colorValue) {
  const safeValue = Number(colorValue || 0);

  return [
    clampColor(((safeValue >> 16) & 0xff) / 255),
    clampColor(((safeValue >> 8) & 0xff) / 255),
    clampColor((safeValue & 0xff) / 255),
  ];
}

function mixRgb(source, target, ratio) {
  return source.map((value, index) =>
    clampColor(value + (target[index] - value) * ratio),
  );
}

const PDF_COLORS = (() => {
  const primary = hexToRgb(RECRUITMENT_DISPATCH_CONFIG.colors.primaryEmbed);
  const secondary = hexToRgb(RECRUITMENT_DISPATCH_CONFIG.colors.secondaryEmbed);

  return {
    primary,
    secondary,
    primarySoft: mixRgb(primary, [1, 1, 1], 0.82),
    primaryStrong: mixRgb(primary, secondary, 0.3),
    tableHeader: mixRgb(secondary, primary, 0.24),
    text: [0.14, 0.16, 0.19],
    muted: [0.42, 0.45, 0.49],
    border: [0.8, 0.82, 0.85],
    borderStrong: mixRgb(primary, secondary, 0.45),
    surface: [0.97, 0.975, 0.98],
    surfaceAlt: [0.94, 0.95, 0.96],
    white: [1, 1, 1],
  };
})();

function formatPdfNumber(value) {
  return Number.parseFloat(Number(value).toFixed(3)).toString();
}

function escapePdfText(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\r/g, "")
    .replace(/\t/g, " ");
}

function formatColor(rgb, stroke = false) {
  return `${rgb.map((value) => formatPdfNumber(value)).join(" ")} ${stroke ? "RG" : "rg"}`;
}

function estimateGlyphWidth(char) {
  if (/\s/.test(char)) {
    return 0.28;
  }

  if (/[ilI1'`.,:;|!]/.test(char)) {
    return 0.24;
  }

  if (/[mwMW@#%&QGO]/.test(char)) {
    return 0.82;
  }

  if (/[A-Z]/.test(char)) {
    return 0.68;
  }

  if (/[0-9]/.test(char)) {
    return 0.56;
  }

  return 0.54;
}

function estimateTextWidth(text, fontSize) {
  return [...String(text || "")].reduce(
    (total, char) => total + estimateGlyphWidth(char) * fontSize,
    0,
  );
}

function splitLongWord(word, maxWidth, fontSize) {
  const chunks = [];
  let currentChunk = "";

  for (const char of String(word || "")) {
    const nextChunk = `${currentChunk}${char}`;

    if (currentChunk && estimateTextWidth(nextChunk, fontSize) > maxWidth) {
      chunks.push(currentChunk);
      currentChunk = char;
      continue;
    }

    currentChunk = nextChunk;
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks.length > 0 ? chunks : [String(word || "")];
}

function wrapParagraph(paragraph, maxWidth, fontSize) {
  const content = String(paragraph || "").trim();

  if (!content) {
    return [""];
  }

  const words = content.split(/\s+/).filter(Boolean);
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    if (estimateTextWidth(word, fontSize) > maxWidth) {
      const chunks = splitLongWord(word, maxWidth, fontSize);

      if (currentLine) {
        lines.push(currentLine);
        currentLine = "";
      }

      chunks.forEach((chunk, chunkIndex) => {
        if (chunkIndex < chunks.length - 1) {
          lines.push(chunk);
          return;
        }

        currentLine = chunk;
      });
      return;
    }

    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (currentLine && estimateTextWidth(nextLine, fontSize) > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
      return;
    }

    currentLine = nextLine;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [""];
}

function wrapTextToLines(value, maxWidth, fontSize) {
  const normalizedValue = normalizeMultilineText(value, "");

  if (!normalizedValue) {
    return [""];
  }

  const paragraphs = normalizedValue.split("\n");
  const lines = [];

  paragraphs.forEach((paragraph, paragraphIndex) => {
    const paragraphLines = wrapParagraph(paragraph, maxWidth, fontSize);
    lines.push(...paragraphLines);

    if (paragraphIndex < paragraphs.length - 1) {
      lines.push("");
    }
  });

  return lines;
}

function drawText(operations, lines, x, y, options = {}) {
  const safeLines = Array.isArray(lines) ? lines : [lines];

  if (safeLines.length === 0) {
    return;
  }

  const {
    font = FONT_REGULAR,
    size = 11,
    leading = size * 1.45,
    color = PDF_COLORS.text,
  } = options;

  operations.push("BT");
  operations.push(`/${font} ${formatPdfNumber(size)} Tf`);
  operations.push(`${formatPdfNumber(leading)} TL`);
  operations.push(formatColor(color));
  operations.push(
    `1 0 0 1 ${formatPdfNumber(x)} ${formatPdfNumber(y)} Tm`,
  );

  safeLines.forEach((line, index) => {
    if (index > 0) {
      operations.push("T*");
    }

    operations.push(`(${escapePdfText(line)}) Tj`);
  });

  operations.push("ET");
}

function drawRightAlignedText(operations, text, rightX, y, options = {}) {
  const fontSize = options.size || 11;
  const textWidth = estimateTextWidth(text, fontSize);
  drawText(operations, text, rightX - textWidth, y, options);
}

function drawLine(operations, x1, y1, x2, y2, options = {}) {
  const {
    color = PDF_COLORS.border,
    width = 1,
  } = options;

  operations.push("q");
  operations.push(formatColor(color, true));
  operations.push(`${formatPdfNumber(width)} w`);
  operations.push(
    `${formatPdfNumber(x1)} ${formatPdfNumber(y1)} m ${formatPdfNumber(x2)} ${formatPdfNumber(y2)} l S`,
  );
  operations.push("Q");
}

function drawRect(operations, x, topY, width, height, options = {}) {
  const {
    fillColor = null,
    strokeColor = null,
    lineWidth = 1,
  } = options;
  const bottomY = topY - height;
  let operator = "S";

  if (fillColor && strokeColor) {
    operator = "B";
  } else if (fillColor) {
    operator = "f";
  }

  operations.push("q");

  if (fillColor) {
    operations.push(formatColor(fillColor));
  }

  if (strokeColor) {
    operations.push(formatColor(strokeColor, true));
    operations.push(`${formatPdfNumber(lineWidth)} w`);
  }

  operations.push(
    `${formatPdfNumber(x)} ${formatPdfNumber(bottomY)} ${formatPdfNumber(width)} ${formatPdfNumber(height)} re ${operator}`,
  );
  operations.push("Q");
}

function buildPdfBufferFromPages(pages) {
  const objects = [null];
  const addObject = (body = null) => {
    objects.push(body);
    return objects.length - 1;
  };

  const catalogObjectId = addObject(null);
  const pagesObjectId = addObject(null);
  const regularFontObjectId = addObject(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  );
  const boldFontObjectId = addObject(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  );
  const italicFontObjectId = addObject(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>",
  );

  const pageObjectIds = [];

  pages.forEach((page) => {
    const contentStream = page.operations.join("\n");
    const contentObjectId = addObject(
      `<< /Length ${Buffer.byteLength(contentStream, "utf8")} >>\nstream\n${contentStream}\nendstream`,
    );
    const pageObjectId = addObject(
      `<< /Type /Page /Parent ${pagesObjectId} 0 R /MediaBox [0 0 ${A4_WIDTH} ${A4_HEIGHT}] /Resources << /Font << /F1 ${regularFontObjectId} 0 R /F2 ${boldFontObjectId} 0 R /F3 ${italicFontObjectId} 0 R >> >> /Contents ${contentObjectId} 0 R >>`,
    );

    pageObjectIds.push(pageObjectId);
  });

  objects[catalogObjectId] = `<< /Type /Catalog /Pages ${pagesObjectId} 0 R >>`;
  objects[pagesObjectId] = `<< /Type /Pages /Count ${pageObjectIds.length} /Kids [${pageObjectIds
    .map((pageObjectId) => `${pageObjectId} 0 R`)
    .join(" ")}] >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = new Array(objects.length).fill(0);

  for (let objectId = 1; objectId < objects.length; objectId += 1) {
    offsets[objectId] = Buffer.byteLength(pdf, "utf8");
    pdf += `${objectId} 0 obj\n${objects[objectId]}\nendobj\n`;
  }

  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length}\n`;
  pdf += "0000000000 65535 f \n";

  for (let objectId = 1; objectId < objects.length; objectId += 1) {
    pdf += `${String(offsets[objectId]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length} /Root ${catalogObjectId} 0 R >>\n`;
  pdf += `startxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
}

function formatDateTime(value) {
  return new Date(value).toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatOperationalDate(value) {
  const normalizedValue = normalizeText(value, "-");
  const parsedValue = new Date(normalizedValue);

  if (Number.isNaN(parsedValue.getTime())) {
    return normalizedValue;
  }

  return parsedValue.toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function createPdfLayout(generatedAt) {
  const pages = [];
  let currentPage = null;
  let currentY = PAGE_TOP_Y;

  function startNewPage(continuationLabel = "") {
    currentPage = {
      operations: [],
    };
    pages.push(currentPage);

    const operations = currentPage.operations;
    drawText(
      operations,
      RECRUITMENT_DISPATCH_CONFIG.webhookName.toUpperCase(),
      PAGE_MARGIN_X,
      A4_HEIGHT - 34,
      {
        font: FONT_BOLD,
        size: 9,
        color: PDF_COLORS.primary,
      },
    );
    drawLine(
      operations,
      PAGE_MARGIN_X,
      A4_HEIGHT - 40,
      A4_WIDTH - PAGE_MARGIN_X,
      A4_HEIGHT - 40,
      {
        color: PDF_COLORS.borderStrong,
        width: 0.8,
      },
    );

    if (continuationLabel) {
      drawRightAlignedText(
        operations,
        continuationLabel,
        A4_WIDTH - PAGE_MARGIN_X,
        A4_HEIGHT - 34,
        {
          font: FONT_ITALIC,
          size: 9,
          color: PDF_COLORS.muted,
        },
      );
    }

    currentY = A4_HEIGHT - 68;
  }

  function ensureSpace(requiredHeight, continuationLabel = "Lanjutan Dokumen") {
    if (!currentPage) {
      startNewPage("");
      return;
    }

    if (currentY - requiredHeight < PAGE_BOTTOM_Y) {
      startNewPage(continuationLabel);
    }
  }

  function addGap(amount = SECTION_SPACING) {
    currentY -= amount;
  }

  function drawDocumentHeader({ sessionTitle, requesterLabel }) {
    ensureSpace(112);

    const operations = currentPage.operations;
    const titleLines = wrapTextToLines("Laporan Dispatch Resimen", CONTENT_WIDTH, 22);
    const subtitleLines = wrapTextToLines(
      RECRUITMENT_DISPATCH_CONFIG.embed.description,
      CONTENT_WIDTH,
      11.5,
    );

    drawText(operations, RECRUITMENT_DISPATCH_CONFIG.embed.title.toUpperCase(), PAGE_MARGIN_X, currentY, {
      font: FONT_BOLD,
      size: 10,
      color: PDF_COLORS.primary,
    });
    currentY -= 18;

    drawText(operations, titleLines, PAGE_MARGIN_X, currentY, {
      font: FONT_BOLD,
      size: 22,
      leading: 28,
      color: PDF_COLORS.primaryStrong,
    });
    currentY -= titleLines.length * 28;

    drawText(operations, subtitleLines, PAGE_MARGIN_X, currentY, {
      size: 11.5,
      leading: 16,
      color: PDF_COLORS.text,
    });
    currentY -= subtitleLines.length * 16 + 10;

    drawText(operations, `Sesi: ${sessionTitle}`, PAGE_MARGIN_X, currentY, {
      font: FONT_BOLD,
      size: 12.5,
      color: PDF_COLORS.text,
    });
    currentY -= 18;

    drawText(
      operations,
      `Dibuat pada ${formatDateTime(generatedAt)} oleh ${requesterLabel}`,
      PAGE_MARGIN_X,
      currentY,
      {
        font: FONT_ITALIC,
        size: 10,
        color: PDF_COLORS.muted,
      },
    );
    currentY -= 16;

    drawLine(
      operations,
      PAGE_MARGIN_X,
      currentY,
      A4_WIDTH - PAGE_MARGIN_X,
      currentY,
      {
        color: PDF_COLORS.border,
        width: 0.8,
      },
    );
    currentY -= SECTION_SPACING - 8;
  }

  function drawSectionTitle(title, subtitle = "") {
    ensureSpace(subtitle ? 44 : 30, `Lanjutan ${title}`);

    const operations = currentPage.operations;
    drawRect(operations, PAGE_MARGIN_X, currentY + 4, 7, 16, {
      fillColor: PDF_COLORS.primary,
    });
    drawText(operations, title, PAGE_MARGIN_X + 14, currentY, {
      font: FONT_BOLD,
      size: 13,
      color: PDF_COLORS.primaryStrong,
    });
    currentY -= 18;

    if (subtitle) {
      const subtitleLines = wrapTextToLines(subtitle, CONTENT_WIDTH, 10);
      drawText(operations, subtitleLines, PAGE_MARGIN_X, currentY, {
        size: 10,
        leading: 14,
        color: PDF_COLORS.muted,
      });
      currentY -= subtitleLines.length * 14 + 6;
    }

    drawLine(
      operations,
      PAGE_MARGIN_X,
      currentY,
      A4_WIDTH - PAGE_MARGIN_X,
      currentY,
      {
        color: PDF_COLORS.border,
        width: 0.8,
      },
    );
    currentY -= 14;
  }

  function drawKeyValueTable(rows, options = {}) {
    const {
      labelHeader = "Informasi",
      valueHeader = "Detail",
      continuationLabel = "Lanjutan Tabel Informasi",
      labelWidth = TABLE_LABEL_WIDTH,
    } = options;
    const valueWidth = CONTENT_WIDTH - labelWidth;
    const rowPaddingX = 10;
    const rowPaddingY = 8;
    const labelFontSize = 10;
    const valueFontSize = 10.5;
    const labelLeading = 13;
    const valueLeading = 14;
    const headerHeight = 26;

    const drawHeaderRow = () => {
      ensureSpace(headerHeight + 6, continuationLabel);

      const currentOperations = currentPage.operations;
      drawRect(currentOperations, PAGE_MARGIN_X, currentY, CONTENT_WIDTH, headerHeight, {
        fillColor: PDF_COLORS.tableHeader,
        strokeColor: PDF_COLORS.borderStrong,
        lineWidth: 0.9,
      });
      drawLine(
        currentOperations,
        PAGE_MARGIN_X + labelWidth,
        currentY,
        PAGE_MARGIN_X + labelWidth,
        currentY - headerHeight,
        {
          color: PDF_COLORS.borderStrong,
          width: 0.8,
        },
      );
      drawText(currentOperations, labelHeader, PAGE_MARGIN_X + rowPaddingX, currentY - 17, {
        font: FONT_BOLD,
        size: 10,
        color: PDF_COLORS.white,
      });
      drawText(
        currentOperations,
        valueHeader,
        PAGE_MARGIN_X + labelWidth + rowPaddingX,
        currentY - 17,
        {
          font: FONT_BOLD,
          size: 10,
          color: PDF_COLORS.white,
        },
      );

      currentY -= headerHeight;
    };

    drawHeaderRow();

    rows.forEach((row, rowIndex) => {
      const rowLabel = normalizeText(row.label, "-");
      const rowValue = normalizeMultilineText(row.value, "-");
      const labelLines = wrapTextToLines(
        rowLabel,
        labelWidth - rowPaddingX * 2,
        labelFontSize,
      );
      const valueLines = wrapTextToLines(
        rowValue,
        valueWidth - rowPaddingX * 2,
        valueFontSize,
      );
      const rowHeight =
        Math.max(
          labelLines.length * labelLeading,
          valueLines.length * valueLeading,
        ) +
        rowPaddingY * 2;

      if (currentY - rowHeight < PAGE_BOTTOM_Y) {
        startNewPage(continuationLabel);
        drawHeaderRow();
      }

      const rowOperations = currentPage.operations;
      drawRect(rowOperations, PAGE_MARGIN_X, currentY, CONTENT_WIDTH, rowHeight, {
        fillColor: rowIndex % 2 === 0 ? PDF_COLORS.surface : PDF_COLORS.white,
        strokeColor: PDF_COLORS.border,
        lineWidth: 0.8,
      });
      drawLine(
        rowOperations,
        PAGE_MARGIN_X + labelWidth,
        currentY,
        PAGE_MARGIN_X + labelWidth,
        currentY - rowHeight,
        {
          color: PDF_COLORS.border,
          width: 0.8,
        },
      );
      drawText(rowOperations, labelLines, PAGE_MARGIN_X + rowPaddingX, currentY - 15, {
        font: FONT_BOLD,
        size: labelFontSize,
        leading: labelLeading,
        color: PDF_COLORS.primaryStrong,
      });
      drawText(
        rowOperations,
        valueLines,
        PAGE_MARGIN_X + labelWidth + rowPaddingX,
        currentY - 15,
        {
          size: valueFontSize,
          leading: valueLeading,
          color: PDF_COLORS.text,
        },
      );

      currentY -= rowHeight;
    });

    currentY -= 14;
  }

  function drawParagraphSection({
    title,
    text,
    continuationLabel = "Lanjutan Paragraf",
    indent = 0,
    gapAfter = 14,
    titleSize = 10,
    bodySize = 11,
  }) {
    const titleLabel = normalizeText(title, "Keterangan");
    const bodyLines = wrapTextToLines(text, CONTENT_WIDTH - indent, bodySize);
    const bodyLeading = bodySize * 1.5;
    const estimatedHeight = 18 + bodyLines.length * bodyLeading + gapAfter;

    ensureSpace(estimatedHeight, continuationLabel);

    const operations = currentPage.operations;
    drawText(operations, titleLabel.toUpperCase(), PAGE_MARGIN_X + indent, currentY, {
      font: FONT_BOLD,
      size: titleSize,
      color: PDF_COLORS.primaryStrong,
    });
    currentY -= 16;

    drawText(operations, bodyLines, PAGE_MARGIN_X + indent, currentY, {
      size: bodySize,
      leading: bodyLeading,
      color: PDF_COLORS.text,
    });
    currentY -= bodyLines.length * bodyLeading + gapAfter;
  }

  function drawMutedText(text, options = {}) {
    const {
      indent = 0,
      gapAfter = 12,
      size = 10.5,
      continuationLabel = "Lanjutan Catatan",
    } = options;
    const lines = wrapTextToLines(text, CONTENT_WIDTH - indent, size);
    const leading = size * 1.45;

    ensureSpace(lines.length * leading + gapAfter, continuationLabel);

    drawText(currentPage.operations, lines, PAGE_MARGIN_X + indent, currentY, {
      font: FONT_ITALIC,
      size,
      leading,
      color: PDF_COLORS.muted,
    });
    currentY -= lines.length * leading + gapAfter;
  }

  function drawTagBadge(text, indent = 0) {
    const badgeText = normalizeText(text, "Label");
    const badgeHeight = 18;
    const badgeWidth = estimateTextWidth(badgeText, 9.5) + 18;

    ensureSpace(badgeHeight + 10, `Lanjutan ${badgeText}`);

    drawRect(
      currentPage.operations,
      PAGE_MARGIN_X + indent,
      currentY + 4,
      badgeWidth,
      badgeHeight,
      {
        fillColor: PDF_COLORS.primarySoft,
        strokeColor: PDF_COLORS.borderStrong,
        lineWidth: 0.8,
      },
    );
    drawText(
      currentPage.operations,
      badgeText,
      PAGE_MARGIN_X + indent + 9,
      currentY - 8,
      {
        font: FONT_BOLD,
        size: 9.5,
        color: PDF_COLORS.primaryStrong,
      },
    );

    currentY -= badgeHeight + 8;
  }

  function drawReportSection(report, reportIndex) {
    const reportNumber = String(reportIndex).padStart(2, "0");
    const reportTitleLines = wrapTextToLines(
      `Sipil ${reportNumber} - ${report.name}`,
      CONTENT_WIDTH - 28,
      12.5,
    );
    const headerHeight = Math.max(34, reportTitleLines.length * 15 + 16);

    ensureSpace(headerHeight + 120, `Lanjutan Rincian Sipil ${reportNumber}`);

    drawRect(currentPage.operations, PAGE_MARGIN_X, currentY, CONTENT_WIDTH, headerHeight, {
      fillColor: PDF_COLORS.primarySoft,
      strokeColor: PDF_COLORS.borderStrong,
      lineWidth: 0.9,
    });
    drawText(currentPage.operations, reportTitleLines, PAGE_MARGIN_X + 14, currentY - 18, {
      font: FONT_BOLD,
      size: 12.5,
      leading: 15,
      color: PDF_COLORS.primaryStrong,
    });
    currentY -= headerHeight + 8;

    drawText(
      currentPage.operations,
      `Tag Discord: ${report.discord}`,
      PAGE_MARGIN_X,
      currentY,
      {
        font: FONT_ITALIC,
        size: 10,
        color: PDF_COLORS.muted,
      },
    );
    currentY -= 16;

    drawKeyValueTable(
      [
        { label: "Status", value: report.status },
        { label: "Golongan", value: report.group },
        { label: "Usia", value: report.age },
        { label: "Gender", value: report.gender },
        {
          label: "Laporan Tambahan",
          value: `${report.additionalReports.length} entry`,
        },
      ],
      {
        labelHeader: "Data Sipil",
        valueHeader: "Keterangan",
        continuationLabel: `Lanjutan Data ${report.name}`,
      },
    );

    drawParagraphSection({
      title: "Pertanyaan Utama",
      text: report.question,
      continuationLabel: `Lanjutan Pertanyaan ${report.name}`,
    });

    drawParagraphSection({
      title: "Keterangan Evaluasi",
      text: report.notes,
      continuationLabel: `Lanjutan Evaluasi ${report.name}`,
    });

    if (report.additionalReports.length > 0) {
      drawText(currentPage.operations, "LAPORAN TAMBAHAN", PAGE_MARGIN_X, currentY, {
        font: FONT_BOLD,
        size: 10.5,
        color: PDF_COLORS.primaryStrong,
      });
      currentY -= 16;

      report.additionalReports.forEach((entry, supplementIndex) => {
        drawTagBadge(`Tambahan ${supplementIndex + 1}`, 10);
        drawParagraphSection({
          title: "Fokus Tambahan",
          text: entry.question,
          indent: 12,
          bodySize: 10.5,
          gapAfter: 10,
          continuationLabel: `Lanjutan Fokus ${report.name}`,
        });
        drawParagraphSection({
          title: "Catatan Tambahan",
          text: entry.notes,
          indent: 12,
          bodySize: 10.5,
          gapAfter: 12,
          continuationLabel: `Lanjutan Catatan ${report.name}`,
        });
      });
    } else {
      drawMutedText("Tidak ada laporan tambahan untuk sipil ini.", {
        size: 10.5,
        continuationLabel: `Lanjutan Catatan ${report.name}`,
      });
    }

    drawLine(
      currentPage.operations,
      PAGE_MARGIN_X,
      currentY,
      A4_WIDTH - PAGE_MARGIN_X,
      currentY,
      {
        color: PDF_COLORS.border,
        width: 0.8,
      },
    );
    currentY -= REPORT_SPACING;
  }

  function finalize() {
    const totalPages = pages.length;

    pages.forEach((page, pageIndex) => {
      drawLine(page.operations, PAGE_MARGIN_X, 42, A4_WIDTH - PAGE_MARGIN_X, 42, {
        color: PDF_COLORS.border,
        width: 0.8,
      });
      drawText(page.operations, RECRUITMENT_DISPATCH_CONFIG.webhookName, PAGE_MARGIN_X, 28, {
        font: FONT_ITALIC,
        size: 9,
        color: PDF_COLORS.muted,
      });
      drawRightAlignedText(
        page.operations,
        `Halaman ${pageIndex + 1} / ${totalPages}`,
        A4_WIDTH - PAGE_MARGIN_X,
        28,
        {
          font: FONT_ITALIC,
          size: 9,
          color: PDF_COLORS.muted,
        },
      );
    });

    return pages;
  }

  return {
    addGap,
    drawDocumentHeader,
    drawKeyValueTable,
    drawMutedText,
    drawParagraphSection,
    drawReportSection,
    drawSectionTitle,
    finalize,
  };
}

function buildSummaryRows({
  session,
  reports,
  attachmentFileName,
  requestedBy,
}) {
  const operatorLabels =
    session.operators.map((operator) => operator.label).join(", ") || "Petugas tidak tersedia";
  const requesterLabel = normalizeText(
    requestedBy?.label || requestedBy?.nama || requestedBy?.username,
    RECRUITMENT_DISPATCH_CONFIG.webhookName,
  );

  return [
    { label: "Judul Sesi", value: session.title },
    { label: "Golongan", value: session.golongan },
    { label: "Tanggal Operasional", value: formatOperationalDate(session.scheduledDate) },
    { label: "Instruktur", value: operatorLabels },
    { label: "Jumlah Laporan", value: `${reports.length} kandidat` },
    { label: "Lampiran Foto", value: attachmentFileName },
    { label: "Operator Dispatch", value: requesterLabel },
  ];
}

export function buildRecruitmentDispatchPdf(dispatchPayload, generatedAt) {
  const layout = createPdfLayout(generatedAt);
  const requesterLabel = normalizeText(
    dispatchPayload?.requestedBy?.label ||
      dispatchPayload?.requestedBy?.nama ||
      dispatchPayload?.requestedBy?.username,
    RECRUITMENT_DISPATCH_CONFIG.webhookName,
  );
  const summaryRows = buildSummaryRows({
    ...dispatchPayload,
    attachmentFileName: dispatchPayload.attachment.fileName,
  });

  layout.drawDocumentHeader({
    sessionTitle: dispatchPayload.session.title,
    requesterLabel,
  });

  layout.drawSectionTitle("Ringkasan Sesi");
  layout.drawKeyValueTable(summaryRows, {
    labelHeader: "Komponen",
    valueHeader: "Detail Laporan",
    continuationLabel: "Lanjutan Ringkasan Sesi",
  });

  layout.drawSectionTitle("Deskripsi Pelaporan");
  layout.drawParagraphSection({
    title: "Deskripsi",
    text: dispatchPayload.description,
    continuationLabel: "Lanjutan Deskripsi Pelaporan",
  });

  layout.drawSectionTitle(
    "Rincian Sipil dan Evaluasi",
    "Setiap sipil ditampilkan terpisah agar laporan lebih mudah dibaca dan dicek ulang oleh resimen.",
  );

  dispatchPayload.reports.forEach((report, reportIndex) => {
    layout.drawReportSection(report, reportIndex + 1);
  });

  layout.drawSectionTitle("Catatan Sistem");
  layout.drawMutedText(
    "Dokumen ini digenerate otomatis dari sesi pelatihan recruiter dan disiapkan untuk pelaporan resimen secara realtime.",
    {
      size: 10.5,
      continuationLabel: "Lanjutan Catatan Sistem",
    },
  );

  return buildPdfBufferFromPages(layout.finalize());
}
