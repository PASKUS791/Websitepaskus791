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

import { useMemo, useState } from "react";
import { useAuth } from "../../lib/auth";
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
  onSaveDiscordUserId,
}) {
  const [discordUserId, setDiscordUserId] = useState(operator.discordUserId || "");
  const [savingDiscordId, setSavingDiscordId] = useState(false);
  const [discordNotice, setDiscordNotice] = useState("");
  const [discordError, setDiscordError] = useState("");

  const handleSaveDiscordUserId = async () => {
    try {
      setSavingDiscordId(true);
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
          disabled={savingDiscordId}
          className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-amber-200 transition hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {savingDiscordId ? "Menyimpan..." : "Simpan Discord ID"}
        </button>
        {discordError ? (
          <p className="font-public text-[9px] uppercase tracking-[0.14em] text-rose-300">
            {discordError}
          </p>
        ) : null}
        {discordNotice ? (
          <p className="font-public text-[9px] uppercase tracking-[0.14em] text-emerald-300">
            {discordNotice}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export default function TambahPetugasPage() {
  const { user } = useAuth();
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const {
    operators,
    loading,
    error: portalError,
    registerOperator,
    updateOperatorMetadata,
  } = useStaffPortalData();

  const operatorCountLabel = useMemo(() => `${operators.length} petugas aktif`, [operators]);

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
            <span className="rounded-full border border-white/8 bg-black/20 px-3 py-1 font-public text-[10px] uppercase tracking-[0.16em] text-stone-300">
              {operatorCountLabel}
            </span>
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
                  isCurrentUser={operator.username === user?.username}
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
    </div>
  );
}
