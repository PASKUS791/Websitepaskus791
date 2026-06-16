import brigas from "../assets/images/brigas.webp";
import toruk from "../assets/images/toruk.webp";
import pathFinder from "../assets/images/pathfinder.webp";
import sentinel from "../assets/images/sentinel.webp";
import sierra from "../assets/images/sierra.webp";
import gatam from "../assets/images/gatam.webp";

import paskus from "../assets/images/paskus.webp";




// import zeni from "../assets/images/zeni.webp";
// import kopen from "../assets/images/kopen.webp";
// import dpdm from "../assets/images/dpdm.webp";
// import propa from "../assets/images/propa.webp";
import logoDefault from "../assets/images/default.png";

export const unit = [
  {
    headingSatu: "GATAM SPECIAL FORCE",
    headingDua: "GATAM SF",
    img: gatam,
    path: "gatam",
    deskripsi:
      "Unit klandestin tingkat tinggi. Spesialisasi infiltrasi dalam senyap dan eliminasi target bernilai tinggi.",
    class: "card-Gatam",
  },
  {
    headingSatu: "SIERRA",
    headingDua: "SIERRA",
    img: sierra,
    path: "sierra",
    deskripsi:
      "Rapid Action & Swift Strike Unit. Divisi infanteri khusus yang bergerak cepat, sigap, dan terukur.",
    class: "card-sierra",
  },

  {
    headingSatu: "BRINGAS",
    headingDua: "BRINGAS",
    img: brigas,
    path: "bringas",
    deskripsi:
      "Kekuatan pemukul berat. Menggunakan alat tempur berat untuk mengamankan area konflik yang paling berbahaya.",
    class: "card-beringas",
  },

  {
    headingSatu: "PATHFINDER",
    headingDua: "PATHFINDER",
    img: pathFinder,
    path: "pathfinder",
    deskripsi:
      "Unit pembuka jalur. Menentukan navigasi tim dan memastikan rute aman sebelum unit utama masuk.",
    class: "card-Pathfinder",
  },

  {
    headingSatu: "SENTINEL",
    headingDua: "SENTINEL",
    img: sentinel,
    path: "sentinel",
    deskripsi:
      " Garda pertahanan terakhir. Melindungi aset strategis pangkalan dan keselamatan VIP tingkat tinggi.",
    class: "card-Sentinel",
  },

  {
    headingSatu: "TORUK MAKTO",
    headingDua: "TORUK MAKTO",
    path: "toruk-makto",
    img: toruk,
    deskripsi:
      "enguasa cakrawala. Unit helikopter tempur yang memberikan dukungan serangan udara dan evakuasi kilat.",
    class: "card-toruk",
  },
];

export const nonTempur = [
  {
    headingSatu: "ZENI TEMPUR RGE",
    headingDua: "ZENI TEMPUR",
    img: logoDefault,
    deskripsi:
      "Pendidikan dan pengamanan latihan. Menjaga standar kualitas rekrutmen komunitas.",
  },

  {
    headingSatu: "KOPENDIKLAT",
    headingDua: "KOPENDIKLAT",
    img: logoDefault,
    deskripsi:
      "Komando pengembangan pendidikan dan pelatihan. Berfokus pada pengembangan taktik instruktur.",
  },

  {
    headingSatu: "DPDM",
    headingDua: "DPDM",
    img: logoDefault,
    deskripsi:
      "Departemen Data dan Personel. Mengelola intelijen data dan arsip keanggotaan personel.",
  },

  {
    headingSatu: "PROPAGANDA",
    headingDua: "PROPAGANDA",
    img: logoDefault,
    deskripsi:
      "Divisi komunikasi publik, manajemen media, dan publikasi esain kreatif komunitas.",
  },
];

export const perwira = [
  {
    pangkat: "BRIGADIER GENERAL",
    nama: ["[☆] BRIGJEN. [HCO] Gi1"],
  },
  {
    pangkat: "KOLONEL",
    nama: ["[𖤍] KOL. [STAFF ♤] Cosmo"],
  },

  {
    pangkat: "LETNAN KOLONEL",
    nama: ["[❃] LETKOL. Duke Rekreasi"],
  },
  {
    pangkat: "MAYOR",
    nama: ["[𖤓] MAJ. [STAFF ♤] Supri", "[𖤓] MAYOR. PEL [🗡] Moru"],
  },
  {
    pangkat: "KAPTEN",
    nama: ["[III] KAPT. Regi [SBN-2]", "[III] KAPT. [STAFF]. Raikkonen"],
  },

  {
    pangkat: "LETNAN SATU",
    nama: ["[II] Lettu. Go", "[II] 1LT. Salty", "[II] 1LT. Log [⚒] Pan"],
  },
  {
    pangkat: "LETNAN DUA",
    nama: ["[I] Letda [PRO] Dr96fx", "[I] Letda. [⚒] LOG. Lee", "[I] Letda. [PM ♤] G•File•dwg","[I] Letda. [STAFF ♤] Aldo96fx","[I] Letda. [PM] Kebab. SPR.Jr","[I] Letda. Ewok bak to hom"],
  },
];

