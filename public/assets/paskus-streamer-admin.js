const API = "/api/streamer-content.php";
      const tokenInput = document.querySelector("#token");
      const rememberTokenInput = document.querySelector("#remember-token");
      const loginButton = document.querySelector("#login");
      const logoutButton = document.querySelector("#logout");
      const loginPanel = document.querySelector("#login-panel");
      const adminApp = document.querySelector("#admin-app");
      const loginMessage = document.querySelector("#login-message");
      const message = document.querySelector("#message");
      const revisionPill = document.querySelector("#revision-pill");
      const jsonEditor = document.querySelector("#json-editor");
      const liveSummary = document.querySelector("#live-summary");
      const liveCreators = document.querySelector("#live-creators");
      const liveContent = document.querySelector("#live-content");
      let state = null;
      let rendering = false;
      let dirty = false;
      let realtimeTimer = null;
      let selectedProfileIndex = 0;

      const fallback = {
        schema: 1,
        hub: {
          metaTitle: "Streamer Hub PASKUS Gi1 | Karya So-791",
          heroKicker: "Highlight Play",
          heroTitle: "PASKUS GI1",
          heroSubtitle: "Streamer Hub / Karya So-791",
          live: { badge: "Featured Play", title: "Official Highlight", video: "", poster: "" },
          discordSocial: { name: "Discord PASKUS", handle: "PASKUS Gi1 / So-791", status: "Community Hub", href: "https://discord.gg/aaBR9ruFva" },
          officialSocials: [],
          events: [],
          creators: [],
          contentCards: [],
        },
        profiles: [],
      };

      function setMessage(text, danger = false) {
        if (message) {
          message.textContent = text;
          message.style.color = danger ? "var(--danger)" : "var(--muted)";
        }
        if (loginMessage) {
          loginMessage.textContent = text;
          loginMessage.style.color = danger ? "var(--danger)" : "var(--muted)";
        }
      }

      function token() {
        return tokenInput.value.trim();
      }

      function saveToken() {
        localStorage.removeItem("paskus.streamer.admin.token");
      }

      function markDirty() {
        dirty = true;
        if (revisionPill && !/\s•\sUnsaved$/.test(revisionPill.textContent)) {
          revisionPill.textContent = `${revisionPill.textContent} • Unsaved`;
        }
      }

      function setUnlocked(unlocked) {
        adminApp?.classList.toggle("is-locked", !unlocked);
        loginPanel?.classList.toggle("hidden", unlocked);
        document.body.classList.toggle("is-unlocked", unlocked);
      }

      function stopRealtime() {
        if (realtimeTimer) {
          window.clearInterval(realtimeTimer);
          realtimeTimer = null;
        }
      }

      function startRealtime() {
        stopRealtime();
        realtimeTimer = window.setInterval(() => {
          if (!dirty && token()) {
            loadData({ silent: true }).catch(() => {});
          }
        }, 15000);
      }

      function get(path, root = state) {
        return String(path).split(".").reduce((acc, key) => acc && acc[key], root);
      }

      function set(path, value, root = state) {
        const keys = String(path).split(".");
        const last = keys.pop();
        const target = keys.reduce((acc, key) => {
          if (!acc[key] || typeof acc[key] !== "object") acc[key] = {};
          return acc[key];
        }, root);
        target[last] = value;
      }

      function splitTags(value) {
        return String(value || "").split(/[,;\n]+/).map((item) => item.trim()).filter(Boolean);
      }

      function initials(value) {
        return String(value || "P")
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((word) => word[0])
          .join("")
          .toUpperCase() || "P";
      }

      function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>"']/g, (char) => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        }[char]));
      }

      function safeJson(value, fallbackValue) {
        try {
          return JSON.parse(value || "[]");
        } catch {
          return fallbackValue;
        }
      }

      function bindSimpleFields() {
        document.querySelectorAll("[data-path]").forEach((input) => {
          input.value = get(input.dataset.path) || "";
          input.oninput = () => {
            set(input.dataset.path, input.value);
            syncJson();
          };
        });
      }

      function itemShell(title, onRemove) {
        const item = document.createElement("article");
        item.className = "item";
        const head = document.createElement("div");
        head.className = "item-head";
        head.innerHTML = `<span class="item-title">${title}</span>`;
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "danger";
        remove.textContent = "Hapus";
        remove.onclick = () => {
          markDirty();
          onRemove();
        };
        head.appendChild(remove);
        item.appendChild(head);
        return item;
      }

      function field(label, value, onInput, multiline = false) {
        const wrap = document.createElement("label");
        wrap.textContent = label;
        const input = document.createElement(multiline ? "textarea" : "input");
        input.value = value || "";
        input.oninput = () => onInput(input.value);
        wrap.appendChild(input);
        return wrap;
      }

      function selectField(label, value, options, onInput) {
        const wrap = document.createElement("label");
        wrap.textContent = label;
        const input = document.createElement("select");
        options.forEach((option) => {
          const node = document.createElement("option");
          node.value = option.value;
          node.textContent = option.label;
          input.appendChild(node);
        });
        input.value = String(value ?? "");
        input.onchange = () => onInput(input.value);
        wrap.appendChild(input);
        return wrap;
      }

      function colorField(label, value, onInput) {
        const wrap = document.createElement("label");
        wrap.textContent = label;
        const box = document.createElement("div");
        box.className = "color-pair";
        const color = document.createElement("input");
        color.type = "color";
        color.value = /^#[0-9a-f]{6}$/i.test(value || "") ? value : "#d4af37";
        const text = document.createElement("input");
        text.value = value || color.value;
        color.oninput = () => {
          text.value = color.value;
          onInput(color.value);
        };
        text.oninput = () => {
          if (/^#[0-9a-f]{6}$/i.test(text.value)) color.value = text.value;
          onInput(text.value);
        };
        box.append(color, text);
        wrap.appendChild(box);
        return wrap;
      }

      function normalizedSlug(value) {
        return String(value || "")
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 40) || "new";
      }

      function profileLiveUrl(profile) {
        const slug = normalizedSlug(profile?.slug || profile?.callSign || "new");
        const subdomain = String(profile?.subdomain || `${slug}.so791.com`).trim();
        return subdomain.includes(".") ? `https://${subdomain}` : `https://${slug}.so791.com`;
      }

      function ensureProfile(profile) {
        const fallbackProfile = defaultStreamerProfile(profile?.slug || profile?.callSign || "new");
        const merged = Object.assign(fallbackProfile, profile || {});
        merged.slug = normalizedSlug(merged.slug || merged.callSign || "new");
        merged.callSign = merged.callSign || merged.slug;
        merged.displayName = merged.displayName || merged.callSign;
        merged.subdomain = merged.subdomain || `${merged.slug}.so791.com`;
        merged.active = merged.active !== false;
        merged.theme = /^#[0-9a-f]{6}$/i.test(merged.theme || "") ? merged.theme : "#d4af37";
        merged.media = Object.assign({}, fallbackProfile.media, merged.media || {});
        merged.highlight = Object.assign({}, fallbackProfile.highlight, merged.highlight || {});
        merged.links = Array.isArray(merged.links) ? merged.links : fallbackProfile.links;
        merged.links = merged.links.map((link, index) => ({
          type: link.type || link.icon || "link",
          icon: link.icon || link.type || "link",
          label: link.label || link.name || "Link",
          handle: link.handle || "",
          url: link.url || link.href || "",
          href: link.href || link.url || "",
          order: Number.isFinite(Number(link.order)) ? Number(link.order) : index,
          active: link.active !== false,
        }));
        return merged;
      }

      function syncCreatorFromProfile(profile) {
        if (!state?.hub) return;
        state.hub.creators = Array.isArray(state.hub.creators) ? state.hub.creators : [];
        const slug = normalizedSlug(profile.slug);
        let creator = state.hub.creators.find((item) => normalizedSlug(item.slug || item.name) === slug);
        if (!creator) {
          creator = defaultCreatorCard(profile);
          state.hub.creators.push(creator);
        }
        const background = profile.media?.profileBackground || profile.media?.pageBackground || profile.background || creator.background || "";
        creator.slug = slug;
        creator.name = profile.callSign || profile.displayName || slug;
        creator.active = profile.active !== false;
        creator.role = profile.role || creator.role || "Streamer PASKUS791";
        creator.badge = creator.badge || profile.role || "Creator PASKUS";
        creator.nickname = creator.nickname || creator.alias || "PASKUS Field Creator";
        creator.href = profileLiveUrl(profile);
        creator.avatar = profile.media?.avatar || profile.avatar || creator.avatar || "";
        creator.background = background;
        creator.cover = background || creator.cover || "";
        creator.links = Array.isArray(profile.links) ? profile.links : creator.links || [];
        if (profile.tagline && (!creator.focus || creator.focus === defaultCreatorCard(profile).focus)) {
          creator.focus = profile.tagline;
        }
        if (profile.tagline && (!creator.bio || creator.bio === defaultCreatorCard(profile).bio)) {
          creator.bio = profile.tagline;
        }
        if (!creator.schedule) creator.schedule = "Highlight / Event / Community";
        if (!Array.isArray(creator.tags) || !creator.tags.length) {
          creator.tags = ["PASKUS", "BRM5", "Highlight"];
        }
      }

      function uniqueSlug(base) {
        const used = new Set((state.profiles || []).map((profile) => normalizedSlug(profile.slug)));
        let slug = normalizedSlug(base);
        let next = slug;
        let count = 2;
        while (used.has(next)) {
          next = `${slug}-${count}`;
          count += 1;
        }
        return next;
      }

      function defaultStreamerProfile(slug = "new") {
        const cleanSlug = normalizedSlug(slug);
        const label = cleanSlug === "new" ? "New Creator" : cleanSlug.replace(/(^|-)([a-z0-9])/g, (_match, sep, char) => `${sep}${char.toUpperCase()}`);
        return {
          slug: cleanSlug,
          callSign: label,
          displayName: label,
          role: "Streamer PASKUS791",
          active: true,
          handle: `@${cleanSlug}`,
          tagline: "Creator PASKUS Gi1 yang membawa highlight BRM5, dokumentasi event, dan karya komunitas ke format visual yang rapi.",
          theme: "#d4af37",
          avatar: "/recruitment-webhook-logo.png",
          media: {
            avatar: "",
            pageBackground: "",
            pageBackgroundPosition: "center top",
            profileBackground: "",
            highlightPoster: "",
            highlightWebm: "",
            highlightMp4: "",
            avatarPhoto: true,
            preferMp4: true,
          },
          subdomain: `${cleanSlug}.so791.com`,
          highlight: { video: "", fallback: "", poster: "" },
          links: [
            { type: "discord", label: "Discord PASKUS", handle: "Community Hub", url: "https://discord.gg/aaBR9ruFva" },
            { type: "community", label: "Streamer Hub", handle: "PASKUS karya dan event", url: "https://paskus.so791.com/streamer" },
          ],
        };
      }

      function defaultCreatorCard(profile) {
        const slug = normalizedSlug(profile?.slug || profile?.callSign || "new");
        const name = profile?.callSign || profile?.displayName || "New Creator";
        const bg = profile?.media?.profileBackground || profile?.media?.pageBackground || profile?.avatar || "";
        return {
          slug,
          name,
          role: profile?.role || "Streamer PASKUS791",
          active: profile?.active !== false,
          badge: profile?.role || "Creator PASKUS",
          nickname: "PASKUS Field Creator",
          focus: profile?.tagline || "Creator PASKUS yang mengemas highlight operasi, event, dan momen komunitas dengan gaya visual yang rapi.",
          bio: profile?.tagline || "Creator PASKUS yang menghadirkan dokumentasi BRM5 roleplay dalam format yang mudah dinikmati anggota dan publik.",
          schedule: "Highlight / Event / Community",
          tags: ["PASKUS", "BRM5", "Highlight"],
          href: profile?.subdomain ? `https://${profile.subdomain}` : `https://${slug}.so791.com`,
          avatar: profile?.media?.avatar || profile?.avatar || "",
          background: bg,
          cover: bg,
          links: Array.isArray(profile?.links) ? profile.links : [],
        };
      }

      function renderProfiles() {
        const list = document.querySelector("#profiles-list");
        list.innerHTML = "";
        state.profiles = Array.isArray(state.profiles) ? state.profiles : [];
        state.profiles = state.profiles.map(ensureProfile);
        if (!state.profiles.length) {
          selectedProfileIndex = 0;
        } else if (selectedProfileIndex >= state.profiles.length) {
          selectedProfileIndex = state.profiles.length - 1;
        }

        const layout = document.createElement("div");
        layout.className = "manager-layout";
        const roster = document.createElement("div");
        roster.className = "streamer-roster";
        const editor = document.createElement("div");
        editor.className = "streamer-editor";

        const rosterHead = document.createElement("div");
        rosterHead.className = "manager-head";
        rosterHead.innerHTML = `<div><h3>Personal Subdomain Manager</h3><p>List streamer existing dan status page individu.</p></div>`;
        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.textContent = "Tambah Streamer";
        addButton.onclick = () => {
          const slug = uniqueSlug(prompt("Callsign / slug streamer baru?", "new") || "new");
          const profile = defaultStreamerProfile(slug);
          profile.active = true;
          state.profiles.push(profile);
          syncCreatorFromProfile(profile);
          selectedProfileIndex = state.profiles.length - 1;
          renderAll();
        };
        rosterHead.appendChild(addButton);
        roster.appendChild(rosterHead);

        state.profiles.forEach((profile, index) => {
          const card = document.createElement("article");
          card.className = `streamer-row${index === selectedProfileIndex ? " is-selected" : ""}${profile.active === false ? " is-disabled" : ""}`;
          const avatar = profile.media?.avatar || profile.avatar || "/recruitment-webhook-logo.png";
          card.innerHTML = `
            <button class="streamer-main" type="button">
              <span class="streamer-avatar">${avatar ? `<img src="${escapeHtml(avatar)}" alt="">` : escapeHtml(initials(profile.callSign))}</span>
              <span>
                <strong>${escapeHtml(profile.callSign || profile.slug)}</strong>
                <small>${escapeHtml(profile.displayName || profile.role || "")}</small>
                <small>${escapeHtml(profile.subdomain || `${profile.slug}.so791.com`)}</small>
              </span>
              <em>${profile.active === false ? "Nonaktif" : "Aktif"}</em>
            </button>
          `;
          card.querySelector(".streamer-main").onclick = () => {
            selectedProfileIndex = index;
            renderProfiles();
          };
          const actions = document.createElement("div");
          actions.className = "mini-actions";
          [
            ["Edit", () => { selectedProfileIndex = index; renderProfiles(); }],
            ["Preview", () => window.open(profileLiveUrl(profile), "_blank", "noopener,noreferrer")],
            ["Duplicate", () => {
              const clone = structuredClone(profile);
              clone.slug = uniqueSlug(`${profile.slug || profile.callSign}-copy`);
              clone.callSign = `${profile.callSign || clone.slug} Copy`;
              clone.displayName = `${profile.displayName || clone.callSign} Copy`;
              clone.subdomain = `${clone.slug}.so791.com`;
              clone.active = false;
              state.profiles.splice(index + 1, 0, clone);
              syncCreatorFromProfile(clone);
              selectedProfileIndex = index + 1;
              renderAll();
            }],
            [profile.active === false ? "Enable" : "Disable", () => {
              profile.active = profile.active === false;
              syncJson();
              renderProfiles();
            }],
          ].forEach(([label, handler]) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = label === "Disable" ? "danger" : "secondary";
            btn.textContent = label;
            btn.onclick = handler;
            actions.appendChild(btn);
          });
          card.appendChild(actions);
          roster.appendChild(card);
        });

        const profile = state.profiles[selectedProfileIndex];
        if (!profile) {
          editor.innerHTML = `<div class="notice">Belum ada streamer. Klik Tambah Streamer untuk membuat profile pertama.</div>`;
        } else {
          editor.appendChild(renderProfileEditor(profile));
        }

        layout.append(roster, editor);
        list.appendChild(layout);
      }

      function renderProfileEditor(profile) {
        const wrap = document.createElement("div");
        wrap.className = "profile-editor-grid";
        const form = document.createElement("div");
        form.className = "stack";
        const preview = document.createElement("aside");
        preview.className = "phone-preview";

        const applyChange = (fn) => {
          fn();
          syncCreatorFromProfile(profile);
          syncJson();
        };
        const oldSlug = profile.slug;

        const identity = document.createElement("div");
        identity.className = "item";
        identity.innerHTML = `<div class="item-head"><span class="item-title">Identity & Subdomain</span><a class="button secondary" href="${escapeHtml(profileLiveUrl(profile))}" target="_blank" rel="noreferrer">Buka Live URL</a></div>`;
        const row1 = document.createElement("div");
        row1.className = "row three";
        row1.append(
          field("Slug / Callsign URL", profile.slug, (v) => applyChange(() => {
            const nextSlug = normalizedSlug(v);
            if (!nextSlug) return;
            profile.slug = nextSlug;
            if (!profile.subdomain || profile.subdomain === `${oldSlug}.so791.com`) profile.subdomain = `${profile.slug}.so791.com`;
          })),
          field("Callsign", profile.callSign, (v) => applyChange(() => { profile.callSign = v; })),
          selectField("Status", profile.active === false ? "0" : "1", [
            { value: "1", label: "Aktif" },
            { value: "0", label: "Nonaktif" },
          ], (v) => applyChange(() => { profile.active = v === "1"; })),
        );
        const row2 = document.createElement("div");
        row2.className = "row three";
        row2.append(
          field("Display Name", profile.displayName, (v) => applyChange(() => { profile.displayName = v; })),
          field("Subdomain", profile.subdomain, (v) => applyChange(() => { profile.subdomain = v.toLowerCase().replace(/[^a-z0-9.-]/g, ""); })),
          colorField("Theme / Accent", profile.theme, (v) => applyChange(() => { profile.theme = v; })),
        );
        const row3 = document.createElement("div");
        row3.className = "row";
        row3.append(
          field("Role / Title", profile.role, (v) => applyChange(() => { profile.role = v; })),
          field("Social Handle", profile.handle, (v) => applyChange(() => { profile.handle = v; })),
        );
        identity.append(row1, row2, row3, field("Bio / Tagline Pendek", profile.tagline, (v) => applyChange(() => { profile.tagline = v; }), true), subdomainNotice(profile));

        const media = document.createElement("div");
        media.className = "item";
        media.innerHTML = `<div class="item-head"><span class="item-title">Media & Highlight Assets</span><button type="button" class="secondary" data-check-assets>Check Asset Status</button></div>`;
        profile.media = profile.media || {};
        profile.highlight = profile.highlight || {};
        const media1 = document.createElement("div");
        media1.className = "row three";
        media1.append(
          field("Profile / Avatar", profile.media.avatar || profile.avatar, (v) => applyChange(() => { profile.media.avatar = v; profile.avatar = v; })),
          field("Banner / Profile Background", profile.media.profileBackground, (v) => applyChange(() => { profile.media.profileBackground = v; })),
          field("Landing Page Background", profile.media.pageBackground, (v) => applyChange(() => { profile.media.pageBackground = v; })),
        );
        const media2 = document.createElement("div");
        media2.className = "row";
        media2.append(
          field("BG Position Desktop", profile.media.pageBackgroundPositionDesktop || profile.media.pageBackgroundPosition, (v) => applyChange(() => { profile.media.pageBackgroundPositionDesktop = v; profile.media.pageBackgroundPosition = v; })),
          field("BG Position Mobile", profile.media.pageBackgroundPositionMobile, (v) => applyChange(() => { profile.media.pageBackgroundPositionMobile = v; })),
        );
        const media3 = document.createElement("div");
        media3.className = "row three";
        media3.append(
          field("Highlight Poster", profile.media.highlightPoster || profile.highlight.poster, (v) => applyChange(() => { profile.media.highlightPoster = v; profile.highlight.poster = v; })),
          field("Highlight WebM", profile.media.highlightWebm || profile.highlight.video, (v) => applyChange(() => { profile.media.highlightWebm = v; profile.highlight.video = v; })),
          field("Highlight MP4", profile.media.highlightMp4 || profile.highlight.fallback, (v) => applyChange(() => { profile.media.highlightMp4 = v; profile.highlight.fallback = v; })),
        );
        const media4 = document.createElement("div");
        media4.className = "row";
        media4.append(
          selectField("Prefer Video", profile.media.preferMp4 ? "mp4" : "webm", [
            { value: "mp4", label: "MP4" },
            { value: "webm", label: "WebM" },
          ], (v) => applyChange(() => { profile.media.preferMp4 = v === "mp4"; })),
          selectField("Avatar Mode", profile.media.avatarPhoto === false ? "logo" : "photo", [
            { value: "photo", label: "Photo" },
            { value: "logo", label: "Logo / Initial" },
          ], (v) => applyChange(() => { profile.media.avatarPhoto = v === "photo"; })),
        );
        const statusBox = document.createElement("div");
        statusBox.className = "asset-status-list";
        statusBox.textContent = "Klik Check Asset Status untuk mengecek URL asset dan subdomain.";
        media.append(media1, media2, media3, media4, statusBox);
        media.querySelector("[data-check-assets]").onclick = () => checkProfileAssets(profile, statusBox);

        const links = renderLinksEditor(profile, applyChange);
        form.append(identity, media, links);
        preview.innerHTML = mobilePreviewHtml(profile);
        wrap.append(form, preview);
        return wrap;
      }

      function subdomainNotice(profile) {
        const node = document.createElement("div");
        node.className = "notice";
        node.innerHTML = `Subdomain aktif: <strong>${escapeHtml(profile.subdomain || `${profile.slug}.so791.com`)}</strong><br>Jika status masih pending, route Cloudflare Worker yang dibutuhkan adalah <code>${escapeHtml((profile.subdomain || `${profile.slug}.so791.com`) + "/*")}</code>.`;
        return node;
      }

      function renderLinksEditor(profile, applyChange) {
        const box = document.createElement("div");
        box.className = "item";
        box.innerHTML = `<div class="item-head"><span class="item-title">Link Buttons</span><button type="button" class="secondary" data-add-link>Tambah Link</button></div>`;
        const list = document.createElement("div");
        list.className = "link-editor-list";
        profile.links = Array.isArray(profile.links) ? profile.links : [];
        profile.links
          .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
          .forEach((link, index) => {
            const row = document.createElement("div");
            row.className = `link-editor-row${link.active === false ? " is-disabled" : ""}`;
            row.append(
              field("Type/Icon", link.type || link.icon || "link", (v) => applyChange(() => { link.type = v; link.icon = v; })),
              field("Label", link.label || link.name || "", (v) => applyChange(() => { link.label = v; link.name = v; })),
              field("Handle", link.handle || "", (v) => applyChange(() => { link.handle = v; })),
              field("URL", link.url || link.href || "", (v) => applyChange(() => { link.url = v; link.href = v; })),
              field("Order", String(link.order ?? index), (v) => applyChange(() => { link.order = Number(v) || 0; })),
              selectField("Status", link.active === false ? "0" : "1", [
                { value: "1", label: "Aktif" },
                { value: "0", label: "Nonaktif" },
              ], (v) => applyChange(() => { link.active = v === "1"; })),
            );
            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "danger";
            remove.textContent = "Hapus Link";
            remove.onclick = () => {
              profile.links.splice(index, 1);
              applyChange(() => {});
              renderProfiles();
            };
            row.appendChild(remove);
            list.appendChild(row);
          });
        box.querySelector("[data-add-link]").onclick = () => {
          profile.links.push({ type: "link", icon: "link", label: "Custom Link", handle: "", url: "", href: "", order: profile.links.length, active: true });
          applyChange(() => {});
          renderProfiles();
        };
        box.appendChild(list);
        return box;
      }

      function mobilePreviewHtml(profile) {
        const media = profile.media || {};
        const avatar = media.avatar || profile.avatar || "/recruitment-webhook-logo.png";
        const bg = media.pageBackground || media.profileBackground || "/assets/about-us-bg-v1.webp";
        const links = (profile.links || []).filter((link) => link.active !== false && (link.url || link.href)).slice(0, 4);
        return `
          <div class="phone-shell" style="--preview-accent:${escapeHtml(profile.theme || "#d4af37")};--preview-bg:url('${escapeHtml(bg)}')">
            <div class="phone-overlay">
              <img src="${escapeHtml(avatar)}" alt="">
              <strong>${escapeHtml(profile.callSign || profile.slug)}</strong>
              <span>${escapeHtml(profile.role || "")}</span>
              <p>${escapeHtml(profile.tagline || "")}</p>
              <div class="phone-links">
                ${links.map((link) => `<i>${escapeHtml(link.label || link.type)}</i>`).join("") || "<i>Belum ada link aktif</i>"}
              </div>
            </div>
          </div>
        `;
      }

      function profileAssetUrls(profile) {
        const media = profile.media || {};
        const highlight = profile.highlight || {};
        const urls = [
          ["Avatar", media.avatar || profile.avatar],
          ["Landing Background", media.pageBackground],
          ["Profile Background", media.profileBackground],
          ["Highlight Poster", media.highlightPoster || highlight.poster],
          ["Highlight WebM", media.highlightWebm || highlight.video],
          ["Highlight MP4", media.highlightMp4 || highlight.fallback],
        ].filter(([, url]) => url);
        (profile.links || [])
          .filter((link) => link?.active !== false && (link.url || link.href))
          .slice()
          .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
          .forEach((link) => urls.push([`Link: ${link.label || link.type || "Custom"}`, link.url || link.href]));
        return urls;
      }

      async function checkProfileAssets(profile, target) {
        target.textContent = "Checking asset dan subdomain...";
        const rows = [];
        const subdomainUrl = `${API}?action=status&kind=subdomain&slug=${encodeURIComponent(profile.slug)}`;
        const subdomain = await fetch(subdomainUrl, { headers: { "X-PASKUS-STREAMER-SECRET": token() }, cache: "no-store" }).then((r) => r.json()).catch(() => null);
        if (subdomain?.result) {
          rows.push(["Subdomain", subdomain.result.subdomain, subdomain.result.status, subdomain.result.ok]);
        }
        for (const [label, url] of profileAssetUrls(profile)) {
          const payload = await fetch(`${API}?action=status&url=${encodeURIComponent(url)}`, {
            headers: { "X-PASKUS-STREAMER-SECRET": token() },
            cache: "no-store",
          }).then((r) => r.json()).catch(() => null);
          const result = payload?.result || {};
          rows.push([label, url, result.label || "error", Boolean(result.ok)]);
        }
        target.innerHTML = rows.map(([label, url, status, ok]) => `
          <div class="asset-status ${ok ? "ok" : "bad"}">
            <strong>${escapeHtml(label)}</strong>
            <span>${escapeHtml(status)}</span>
            <code>${escapeHtml(url || "-")}</code>
          </div>
        `).join("") || "Belum ada asset untuk dicek.";
      }

      function renderCreators() {
        const list = document.querySelector("#creators-list");
        list.innerHTML = "";
        state.hub.creators = Array.isArray(state.hub.creators) ? state.hub.creators : [];
        state.hub.creators.forEach((creator, index) => {
          const item = itemShell(creator.name || "Creator", () => {
            state.hub.creators.splice(index, 1);
            renderAll();
          });
          const row1 = document.createElement("div");
          row1.className = "row three";
          row1.append(
            field("Slug", creator.slug, (v) => { creator.slug = normalizedSlug(v); syncJson(); }),
            field("Nama / Callsign", creator.name, (v) => { creator.name = v; syncJson(); }),
            selectField("Status", creator.active === false ? "0" : "1", [
              { value: "1", label: "Aktif" },
              { value: "0", label: "Nonaktif" },
            ], (v) => { creator.active = v === "1"; syncJson(); }),
          );
          const roleRow = document.createElement("div");
          roleRow.className = "row";
          roleRow.append(field("Role", creator.role, (v) => { creator.role = v; syncJson(); }));
          const row2 = document.createElement("div");
          row2.className = "row three";
          row2.append(
            field("Badge", creator.badge, (v) => { creator.badge = v; syncJson(); }),
            field("Julukan / Nickname", creator.nickname || creator.alias, (v) => { creator.nickname = v; creator.alias = v; syncJson(); }),
            field("Schedule", creator.schedule, (v) => { creator.schedule = v; syncJson(); }),
          );
          const row3 = document.createElement("div");
          row3.className = "row three";
          row3.append(
            field("Profile URL", creator.href, (v) => { creator.href = v; syncJson(); }),
            field("Avatar URL", creator.avatar, (v) => { creator.avatar = v; syncJson(); }),
            field("Background URL", creator.background || creator.cover, (v) => { creator.background = v; creator.cover = creator.cover || v; syncJson(); }),
          );
          item.append(
            row1,
            roleRow,
            row2,
            field("Focus / Bio Card", creator.focus, (v) => { creator.focus = v; syncJson(); }, true),
            field("Bio Detail", creator.bio, (v) => { creator.bio = v; syncJson(); }, true),
            row3,
            field("Tags", (creator.tags || []).join(", "), (v) => { creator.tags = splitTags(v); syncJson(); }),
            field("Buttons / Links JSON", JSON.stringify(creator.links || [], null, 2), (v) => { creator.links = safeJson(v, creator.links || []); syncJson(); }, true)
          );
          list.appendChild(item);
        });
      }

      function renderContent() {
        const list = document.querySelector("#content-list");
        list.innerHTML = "";
        state.hub.contentCards = Array.isArray(state.hub.contentCards) ? state.hub.contentCards : [];
        state.hub.contentCards.forEach((content, index) => {
          const item = itemShell(content.title || "Content", () => {
            state.hub.contentCards.splice(index, 1);
            renderAll();
          });
          const row1 = document.createElement("div");
          row1.className = "row three";
          row1.append(
            field("Type", content.type, (v) => { content.type = v; syncJson(); }),
            field("Title", content.title, (v) => { content.title = v; syncJson(); }),
            field("Uploader", content.uploader, (v) => { content.uploader = v; syncJson(); }),
          );
          const row2 = document.createElement("div");
          row2.className = "row three";
          row2.append(
            field("Unit", content.unit, (v) => { content.unit = v; syncJson(); }),
            field("Status", content.status, (v) => { content.status = v; syncJson(); }),
            field("Link Target", content.href, (v) => { content.href = v; syncJson(); }),
          );
          const row3 = document.createElement("div");
          row3.className = "row three";
          row3.append(
            field("Video", content.video, (v) => { content.video = v; syncJson(); }),
            field("Fallback", content.fallback, (v) => { content.fallback = v; syncJson(); }),
            field("Poster", content.poster, (v) => { content.poster = v; syncJson(); }),
          );
          item.append(row1, row2, row3);
          list.appendChild(item);
        });
      }

      function renderEvents() {
        const list = document.querySelector("#events-list");
        list.innerHTML = "";
        state.hub.events = Array.isArray(state.hub.events) ? state.hub.events : [];
        state.hub.events.forEach((event, index) => {
          const item = itemShell(event.title || "Event", () => {
            state.hub.events.splice(index, 1);
            renderAll();
          });
          const row = document.createElement("div");
          row.className = "row three";
          row.append(
            field("Day", event.day, (v) => { event.day = v; syncJson(); }),
            field("Month", event.month, (v) => { event.month = v; syncJson(); }),
            field("Title", event.title, (v) => { event.title = v; syncJson(); }),
          );
          item.append(row, field("Body", event.body, (v) => { event.body = v; syncJson(); }, true));
          list.appendChild(item);
        });
      }

      function renderSocials() {
        const list = document.querySelector("#socials-list");
        list.innerHTML = "";
        state.hub.officialSocials = Array.isArray(state.hub.officialSocials) ? state.hub.officialSocials : [];
        state.hub.officialSocials.forEach((social, index) => {
          const item = itemShell(social.name || "Social", () => {
            state.hub.officialSocials.splice(index, 1);
            renderAll();
          });
          const row = document.createElement("div");
          row.className = "row three";
          row.append(
            field("Type", social.type, (v) => { social.type = v; syncJson(); }),
            field("Name", social.name, (v) => { social.name = v; syncJson(); }),
            field("Handle", social.handle, (v) => { social.handle = v; syncJson(); }),
          );
          item.append(row, field("Status", social.status, (v) => { social.status = v; syncJson(); }), field("URL", social.href, (v) => { social.href = v; syncJson(); }));
          list.appendChild(item);
        });
      }

      function syncJson(updateTextarea = true) {
        if (!rendering) {
          markDirty();
        }
        if (updateTextarea) {
          jsonEditor.value = JSON.stringify(state, null, 2);
        }
        renderLivePreview();
      }

      function renderAll() {
        rendering = true;
        state.hub = state.hub || structuredClone(fallback.hub);
        bindSimpleFields();
        renderProfiles();
        renderCreators();
        renderContent();
        renderEvents();
        renderSocials();
        syncJson();
        renderLivePreview();
        rendering = false;
      }

      function renderLivePreview() {
        if (!state || !liveSummary) {
          return;
        }
        const hub = state.hub || {};
        const profiles = Array.isArray(state.profiles) ? state.profiles : [];
        const creators = Array.isArray(hub.creators) ? hub.creators : [];
        const contentCards = Array.isArray(hub.contentCards) ? hub.contentCards : [];
        const events = Array.isArray(hub.events) ? hub.events : [];
        liveSummary.innerHTML = [
          ["Streamer Pages", profiles.length],
          ["Creators", creators.length],
          ["Content", contentCards.length],
          ["Events", events.length],
        ].map(([label, value]) => `<div class="live-stat"><strong>${value}</strong><span>${label}</span></div>`).join("");

        if (liveCreators) {
          liveCreators.innerHTML = creators.slice(0, 4).map((creator) => {
            const avatar = creator.avatar || "/recruitment-webhook-logo.png";
            return `
              <div class="live-preview-card">
                ${avatar ? `<img src="${escapeHtml(avatar)}" alt="">` : `<div class="preview-avatar">${escapeHtml(initials(creator.name))}</div>`}
                <div>
                  <strong>${escapeHtml(creator.name || "Creator")}</strong>
                  <span>${escapeHtml(creator.role || "Creator")} / ${escapeHtml(creator.schedule || "No schedule")}</span>
                </div>
              </div>
            `;
          }).join("") || `<div class="toast">Belum ada creator card.</div>`;
        }

        if (liveContent) {
          liveContent.innerHTML = contentCards.slice(0, 3).map((item) => `
            <div class="live-preview-card">
              ${item.poster ? `<img src="${escapeHtml(item.poster)}" alt="">` : `<div class="preview-avatar">${escapeHtml(initials(item.type))}</div>`}
              <div>
                <strong>${escapeHtml(item.title || "Content")}</strong>
                <span>${escapeHtml(item.uploader || "PASKUS")} / ${escapeHtml(item.status || "Draft")}</span>
              </div>
            </div>
          `).join("") || `<div class="toast">Belum ada content archive.</div>`;
        }
      }

      async function loadData(options = {}) {
        if (options.silent && dirty) {
          return;
        }
        saveToken();
        if (!options.silent) {
          setMessage("Loading data...");
        }
        const response = await fetch(`${API}?admin=1&t=${Date.now()}`, {
          headers: { "X-PASKUS-STREAMER-SECRET": token() },
          cache: "no-store",
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || "Gagal load data.");
        }
        state = payload.data || structuredClone(fallback);
        dirty = false;
        setUnlocked(true);
        revisionPill.textContent = payload.revision || state.revision || "Loaded";
        renderAll();
        startRealtime();
        if (!options.silent) {
          setMessage("Data streamer berhasil dimuat.");
        }
      }

      async function saveData() {
        saveToken();
        if (!state) {
          state = safeJson(jsonEditor.value, structuredClone(fallback));
        }
        try {
          const fromJson = JSON.parse(jsonEditor.value);
          if (fromJson && typeof fromJson === "object") {
            state = fromJson;
          }
        } catch {
          setMessage("JSON editor tidak valid. Perbaiki dulu sebelum save.", true);
          return;
        }
        setMessage("Saving...");
        const response = await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-PASKUS-STREAMER-SECRET": token(),
          },
          body: JSON.stringify({ data: state }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || "Gagal save data.");
        }
        state = payload.data;
        dirty = false;
        revisionPill.textContent = payload.revision || "Saved";
        renderAll();
        startRealtime();
        setMessage("Data streamer berhasil disimpan dan siap dibaca website.");
      }

      async function uploadAsset() {
        saveToken();
        const file = document.querySelector("#upload-file").files[0];
        if (!file) {
          setMessage("Pilih file dulu sebelum upload.", true);
          return;
        }
        const form = new FormData();
        form.append("action", "upload");
        form.append("file", file);
        document.querySelector("#upload-result").textContent = "Uploading...";
        const response = await fetch(`${API}?action=upload`, {
          method: "POST",
          headers: { "X-PASKUS-STREAMER-SECRET": token() },
          body: form,
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || "Upload gagal.");
        }
        const storedKb = Math.max(1, Math.round(Number(payload.storedSize || 0) / 1024));
        const originalKb = Math.max(1, Math.round(Number(payload.size || 0) / 1024));
        document.querySelector("#upload-result").innerHTML = `
          <strong>Upload berhasil.</strong><br>
          URL: <code>${payload.url}</code><br>
          Processor: <code>${payload.processor || "original"}</code> · ${originalKb}KB → ${storedKb}KB
        `;
        await navigator.clipboard?.writeText(payload.url).catch(() => {});
        const target = document.querySelector("#upload-target")?.value;
        const profile = state?.profiles?.[selectedProfileIndex];
        if (target && profile) {
          profile.media = profile.media || {};
          profile.highlight = profile.highlight || {};
          if (target === "avatar") {
            profile.media.avatar = payload.url;
            profile.avatar = payload.url;
          } else if (target === "background") {
            profile.media.pageBackground = payload.url;
          } else if (target === "profileBackground") {
            profile.media.profileBackground = payload.url;
          } else if (target === "poster") {
            profile.media.highlightPoster = payload.url;
            profile.highlight.poster = payload.url;
          } else if (target === "video") {
            if (/\\.webm(?:$|\\?)/i.test(payload.url)) {
              profile.media.highlightWebm = payload.url;
              profile.highlight.video = payload.url;
              profile.media.preferMp4 = false;
            } else {
              profile.media.highlightMp4 = payload.url;
              profile.highlight.fallback = payload.url;
              profile.media.preferMp4 = true;
            }
          }
          syncCreatorFromProfile(profile);
          syncJson();
          renderProfiles();
        }
        setMessage(`Upload selesai${target && profile ? ` dan dipasang ke ${profile.callSign || profile.slug}` : target ? ` untuk ${target}` : ""}. URL sudah dicopy jika browser mengizinkan.`);
      }

      document.querySelector("#load").onclick = () => loadData().catch((error) => setMessage(error.message, true));
      document.querySelector("#save").onclick = () => saveData().catch((error) => setMessage(error.message, true));
      document.querySelector("#upload").onclick = () => uploadAsset().catch((error) => setMessage(error.message, true));
      loginButton.onclick = () => loadData().catch((error) => {
        setUnlocked(false);
        setMessage(error.message, true);
      });
      logoutButton.onclick = () => {
        stopRealtime();
        localStorage.removeItem("paskus.streamer.admin.token");
        tokenInput.value = "";
        if (rememberTokenInput) rememberTokenInput.checked = false;
        state = structuredClone(fallback);
        dirty = false;
        revisionPill.textContent = "Belum Load";
        setUnlocked(false);
        setMessage("Session dashboard ditutup.");
      };
      localStorage.removeItem("paskus.streamer.admin.token");
      tokenInput.value = "";
      if (rememberTokenInput) rememberTokenInput.checked = false;
      tokenInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          loginButton.click();
        }
      });

      document.querySelectorAll(".tab").forEach((button) => {
        button.onclick = () => {
          document.querySelectorAll(".tab").forEach((node) => node.classList.toggle("active", node === button));
          document.querySelectorAll(".section").forEach((node) => node.classList.toggle("active", node.dataset.section === button.dataset.tab));
        };
      });

      document.querySelectorAll("[data-add]").forEach((button) => {
        button.onclick = () => {
          if (!state) state = structuredClone(fallback);
          markDirty();
          const key = button.dataset.add;
          if (key === "profiles") {
            const slug = uniqueSlug("new");
            const profile = defaultStreamerProfile(slug);
            profile.active = true;
            state.profiles.push(profile);
            selectedProfileIndex = state.profiles.length - 1;
          } else if (key === "streamerBundle") {
            const slug = uniqueSlug(prompt("Callsign / slug streamer baru?", "new") || "new");
            const profile = defaultStreamerProfile(slug);
            profile.active = true;
            state.profiles.push(profile);
            state.hub.creators = Array.isArray(state.hub.creators) ? state.hub.creators : [];
            state.hub.creators.push(defaultCreatorCard(profile));
            selectedProfileIndex = state.profiles.length - 1;
          } else if (key === "creators") {
            state.hub.creators.push(defaultCreatorCard(defaultStreamerProfile("new")));
          } else if (key === "contentCards") {
            state.hub.contentCards.push({ type: "Video", title: "New Content", uploader: "PASKUS Official", unit: "Official", status: "Draft", video: "", fallback: "", poster: "", href: "" });
          } else if (key === "events") {
            state.hub.events.push({ day: "01", month: "JUN", title: "New Event", body: "" });
          } else if (key === "officialSocials") {
            state.hub.officialSocials.push({ type: "link", name: "New Social", handle: "", status: "", href: "" });
          }
          renderAll();
        };
      });

      jsonEditor.oninput = () => {
        try {
          const parsed = JSON.parse(jsonEditor.value);
          if (parsed && typeof parsed === "object") {
            state = parsed;
            markDirty();
            renderAll();
          }
        } catch {
          // Keep the user's in-progress JSON edit.
        }
      };

      if (token()) {
        loadData().catch((error) => setMessage(error.message, true));
      } else {
        state = structuredClone(fallback);
        renderAll();
        setUnlocked(false);
      }
    
