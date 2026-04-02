# Security Notes

## Active Protections

- Passwords are hashed server-side with `scrypt` and configurable work factors.
- Additional password pepper is loaded from `.env` using `APP_PASSWORD_PEPPER`.
- Login sessions use `HttpOnly`, signed, `SameSite=Strict` cookies.
- Login endpoints use request rate limiting and brute-force lockouts.
- API writes validate trusted `Origin` / `Referer` to reduce CSRF risk.
- SQLite access uses prepared statements to reduce SQL injection risk.
- Deploy headers disable framing, sniffing, indexing, and weak cross-domain policies.
- Apache deploy rules deny access to source files, dotfiles, and config files.

## Production Checklist

1. Set a strong `APP_SESSION_SECRET`.
2. Set a strong `APP_PASSWORD_PEPPER`.
3. Set `APP_TRUST_PROXY=true` when the app runs behind a trusted reverse proxy.
4. Set `APP_ALLOWED_ORIGINS` to the exact production origin list.
5. Enforce HTTPS on the final domain.
6. Do not upload `.env`, `server/`, or source files into public web roots.
7. Rotate admin passwords before go-live.
8. Put the public domain behind a WAF/CDN if you need stronger DDoS resistance.

## Pentest Focus Areas

- Credential stuffing / brute-force attempts
- Session theft and cookie flags
- CSRF on authenticated write actions
- SQL injection probes on auth/resource endpoints
- Direct access to hidden deploy files or directory indexes
- Broken access control between `pelatih` and `hco` scopes