export const unitDetail = [
  {
    "toruk-makto": {
      color: "#E7000B",
      h1: "Toruk Makto",
      deskripsi:
        "Dominasi udara absolut dengan presisi taktis. Unit helikopter elit PASKUS-791 siap untuk infiltrasi dan ekstraksi di zona konflik manapun.",
      philosopiHeader: "MENEMBUS BATAS CAKRAWALA",
      philosopiDeskripsi:
        "Toruk Makto bukan sekadar unit transportasi. Kami adalah perpanjangan tangan perlindungan bagi setiap personil di darat. Dengan kecepatan reaksi di atas rata-rata, kami memastikan keunggulan taktis di setiap detik pertempuran.",
      special: {
        judul: "UDARA",
        card1Judul: "STRIKE FORCE",
        card1Des:
          "Penyediaan bantuan tembakan udara (CAS) untuk menetralisir ancaman darat secara presisi.",
        card2Judul: "LIFE SUPPORT",
        card2Des:
          "Ekstraksi medis darurat di tengah pertempuran sengit dengan perlindungan maksimal.",
        card3Judul: "PATHFINDER",
        card3Des:
          "Pengintaian area dan pemetaan jalur infiltrasi untuk unit infantri PASKUS.",
      },
      footer: "SIAP UNTUK LEPAS LANDAS?",
    },

    bringas: {
      color: "#e7d400ff",
      h1: "bringas",
      deskripsi:
        "Pasukan tempur utama infanteri mekanis yang berspesialisasi dalam kavaleri ringan dengan jenis klasifikasi Armored Personel Carrier [APC], Armored Vehicle [AV] dan Infantry Fighting Vehicle [IFV]. ",
      philosopiHeader: "MENEROBOS BARISAN MUSUH",
      philosopiDeskripsi:
        "BRINGAS dilatih untuk memusnahkan musuh dengan daya tembak yang dahsyat dari senjata berat dan kendaraan-kendaraan yang dibawa serta memberikan perlindungan kepada Infantri apabila ada kondisi yang darurat untuk bermobilisasi dengan cepat dan efisien",
      special: {
        judul: "KAVALERI",

        card1Judul: "BREAKER",
        card1Des:
          "Unit garis depan yang bertugas menghancurkan pertahanan musuh dan membuka jalur menggunakan kendaraan lapis baja dengan daya hancur tinggi.",

        card2Judul: "SHIELD CORE",
        card2Des:
          "Memberikan perlindungan maksimal bagi pasukan infanteri dengan formasi kendaraan berlapis baja untuk menahan serangan dan mengamankan area pergerakan.",

        card3Judul: "RAPID STRIKE",
        card3Des:
          "Unit mobilitas tinggi yang melakukan serangan cepat, flanking, dan penetrasi mendalam ke wilayah musuh untuk mengacaukan formasi lawan.",
      },
    },
    sentinel: {
      color: "#fc4d6aff",
      h1: "sentinel",
      deskripsi:
        "Tenaga medis tempur yang berspesialisasi dalam pertolongan pertama di medan pertempuran aktif dan selanjutnya mendukung resimen dengan perlengkapan medis serta logistik melalui kendaraan lapis baja medis.",
      philosopiHeader: "COMBAT MEDIC",
      philosopiDeskripsi:
        "Unit Sentinel harus memiliki fokus yang kuat, kemampuan koordinasi dan komunikasi yang tinggi, serta dedikasi penuh dalam menyelamatkan rekan satu tim. Peran mereka sangat vital dalam menjaga keberlangsungan operasi di medan tempur.",

      special: {
        judul: "MEDICAL SUPPORT",

        card1Judul: "LIFE SAVER",
        card1Des:
          "Memberikan pertolongan pertama secara cepat di medan tempur untuk menstabilkan kondisi korban sebelum evakuasi dilakukan.",

        card2Judul: "FIELD EVAC",
        card2Des:
          "Melakukan evakuasi medis menggunakan kendaraan lapis baja untuk memastikan personel terluka dapat dipindahkan ke zona aman dengan cepat.",

        card3Judul: "SUPPORT CORE",
        card3Des:
          "Menyuplai kebutuhan medis dan logistik penting bagi seluruh unit untuk menjaga keberlangsungan operasi dalam jangka panjang.",
      },
    },
    gatam: {
      color: "#aaaaaaff",
      h1: "gatam",
      deskripsi:
        "Gatam atau Garuda Hitam adalah unit pasukan khusus yang berspesialisasi dalam operasi rahasia, bekerja secara independen untuk mengamankan posisi strategis, mengeksekusi target bernilai tinggi, serta membebaskan kompleks musuh dengan presisi tinggi.",
      philosopiHeader: "INFILTRATION AND STEALTH UNIT",
      philosopiDeskripsi:
        "Unit Gatam dituntut memiliki fokus tinggi, disiplin ekstrem, serta kemampuan adaptasi dalam tekanan tinggi. Setiap operasi dijalankan dengan presisi tanpa toleransi kesalahan, karena satu kesalahan kecil dapat menggagalkan keseluruhan misi.",

      special: {
        judul: "BLACK OPS",

        card1Judul: "SILENT ENTRY",
        card1Des:
          "Melakukan infiltrasi tingkat tinggi ke wilayah musuh tanpa terdeteksi untuk mengamankan titik strategis sebelum operasi utama dimulai.",

        card2Judul: "TARGET ELIMINATION",
        card2Des:
          "Menetralisir target bernilai tinggi dengan presisi maksimal menggunakan teknik stealth dan eksekusi cepat tanpa meninggalkan jejak.",

        card3Judul: "DEEP COVER",
        card3Des:
          "Operasi penyamaran jangka panjang di dalam wilayah musuh untuk mengumpulkan intelijen dan membuka peluang serangan dari dalam.",
      },
    },
    pathfinder: {
      color: "#30e736ff",
      h1: "Pathfinder",
      deskripsi:
        "Infantri pengintai [The Ranger & Scout] mengkhususkan diri dalam pengintaian dan keahlian menembak serta akan memberikan resimen SO-791 melakukan operasi dan kegiatan dengan tingkat efektif yang tinggi",
      philosopiHeader: "MEMBUNUH DALAM SENYAP",
      philosopiDeskripsi:
        "Unit Pathfinder harus disiplin, presisi serta memiliki tingkat kesabaran yang sangat tinggi. Operasi pengintaian yang dijalankan sangat krusial untuk keberlangsungan misi, dengan kemampuan utama dalam penembakan jarak jauh, observasi, dan komunikasi taktis.",

      special: {
        judul: "RECON",

        card1Judul: "SHADOW SCOUT",
        card1Des:
          "Melakukan infiltrasi senyap ke wilayah musuh untuk mengumpulkan intelijen tanpa terdeteksi, memastikan jalur aman bagi unit utama.",

        card2Judul: "DEAD EYE",
        card2Des:
          "Penembak jitu dengan akurasi tinggi yang bertugas menetralisir target prioritas dari jarak jauh tanpa membuka posisi tim.",

        card3Judul: "ECHO SIGNAL",
        card3Des:
          "Spesialis komunikasi dan pengamatan yang menjaga aliran informasi real-time dari medan tempur ke pusat komando.",
      },
    },
    sierra: {
      color: "#d9c37a",
      h1: "sierra",
      deskripsi:
        "SIERRA adalah divisi infanteri khusus yang bergerak cepat, sigap, dan terukur untuk membuka celah operasi, mengacaukan struktur lawan, serta menyelesaikan sasaran bernilai tinggi tanpa kehilangan kendali komando.",
      philosopiHeader: "GERAK CEPAT, TEGAS DALAM EKSEKUSI",
      philosopiDeskripsi:
        "SIERRA dibentuk sebagai unit gerak cepat dan sigap PASKUS Gi1. Fokusnya berada pada manuver kilat, respons instan terhadap situasi lapangan, koordinasi tim kecil, dan eksekusi cepat yang tetap disiplin. Setiap pergerakan harus gesit, responsif, dan menghasilkan dampak langsung bagi operasi utama.",
      special: {
        judul: "RAPID ACTION",
        card1Judul: "RAPID ENTRY",
        card1Des:
          "Masuk ke area sasaran secara cepat dan sigap, membaca celah dengan instan, dan menyiapkan ruang aksi bagi pasukan utama.",
        card2Judul: "SWIFT STRIKE",
        card2Des:
          "Menyerang fasilitas, ritme, dan konsentrasi musuh melalui aksi cepat yang terukur.",
        card3Judul: "AGILE CELL",
        card3Des:
          "Bergerak sebagai sel kecil dengan komunikasi tajam, keputusan matang, dan disiplin eksekusi.",
      },
    },
  },
];
