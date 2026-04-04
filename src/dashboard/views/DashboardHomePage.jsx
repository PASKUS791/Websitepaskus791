/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / Kandidat Pelatih
 * Purpose: Seleksi kandidat sipil atau PMC yang belum masuk pelatihan atau rekrutmen.
 */

import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TrainingLaunchModal from "../components/TrainingLaunchModal";
import {
  buildTrainingSession,
  createCandidateIdentity,
  createReportsForTrainingSession,
  formatOperationalDateLabel,
  formatCandidateCategory,
  isCandidateAssignedToTraining,
  isTrainingSessionDispatched,
  loadDashboardCandidates,
  loadRecruitmentReports,
  loadTrainingSessions,
} from "../data/recruitmentData";
import { useAuth } from "../../lib/auth";
import { RESOURCE_KEYS, saveResource, useSyncedResource } from "../../lib/resources";

const DASHBOARD_CANDIDATE_PAGE_SIZE = 10;

// Section: dashboard UI atoms.
function DashboardStatCard({ title, value, detail, accent = "emerald" }) {
  const accentClasses = {
    emerald: "border-emerald-400/20 text-emerald-300",
    amber: "border-amber-300/20 text-amber-200",
    rose: "border-rose-400/20 text-rose-200",
    stone: "border-white/10 text-stone-200",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#171717] p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] md:p-4">
      <div
        className={`inline-flex rounded-full border px-3 py-1 font-public text-[9px] font-bold uppercase tracking-[0.18em] ${accentClasses[accent] ?? accentClasses.stone}`}
      >
        {title}
      </div>
      <p className="mt-3 font-sans text-[2rem] font-bold text-stone-100">{value}</p>
      <p className="mt-1.5 text-[13px] leading-5 text-stone-400">{detail}</p>
    </div>
  );
}

function CandidateCategoryBadge({ category }) {
  const isPmc = category === "pmc";

  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 font-public text-[10px] font-bold uppercase tracking-[0.16em]",
        isPmc
          ? "border-amber-300/20 bg-amber-300/10 text-amber-200"
          : "border-sky-300/20 bg-sky-300/10 text-sky-200",
      ].join(" ")}
    >
      {formatCandidateCategory(category)}
    </span>
  );
}

function SelectableCandidateRow({ candidate, selected, onToggle }) {
  return (
    <div
      className={[
        "grid min-h-[80px] grid-cols-[1.3fr_1.1fr_0.5fr_0.75fr_0.7fr] items-center gap-4 rounded-2xl border px-3.5 py-3.5 transition",
        selected
          ? "border-emerald-300/50 bg-[linear-gradient(90deg,rgba(174,209,143,0.95)_0%,rgba(205,223,165,0.88)_100%)] text-black shadow-[0_18px_40px_rgba(174,209,143,0.14)]"
          : "border-white/6 bg-[#131313] text-stone-100 hover:border-white/12 hover:bg-[#1a1a1a]",
      ].join(" ")}
    >
      <div className="min-w-0">
        <p className="font-sans text-base font-bold md:text-lg">{candidate.roblox}</p>
        <p className={`mt-1 text-[13px] ${selected ? "text-black/70" : "text-stone-400"}`}>
          {candidate.discord}
        </p>
      </div>

      <div className="min-w-0">
        <p
          className={`font-public text-[10px] uppercase tracking-[0.18em] ${selected ? "text-black/60" : "text-stone-500"}`}
        >
          Kategori
        </p>
        <div className="mt-2">
          <CandidateCategoryBadge category={candidate.category} />
        </div>
      </div>

      <div className="text-center">
        <p
          className={`font-public text-[10px] uppercase tracking-[0.18em] ${selected ? "text-black/60" : "text-stone-500"}`}
        >
          Usia
        </p>
        <p className="mt-2 font-public text-sm font-bold">{candidate.age}</p>
      </div>

      <div className="text-center">
        <p
          className={`font-public text-[10px] uppercase tracking-[0.18em] ${selected ? "text-black/60" : "text-stone-500"}`}
        >
          Gender
        </p>
        <p className="mt-2 font-public text-sm font-bold">{candidate.gender}</p>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onToggle}
          className={[
            "rounded-xl border px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.18em] transition",
            selected
              ? "border-black/20 bg-black text-stone-100 hover:bg-black/85"
              : "border-emerald-300/20 bg-emerald-300/10 text-emerald-200 hover:bg-emerald-300/15",
          ].join(" ")}
        >
          {selected ? "Dipilih" : "Pilih"}
        </button>
      </div>
    </div>
  );
}

