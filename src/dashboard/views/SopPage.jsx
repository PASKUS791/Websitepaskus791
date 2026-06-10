/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / SOP Library
 * Purpose: Konten dan detail SOP recruiter dalam file terpisah agar mudah diedit tim.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

const SOP_LIBRARY = [
  {
    id: "sop-perekrut-brm5",
    layout: "framework",
    accent: "lime",
    cardEyebrow: "SOP Perekrutan Wawancara",
    cardSummary:
      "Panduan lengkap proses perekrutan PASKUS-791 berbasis wawancara penuh: validasi identitas, kesediaan mengabdi, etika komunikasi, penjelasan kepangkatan dan unit, peraturan komunitas, serta tindak lanjut pin dan Sertijab manual.",
    badge: "INTERVIEW",
    documentTag: "SOP-REKRUT-WAWANCARA-791",
    serial: "REV. WAWANCARA JUN 2026",
    title: "SOP PEREKRUTAN PASKUS 791 — WAWANCARA",
    description:
      "Dokumen ini menjadi acuan perekrut saat menjalankan sesi seleksi berbasis wawancara penuh. Tidak ada sesi latihan fisik atau in-game; perekrut cukup membawa kandidat melalui validasi data, pertanyaan kesediaan, orientasi etika dan disiplin, penjelasan sistem kepangkatan, unit, serta peraturan komunitas. Setiap jawaban dicatat langsung di laporan aplikasi. Pengambilan pin dan Sertijab dilakukan manual setelah laporan dikirim ke resimen.",
    referenceLabel: "Mode Seleksi",
    referenceValue: "WAWANCARA + DISCORD",
    overviewTitle: "Alur Wawancara Perekrutan",
    overviewDescription:
      "Urutan sesi dimulai dari pembukaan dan perkenalan, validasi identitas Roblox dan Discord, pertanyaan kesediaan mengabdi, orientasi etika komunikasi, penjelasan kepangkatan dan struktur komando, penjelasan unit-unit terkait, pembacaan peraturan komunitas dan roleplay, penjelasan alur pelatihan dan pengambilan pin, lalu penutup dan rekomendasi. Semua jawaban dicatat di laporan dan dikirim ke resimen.",
    directives: [
      {
        label: "PRINSIP 01",
        text: '"Perekrut wajib mengikuti urutan pertanyaan dan tidak melewati topik inti sebelum jawaban kandidat dicatat dengan jelas."',
      },
      {
        label: "PRINSIP 02",
        text: '"Penilaian berdasarkan kejujuran identitas, kesediaan mengikuti disiplin, sikap komunikasi, dan pemahaman dasar terhadap sistem PASKUS 791."',
      },
      {
        label: "PRINSIP 03",
        text: '"Setiap hasil wawancara harus dicatat di aplikasi agar laporan, histori, dan tindak lanjut Pin & Sertijab manual tetap sinkron."',
      },
    ],
    fieldSpecs: [
      { label: "Target Kandidat", value: "Sipil, PMC, atau eks-resimen" },
      { label: "Minimal Usia", value: "16 tahun untuk jalur reguler" },
      { label: "Jalur Khusus", value: "Probation untuk kandidat di bawah batas usia" },
      { label: "Mode Seleksi", value: "Wawancara lisan dan validasi data" },
      { label: "Data Wajib", value: "Roblox, Discord, usia, alasan gabung, status asal" },
      { label: "Materi Inti", value: "Identitas, kesediaan, etika, kepangkatan, unit, peraturan" },
      { label: "Materi Penutup", value: "Penjelasan alur pelatihan, pin, dan Sertijab" },
      { label: "Output", value: "Laporan wawancara, status kelulusan, tindak lanjut manual" },
    ],
    phases: [
      {
        index: "01",
        title: "Phase 1: Pembukaan dan Perkenalan",
        description:
          "Sambut kandidat dengan bahasa profesional. Perkenalkan diri sebagai perekrut PASKUS-791 dan jelaskan bahwa sesi ini adalah seleksi wawancara, bukan latihan fisik. Minta kandidat untuk menjawab dengan jelas dan jujur.",
        bullets: [
          "Gunakan sapaan Sir atau Madam",
          "Jelaskan tujuan sesi wawancara",
          "Minta kejujuran dan kejelasan jawaban",
        ],
      },
      {
        index: "02",
        title: "Phase 2: Validasi Identitas",
        description:
          "Tanyakan nama Roblox, nama Discord, dan Discord ID jika tersedia. Konfirmasi usia kandidat dan status asal (sipil, PMC, atau eks-resimen). Tanyakan alasan bergabung ke PASKUS-791 secara singkat dan jelas.",
        bullets: [
          "Nama Roblox dan Discord",
          "Usia dan status asal kandidat",
          "Alasan bergabung ke PASKUS 791",
        ],
      },
      {
        index: "03",
        title: "Phase 3: Kesediaan Mengabdi",
        description:
          "Tanyakan kesiapan kandidat mengikuti aturan dan disiplin resimen, komitmen waktu aktif dan kehadiran sesi, serta kesediaan menjaga nama baik satuan. Jawaban yang ragu-ragu atau tidak konsisten dicatat sebagai risiko.",
        bullets: [
          "Kesiapan mengikuti disiplin",
          "Komitmen waktu dan kehadiran",
          "Kesediaan menjaga nama satuan",
        ],
      },
      {
        index: "04",
        title: "Phase 4: Etika Komunikasi",
        description:
          "Nilai sikap dan bahasa kandidat selama wawancara berlangsung. Jelaskan standar komunikasi yang diharapkan: sapaan formal, tidak spam, tidak menggunakan huruf kapital berlebihan, dan selalu menutup percakapan dengan jelas. Catat respons terhadap instruksi.",
        bullets: [
          "Nilai sikap dan bahasa",
          "Jelaskan standar sapaan formal",
          "Catat respons terhadap instruksi",
        ],
      },
      {
        index: "05",
        title: "Phase 5: Kepangkatan dan Struktur Komando",
        description:
          "Jelaskan sistem kepangkatan PASKUS-791 mulai dari Prada, Pratu, hingga perwira. Tekankan siapa yang dimaksud perwira, apa peran dan penugasannya, serta bagaimana hierarki komando bekerja dalam operasi. Tanyakan apakah kandidat sudah paham.",
        bullets: [
          "Jelaskan jenjang kepangkatan",
          "Terangkan peran perwira",
          "Tanyakan pemahaman kandidat",
        ],
      },
      {
        index: "06",
        title: "Phase 6: Penjelasan Unit-Unit",
        description:
          "Jelaskan unit-unit yang ada di PASKUS-791: GATAM (stealth/infiltrasi), BRINGAS (infanteri berat), SERIGALA (serbu cepat), SENTINEL (medis/support), TORUK MAKTO (udara), dan PATHFINDER (recon/sniper). Jika kandidat sudah punya preferensi, catat. Penempatan akhir berdasarkan evaluasi komando.",
        bullets: [
          "Jelaskan tiap unit dan perannya",
          "Tanyakan preferensi unit kandidat",
          "Catat untuk tindak lanjut penempatan",
        ],
      },
      {
        index: "07",
        title: "Phase 7: Peraturan Komunitas dan Roleplay",
        description:
          "Bacakan larangan utama: spam, SARA, politik, pornografi, ujaran kebencian, bullying, doxing, powergaming, metagaming, mixing IC/OOC, dan gangguan terhadap operasi. Pastikan kandidat mengerti bahwa pelanggaran akan diproses bertahap hingga ban permanen.",
        bullets: [
          "Bacakan larangan aturan umum",
          "Jelaskan aturan IC/OOC roleplay",
          "Terangkan sanksi bertahap",
        ],
      },
      {
        index: "08",
        title: "Phase 8: Pembacaan SOP",
        description:
          "Minta kandidat untuk membaca dokumen SOP resmi komunitas dan resimen secara aktif. Evaluasi pemahaman mereka mengenai aturan IC/OOC, hierarki komando, serta larangan powergaming dan metagaming.",
        bullets: [
          "Pandu pembacaan materi SOP",
          "Konfirmasi pemahaman kandidat",
          "Catat respons pemahaman SOP",
        ],
      },
      {
        index: "09",
        title: "Phase 9: Pembacaan Sumpah Prajurit",
        description:
          "Pandu kandidat untuk membacakan Sumpah Prajurit PASKUS 791 secara khidmat dan jelas. Ini merupakan komitmen formal kandidat sebelum resmi bergabung ke resimen.",
        bullets: [
          "Pandu pembacaan teks sumpah",
          "Pastikan pengucapan khidmat dan jelas",
          "Catat kesungguhan kandidat",
        ],
      },
      {
        index: "10",
        title: "Phase 10: Penutup dan Rekomendasi",
        description:
          "Tutup sesi wawancara dengan mengucapkan terima kasih atas waktu kandidat. Beri tahu bahwa hasil akan dicatat dan keputusan akhir ditentukan oleh komando. Catat rekomendasi perekrut: LULUS, GAGAL, atau PROBATION beserta alasan singkat di laporan.",
        bullets: [
          "Tutup dengan kalimat formal",
          "Informasikan waktu tunggu keputusan",
          "Catat rekomendasi di laporan",
        ],
      },
    ],
    visualGuides: [],
    inputGuides: [
      {
        title: "Pertanyaan Validasi Identitas",
        required: "Wajib",
        description:
          "Validasi identitas harus singkat, jelas, dan mencakup data yang diperlukan agar laporan perekrutan akurat dan tidak mengandung data palsu.",
        fields: [
          "Nama Roblox dan nama Discord kandidat.",
          "Discord ID jika tersedia untuk keperluan tag laporan.",
          "Usia kandidat dan status asal: sipil, PMC, atau eks-resimen.",
          "Alasan bergabung ke PASKUS-791 secara singkat.",
        ],
      },
      {
        title: "Indikator Kesediaan Mengabdi",
        required: "Wajib",
        description:
          "Pertanyaan kesediaan menentukan apakah kandidat siap secara mental mengikuti sistem dan disiplin resimen.",
        fields: [
          "Apakah bersedia mengikuti aturan dan disiplin resimen tanpa pengecualian?",
          "Seberapa konsisten bisa hadir dalam sesi pelatihan dan operasi?",
          "Apakah bersedia menjaga nama baik satuan di dalam dan di luar game?",
        ],
      },
      {
        title: "Indikator Etika Komunikasi",
        required: "Wajib",
        description:
          "Standar komunikasi diamati langsung selama sesi wawancara. Jawaban tidak perlu panjang, tetapi harus sopan, jelas, dan tidak memancing konflik.",
        fields: [
          "Kandidat menggunakan bahasa yang sopan dan tidak spam selama wawancara.",
          "Kandidat merespons instruksi perekrut dengan cepat dan jelas.",
          "Kandidat memahami perbedaan IC (in-character) dan OOC (out-of-character).",
        ],
      },
      {
        title: "Penjelasan Kepangkatan",
        required: "Wajib Dijelaskan",
        description:
          "Perekrut wajib memberi orientasi singkat tentang jenjang kepangkatan agar kandidat punya gambaran tentang posisi awal dan jalur karir di PASKUS-791.",
        fields: [
          "Prada adalah pangkat awal semua anggota baru yang lulus seleksi.",
          "Pratu dan Praka didapat setelah memenuhi syarat masa pengabdian dan penilaian komando.",
          "Perwira memimpin unit, koordinasi operasi, dan mengambil keputusan strategis.",
          "Penempatan unit ditentukan berdasarkan evaluasi, kebutuhan resimen, dan arahan komando.",
        ],
      },
      {
        title: "Penjelasan Unit dan Fungsi",
        required: "Wajib Dijelaskan",
        description:
          "Kandidat perlu memahami perbedaan unit agar bisa menentukan minat dan komando bisa menempatkan dengan tepat.",
        fields: [
          "GATAM: infiltrasi senyap, stealth, dan penghancuran target vital secara presisi.",
          "BRINGAS: infanteri berat dan raider untuk garis depan dan kendaraan berat.",
          "SERIGALA: serbu cepat ke objektif prioritas seperti mortar dan anti-air.",
          "SENTINEL: medis dan support untuk revive, healing, dan stabilitas tim.",
          "TORUK MAKTO: unit udara untuk transportasi, infiltrasi, dan dukungan aviation.",
          "PATHFINDER: recon dan sniper support untuk observasi dan intel jarak jauh.",
        ],
      },
      {
        title: "Peraturan dan Sanksi",
        required: "Wajib Dibacakan",
        description:
          "Peraturan dibacakan agar kandidat memahami konsekuensi pelanggaran sebelum resmi bergabung.",
        fields: [
          "Dilarang spam, flood, SARA, politik, pornografi, ujaran kebencian, atau bullying.",
          "Dilarang doxing atau menyebarkan data pribadi anggota lain.",
          "Dilarang powergaming, metagaming, atau mixing IC/OOC.",
          "Sanksi bertahap: teguran, peringatan tertulis, pembinaan, demotion, hingga ban permanen.",
        ],
      },
      {
        title: "Alur Tindak Lanjut",
        required: "Informasi Wajib",
        description:
          "Kandidat perlu tahu apa yang terjadi setelah wawancara selesai agar tidak bingung menunggu tanpa kepastian.",
        fields: [
          "Hasil wawancara dicatat di aplikasi dan dikirim ke channel resimen.",
          "Kandidat lulus akan mendapat jadwal pelatihan fisik lanjutan.",
          "Pin Komodo dan Sertijab diberikan setelah laporan terkirim dan disetujui komando.",
          "Kandidat gagal atau probation diberi tahu alasan dan jalur pembinaan jika ada.",
        ],
      },
    ],
    featureGuides: [
      {
        name: "GATAM",
        detail:
          "Unit elite yang berfokus pada infiltrasi senyap, operasi stealth, dan penghancuran compound atau target vital secara presisi.",
      },
      {
        name: "BRINGAS",
        detail:
          "Infanteri berat atau raider yang mengutamakan daya tekan, kendaraan berat, dan operasi garis depan.",
      },
      {
        name: "SERIGALA",
        detail:
          "Unit serbu cepat menuju objektif prioritas seperti mortar, anti-air, dan sasaran vital lain.",
      },
      {
        name: "SENTINEL",
        detail:
          "Unit medis dan support yang bertanggung jawab pada revive, healing, dan stabilitas tim saat operasi.",
      },
      {
        name: "TORUK MAKTO",
        detail:
          "Unit udara untuk transportasi, infiltrasi, dan dukungan aviation sesuai instruksi operasi.",
      },
      {
        name: "PATHFINDER",
        detail:
          "Unit recon dan sniper support untuk observasi, intel, dan dukungan tembakan jarak jauh.",
      },
      {
        name: "PROBATION",
        detail:
          "Jalur evaluasi untuk kandidat di bawah batas usia, eks-resimen, atau kandidat yang perlu dipantau mental, disiplin, dan kedewasaannya.",
      },
      {
        name: "PIN KOMODO",
        detail:
          "Pin yang diberikan kepada anggota baru setelah lulus seleksi dan pelatihan. Prosesnya manual oleh admin Discord setelah laporan terkirim ke resimen.",
      },
      {
        name: "SERTIJAB",
        detail:
          "Serah terima jabatan yang dilakukan manual setelah laporan perekrutan dikirim dan disetujui komando. Tidak dijalankan secara otomatis oleh sistem.",
      },
      {
        name: "ROLEPLAY LANJUTAN",
        detail:
          "Anggota yang diberi role RP wajib memahami IC/OOC, disiplin komunikasi, dan batasan event. Materi RP ketat diprioritaskan untuk anggota yang cukup umur dan siap mengikuti alur.",
      },
    ],
    completionChecklist: [
      "Data kandidat: Roblox, Discord, usia, status asal, dan alasan bergabung sudah dicatat.",
      "Jawaban kesediaan mengabdi sudah dievaluasi dan dicatat di laporan.",
      "Etika komunikasi kandidat selama wawancara sudah diobservasi dan dicatat.",
      "Penjelasan kepangkatan dan unit sudah disampaikan dengan jelas.",
      "Peraturan umum dan roleplay sudah dibacakan.",
      "Alur pelatihan, pin, dan Sertijab sudah dijelaskan kepada kandidat.",
      "Status kandidat sudah ditentukan: LULUS, GAGAL, atau PROBATION.",
      "Laporan wawancara sudah dikirim ke resimen melalui aplikasi.",
      "Kandidat lulus sudah masuk antrian tindak lanjut Pin & Sertijab manual.",
    ],
    emergency: {
      title: "Protokol Kandidat Bermasalah",
      description:
        "Jika kandidat toxic, memancing konflik, memberikan data palsu, tidak kooperatif, atau tidak mampu mengikuti instruksi dasar wawancara, hentikan sesi dengan tenang. Catat alasan di laporan, laporkan ke atasan, dan jangan berikan rekomendasi LULUS sebelum ada klarifikasi komando.",
      code: "INTERVIEW-HOLD-01",
    },
    footer: [
      "Revisi SOP Wawancara Juni 2026",
      "Divisi Rekrutmen Paskus 791",
    ],
  },
  {
    id: "sop-roleplay-bahasa",
    layout: "sectioned",
    accent: "amber",
    cardEyebrow: "Aturan Umum dan Roleplay",
    cardSummary:
      "Standar komunikasi, disiplin komunitas, aturan IC/OOC, larangan powergaming dan metagaming, serta batasan perilaku selama perekrutan dan event roleplay.",
    badge: "ROLEPLAY",
    documentTag: "SOP-RP-COMMS-791",
    serial: "UPDATE ROLEPLAY MEI 2026",
    title: "SOP ATURAN UMUM DAN ROLEPLAY",
    description: "Standar bahasa, etika komunitas, dan disiplin IC/OOC.",
    pills: ["SOPAN", "IC/OOC JELAS", "NO POWERGAMING"],
    sections: [
      {
        index: "01.",
        title: "ATURAN PEMANGGILAN",
        intro:
          "Gunakan sapaan formal yang konsisten selama proses rekrutmen dan roleplay agar interaksi terlihat rapi, dewasa, dan berwibawa.",
        bullets: [
          "Gunakan Sir untuk kandidat laki-laki.",
          "Gunakan Madam untuk kandidat perempuan.",
          "Jika gender belum jelas, gunakan panggilan netral seperti Recruit atau Candidate sampai kandidat mengoreksi sendiri.",
          "Hindari bercanda berlebihan saat briefing, pembacaan SOP, dan penilaian akhir.",
        ],
      },
      {
        index: "02.",
        title: "CONTOH BAHASA OPERASIONAL",
        intro: "",
        cards: [
          {
            title: "PEMBUKAAN",
            text: '"Good evening, Sir. Saya dari tim rekrutmen PASKUS-791. Apakah Anda siap mengikuti screening singkat sebelum sesi pelatihan?"',
          },
          {
            title: "ARAHAN",
            text: '"Madam, mohon jawab dengan singkat dan jelas. Setelah jawaban diterima, saya akan lanjutkan ke instruksi berikutnya."',
          },
          {
            title: "PENUTUP",
            text: '"Terima kasih atas waktunya, Sir. Hasil penilaian Anda akan kami catat dan dilanjutkan sesuai keputusan pelatih."',
          },
        ],
      },
      {
        index: "03.",
        title: "ETIKA UMUM KOMUNITAS",
        intro: "",
        protocols: [
          {
            tag: "UMUM 3.1",
            text: "Dilarang spam, flood chat, atau menggunakan huruf kapital berlebihan untuk menekan anggota lain.",
          },
          {
            tag: "UMUM 3.2",
            text: "Dilarang membawa SARA, politik, pornografi, ujaran kebencian, atau konten yang memancing konflik.",
          },
          {
            tag: "UMUM 3.3",
            text: "Dilarang bullying, perpeloncoan berlebihan, ancaman personal, atau membagikan data pribadi anggota lain.",
          },
          {
            tag: "UMUM 3.4",
            text: "Hormati struktur komando. Kritik boleh disampaikan melalui jalur yang benar, bukan dengan mempermalukan orang di ruang publik.",
          },
        ],
      },
      {
        index: "04.",
        title: "ATURAN ROLEPLAY",
        intro:
          "Roleplay harus menjaga lore, struktur militer, dan suasana operasi. Pemain wajib membedakan percakapan karakter dengan percakapan luar karakter.",
        protocols: [
          {
            tag: "RP 4.1",
            text: "Gunakan IC untuk ucapan, keputusan, dan tindakan karakter di dalam skenario operasi.",
          },
          {
            tag: "RP 4.2",
            text: "Gunakan OOC untuk pembahasan teknis, klarifikasi, atau hal yang tidak terjadi di dunia roleplay.",
          },
          {
            tag: "RP 4.3",
            text: "Dilarang metagaming, yaitu memakai informasi OOC untuk keuntungan karakter IC.",
          },
          {
            tag: "RP 4.4",
            text: "Dilarang powergaming, yaitu memaksakan tindakan yang tidak memberi kesempatan respons wajar kepada pemain lain.",
          },
          {
            tag: "RP 4.5",
            text: "Dilarang mixing, yaitu mencampur informasi IC dan OOC sampai merusak alur roleplay.",
          },
          {
            tag: "RP 4.6",
            text: "Jangan mengganggu misi, briefing, atau event hanya untuk bercanda di luar konteks roleplay.",
          },
        ],
      },
      {
        index: "05.",
        title: "LARANGAN DAN STANDAR",
        intro: "",
        mandatoryTitle: "WAJIB DILAKUKAN",
        mandatoryItems: [
          "Sapa dengan formal.",
          "Jaga nada tetap tenang.",
          "Pisahkan IC dan OOC.",
          "Ikuti callsign dan hierarki.",
          "Tutup percakapan dengan jelas.",
        ],
        failureTitle: "TIDAK BOLEH",
        failureItems: [
          "Memanggil kandidat dengan kata kasar atau bercanda berlebihan.",
          "Menggunakan huruf kapital penuh untuk menekan kandidat.",
          "Meninggalkan percakapan tanpa keputusan atau penutup.",
          "Membocorkan data pribadi, memancing drama, atau menyebar konflik lintas channel.",
          "Mengambil keputusan roleplay besar tanpa izin struktur komando.",
        ],
      },
      {
        index: "06.",
        title: "SANKSI DAN PEMBINAAN",
        intro:
          "Pelanggaran ditangani bertahap sesuai tingkat kesalahan. Pelatih tetap wajib mencatat kejadian agar komando dapat mengambil keputusan yang adil.",
        bullets: [
          "Pelanggaran ringan dapat diberi teguran lisan atau peringatan tertulis.",
          "Pelanggaran berulang dapat berujung pembinaan, demotion, pembatasan akses, atau probation.",
          "Pelanggaran berat seperti doxing, ujaran kebencian, atau sabotase operasi dapat diproses ke ban permanen.",
          "Materi roleplay lanjutan dapat dibatasi untuk anggota yang sudah cukup umur, memahami IC/OOC, dan siap mengikuti disiplin event.",
        ],
      },
    ],
  },
  {
    id: "sop-penggunaan-web",
    layout: "framework",
    accent: "rose",
    cardEyebrow: "SOP Penggunaan Aplikasi",
    cardSummary:
      "Panduan lengkap penggunaan aplikasi staff: login, perekrutan wawancara awal, sesi pengambilan Pin (Wingman & Latpur) dengan auto-grant role, serta monitoring Perlu Tindakan.",
    badge: "WEB",
    documentTag: "SOP-APP-REKRUT-791",
    serial: "APP FLOW REVISION JUNI 2026",
    title: "SOP PENGGUNAAN APLIKASI STAFF PASKUS",
    description:
      "Dokumen ini menjelaskan alur penggunaan portal staff secara komprehensif, mencakup dua alur operasional utama: Sesi Wawancara Perekrutan (calon anggota baru) dan Sesi Pengambilan Pin khusus (Wingman & Pin Latpur) dengan otomatisasi pemberian role Discord dan laporan sertijab.",
    referenceLabel: "Mode Sistem",
    referenceValue: "STAFF PORTAL V2",
    overviewTitle: "Alur Utama Aplikasi",
    overviewDescription:
      "Aplikasi staff terbagi menjadi dua alur utama: 1) Sesi Wawancara Perekrutan untuk memproses pendaftaran calon anggota baru (Sipil/PMC) menjadi Prada secara manual; dan 2) Sesi Pengambilan Pin untuk menguji anggota aktif guna mendapatkan Pin Wingman atau Pin Latpur, yang dilengkapi fitur pemindaian Voice Channel, auto-save fase SOP, dan pemberian role Discord secara otomatis oleh bot resimen.",
    directives: [
      {
        label: "ALUR WAWANCARA",
        text: '"Pilih Kandidat -> Buka Pelatihan -> Isi Evaluasi Wawancara -> Kirim Laporan Resimen (Tag manual / tidak ada auto-role)."',
      },
      {
        label: "ALUR AMBIL PIN",
        text: '"Masuk Menu Pin -> Pilih Tipe Pin & Pindai VC -> Pilih Peserta -> Buka Sesi -> Nilai 9 Fase SOP (Auto-Save) -> Nilai Akhir LULUS -> Kirim Sertijab (Auto-Grant Role)."',
      },
      {
        label: "PRINSIP AUTO-SAVE",
        text: '"Semua penilaian fase L/G/B dan kolom catatan pada sesi Pengambilan Pin disimpan secara otomatis ke database saat kursor berpindah dari bidang input (onBlur)."',
      },
    ],
    fieldSpecs: [
      { label: "Login Staff", value: "Masukkan username dan password portal" },
      { label: "Dashboard", value: "Pilih kandidat wawancara awal" },
      { label: "Menu Pin", value: "Akses sesi pengujian Pin Wingman & Latpur" },
      { label: "Voice Scan", value: "Daftar anggota aktif di Voice Channel Discord staff" },
      { label: "Penilaian 9 Fase", value: "Evaluasi taktis/fisik berdasarkan SOP" },
      { label: "Auto-Save", value: "Data tersimpan otomatis saat focus input hilang" },
      { label: "Auto-Role Discord", value: "Pemberian role otomatis bagi peserta lulus" },
      { label: "Hasil Laporan", value: "Histori, edit arsip, & tambah laporan" },
      { label: "Perlu Tindakan", value: "Monitoring data yang belum diselesaikan" },
    ],
    phases: [
      {
        index: "01",
        title: "Phase 1: Login dan Membaca Dashboard",
        description:
          "Masuk menggunakan akun petugas (contoh: paskusadmin). Periksa dashboard pendaftaran untuk melihat daftar kandidat Sipil dan PMC yang siap diproses wawancara awal.",
        bullets: ["Masuk portal staff", "Pastikan status operator aktif"],
      },
      {
        index: "02",
        title: "Phase 2: Wawancara Perekrutan Awal",
        description:
          "Pilih calon anggota dari dashboard, klik Buka Pelatihan, dan isi evaluasi wawancara berdasarkan 9 topik standardisasi. Gunakan template indikator wawancara [IDENTITAS] hingga [PELATIHAN] untuk mencatat jawaban lisan.",
        bullets: ["Pilih calon kandidat", "Isi hasil wawancara lisan"],
      },
      {
        index: "03",
        title: "Phase 3: Kirim Laporan Wawancara (Manual)",
        description:
          "Setelah laporan wawancara diisi, klik Kirim Laporan untuk mengirim embed ke Discord resimen. Catatan: Untuk perekrutan awal ini, pemberian role Prada dan administrasi nama dilakukan manual oleh pengurus.",
        bullets: ["Kirim ke Discord resimen", "Proses administrasi manual"],
      },
      {
        index: "04",
        title: "Phase 4: Buka Sesi Pengambilan Pin",
        description:
          "Buka menu Pin di bottom nav. Pilih tipe pin (Pin Wingman atau Pin Latpur). Masuk ke Voice Channel Discord bersama peserta, lalu klik 'Segarkan VC'. Pilih nama peserta yang terdeteksi, kemudian klik 'Buka Sesi Penilaian'.",
        bullets: ["Pilih Wingman / Latpur", "Pindai VC & pilih peserta"],
      },
      {
        index: "05",
        title: "Phase 5: Nilai Fase SOP (Ambil Pin)",
        description:
          "Nilai ke-9 fase taktis dan fisik. Klik tombol status: L (Lulus), G (Gagal), atau B (Belum) dan ketik catatan performa. Sistem akan otomatis menyimpan data penilaian ke server setiap kali Anda memindahkan kursor (onBlur).",
        bullets: ["Nilai 9 fase kelulusan", "Fitur auto-save aktif saat blur"],
      },
      {
        index: "06",
        title: "Phase 6: Penentuan Kelulusan Pin",
        description:
          "Tentukan Nilai Akhir peserta di bagian atas (Lulus / Gagal / Belum). Hanya peserta yang diberi Nilai Akhir LULUS yang akan secara otomatis mendapatkan role Discord yang bersangkutan ketika sesi dikirim.",
        bullets: ["Pilih status kelulusan akhir", "Hanya LULUS yang dapat role"],
      },
      {
        index: "07",
        title: "Phase 7: Kirim Laporan Sertijab Pin (Otomatis)",
        description:
          "Periksa pratinjau dokumen Uji Mutu yang dikompilasi secara real-time. Klik 'Kirim Sertijab & Selesai'. Bot resimen akan otomatis mengirim laporan Uji Mutu ke Discord dan memberikan role Wingman atau Pin Latpur kepada peserta yang lulus.",
        bullets: ["Kirim Sertijab ke Discord", "Auto-grant role Discord oleh bot"],
      },
      {
        index: "08",
        title: "Phase 8: Monitoring dan Hasil Laporan",
        description:
          "Gunakan menu Perlu Tindakan untuk memantau data yang belum tuntas dikirim. Jika terjadi kesalahan input pada sesi yang sudah terkirim, buka menu Hasil Laporan untuk mengedit arsip atau menambahkan laporan tambahan.",
        bullets: ["Cek status di Perlu Tindakan", "Edit arsip di Hasil Laporan"],
      },
    ],
    inputGuides: [
      {
        title: "Pendaftaran Wawancara",
        required: "Roblox, Discord name, & evaluasi tertulis",
        description:
          "Gunakan data pendaftaran yang sinkron. Tulis jawaban dan catatan wawancara sesuai template format indikator SOP Perekrutan agar hasil penilaian objektif.",
        fields: [
          "Nama Roblox & Discord: identitas wajib kandidat.",
          "Hasil wawancara: isi catatan di setiap blok indikator [IDENTITAS] dst.",
          "Status kelulusan: tentukan kelayakan lolos seleksi.",
        ],
      },
      {
        title: "Voice Channel Roster (Sesi Pin)",
        required: "Masuk Voice Channel Discord bersama peserta",
        description:
          "Pemindaian voice channel menyinkronkan data peserta secara real-time. Perekrut wajib berada di voice channel yang sama dengan peserta agar sistem bot dapat membaca daftar anggota yang aktif.",
        fields: [
          "Tombol Segarkan VC: memindai ulang anggota di Voice Channel.",
          "Checklist peserta: centang nama peserta yang akan diuji.",
          "Jika nama tidak muncul: pastikan Discord ID operator telah diisi di menu Petugas.",
        ],
      },
      {
        title: "Penilaian Fase (Sesi Pin)",
        required: "Kelulusan fase (L/G/B) & catatan performa",
        description:
          "Setiap fase dari 9 fase taktis SOP diisi nilainya secara individual. Kursor yang keluar dari textarea catatan atau perubahan tombol status akan memicu auto-save ke server.",
        fields: [
          "Status L (Lulus): memenuhi syarat standar kelulusan fase.",
          "Status G (Gagal): tidak memenuhi syarat, tulis rujukan di catatan.",
          "Status B (Belum): belum diuji atau dinilai.",
          "Kolom catatan: rujukan alasan meloloskan/menggagalkan sesuai standar SOP.",
        ],
      },
      {
        title: "Laporan Uji Mutu & Sertijab",
        required: "Nilai Akhir LULUS & verifikasi pratinjau",
        description:
          "Uji Mutu dikompilasi secara otomatis berdasarkan performa fase yang dinilai. Sebelum mengirim, verifikasi draf Uji Mutu pada kotak pratinjau.",
        fields: [
          "Nilai Akhir: ubah status ke LULUS untuk memicu pemberian role.",
          "Preview Uji Mutu: tampilan laporan akhir yang akan dikirim ke Discord.",
          "Tombol Kirim: memicu pengiriman webhook & auto-role secara instan.",
        ],
      },
    ],
    featureGuides: [
      {
        name: "Dashboard Pelatih",
        detail:
          "Tempat memantau pendaftar baru, memilih peserta, dan mengelola sesi wawancara awal.",
      },
      {
        name: "Menu Pengambilan Pin",
        detail:
          "Menu khusus staff tertentu untuk menguji Pin Wingman & Latpur berbasis 9 fase kelulusan SOP.",
      },
      {
        name: "Real-time Voice Scan",
        detail:
          "Membaca daftar anggota Discord aktif di Voice Channel yang sama dengan petugas penguji secara instan.",
      },
      {
        name: "Auto-Save Penilaian",
        detail:
          "Menyimpan otomatis progres penilaian fase dan catatan ketika kursor meninggalkan bidang input (onBlur).",
      },
      {
        name: "Auto-Role Discord",
        detail:
          "Bot resimen secara otomatis memberikan role Wingman / Pin Latpur ke Discord peserta yang dinyatakan LULUS.",
      },
      {
        name: "Hasil Laporan & Perlu Tindakan",
        detail:
          "Monitoring data pendaftaran tertunda dan penyimpanan histori arsip yang bisa diedit kembali.",
      },
    ],
    completionChecklist: [
      "Semua sesi wawancara awal dikirim manual ke resimen (tanpa auto-role).",
      "Sesi pengambilan pin dibuka dengan memindai Voice Channel aktif.",
      "Seluruh fase penilaian (9 fase) diisi status kelulusannya.",
      "Catatan performa fase ditulis dengan referensi standar SOP.",
      "Nilai Akhir peserta diatur ke LULUS agar mendapatkan role.",
      "Sertijab dikirim dan role Discord (Wingman/Latpur) ter-grant otomatis oleh bot.",
      "Sesi yang telah diselesaikan diarsip di Hasil Laporan.",
      "Status antrean di Perlu Tindakan untuk sesi terkait telah bersih.",
    ],
    emergency: {
      title: "Protokol Salah Input dan Gangguan Bot Role",
      description:
        "Jika bot gagal memberikan role otomatis karena kendala API Discord, status sesi akan ditandai FAILED. Pelatih dapat memeriksa koneksi bot, memverifikasi role manual di Discord, lalu menambahkan catatan penjelas di Hasil Laporan untuk arsip komando.",
      code: "APP-FAILSAFE-04",
    },
    footer: [
      "Revisi Penggunaan Aplikasi Juni 2026",
      "Divisi Rekrutmen Paskus 791",
    ],
  },
];

