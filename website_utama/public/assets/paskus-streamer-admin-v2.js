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

      const fallback = {
        schema: 1,
        hub: {
          metaTitle: "Streamer Hub PASKUS Gi1 | Karya So-791",
          heroKicker: "Highlight Play",
          heroTitle: "PASKUS GI1",
          heroSubtitle: "Streamer Hub / Karya So-791",
          live: { badge: "Featured Play", title: "Official Highlight", video: "", poster: "" },
          discordSocial: { name: "Discord PASKUS", handle: "PASKUS Gi1 / So-791", status: "Community Hub", href: "https://discord.gg/DZdYTXQYMb" },
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
        if (token() && rememberTokenInput?.checked) {
          localStorage.setItem("paskus.streamer.admin.token", token());
        } else {
          localStorage.removeItem("paskus.streamer.admin.token");
        }
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

      function normalizedSlug(value) {
        return String(value || "")
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 40) || "new";
      }

      function defaultStreamerProfile(slug = "new") {
        const cleanSlug = normalizedSlug(slug);
        const label = cleanSlug === "new" ? "New Creator" : cleanSlug.replace(/(^|-)([a-z0-9])/g, (_match, sep, char) => `${sep}${char.toUpperCase()}`);
        return {
          slug: cleanSlug,
          callSign: label,
          displayName: label,
          role: "Streamer PASKUS791",
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
            { type: "discord", label: "Discord PASKUS", handle: "Community Hub", url: "https://discord.gg/DZdYTXQYMb" },
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
        state.profiles.forEach((profile, index) => {
          const item = itemShell(`${profile.callSign || profile.slug || "Profile"} / ${profile.subdomain || ""}`, () => {
            state.profiles.splice(index, 1);
            renderAll();
          });
          const grid = document.createElement("div");
          grid.className = "stack";
          const row1 = document.createElement("div");
          row1.className = "row three";
          row1.append(
            field("Slug", profile.slug, (v) => { profile.slug = v; profile.subdomain = profile.subdomain || `${v}.so791.com`; syncJson(); }),
            field("Callsign", profile.callSign, (v) => { profile.callSign = v; syncJson(); }),
            field("Subdomain", profile.subdomain, (v) => { profile.subdomain = v; syncJson(); }),
          );
          const row2 = document.createElement("div");
          row2.className = "row";
          row2.append(
            field("Display Name", profile.displayName, (v) => { profile.displayName = v; syncJson(); }),
            field("Handle", profile.handle, (v) => { profile.handle = v; syncJson(); }),
          );
          const row3 = document.createElement("div");
          row3.className = "row three";
          row3.append(
            field("Role", profile.role, (v) => { profile.role = v; syncJson(); }),
            field("Theme", profile.theme, (v) => { profile.theme = v; syncJson(); }),
            field("Avatar URL", profile.avatar, (v) => { profile.avatar = v; syncJson(); }),
          );
          const row4 = document.createElement("div");
          row4.className = "row";
          profile.highlight = profile.highlight || {};
          row4.append(
            field("Highlight Video", profile.highlight.video, (v) => { profile.highlight.video = v; syncJson(); }),
            field("Highlight Poster", profile.highlight.poster, (v) => { profile.highlight.poster = v; syncJson(); }),
          );
          profile.media = profile.media || {};
          const row5 = document.createElement("div");
          row5.className = "row";
          row5.append(
            field("Media Avatar URL", profile.media.avatar, (v) => { profile.media.avatar = v; syncJson(); }),
            field("Landing Background URL", profile.media.pageBackground, (v) => { profile.media.pageBackground = v; syncJson(); }),
          );
          const row6 = document.createElement("div");
          row6.className = "row";
          row6.append(
            field("Profile Card Background URL", profile.media.profileBackground, (v) => { profile.media.profileBackground = v; syncJson(); }),
            field("Landing BG Position", profile.media.pageBackgroundPosition, (v) => { profile.media.pageBackgroundPosition = v; syncJson(); }),
          );
          const row7 = document.createElement("div");
          row7.className = "row three";
          row7.append(
            field("Media Highlight Poster", profile.media.highlightPoster, (v) => { profile.media.highlightPoster = v; syncJson(); }),
            field("Media Highlight WebM", profile.media.highlightWebm, (v) => { profile.media.highlightWebm = v; syncJson(); }),
            field("Media Highlight MP4", profile.media.highlightMp4, (v) => { profile.media.highlightMp4 = v; syncJson(); }),
          );
          const row8 = document.createElement("div");
          row8.className = "row";
          row8.append(
            field("Avatar Photo? true/false", String(profile.media.avatarPhoto ?? ""), (v) => { profile.media.avatarPhoto = v; syncJson(); }),
            field("Prefer MP4? true/false", String(profile.media.preferMp4 ?? ""), (v) => { profile.media.preferMp4 = v; syncJson(); }),
          );
          grid.append(row1, row2, row3, field("Tagline / Bio", profile.tagline, (v) => { profile.tagline = v; syncJson(); }, true), row4, row5, row6, row7, row8, field("Buttons / Links JSON", JSON.stringify(profile.links || [], null, 2), (v) => { profile.links = safeJson(v, profile.links || []); syncJson(); }, true));
          item.appendChild(grid);
          list.appendChild(item);
        });
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
            field("Role", creator.role, (v) => { creator.role = v; syncJson(); }),
          );
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
          ["Profiles", profiles.length],
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
        document.querySelector("#upload-result").innerHTML = `URL: <code>${payload.url}</code>`;
        await navigator.clipboard?.writeText(payload.url).catch(() => {});
        const target = document.querySelector("#upload-target")?.value;
        setMessage(`Upload selesai${target ? ` untuk ${target}` : ""}. URL sudah dicopy jika browser mengizinkan.`);
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
        rememberTokenInput.checked = false;
        state = structuredClone(fallback);
        dirty = false;
        revisionPill.textContent = "Belum Load";
        setUnlocked(false);
        setMessage("Session dashboard ditutup.");
      };
      tokenInput.value = localStorage.getItem("paskus.streamer.admin.token") || "";
      rememberTokenInput.checked = Boolean(tokenInput.value);
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
            state.profiles.push(defaultStreamerProfile("new"));
          } else if (key === "streamerBundle") {
            const slug = normalizedSlug(prompt("Callsign / slug streamer baru?", "new") || "new");
            const profile = defaultStreamerProfile(slug);
            state.profiles.push(profile);
            state.hub.creators = Array.isArray(state.hub.creators) ? state.hub.creators : [];
            state.hub.creators.push(defaultCreatorCard(profile));
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
    
