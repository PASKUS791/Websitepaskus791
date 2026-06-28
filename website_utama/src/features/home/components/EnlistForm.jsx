import React, { useState, useEffect, useRef } from "react";
import { useDiscordAuth } from "../../../hooks/useDiscordAuth";
import { useLocationConsent } from "../../../hooks/useLocationConsent";
import { LocationModal } from "./LocationModal";
import { Modal } from "../../../components/ui/Modal";

const EnlistForm = () => {
  const discordAuth = useDiscordAuth();
  const locationConsent = useLocationConsent();

  const usernameRef = useRef(null);
  const discordRef = useRef(null);
  const genderRef = useRef(null);
  const ageRef = useRef(null);
  const joinedRef = useRef(null);
  const resimenRef = useRef(null);
  const statusRef = useRef(null);
  const deviceRef = useRef(null);
  const golonganRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitLabel, setSubmitLabel] = useState("SUBMIT ENLISTMENT");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("NOTIFICATION");
  const [modalMessage, setModalMessage] = useState("");
  const [showJoinDiscord, setShowJoinDiscord] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // Restore form inputs from sessionStorage on mount & OAuth redirect back
  useEffect(() => {
    if (usernameRef.current) usernameRef.current.value = sessionStorage.getItem("paskus_enlist_roblox_username") || "";
    
    // Autofill from Discord Auth if authenticated
    if (discordAuth.authenticated && discordAuth.user) {
      if (discordRef.current) {
        discordRef.current.value = discordAuth.user.username || discordAuth.user.display || "";
      }
      const idInput = document.getElementById("discord-user-id-react");
      if (idInput) {
        idInput.value = discordAuth.user.id || "";
      }
    } else {
      if (discordRef.current) {
        discordRef.current.value = sessionStorage.getItem("paskus_enlist_discord_username") || "";
      }
      const idInput = document.getElementById("discord-user-id-react");
      if (idInput) {
        idInput.value = "";
      }
    }

    if (genderRef.current) genderRef.current.value = sessionStorage.getItem("paskus_enlist_gender") || "";
    if (ageRef.current) ageRef.current.value = sessionStorage.getItem("paskus_enlist_age") || "";
    if (joinedRef.current) joinedRef.current.value = sessionStorage.getItem("paskus_enlist_joined_via") || "";
    if (resimenRef.current) resimenRef.current.value = sessionStorage.getItem("paskus_enlist_resimen") || "";
    if (statusRef.current) statusRef.current.value = sessionStorage.getItem("paskus_enlist_status") || "";
    if (deviceRef.current) deviceRef.current.value = sessionStorage.getItem("paskus_enlist_device") || "";
    if (golonganRef.current) golonganRef.current.value = sessionStorage.getItem("paskus_enlist_golongan") || "";
  }, [discordAuth.authenticated, discordAuth.user, discordAuth.loading]);

  const showNotification = (title, message, showJoin = false) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowJoinDiscord(showJoin);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleDiscordSync = () => {
    // Save current values in sessionStorage before redirecting to Discord login
    if (usernameRef.current) sessionStorage.setItem("paskus_enlist_roblox_username", usernameRef.current.value);
    if (discordRef.current) sessionStorage.setItem("paskus_enlist_discord_username", discordRef.current.value);
    if (genderRef.current) sessionStorage.setItem("paskus_enlist_gender", genderRef.current.value);
    if (ageRef.current) sessionStorage.setItem("paskus_enlist_age", ageRef.current.value);
    if (joinedRef.current) sessionStorage.setItem("paskus_enlist_joined_via", joinedRef.current.value);
    if (resimenRef.current) sessionStorage.setItem("paskus_enlist_resimen", resimenRef.current.value);
    if (statusRef.current) sessionStorage.setItem("paskus_enlist_status", statusRef.current.value);
    if (deviceRef.current) sessionStorage.setItem("paskus_enlist_device", deviceRef.current.value);
    if (golonganRef.current) sessionStorage.setItem("paskus_enlist_golongan", golonganRef.current.value);

    discordAuth.login();
  };

  const handleDiscordReset = async () => {
    const ok = await discordAuth.reset();
    if (ok) {
      if (discordRef.current) discordRef.current.value = "";
      sessionStorage.removeItem("paskus_enlist_discord_username");
      const idInput = document.getElementById("discord-user-id-react");
      if (idInput) idInput.value = "";
      showNotification("SINKRONISASI DIRESET", "Sesi sinkronisasi Discord Anda berhasil direset.");
    }
  };

  // Final submission to backend enlistment handler
  const submitData = async () => {
    setSubmitting(true);
    setSubmitLabel("TRANSMITTING DATA...");

    const username = usernameRef.current?.value.trim() || "";
    const discordName = discordRef.current?.value.trim() || "";
    const gender = genderRef.current?.value.trim() || "";
    const ageValue = ageRef.current?.value.trim() || "";
    const joinedVia = joinedRef.current?.value.trim() || "";
    const resimen = resimenRef.current?.value.trim() || "";
    const status = statusRef.current?.value.trim() || "";
    const device = deviceRef.current?.value.trim() || "";
    const golongan = golonganRef.current?.value.trim() || "";

    try {
      const payload = {
        type: "main",
        api: {
          username,
          discord_name: discordName,
          discordUserId: discordAuth.user?.id || "",
          discord_user_id: discordAuth.user?.id || "",
          discord_id: discordAuth.user?.id || "",
          gender,
          age: parseInt(ageValue, 10),
          joined_via: joinedVia,
          resimen,
          status,
          device,
          golongan,
        },
      };

      const response = await fetch("/api/enlist.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = response.ok ? await response.json().catch(() => null) : null;

      if (!response.ok || !data || !data.ok) {
        throw new Error(data?.message || "Gagal mengirim pendaftaran ke server.");
      }

      showNotification(
        "PENDAFTARAN BERHASIL",
        `Data personel ${username} telah berhasil dikirim ke markas pusat. Silakan bergabung di Discord kami.`,
        true
      );

      // Clear input fields and sessionStorage
      if (usernameRef.current) usernameRef.current.value = "";
      if (discordRef.current) discordRef.current.value = "";
      if (genderRef.current) genderRef.current.value = "";
      if (ageRef.current) ageRef.current.value = "";
      if (joinedRef.current) joinedRef.current.value = "";
      if (resimenRef.current) resimenRef.current.value = "";
      if (statusRef.current) statusRef.current.value = "";
      if (deviceRef.current) deviceRef.current.value = "";
      if (golonganRef.current) golonganRef.current.value = "";

      const idInput = document.getElementById("discord-user-id-react");
      if (idInput) idInput.value = "";

      sessionStorage.removeItem("paskus_enlist_roblox_username");
      sessionStorage.removeItem("paskus_enlist_discord_username");
      sessionStorage.removeItem("paskus_enlist_gender");
      sessionStorage.removeItem("paskus_enlist_age");
      sessionStorage.removeItem("paskus_enlist_joined_via");
      sessionStorage.removeItem("paskus_enlist_resimen");
      sessionStorage.removeItem("paskus_enlist_status");
      sessionStorage.removeItem("paskus_enlist_device");
      sessionStorage.removeItem("paskus_enlist_golongan");
    } catch (error) {
      showNotification(
        "PENGIRIMAN GAGAL",
        error?.message || "Sistem gagal mengirim data Anda. Silakan coba lagi."
      );
    } finally {
      setSubmitting(false);
      setSubmitLabel("SUBMIT ENLISTMENT");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const username = usernameRef.current?.value.trim() || "";
    const discordName = discordRef.current?.value.trim() || "";
    const ageValue = ageRef.current?.value.trim() || "";

    if (username.length < 4) {
      showNotification("VALIDASI GAGAL", "Nama Roblox minimal 4 karakter!");
      return;
    }

    if (discordName.length < 4) {
      showNotification("VALIDASI GAGAL", "Nama Discord minimal 4 karakter!");
      return;
    }

    if (!/^[1-9][0-9]*$/.test(ageValue)) {
      showNotification("VALIDASI GAGAL", "Umur harus angka dan tidak boleh diawali 0!");
      return;
    }

    if (discordAuth.loading) {
      showNotification("SINKRONISASI DISCORD", "Sedang memeriksa status Discord, silakan tunggu...");
      return;
    }

    if (!discordAuth.authenticated || !discordAuth.user) {
      showNotification(
        "DISCORD REQUIRED",
        "Anda harus melakukan sinkronisasi Discord sebelum dapat melakukan pendaftaran."
      );
      return;
    }

    // Validate Discord account match
    const typedDiscord = discordName.toLowerCase().trim();
    const actualUsername = (discordAuth.user.username || "").toLowerCase().trim();
    const actualId = (discordAuth.user.id || "").toLowerCase().trim();
    const actualDisplay = (discordAuth.user.display || "").toLowerCase().trim();

    const isMatch =
      typedDiscord === actualUsername ||
      typedDiscord === actualId ||
      typedDiscord === actualDisplay ||
      typedDiscord.startsWith(actualUsername);

    if (!isMatch) {
      showNotification(
        "AKUN DISCORD BERBEDA",
        `Nama Discord yang Anda masukkan (${discordName}) tidak sesuai dengan akun Discord yang tersinkron (${discordAuth.user.username || discordAuth.user.display}). Harap sinkronkan akun yang sesuai.`
      );
      return;
    }

    // Check location consent
    if (!locationConsent.hasLocationCode) {
      setLocationModalOpen(true);
      return;
    }

    await submitData();
  };

  const handleLocationAllowed = async () => {
    await locationConsent.requestConsent();
    await submitData();
  };

  return (
    <>
      <section id="enlist" className="page-section min-h-screen py-8 px-6 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-black/80 border border-gold/30 p-12 backdrop-blur-xl paskus-register-card">
          <div className="text-center mb-12">
            <h3 className="heading-font text-3xl text-[#EFBF04] uppercase mb-2">Personnel Registration</h3>
            <p className="text-sage text-sm heading-font">Lampiran Rekrutan Baru</p>
          </div>

          <form
            id="enlistment-form"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            onSubmit={handleSubmit}
          >
            {/* Discord Authorization Row */}
            <div className="md:col-span-2 border border-gold/20 bg-white/[0.02] backdrop-blur-md rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col gap-1 text-left">
                <h4 className="heading-font text-sm text-[#EFBF04] font-bold uppercase tracking-wider">
                  Discord Synchronization
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Sinkronkan akun Discord Anda terlebih dahulu untuk mengisi Discord ID secara otomatis.
                </p>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                {discordAuth.loading ? (
                  <span className="text-xs text-sage animate-pulse font-bold heading-font uppercase">
                    Memeriksa Discord...
                  </span>
                ) : discordAuth.authenticated && discordAuth.user ? (
                  <div className="flex flex-col items-center md:items-end gap-1.5 w-full">
                    <span className="text-xs text-green-400 font-bold heading-font flex items-center gap-1.5 uppercase">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l5-5z" clipRule="evenodd" />
                      </svg>
                      {discordAuth.user.display || discordAuth.user.username} (Synced)
                    </span>
                    <button
                      type="button"
                      onClick={handleDiscordReset}
                      className="text-[10px] text-gold hover:text-white underline cursor-pointer"
                    >
                      Sync Ulang / Ganti Akun
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleDiscordSync}
                    className="btn-enlist px-6 py-3 heading-font text-[10px] font-bold tracking-wider cursor-pointer w-full md:w-auto uppercase"
                  >
                    Sync Discord
                  </button>
                )}
              </div>
            </div>

            {/* Input fields */}
            <input
              ref={usernameRef}
              id="roblox-username-react"
              minLength={4}
              required
              placeholder="Nama Roblox"
              className="bg-transparent border-b border-sage/50 p-4 text-white focus:border-gold outline-none heading-font text-xs transition-colors"
              type="text"
            />

            <input
              ref={discordRef}
              id="discord-username-react"
              minLength={4}
              required
              placeholder="Nama Discord"
              className="bg-transparent border-b border-sage/50 p-4 text-white focus:border-gold outline-none heading-font text-xs transition-colors"
              type="text"
              readOnly={discordAuth.authenticated && !!discordAuth.user}
            />

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="discord-user-id-react" className="text-[10px] text-sage font-bold tracking-wider uppercase">
                Discord ID (Diambil Otomatis)
              </label>
              <input
                id="discord-user-id-react"
                name="discord_user_id_react"
                type="text"
                readOnly
                placeholder="Lakukan Sinkronisasi Discord di atas untuk mengisi ID otomatis"
                className="bg-white/5 border border-white/10 rounded p-4 text-white/60 outline-none heading-font text-xs"
                autoComplete="off"
              />
            </div>

            <select
              ref={genderRef}
              id="Gender"
              required
              className="md:col-span-2 bg-transparent border-b border-sage/50 p-4 text-white focus:border-gold outline-none heading-font text-xs appearance-none"
            >
              <option value="" className="bg-black">Jenis Kelamin</option>
              <option className="bg-black" value="Pria">Pria</option>
              <option className="bg-black" value="Wanita">Wanita</option>
            </select>

            <input
              ref={ageRef}
              id="roblox-Age-react"
              min="1"
              required
              placeholder="Umur"
              className="bg-transparent border-b border-sage/50 p-4 text-white focus:border-gold outline-none heading-font text-xs"
              type="text"
              onInput={(e) => {
                const target = e.target;
                target.value = target.value.replace(/^0+/, "");
              }}
            />

            <input
              ref={joinedRef}
              id="masuk-via"
              required
              placeholder="Masuk via"
              className="bg-transparent border-b border-sage/50 p-4 text-white focus:border-gold outline-none heading-font text-xs"
              type="text"
            />

            <input
              ref={resimenRef}
              id="Resimen"
              required
              placeholder="Resimen Sebelum"
              className="bg-transparent border-b border-sage/50 p-4 text-white focus:border-gold outline-none heading-font text-xs"
              type="text"
            />

            <select
              ref={statusRef}
              id="Status"
              required
              className="md:col-span-2 bg-transparent border-b border-sage/50 p-4 text-white focus:border-gold outline-none heading-font text-xs appearance-none"
            >
              <option value="" className="bg-black">Pmc Or Sipil</option>
              <option className="bg-black" value="PMC">PMC</option>
              <option className="bg-black" value="Sipil">Sipil</option>
            </select>

            <select
              ref={deviceRef}
              id="Device"
              required
              className="md:col-span-2 bg-transparent border-b border-sage/50 p-4 text-white focus:border-gold outline-none heading-font text-xs appearance-none"
            >
              <option value="" className="bg-black">Pilih Perangkat Anda</option>
              <option className="bg-black" value="Handphone">Handphone</option>
              <option className="bg-black" value="Ipad">Ipad</option>
              <option className="bg-black" value="Laptop">Laptop</option>
              <option className="bg-black" value="MacOS">MacOS</option>
              <option className="bg-black" value="PC">PC</option>
            </select>

            <select
              ref={golonganRef}
              id="Golongan"
              required
              className="md:col-span-2 bg-transparent border-b border-sage/50 p-4 text-white focus:border-gold outline-none heading-font text-xs appearance-none"
            >
              <option value="" className="bg-black">Bersedia Mengikuti Perekrutan Golongan</option>
              <option className="bg-black" value="Gol 1">Gol 1</option>
              <option className="bg-black" value="Gol 2">Gol 2</option>
            </select>

            <div className="paskus-golongan-info md:col-span-2">
              <article>
                <strong>Golongan 1</strong>
                <span>Pagi sampai siang menjelang sore.</span>
              </article>
              <article>
                <strong>Golongan 2</strong>
                <span>Sore sampai malam.</span>
              </article>
            </div>

            {/* Anti-Bot Location Consent Status */}
            <div className="md:col-span-2 border border-gold/20 bg-white/[0.02] backdrop-blur-md rounded-xl p-4 flex items-center justify-between">
              <div className="flex flex-col gap-0.5 text-left">
                <span className="heading-font text-xs text-[#EFBF04] font-bold uppercase tracking-wider">
                  Anti-Bot Protection
                </span>
                <span className="text-[10px] text-gray-400">
                  Izin lokasi diperlukan untuk memastikan Anda bukan bot pengisi otomatis.
                </span>
              </div>
              <div>
                {locationConsent.hasLocationCode ? (
                  <span className="text-xs text-green-400 font-bold heading-font flex items-center gap-1 uppercase">
                    Terverifikasi ({locationConsent.locationCodeHint}) ✅
                  </span>
                ) : (
                  <span className="text-[10px] text-gold font-bold heading-font uppercase">
                    Belum Terverifikasi ⏳
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="submit-btn"
              disabled={submitting || discordAuth.loading}
              className="md:col-span-2 btn-enlist py-5 heading-font text-xs font-bold transition-all disabled:opacity-60 cursor-pointer uppercase tracking-widest"
            >
              {submitLabel}
            </button>
          </form>
        </div>
      </section>

      {/* Modern Location Permission Modal */}
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onAllow={handleLocationAllowed}
      />

      {/* Modern Notification Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={modalTitle}
      >
        <div className="flex flex-col items-center text-center">
          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
            {modalMessage}
          </p>
          {showJoinDiscord && (
            <a
              href="https://discord.gg/aaBR9ruFva"
              target="_blank"
              rel="noreferrer"
              className="btn-enlist mb-4 py-3.5 heading-font text-[10px] w-full text-center font-bold block"
            >
              JOIN DISCORD
            </a>
          )}
          <button
            onClick={closeModal}
            className="w-full py-3 border border-white/10 hover:border-gold/30 hover:text-gold rounded-lg transition-all heading-font text-[10px] font-bold cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </Modal>
    </>
  );
};

export default EnlistForm;