function getSopAccentClasses(accent) {
  if (accent === "rose") {
    return {
      text: "text-rose-300",
      border: "border-rose-400/30",
      bg: "bg-rose-500/10",
      bar: "bg-rose-400",
      chip: "border-rose-400/25 bg-rose-500/10 text-rose-200",
    };
  }

  if (accent === "amber") {
    return {
      text: "text-amber-300",
      border: "border-amber-300/30",
      bg: "bg-amber-400/10",
      bar: "bg-amber-300",
      chip: "border-amber-300/25 bg-amber-400/10 text-amber-100",
    };
  }

  return {
    text: "text-[#b8ce82]",
    border: "border-[#a5c76d]/30",
    bg: "bg-[#a5c76d]/10",
    bar: "bg-[#a5c76d]",
    chip: "border-[#a5c76d]/25 bg-[#a5c76d]/10 text-[#dce8bb]",
  };
}

function SopLibraryCard({ document, isActive, onOpen }) {
  const accent = getSopAccentClasses(document.accent);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative overflow-hidden border p-5 text-left transition ${
        isActive
          ? `${accent.border} bg-[#20201d] shadow-[0_18px_60px_rgba(0,0,0,0.28)]`
          : "border-white/6 bg-[#141414] hover:border-white/10 hover:bg-[#181818]"
      }`}
    >
      <div className={`absolute left-0 top-0 h-full w-1 ${accent.bar}`} />
      <div className="pl-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className={`font-public text-[9px] uppercase tracking-[0.28em] ${accent.text}`}
            >
              {document.cardEyebrow}
            </p>
            <h3 className="mt-3 font-sans text-2xl font-bold uppercase text-stone-100">
              {document.title}
            </h3>
          </div>

          <span
            className={`border px-2 py-1 font-public text-[8px] font-bold uppercase tracking-[0.16em] ${accent.chip}`}
          >
            {document.badge}
          </span>
        </div>

        <p className="mt-4 text-sm leading-6 text-stone-400">
          {document.cardSummary}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/6 pt-4">
          <div>
            <p className="font-public text-[8px] uppercase tracking-[0.16em] text-stone-500">
              {document.documentTag}
            </p>
            <p className="mt-2 font-public text-[9px] uppercase tracking-[0.14em] text-stone-400">
              {document.serial}
            </p>
          </div>

          <span
            className={`font-public text-[9px] font-bold uppercase tracking-[0.2em] transition ${isActive ? accent.text : "text-stone-500 group-hover:text-stone-300"}`}
          >
            {isActive ? "Opened" : "Open SOP"}
          </span>
        </div>
      </div>
    </button>
  );
}

function SopFrameworkDetail({ document }) {
  const accent = getSopAccentClasses(document.accent);

  return (
    <div className="space-y-6">
      <section className="border border-white/6 bg-[#171717] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`border px-2 py-1 font-public text-[8px] font-bold uppercase tracking-[0.18em] ${accent.chip}`}
              >
                {document.documentTag}
              </span>
              <span className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
                {document.serial}
              </span>
            </div>

            <h2 className="mt-4 font-sans text-4xl font-bold uppercase leading-none text-stone-100 md:text-5xl">
              {document.title}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-400">
              {document.description}
            </p>
          </div>

          <div className="min-w-[180px] border border-white/6 bg-black/20 px-4 py-4 text-left lg:text-right">
            <p
              className={`font-public text-[10px] font-bold uppercase tracking-[0.22em] ${accent.text}`}
            >
              {document.referenceLabel}
            </p>
            <p className="mt-2 font-public text-[10px] uppercase tracking-[0.16em] text-stone-400">
              {document.referenceValue}
            </p>
          </div>
        </div>

        <div className={`mt-6 h-px ${accent.bg}`} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="border border-white/6 bg-[#1a1a1a] p-6">
          <div className="flex items-center gap-3">
            <span className={`grid h-10 w-10 place-items-center ${accent.bg}`}>
              <svg
                viewBox="0 0 20 20"
                className={`h-5 w-5 ${accent.text}`}
                fill="currentColor"
              >
                <path d="M10 2l7 3.5V10c0 4.1-2.7 6.9-7 8-4.3-1.1-7-3.9-7-8V5.5L10 2zm0 2.2L5 6.6V10c0 2.9 1.7 5 5 6.1 3.3-1.1 5-3.2 5-6.1V6.6l-5-2.4z" />
              </svg>
            </span>
            <h3 className="font-sans text-3xl font-bold text-stone-100">
              {document.overviewTitle}
            </h3>
          </div>

          <p className="mt-5 text-sm leading-7 text-stone-400">
            {document.overviewDescription}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {document.directives.map((directive) => (
              <div
                key={directive.label}
                className="border border-white/6 bg-black/25 p-4"
              >
                <p
                  className={`font-public text-[9px] font-bold uppercase tracking-[0.18em] ${accent.text}`}
                >
                  {directive.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                  {directive.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-white/6 bg-[#161616] p-6">
          <p
            className={`font-public text-[10px] font-bold uppercase tracking-[0.28em] ${accent.text}`}
          >
            Field Specifications
          </p>
          <div className="mt-6 space-y-5">
            {document.fieldSpecs.map((spec) => (
              <div
                key={spec.label}
                className="flex flex-col gap-2 border-b border-white/6 pb-4 last:border-b-0 last:pb-0 md:flex-row md:items-center md:justify-between"
              >
                <p className="font-public text-[10px] uppercase tracking-[0.18em] text-stone-500">
                  {spec.label}
                </p>
                <p className="font-public text-[12px] font-semibold uppercase tracking-[0.06em] text-stone-200">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {document.phases.map((phase, index) => (
          <section
            key={phase.index}
            className={`border bg-[#1b1b1b] p-6 ${
              index === 0
                ? "border-[#a5c76d]/30"
                : index === 1
                  ? "border-amber-300/25"
                  : "border-white/6"
            }`}
          >
            <p className="font-sans text-4xl font-bold text-stone-600">
              {phase.index}
            </p>
            <h3 className="mt-5 font-sans text-2xl font-bold uppercase text-stone-100">
              {phase.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-stone-400">
              {phase.description}
            </p>

            {phase.image ? (
              <figure className="mt-5 overflow-hidden border border-white/6 bg-black/25">
                <img
                  src={phase.image}
                  alt={phase.imageAlt ?? phase.title}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
                {phase.imageCaption ? (
                  <figcaption className="border-t border-white/6 px-3 py-2 text-xs leading-5 text-stone-400">
                    {phase.imageCaption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}

            <div className="mt-6 space-y-3">
              {phase.bullets.map((bullet) => (
                <div key={bullet} className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${accent.bar}`} />
                  <p className="font-public text-[10px] font-bold uppercase tracking-[0.14em] text-stone-300">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {document.visualGuides ? (
        <section className="border border-white/6 bg-[#181818] p-6">
          <div className="flex flex-col gap-3 border-b border-white/6 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p
                className={`font-public text-[10px] font-bold uppercase tracking-[0.28em] ${accent.text}`}
              >
                Referensi Visual
              </p>
              <h3 className="mt-2 font-sans text-3xl font-bold uppercase text-stone-100">
                Foto Panduan Lapangan
              </h3>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-stone-400">
              Foto dari dokumen panduan dipakai sebagai acuan cepat agar
              pelatih tidak perlu membuka file terpisah saat sesi berjalan.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {document.visualGuides.map((guide) => (
              <article
                key={guide.title}
                className="overflow-hidden border border-white/6 bg-black/20"
              >
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <p
                    className={`font-public text-[9px] font-bold uppercase tracking-[0.18em] ${accent.text}`}
                  >
                    {guide.title}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-stone-300">
                    {guide.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {document.inputGuides ? (
        <section className="border border-white/6 bg-[#161616] p-6">
          <div className="flex flex-col gap-3 border-b border-white/6 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p
                className={`font-public text-[10px] font-bold uppercase tracking-[0.28em] ${accent.text}`}
              >
                Panduan Pengisian
              </p>
              <h3 className="mt-2 font-sans text-3xl font-bold uppercase text-stone-100">
                Data yang Wajib Diisi
              </h3>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-stone-400">
              Gunakan bagian ini sebagai checklist saat mengoperasikan aplikasi
              supaya data yang masuk ke laporan, dispatch, dan sertijab tetap
              konsisten.
            </p>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {document.inputGuides.map((guide) => (
              <article
                key={guide.title}
                className="border border-white/6 bg-black/20 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-sans text-xl font-bold text-stone-100">
                      {guide.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-400">
                      {guide.description}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 border px-2 py-1 font-public text-[8px] font-bold uppercase tracking-[0.16em] ${accent.chip}`}
                  >
                    {guide.required}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {guide.fields.map((field) => (
                    <div key={field} className="flex items-start gap-3">
                      <span className={`mt-2 h-1.5 w-1.5 ${accent.bar}`} />
                      <p className="text-sm leading-6 text-stone-300">
                        {field}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {document.featureGuides ? (
        <section className="border border-white/6 bg-[#181818] p-6">
          <p
            className={`font-public text-[10px] font-bold uppercase tracking-[0.28em] ${accent.text}`}
          >
            Pembahasan Fitur
          </p>
          <h3 className="mt-2 font-sans text-3xl font-bold uppercase text-stone-100">
            Fungsi Tiap Menu
          </h3>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {document.featureGuides.map((feature) => (
              <article
                key={feature.name}
                className="border border-white/6 bg-black/20 p-4"
              >
                <p
                  className={`font-public text-[9px] font-bold uppercase tracking-[0.18em] ${accent.text}`}
                >
                  {feature.name}
                </p>
                <p className="mt-3 text-sm leading-6 text-stone-300">
                  {feature.detail}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {document.completionChecklist ? (
        <section className="border border-white/6 bg-[#1a1a1a] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p
                className={`font-public text-[10px] font-bold uppercase tracking-[0.28em] ${accent.text}`}
              >
                Checklist Akhir
              </p>
              <h3 className="mt-2 font-sans text-3xl font-bold uppercase text-stone-100">
                Sesi Dianggap Selesai Jika
              </h3>
            </div>
            <span
              className={`border px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] ${accent.chip}`}
            >
              Final Check
            </span>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {document.completionChecklist.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 border border-white/6 bg-black/20 px-4 py-3"
              >
                <span
                  className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full ${accent.bg}`}
                >
                  <svg
                    viewBox="0 0 16 16"
                    className={`h-3.5 w-3.5 ${accent.text}`}
                    fill="currentColor"
                  >
                    <path d="M6.4 11.2 3.3 8.1l1.1-1.1 2 2 5.2-5.2 1.1 1.1-6.3 6.3z" />
                  </svg>
                </span>
                <p className="text-sm leading-6 text-stone-300">{item}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 border border-white/6 bg-[#181818] p-5 md:grid-cols-[minmax(0,1fr)_220px]">
        <div className="flex items-start gap-4">
          <div className={`grid h-16 w-16 place-items-center ${accent.bg}`}>
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 text-white"
              fill="currentColor"
            >
              <path d="M12 3l10 18H2L12 3zm0 4.2L5.4 19h13.2L12 7.2zm-1 4.3h2v4h-2v-4zm0 5.5h2v2h-2v-2z" />
            </svg>
          </div>
          <div>
            <p
              className={`font-public text-[10px] font-bold uppercase tracking-[0.22em] ${accent.text}`}
            >
              {document.emergency.title}
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              {document.emergency.description}
            </p>
          </div>
        </div>

        <div className="border border-white/6 bg-black/30 px-5 py-4">
          <p className="font-public text-[8px] uppercase tracking-[0.2em] text-stone-500">
            Protocol Identifier
          </p>
          <p
            className={`mt-4 font-sans text-3xl font-bold uppercase ${accent.text}`}
          >
            {document.emergency.code}
          </p>
        </div>
      </section>

      <div className="flex flex-col gap-3 border-t border-white/6 pt-5 font-public text-[10px] uppercase tracking-[0.2em] text-stone-500 md:flex-row md:items-center md:justify-between">
        {document.footer.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function SopSectionedDetail({ document }) {
  const accent = getSopAccentClasses(document.accent);

  return (
    <div className="space-y-6">
      <section className="border border-white/6 bg-[#171717] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <p
              className={`font-public text-[9px] font-bold uppercase tracking-[0.22em] ${accent.text}`}
            >
              {document.documentTag}
            </p>
            <p className="font-public text-[9px] uppercase tracking-[0.18em] text-stone-500">
              {document.serial}
            </p>
          </div>

          <h2
            className={`font-sans text-4xl font-bold uppercase leading-none md:text-5xl ${accent.text}`}
          >
            {document.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {document.pills.map((pill) => (
              <span
                key={pill}
                className={`border px-2 py-1 font-public text-[8px] font-bold uppercase tracking-[0.16em] ${accent.chip}`}
              >
                {pill}
              </span>
            ))}
            <p className="font-public text-[9px] uppercase tracking-[0.16em] text-stone-500">
              {document.description}
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-5">
        {document.sections.map((section) => (
          <section
            key={section.index}
            className="border border-white/6 bg-[#1c1c1c] p-6"
          >
            <div className="flex items-center gap-4">
              <span
                className={`grid h-10 w-10 place-items-center ${accent.bg}`}
              >
                <svg
                  viewBox="0 0 20 20"
                  className={`h-4 w-4 ${accent.text}`}
                  fill="currentColor"
                >
                  <path d="M10 2l6 3.4v5.2c0 3.7-2.4 6.2-6 7.4-3.6-1.2-6-3.7-6-7.4V5.4L10 2zm0 2.3L6 6.6v4c0 2.5 1.4 4.4 4 5.4 2.6-1 4-2.9 4-5.4v-4l-4-2.3z" />
                </svg>
              </span>
              <div>
                <p
                  className={`font-sans text-2xl font-bold uppercase ${accent.text}`}
                >
                  {section.index} {section.title}
                </p>
                {section.intro ? (
                  <p className="mt-3 text-sm leading-7 text-stone-400">
                    {section.intro}
                  </p>
                ) : null}
              </div>
            </div>

            {section.bullets ? (
              <div className="mt-6 space-y-4">
                {section.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-3">
                    <span
                      className={`mt-2 h-1.5 w-1.5 rounded-full ${accent.bar}`}
                    />
                    <p className="text-sm leading-7 text-stone-300">{bullet}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {section.cards ? (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {section.cards.map((card) => (
                  <div
                    key={card.title}
                    className="border border-white/6 bg-black/30 p-4"
                  >
                    <p
                      className={`font-public text-[9px] font-bold uppercase tracking-[0.18em] ${accent.text}`}
                    >
                      {card.title}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-stone-400">
                      {card.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            {section.protocols ? (
              <div className="mt-6 space-y-3">
                {section.protocols.map((protocol) => (
                  <div
                    key={protocol.tag}
                    className="flex flex-col gap-3 border border-white/6 bg-black/20 px-4 py-3 md:flex-row md:items-center"
                  >
                    <span
                      className={`border px-2 py-1 font-public text-[8px] font-bold uppercase tracking-[0.14em] ${accent.chip}`}
                    >
                      {protocol.tag}
                    </span>
                    <p className="text-sm leading-6 text-stone-300">
                      {protocol.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            {section.mandatoryItems ? (
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="border border-white/6 bg-black/20 p-4">
                  <p
                    className={`font-public text-[9px] font-bold uppercase tracking-[0.18em] ${accent.text}`}
                  >
                    {section.mandatoryTitle}
                  </p>
                  <div className="mt-4 space-y-3">
                    {section.mandatoryItems.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#a5c76d]" />
                        <p className="font-public text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-300">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-white/6 bg-black/20 p-4">
                  <p className="font-public text-[9px] font-bold uppercase tracking-[0.18em] text-rose-300">
                    {section.failureTitle}
                  </p>
                  <div className="mt-4 space-y-3">
                    {section.failureItems.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <span className="mt-2 h-2 w-2 rounded-full bg-rose-400" />
                        <p className="text-sm leading-6 text-stone-300">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}

function SopDocumentDetail({ document }) {
  if (document.layout === "sectioned") {
    return <SopSectionedDetail document={document} />;
  }

  return <SopFrameworkDetail document={document} />;
}

export default function SopPage() {
  const [activeDocumentId, setActiveDocumentId] =
    useState("sop-perekrut-brm5");

  const activeDocument = useMemo(
    () =>
      SOP_LIBRARY.find((document) => document.id === activeDocumentId) ??
      SOP_LIBRARY[0],
    [activeDocumentId],
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="relative overflow-hidden border border-white/6 bg-[#141414] px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:px-8">
        <div className="absolute left-0 top-8 h-12 w-1 bg-amber-300" />

        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <p className="font-public text-[10px] uppercase tracking-[0.3em] text-amber-300">
              Standard Operating Procedure
            </p>
            <h1 className="font-sans text-4xl font-bold uppercase leading-none text-stone-200 md:text-5xl">
              SOP Library
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-stone-400">
              Pusat panduan operasional untuk recruiter dan staff Paskus 791.
              Buka dokumen sesuai kebutuhan: pelatihan rekrutmen, penggunaan
              aplikasi, serta aturan umum dan roleplay.
            </p>
          </div>

          <div className="border border-white/6 bg-black/20 px-4 py-4 text-left xl:text-right">
            <p className="font-public text-[10px] uppercase tracking-[0.2em] text-stone-500">
              Active Document
            </p>
            <p className="mt-2 font-sans text-2xl font-bold uppercase text-stone-100">
              {activeDocument.title}
            </p>
            <p className="mt-2 font-public text-[9px] uppercase tracking-[0.16em] text-stone-400">
              {activeDocument.serial}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {SOP_LIBRARY.map((document) => (
          <SopLibraryCard
            key={document.id}
            document={document}
            isActive={document.id === activeDocument.id}
            onOpen={() => setActiveDocumentId(document.id)}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeDocument.id}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-4">
            <div>
              <p className="font-public text-[10px] uppercase tracking-[0.22em] text-stone-500">
                Opened SOP
              </p>
              <p className="mt-2 font-sans text-2xl font-bold uppercase text-stone-100">
                {activeDocument.title}
              </p>
            </div>

            <span
              className={`border px-3 py-2 font-public text-[9px] font-bold uppercase tracking-[0.16em] ${getSopAccentClasses(activeDocument.accent).chip}`}
            >
              {activeDocument.badge}
            </span>
          </div>

          <SopDocumentDetail document={activeDocument} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
