/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Server / Recruitment Dispatch Config
 * Purpose: Mengumpulkan teks, warna, timeout, dan asset dispatch recruiter dalam satu tempat.
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
    logoPublicPath: "public/recruitment-webhook-logo.png",
    logoMimeType: "image/png",
  },
  embed: {
    title: "Lampiran",
    description:
      "Perekrutan, Pelatihan Wingman dan Pengambilan Latpur (Fisik dan Mental)",
    footer(unitLabel) {
      return `System pengiriman pelaporan secara realtime yang secara khusus difiturkan dari unit ${unitLabel} untuk pelaporan recruiter.`;
    },
  },
};

export function loadRecruitmentDispatchAssets(projectRoot) {
  const { assets } = RECRUITMENT_DISPATCH_CONFIG;
  const logoPath = resolve(projectRoot, assets.logoPublicPath);

  return {
    logoFileName: assets.logoFileName,
    logoMimeType: assets.logoMimeType,
    logoBuffer: readFileSync(logoPath),
  };
}
