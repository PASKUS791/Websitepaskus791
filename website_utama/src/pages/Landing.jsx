import React, { useEffect, useRef, useState } from "react";
import { unit, nonTempur } from "../constant";
import videoHeader from "../assets/videos/video-header.mp4";
import { Link, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";

const WEBHOOK_CONFIG = {
  GENERAL: import.meta.env.VITE_WEBHOOK_REK,
};
const Landing = () => {
  // refs for form fields
  const usernameRef = useRef(null);
  const usernamedRef = useRef(null);
  const choose = useRef(null);
  const DeviceRef = useRef(null);
  const GolRef = useRef(null);
  const Gender = useRef(null);
  const AgeRef = useRef(null);
  const Joinref = useRef(null);
  const ResimenRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitLabel, setSubmitLabel] = useState("SUBMIT ENLISTMENT");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("NOTIFICATION");
  const [modalMessage, setModalMessage] = useState("");

  // scrollToSection (0 = home, 1 = combat, 2 = support, 3 = enlist)
  const scrollToSection = (index) => {
    const targets = ["home", "combat", "support", "enlist"];
    const target = document.getElementById(targets[index]);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  const showModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // IntersectionObserver for page sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.2 },
    );

    const sections = document.querySelectorAll(".page-section");
    sections.forEach((s) => observer.observe(s));

    return () => {
      sections.forEach((s) => observer.unobserve(s));
      observer.disconnect();
    };
  }, []);

  // form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = usernameRef.current?.value?.trim() ?? "";
    const usernamed = usernamedRef.current?.value?.trim() ?? "";
    const Gender1 = Gender.current?.value?.trim() ?? "";
    const Age = AgeRef.current?.value ?? "";
    const Joined = Joinref.current?.value?.trim() ?? "";
    const Resimens = ResimenRef.current?.value?.trim() ?? "";
    const choose1 = choose.current?.value?.trim() ?? "";
    const Device = DeviceRef.current?.value?.trim() ?? "";
    const Golongan = GolRef.current?.value?.trim() ?? "";

    if (username.length < 4) {
      alert("Nama Roblox minimal 4 karakter!");
      return;
    }

    if (usernamed.length < 4) {
      alert("Nama Discord minimal 4 karakter!");
      return;
    }

    if (!/^[1-9][0-9]*$/.test(Age)) {
      alert("Umur harus angka dan tidak boleh diawali 0!");
      return;
    }

    setSubmitting(true);
    setSubmitLabel("TRANSMITTING DATA...");

    const payload = {
      username: "PASKUS ADMIN REKRUT",
      embeds: [
        {
          title: "📄 Lampiran Baru Pendaftar Resimen",
          description: `Pendaftar baru telah mengirimkan Data `,
          color: 13938487,
          fields: [
            {
              name: "👤 Nama Roblox",
              value: `\`${username}\``,
              inline: true,
            },
            {
              name: "👤 Nama Discord",
              value: `\`${usernamed}\``,
              inline: true,
            },
            {
              name: "Jenis Kelamin",
              value: `\`${Gender1}\``,
              inline: true,
            },
            {
              name: "🕰️ Age/Umur",
              value: `\`${Age}\``,
              inline: true,
            },
            {
              name: "Masuk Via",
              value: `\`${Joined}\``,
              inline: true,
            },
            {
              name: "📇 Resimen",
              value: `\`${Resimens}\``,
              inline: true,
            },
            {
              name: "Status",
              value: `\`${choose1}\``,
              inline: true,
            },
            {
              name: "Status Device",
              value: `\`${Device}\``,
              inline: true,
            },
            {
              name: "Mengikuti Gol",
              value: `\`${Golongan}\``,
              inline: true,
            },
          ],
          footer: { text: "PASKUS-791 Automated Admission" },

          timestamp: new Date().toISOString(),
        },
      ],
    };

    try {
      // Data payload for backend database
      const backendPayload = {
        username: username,
        discord_name: usernamed,
        gender: Gender1,
        age: parseInt(Age, 10),
        joined_via: Joined,
        resimen: Resimens,
        status: choose1,
        device: Device,
        golongan: Golongan,
      };

      // 1. Eksekusi request ke API Backend PERTAMA KALI
      const backendResponse = await fetch(
        "https://api.paskus791.cloud/sipil/registrasi",
        // "http://localhost:4454/sipil/registrasi",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(backendPayload),
        },
      );

      const backendData = await backendResponse.json();

      // 2. Jika API Backend gagal (misal status 400 karena discord_name sama)
      if (!backendResponse.ok) {
        // Lemparkan pesan error dari backend (contoh: "Anda telah terdaftar")
        throw new Error(
          backendData.message || "Transmisi data ke server gagal.",
        );
      }

      // 3. JIKA Backend SUKSES, baru eksekusi Webhook ke Markas Pusat
      const webhookResponse = await fetch(WEBHOOK_CONFIG.GENERAL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!webhookResponse.ok) {
        throw new Error(
          "Data tersimpan, namun gagal mengirim transmisi ke markas pusat (Discord).",
        );
      }

      // 4. Eksekusi jika semua request sukses
      showModal(
        "ENLISTMENT RECEIVED",
        `Data personel ${username} telah berhasil dikirim ke markas pusat. Silahkan menunggu jadwal perekrutan pada discord kami.`,
      );

      if (usernameRef.current) usernameRef.current.value = "";
      if (choose.current) choose.current.value = "";
      if (DeviceRef.current) DeviceRef.current.value = "";
      if (GolRef.current) GolRef.current.value = "";
      if (Gender.current) Gender.current.value = "";
      if (AgeRef.current) AgeRef.current.value = "";
      if (Joinref.current) Joinref.current.value = "";
      if (ResimenRef.current) ResimenRef.current.value = "";
    } catch (err) {
      showModal(
        "TRANSMISSION FAILED",
        err.message ||
          "The system failed to send your enlistment data. Please try again in a few moments.",
      );
    } finally {
      setSubmitting(false);
      setSubmitLabel("SUBMIT ENLISTMENT");
    }
  };

  return (
    <>
      <Helmet>
        <title>PASKUS-791 | Roblox Milsim Community</title>
        <meta name="title" content="PASKUS-791 | Roblox Milsim Community" />
        <meta
          name="description"
          content="Komunitas Milsim (Military Simulation) Blackhawk Rescue Mission 5 berbasis di Roblox. Bergabunglah dengan unit tempur elit kami: Gatam, SIERRA, Sentinel, dan lainnya."
        />
        <meta
          name="keywords"
          content="PASKUS-791, Roblox Milsim, BRM5 Indonesia, Blackhawk Rescue Mission 5, Clan Roblox Indonesia, Militer Simulasi Roblox"
        />
        <meta name="author" content="PASKUS-791" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://so791.com/" />
        <meta property="og:title" content="PASKUS-791 | Silere Impetum" />
        <meta
          property="og:description"
          content="Dedikasi pada taktik tempur realistis dan struktur komando disiplin di platform Roblox. Enlist now!"
        />
        <meta property="og:image" content="/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://so791.com/" />
        <meta
          property="twitter:title"
          content="PASKUS-791 | Roblox Milsim Community"
        />
        <meta
          property="twitter:description"
          content="Komunitas Milsim BRM5 dengan pengalaman tempur imersif. Daftar sebagai personel hari ini."
        />
        <meta property="twitter:image" content="/og-image.jpg" />

        <meta name="theme-color" content="#8A9A5B" />
      </Helmet>
      <section
        id="home"
        className="page-section active min-h-screen relative flex items-center justify-center"
      >
        <video autoPlay muted loop playsInline className="video-bg">
          <source src={videoHeader} type="video/mp4" />
        </video>
        <div className="z-10 text-center px-4 max-w-4xl">
          <h1 className="text-6xl md:text-9xl heading-font text-sage mb-2 leading-none">
            PASKUS - 791
          </h1>
          <p className="text-[#EFBF04] heading-font tracking-[0.8em] text-sm md:text-xl mb-6 opacity-80">
            Silere impetum
          </p>
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed tracking-wide backdrop-blur-sm bg-black/20 p-4 border-l border-gold/50">
              PASKUS-791 adalah komunitas Milsim (Military Simulation) berbasis
              di platform Roblox Blackhawk Rescue Mission 5. Kami berdedikasi
              pada taktik tempur realistis, struktur komando yang disiplin, dan
              lingkungan roleplay profesional untuk menciptakan pengalaman
              tempur yang imersif bagi setiap personel.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <button
              onClick={() => scrollToSection(3)}
              className="btn-enlist px-12 py-5 heading-font text-xs font-bold w-full md:w-auto"
            >
              ENLIST PERSONNEL
            </button>
            <a
              href="https://discord.gg/ynRhDN5p7b"
              target="_blank"
              rel="noreferrer"
              className="btn-outline-white px-12 py-5 heading-font text-xs w-full md:w-auto flex items-center justify-center gap-2"
            >
              JOIN DISCORD HUB
            </a>
          </div>
        </div>
      </section>

      {/* Combat */}
      <section id="combat" className="page-section py-8 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-[#EFBF04] heading-font text-sm tracking-widest mb-4">
              // COMBAT DIVISION
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold heading-font text-white">
              UNIT <span className="text-[#9DC183]">TEMPUR</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {unit.map((p, i) => (
              <div className={`flip-card`} key={i}>
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <img
                      src={p.img}
                      alt={p.headingSatu}
                      className="unit-logo"
                    />
                    <h4 className="heading-font text-xs md:text-lg text-white">
                      {p.headingSatu}
                    </h4>

                    <Link to={`/unit/${p.path}`} className={`${p.class}`}>
                      Detail Unit
                    </Link>
                  </div>
                  <div className="flip-card-back">
                    <h4 className="heading-font text-xs md:text-lg mb-4 text-[#9DC183] font-bold">
                      {p.headingDua}
                    </h4>
                    <p className="text-xs leading-relaxed">{p.deskripsi}</p>
                    <Link to={`/unit/${p.path}`} className={`${p.class}`}>
                      Detail Unit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section id="support" className="page-section py-8 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-[#9DC183] heading-font text-sm tracking-widest mb-4">
              // SUPPORT DIVISION
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold heading-font text-white">
              UNIT <span className="text-[#EFBF04]">NON-TEMPUR</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
            {nonTempur.map((p, i) => (
              <div className="flip-card" key={i}>
                <div className="flip-card-inner">
                  <div className="flip-card-front border-dashed border-sage/50">
                    <img src={p.img} alt="Zeni Logo" className="unit-logo" />
                    <h4 className="heading-font text-lg text-white">
                      {p.headingSatu}
                    </h4>
                  </div>
                  <div className="flip-card-back">
                    <h4 className="heading-font text-[#EFBF04] mb-4 font-bold">
                      {p.headingDua}
                    </h4>
                    <p className="text-xs">{p.deskripsi}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enlist form */}
      <section
        id="enlist"
        className="page-section min-h-screen py-8 px-6 flex items-center justify-center"
      >
        <div className="max-w-4xl w-full bg-black/80 border border-gold/30 p-12 backdrop-blur-xl">
          <div className="text-center mb-12">
            <h3 className="heading-font text-3xl text-[#EFBF04] uppercase mb-2">
              Personnel Registration
            </h3>
            <p className="text-sage text-sm heading-font">
              Lampiran Rekrutan Baru
            </p>
          </div>
          <form
            id="enlistment-form"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            onSubmit={handleSubmit}
          >
            <input
              ref={usernameRef}
              type="text"
              id="roblox-username"
              minLength={4}
              required
              placeholder="Nama Roblox"
              className="bg-transparent border-b border-sage/50 p-4 text-white focus:border-gold outline-none heading-font text-xs"
            />
            <input
              ref={usernamedRef}
              type="text"
              id="discord-username"
              minLength={4}
              required
              placeholder="Nama Discord"
              className="bg-transparent border-b border-sage/50 p-4 text-white focus:border-gold outline-none heading-font text-xs"
            />
            <select
              ref={Gender}
              id="Gender"
              required
              className="md:col-span-2 bg-transparent border-b border-sage/50 p-4 text-white focus:border-gold outline-none heading-font text-xs appearance-none"
            >
              <option value="" className="bg-black">
                Jenis Kelamin
              </option>
              <option className="bg-black">Pria</option>
              <option className="bg-black">Wanita</option>
            </select>

            <input
              ref={AgeRef}
              type="text"
              id="roblox-Age"
              min="1"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/^0+/, "");
              }}
              required
              placeholder="Umur"
              className="bg-transparent border-b border-sage/50 p-4 text-white focus:border-gold outline-none heading-font text-xs"
            />

            <input
              ref={Joinref}
              type="text"
              id="masuk-via"
              required
              placeholder="Masuk via"
              className="bg-transparent border-b border-sage/50 p-4 text-white focus:border-gold outline-none heading-font text-xs"
            />

            <input
              ref={ResimenRef}
              type="text"
              id="Resimen"
              required
              placeholder="Resimen Sebelum"
              className="bg-transparent border-b border-sage/50 p-4 text-white focus:border-gold outline-none heading-font text-xs"
            />
            <select
              ref={choose}
              id="Status"
              required
              className="md:col-span-2 bg-transparent border-b border-sage/50 p-4 text-white focus:border-gold outline-none heading-font text-xs appearance-none"
            >
              <option value="" className="bg-black">
                Pmc Or Sipil
              </option>
              <option className="bg-black">PMC</option>
              <option className="bg-black">Sipil</option>
            </select>

            <select
              ref={DeviceRef}
              id="Device"
              required
              className="md:col-span-2 bg-transparent border-b border-sage/50 p-4 text-white focus:border-gold outline-none heading-font text-xs appearance-none"
            >
              <option value="" className="bg-black">
                Pilih Perangkat Anda
              </option>
              <option className="bg-black">Handphone</option>
              <option className="bg-black">Ipad</option>
              <option className="bg-black">Laptop</option>
              <option className="bg-black">MacOS</option>
              <option className="bg-black">PC</option>
            </select>

            <select
              ref={GolRef}
              id="Golongan"
              required
              className="md:col-span-2 bg-transparent border-b border-sage/50 p-4 text-white focus:border-gold outline-none heading-font text-xs appearance-none"
            >
              <option value="" className="bg-black">
                Bersedia Mengikuti Perekrutan Golongan
              </option>
              <option className="bg-black">Gol 1</option>
              <option className="bg-black">Gol 2</option>
            </select>

            <button
              type="submit"
              id="submit-btn"
              disabled={submitting}
              className="md:col-span-2 btn-enlist py-5 heading-font text-xs font-bold transition-all disabled:opacity-60"
            >
              {submitLabel}
            </button>
          </form>
        </div>
      </section>

      {modalOpen && (
        <div
          id="notification-modal"
          className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
        >
          <div className="bg-[#111] border border-gold/40 p-10 max-w-md text-center">
            <h4
              id="modal-title"
              className="heading-font text-gold text-2xl mb-4"
            >
              {modalTitle}
            </h4>

            <p
              id="modal-message"
              className="text-gray-300 text-sm mb-8 leading-relaxed"
            >
              {modalMessage}
            </p>
            <div className="btn-enlist mb-5 px-8 py-3 heading-font text-[10px] w-full">
              <a
                href="https://discord.gg/ynRhDN5p7b"
                target="_blank"
                rel="noreferrer"
              >
                JOIN DISCORD
              </a>
            </div>

            <button
              onClick={closeModal}
              className="btn-enlist px-8 py-3 heading-font text-[10px] w-full"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Landing;
