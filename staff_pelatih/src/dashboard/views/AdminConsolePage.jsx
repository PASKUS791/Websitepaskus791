/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Admin / Control Console
 * Purpose: Panel admin untuk monitoring sistem, konfigurasi aman, dan manajemen akun pelatih.
 */

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../lib/auth";
import {
  deleteStaffOperatorAccount,
  fetchAdminOverview,
  fetchSharedStaffOperators,
  registerStaffOperatorAccount,
  updateSharedStaffOperatorMetadata,
} from "../../lib/staffApi";

const INITIAL_OPERATOR_FORM = {
  username: "",
  label: "",
  unit: "PASKUS 791",
  discordUserId: "",
  password: "",
};

const SECURITY_MATRIX = [
  {
    attack: "Brute force login",
    status: "Ditahan aplikasi",
    layer: "Rate limit, lockout, session rotation, scrypt hashing, pepper.",
    edge: "CDN/WAF tetap dibutuhkan untuk volumetric burst dan IP reputation global.",
  },
  {
    attack: "Cross-origin probing / CSRF-like write",
    status: "Ditahan aplikasi",
    layer: "Validasi Origin/Referer, SameSite=Strict, cookie HttpOnly.",
    edge: "WAF/edge tetap membantu untuk bot filtering dan geo throttling.",
  },
  {
    attack: "NoSQL injection",
    status: "Ditahan parsial",
    layer: "Validasi schema input, whitelist field, query Mongo eksplisit, tanpa raw operator dari user.",
    edge: "WAF tidak menggantikan validasi aplikasi; sanitasi tetap wajib di server.",
  },
  {
    attack: "XSS / script injection",
    status: "Ditahan aplikasi",
    layer: "React escaping default, CSP, validasi payload dan blok signature injeksi.",
    edge: "CDN/WAF membantu memblok payload umum sebelum sampai origin.",
  },
  {
    attack: "Request flood / DDoS ringan",
    status: "Ditahan parsial",
    layer: "Rate limit backend aplikasi sudah ada.",
    edge: "Butuh CDN/WAF/edge untuk volumetric DDoS, challenge bot, dan cache shield.",
  },
  {
    attack: "Session hijack",
    status: "Ditahan aplikasi",
    layer: "Cookie signed, HttpOnly, SameSite, TTL terbatas, user-agent binding.",
    edge: "TLS termination aman dan HSTS tetap wajib di reverse proxy/CDN.",
  },
];

const OFFICIAL_REFERENCES = [
  {
    label: "OWASP API Security Top 10 2023",
    href: "https://owasp.org/API-Security/editions/2023/en/0x11-t10/",
  },
  {
    label: "Express Security Best Practices",
    href: "https://expressjs.com/en/advanced/best-practice-security.html",
  },
  {
    label: "CISA Secure by Design",
    href: "https://www.cisa.gov/securebydesign",
  },
  {
    label: "CISA / FBI / NSA Advisory AA24-290A",
    href: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-290a",
  },
  {
    label: "ERC-191",
    href: "https://eips.ethereum.org/EIPS/eip-191",
  },
  {
    label: "ERC-4361",
    href: "https://eips.ethereum.org/EIPS/eip-4361",
  },
  {
    label: "Trust Wallet Developer Docs",
    href: "https://developer.trustwallet.com/",
  },
  {
    label: "Trust Wallet WalletConnect Docs",
    href: "https://developer.trustwallet.com/developer/wallet-connect",
  },
];

function AdminMetricCard({ label, value, detail, accent = "emerald" }) {
  const accentClass = {
    emerald: "border-emerald-400/25 text-emerald-200",
    amber: "border-amber-300/25 text-amber-200",
    stone: "border-white/10 text-stone-200",
    rose: "border-rose-400/25 text-rose-200",
  };

  return (
    <article className="rounded-2xl border border-white/8 bg-[#151515] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
      <p
        className={`inline-flex rounded-full border px-3 py-1 font-public text-[9px] font-bold uppercase tracking-[0.18em] ${accentClass[accent] ?? accentClass.stone}`}
      >
        {label}
      </p>
      <p className="mt-4 font-sans text-[2rem] font-bold text-stone-100">{value}</p>
      <p className="mt-2 text-sm leading-6 text-stone-400">{detail}</p>
    </article>
  );
}

