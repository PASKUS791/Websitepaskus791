# Security Notes

## Ringkasan

Dokumen ini menjelaskan lapisan pertahanan yang sudah ditahan aplikasi, batasnya, dan area yang tetap harus ditopang CDN / WAF / edge.

Backend project ini memakai `MongoDB`, jadi ancaman injection yang relevan adalah `NoSQL injection`, bukan literal `MySQL injection`.

## Matriks Ketahanan

| Jenis Serangan | Sudah Ditahan Aplikasi | Penjelasan | Masih Butuh CDN/WAF/Edge |
|---|---|---|---|
| Brute force login | Ya | Rate limit login, lockout berbasis jendela waktu, hashing `scrypt`, pepper, session rotation | Ya, untuk burst lintas IP dan reputasi IP global |
| Cross-origin probing / CSRF-like write | Ya | Validasi `Origin`, `Referer`, cookie `SameSite=Strict`, `HttpOnly` | Ya, untuk filtering bot dan request anomali lintas region |
| Session hijack | Ya, parsial kuat | Signed cookie, TTL terbatas, binding `user-agent`, HSTS di production | Ya, untuk TLS termination aman dan proteksi edge tambahan |
| XSS / script injection | Ya | Escaping React, CSP, blok signature injeksi skrip umum | Ya, untuk signature filtering di edge |
| NoSQL injection | Ya, parsial | Validasi schema, whitelist field, query Mongo eksplisit, resource sanitization | WAF tidak menggantikan validasi aplikasi |
| Request flood / DDoS ringan | Ya, parsial | Rate limit backend origin | Ya, wajib untuk volumetric DDoS, bot challenge, dan absorption layer |
| Recon / command probing | Ya | Signature block payload berbahaya dan hardening origin | Ya, agar origin tidak jadi titik serang pertama |

## Batas Ketahanan

Yang sudah kuat di layer aplikasi:

- validasi input
- hardening header
- pengamanan sesi
- rate limit dan lockout
- validasi asal request
- sanitasi payload umum yang menyerupai probing

Yang tetap tidak boleh dibebankan hanya ke aplikasi:

- volumetric DDoS
- IP reputation global
- browser challenge / bot management
- geo blocking adaptif
- cache shield / origin shielding

## Catatan MongoDB dan NoSQL Injection

Karena backend memakai MongoDB, mitigasi yang benar adalah:

- jangan pernah meneruskan objek query dari request user secara mentah
- pakai whitelist field untuk filter, sort, dan lookup
- validasi tipe data sebelum membentuk query Mongo
- batasi operator seperti `$ne`, `$gt`, `$regex`, `$where`, `$expr`, dan operator sejenis agar tidak berasal dari input user
- hindari evaluasi string / dynamic query builder tanpa schema guard

## Catatan Trust Wallet

- recovery phrase / seed phrase tidak boleh disimpan di frontend, backend, database, env, atau dokumen deploy
- integrasi wallet yang aman harus memakai `challenge + signature`
- standar dasar yang relevan: `ERC-191` dan `ERC-4361`
- untuk Trust Wallet mobile, koneksi dApp yang aman dilakukan lewat `WalletConnect`

## Referensi Resmi

- [OWASP API Security Top 10 2023](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [CISA Secure by Design](https://www.cisa.gov/securebydesign)
- [CISA / FBI / NSA Advisory AA24-290A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-290a)
- [ERC-191](https://eips.ethereum.org/EIPS/eip-191)
- [ERC-4361](https://eips.ethereum.org/EIPS/eip-4361)
- [Trust Wallet Developer Docs](https://developer.trustwallet.com/developer/develop-for-trust)
- [Trust Wallet Mobile / WalletConnect Docs](https://developer.trustwallet.com/developer/develop-for-trust/mobile)
