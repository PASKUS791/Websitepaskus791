(function () {
  "use strict";

  const PASKUS_DISCORD_URL = "https://discord.gg/aaBR9ruFva";
  const PASKUS_COMMUNITY_URL = "https://paskus.so791.com/streamer";
  const PASKUS_FAMILY_URL = "https://paskus.so791.com/about";
  const STREAMER_CONTENT_API_URL = "/api/streamer-content.php";
  const MEDIA_CACHE_TAG = "20260609-video-policy-safe";

  const PROFILES = {
    gi1: {
      slug: "gi1",
      callSign: "Gi1",
      displayName: "Gi1 Gaming",
      role: "Streamer Resimen PASKUS791",
      handle: "@gi1_gaming",
      tagline: "Konten BRM5 roleplay, highlight operasi, dan dokumentasi PASKUS Gi1 dalam satu komando visual.",
      tiktok: "https://www.tiktok.com/@gi1_gaming?_r=1&_t=ZS-96xVVdUmuIL",
      youtube: "https://youtube.com/@gi1_gr?si=bBRRFye5kfc5KHRI",
      theme: "#d4af37",
      media: {
        avatar: "/assets/gi1-profile-v2.jpg",
        pageBackground: "/assets/gi1-background-v2.jpg",
        pageBackgroundPosition: "calc(50% - 400px) top",
        profileBackground: "/assets/gi1-background-v2.jpg",
        highlightPoster: "/assets/gi1-highlight-poster-v3.jpg",
        highlightWebm: "/assets/gi1-highlight-v3.webm",
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
      tiktok: "https://www.tiktok.com/@soldier_791",
      youtube: "https://www.youtube.com/@MrFarhanIsHere26",
      theme: "#8fbf64",
      media: {
        avatar: "/assets/4hn-profile-v2.jpg",
        pageBackground: "/assets/4hn-background-v2.jpg",
        profileBackground: "/assets/4hn-background-v2.jpg",
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
      tiktok: "https://www.tiktok.com/@.namakuaang?_r=1&_t=ZS-970xG9tEyRs",
      youtube: "",
      theme: "#b9c7d6",
      media: {
        avatar: "/assets/aang-profile-v3.jpg",
        pageBackground: "/assets/aang-background-v2.jpg",
        pageBackgroundPosition: "center 22%",
        profileBackground: "/assets/aang-background-v2.jpg",
        highlightPoster: "/assets/aang-highlight-poster-v2.jpg",
        highlightWebm: "/assets/aang-highlight-v2.webm",
        highlightMp4: "/assets/aang-highlight-v2.mp4",
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

  function normalized(value) {
    return String(value || "").toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
  }

  function requestedSlug() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = normalized(params.get("creator") || params.get("c"));
    if (fromQuery) {
      return fromQuery;
    }

    const pathMatch = window.location.pathname.match(/\/streamers?\/([a-z0-9-]+)\/?$/i);
    if (pathMatch) {
      return normalized(pathMatch[1]);
    }

    const hostMatch = window.location.hostname.match(/^([a-z0-9-]+)\.so791\.com$/i);
    if (hostMatch) {
      return normalized(hostMatch[1]);
    }

    return "gi1";
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = value;
    });
  }

  function setAttr(selector, attr, value) {
    document.querySelectorAll(selector).forEach((node) => {
      node.setAttribute(attr, value);
    });
  }

  function cssImage(value) {
    return `url("${String(value || "").replaceAll("\\", "\\\\").replaceAll('"', '\\"')}")`;
  }

  function setFullVolume(video) {
    try {
      video.volume = 1;
    } catch (_) {
      // Some mobile browsers expose volume as read-only; muted state remains controllable.
    }
  }

  function cacheTaggedMedia(value) {
    const mediaUrl = String(value || "").trim();
    if (!mediaUrl.startsWith("/assets/") || mediaUrl.includes("?v=") || mediaUrl.includes("&v=")) {
      return mediaUrl;
    }
    return `${mediaUrl}${mediaUrl.includes("?") ? "&" : "?"}v=${MEDIA_CACHE_TAG}`;
  }

  function profileMedia(profile) {
    const localMedia = PROFILES[normalized(profile?.slug)]?.media || {};
    const legacyMedia = {};
    const remoteMedia = { ...(profile?.media || {}) };
    const highlight = profile?.highlight || {};

    if (profile?.avatar) {
      legacyMedia.avatar = profile.avatar;
    }
    if (profile?.background) {
      legacyMedia.pageBackground = profile.background;
    }
    if (profile?.bannerBackground) {
      legacyMedia.pageBackground = profile.bannerBackground;
    }
    if (profile?.profileBackground) {
      legacyMedia.profileBackground = profile.profileBackground;
    }
    if (highlight.poster) {
      legacyMedia.highlightPoster = highlight.poster;
    }
    if (highlight.video) {
      legacyMedia.highlightWebm = highlight.video;
    }
    if (highlight.fallback) {
      legacyMedia.highlightMp4 = highlight.fallback;
    }

    const mergedMedia = { ...legacyMedia, ...localMedia, ...remoteMedia };
    const remoteHighlight = [
      remoteMedia.highlightPoster,
      remoteMedia.highlightWebm,
      remoteMedia.highlightMp4,
    ].join(" ");
    if (normalized(profile?.slug) === "gi1" && /\/assets\/gi1-highlight-v[12]\./.test(remoteHighlight)) {
      mergedMedia.highlightPoster = localMedia.highlightPoster;
      mergedMedia.highlightWebm = localMedia.highlightWebm;
      mergedMedia.highlightMp4 = localMedia.highlightMp4;
      mergedMedia.preferMp4 = localMedia.preferMp4;
    }

    return mergedMedia;
  }

  function setLink(type, url, label, handle) {
    const link = document.querySelector(`[data-social-link="${type}"]`);
    if (!link) {
      return;
    }
    link.href = url;
    link.querySelector("[data-social-label]").textContent = label;
    link.querySelector("[data-social-handle]").textContent = handle;
  }

  function profileFromRemote(data, slug) {
    const profiles = Array.isArray(data?.profiles) ? data.profiles : [];
    const profile = profiles.find((item) => normalized(item.slug) === slug);
    if (!profile) {
      return null;
    }
    const isInactive = profile.active === false;
    const links = Array.isArray(profile.links) ? profile.links.filter((link) => link?.active !== false) : [];
    const safeLinks = isInactive
      ? [
          { type: "discord", label: "Discord PASKUS", handle: "Community Hub", url: PASKUS_DISCORD_URL },
          { type: "community", label: "Streamer Hub", handle: "PASKUS karya dan event", url: PASKUS_COMMUNITY_URL },
        ]
      : links;
    return {
      slug: normalized(profile.slug),
      callSign: profile.callSign || profile.slug || slug,
      displayName: profile.displayName || profile.callSign || slug,
      role: isInactive ? "Streamer Page Nonaktif" : profile.role || "Streamer PASKUS791",
      handle: profile.handle || "",
      tagline: isInactive ? "Halaman kreator ini sedang dinonaktifkan sementara oleh admin PASKUS." : profile.tagline || "",
      theme: profile.theme || "#d4af37",
      inactive: isInactive,
      avatar: profile.avatar || "/recruitment-webhook-logo.png",
      media: profile.media || {},
      highlight: profile.highlight || {},
      links: safeLinks,
      tiktok: isInactive ? "" : links.find((link) => link.type === "tiktok")?.url || links.find((link) => link.type === "tiktok")?.href || "",
      youtube: isInactive ? "" : links.find((link) => link.type === "youtube")?.url || links.find((link) => link.type === "youtube")?.href || "",
    };
  }

  function socialIcon(type) {
    if (type === "tiktok") {
      return '<svg viewBox="0 0 24 24" fill="none"><path d="M14.7 3v11.15a4.35 4.35 0 1 1-3.38-4.24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /><path d="M14.7 5.3c1.1 2.04 2.7 3.23 5.05 3.42" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>';
    }
    if (type === "youtube") {
      return '<svg viewBox="0 0 24 24" fill="none"><path d="M21 8.4a3 3 0 0 0-2.1-2.15C17.05 5.75 12 5.75 12 5.75s-5.05 0-6.9.5A3 3 0 0 0 3 8.4a31.18 31.18 0 0 0 0 7.2 3 3 0 0 0 2.1 2.15c1.85.5 6.9.5 6.9.5s5.05 0 6.9-.5A3 3 0 0 0 21 15.6a31.18 31.18 0 0 0 0-7.2Z" stroke="currentColor" stroke-width="2" /><path d="m10.3 9.35 4.4 2.65-4.4 2.65v-5.3Z" fill="currentColor" /></svg>';
    }
    if (type === "discord") {
      return '<svg viewBox="0 0 24 24" fill="none"><path d="M7.3 18.2c-1.25-.36-2.5-.95-3.7-1.76.2-3.55 1.15-6.72 2.85-9.5 1.2-.58 2.35-.98 3.45-1.2l.45.9a12.3 12.3 0 0 1 3.3 0l.45-.9c1.1.22 2.25.62 3.45 1.2 1.7 2.78 2.65 5.95 2.85 9.5a12.85 12.85 0 0 1-3.7 1.76l-.82-1.06c.58-.2 1.13-.47 1.65-.8-3.34 1.55-7.72 1.55-11.06 0 .52.33 1.07.6 1.65.8l-.82 1.06Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" /><path d="M9.2 12.1h.02M14.8 12.1h.02" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>';
    }
    return '<svg viewBox="0 0 24 24" fill="none"><path d="M10.5 13.5 13.5 10.5M8.4 15.6l-1.1 1.1a3 3 0 0 1-4.24-4.24l3.18-3.18a3 3 0 0 1 4.24 0M15.6 8.4l1.1-1.1a3 3 0 0 1 4.24 4.24l-3.18 3.18a3 3 0 0 1-4.24 0" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderLinks(profile) {
    const stack = document.querySelector(".link-stack");
    if (!stack || !Array.isArray(profile.links) || profile.links.length === 0) {
      return;
    }
    stack.innerHTML = profile.links
      .filter((link) => link && link.active !== false && (link.url || link.href))
      .map((link) => {
        const href = link.url || link.href;
        return `
          <a class="social-button" data-social-link="${escapeHtml(link.type || "link")}" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">
            <span class="social-icon" aria-hidden="true">${socialIcon(link.type)}</span>
            <span class="social-text">
              <strong data-social-label>${escapeHtml(link.label || link.name || "Link")}</strong>
              <span data-social-handle>${escapeHtml(link.handle || "")}</span>
            </span>
            <span class="arrow">›</span>
          </a>
        `;
      })
      .join("");
  }

  function applyProfile(profile) {
    const media = profileMedia(profile);

    document.documentElement.style.setProperty("--creator-accent", profile.theme);
    document.documentElement.style.setProperty(
      "--page-bg-image",
      cssImage(cacheTaggedMedia(media.pageBackground || media.background || "/assets/about-us-bg-v1.webp")),
    );
    document.documentElement.style.setProperty(
      "--page-bg-position",
      media.pageBackgroundPosition || "center top",
    );
    document.documentElement.style.setProperty(
      "--profile-bg-image",
      cssImage(cacheTaggedMedia(media.profileBackground || media.background || "/assets/paskus-landing-loop-poster-v2.jpg")),
    );
    document.body.dataset.creator = profile.slug;
    document.body.dataset.avatarPhoto = media.avatarPhoto ? "true" : "false";

    setText("[data-profile-callsign]", profile.callSign);
    setText("[data-profile-display]", profile.displayName);
    setText("[data-profile-role]", profile.role);
    setText("[data-profile-handle]", profile.handle);
    setText("[data-profile-tagline]", profile.tagline);
    setAttr("[data-profile-avatar]", "src", cacheTaggedMedia(media.avatar || profile.avatar || "/recruitment-webhook-logo.png"));

    renderLinks(profile);
    setLink("tiktok", profile.tiktok, "TikTok", profile.handle);
    setLink("youtube", profile.youtube, "YouTube", profile.displayName);
    setLink("discord", PASKUS_DISCORD_URL, "Discord PASKUS", "Community Hub");
    setLink("community", PASKUS_COMMUNITY_URL, "Streamer Hub", "PASKUS karya dan event");

    const video = document.querySelector("[data-highlight-video]");
    const sourceWebm = video?.querySelector('[data-highlight-source="webm"]');
    const sourceMp4 = video?.querySelector('[data-highlight-source="mp4"]');
    const highlight = profile.highlight || {};
    const poster = media.highlightPoster || highlight.poster;
    const preferMp4 = media.preferMp4 === true;
    const webm = preferMp4 ? "" : media.highlightWebm || media.highlightVideo || highlight.webm || highlight.video;
    const mp4 = media.highlightMp4 || media.highlightFallback || highlight.mp4 || highlight.fallback;
    if (video) {
      const directVideo = !preferMp4 && webm && video.canPlayType("video/webm; codecs=\"vp9, opus\"") ? webm : mp4 || webm;
      const mediaKey = [directVideo, poster, webm, mp4, preferMp4 ? "mp4" : "auto"].join("|");
      video.controls = false;
      video.muted = false;
      setFullVolume(video);
      video.preload = "metadata";
      video.playsInline = true;
      video.removeAttribute("controls");
      video.removeAttribute("muted");
      video.setAttribute("playsinline", "");
      video.setAttribute("controlsList", "nodownload noplaybackrate");
      video.setAttribute("draggable", "false");
      video.disablePictureInPicture = true;
      if (poster) {
        video.poster = cacheTaggedMedia(poster);
      }
      if (sourceWebm) {
        if (webm) {
          sourceWebm.src = webm;
        } else {
          sourceWebm.removeAttribute("src");
        }
      }
      if (sourceMp4) {
        if (mp4) {
          sourceMp4.src = mp4;
        } else {
          sourceMp4.removeAttribute("src");
        }
      }
      if (video.dataset.mediaKey !== mediaKey) {
        video.dataset.mediaKey = mediaKey;
        if (!video.paused) {
          video.pause();
        }
        if (directVideo) {
          video.src = directVideo;
          video.load();
        } else {
          video.removeAttribute("src");
        }
      }
    }

    setAttr("[data-share-link]", "href", window.location.href);
    document.title = `${profile.callSign} | Streamer PASKUS791`;

    const description = `${profile.callSign} adalah streamer dan content creator PASKUS791 untuk BRM5 roleplay, highlight video, Discord PASKUS, dan karya komunitas So-791.`;
    setAttr("meta[name='description']", "content", description);
    setAttr("meta[property='og:title']", "content", `${profile.callSign} | Streamer PASKUS791`);
    setAttr("meta[property='og:description']", "content", description);
    setAttr("meta[property='og:url']", "content", window.location.href);
    setAttr("meta[name='twitter:title']", "content", `${profile.callSign} | Streamer PASKUS791`);
    setAttr("meta[name='twitter:description']", "content", description);
    if (poster) {
      const posterUrl = new URL(cacheTaggedMedia(poster), window.location.origin).href;
      setAttr("meta[property='og:image']", "content", posterUrl);
      setAttr("meta[name='twitter:image']", "content", posterUrl);
    }

    document.querySelectorAll("[data-footer-link='discord']").forEach((node) => {
      node.href = PASKUS_DISCORD_URL;
    });
    document.querySelectorAll("[data-footer-link='community']").forEach((node) => {
      node.href = PASKUS_COMMUNITY_URL;
    });
    document.querySelectorAll("[data-footer-link='family']").forEach((node) => {
      node.href = PASKUS_FAMILY_URL;
    });
  }

  function setupVideoPlayer() {
    const shell = document.querySelector("[data-video-shell]");
    const video = document.querySelector("[data-highlight-video]");
    const playButton = document.querySelector("[data-video-play]");
    if (!shell || !video || !playButton || shell.dataset.playerReady === "true") {
      return;
    }

    shell.dataset.playerReady = "true";
    video.controls = false;
    video.muted = false;
    setFullVolume(video);
    video.removeAttribute("controls");
    video.removeAttribute("muted");
    video.setAttribute("playsinline", "");
    video.setAttribute("controlsList", "nodownload noplaybackrate");
    video.setAttribute("draggable", "false");
    video.disablePictureInPicture = true;

    function syncState() {
      const isPlaying = !video.paused && !video.ended;
      shell.classList.toggle("is-playing", isPlaying);
      shell.dataset.soundMode = video.muted ? "muted" : "sound";
      playButton.setAttribute("aria-label", isPlaying ? "Jeda highlight video" : "Putar highlight video");
      const soundButton = shell.querySelector("[data-video-sound]");
      if (soundButton) {
        soundButton.setAttribute("aria-label", video.muted ? "Aktifkan suara highlight" : "Matikan suara highlight");
        soundButton.innerHTML = video.muted
          ? '<svg viewBox="0 0 24 24" fill="none"><path d="M4 9v6h4l5 4V5L8 9H4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m18 9 4 6M22 9l-4 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none"><path d="M4 9v6h4l5 4V5L8 9H4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M16 8.5a4 4 0 0 1 0 7M18.5 6a7.5 7.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      }
    }

    function ensureSoundButton() {
      let soundButton = shell.querySelector("[data-video-sound]");
      if (!soundButton) {
        soundButton = document.createElement("button");
        soundButton.className = "video-sound-button";
        soundButton.type = "button";
        soundButton.dataset.videoSound = "true";
        shell.appendChild(soundButton);
        soundButton.addEventListener("click", async (event) => {
          event.preventDefault();
          event.stopPropagation();
          const wasPlaying = !video.paused && !video.ended;
          video.muted = !video.muted;
          if (!video.muted) {
            setFullVolume(video);
            video.removeAttribute("muted");
            if (wasPlaying && video.paused && (video.currentSrc || video.src)) {
              try {
                await video.play();
                shell.dataset.videoError = "";
              } catch (error) {
                shell.dataset.videoError = error?.name || "sound";
                video.muted = true;
                video.setAttribute("muted", "");
                try {
                  await video.play();
                } catch (fallbackError) {
                  shell.dataset.videoError = fallbackError?.name || "sound";
                }
              }
            }
          }
          syncState();
        });
      }
      return soundButton;
    }

    async function togglePlayback(event) {
      event?.preventDefault();
      event?.stopPropagation();
      ensureSoundButton();
      if (video.paused || video.ended) {
        video.muted = false;
        setFullVolume(video);
        video.removeAttribute("muted");
        if (video.readyState === 0 && (video.currentSrc || video.src)) {
          video.load();
        }
        try {
          await video.play();
          shell.dataset.videoError = "";
        } catch (error) {
          shell.dataset.videoError = error?.name || "playback";
          video.muted = true;
          video.setAttribute("muted", "");
          try {
            await video.play();
            shell.dataset.videoError = "";
          } catch (fallbackError) {
            shell.dataset.videoError = fallbackError?.name || "playback";
          }
        }
      } else {
        video.pause();
      }
      syncState();
    }

    playButton.addEventListener("click", togglePlayback);
    video.addEventListener("click", togglePlayback);
    ensureSoundButton();
    video.addEventListener("contextmenu", (event) => event.preventDefault());
    shell.addEventListener("contextmenu", (event) => event.preventDefault());
    ["play", "pause", "ended", "loadedmetadata", "canplay", "emptied"].forEach((eventName) => {
      video.addEventListener(eventName, syncState);
    });
    syncState();
  }

  const slug = requestedSlug();
  applyProfile(PROFILES[slug] || PROFILES.gi1);
  setupVideoPlayer();

  fetch(`${STREAMER_CONTENT_API_URL}?t=${Date.now()}`, {
    cache: "no-store",
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  })
    .then((response) => response.ok ? response.json() : null)
    .then((payload) => {
      const remoteProfile = profileFromRemote(payload?.data, slug);
      if (remoteProfile) {
        applyProfile(remoteProfile);
        setupVideoPlayer();
      }
    })
    .catch(() => {});
})();
