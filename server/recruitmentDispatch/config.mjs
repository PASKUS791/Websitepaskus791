/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Server / Recruitment Dispatch Config
 * Purpose: Mengumpulkan teks, warna, timeout, layout PDF, dan asset dispatch recruiter dalam satu tempat.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const RECRUITMENT_DISPATCH_CONFIG = {
  webhookName: "PASKUS 791 Recruiter",
  timeoutMs: 20000,
  colors: {
    primaryEmbed: 0xb7922f,
    secondaryEmbed: 0x2a2a2a,
  },
  assets: {
    logoFileName: "recruitment-webhook-logo.png",
    bannerFileName: "recruitment-webhook-banner.jpeg",
    logoPublicPath: "public/recruitment-webhook-logo.png",
    bannerPublicPath: "public/recruitment-webhook-banner.jpeg",
    logoMimeType: "image/png",
    bannerMimeType: "image/jpeg",
  },
  embed: {
    title: "Lampiran",
    description:
      "Perekrutan, Pelatihan Wingman dan Pengambilan Latpur (Fisik dan Mental)",
    attachmentTitle: "Foto Lampiran Recruiter",
    footer(unitLabel) {
      return `System pengiriman pelaporan secara realtime yang secara khusus difiturkan dari unit ${unitLabel} untuk pelaporan recruiter.`;
    },
    attachmentDescription(sessionTitle) {
      return `Lampiran visual sesi ${sessionTitle}.`;
    },
  },
  pdf: {
    width: 595,
    height: 842,
    marginX: 50,
    marginTop: 56,
    marginBottom: 54,
    startY: 792,
    leading: 14,
    maxLineLength: 88,
    maxLinesPerPage: 48,
    sectionSpacing: 24,
    reportSpacing: 28,
    tableLabelWidth: 156,
  },
};

export function loadRecruitmentDispatchAssets(projectRoot) {
  const { assets } = RECRUITMENT_DISPATCH_CONFIG;
  const logoPath = resolve(projectRoot, assets.logoPublicPath);
  const bannerPath = resolve(projectRoot, assets.bannerPublicPath);

  return {
    logoFileName: assets.logoFileName,
    bannerFileName: assets.bannerFileName,
    logoMimeType: assets.logoMimeType,
    bannerMimeType: assets.bannerMimeType,
    logoBuffer: readFileSync(logoPath),
    bannerBuffer: readFileSync(bannerPath),
  };
}
