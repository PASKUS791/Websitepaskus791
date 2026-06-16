/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Admin / Login Page
 * Purpose: Portal login admin internal untuk monitoring dan kontrol sistem.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AuthSessionLoader from "../components/AuthSessionLoader";
import { useAuth } from "../lib/auth";
import { fetchWalletAuthConfig } from "../lib/staffApi";

function pickInjectedWalletProvider() {
  if (typeof window === "undefined") {
    return null;
  }

  const injectedProvider = window.ethereum;

  if (!injectedProvider) {
    return null;
  }

  if (Array.isArray(injectedProvider.providers) && injectedProvider.providers.length > 0) {
    return (
      injectedProvider.providers.find(
        (provider) => provider?.isTrust || provider?.isTrustWallet,
      ) || injectedProvider.providers[0]
    );
  }

  return injectedProvider;
}

function normalizeAddress(address) {
  return String(address || "").trim().toLowerCase();
}

function formatAddress(address) {
  const normalized = String(address || "").trim();

  if (normalized.length < 12) {
    return normalized;
  }

  return `${normalized.slice(0, 6)}...${normalized.slice(-4)}`;
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const providerRef = useRef(null);
  const { loading, loginWithWallet, user } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [walletConfig, setWalletConfig] = useState({
    enabled: false,
    providerMode: "injected",
    allowedAddresses: [],
    allowedAddressHints: [],
    allowedAddressCount: 0,
    siweDomain: "",
    siweUri: "",
  });
  const [walletAddress, setWalletAddress] = useState("");
  const [walletChainId, setWalletChainId] = useState(1);
  const [walletNotice, setWalletNotice] = useState("");

  useEffect(() => {
    fetchWalletAuthConfig("admin")
      .then((config) => setWalletConfig(config))
      .catch((configError) =>
        setError(configError.message || "Gagal memuat konfigurasi wallet auth."),
      );
  }, []);

  const isConnectedWalletAllowed = useMemo(() => {
    if (!walletAddress) {
      return null;
    }

    if (!Array.isArray(walletConfig.allowedAddresses) || walletConfig.allowedAddresses.length === 0) {
      return null;
    }

    const normalizedWalletAddress = normalizeAddress(walletAddress);
    return walletConfig.allowedAddresses.some(
      (address) => normalizeAddress(address) === normalizedWalletAddress,
    );
  }, [walletAddress, walletConfig.allowedAddresses]);

  const allowedWalletSummary =
    walletConfig.allowedAddressHints.length > 0
      ? walletConfig.allowedAddressHints.join(", ")
      : walletConfig.allowedAddressCount > 0
        ? `${walletConfig.allowedAddressCount} wallet admin terdaftar di server`
        : "belum dikonfigurasi";

  const handleConnectWallet = async () => {
    try {
      const provider = pickInjectedWalletProvider();

      if (!provider) {
        throw new Error(
          "Provider wallet tidak ditemukan. Pakai Trust Wallet extension atau buka halaman ini dari Trust Wallet dApp browser.",
        );
      }

      providerRef.current = provider;
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      const connectedAddress = Array.isArray(accounts) ? accounts[0] : "";
      const rawChainId = await provider.request({
        method: "eth_chainId",
      });
      const normalizedChainId =
        typeof rawChainId === "string" && rawChainId.startsWith("0x")
          ? Number.parseInt(rawChainId, 16)
          : Number.parseInt(rawChainId, 10) || 1;

      if (!connectedAddress) {
        throw new Error("Wallet tidak memberikan address aktif.");
      }

      setWalletAddress(connectedAddress);
      setWalletChainId(normalizedChainId);
      setWalletNotice(
        `Wallet ${formatAddress(connectedAddress)} terhubung pada chain ${normalizedChainId}.`,
      );
      setError("");
    } catch (connectError) {
      setError(connectError.message || "Gagal menghubungkan wallet.");
      setWalletNotice("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      if (!walletConfig.enabled) {
        throw new Error("Wallet auth admin belum aktif di server.");
      }

      if (!walletAddress) {
        throw new Error("Hubungkan wallet admin terlebih dahulu.");
      }

      if (isConnectedWalletAllowed === false) {
        throw new Error("Wallet yang terhubung tidak termasuk alamat admin yang diizinkan.");
      }

      const provider = providerRef.current || pickInjectedWalletProvider();

      if (!provider) {
        throw new Error("Provider wallet tidak tersedia untuk proses signature.");
      }

      providerRef.current = provider;
      await loginWithWallet({
        scope: "admin",
        username,
        password,
        address: walletAddress,
        chainId: walletChainId,
        signMessage: async (message) =>
          provider.request({
            method: "personal_sign",
            params: [message, walletAddress],
          }),
      });
      navigate("/admin", { replace: true });
    } catch (loginError) {
      setError(loginError.message || "Login admin gagal.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AuthSessionLoader
        eyebrow="Admin Session"
        title="Memeriksa kontrol admin..."
        message="Sesi internal dan konfigurasi wallet admin sedang divalidasi sebelum halaman login dibuka."
      />
    );
  }

  if (user?.scope === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(179,155,76,0.16),transparent_32%),linear-gradient(180deg,#050505_0%,#111111_100%)] px-4 text-stone-100">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[30px] border border-white/8 bg-[#101010]/95 shadow-[0_40px_120px_rgba(0,0,0,0.4)] xl:grid-cols-[0.92fr_1.08fr]">
        <section className="border-b border-white/8 bg-[linear-gradient(180deg,rgba(233,195,73,0.12)_0%,rgba(20,20,20,0.2)_100%)] p-6 xl:border-b-0 xl:border-r xl:p-10">
          <p className="font-public text-[10px] uppercase tracking-[0.34em] text-amber-300">
            Admin Security Gate
          </p>
          <h1 className="mt-4 font-sans text-4xl font-bold uppercase text-stone-100">
            PASKUS CONTROL LOGIN
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-stone-300">
            Akses ini dipakai untuk monitoring sistem, konfigurasi deploy, dan registry akun
            pelatih. Jalur admin memakai backend internal dengan session cookie tersign dan
            kontrol keamanan terpusat plus wallet signature challenge berbasis standar Ethereum.
          </p>

          <div className="mt-8 space-y-3">
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
              <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                Ditahan aplikasi
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-300">
                Rate limit, brute-force lockout, validasi origin/referer, signed session cookie,
                dan hardening header keamanan.
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
              <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                Butuh edge
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-300">
                Untuk volumetric DDoS, bot reputation, dan challenge global, origin tetap perlu
                dibantu CDN / WAF / edge firewall.
              </p>
            </div>
            <div className="rounded-2xl border border-sky-400/16 bg-sky-400/[0.05] p-4">
              <p className="font-public text-[9px] uppercase tracking-[0.18em] text-sky-200">
                Trust Wallet Note
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-300">
                Recovery phrase tidak boleh dipakai untuk login. Jika wallet hardening ditambah,
                alurnya harus lewat signature challenge resmi, bukan frasa wallet.
              </p>
            </div>
          </div>
        </section>

        <section className="p-6 xl:p-10">
          <p className="font-public text-[10px] uppercase tracking-[0.28em] text-stone-500">
            Internal Authentication
          </p>
          <h2 className="mt-3 font-sans text-3xl font-bold uppercase text-stone-100">
            Login Admin
          </h2>

          <div className="mt-6 rounded-2xl border border-amber-300/16 bg-amber-300/[0.05] p-4">
            <p className="font-public text-[9px] uppercase tracking-[0.18em] text-amber-200">
              Wallet Guard
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              Login admin sekarang mewajibkan signature challenge dari wallet yang diizinkan
              server. Ini mengikuti model `connect wallet`, lalu sign message, lalu verify ke
              server,
              bukan seed phrase.
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              Hint wallet admin yang terdaftar: {allowedWalletSummary}
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              SIWE Domain: {walletConfig.siweDomain || "-"}
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-400">
              Server tetap memverifikasi allowlist wallet walau UI hanya menampilkan hint alamat.
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-white/8 bg-black/25 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                  Connected Wallet
                </p>
                <p className="mt-2 font-sans text-lg font-bold text-stone-100">
                  {walletAddress ? formatAddress(walletAddress) : "Belum terhubung"}
                </p>
                <p className="mt-1 text-sm text-stone-400">
                  {walletAddress
                    ? `Chain ID ${walletChainId}`
                    : "Gunakan Trust Wallet extension atau Trust Wallet dApp browser."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleConnectWallet}
                className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 font-public text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-200 transition hover:bg-emerald-400/15"
              >
                {walletAddress ? "Reconnect Wallet" : "Connect Wallet"}
              </button>
            </div>

            {walletNotice ? (
              <p className="mt-3 text-sm text-emerald-200">{walletNotice}</p>
            ) : null}

            {walletAddress && isConnectedWalletAllowed === false ? (
              <p className="mt-3 text-sm text-rose-200">
                Wallet yang terhubung tidak cocok dengan address admin yang diizinkan server.
              </p>
            ) : null}
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Username
              </span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="rounded-2xl border border-white/8 bg-black/25 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-400">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-2xl border border-white/8 bg-black/25 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300"
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-[linear-gradient(90deg,#E9C349_0%,#BE9B23_100%)] px-4 py-3 font-public text-[10px] font-bold uppercase tracking-[0.18em] text-[#3C2F00] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Verifying Wallet..." : "Sign Challenge dan Masuk"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
