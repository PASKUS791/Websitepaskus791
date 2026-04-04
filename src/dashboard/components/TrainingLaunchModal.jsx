/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / Training Launch Modal
 * Purpose: Modal pemilihan petugas dan golongan sebelum membuka sesi pelatihan.
 */

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../lib/api";
import {
  normalizeOperatorEntry,
  TRAINING_GOLONGAN_OPTIONS,
} from "../data/recruitmentData";

const MODAL_SELECTED_CANDIDATE_PAGE_SIZE = 5;

function OperatorChoiceCard({ operator, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        "rounded-2xl border p-3.5 text-left transition",
        selected
          ? "border-amber-300/40 bg-amber-300/10 shadow-[0_16px_35px_rgba(214,190,74,0.12)]"
          : "border-white/8 bg-black/20 hover:border-white/14 hover:bg-white/[0.04]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-sans text-base font-bold text-stone-100 md:text-lg">
            {operator.label}
          </p>
          <p className="mt-1.5 font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
            {operator.unit}
          </p>
          <p className="mt-1.5 text-[13px] text-stone-400">{operator.username}</p>
        </div>

        <span
          className={[
            "grid h-5.5 w-5.5 shrink-0 place-items-center rounded-full border text-[9px] font-bold transition",
            selected
              ? "border-amber-300 bg-amber-300 text-black"
              : "border-white/12 bg-black/20 text-stone-500",
          ].join(" ")}
        >
          {selected ? "✓" : ""}
        </span>
      </div>
    </button>
  );
}