function ActiveTrainingSessionCard({ session }) {
  return (
    <article className="rounded-2xl border border-white/8 bg-[#171717] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-public text-[10px] uppercase tracking-[0.22em] text-amber-300">
            Sesi Aktif
          </p>
          <h3 className="mt-2.5 font-sans text-xl font-bold text-stone-100 md:text-[1.6rem]">
            {session.title}
          </h3>
          <p className="mt-1.5 text-[13px] text-stone-400">
            {formatOperationalDateLabel(session.scheduledDate)}
          </p>
        </div>

        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200">
          {session.status}
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-white/8 bg-black/20 p-3">
          <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
            Petugas
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-200">
            {session.operators.map((operator) => operator.label).join(", ")}
          </p>
        </div>
        <div className="rounded-xl border border-white/8 bg-black/20 p-3">
          <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
            Kandidat
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-200">
            {session.candidates.length} kandidat
          </p>
        </div>
        <div className="rounded-xl border border-white/8 bg-black/20 p-3">
          <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
            Golongan
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-200">{session.golongan}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          to={`/dashboard/pelatihan/${session.id}`}
          className="inline-flex rounded-xl bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)] px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-[#3C2F00] transition hover:brightness-105"
        >
          Buka Sesi
        </Link>
        <Link
          to={`/dashboard/laporan-perekrutan/${session.id}`}
          className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-200 transition hover:bg-white/10"
        >
          Review Laporan
        </Link>
      </div>
    </article>
  );
}

