import React from "react";

// data extracted from inline JSX to enable .map() rendering
// Each pasal is { id, num, title, subtitle, subPasals[] }
// Each subPasal is { title?, list[]?, text?, sanksi[]?, badges[]?, listStyle? }
// sanksi: { level: "ringan"|"sedang"|"berat", text }

export const PASAL_DATA = [
  {
    id: "pasal-1",
    num: "1",
    title: "Hubungan & Perilaku Antar Prajurit",
    subtitle: "Rasa hormat · Komunikasi · Anti diskriminasi",
    tocLabel: "Hubungan & Perilaku",
    subPasals: [
      {
        title: "Pasal 1.1 — Rasa Hormat & Sikap",
        list: [
          "Wajib menghormati seluruh prajurit, perwira, komandan, dan tamu.",
          "Dilarang menghina, merendahkan, memancing konflik, atau mengganggu anggota lain.",
          "Junjung tinggi etika, sopan santun, dan profesionalisme.",
        ],
      },
      {
        title: "Pasal 1.2 — Etika Komunikasi",
        list: [
          "Gunakan bahasa sopan dan tidak provokatif.",
          "Hindari spam, flood, OOC berlebihan, atau penggunaan huruf kapital terus-menerus.",
          "Jaga nama baik komunitas di dalam maupun di luar server.",
        ],
      },
      {
        title: "Pasal 1.3 — Anti Diskriminasi",
        list: [
          "Dilarang keras konten SARA, ujaran kebencian, rasisme, atau diskriminasi dalam bentuk apa pun.",
          "Politik ekstrem dan provokasi sosial tidak diperbolehkan.",
        ],
      },
    ],
  },
  {
    id: "pasal-2",
    num: "2",
    title: "Aturan Roleplay Militer",
    subtitle: "Lore · Powergaming · Koordinasi · Dinas ganda",
    tocLabel: "Aturan Roleplay",
    subPasals: [
      {
        title: "Pasal 2.1 — Kepatuhan Lore & Struktur",
        list: [
          "Wajib mengikuti lore, struktur militer, dan alur cerita PASKUS-791 RP.",
          "Hormati sistem pangkat dan rantai komando dalam konteks roleplay.",
        ],
      },
      {
        title: "Pasal 2.2 — Larangan Penyalahgunaan RP",
        // uses dangerouslySetInnerHTML-free approach — bold via <strong> in JSX
        // For items with inline <strong>, we use richList (array of {text, bold?})
        richList: [
          { jsx: <>Dilarang <strong>Powergaming</strong> — memaksakan hasil yang menguntungkan diri sendiri secara tidak wajar.</> },
          { jsx: <>Dilarang <strong>Metagaming</strong> — menggunakan informasi OOC dalam konteks IC.</> },
          { jsx: <>Dilarang merusak alur cerita secara sengaja (<strong>Fail RP</strong>).</> },
        ],
      },
      {
        title: "Pasal 2.3 — Koordinasi Skenario",
        list: [
          "Event besar wajib melalui izin atau pengawasan Moderator / Komando Pengawas (Perwira).",
          "Utamakan kerja sama dalam membangun cerita.",
        ],
      },
      {
        title: "Pasal 2.4 — Larangan Dinas Ganda (Tempur & Non-Tempur)",
        list: [
          "Prajurit dilarang merangkap dua peran utama sekaligus dalam satu waktu aktif RP, khususnya antara dinas tempur dan dinas non-tempur.",
          "Dinas tempur mencakup unit operasional lapangan (infanteri, pasukan khusus, penerbangan tempur, dll).",
          "Dinas non-tempur mencakup unit pendukung (DPDM, Pelatih, RGE, Staff, dll).",
          "Setiap prajurit wajib memilih dan berfokus pada satu jalur dinas untuk menjaga keseimbangan roleplay dan profesionalitas karakter.",
          "Perpindahan dinas diperbolehkan melalui prosedur resmi dan persetujuan komando.",
          "Pengecualian hanya dapat diberikan oleh Komando Pengawas (Perwira) dalam kondisi tertentu yang mendukung skenario RP.",
        ],
      },
    ],
  },
  {
    id: "pasal-3",
    num: "3",
    title: "Identitas & Konten",
    subtitle: "Karakter · Media · Promosi",
    tocLabel: "Identitas & Konten",
    subPasals: [
      { title: "Pasal 3.1 — Identitas Karakter", list: ["Gunakan identitas karakter secara konsisten.", "Dilarang mengganti identitas demi keuntungan tidak adil."] },
      { title: "Pasal 3.2 — Konten Media", list: ["Konten harus sesuai tema militer/RP atau hiburan sehat.", "Pornografi dan konten tidak pantas dilarang keras."] },
      { title: "Pasal 3.3 — Promosi & Tautan", list: ["Dilarang promosi server lain atau iklan tanpa izin resmi."] },
    ],
  },
  {
    id: "pasal-4",
    num: "4",
    title: "Keamanan, Privasi & Perlindungan",
    subtitle: "Data pribadi · Wewenang pengawas",
    tocLabel: "Keamanan & Privasi",
    subPasals: [
      { title: "Pasal 4.1 — Privasi Pribadi", list: ["Dilarang membagikan data pribadi anggota lain tanpa persetujuan.", "Dilarang memaksa anggota membuka identitas pribadi."] },
      { title: "Pasal 4.2 — Wewenang Pengawas", list: ["Moderator adalah Komandan Pengawas dengan wewenang menjaga ketertiban.", "Keputusan moderator bersifat mengikat."] },
    ],
  },
  {
    id: "pasal-5",
    num: "5",
    title: "Pelecehan & Batas Interaksi",
    subtitle: "Pelecehan seksual · Batas personal · Pelaporan",
    tocLabel: "Pelecehan & Batas",
    subPasals: [
      { title: "Pasal 5.1 — Pelecehan Seksual", list: ["Dilarang segala bentuk pelecehan seksual, termasuk komentar, candaan, isyarat seksual, permintaan konten intim, serta pengiriman media berunsur seksual."] },
      { title: "Pasal 5.2 — Batas Interaksi Personal", list: ["Dilarang flirting berlebihan atau menggoda secara tidak diinginkan.", "Interaksi personal dalam RP wajib berdasarkan consent kedua pihak.", "Jika satu pihak tidak nyaman, interaksi harus segera dihentikan."] },
      { title: "Pasal 5.3 — Pelaporan", list: ["Korban atau saksi dapat melapor ke DPDM sesegera mungkin.", "Identitas pelapor dirahasiakan sesuai permintaan korban."] },
    ],
  },
  {
    id: "pasal-6",
    num: "6",
    title: "Loyalitas Kesatuan & Dualisme",
    subtitle: "Larangan dualisme · Konflik kepentingan · Pengecualian",
    tocLabel: "Loyalitas Kesatuan",
    subPasals: [
      { title: "Pasal 6.1 — Larangan Dualisme", text: "Anggota aktif dilarang bergabung di komunitas RP militer lain dengan tema serupa tanpa izin resmi." },
      { title: "Pasal 6.2 — Konflik Kepentingan", text: "Dilarang membawa konflik, sistem, atau lore komunitas lain ke server ini." },
      { title: "Pasal 6.3 — Pengecualian", text: "Keanggotaan ganda hanya bisa dengan persetujuan Komando Pengawas (Perwira)." },
      { title: "Pasal 6.4 — Pelanggaran Loyalitas", text: "Rekrutmen anggota ke komunitas lain atau drama lintas server akan dikenakan sanksi berat." },
    ],
  },
  {
    id: "pasal-7",
    num: "7",
    title: "Penyalahgunaan Wewenang & Jabatan",
    subtitle: "Pangkat · Staff · Manipulasi sistem",
    tocLabel: "Penyalahgunaan Jabatan",
    subPasals: [
      { title: "Pasal 7.1 — Penyalahgunaan Pangkat", text: "Dilarang menggunakan jabatan untuk menekan atau mengintimidasi di luar konteks RP yang wajar." },
      { title: "Pasal 7.2 — Penyalahgunaan Kekuasaan Staff", text: "Moderator dilarang bertindak sewenang-wenang atau pilih kasih dalam penegakan aturan." },
      { title: "Pasal 7.3 — Manipulasi Sistem", text: "Dilarang memanfaatkan celah aturan demi keuntungan pribadi." },
    ],
  },
  {
    id: "pasal-8",
    num: "8",
    title: "Pencemaran Nama Baik & Provokasi",
    subtitle: "Fitnah · Menjatuhkan komunitas · Adu domba",
    tocLabel: "Pencemaran Nama Baik",
    subPasals: [
      { title: "Pasal 8.1 — Fitnah", text: "Dilarang menyebarkan tuduhan palsu atau gosip yang tidak berdasar." },
      { title: "Pasal 8.2 — Menjatuhkan Komunitas", text: "Dilarang menjelekkan komunitas atau menyebarkan kebencian di luar server." },
      { title: "Pasal 8.3 — Adu Domba (Devide et Impera)", text: "Dilarang memecah belah anggota atau membawa drama dari luar ke dalam server." },
    ],
  },
  {
    id: "pasal-9",
    num: "9",
    title: "Pemalsuan Identitas",
    subtitle: "Menyamar · Atribut resmi · Manipulasi RP",
    tocLabel: "Pemalsuan Identitas",
    subPasals: [
      { title: "Pasal 9.1 — Menyamar sebagai Anggota/Staff", text: "Dilarang keras menyamar sebagai anggota atau staff lain dalam konteks apa pun." },
      { title: "Pasal 9.2 — Penyalahgunaan Atribut Resmi", text: "Penggunaan atribut, logo, pangkat, atau simbol resmi tanpa izin dilarang." },
      { title: "Pasal 9.3 — Identitas Palsu untuk Manipulasi RP", text: "Penggunaan identitas palsu untuk mempengaruhi atau memanipulasi jalannya roleplay juga dilarang." },
    ],
  },
  {
    id: "pasal-10",
    num: "10",
    title: "Klasifikasi Pelanggaran & Sanksi Disiplin",
    subtitle: "Ringan · Sedang · Berat · Akumulasi · Kewenangan",
    tocLabel: "Klasifikasi & Sanksi",
    subPasals: [
      {
        title: "Pasal 10.1 — Pelanggaran Ringan",
        text: "Pelanggaran yang bersifat mengganggu ketertiban namun tidak membahayakan anggota lain secara langsung.",
        list: ["Spam, flood, atau OOC berlebihan", "Penggunaan huruf kapital berlebihan", "Minor Fail RP (sedikit keluar karakter)", "Konten tidak sesuai tema namun tidak mengandung unsur terlarang"],
        sanksi: [
          { level: "ringan", text: "Teguran lisan / tertulis" },
          { level: "ringan", text: "Peringatan ringan (SP 1)" },
          { level: "ringan", text: "Jika berulang → naik ke kategori sedang" },
        ],
      },
      {
        title: "Pasal 10.2 — Pelanggaran Sedang",
        text: "Pelanggaran yang mengganggu kenyamanan anggota lain, merusak suasana komunitas, atau melanggar etika serius.",
        list: ["Menghina atau merendahkan anggota lain", "Toxic / provokatif di chat", "Powergaming atau Metagaming ringan–sedang", "Membocorkan informasi IC/OOC yang mengganggu RP", "Promosi tanpa izin", "Flirting tidak nyaman yang dihentikan saat ditegur", "Menyebarkan gosip tanpa bukti"],
        sanksi: [
          { level: "sedang", text: "Peringatan keras (SP 2)" },
          { level: "sedang", text: "Degradasi pangkat RP" },
          { level: "sedang", text: "Skorsing sementara (IN-Probation)" },
          { level: "sedang", text: "Jika berulang → naik ke kategori berat" },
        ],
      },
      {
        title: "Pasal 10.3 — Pelanggaran Berat",
        text: "Pelanggaran serius yang membahayakan keamanan, kenyamanan, stabilitas komunitas, atau melanggar norma hukum dan moral.",
        list: [
          "Pelecehan seksual dalam bentuk apa pun",
          "Ujaran kebencian, SARA, rasisme",
          "Penyebaran pornografi",
          "Dualisme resimen tanpa izin / merekrut ke server lain",
          "Penyalahgunaan jabatan atau kekuasaan",
          "Fitnah serius & pencemaran nama baik komunitas",
          "Pemalsuan identitas / menyamar sebagai prajurit lain atau staff",
          "Membocorkan data pribadi anggota",
          "Mengabaikan peringatan berulang kali dengan niat merusak komunitas",
        ],
        sanksi: [
          { level: "berat", text: "Skorsing langsung" },
          { level: "berat", text: "Pencabutan pangkat / jabatan" },
          { level: "berat", text: "Pemecatan dari kesatuan (Ban Permanen)" },
          { level: "berat", text: "Dalam kasus tertentu dapat diblokir tanpa peringatan sebelumnya" },
        ],
      },
      {
        title: "Pasal 10.4 — Akumulasi Pelanggaran",
        list: [
          "Pelanggaran ringan yang berulang dapat meningkat menjadi sedang.",
          "Pelanggaran sedang berulang dapat meningkat menjadi berat.",
          "Riwayat disiplin anggota menjadi pertimbangan keputusan komando.",
        ],
      },
      {
        title: "Pasal 10.5 — Kewenangan Penegakan",
        list: [
          "DPDM berhak menentukan kategori pelanggaran berdasarkan bukti dan situasi dengan dibantu Komando Pengawas (Perwira).",
          "Keputusan bersifat final demi menjaga stabilitas dan keamanan komunitas.",
        ],
      },
    ],
  },
  {
    id: "pasal-11",
    num: "11",
    title: "Jiwa Korps & Kekeluargaan",
    subtitle: "Sportivitas · Kekompakan · Rasa hormat",
    tocLabel: "Jiwa Korps",
    subPasals: [
      {
        list: [
          "Kita adalah satu kesatuan yang saling mendukung.",
          "Junjung tinggi sportivitas, kekompakan, dan rasa hormat antar sesama prajurit.",
          "Tidak ada prajurit yang ditinggalkan.",
        ],
      },
    ],
  },
];

