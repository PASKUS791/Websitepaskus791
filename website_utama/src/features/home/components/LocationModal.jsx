import React, { useState } from "react";
import { Modal } from "../../../components/ui/Modal";

/**
 * Modern modal for prompting location permission as anti-bot verification.
 * simple consent explain-then-trigger geolocation
 */
export function LocationModal({ isOpen, onClose, onAllow }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRequestLocation = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      await onAllow();
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Gagal mendapatkan izin lokasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={loading ? null : onClose} title="VERIFIKASI LOKASI (ANTI-BOT)">
      <div className="flex flex-col items-center text-center">
        {/* Shield/ShieldAlert Icon */}
        <div className="w-16 h-16 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mb-6 text-gold animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <p className="text-gray-300 text-sm mb-4">
          Untuk memverifikasi bahwa Anda adalah manusia dan mencegah pengiriman formulir otomatis oleh bot, mohon berikan izin lokasi browser Anda.
        </p>
        <p className="text-xs text-sage/70 mb-6 italic">
          *Kami hanya menggunakan data lokasi kasar/koordinat untuk memvalidasi sesi pendaftaran Anda.
        </p>

        {errorMsg && (
          <div className="w-full bg-red-950/40 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs mb-6 text-left">
            <strong>Error:</strong> {errorMsg}
          </div>
        )}

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleRequestLocation}
            disabled={loading}
            className="btn-enlist w-full py-3.5 heading-font text-[10px] font-bold transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                MEMPROSES...
              </>
            ) : (
              "BERI IZIN LOKASI"
            )}
          </button>
          
          {!loading && (
            <button
              onClick={onClose}
              className="w-full py-3 heading-font text-[10px] text-sage hover:text-white transition-colors cursor-pointer"
            >
              BATAL
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