// Section: main page.
export default function DashboardHomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    data: candidates,
    loading: candidatesLoading,
    error: candidatesError,
  } = useSyncedResource(RESOURCE_KEYS.dashboardCandidates, {
    defaultValue: [],
    saveDelay: 500,
    normalize: loadDashboardCandidates,
  });
  const {
    data: reports,
    setData: setReports,
  } = useSyncedResource(RESOURCE_KEYS.dashboardReports, {
    defaultValue: [],
    saveDelay: 450,
    normalize: loadRecruitmentReports,
  });
  const {
    data: trainingSessions,
    setData: setTrainingSessions,
  } = useSyncedResource(RESOURCE_KEYS.dashboardTrainingSessions, {
    defaultValue: [],
    saveDelay: 450,
    normalize: loadTrainingSessions,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIdentities, setSelectedIdentities] = useState([]);
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [launchError, setLaunchError] = useState("");
  const [launching, setLaunching] = useState(false);
  const [candidatePage, setCandidatePage] = useState(1);

  const availableCandidates = useMemo(() => {
    const reportedCandidateIdentities = new Set(
      reports.map((report) => report.candidateIdentity || createCandidateIdentity(report)),
    );

    return candidates.filter((candidate) => {
      if (!["sipil", "pmc"].includes(candidate.category)) {
        return false;
      }

      if (reportedCandidateIdentities.has(candidate.identity)) {
        return false;
      }

      return !isCandidateAssignedToTraining(candidate, trainingSessions);
    });
  }, [candidates, reports, trainingSessions]);

  const filteredCandidates = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return availableCandidates.filter((candidate) => {
      if (!normalizedSearchTerm) {
        return true;
      }

      return [candidate.roblox, candidate.discord, candidate.categoryLabel]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearchTerm);
    });
  }, [availableCandidates, searchTerm]);

  const selectedIdentitySet = useMemo(() => {
    const availableIdentitySet = new Set(
      availableCandidates.map((candidate) => candidate.identity),
    );

    return new Set(
      selectedIdentities.filter((identity) => availableIdentitySet.has(identity)),
    );
  }, [availableCandidates, selectedIdentities]);

  const selectedCandidates = useMemo(
    () =>
      availableCandidates.filter((candidate) =>
        selectedIdentitySet.has(candidate.identity),
      ),
    [availableCandidates, selectedIdentitySet],
  );
  const candidatePageCount = Math.max(
    1,
    Math.ceil(filteredCandidates.length / DASHBOARD_CANDIDATE_PAGE_SIZE),
  );
  const pagedCandidates = useMemo(() => {
    const startIndex = (candidatePage - 1) * DASHBOARD_CANDIDATE_PAGE_SIZE;
    return filteredCandidates.slice(
      startIndex,
      startIndex + DASHBOARD_CANDIDATE_PAGE_SIZE,
    );
  }, [candidatePage, filteredCandidates]);

  const sipilCount = availableCandidates.filter(
    (candidate) => candidate.category === "sipil",
  ).length;
  const pmcCount = availableCandidates.filter(
    (candidate) => candidate.category === "pmc",
  ).length;
  const activeTrainingSessions = useMemo(
    () =>
      trainingSessions.filter((session) => !isTrainingSessionDispatched(session, reports)),
    [reports, trainingSessions],
  );

  const handleToggleCandidate = (identity) => {
    setSelectedIdentities((currentIds) =>
      currentIds.includes(identity)
        ? currentIds.filter((currentId) => currentId !== identity)
        : [...currentIds, identity],
    );
  };

  useEffect(() => {
    setCandidatePage(1);
  }, [searchTerm]);

  useEffect(() => {
    setCandidatePage((currentPage) =>
      currentPage > candidatePageCount ? candidatePageCount : currentPage,
    );
  }, [candidatePageCount]);

  const handleOpenTraining = async ({ operators, golongan }) => {
    const nextSession = buildTrainingSession({
      selectedCandidates,
      selectedOperators: operators,
      golongan,
      createdBy: user?.label || "Paskus Admin",
    });
    const createdReports = createReportsForTrainingSession(nextSession);
    const nextTrainingSessions = [nextSession, ...trainingSessions];
    const nextReports = [...createdReports, ...reports];

    try {
      setLaunching(true);
      setLaunchError("");
      setTrainingSessions(nextTrainingSessions);
      setReports(nextReports);
      await Promise.all([
        saveResource(RESOURCE_KEYS.dashboardTrainingSessions, nextTrainingSessions),
        saveResource(RESOURCE_KEYS.dashboardReports, nextReports),
      ]);
      setSelectedIdentities([]);
      setIsLaunchModalOpen(false);
      navigate(`/dashboard/pelatihan/${nextSession.id}`, {
        state: {
          initialSession: nextSession,
          initialReports: createdReports,
        },
      });
    } catch (error) {
      setLaunchError(
        error?.message || "Gagal membuka pelatihan. Coba ulang beberapa saat lagi.",
      );
    } finally {
      setLaunching(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-yellow-400 drop-shadow-[0_0_6px_rgba(234,179,8,0.8)]">
              Phase: Pelatihan
            </span>
            <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(234,179,8,0.8)]" />
          </div>

          <h1 className="text-2xl font-bold">Dashboard Pelatih</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
            Pilih kandidat sipil atau PMC yang belum masuk pelatihan atau
            rekrutmen. Setelah kandidat dipilih, buka pelatihan untuk membuat
            sesi baru dan otomatis menyiapkan laporan perekrutan.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard
            title="Siap Pelatihan"
            value={availableCandidates.length}
            detail="Kandidat sipil atau PMC yang belum pernah dibuka ke sesi pelatihan."
            accent="emerald"
          />
          <DashboardStatCard
            title="Sipil"
            value={sipilCount}
            detail="Jumlah kandidat sipil yang masih menunggu sesi pelatih."
            accent="stone"
          />
          <DashboardStatCard
            title="PMC"
            value={pmcCount}
            detail="Jumlah kandidat PMC yang masih tersedia untuk dipilih."
            accent="amber"
          />
          <DashboardStatCard
            title="Dipilih"
            value={selectedCandidates.length}
            detail="Total kandidat yang sedang dipersiapkan untuk dibuka ke pelatihan."
            accent="rose"
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1C1B1B]/90 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">
                Candidate Table
              </p>
              <h2 className="mt-2 text-lg font-bold text-white">
                Daftar Kandidat Siap Pelatihan
              </h2>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                placeholder="Cari kandidat, discord, atau tipe..."
                className="w-full rounded-xl border border-gray-600 bg-[#111111] px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400 sm:w-[260px]"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />

              <button
                type="button"
                onClick={() => setIsLaunchModalOpen(true)}
                disabled={selectedCandidates.length === 0}
                className="rounded-xl bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)] px-4 py-2.5 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-[#3C2F00] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Buka Pelatihan
              </button>
            </div>
          </div>

          {candidatesLoading ? (
            <div className="mt-4 rounded-sm border border-dashed border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-400">
              Memuat data kandidat dari database...
            </div>
          ) : null}

          {candidatesError ? (
            <div className="mt-4 rounded-sm border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {candidatesError}
            </div>
          ) : null}

          {launchError ? (
            <div className="mt-4 rounded-sm border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {launchError}
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <div className="min-w-[920px]">
              <div className="mb-3 grid grid-cols-[1.3fr_1.1fr_0.5fr_0.75fr_0.7fr] gap-4 px-4 text-[10px] uppercase tracking-[0.18em] text-stone-500">
                <div>Identitas</div>
                <div>Kategori</div>
                <div className="text-center">Usia</div>
                <div className="text-center">Gender</div>
                <div className="text-right">Aksi</div>
              </div>

              <div className="flex flex-col gap-2">
                {pagedCandidates.length > 0 ? (
                  pagedCandidates.map((candidate) => (
                    <SelectableCandidateRow
                      key={candidate.identity}
                      candidate={candidate}
                      selected={selectedIdentitySet.has(candidate.identity)}
                      onToggle={() => handleToggleCandidate(candidate.identity)}
                    />
                  ))
                ) : (
                  <div className="rounded-sm border border-dashed border-white/10 bg-black/20 px-4 py-8 text-center text-sm text-stone-400">
                    Tidak ada kandidat sipil atau PMC yang siap untuk pelatihan saat ini.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-white/6 pt-4 text-sm text-gray-400 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              <span>
                {filteredCandidates.length} kandidat tampil pada tabel aktif.
              </span>
              <span className="font-public text-[10px] uppercase tracking-[0.16em] text-stone-500">
                Menampilkan maksimal {DASHBOARD_CANDIDATE_PAGE_SIZE} kandidat per halaman.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCandidatePage((currentPage) => Math.max(1, currentPage - 1))}
                disabled={candidatePage === 1}
                className="rounded-xl border border-white/8 bg-black/20 px-3 py-2 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Prev
              </button>
              <div className="rounded-xl border border-white/8 bg-black/20 px-3 py-2 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-stone-300">
                Page {candidatePage} / {candidatePageCount}
              </div>
              <button
                type="button"
                onClick={() =>
                  setCandidatePage((currentPage) =>
                    Math.min(candidatePageCount, currentPage + 1),
                  )
                }
                disabled={candidatePage === candidatePageCount}
                className="rounded-xl border border-white/8 bg-black/20 px-3 py-2 font-public text-[10px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1C1B1B]/90 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">
                Active Session Registry
              </p>
              <h2 className="mt-2 text-lg font-bold text-white">
                Sesi Aktif
              </h2>
            </div>

            <div className="font-public text-[10px] uppercase tracking-[0.16em] text-stone-500">
              {activeTrainingSessions.length} sesi dapat dibuka kembali
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {activeTrainingSessions.length > 0 ? (
              activeTrainingSessions.map((session) => (
                <ActiveTrainingSessionCard key={session.id} session={session} />
              ))
            ) : (
              <div className="rounded-sm border border-dashed border-white/10 bg-black/20 px-4 py-8 text-center text-sm text-stone-400 xl:col-span-2">
                Belum ada sesi aktif. Setelah kamu membuka pelatihan, sesi akan muncul di sini.
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isLaunchModalOpen ? (
          <TrainingLaunchModal
            selectedCount={selectedCandidates.length}
            selectedCandidates={selectedCandidates}
            submitting={launching}
            onClose={() => setIsLaunchModalOpen(false)}
            onSubmit={handleOpenTraining}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
