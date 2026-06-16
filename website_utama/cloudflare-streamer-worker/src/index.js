const CREATOR_BY_HOST = {
  "gi1.so791.com": "gi1",
  "4hn.so791.com": "4hn",
  "aang.so791.com": "aang",
};

const RESERVED_HOSTS = new Set(["so791.com", "www.so791.com", "paskus.so791.com", "strategic.so791.com"]);
const HTML_CACHE = "public, max-age=120, stale-while-revalidate=600";
const ASSET_CACHE = "public, max-age=31536000, immutable";
const ORIGIN = "https://paskus.so791.com";
const PASKUS_DISCORD_URL = "https://discord.gg/aaBR9ruFva";
const PASKUS_COMMUNITY_URL = "https://paskus.so791.com/streamer";
const PASKUS_FAMILY_URL = "https://paskus.so791.com/about";
const MEDIA_CACHE_TAG = "20260609-video-policy-safe";

const INITIAL_PROFILES = {
  gi1: {
    slug: "gi1",
    callSign: "Gi1",
    displayName: "Gi1 Gaming",
    role: "Streamer Resimen PASKUS791",
    handle: "@gi1_gaming",
    tagline: "Konten BRM5 roleplay, highlight operasi, dan dokumentasi PASKUS Gi1 dalam satu komando visual.",
    theme: "#d4af37",
    tiktok: "https://www.tiktok.com/@gi1_gaming?_r=1&_t=ZS-96xVVdUmuIL",
    youtube: "https://youtube.com/@gi1_gr?si=bBRRFye5kfc5KHRI",
    media: {
      avatar: "/assets/gi1-profile-v2.jpg",
      pageBackground: "/assets/gi1-background-v2.jpg",
      profileBackground: "/assets/gi1-background-v2.jpg",
      pageBackgroundPosition: "calc(50% - 400px) top",
      highlightPoster: "/assets/gi1-highlight-poster-v3.jpg",
      highlightMp4: "/assets/gi1-highlight-v3.mp4",
      avatarPhoto: true,
      preferMp4: true,
    },
  },
  "4hn": {
    slug: "4hn",
    callSign: "4hn",
    displayName: "4hn",
    role: "Content Creator PASKUS791",
    handle: "@soldier_791",
    tagline: "Dokumentasi lapangan, momen event, dan karya komunitas PASKUS791 dari sudut pandang kreator.",
    theme: "#8fbf64",
    tiktok: "https://www.tiktok.com/@soldier_791",
    youtube: "https://www.youtube.com/@MrFarhanIsHere26",
    media: {
      avatar: "/assets/4hn-profile-v2.jpg",
      pageBackground: "/assets/4hn-background-v2.jpg",
      profileBackground: "/assets/4hn-background-v2.jpg",
      pageBackgroundPosition: "center top",
      highlightPoster: "/assets/4hn-highlight-poster-v1.jpg",
      highlightMp4: "/assets/4hn-highlight-v1.mp4",
      avatarPhoto: true,
      preferMp4: true,
    },
  },
  aang: {
    slug: "aang",
    callSign: "Aang",
    displayName: "Aang",
    role: "Special Ops / Combat Creator",
    handle: "@.namakuaang",
    tagline: "Special Ops PASKUS yang bergerak senyap, membaca ruang dengan dingin, dan mengubah momen operasi menjadi highlight yang bersih, tajam, dan berkelas.",
    theme: "#b9c7d6",
    tiktok: "https://www.tiktok.com/@.namakuaang?_r=1&_t=ZS-970xG9tEyRs",
    youtube: "",
    media: {
      avatar: "/assets/aang-profile-v3.jpg",
      pageBackground: "/assets/aang-background-v2.jpg",
      profileBackground: "/assets/aang-background-v2.jpg",
      pageBackgroundPosition: "center 22%",
      highlightPoster: "/assets/aang-highlight-poster-v2.jpg",
      highlightWebm: "/assets/aang-highlight-v1.webm",
      highlightMp4: "/assets/aang-highlight-v1.mp4",
      avatarPhoto: true,
      preferMp4: true,
    },
    links: [
      { type: "tiktok", label: "TikTok", handle: "@.namakuaang", url: "https://www.tiktok.com/@.namakuaang?_r=1&_t=ZS-970xG9tEyRs" },
      { type: "discord", label: "Discord PASKUS", handle: "Special Ops Channel", url: PASKUS_DISCORD_URL },
      { type: "community", label: "Streamer Hub", handle: "PASKUS karya dan event", url: PASKUS_COMMUNITY_URL },
    ],
  },
};