export default function TrainingLaunchModal({
  selectedCount,
  selectedCandidates = [],
  submitting = false,
  onClose,
  onSubmit,
}) {
  const [operators, setOperators] = useState([]);
  const [selectedOperatorIds, setSelectedOperatorIds] = useState([]);
  const [golongan, setGolongan] = useState(TRAINING_GOLONGAN_OPTIONS[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCandidatePage, setSelectedCandidatePage] = useState(1);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    let active = true;

    async function loadOperators() {
      try {
        setLoading(true);
        const payload = await apiFetch("/api/pelatih/operators");

        if (!active) {
          return;
        }

        const nextOperators = Array.isArray(payload?.operators)
          ? payload.operators.map((operator, index) =>
              normalizeOperatorEntry(operator, index),
            )
          : [];

        setOperators(nextOperators);
        setSelectedOperatorIds([]);
        setError("");
      } catch (loadError) {
        if (!active) {
          return;
        }

        setOperators([]);
        setSelectedOperatorIds([]);
        setError(loadError.message || "Gagal memuat daftar petugas.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadOperators();

    return () => {
      active = false;
    };
  }, []);

  const selectedOperators = useMemo(
    () =>
      operators.filter((operator) => selectedOperatorIds.includes(String(operator.id))),
    [operators, selectedOperatorIds],
  );
  const selectedCandidatePageCount = Math.max(
    1,
    Math.ceil(selectedCandidates.length / MODAL_SELECTED_CANDIDATE_PAGE_SIZE),
  );
  const visibleSelectedCandidates = useMemo(() => {
    const startIndex =
      (selectedCandidatePage - 1) * MODAL_SELECTED_CANDIDATE_PAGE_SIZE;
    return selectedCandidates.slice(
      startIndex,
      startIndex + MODAL_SELECTED_CANDIDATE_PAGE_SIZE,
    );
  }, [selectedCandidatePage, selectedCandidates]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedOperators.length === 0) {
      setError("Pilih minimal satu petugas sebelum membuka pelatihan.");
      return;
    }

    onSubmit({
      golongan,
      operators: selectedOperators,
    });
  };

  const handleToggleOperator = (operatorId) => {
    setSelectedOperatorIds((currentIds) =>
      currentIds.includes(operatorId)
        ? currentIds.filter((currentId) => currentId !== operatorId)
        : [...currentIds, operatorId],
    );
  };

  useEffect(() => {
    setSelectedCandidatePage((currentPage) =>
      currentPage > selectedCandidatePageCount ? selectedCandidatePageCount : currentPage,
    );
  }, [selectedCandidatePageCount]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[240] flex items-center justify-center bg-black/70 p-3 md:p-5 backdrop-blur-[6px]"
      onClick={onClose}
    >
      <motion.form
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="flex max-h-[calc(100vh-1.75rem)] w-full max-w-[1120px] flex-col overflow-hidden rounded-[24px] border border-white/8 bg-[#181818] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:p-5"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/6 pb-3">
          <div>
            <p className="font-public text-[10px] uppercase tracking-[0.24em] text-amber-300">
              Dashboard Pelatih
            </p>
            <h3 className="mt-1.5 font-sans text-xl font-bold uppercase text-stone-100 md:text-2xl">
              Buka Pelatihan
            </h3>
            <p className="mt-1.5 text-[13px] text-stone-400">
              {selectedCount} kandidat dipilih untuk masuk ke sesi pelatihan baru.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="border border-white/8 bg-black/20 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
          >
            Tutup
          </button>
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="grid gap-2">
            <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
              Pilihan Pelatih
            </span>
            <div className="grid max-h-[320px] gap-3 overflow-y-auto pr-1 md:grid-cols-2">
              {operators.map((operator) => (
                <OperatorChoiceCard
                  key={operator.id}
                  operator={operator}
                  selected={selectedOperatorIds.includes(String(operator.id))}
                  onToggle={() => handleToggleOperator(String(operator.id))}
                />
              ))}
            </div>
            <p className="font-public text-[9px] uppercase tracking-[0.12em] text-stone-500">
              Klik beberapa box pelatih untuk memilih lebih dari satu petugas.
            </p>
          </div>

            <div className="space-y-4">
            <label className="grid gap-2">
              <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Golongan
              </span>
              <select
                value={golongan}
                onChange={(event) => setGolongan(event.target.value)}
                className="border border-white/8 bg-black/20 px-3 py-2.5 text-[13px] text-stone-100 outline-none transition focus:border-amber-300"
              >
                {TRAINING_GOLONGAN_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <div className="border border-white/8 bg-black/20 p-3.5">
              <p className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Ringkasan Sesi
              </p>
              <div className="mt-2.5 space-y-1.5 text-[13px] text-stone-200">
                <p>{selectedCount} kandidat siap dibuka ke pelatihan.</p>
                <p>{selectedOperators.length} petugas akan ditautkan ke sesi ini.</p>
                <p>{golongan} akan menjadi golongan aktif untuk sesi baru.</p>
            </div>
          </div>
        </div>

            <div className="border border-white/8 bg-black/20 p-3.5">
              <p className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Petugas Terpilih
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {selectedOperators.length > 0 ? (
                  selectedOperators.map((operator) => (
                    <span
                      key={operator.id}
                      className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 font-public text-[9px] uppercase tracking-[0.14em] text-amber-200"
                    >
                      {operator.label}
                    </span>
                  ))
                ) : (
                  <span className="font-public text-[9px] uppercase tracking-[0.14em] text-stone-500">
                    Belum ada petugas dipilih.
                  </span>
                )}
              </div>
            </div>

            <div className="border border-white/8 bg-black/20 p-3.5">
              <p className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Kandidat Terpilih
              </p>
              <div className="mt-2.5 min-h-[320px] max-h-[320px] overflow-y-auto pr-1">
                <div className="space-y-2">
                  {visibleSelectedCandidates.length > 0 ? (
                    visibleSelectedCandidates.map((candidate) => (
                      <div
                        key={candidate.identity}
                        className="rounded-xl border border-white/8 bg-black/20 px-3 py-2.5"
                      >
                        <p className="font-sans text-[15px] font-bold text-stone-100">
                          {candidate.roblox}
                        </p>
                        <p className="mt-1 text-[12px] text-stone-400">
                          {candidate.discord}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="flex min-h-[292px] items-center justify-center rounded-xl border border-dashed border-white/8 bg-black/20 px-3 py-3 text-center">
                      <span className="font-public text-[9px] uppercase tracking-[0.14em] text-stone-500">
                        Belum ada kandidat terpilih.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {selectedCandidates.length > MODAL_SELECTED_CANDIDATE_PAGE_SIZE ? (
                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-white/6 pt-3.5">
                  <p className="font-public text-[9px] uppercase tracking-[0.14em] text-stone-500">
                    Geser kandidat terpilih
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCandidatePage((currentPage) =>
                          Math.max(1, currentPage - 1),
                        )
                      }
                      disabled={selectedCandidatePage === 1}
                      className="rounded-xl border border-white/8 bg-black/20 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Prev
                    </button>
                    <div className="rounded-xl border border-white/8 bg-black/20 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-300">
                      Page {selectedCandidatePage} / {selectedCandidatePageCount}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCandidatePage((currentPage) =>
                          Math.min(selectedCandidatePageCount, currentPage + 1),
                        )
                      }
                      disabled={selectedCandidatePage === selectedCandidatePageCount}
                      className="rounded-xl border border-white/8 bg-black/20 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="mt-4 font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
            Memuat data petugas dari database...
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 font-public text-[9px] uppercase tracking-[0.16em] text-rose-300">
            {error}
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-3 border-t border-white/6 pt-3.5 md:flex-row md:items-center md:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="border border-white/8 bg-black/20 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.18em] text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading || submitting || selectedCount === 0}
            className="bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)] px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.18em] text-[#3C2F00] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Membuka Pelatihan..." : "Simpan dan Buka Pelatihan"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
