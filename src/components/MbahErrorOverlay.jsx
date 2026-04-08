/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Global Error Overlay
 * Purpose: Menampilkan overlay sistem error yang bertahan sampai ditutup manual oleh pengguna.
 */

import {
  Component,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import mbahErrorOverlayImage from "../assets/mbah-error-overlay.png";
import { GLOBAL_FRONTEND_ERROR_EVENT } from "../lib/httpClient";

const DEFAULT_OVERLAY_TITLE = "Sistem Eror";
const DEFAULT_OVERLAY_CAPTION =
  "Mbah: ini sistem eror, jadi langsung bilang ke Pak Jevi, kalau nggak Pak Tedi ya.";

const ErrorOverlayContext = createContext(null);

function normalizeErrorDetail(detail = {}) {
  return {
    id:
      detail.id ||
      `mbah-error-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: String(detail.title || DEFAULT_OVERLAY_TITLE).trim() || DEFAULT_OVERLAY_TITLE,
    caption:
      String(detail.caption || DEFAULT_OVERLAY_CAPTION).trim() ||
      DEFAULT_OVERLAY_CAPTION,
    message:
      String(
        detail.message ||
          "Ada gangguan pada sistem staff portal. Simpan detail error ini lalu teruskan ke tim backend/frontend.",
      ).trim(),
    technicalDetail: String(detail.technicalDetail || "").trim(),
    source: String(detail.source || "staff-portal")
      .trim()
      .toLowerCase(),
    status:
      typeof detail.status === "number" && Number.isFinite(detail.status)
        ? detail.status
        : 500,
    createdAt: detail.createdAt || new Date().toISOString(),
  };
}

function buildErrorSignature(detail) {
  return [
    detail.title,
    detail.message,
    detail.technicalDetail,
    detail.source,
    detail.status,
  ].join("::");
}

function safeSerializeDetail(value) {
  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value || "");
  }
}

function GlobalErrorOverlay({ detail, onClose }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/88 p-4 backdrop-blur-md">
      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-[#090909] shadow-[0_40px_120px_rgba(0,0,0,0.62)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[320px] overflow-hidden bg-black">
          <img
            src={mbahErrorOverlayImage}
            alt="Mbah error overlay"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.56)_100%)]" />
        </div>

        <div className="flex flex-col justify-between gap-6 p-5 md:p-8">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-public text-[10px] uppercase tracking-[0.32em] text-amber-300">
                  Mbah Alert Channel
                </p>
                <h2 className="mt-3 font-sans text-3xl font-bold uppercase text-stone-100 md:text-[2.6rem]">
                  {detail.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-stone-200 transition hover:bg-white/10"
              >
                Tutup
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-300/18 bg-amber-300/8 p-4">
              <p className="font-sans text-lg font-semibold leading-7 text-amber-100">
                {detail.caption}
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <p className="font-public text-[10px] uppercase tracking-[0.22em] text-stone-400">
                Ringkasan Gangguan
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-200">
                {detail.message}
              </p>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
                <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                  Status
                </p>
                <p className="mt-2 font-public text-sm font-bold uppercase text-stone-100">
                  {detail.status}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
                <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                  Sumber
                </p>
                <p className="mt-2 font-public text-sm font-bold uppercase text-stone-100">
                  {detail.source}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
                <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                  Tercatat
                </p>
                <p className="mt-2 font-public text-sm font-bold uppercase text-stone-100">
                  {new Date(detail.createdAt).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/8 bg-[#050505] p-4">
              <p className="font-public text-[10px] uppercase tracking-[0.22em] text-stone-400">
                Detail Teknis
              </p>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs leading-6 text-stone-300">
                {detail.technicalDetail || detail.message}
              </pre>
            </div>
          </div>

          <div className="rounded-2xl border border-rose-400/18 bg-rose-500/8 p-4">
            <p className="font-public text-[10px] uppercase tracking-[0.18em] text-rose-200">
              Tindakan Cepat
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-200">
              Simpan detail ini, lalu kabari Pak Jevi. Kalau belum bisa ditangani, teruskan ke Pak Tedi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorOverlayProvider({ children }) {
  const [activeError, setActiveError] = useState(null);
  const lastSignatureRef = useRef("");
  const lastSignatureAtRef = useRef(0);

  const showError = useCallback((detail) => {
    const normalizedDetail = normalizeErrorDetail(detail);
    const signature = buildErrorSignature(normalizedDetail);
    const now = Date.now();

    if (
      signature === lastSignatureRef.current &&
      now - lastSignatureAtRef.current < 1500
    ) {
      return;
    }

    lastSignatureRef.current = signature;
    lastSignatureAtRef.current = now;
    setActiveError(normalizedDetail);
  }, []);

  const dismissError = useCallback(() => {
    setActiveError(null);
  }, []);

  useEffect(() => {
    const handleCustomError = (event) => {
      showError(event.detail);
    };

    const handleWindowError = (event) => {
      showError({
        title: DEFAULT_OVERLAY_TITLE,
        message:
          event.error?.message ||
          event.message ||
          "Terjadi gangguan tak terduga pada halaman staff portal.",
        technicalDetail: [
          event.filename ? `File: ${event.filename}` : "",
          event.lineno ? `Baris: ${event.lineno}` : "",
          event.colno ? `Kolom: ${event.colno}` : "",
        ]
          .filter(Boolean)
          .join(" | "),
        source: "window-error",
      });
    };

    const handleUnhandledRejection = (event) => {
      const reason =
        typeof event.reason === "string"
          ? event.reason
          : event.reason?.message || "Unhandled promise rejection.";

      showError({
        title: DEFAULT_OVERLAY_TITLE,
        message: reason,
        technicalDetail:
          typeof event.reason === "string"
            ? event.reason
            : safeSerializeDetail(event.reason),
        source: "unhandled-rejection",
      });
    };

    window.addEventListener(GLOBAL_FRONTEND_ERROR_EVENT, handleCustomError);
    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener(GLOBAL_FRONTEND_ERROR_EVENT, handleCustomError);
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, [showError]);

  const value = useMemo(
    () => ({
      activeError,
      showError,
      dismissError,
    }),
    [activeError, dismissError, showError],
  );

  return (
    <ErrorOverlayContext.Provider value={value}>
      {children}
      {activeError ? (
        <GlobalErrorOverlay detail={activeError} onClose={dismissError} />
      ) : null}
    </ErrorOverlayContext.Provider>
  );
}

export function useErrorOverlay() {
  const context = useContext(ErrorOverlayContext);

  if (!context) {
    throw new Error("useErrorOverlay must be used inside ErrorOverlayProvider.");
  }

  return context;
}

export class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(GLOBAL_FRONTEND_ERROR_EVENT, {
          detail: {
            title: DEFAULT_OVERLAY_TITLE,
            message:
              error?.message ||
              "Terjadi error fatal pada rendering halaman staff portal.",
            technicalDetail: errorInfo?.componentStack || String(error || ""),
            source: "react-boundary",
            status: 500,
          },
        }),
      );
    }
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}
