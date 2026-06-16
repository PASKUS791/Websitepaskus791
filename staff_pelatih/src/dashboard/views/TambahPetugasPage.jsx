/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / Tambah Petugas
 * Purpose: Manajemen petugas pelatihan yang tersimpan di database.
 */

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../lib/auth";
import mbahDeleteOverlayImage from "../../assets/images/mbah-error-overlay.jpg";
import { useStaffPortalData } from "../hooks/useStaffPortalData";

const INITIAL_FORM_STATE = {
  username: "",
  label: "",
  unit: "PASKUS 791",
  discordUserId: "",
  password: "",
};

function OperatorCard({
  operator,
  isCurrentUser = false,
  deleting = false,
  onSaveDiscordUserId,
  onDeleteOperator,
}) {
  const [discordUserId, setDiscordUserId] = useState(operator.discordUserId || "");
  const [savingDiscordId, setSavingDiscordId] = useState(false);
  const [discordNotice, setDiscordNotice] = useState("");
  const [discordError, setDiscordError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const handleSaveDiscordUserId = async () => {
    try {
      setSavingDiscordId(true);
      setDeleteError("");
      await onSaveDiscordUserId(operator.username, discordUserId);
      setDiscordNotice("Discord ID tersimpan.");
      setDiscordError("");
    } catch (saveError) {
      setDiscordError(saveError.message || "Gagal menyimpan Discord ID.");
      setDiscordNotice("");
    } finally {
      setSavingDiscordId(false);
    }
  };

  const handleDeleteOperator = async () => {
    const confirmed = window.confirm(
      `Hapus petugas ${operator.label} (@${operator.username}) dari database?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteError("");
      setDiscordError("");
      setDiscordNotice("");
      await onDeleteOperator(operator);
    } catch (removeError) {
      setDeleteError(removeError.message || "Gagal menghapus petugas.");
    }
  };

  return (
    <article className="rounded-2xl border border-white/8 bg-[#171717] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-sans text-lg font-bold text-stone-100">{operator.label}</p>
          <p className="mt-1 text-sm text-stone-400">@{operator.username}</p>
        </div>

        {isCurrentUser ? (
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-public text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-300">
            Admin Aktif
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        <p className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-500">
          Unit
        </p>
        <p className="mt-1 text-sm text-stone-300">{operator.unit}</p>
      </div>

      <div className="mt-4 grid gap-2">
        <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-500">
          Discord User ID
        </span>
        <input
          value={discordUserId}
          onChange={(event) => setDiscordUserId(event.target.value.replace(/\D/g, ""))}
          placeholder="contoh: 123456789012345678"
          className="rounded-xl border border-white/8 bg-black/20 px-3 py-2.5 text-sm text-stone-100 outline-none transition focus:border-amber-300"
        />
        <button
          type="button"
          onClick={handleSaveDiscordUserId}
          disabled={savingDiscordId || deleting}
          className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-amber-200 transition hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {savingDiscordId ? "Menyimpan..." : "Simpan Discord ID"}
        </button>
        <button
          type="button"
          onClick={handleDeleteOperator}
          disabled={isCurrentUser || deleting || savingDiscordId}
          className="rounded-xl border border-rose-500/22 bg-rose-500/10 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-rose-200 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {deleting
            ? "Menghapus Petugas..."
            : isCurrentUser
              ? "Akun Aktif"
              : "Hapus Petugas"}
        </button>
        {discordError ? (
          <p className="font-public text-[9px] uppercase tracking-[0.14em] text-rose-300">
            {discordError}
          </p>
        ) : null}
        {deleteError ? (
          <p className="font-public text-[9px] uppercase tracking-[0.14em] text-rose-300">
            {deleteError}
          </p>
        ) : null}
        {discordNotice ? (
          <p className="font-public text-[9px] uppercase tracking-[0.14em] text-emerald-300">
            {discordNotice}
          </p>
        ) : null}
        {!deleteError && isCurrentUser ? (
          <p className="font-public text-[9px] uppercase tracking-[0.14em] text-stone-500">
            Akun yang sedang dipakai login tidak bisa dihapus.
          </p>
        ) : null}
      </div>
    </article>
  );
}

function DeleteOperatorOverlay({ operator }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[990] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-[#090909] shadow-[0_40px_120px_rgba(0,0,0,0.62)] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative min-h-[320px] overflow-hidden bg-black">
          <img
            src={mbahDeleteOverlayImage}
            alt="Overlay hapus petugas"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.62)_100%)]" />
        </div>

        <div className="flex flex-col justify-between gap-6 p-5 md:p-8">
          <div>
            <p className="font-public text-[10px] uppercase tracking-[0.32em] text-amber-300">
              Operator Removal Channel
            </p>
            <h2 className="mt-3 font-sans text-3xl font-bold uppercase text-stone-100 md:text-[2.4rem]">
              Hapus Anggota
            </h2>

            <div className="mt-6 rounded-2xl border border-amber-300/18 bg-amber-300/8 p-4">
              <p className="font-sans text-lg font-semibold leading-7 text-amber-100">
                Iya bentar mas ini tak hapus dulu anggota nya
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <p className="font-public text-[10px] uppercase tracking-[0.22em] text-stone-400">
                Petugas Yang Diproses
              </p>
              <p className="mt-3 font-sans text-xl font-bold text-stone-100">
                {operator?.label || "Petugas"}
              </p>
              <p className="mt-1 text-sm text-stone-400">
                @{operator?.username || "operator"}
              </p>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
                <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                  Status
                </p>
                <p className="mt-2 font-public text-sm font-bold uppercase text-stone-100">
                  Sinkronisasi Hapus
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
                <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                  Proses
                </p>
                <p className="mt-2 font-public text-sm font-bold uppercase text-stone-100">
                  Menghapus dari registry
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-[#050505] p-4">
            <p className="font-public text-[10px] uppercase tracking-[0.22em] text-stone-400">
              Progress
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)]" />
            </div>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              Daftar petugas sedang diperbarui. Mohon tunggu sebentar sampai proses hapus selesai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TambahPetugasPage() {
  const { user } = useAuth();
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [deletingOperator, setDeletingOperator] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const {
    operators,
    loading,
    error: portalError,
    deleteOperator,
    deleteAllOperators,
    registerOperator,
    updateOperatorMetadata,
  } = useStaffPortalData();

  const operatorCountLabel = useMemo(() => `${operators.length} petugas aktif`, [operators]);
  const otherOperators = useMemo(
    () => operators.filter((op) => op.username !== user?.username),
    [operators, user],
  );

  const handleChange = (field) => (event) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      await registerOperator(formState);
      setFormState(INITIAL_FORM_STATE);
      setNotice("Petugas berhasil ditambahkan.");
      setError("");
    } catch (submitError) {
      setError(submitError.message || "Gagal menambahkan petugas.");
      setNotice("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOperator = async (operator) => {
    try {
      setDeletingOperator(operator);
      await deleteOperator({ username: operator.username });
      setNotice(`${operator.label} berhasil dihapus dari database petugas.`);
      setError("");
    } catch (deleteError) {
      setError(deleteError.message || "Gagal menghapus petugas.");
      setNotice("");
      throw deleteError;
    } finally {
      setDeletingOperator(null);
    }
  };

  const handleDeleteAllOperators = async () => {
    const confirmed = window.confirm(
      `Hapus SEMUA ${otherOperators.length} petugas lain dari database? Akun Anda sendiri tidak akan terhapus. Tindakan ini tidak bisa dibatalkan.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingAll(true);
      setError("");
      setNotice("Sedang menghapus semua petugas...");
      const result = await deleteAllOperators();
      setNotice(result?.message || "Semua petugas lain berhasil dihapus.");
    } catch (err) {
      setError(err?.message || "Gagal menghapus semua petugas.");
      setNotice("");
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/8 bg-[#151515] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="font-public text-[10px] uppercase tracking-[0.3em] text-amber-300">
              Operator Registry
            </p>
            <h1 className="mt-3 font-sans text-4xl font-bold uppercase text-stone-100">
              Tambah Petugas
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-400">
              Tambahkan petugas baru ke database pelatih. Petugas yang dibuat di sini
              akan langsung tersedia di modal `Buka Pelatihan`.
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
            <p className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-500">
              Status Registry
            </p>
            <p className="mt-2 font-sans text-2xl font-bold text-stone-100">
              {operatorCountLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-2xl border border-white/8 bg-[#171717] p-5">
          <div>
            <p className="font-public text-[10px] uppercase tracking-[0.3em] text-amber-300">
              Form Input
            </p>
            <h2 className="mt-2 font-sans text-2xl font-bold text-stone-100">
              Data Petugas Baru
            </h2>
          </div>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Username
              </span>
              <input
                value={formState.username}
                onChange={handleChange("username")}
                placeholder="contoh: petugas.alpha"
                className="rounded-xl border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Nama Petugas
              </span>
              <input
                value={formState.label}
                onChange={handleChange("label")}
                placeholder="Nama petugas"
                className="rounded-xl border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Unit
              </span>
              <input
                value={formState.unit}
                onChange={handleChange("unit")}
                placeholder="PASKUS 791"
                className="rounded-xl border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Discord User ID
              </span>
              <input
                value={formState.discordUserId}
                onChange={handleChange("discordUserId")}
                placeholder="contoh: 123456789012345678"
                className="rounded-xl border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Password
              </span>
              <input
                type="password"
                value={formState.password}
                onChange={handleChange("password")}
                placeholder="Minimal 8 karakter"
                className="rounded-xl border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
              />
            </label>

            {error ? (
              <p className="font-public text-[10px] uppercase tracking-[0.16em] text-rose-300">
                {error}
              </p>
            ) : null}

            {notice ? (
              <p className="font-public text-[10px] uppercase tracking-[0.16em] text-emerald-300">
                {notice}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)] px-4 py-3 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-[#3C2F00] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Menyimpan..." : "Simpan Petugas"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-white/8 bg-[#171717] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-public text-[10px] uppercase tracking-[0.3em] text-amber-300">
                Database Petugas
              </p>
              <h2 className="mt-2 font-sans text-2xl font-bold text-stone-100">
                Petugas Aktif
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-white/8 bg-black/20 px-3 py-1 font-public text-[10px] uppercase tracking-[0.16em] text-stone-300">
                {operatorCountLabel}
              </span>
              {otherOperators.length > 0 ? (
                <button
                  type="button"
                  onClick={handleDeleteAllOperators}
                  disabled={deletingAll || !!deletingOperator}
                  className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingAll ? "Menghapus Semua..." : "Hapus Semua Petugas"}
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {loading ? (
              <div className="rounded-xl border border-dashed border-white/8 bg-black/20 px-4 py-8 text-center text-sm text-stone-400 md:col-span-2">
                Memuat daftar petugas...
              </div>
            ) : operators.length > 0 ? (
              operators.map((operator) => (
                <OperatorCard
                  key={`${operator.id}-${operator.username}`}
                  operator={operator}
                  deleting={deletingOperator?.username === operator.username}
                  isCurrentUser={operator.username === user?.username}
                  onDeleteOperator={handleDeleteOperator}
                  onSaveDiscordUserId={(username, discordUserId) =>
                    updateOperatorMetadata({ username, discordUserId })
                  }
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-white/8 bg-black/20 px-4 py-8 text-center text-sm text-stone-400 md:col-span-2">
                {portalError || "Belum ada petugas yang tersimpan."}
              </div>
            )}
          </div>
        </section>
      </div>

      {deletingOperator ? <DeleteOperatorOverlay operator={deletingOperator} /> : null}
    </div>
  );
}