function OperatorRegistryCard({
  operator,
  deleting = false,
  onSaveDiscordId,
  onDelete,
}) {
  const [discordUserId, setDiscordUserId] = useState(operator.discordUserId || "");

  return (
    <article className="rounded-2xl border border-white/8 bg-[#171717] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-sans text-lg font-bold text-stone-100">{operator.label}</p>
          <p className="mt-1 text-sm text-stone-400">@{operator.username}</p>
        </div>
        <span className="rounded-full border border-white/8 bg-black/20 px-3 py-1 font-public text-[9px] uppercase tracking-[0.14em] text-stone-300">
          {operator.unit}
        </span>
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
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSaveDiscordId(operator.username, discordUserId)}
            className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-amber-200 transition hover:bg-amber-300/15"
          >
            Simpan Discord ID
          </button>
          <button
            type="button"
            onClick={() => onDelete(operator.username, operator.label)}
            disabled={deleting}
            className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-rose-200 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function AdminConsolePage() {
  const { logout, user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [operators, setOperators] = useState([]);
  const [operatorForm, setOperatorForm] = useState(INITIAL_OPERATOR_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deletingUsername, setDeletingUsername] = useState("");

  const reload = async () => {
    setLoading(true);

    try {
      const [nextOverview, nextOperators] = await Promise.all([
        fetchAdminOverview(),
        fetchSharedStaffOperators(),
      ]);
      setOverview(nextOverview);
      setOperators(nextOperators);
      setError("");
    } catch (loadError) {
      setError(loadError.message || "Gagal memuat admin console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload().catch(() => undefined);
  }, []);

  const metrics = useMemo(() => {
    const counts = overview?.counts || {};
    const environment = overview?.environment || {};

    return [
      {
        label: "Pelatih Aktif",
        value: counts.pelatihUsers ?? 0,
        detail: "Akun pelatih yang sudah tersimpan di Mongo dan bisa dipantau admin.",
        accent: "emerald",
      },
      {
        label: "Admin Aktif",
        value: counts.adminUsers ?? 0,
        detail: "Akun admin internal yang memegang kontrol panel sistem.",
        accent: "amber",
      },
      {
        label: "Sesi Internal",
        value: counts.activeSessions ?? 0,
        detail: "Session cookie internal yang masih aktif di backend.",
        accent: "stone",
      },
      {
        label: "Webhook",
        value: environment.webhookConfigured ? "ON" : "OFF",
        detail: "Status konfigurasi dispatch Discord pada server internal.",
        accent: environment.webhookConfigured ? "emerald" : "rose",
      },
    ];
  }, [overview]);

  const handleChangeForm = (field) => (event) => {
    setOperatorForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleCreateOperator = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      const nextOperators = await registerStaffOperatorAccount(operatorForm);
      setOperators(nextOperators);
      setOperatorForm(INITIAL_OPERATOR_FORM);
      setNotice("Akun pelatih baru berhasil dibuat dan disinkron ke registry bersama.");
      setError("");
      const nextOverview = await fetchAdminOverview();
      setOverview(nextOverview);
    } catch (submitError) {
      setError(submitError.message || "Gagal membuat akun pelatih.");
      setNotice("");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDiscordId = async (username, discordUserId) => {
    try {
      const nextOperators = await updateSharedStaffOperatorMetadata({
        username,
        discordUserId,
      });
      setOperators(nextOperators);
      setNotice("Discord User ID petugas berhasil diperbarui di server.");
      setError("");
    } catch (saveError) {
      setError(saveError.message || "Gagal menyimpan Discord User ID.");
      setNotice("");
    }
  };

  const handleDeleteOperator = async (username, label) => {
    const confirmed = window.confirm(`Hapus akun ${label} (@${username}) dari registry pelatih?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeletingUsername(username);
      const nextOperators = await deleteStaffOperatorAccount(username);
      setOperators(nextOperators);
      setNotice(`${label} berhasil dihapus dari registry pelatih.`);
      setError("");
      const nextOverview = await fetchAdminOverview();
      setOverview(nextOverview);
    } catch (deleteError) {
      setError(deleteError.message || "Gagal menghapus akun pelatih.");
      setNotice("");
    } finally {
      setDeletingUsername("");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(181,159,78,0.12),transparent_30%),linear-gradient(180deg,#090909_0%,#121212_100%)] text-stone-100">
      <div className="mx-auto max-w-[1480px] space-y-6 px-4 py-6 md:px-6">
        <section className="rounded-[28px] border border-white/8 bg-[#121212]/95 p-6 shadow-[0_32px_100px_rgba(0,0,0,0.34)]">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="font-public text-[10px] uppercase tracking-[0.3em] text-amber-300">
                Admin Control
              </p>
              <h1 className="mt-3 font-sans text-4xl font-bold uppercase text-stone-100 md:text-[3.2rem]">
                PASKUS SYSTEM CONSOLE
              </h1>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-stone-400">
                Panel untuk memantau status backend, konfigurasi deploy, registry pelatih,
                dan batas ketahanan keamanan aplikasi. Fokus utama console ini adalah
                visibilitas operasional dan sinkronisasi Mongo shared state.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-white/8 bg-black/25 px-4 py-3">
                <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                  Logged As
                </p>
                <p className="mt-2 font-sans text-lg font-bold text-stone-100">
                  {user?.label || "Admin"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => logout()}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-public text-[9px] font-bold uppercase tracking-[0.18em] text-stone-200 transition hover:bg-white/10"
              >
                Logout Admin
              </button>
            </div>
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          {notice ? (
            <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
              {notice}
            </div>
          ) : null}
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <AdminMetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              detail={metric.detail}
              accent={metric.accent}
            />
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[28px] border border-white/8 bg-[#141414] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-public text-[10px] uppercase tracking-[0.28em] text-amber-300">
                  Deployment Overview
                </p>
                <h2 className="mt-2 font-sans text-2xl font-bold uppercase text-stone-100">
                  Konfigurasi dan Pemantauan
                </h2>
              </div>
              <button
                type="button"
                onClick={() => reload()}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] text-stone-200 transition hover:bg-white/10"
              >
                Refresh
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                  Mode
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-200">
                  {overview?.environment?.production ? "Production" : "Development / Beta"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                  Database
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-200">
                  {overview?.environment?.database || "-"} / {overview?.environment?.databaseName || "-"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                  External Staff Backend
                </p>
                <p className="mt-2 break-all text-sm leading-6 text-stone-200">
                  {overview?.environment?.externalStaffBackend || "-"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                  Allowed Origins
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-200">
                  {(overview?.environment?.allowedOrigins || []).join(", ") || "-"}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-amber-300/16 bg-amber-300/[0.05] p-4">
              <p className="font-public text-[9px] uppercase tracking-[0.18em] text-amber-200">
                Catatan Ketahanan
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-300">
                Aplikasi ini sudah menahan banyak serangan di layer origin, tetapi tetap belum
                menggantikan peran CDN/WAF/edge. Layer aplikasi bagus untuk validasi, auth,
                rate limit, dan kontrol session; layer edge tetap dibutuhkan untuk volumetric
                DDoS, bot reputation, caching shield, dan filtering global.
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-sky-400/16 bg-sky-400/[0.05] p-4">
              <p className="font-public text-[9px] uppercase tracking-[0.18em] text-sky-200">
                Catatan MongoDB
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-300">
                Backend ini memakai MongoDB. Jadi ancaman injection yang relevan untuk tim adalah
                NoSQL injection, bukan literal MySQL injection. Fokus mitigasi harus pada
                whitelist field, validasi tipe, sanitasi operator query, dan jangan pernah
                meneruskan objek query mentah dari input user ke Mongo driver.
              </p>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/8 bg-[#141414] p-5">
            <p className="font-public text-[10px] uppercase tracking-[0.28em] text-amber-300">
              Security Matrix
            </p>
            <h2 className="mt-2 font-sans text-2xl font-bold uppercase text-stone-100">
              Matriks Ketahanan Sistem
            </h2>

            <div className="mt-5 space-y-3">
              {SECURITY_MATRIX.map((entry) => (
                <article key={entry.attack} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-500">
                        Attack Surface
                      </p>
                      <p className="mt-2 font-sans text-lg font-bold text-stone-100">
                        {entry.attack}
                      </p>
                    </div>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-public text-[9px] uppercase tracking-[0.16em] text-emerald-200">
                      {entry.status}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-stone-300">
                    <span className="font-public text-[10px] uppercase tracking-[0.16em] text-stone-500">
                      Layer aplikasi:
                    </span>{" "}
                    {entry.layer}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-stone-300">
                    <span className="font-public text-[10px] uppercase tracking-[0.16em] text-stone-500">
                      Masih butuh edge:
                    </span>{" "}
                    {entry.edge}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-[28px] border border-white/8 bg-[#141414] p-5">
            <p className="font-public text-[10px] uppercase tracking-[0.28em] text-amber-300">
              Account Provisioning
            </p>
            <h2 className="mt-2 font-sans text-2xl font-bold uppercase text-stone-100">
              Buat Akun Pelatih
            </h2>

            <form className="mt-5 space-y-4" onSubmit={handleCreateOperator}>
              <label className="grid gap-2">
                <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                  Username
                </span>
                <input
                  value={operatorForm.username}
                  onChange={handleChangeForm("username")}
                  className="rounded-xl border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
                />
              </label>
              <label className="grid gap-2">
                <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                  Nama Petugas
                </span>
                <input
                  value={operatorForm.label}
                  onChange={handleChangeForm("label")}
                  className="rounded-xl border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
                />
              </label>
              <label className="grid gap-2">
                <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                  Unit
                </span>
                <input
                  value={operatorForm.unit}
                  onChange={handleChangeForm("unit")}
                  className="rounded-xl border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
                />
              </label>
              <label className="grid gap-2">
                <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                  Discord User ID
                </span>
                <input
                  value={operatorForm.discordUserId}
                  onChange={(event) =>
                    setOperatorForm((current) => ({
                      ...current,
                      discordUserId: event.target.value.replace(/\D/g, ""),
                    }))
                  }
                  className="rounded-xl border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
                />
              </label>
              <label className="grid gap-2">
                <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                  Password
                </span>
                <input
                  type="password"
                  value={operatorForm.password}
                  onChange={handleChangeForm("password")}
                  className="rounded-xl border border-white/8 bg-black/20 px-3 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
                />
              </label>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)] px-4 py-3 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-[#3C2F00] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Buat Akun Pelatih"}
              </button>
            </form>

            <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 p-4">
              <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                Trust Wallet Note
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-300">
                Recovery phrase tidak boleh ditanam ke frontend, backend, atau dokumen deploy.
                Jika nanti admin login ingin ditambah wallet hardening, implementasinya harus
                lewat challenge + signature resmi seperti ERC-191 / ERC-4361, bukan dengan
                menyimpan frasa wallet.
              </p>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/8 bg-[#141414] p-5">
            <p className="font-public text-[10px] uppercase tracking-[0.28em] text-amber-300">
              Pelatih Registry
            </p>
            <h2 className="mt-2 font-sans text-2xl font-bold uppercase text-stone-100">
              Akun Pelatih Tersinkron
            </h2>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {loading ? (
                <div className="rounded-2xl border border-dashed border-white/8 bg-black/20 px-4 py-8 text-center text-sm text-stone-400 md:col-span-2">
                  Memuat registry akun...
                </div>
              ) : operators.length > 0 ? (
                operators.map((operator) => (
                  <OperatorRegistryCard
                    key={`${operator.id}-${operator.username}-${operator.discordUserId || "none"}`}
                    operator={operator}
                    deleting={deletingUsername === operator.username}
                    onSaveDiscordId={handleSaveDiscordId}
                    onDelete={handleDeleteOperator}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/8 bg-black/20 px-4 py-8 text-center text-sm text-stone-400 md:col-span-2">
                  Belum ada akun pelatih yang tersimpan.
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="rounded-[28px] border border-white/8 bg-[#141414] p-5">
          <p className="font-public text-[10px] uppercase tracking-[0.28em] text-amber-300">
            Official References
          </p>
          <h2 className="mt-2 font-sans text-2xl font-bold uppercase text-stone-100">
            Dokumen Inspirasi Resmi
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {OFFICIAL_REFERENCES.map((reference) => (
              <a
                key={reference.href}
                href={reference.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/8 bg-black/20 p-4 transition hover:border-amber-300/20 hover:bg-black/30"
              >
                <p className="font-sans text-base font-bold text-stone-100">{reference.label}</p>
                <p className="mt-3 break-all text-sm leading-6 text-stone-400">{reference.href}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