const SECURITY_HEADERS = {
  "content-security-policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob:",
    "media-src 'self' blob:",
    "connect-src 'self'",
  ].join("; "),
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-site",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
};

function normalized(value) {
  return String(value || "").toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cacheTaggedMedia(value) {
  const mediaUrl = String(value || "").trim();
  if (!mediaUrl.startsWith("/assets/") || mediaUrl.includes("?v=") || mediaUrl.includes("&v=")) {
    return mediaUrl;
  }
  return `${mediaUrl}${mediaUrl.includes("?") ? "&" : "?"}v=${MEDIA_CACHE_TAG}`;
}

function cssImage(value) {
  return `url(&quot;${escapeHtml(cacheTaggedMedia(value)).replaceAll("\\", "\\\\")}&quot;)`;
}

function profileForCreator(creator) {
  return INITIAL_PROFILES[normalized(creator)] || INITIAL_PROFILES.gi1;
}

function defaultProfileLinks(profile) {
  return [
    { type: "tiktok", label: "TikTok", handle: profile.handle, url: profile.tiktok },
    { type: "youtube", label: "YouTube", handle: profile.displayName, url: profile.youtube },
    { type: "discord", label: "Discord PASKUS", handle: "Community Hub", url: PASKUS_DISCORD_URL },
    { type: "community", label: "Streamer Hub", handle: "PASKUS karya dan event", url: PASKUS_COMMUNITY_URL },
  ].filter((link) => link.url);
}

function initialSocialIcon(type) {
  if (type === "youtube") {
    return '<svg viewBox="0 0 24 24" fill="none"><path d="M21 8.4a3 3 0 0 0-2.1-2.15C17.05 5.75 12 5.75 12 5.75s-5.05 0-6.9.5A3 3 0 0 0 3 8.4a31.18 31.18 0 0 0 0 7.2 3 3 0 0 0 2.1 2.15c1.85.5 6.9.5 6.9.5s5.05 0 6.9-.5A3 3 0 0 0 21 15.6a31.18 31.18 0 0 0 0-7.2Z" stroke="currentColor" stroke-width="2" /><path d="m10.3 9.35 4.4 2.65-4.4 2.65v-5.3Z" fill="currentColor" /></svg>';
  }
  if (type === "discord") {
    return '<svg viewBox="0 0 24 24" fill="none"><path d="M7.3 18.2c-1.25-.36-2.5-.95-3.7-1.76.2-3.55 1.15-6.72 2.85-9.5 1.2-.58 2.35-.98 3.45-1.2l.45.9a12.3 12.3 0 0 1 3.3 0l.45-.9c1.1.22 2.25.62 3.45 1.2 1.7 2.78 2.65 5.95 2.85 9.5a12.85 12.85 0 0 1-3.7 1.76l-.82-1.06c.58-.2 1.13-.47 1.65-.8-3.34 1.55-7.72 1.55-11.06 0 .52.33 1.07.6 1.65.8l-.82 1.06Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" /><path d="M9.2 12.1h.02M14.8 12.1h.02" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>';
  }
  if (type === "tiktok") {
    return '<svg viewBox="0 0 24 24" fill="none"><path d="M14.7 3v11.15a4.35 4.35 0 1 1-3.38-4.24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /><path d="M14.7 5.3c1.1 2.04 2.7 3.23 5.05 3.42" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>';
  }
  return '<svg viewBox="0 0 24 24" fill="none"><path d="M10.5 13.5 13.5 10.5M8.4 15.6l-1.1 1.1a3 3 0 0 1-4.24-4.24l3.18-3.18a3 3 0 0 1 4.24 0M15.6 8.4l1.1-1.1a3 3 0 0 1 4.24 4.24l-3.18 3.18a3 3 0 0 1-4.24 0" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function renderInitialLinks(profile) {
  const links = (Array.isArray(profile.links) && profile.links.length > 0 ? profile.links : defaultProfileLinks(profile))
    .filter((link) => link && link.active !== false && link.url);
  return `<section class="link-stack" aria-label="Link sosial media">${links.map((link) => `
        <a class="social-button" data-social-link="${escapeHtml(link.type || "link")}" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
          <span class="social-icon" aria-hidden="true">${initialSocialIcon(link.type)}</span>
          <span class="social-text">
            <strong data-social-label>${escapeHtml(link.label || "Link")}</strong>
            <span data-social-handle>${escapeHtml(link.handle || "")}</span>
          </span>
          <span class="arrow">›</span>
        </a>`).join("")}
      </section>`;
}

function renderInitialProfileHtml(html, request, creator) {
  const profile = profileForCreator(creator);
  const media = profile.media || {};
  const title = `${profile.callSign} | Streamer PASKUS791`;
  const description = `${profile.callSign} adalah streamer dan content creator PASKUS791 untuk BRM5 roleplay, highlight video, Discord PASKUS, dan karya komunitas So-791.`;
  const pageUrl = new URL(request.url).href;
  const poster = cacheTaggedMedia(media.highlightPoster || "/assets/paskus-streamer-highlight-poster-v1.jpg");
  const webm = media.preferMp4 ? "" : media.highlightWebm || "";
  const mp4 = media.highlightMp4 || "";
  const htmlStyle = [
    `--creator-accent: ${profile.theme}`,
    `--page-bg-image: ${cssImage(media.pageBackground || media.background || "/assets/about-us-bg-v1.webp")}`,
    `--page-bg-position: ${escapeHtml(media.pageBackgroundPosition || "center top")}`,
    `--profile-bg-image: ${cssImage(media.profileBackground || media.background || "/assets/paskus-landing-loop-poster-v2.jpg")}`,
  ].join("; ");

  return html
    .replace(/<html lang="id"[^>]*>/, `<html lang="id" style="${htmlStyle}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(" \/>)/, `$1${escapeHtml(description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(" \/>)/, `$1${escapeHtml(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(" \/>)/, `$1${escapeHtml(description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(" \/>)/, `$1${escapeHtml(pageUrl)}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(" \/>)/, `$1${escapeHtml(new URL(poster, pageUrl).href)}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(" \/>)/, `$1${escapeHtml(title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(" \/>)/, `$1${escapeHtml(description)}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(" \/>)/, `$1${escapeHtml(new URL(poster, pageUrl).href)}$2`)
    .replace(/<body>/, `<body data-creator="${escapeHtml(profile.slug)}" data-avatar-photo="${media.avatarPhoto ? "true" : "false"}">`)
    .replace(/<a class="share-link" href="[^"]*" data-share-link>Profile<\/a>/, `<a class="share-link" href="${escapeHtml(pageUrl)}" data-share-link>Profile</a>`)
    .replace(/<img src="[^"]*" alt="" data-profile-avatar \/>/, `<img src="${escapeHtml(cacheTaggedMedia(media.avatar || "/recruitment-webhook-logo.png"))}" alt="" data-profile-avatar />`)
    .replace(/(<strong data-profile-callsign>)[\s\S]*?(<\/strong>)/, `$1${escapeHtml(profile.callSign)}$2`)
    .replace(/(<p class="profile-kicker" data-profile-role>)[\s\S]*?(<\/p>)/, `$1${escapeHtml(profile.role)}$2`)
    .replace(/(<h1 data-profile-callsign>)[\s\S]*?(<\/h1>)/, `$1${escapeHtml(profile.callSign)}$2`)
    .replace(/(<span data-profile-display>)[\s\S]*?(<\/span>)/, `$1${escapeHtml(profile.displayName)}$2`)
    .replace(/(<span data-profile-handle>)[\s\S]*?(<\/span>)/, `$1${escapeHtml(profile.handle)}$2`)
    .replace(/(<p class="profile-tagline" data-profile-tagline>)[\s\S]*?(<\/p>)/, `$1${escapeHtml(profile.tagline)}$2`)
    .replace(/<video([^>]*) poster="[^"]*"([^>]*) data-highlight-video>/, `<video$1 poster="${escapeHtml(poster)}"$2 data-highlight-video>`)
    .replace(/<source data-highlight-source="webm" src="[^"]*" type="video\/webm" \/>/, webm
      ? `<source data-highlight-source="webm" src="${escapeHtml(webm)}" type="video/webm" />`
      : '<source data-highlight-source="webm" type="video/webm" />')
    .replace(/<source data-highlight-source="mp4" src="[^"]*" type="video\/mp4" \/>/, mp4
      ? `<source data-highlight-source="mp4" src="${escapeHtml(mp4)}" type="video/mp4" />`
      : '<source data-highlight-source="mp4" type="video/mp4" />')
    .replace(/<section class="link-stack" aria-label="Link sosial media">[\s\S]*?<\/section>/, renderInitialLinks(profile));
}

function hostFromRequest(request) {
  return (request.headers.get("Host") || new URL(request.url).hostname).toLowerCase();
}

function creatorFromRequest(request) {
  const url = new URL(request.url);
  const host = hostFromRequest(request);
  const hostCreator = normalized(CREATOR_BY_HOST[host]);
  if (hostCreator) {
    return hostCreator;
  }

  const hostSlug = normalized(host.split(".")[0]);
  if (host.endsWith(".so791.com") && !RESERVED_HOSTS.has(host) && hostSlug) {
    return hostSlug;
  }

  const queryCreator = normalized(url.searchParams.get("creator") || url.searchParams.get("c"));
  if (queryCreator) {
    return queryCreator;
  }

  const pathMatch = url.pathname.match(/\/streamers?\/([a-z0-9-]+)\/?$/i);
  const pathCreator = normalized(pathMatch?.[1]);
  return pathCreator || "gi1";
}

function withStreamerHeaders(response, request, cacheControl) {
  const headers = new Headers(response.headers);
  const host = hostFromRequest(request);
  headers.set("cache-control", response.status === 404 ? "no-store, max-age=0" : cacheControl);
  headers.set("x-paskus-streamer-domain", host);
  headers.set("x-paskus-streamer-scope", "individual-subdomain");
  headers.set("x-paskus-streamer-version", MEDIA_CACHE_TAG);

  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function assetRequest(request, pathname) {
  const url = new URL(request.url);
  url.pathname = pathname;
  url.search = "";
  return new Request(url, request);
}

async function serveStaticAsset(env, request, pathname, cacheControl = ASSET_CACHE) {
  const response = await env.ASSETS.fetch(assetRequest(request, pathname));
  return withStreamerHeaders(response, request, cacheControl);
}

async function serveProfile(env, request) {
  const creator = creatorFromRequest(request);
  const response = await env.ASSETS.fetch(assetRequest(request, "/streamer-profile.html"));
  if (!response.ok) {
    return withStreamerHeaders(response, request, HTML_CACHE);
  }
  const html = renderInitialProfileHtml(await response.text(), request, creator);
  const headersResponse = withStreamerHeaders(new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  }), request, HTML_CACHE);
  headersResponse.headers.set("x-paskus-streamer-creator", creator);
  return headersResponse;
}

async function proxyStreamerApi(request) {
  const sourceUrl = new URL(request.url);
  const target = new URL(sourceUrl.pathname + sourceUrl.search, ORIGIN);
  const response = await fetch(target, {
    headers: {
      Accept: request.headers.get("Accept") || "application/json",
      "User-Agent": request.headers.get("User-Agent") || "PASKUS-Streamer-Worker",
    },
  });
  const headers = new Headers(response.headers);
  headers.set("cache-control", "no-store, no-cache, max-age=0");
  headers.set("x-paskus-streamer-api-proxy", "1");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/assets/")) {
      return serveStaticAsset(env, request, url.pathname);
    }

    if (url.pathname === "/api/streamer-content.php") {
      return proxyStreamerApi(request);
    }

    if (url.pathname === "/recruitment-webhook-logo.png") {
      return serveStaticAsset(env, request, "/recruitment-webhook-logo.png");
    }

    if (url.pathname === "/favicon.ico") {
      return serveStaticAsset(env, request, "/recruitment-webhook-logo.png");
    }

    return serveProfile(env, request);
  },
};