export const SECURITY_DATA = {
  prohibited: [
    "Chat menyerang ras, suku, agama, etnis, identitas, atau mengandung ujaran kebencian.",
    "Bahasa provokatif, penghinaan personal, pelecehan, ancaman, atau ajakan menyerang pihak lain.",
    "Foto/screenshot dengan indikasi penipuan, phishing, giveaway palsu, akun hack, crypto scam, atau promosi mencurigakan.",
    "Link tidak resmi, shortlink mencurigakan, invite palsu, website login palsu, and tautan phishing.",
    "File berisi virus, malware, script berbahaya, archive mencurigakan, atau attachment tidak jelas sumbernya.",
    "Spam, flood, mention berlebihan, atau pola chat seperti bot.",
  ],
  howItWorks: "Bot membaca pola dan konteks. Candaan ringan yang masih aman tidak langsung dihukum, tetapi serangan serius, phishing, scam, malware, dan pelanggaran berulang akan ditindak otomatis.",
  punishments: [
    { icon: "🟡", text: "Peringatan untuk pelanggaran ringan." },
    { icon: "🔴", text: "Auto-delete untuk pesan, media, link, atau file berbahaya." },
    { icon: "⏱️", text: "Timeout untuk pelanggaran berat atau berulang." },
    { icon: "📋", text: "Security Log & Alert untuk pencatatan dan review staff." },
    { icon: "🚫", text: "Eskalasi staff jika terindikasi phishing, scam, malware, atau ancaman serius." },
  ],
};
