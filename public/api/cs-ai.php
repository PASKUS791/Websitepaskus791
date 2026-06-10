<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, max-age=0, must-revalidate');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow, noarchive');

const CS_AI_WEBHOOK_URL = '';
const CS_AI_LOGO_URL = 'https://paskus.so791.com/assets/paskus-D2yVCxRe.webp';
const CS_AI_CHAT_TTL = 600;
const CS_AI_CHAT_MAX_MESSAGES = 24;

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

function cs_response(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function cs_clean(mixed $value, int $maxLength = 500): string
{
    $text = trim((string) $value);
    $text = preg_replace('/[\x00-\x1F\x7F]/u', ' ', $text) ?? '';
    $text = preg_replace('/\s+/u', ' ', $text) ?? '';

    if (function_exists('mb_substr')) {
        return mb_substr($text, 0, $maxLength);
    }

    return substr($text, 0, $maxLength);
}

function cs_clean_multiline(mixed $value, int $maxLength = 1800): string
{
    $text = trim((string) $value);
    $text = str_replace(["\r\n", "\r"], "\n", $text);
    $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', ' ', $text) ?? '';
    $text = preg_replace('/[ \t]+/u', ' ', $text) ?? '';
    $text = preg_replace('/\n{3,}/u', "\n\n", $text) ?? '';
    $text = trim($text);

    if (function_exists('mb_substr')) {
        return mb_substr($text, 0, $maxLength);
    }

    return substr($text, 0, $maxLength);
}

function cs_lower(string $value): string
{
    return function_exists('mb_strtolower') ? mb_strtolower($value, 'UTF-8') : strtolower($value);
}

function cs_upper(string $value): string
{
    return function_exists('mb_strtoupper') ? mb_strtoupper($value, 'UTF-8') : strtoupper($value);
}

function cs_start_discord_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

    session_name('PASKUS_DISCORD');
    session_set_cookie_params([
        'lifetime' => 60 * 60 * 24 * 14,
        'path' => '/',
        'secure' => $isSecure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function cs_config(): array
{
    $path = dirname(__DIR__, 4) . '/.paskus-recruitment/config.php';
    if (!is_readable($path)) {
        return [];
    }

    $config = require $path;
    return is_array($config) ? $config : [];
}

function cs_client_ip(): string
{
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'] as $key) {
        $value = cs_clean($_SERVER[$key] ?? '', 160);
        if ($value === '') {
            continue;
        }
        return trim(explode(',', $value)[0]);
    }

    return 'unknown';
}

function cs_discord_user(): ?array
{
    cs_start_discord_session();
    $user = $_SESSION['discord_user'] ?? null;
    if (!is_array($user) || cs_clean($user['id'] ?? '', 32) === '') {
        return null;
    }

    return [
        'id' => cs_clean($user['id'] ?? '', 32),
        'display' => cs_clean($user['display'] ?? $user['username'] ?? 'Discord User', 120),
        'username' => cs_clean($user['username'] ?? '', 120),
        'mention' => '<@' . cs_clean($user['id'] ?? '', 32) . '>',
    ];
}

function cs_private_dir(): string
{
    return dirname(__DIR__, 4) . '/.paskus-recruitment';
}

function cs_chat_dir(): string
{
    return cs_private_dir() . '/cs-ai-chat';
}

function cs_chat_salt(array $config): string
{
    foreach ([
        $config['cs_ai_chat_salt'] ?? '',
        $config['structure_sync_secret'] ?? '',
        $config['groq_api_key'] ?? '',
        getenv('PASKUS_CS_AI_CHAT_SALT') ?: '',
    ] as $candidate) {
        $salt = cs_clean($candidate, 300);
        if ($salt !== '') {
            return $salt;
        }
    }

    return 'paskus-ai-service-chat';
}

function cs_chat_identity(array $config, ?array $discord): string
{
    cs_start_discord_session();
    $parts = [
        'ip:' . cs_client_ip(),
        'session:' . session_id(),
    ];

    $discordId = cs_clean($discord['id'] ?? '', 32);
    if ($discordId !== '') {
        $parts[] = 'discord:' . $discordId;
    }

    return hash_hmac('sha256', implode('|', $parts), cs_chat_salt($config));
}

function cs_chat_path(array $config, ?array $discord): string
{
    return cs_chat_dir() . '/' . cs_chat_identity($config, $discord) . '.json';
}

function cs_chat_prune(): void
{
    $dir = cs_chat_dir();
    if (!is_dir($dir)) {
        return;
    }

    foreach (glob($dir . '/*.json') ?: [] as $file) {
        if (!is_file($file)) {
            continue;
        }
        $raw = @file_get_contents($file);
        $data = is_string($raw) ? json_decode($raw, true) : null;
        $expiresAt = is_array($data) ? (int) ($data['expires_at'] ?? 0) : 0;
        if ($expiresAt <= time()) {
            @unlink($file);
        }
    }
}

function cs_chat_load(array $config, ?array $discord): array
{
    $path = cs_chat_path($config, $discord);
    if (!is_readable($path)) {
        return ['messages' => []];
    }

    $data = json_decode((string) @file_get_contents($path), true);
    if (!is_array($data) || (int) ($data['expires_at'] ?? 0) <= time()) {
        @unlink($path);
        return ['messages' => []];
    }

    $messages = is_array($data['messages'] ?? null) ? $data['messages'] : [];
    return [
        'messages' => array_values(array_filter($messages, static fn ($message): bool => is_array($message))),
        'updated_at' => (int) ($data['updated_at'] ?? time()),
        'expires_at' => (int) ($data['expires_at'] ?? (time() + CS_AI_CHAT_TTL)),
    ];
}

function cs_chat_message(string $type, string $text, bool $alert = false, array $actions = []): array
{
    $cleanActions = [];
    foreach ($actions as $action) {
        if (!is_array($action)) {
            continue;
        }
        $label = cs_clean($action['label'] ?? '', 80);
        $href = cs_clean($action['href'] ?? '', 240);
        if ($label === '' || $href === '') {
            continue;
        }
        $cleanActions[] = [
            'label' => $label,
            'href' => $href,
        ];
    }

    return [
        'type' => $type === 'user' ? 'user' : 'bot',
        'text' => cs_clean_multiline($text, $type === 'user' ? 700 : 2200),
        'alert' => $alert,
        'actions' => array_slice($cleanActions, 0, 3),
        'time' => time(),
    ];
}

function cs_chat_save(array $config, ?array $discord, array $messages): void
{
    $dir = cs_chat_dir();
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }

    $messages = array_slice(array_values($messages), -CS_AI_CHAT_MAX_MESSAGES);
    $payload = [
        'updated_at' => time(),
        'expires_at' => time() + CS_AI_CHAT_TTL,
        'ip' => cs_client_ip(),
        'discord_id' => cs_clean($discord['id'] ?? '', 32),
        'messages' => $messages,
    ];

    $path = cs_chat_path($config, $discord);
    @file_put_contents($path, json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), LOCK_EX);
    @chmod($path, 0600);
}

function cs_chat_append(array $config, ?array $discord, array $newMessages): array
{
    $state = cs_chat_load($config, $discord);
    $messages = array_merge($state['messages'] ?? [], $newMessages);
    cs_chat_save($config, $discord, $messages);
    return array_slice($messages, -CS_AI_CHAT_MAX_MESSAGES);
}

function cs_chat_clear(array $config, ?array $discord): void
{
    $path = cs_chat_path($config, $discord);
    if (is_file($path)) {
        @unlink($path);
    }
}

function cs_sensitive_check(string $question): array
{
    $q = cs_lower($question);
    $rules = [
        'RED' => [
            'bypass akses atau sistem' => '/\b(bypass|bypas|baypass|skip|lewati sistem|tanpa verifikasi|tanpa discord|tanpa role)\b/u',
            'eksploitasi atau peretasan' => '/\b(hack|hacking|exploit|exploitasi|bobol|inject|injek|sql|xss|ddos|ambil token|token|webhook|secret|config|env)\b/u',
            'kenaikan pangkat tidak resmi' => '/(naik pangkat cepat|pangkat cepat|promosi instan|role gratis|kasih role|angkat pangkat|auto pangkat)/u',
            'pengambilan data internal' => '/(dump data|database|data member|data internal|data rahasia|source code|kode sumber|credential|password admin)/u',
            'privasi data anggota' => '/(daftar anggota|list anggota|nama anggota|id discord anggota|discord id anggota|data anggota|siapa saja anggota|nomor anggota|profil anggota|ambil data anggota)/u',
        ],
        'YELLOW' => [
            'rincian event internal' => '/(event rahasia|jadwal event internal|event apa.*(malam|besok|minggu ini)|rencana operasi|briefing internal|bocoran event)/u',
            'penggalian celah aturan' => '/(celah aturan|cara lolos tanpa|cara ngakalin|cara menghindari hukuman|cara bypass tes)/u',
        ],
    ];

    foreach ($rules as $risk => $items) {
        foreach ($items as $reason => $pattern) {
            if (preg_match($pattern, $q)) {
                return [
                    'sensitive' => true,
                    'risk' => $risk,
                    'reason' => $reason,
                ];
            }
        }
    }

    return [
        'sensitive' => false,
        'risk' => 'GREEN',
        'reason' => 'Pertanyaan umum',
    ];
}

function cs_unit_catalog(): array
{
    return [
        'gatam' => [
            'title' => 'GATAM',
            'aliases' => ['gatam', 'garuda hitam'],
            'category' => 'Infiltration and Stealth Unit',
            'summary' => 'GATAM atau Garuda Hitam adalah unit pasukan khusus untuk operasi rahasia. Unit ini bergerak independen untuk mengamankan posisi strategis, melenyapkan target, atau membebaskan kompleks.',
            'doctrine' => 'GATAM menuntut fokus kuat, koordinasi dan komunikasi tinggi, motivasi penyelesaian yang besar, serta adaptasi di lingkungan penuh tekanan. Satu kesalahan dapat menggagalkan keseluruhan operasi.',
            'capabilities' => [
                'Stealth Entry: masuk ke area operasi secara senyap untuk membuka peluang pengamanan posisi strategis.',
                'Strategic Control: mengamankan titik penting dan menjaga ruang gerak komando dalam operasi rahasia.',
                'Target Resolution: menyelesaikan target atau membebaskan kompleks dengan disiplin dan presisi tinggi.',
            ],
            'priorities' => ['Fokus kuat', 'Koordinasi dan komunikasi', 'Adaptasi dalam tekanan', 'Tidak toleran terhadap kesalahan'],
            'route' => 'Wawancara, uji kemampuan infiltrasi, uji karakter, lalu masa pra-dinas.',
        ],
        'bringas' => [
            'title' => 'BRINGAS',
            'aliases' => ['bringas', 'beringas'],
            'category' => 'Darat / Heavy Duty Unit',
            'summary' => 'BRINGAS adalah pasukan tempur utama infanteri mekanis yang berspesialisasi pada kavaleri ringan dengan klasifikasi APC, AV, dan IFV.',
            'doctrine' => 'Unit ini membawa daya tembak berat, perlindungan infanteri, dan mobilisasi cepat. BRINGAS dipakai untuk menghancurkan titik tahan musuh, membuka ruang gerak, dan memberi perlindungan ketika situasi darat menjadi keras.',
            'capabilities' => [
                'APC / AV / IFV: menguasai kendaraan lapis baja untuk membawa personel, menahan tekanan, dan membuka ruang gerak infanteri.',
                'Fire Support: menghadirkan daya tembak besar untuk menghancurkan titik tahan musuh.',
                'Rapid Protection: memberi perlindungan dan mobilisasi cepat saat infanteri harus keluar dari kondisi darurat.',
            ],
            'priorities' => ['Adaptasi dalam tekanan tinggi', 'Disiplin saat bermobilisasi', 'Daya tahan di lingkungan keras', 'Dapat diandalkan'],
            'route' => 'Wawancara, uji kemampuan kendaraan, uji karakter, lalu masa pra-dinas.',
        ],
        'toruk' => [
            'title' => 'TORUK MAKTO',
            'aliases' => ['toruk', 'toruk makto', 'sky lord', 'unit udara'],
            'category' => 'Sky Lord / Air Specialization Unit',
            'summary' => 'TORUK MAKTO adalah Lord of the Sky, unit udara SO-791 yang berfokus pada penyisipan udara cepat, eksfiltrasi, CAS, CASEVAC, pasukan parasut, lintas udara, dan pilot terbaik.',
            'doctrine' => 'Operasi udara bersifat vital dan hampir tidak memberi ruang untuk kesalahan. Personel TORUK harus disiplin, presisi, adaptif, serta mampu menggabungkan kemampuan piloting, menembak, komunikasi, dan pengambilan keputusan cepat.',
            'capabilities' => [
                'Fast Insertion: memasukkan personel ke titik operasi dengan tempo cepat dan rute udara yang efisien.',
                'CAS / CASEVAC: mendukung pasukan darat melalui dukungan udara jarak dekat dan evakuasi korban dari zona tempur.',
                'Airborne Path: membuka jalur pasukan parasut dan lintas udara untuk operasi yang membutuhkan mobilitas vertikal.',
            ],
            'priorities' => ['Disiplin tinggi', 'Presisi piloting dan tembakan', 'Adaptasi kuat', 'Tidak toleran terhadap kesalahan operasi'],
            'route' => 'Wawancara, uji kemampuan udara, uji karakter, lalu masa pra-dinas.',
        ],
        'sierra' => [
            'title' => 'SIERRA',
            'aliases' => ['sierra', 'serigala'],
            'category' => 'Saboteur and Swift Attack Unit',
            'summary' => 'SIERRA adalah unit infiltrasi dan sabotase taktis yang bergerak senyap untuk menghancurkan sasaran penting, memutus ritme lawan, dan membuka ruang operasi bagi pasukan utama.',
            'doctrine' => 'Keberhasilan SIERRA bertumpu pada fokus, taktik, intelijen operasi, koordinasi tim kecil, dan komunikasi tajam. Unit ini bergerak cepat di area musuh untuk melemahkan target penting tanpa kehilangan disiplin komando.',
            'capabilities' => [
                'Target Elimination: menghancurkan atau mengeliminasi sasaran penting dengan tempo tinggi.',
                'Sabotage Action: melakukan sabotase fasilitas atau kompleks musuh untuk melemahkan kemampuan lawan.',
                'Silent Coordination: bergerak dalam koordinasi tim kecil yang butuh komunikasi jelas, keputusan matang, dan eksekusi tenang.',
            ],
            'priorities' => ['Fokus kuat', 'Taktik dan strategi', 'Koordinasi tinggi', 'Komunikasi baik'],
            'route' => 'Wawancara, uji kemampuan taktis, uji karakter, lalu masa pra-dinas.',
        ],
        'pathfinder' => [
            'title' => 'PATHFINDER',
            'aliases' => ['pathfinder', 'ranger', 'scout', 'pengintai'],
            'category' => 'Ranger and Scout Unit',
            'summary' => 'PATHFINDER adalah infanteri pengintai The Ranger & Scout yang mengkhususkan diri dalam pengintaian, pengawasan, keahlian menembak, dan komunikasi taktis.',
            'doctrine' => 'PATHFINDER menyediakan pengawasan dan hasil intelijen yang menentukan jalannya operasi. Personelnya perlu sabar, presisi, disiplin, serta mampu membaca medan sebelum unit utama bergerak.',
            'capabilities' => [
                'Recon Watch: mengawasi medan dan membaca pergerakan untuk memberi informasi yang bisa dipakai komando.',
                'Marksmanship: menjaga jarak, akurasi, dan kontrol area dengan kemampuan tembak yang tajam.',
                'Tactical Signal: memastikan informasi lapangan tetap jelas, cepat, dan berguna bagi unit utama.',
            ],
            'priorities' => ['Kesabaran tinggi', 'Presisi observasi', 'Kemampuan menembak', 'Komunikasi tajam'],
            'route' => 'Wawancara, uji kemampuan pengintaian, uji karakter, lalu masa pra-dinas.',
        ],
        'sentinel' => [
            'title' => 'SENTINEL',
            'aliases' => ['sentinel', 'medic', 'combat medic', 'medis'],
            'category' => 'Combat Medic Unit',
            'summary' => 'SENTINEL adalah tenaga medis tempur yang berspesialisasi dalam pertolongan pertama di medan aktif, dukungan perlengkapan medis, logistik, dan kendaraan lapis baja medis.',
            'doctrine' => 'SENTINEL menjaga keberlangsungan operasi lewat pertolongan pertama, koordinasi, komunikasi, dan dukungan logistik. Personelnya harus fokus, disiplin, bermoral tinggi, dan termotivasi membantu rekan.',
            'capabilities' => [
                'First Response: memberi pertolongan pertama agar personel dapat distabilkan atau dievakuasi.',
                'Armored Medical: mendukung evakuasi dan mobilitas kebutuhan medis melalui kendaraan lapis baja medis.',
                'Logistic Care: menjaga perlengkapan medis dan logistik agar operasi tidak kehilangan daya dukung.',
            ],
            'priorities' => ['Fokus kuat', 'Koordinasi dan komunikasi', 'Motivasi membantu rekan', 'Moral dan disiplin tinggi'],
            'route' => 'Wawancara, uji kemampuan medis, uji karakter, lalu masa pra-dinas.',
        ],
        'komodo' => [
            'title' => 'KOMODO',
            'aliases' => ['komodo', 'reguler', 'regular', 'pasukan awal'],
            'category' => 'Pasukan Reguler / Initial Training Barracks',
            'summary' => 'KOMODO adalah pasukan reguler awal dari semua anggota yang mulai bergabung, terutama dari pangkat awal Prada hingga Praka.',
            'doctrine' => 'KOMODO berfungsi sebagai barak pelatihan kedisiplinan, filter awal terhadap anggota, tempat pengenalan resimen, dan garda terdepan pembentukan dasar sebelum anggota masuk jalur tugas lain.',
            'capabilities' => [
                'Initial Discipline: membangun disiplin dasar dan kebiasaan mengikuti instruksi.',
                'Member Filtering: menjadi tahap penyaringan awal untuk melihat komitmen, sikap, dan kesiapan anggota.',
                'Resimen Introduction: mengenalkan budaya, struktur, dan ritme PASKUS kepada anggota baru.',
            ],
            'priorities' => ['Disiplin dasar', 'Kesiapan belajar', 'Komitmen awal', 'Adaptasi terhadap kultur resimen'],
            'route' => 'Ikuti pendaftaran awal, sinkron Discord, pilih golongan, lalu ikuti arahan pelatih atau perekrut.',
        ],
    ];
}

function cs_support_catalog(): array
{
    return [
        'staff' => [
            'title' => 'SEKSI 1',
            'aliases' => ['staff', 'staff komando', 'seksi satu', 'seksi 1', 'pengurus besar'],
            'summary' => 'SEKSI 1 adalah otak resimen dan pengurus besar PASKUS. Dinas ini menjadi pusat dari seluruh unit non-tempur serta mengatur arahan, event, evaluasi, jadwal, validasi data, dan tata kelola internal.',
            'focus' => ['Pusat arahan non-tempur', 'Event dan evaluasi', 'Jadwal dan validasi data', 'Rekrutmen rahasia'],
            'route' => 'Syarat masuk Seksi 1 bersifat rahasia. Rekrutmen hanya dari Kepala Resimen dan tidak tersedia melalui pendaftaran umum.',
        ],
        'dpdm' => [
            'title' => 'DPDM',
            'aliases' => ['dpdm', 'polisi militer', 'dinas polisi militer', 'hukum', 'penyelidikan'],
            'summary' => 'DPDM adalah dinas penegak hukum SO-791 yang mengatur peraturan, ketaatan, penyelidikan, dan fungsi polisi militer dalam roleplay resimen.',
            'focus' => ['Penegakan aturan', 'Penyelidikan roleplay', 'Ketertiban resimen'],
            'route' => 'Penilaian difokuskan pada integritas, ketelitian membaca pelanggaran, kedewasaan keputusan, komunikasi, dan ketegasan menjaga aturan roleplay.',
        ],
        'pusdiklat' => [
            'title' => 'PUSDIKLAT',
            'aliases' => ['pusdiklat', 'pelatih', 'asisten pelatih', 'kopendiklat'],
            'summary' => 'PUSDIKLAT adalah pusat pendidikan, latihan, dan disiplin. Dinas ini membina individu, mempraktikkan strategi, dan menjaga standar kedisiplinan tinggi.',
            'focus' => ['Pembinaan individu', 'Praktik strategi', 'Standar disiplin'],
            'route' => 'Standar pangkat: Prajurit Senior sampai Bintara. Penilaian fokus pada kemampuan melatih, memahami strategi, dan menjaga disiplin.',
        ],
        'propaganda' => [
            'title' => 'PROPAGANDA',
            'aliases' => ['propaganda', 'dokumentasi', 'media'],
            'summary' => 'PROPAGANDA adalah dinas kreatif yang membuat dokumentasi, mengolah momen operasi, dan membangun konten yang menarik untuk resimen.',
            'focus' => ['Dokumentasi lapangan', 'Produksi konten', 'Arsip visual'],
            'route' => 'Standar pangkat: Prajurit Senior sampai Bintara. Penilaian fokus pada kreativitas, konsistensi produksi, dan tanggung jawab publikasi.',
        ],
        'zeni' => [
            'title' => 'ZENI TEMPUR',
            'aliases' => ['zeni', 'zeni tempur', 'map', 'scenario', 'skenario'],
            'summary' => 'ZENI TEMPUR adalah dinas pembangun skenario dan map yang memberi ruang operasi bagi SO-791 melalui area, objektif, dan alur event.',
            'focus' => ['Scenario build', 'Map responsibility', 'Operational immersion'],
            'route' => 'Standar pangkat: Prajurit Senior sampai Bintara. Penilaian fokus pada kreativitas skenario, tanggung jawab map, dan kesiapan mendukung event.',
        ],
    ];
}

function cs_officer_rank_names(): array
{
    return [
        'MAYOR JENDRAL',
        'BRIGADIR JENDRAL',
        'KOLONEL',
        'LETNAN KOLONEL',
        'MAYOR',
        'KAPTEN',
        'LETNAN SATU',
        'LETNAN DUA',
    ];
}

function cs_structure_live_path(array $config): string
{
    $configured = cs_clean($config['structure_live_path'] ?? '', 400);
    if ($configured !== '') {
        return $configured;
    }

    return cs_private_dir() . '/structure-live.json';
}

function cs_structure_live_data(array $config): ?array
{
    $path = cs_structure_live_path($config);
    if (!is_readable($path)) {
        return null;
    }

    $decoded = json_decode((string) @file_get_contents($path), true);
    return is_array($decoded) ? $decoded : null;
}

function cs_normalize_lookup(string $value): string
{
    $text = cs_lower($value);
    $withoutBrackets = preg_replace('/\[[^\]]*\]/', ' ', $text);
    if (is_string($withoutBrackets)) {
        $text = $withoutBrackets;
    }

    $normalized = preg_replace('/[^\p{L}\p{N}.]+/u', ' ', $text);
    if (!is_string($normalized)) {
        $normalized = preg_replace('/[^a-z0-9.]+/i', ' ', $text) ?? $text;
    }

    $text = preg_replace('/\s+/', ' ', $normalized) ?? $normalized;
    return trim($text);
}

function cs_member_aliases(string $member): array
{
    $plain = cs_normalize_lookup($member);
    $rough = preg_replace('/\[[^\]]*\]/', ' ', $member) ?? $member;
    $rough = cs_lower(preg_replace('/[^A-Za-z0-9.]+/', ' ', $rough) ?? $rough);
    $withoutRanks = preg_replace(
        '/\b(mayjen|brigjen|kol|letkol|kapt|kapten|cpt|lettu|letda|lt|pel|med|log|staff|pm|pro|hco)\.?\b/iu',
        ' ',
        $plain,
    ) ?? $plain;
    $withoutRanks = preg_replace('/\s+/u', ' ', trim($withoutRanks)) ?? '';
    $roughWithoutRanks = preg_replace(
        '/\b(mayjen|brigjen|kol|letkol|kapt|kapten|cpt|lettu|letda|lt|pel|med|log|staff|pm|pro|hco)\.?\b/i',
        ' ',
        $rough,
    ) ?? $rough;
    $roughWithoutRanks = preg_replace('/\s+/', ' ', trim($roughWithoutRanks)) ?? '';

    $aliases = array_filter(array_unique([
        $plain,
        $withoutRanks,
        $rough,
        $roughWithoutRanks,
        trim(preg_replace('/\b(i{1,3}|ii|iii)\b/iu', ' ', $withoutRanks) ?? ''),
    ]));

    foreach (preg_split('/\s+/', $roughWithoutRanks) ?: [] as $token) {
        $token = trim($token, ". ");
        if (strlen($token) >= 3) {
            $aliases[] = $token;
        }
    }

    return array_values(array_filter($aliases, static fn (string $alias): bool => strlen($alias) >= 3));
}

function cs_structure_officers(array $config): array
{
    $data = cs_structure_live_data($config);
    $categories = is_array($data['categories'] ?? null) ? $data['categories'] : [];
    $officerRanks = array_flip(cs_officer_rank_names());
    $officers = [];

    foreach ($categories as $category) {
        if (!is_array($category)) {
            continue;
        }
        $categoryName = cs_upper(cs_clean($category['category'] ?? '', 80));
        foreach ((is_array($category['ranks'] ?? null) ? $category['ranks'] : []) as $rank) {
            if (!is_array($rank)) {
                continue;
            }
            $rankName = cs_upper(cs_clean($rank['name'] ?? '', 80));
            if (!isset($officerRanks[$rankName])) {
                continue;
            }
            $members = is_array($rank['members'] ?? null) ? $rank['members'] : [];
            foreach ($members as $member) {
                $display = cs_clean_multiline($member, 180);
                if ($display === '') {
                    continue;
                }
                $officers[] = [
                    'display' => $display,
                    'rank' => $rankName,
                    'role' => cs_clean($rank['role'] ?? 'Rank Position', 120),
                    'category' => $categoryName,
                    'aliases' => cs_member_aliases($display),
                ];
            }
        }
    }

    return $officers;
}

function cs_structure_rank_aliases(): array
{
    return [
        'MAYOR JENDRAL' => ['mayor jendral', 'mayjen'],
        'BRIGADIR JENDRAL' => ['brigadir jendral', 'brigjen'],
        'KOLONEL' => ['kolonel', 'kol.'],
        'LETNAN KOLONEL' => ['letnan kolonel', 'letkol'],
        'MAYOR' => ['mayor'],
        'KAPTEN' => ['kapten', 'kapt.', 'cpt'],
        'LETNAN SATU' => ['letnan satu', 'lettu', 'letnan 1'],
        'LETNAN DUA' => ['letnan dua', 'letda', 'letnan 2'],
    ];
}

function cs_format_officer_line(array $officer): string
{
    return $officer['display'] . ' - ' . $officer['rank'] . ' / ' . $officer['role'] . ' (' . $officer['category'] . ')';
}

function cs_structure_officer_answer(string $question, array $config): ?string
{
    $officers = cs_structure_officers($config);
    if ($officers === []) {
        return null;
    }

    $q = cs_normalize_lookup($question);
    $matches = [];
    foreach ($officers as $officer) {
        foreach ($officer['aliases'] as $alias) {
            if ($alias !== '' && strpos($q, $alias) !== false) {
                $matches[] = $officer;
                break;
            }
        }
    }

    if ($matches !== []) {
        $seen = [];
        $matches = array_values(array_filter($matches, static function (array $officer) use (&$seen): bool {
            $key = ($officer['rank'] ?? '') . '|' . ($officer['display'] ?? '');
            if (isset($seen[$key])) {
                return false;
            }
            $seen[$key] = true;
            return true;
        }));
        if (count($matches) === 1) {
            $officer = $matches[0];
            return "Saya menemukan nama itu di data Struktural yang tampil di website.\n\n"
                . cs_format_officer_line($officer)
                . "\n\nData ini mengikuti daftar perwira publik pada halaman Struktural. Untuk bintara dan tamtama, website hanya menampilkan jumlah personel.";
        }

        return "Saya menemukan beberapa perwira yang cocok dengan pertanyaan itu:\n\n- "
            . implode("\n- ", array_map('cs_format_officer_line', array_slice($matches, 0, 8)))
            . "\n\nKalau mau lebih spesifik, sebut nama atau pangkatnya.";
    }

    $rankMatches = [];
    foreach (cs_structure_rank_aliases() as $rankName => $aliases) {
        foreach ($aliases as $alias) {
            if (strpos($q, cs_normalize_lookup($alias)) !== false) {
                $rankMatches[$rankName] = true;
                break;
            }
        }
    }

    if ($rankMatches !== []) {
        $rankNames = array_keys($rankMatches);
        $rankOfficers = array_values(array_filter(
            $officers,
            static fn (array $officer): bool => in_array($officer['rank'], $rankNames, true),
        ));
        if ($rankOfficers !== []) {
            return "Berikut data perwira pada pangkat yang kamu tanyakan:\n\n- "
                . implode("\n- ", array_map('cs_format_officer_line', $rankOfficers));
        }
    }

    if (preg_match('/(siapa saja|nama nama|daftar|list|jajaran).*(perwira|struktural|struktur)|(perwira).*(siapa saja|nama nama|daftar|list|jajaran)/u', $q)) {
        $grouped = [];
        foreach ($officers as $officer) {
            $grouped[$officer['category']][] = cs_format_officer_line($officer);
        }

        $lines = [];
        foreach ($grouped as $category => $items) {
            $lines[] = $category . ":\n- " . implode("\n- ", $items);
        }

        return "Berikut jajaran perwira yang tampil di halaman Struktural:\n\n" . implode("\n\n", $lines);
    }

    if (preg_match('/(siapa|nama|orang|perwira|struktural|struktur)/u', $q)) {
        return 'Saya belum menemukan nama itu di jajaran perwira yang tampil pada halaman Struktural. Saya hanya bisa menjawab nama perwira yang tersedia publik; bintara dan tamtama tetap ditampilkan sebagai angka personel.';
    }

    return null;
}

function cs_find_catalog_item(string $question, array $catalog): ?array
{
    $q = cs_lower($question);
    foreach ($catalog as $key => $item) {
        foreach (($item['aliases'] ?? []) as $alias) {
            if ($alias !== '' && strpos($q, cs_lower($alias)) !== false) {
                if (!isset($item['slug'])) {
                    $item['slug'] = (string) $key;
                }
                return $item;
            }
        }
    }

    return null;
}

function cs_format_unit_answer(array $unit): string
{
    return sprintf(
        "%s (%s)\n\n%s\n\nDoktrin: %s\n\nKemampuan inti:\n- %s\n\nKarakter yang dicari:\n- %s\n\nAlur masuk: %s",
        $unit['title'],
        $unit['category'],
        $unit['summary'],
        $unit['doctrine'],
        implode("\n- ", $unit['capabilities']),
        implode("\n- ", $unit['priorities']),
        $unit['route'],
    );
}

function cs_format_support_answer(array $unit): string
{
    return sprintf(
        "%s\n\n%s\n\nFokus kerja:\n- %s\n\nAlur/standar: %s",
        $unit['title'],
        $unit['summary'],
        implode("\n- ", $unit['focus']),
        $unit['route'],
    );
}

function cs_unit_overview_answer(): string
{
    $items = array_map(
        static fn (array $unit): string => $unit['title'] . ': ' . $unit['summary'],
        cs_unit_catalog(),
    );

    return "Unit tempur SO-791 memiliki fungsi yang berbeda sesuai kebutuhan operasi:\n\n- " . implode("\n- ", $items) . "\n\nKalau kamu ingin detail satu unit, sebut nama unitnya, misalnya TORUK MAKTO, GATAM, BRINGAS, atau SENTINEL.";
}

function cs_support_overview_answer(): string
{
    $items = array_map(
        static fn (array $unit): string => $unit['title'] . ': ' . $unit['summary'],
        cs_support_catalog(),
    );

    return "Dinas non-tempur SO-791 menjadi jalur kontribusi di luar operasi tempur langsung:\n\n- " . implode("\n- ", $items);
}

function cs_site_context(): string
{
    $unitLines = array_map(
        static fn (array $unit): string => $unit['title'] . ' - ' . $unit['category'] . ': ' . $unit['summary'] . ' Doktrin: ' . $unit['doctrine'] . ' Kemampuan: ' . implode('; ', $unit['capabilities']) . ' Karakter: ' . implode(', ', $unit['priorities']) . '. Alur: ' . $unit['route'],
        cs_unit_catalog(),
    );
    $supportLines = array_map(
        static fn (array $unit): string => $unit['title'] . ': ' . $unit['summary'] . ' Fokus: ' . implode(', ', $unit['focus']) . '. Alur: ' . $unit['route'],
        cs_support_catalog(),
    );

    return implode("\n", array_merge([
        'PASKUS-791 adalah resimen dengan unit khusus, dinas non-tempur, pendaftaran anggota, Discord sync, dan struktural.',
        'PASKUS AI SERVICE adalah layanan bantuan informasi yang didukung AI dan memakai memori intent non-sensitif untuk mengenali pola pertanyaan umum. Memori ini bukan penyimpanan data anggota/pribadi, tidak melatih model eksternal, tidak menjawab data privat anggota, dan tidak membantu bypass atau kenaikan pangkat tidak resmi.',
        'Discord sync hanya mengambil ID Discord untuk pendataan resimen dan otomatisasi. Pendaftaran wajib sync Discord.',
        'Golongan 1 adalah penjadwalan pagi sampai siang menjelang sore.',
        'Golongan 2 adalah penjadwalan sore sampai malam.',
        'Informasi umum yang boleh dijawab: tata cara pendaftaran, penjelasan anggota secara umum, penjelasan PMC dan sipil secara umum, pembagian golongan perekrutan, unit, dinas, event umum, dan struktur pangkat umum.',
        'Event resmi yang dijelaskan website: PVE Vanilla Scenario, PVE Custom Scenario, Internal PVP, dan External PVP. Jadwal detail diumumkan lewat komando/Discord.',
        'Alur pendaftaran: sinkron Discord, isi nama Roblox dan data dasar, pilih golongan, kirim pendaftaran, lalu ikuti arahan perekrut/pelatih.',
        'Struktural menampilkan kategori pangkat dan personel: Perwira Tinggi, Perwira Menengah, Perwira Pertama, Bintara Tinggi, Bintara Muda, Tamtama Senior, Tamtama Junior.',
        'Nama personel yang boleh dijawab hanya jajaran perwira yang memang tampil publik di halaman Struktural. Bintara dan tamtama tidak dibuka sebagai nama, hanya angka personel.',
        'Detail unit tempur:',
    ], $unitLines, ['Detail dinas non-tempur:'], $supportLines));
}

function cs_is_paskus_related(string $question): bool
{
    return (bool) preg_match('/paskus|so-?791|resimen|pendaftaran|daftar|enlist|gabung|join|ikut|masuk|discord|sinkron|sync|golongan|unit|tempur|combat|dinas|support|non tempur|anggota|member|prajurit|personel|pmc|sipil|civilian|event|pve|pvp|scenario|skenario|pangkat|struktural|struktur|perwira|bintara|tamtama|gatam|bringas|beringas|toruk|serigala|sierra|pathfinder|sentinel|komodo|staff|seksi|pengurus besar|dpdm|polisi militer|pusdiklat|propaganda|zeni|pelatih|map/u', cs_lower($question));
}

function cs_knowledge_answer(string $question, array $check): string
{
    if ($check['sensitive']) {
        return 'Saya tidak memiliki hak menjawab sebagai CS untuk pertanyaan tersebut.';
    }

    $q = cs_lower($question);
    $unit = cs_find_catalog_item($question, cs_unit_catalog());
    if ($unit !== null) {
        return cs_format_unit_answer($unit);
    }

    $support = cs_find_catalog_item($question, cs_support_catalog());
    if ($support !== null) {
        return cs_format_support_answer($support);
    }

    if (preg_match('/unit tempur|combat|unit khusus/u', $q)) {
        return cs_unit_overview_answer();
    }

    if (preg_match('/dinas|support|non tempur/u', $q)) {
        return cs_support_overview_answer();
    }

    if (preg_match('/golongan|jadwal|waktu latihan|pagi|sore|malam/u', $q)) {
        return "Golongan dipakai untuk membantu penjadwalan pelatihan dan perekrutan.\n\nGolongan 1: pagi sampai siang menjelang sore. Cocok untuk anggota yang aktif di awal hari.\n\nGolongan 2: sore sampai malam. Cocok untuk anggota yang lebih aktif setelah siang.\n\nPilih golongan yang paling sesuai saat mendaftar agar perekrut dan pelatih bisa mengatur sesi dengan lebih rapi.";
    }

    if (preg_match('/daftar|pendaftaran|enlist|gabung|join|anggota baru|mau masuk|cara masuk|ikut paskus|jadi anggota/u', $q)) {
        return "Alur pendaftaran PASKUS:\n\n1. Sinkronkan akun Discord terlebih dahulu.\n2. Isi nama Roblox dan data dasar di form pendaftaran.\n3. Pilih Golongan 1 atau Golongan 2 sesuai waktu aktif.\n4. Kirim pendaftaran dan tunggu tindak lanjut dari perekrut atau pelatih.\n\nDiscord ID diambil otomatis untuk pendataan resimen dan membantu proses tag di aplikasi pelatih.";
    }

    if (preg_match('/anggota|member|prajurit|personel/u', $q)) {
        return 'Anggota PASKUS mengikuti jalur resmi mulai dari pendaftaran, sinkron Discord, pendataan, dan pelatihan sesuai golongan. Secara umum, anggota akan diarahkan melalui pembentukan dasar, penilaian disiplin, komunikasi, karakter, dan kecocokan sebelum masuk jalur unit atau dinas. Saya tidak dapat membuka daftar nama, Discord ID, atau data privat anggota.';
    }

    if (preg_match('/pmc|sipil|civilian|warga/u', $q)) {
        return 'Dalam konteks website, PMC dan sipil dapat dipahami sebagai bagian dari ruang roleplay/komunitas secara umum. Kalau ingin bergabung ke PASKUS, jalurnya tetap melalui pendaftaran resmi, sinkron Discord, pemilihan golongan, lalu mengikuti arahan perekrut atau pelatih.';
    }

    if (preg_match('/discord|sinkron|sync|id discord/u', $q)) {
        return 'Discord sync digunakan untuk mengambil ID Discord secara otomatis. Website hanya mengambil ID Discord untuk pendataan dalam resimen dan otomatisasi, bukan password atau akses pribadi. Pendaftaran umum dan pendaftaran unit tempur wajib sinkron Discord sebelum data dikirim.';
    }

    if (preg_match('/event|pve|pvp|scenario|skenario/u', $q)) {
        return 'Jenis event yang dijelaskan di website meliputi PVE Vanilla Scenario, PVE Custom Scenario, Internal PVP, dan External PVP. Event dipakai untuk membangun strategi, pengalaman taktis, roleplay, koordinasi, dan kesiapan anggota. Jadwal detail atau briefing internal tetap mengikuti pengumuman resmi komando/Discord.';
    }

    if (preg_match('/pangkat|struktural|struktur|perwira|bintara|tamtama/u', $q)) {
        return 'Struktural PASKUS menampilkan jenjang Perwira Tinggi, Perwira Menengah, Perwira Pertama, Bintara Tinggi, Bintara Muda, Tamtama Senior, dan Tamtama Junior. Kenaikan pangkat mengikuti jalur resmi berdasarkan kedisiplinan, kontribusi, penilaian, dan arahan komando.';
    }

    if (!cs_is_paskus_related($question)) {
        return 'Pertanyaan itu berada di luar ruang lingkup utama PASKUS AI SERVICE. Secara singkat saya bisa memberi gambaran umum, tetapi jawaban utama saya difokuskan pada informasi PASKUS seperti pendaftaran, Discord sync, golongan, unit, dinas, event umum, dan struktural.';
    }

    return 'Saya bisa bantu informasi PASKUS berdasarkan konten website: pendaftaran, Discord sync, Golongan 1 dan 2, unit tempur, dinas non-tempur, event umum, PMC/sipil secara umum, anggota secara umum, dan struktural. Sebut topik atau nama unitnya agar saya bisa jawab lebih detail dan tepat.';
}

function cs_localized_knowledge_answer(string $question, array $check, string $language): string
{
    if ($language !== 'su') {
        return cs_knowledge_answer($question, $check);
    }

    if ($check['sensitive']) {
        return 'Abdi henteu gaduh hak ngajawab salaku CS pikeun patarosan éta.';
    }

    $q = cs_lower($question);
    $unit = cs_find_catalog_item($question, cs_unit_catalog());
    if ($unit !== null) {
        return sprintf(
            "%s (%s)\n\n%s\n\nDoktrin: %s\n\nKamampuan inti:\n- %s\n\nKarakter anu dipilarian:\n- %s\n\nAlur asup: %s",
            $unit['title'],
            $unit['category'],
            $unit['summary'],
            $unit['doctrine'],
            implode("\n- ", $unit['capabilities']),
            implode("\n- ", $unit['priorities']),
            $unit['route'],
        );
    }

    $support = cs_find_catalog_item($question, cs_support_catalog());
    if ($support !== null) {
        return sprintf(
            "%s\n\n%s\n\nFokus damel:\n- %s\n\nAlur/standar: %s",
            $support['title'],
            $support['summary'],
            implode("\n- ", $support['focus']),
            $support['route'],
        );
    }

    if (preg_match('/paskus|so-?791|resimen/u', $q)) {
        return "PASKUS-791 nyaéta resimen komunitas taktis anu boga unit tempur, dinas non-tempur, pendaftaran anggota, Discord sync, jeung struktur pangkat. Fokusna nyaéta disiplin, komunikasi anu écés, roleplay anu rapih, sarta penempatan anggota saluyu jeung kamampuan jeung komitmenna.";
    }

    if (preg_match('/daftar|pendaftaran|enlist|gabung|join|asup|anggota anyar|cara masuk/u', $q)) {
        return "Alur pendaftaran PASKUS:\n\n1. Sinkronkeun akun Discord heula.\n2. Eusian nami Roblox jeung data dasar dina form pendaftaran.\n3. Pilih Golongan 1 atawa Golongan 2 saluyu jeung waktu aktif.\n4. Kirim pendaftaran jeung antosan arahan ti perekrut atawa pelatih.\n\nDiscord ID dicokot otomatis pikeun pendataan resimen jeung ngabantu proses tag di aplikasi pelatih.";
    }

    if (preg_match('/discord|sinkron|sync|id discord/u', $q)) {
        return 'Discord sync dipaké pikeun nyokot ID Discord sacara otomatis. Website ngan nyokot ID Discord pikeun pendataan resimen jeung otomatisasi, sanés password atawa aksés pribadi. Pendaftaran wajib sinkron Discord saméméh data dikirim.';
    }

    if (preg_match('/golongan|jadwal|waktu latihan|pagi|sore|malam|isuk|peuting/u', $q)) {
        return "Golongan ngabantu penjadwalan pelatihan jeung perekrutan.\n\nGolongan 1: isuk nepi ka beurang ngajelang sore.\n\nGolongan 2: sore nepi ka peuting.\n\nPilih golongan anu paling cocog nalika daptar supaya perekrut jeung pelatih tiasa ngatur sesi leuwih rapih.";
    }

    if (preg_match('/unit tempur|combat|unit khusus|tempur/u', $q)) {
        return "Unit tempur SO-791 miboga fungsi anu béda-béda: GATAM pikeun operasi rahasia, BRINGAS pikeun mekanis darat, TORUK MAKTO pikeun udara, SIERRA pikeun infiltrasi jeung sabotase, PATHFINDER pikeun pengintaian, SENTINEL pikeun combat medic, jeung KOMODO salaku pasukan reguler awal.";
    }

    if (preg_match('/dinas|support|non tempur/u', $q)) {
        return "Dinas non-tempur SO-791 jadi jalur kontribusi di luar operasi tempur langsung. Eusina ngawengku SEKSI 1, DPDM, PUSDIKLAT, PROPAGANDA, jeung ZENI TEMPUR kalayan tugas administrasi, hukum, pelatihan, dokumentasi, jeung scenario/map.";
    }

    return 'Abdi tiasa ngabantosan informasi PASKUS dumasar konten website: pendaftaran, Discord sync, Golongan 1 jeung 2, unit tempur, dinas non-tempur, event umum, PMC/sipil sacara umum, anggota sacara umum, jeung struktural. Sebatkeun topik atawa nami unitna supados jawaban langkung tepat.';
}

function cs_answer_quality_ok(string $answer): bool
{
    $text = trim(preg_replace('/\s+/u', ' ', $answer));
    if ($text === '' || mb_strlen($text) < 8) {
        return false;
    }

    if (preg_match('/(.{8,80})(?:\s+\1){3,}/u', $text)) {
        return false;
    }

    $words = preg_split('/\s+/u', cs_lower($text), -1, PREG_SPLIT_NO_EMPTY);
    if (count($words) >= 24) {
        $uniqueRatio = count(array_unique($words)) / max(1, count($words));
        if ($uniqueRatio < 0.22) {
            return false;
        }
    }

    return true;
}

function cs_detect_intent(string $question, array $check): string
{
    if ($check['sensitive']) {
        return 'security';
    }

    $unit = cs_find_catalog_item($question, cs_unit_catalog());
    if ($unit !== null) {
        return 'unit:' . cs_clean($unit['slug'] ?? '', 80);
    }

    $support = cs_find_catalog_item($question, cs_support_catalog());
    if ($support !== null) {
        return 'support:' . cs_clean($support['slug'] ?? '', 80);
    }

    $q = cs_lower($question);
    if (preg_match('/daftar|pendaftaran|enlist|gabung|join|anggota baru|mau masuk|cara masuk|ikut paskus|jadi anggota/u', $q)) {
        return 'registration';
    }
    if (preg_match('/discord|sinkron|sync|id discord/u', $q)) {
        return 'discord-sync';
    }
    if (preg_match('/golongan|jadwal|waktu latihan|pagi|siang|sore|malam/u', $q)) {
        return 'schedule-group';
    }
    if (preg_match('/unit tempur|combat|unit khusus/u', $q)) {
        return 'unit-overview';
    }
    if (preg_match('/dinas|support|non tempur/u', $q)) {
        return 'support-overview';
    }
    if (preg_match('/event|pve|pvp|scenario|skenario/u', $q)) {
        return 'event-general';
    }
    if (preg_match('/pmc|sipil|civilian|warga/u', $q)) {
        return 'pmc-civilian';
    }
    if (preg_match('/pangkat|struktural|struktur|perwira|bintara|tamtama/u', $q)) {
        return 'structure';
    }
    if (cs_is_paskus_related($question)) {
        return 'paskus-general';
    }

    return 'out-of-scope';
}

function cs_action(string $label, string $href): array
{
    return [
        'label' => cs_clean($label, 80),
        'href' => cs_clean($href, 240),
    ];
}

function cs_actions_for_intent(string $intent): array
{
    $unitRoutes = [
        'unit:gatam' => '/unit/gatam',
        'unit:bringas' => '/unit/bringas',
        'unit:toruk' => '/unit/toruk-makto',
        'unit:toruk-makto' => '/unit/toruk-makto',
        'unit:serigala' => '/unit/sierra',
        'unit:sierra' => '/unit/sierra',
        'unit:pathfinder' => '/unit/pathfinder',
        'unit:sentinel' => '/unit/sentinel',
        'unit:komodo' => '/unit/komodo',
    ];

    if (isset($unitRoutes[$intent])) {
        return [
            cs_action('Buka Detail Unit', $unitRoutes[$intent]),
            cs_action('Lihat Unit Tempur', '/#combat'),
        ];
    }

    $supportRoutes = [
        'support:staff' => '/unit/staff-komando',
        'support:staff-komando' => '/unit/staff-komando',
        'support:dpdm' => '/unit/dpdm',
        'support:pusdiklat' => '/unit/pusdiklat',
        'support:propaganda' => '/unit/propaganda',
        'support:zeni' => '/unit/zeni-tempur',
        'support:zeni-tempur' => '/unit/zeni-tempur',
    ];

    if (isset($supportRoutes[$intent])) {
        return [
            cs_action('Buka Detail Dinas', $supportRoutes[$intent]),
            cs_action('Lihat Dinas', '/#support'),
        ];
    }

    switch ($intent) {
        case 'registration':
            return [
            cs_action('Buka Pendaftaran', '/#enlist'),
            cs_action('Sinkron Discord', '/api/discord-auth.php?action=login&return=%2F%23enlist'),
            ];
        case 'discord-sync':
            return [
            cs_action('Sinkron Discord', '/api/discord-auth.php?action=login&return=%2F%23enlist'),
            cs_action('Buka Pendaftaran', '/#enlist'),
            ];
        case 'schedule-group':
            return [cs_action('Buka Pendaftaran', '/#enlist')];
        case 'unit-overview':
            return [cs_action('Lihat Unit Tempur', '/#combat')];
        case 'support-overview':
            return [cs_action('Lihat Dinas', '/#support')];
        case 'structure':
        case 'structure-officer':
            return [cs_action('Buka Struktural', '/struktural')];
        case 'event-general':
            return [cs_action('Gabung Discord', 'https://discord.gg/aaBR9ruFva')];
        default:
            return [];
    }
}

function cs_learning_path(): string
{
    return dirname(__DIR__, 4) . '/.paskus-recruitment/cs-ai-learning.jsonl';
}

function cs_learning_question(string $question): string
{
    $text = cs_clean($question, 240);
    $text = preg_replace('/https?:\/\/\S+/iu', '[url]', $text) ?? $text;
    $text = preg_replace('/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/iu', '[email]', $text) ?? $text;
    $text = preg_replace('/\b\d{15,25}\b/u', '[id]', $text) ?? $text;
    $text = preg_replace('/\b(?:\+?\d[\d\s().-]{7,}\d)\b/u', '[nomor]', $text) ?? $text;
    return cs_clean($text, 240);
}

function cs_store_learning(string $question, string $intent, string $engine, bool $related): void
{
    if ($intent === 'security') {
        return;
    }

    $path = cs_learning_path();
    $dir = dirname($path);
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }

    $entry = [
        'time' => gmdate('c'),
        'intent' => cs_clean($intent, 80),
        'question' => cs_learning_question($question),
        'engine' => cs_clean($engine, 40),
        'related' => $related,
    ];

    @file_put_contents($path, json_encode($entry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
    @chmod($path, 0600);
}

function cs_learning_hints(string $intent): string
{
    $path = cs_learning_path();
    if (!is_readable($path)) {
        return '';
    }

    $lines = @file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (!is_array($lines)) {
        return '';
    }

    $samples = [];
    foreach (array_reverse(array_slice($lines, -120)) as $line) {
        $entry = json_decode($line, true);
        if (!is_array($entry) || ($entry['intent'] ?? '') !== $intent) {
            continue;
        }
        $sample = cs_clean($entry['question'] ?? '', 180);
        if ($sample === '' || isset($samples[$sample])) {
            continue;
        }
        $samples[$sample] = true;
        if (count($samples) >= 4) {
            break;
        }
    }

    if ($samples === []) {
        return '';
    }

    return "Pola pertanyaan non-sensitif terbaru untuk intent {$intent}:\n- " . implode("\n- ", array_keys($samples));
}

function cs_groq_api_key(array $config): string
{
    foreach ([
        $config['groq_api_key'] ?? '',
        $config['cs_ai_groq_api_key'] ?? '',
        getenv('PASKUS_GROQ_API_KEY') ?: '',
        getenv('GROQ_API_KEY') ?: '',
    ] as $candidate) {
        $key = cs_clean($candidate, 300);
        if ($key !== '') {
            return $key;
        }
    }

    return '';
}

function cs_groq_model(array $config): string
{
    $rawModel = $config['groq_model'] ?? $config['cs_ai_groq_model'] ?? (getenv('PASKUS_GROQ_MODEL') ?: '');
    $model = cs_clean($rawModel, 120);
    return $model !== '' ? $model : 'llama-3.1-8b-instant';
}

function cs_language_label(string $language): string
{
    $code = strtolower(cs_clean($language, 12));
    $labels = [
        'en' => 'English',
        'fil' => 'Filipino / Tagalog',
        'hi' => 'Hindi / India',
        'su' => 'Basa Sunda / Sundanese',
        'jv' => 'Basa Jawa / Javanese',
        'id' => 'Bahasa Indonesia',
    ];
    return $labels[$code] ?? 'Bahasa Indonesia';
}

function cs_language_instruction(string $language): string
{
    $code = strtolower(cs_clean($language, 12));
    if ($code === 'id') {
        return 'Jawab dalam Bahasa Indonesia yang singkat, jelas, profesional, dan rapi.';
    }
    if ($code === 'su') {
        return 'Jawab konsisten dalam Basa Sunda yang alami dan mudah dipahami. Jangan memakai Bahasa Indonesia kecuali untuk nama unit, istilah resmi PASKUS, role, atau kutipan pendek yang memang harus dipertahankan.';
    }
    if ($code === 'jv') {
        return 'Jawab konsisten dalam Basa Jawa yang alami dan mudah dipahami. Jangan memakai Bahasa Indonesia kecuali untuk nama unit, istilah resmi PASKUS, role, atau kutipan pendek yang memang harus dipertahankan.';
    }
    return 'Jawab dalam ' . cs_language_label($language) . ' yang singkat, jelas, profesional, dan rapi. Jika konteks website memakai Bahasa Indonesia, terjemahkan inti informasinya ke bahasa jawaban tanpa mengubah nama unit, nama jabatan, role ID, atau istilah resmi PASKUS.';
}

function cs_groq_system_prompt(string $intent, string $language = 'id'): string
{
    $answerLanguage = cs_language_label($language);
    $lines = [
        'Anda adalah PASKUS AI SERVICE untuk website PASKUS-791.',
        cs_language_instruction($language),
        'Tafsirkan maksud user dari konteks kalimat. User tidak harus memakai kata perintah yang persis.',
        'Utamakan informasi yang ada di konteks website. Jawaban harus informatif, on point, dan tidak terasa seperti template kosong.',
        'Format jawaban dengan paragraf pendek atau bullet seperlunya. Jika topiknya luas, ringkas menjadi 4-6 poin inti tanpa memotong informasi penting.',
        'Jika user bertanya tentang unit tertentu, jelaskan ringkasan, fungsi, kemampuan inti, karakter yang dicari, dan alur masuk berdasarkan konteks.',
        'Jangan mengarang data internal, jadwal internal, daftar anggota, Discord ID anggota, token, credential, atau informasi rahasia.',
        'Layanan ini didukung AI dan memakai memori intent non-sensitif sebagai referensi pola pertanyaan. Jangan menyatakan bahwa data pribadi disimpan atau percakapan dipakai untuk melatih model eksternal.',
        'Jika pertanyaan mencurigakan, meminta bypass, data internal, daftar anggota, bocoran event, atau cara naik pangkat tidak resmi, jawab persis: "Saya tidak memiliki hak menjawab sebagai CS untuk pertanyaan tersebut."',
        'Boleh jawab informasi umum: tata cara pendaftaran, penjelasan anggota secara umum, PMC dan sipil secara umum, pembagian Golongan 1 dan Golongan 2, unit tempur, dinas non-tempur, event umum, dan struktur pangkat umum.',
        'Jika pertanyaan tidak terkait PASKUS, jawab sangat singkat dan arahkan kembali ke ruang lingkup PASKUS.',
        'Intent terdeteksi: ' . $intent,
        'Bahasa jawaban aktif: ' . $answerLanguage,
        '',
        'KONTEKS WEBSITE:',
        cs_site_context(),
    ];

    $hints = cs_learning_hints($intent);
    if ($hints !== '') {
        $lines[] = '';
        $lines[] = 'MEMORI INTENT NON-SENSITIF:';
        $lines[] = $hints;
    }

    return implode("\n", $lines);
}

function cs_try_groq(string $question, array $config, string $intent, string $language = 'id'): ?string
{
    $apiKey = cs_groq_api_key($config);
    if ($apiKey === '' || !function_exists('curl_init')) {
        return null;
    }

    $payload = [
        'model' => cs_groq_model($config),
        'messages' => [
            ['role' => 'system', 'content' => cs_groq_system_prompt($intent, $language)],
            ['role' => 'user', 'content' => $question],
        ],
        'temperature' => 0.2,
        'top_p' => 0.8,
        'max_tokens' => 520,
    ];

    $ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey,
        ],
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
    ]);
    $body = (string) curl_exec($ch);
    $error = curl_error($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);

    if ($error !== '' || $status < 200 || $status >= 300 || $body === '') {
        return null;
    }

    $decoded = json_decode($body, true);
    if (!is_array($decoded)) {
        return null;
    }

    $answer = cs_clean_multiline($decoded['choices'][0]['message']['content'] ?? '', 2200);
    if ($answer === '') {
        return null;
    }

    return cs_answer_quality_ok($answer) ? $answer : null;
}

function cs_webhook_field(string $name, string $value, bool $inline = false): array
{
    return [
        'name' => cs_clean($name, 120),
        'value' => cs_clean($value, 1000) !== '' ? cs_clean($value, 1000) : '-',
        'inline' => $inline,
    ];
}

function cs_send_webhook(array $entry, array $config): bool
{
    $configWebhook = $config['cs_ai_webhook_url'] ?? '';
    $primaryEnvWebhook = $_ENV['PASKUS_CS_AI_WEBHOOK_URL'] ?? '';
    if ($primaryEnvWebhook === '') {
        $primaryEnvWebhook = getenv('PASKUS_CS_AI_WEBHOOK_URL') ?: '';
    }
    $legacyEnvWebhook = $_ENV['CS_AI_WEBHOOK_URL'] ?? '';
    if ($legacyEnvWebhook === '') {
        $legacyEnvWebhook = getenv('CS_AI_WEBHOOK_URL') ?: '';
    }
    $webhook = cs_clean($configWebhook ?: $primaryEnvWebhook ?: $legacyEnvWebhook ?: CS_AI_WEBHOOK_URL, 300);
    if ($webhook === '' || !preg_match('~^https://discord(?:app)?\.com/api/webhooks/\d+/~i', $webhook) || !function_exists('curl_init')) {
        return false;
    }

    $riskColor = $entry['risk'] === 'RED' ? 15158332 : 16763904;
    $payload = [
        'username' => 'PASKUS AI SERVICE',
        'avatar_url' => CS_AI_LOGO_URL,
        'allowed_mentions' => ['parse' => []],
        'embeds' => [[
            'title' => 'PASKUS AI SERVICE Security Signal',
            'description' => 'Pertanyaan berpotensi sensitif terdeteksi dari widget PASKUS AI SERVICE website.',
            'color' => $riskColor,
            'thumbnail' => ['url' => CS_AI_LOGO_URL],
            'fields' => [
                cs_webhook_field('Status', $entry['risk'], true),
                cs_webhook_field('Alasan', $entry['reason'], true),
                cs_webhook_field('IP', '`' . $entry['ip'] . '`', true),
                cs_webhook_field('Discord', $entry['discord_display'] ?: '-', true),
                cs_webhook_field('Discord ID', $entry['discord_id'] !== '' ? '`' . $entry['discord_id'] . '`' : '-', true),
                cs_webhook_field('Mention', $entry['discord_id'] !== '' ? '<@' . $entry['discord_id'] . '>' : '-', true),
                cs_webhook_field('Pertanyaan', $entry['question']),
                cs_webhook_field('Halaman', $entry['page']),
                cs_webhook_field('User Agent', $entry['user_agent']),
                cs_webhook_field('Jump', '[Buka Pendaftaran](https://paskus.so791.com/#enlist)', true),
            ],
            'footer' => ['text' => 'PASKUS AI SERVICE Intel'],
            'timestamp' => gmdate('c'),
        ]],
    ];

    $ch = curl_init($webhook);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 8,
    ]);
    curl_exec($ch);
    $error = curl_error($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);

    return $error === '' && $status >= 200 && $status < 300;
}

function cs_log_sensitive(array $entry): void
{
    $path = cs_private_dir() . '/cs-ai-sensitive.log';
    $dir = dirname($path);
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    @file_put_contents($path, json_encode($entry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
    @chmod($path, 0600);
}

$config = cs_config();
$discord = cs_discord_user();
cs_chat_prune();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $state = cs_chat_load($config, $discord);
    cs_response(200, [
        'ok' => true,
        'history' => $state['messages'] ?? [],
        'ttl' => CS_AI_CHAT_TTL,
    ]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    cs_response(405, [
        'ok' => false,
        'message' => 'Metode tidak diizinkan.',
    ]);
}

$rawBody = file_get_contents('php://input') ?: '';
if (strlen($rawBody) > 8192) {
    cs_response(413, [
        'ok' => false,
        'message' => 'Pertanyaan terlalu panjang.',
    ]);
}

$body = json_decode($rawBody, true);
if (!is_array($body)) {
    cs_response(400, [
        'ok' => false,
        'message' => 'Payload JSON tidak valid.',
    ]);
}

$action = cs_clean($body['action'] ?? '', 60);
if ($action === 'clear-history') {
    cs_chat_clear($config, $discord);
    cs_response(200, [
        'ok' => true,
        'history' => [],
    ]);
}

$question = cs_clean($body['question'] ?? '', 700);
if ($question === '' || strlen($question) < 2) {
    cs_response(422, [
        'ok' => false,
        'message' => 'Pertanyaan masih kosong.',
    ]);
}
$language = strtolower(cs_clean($body['language'] ?? 'id', 12));
if (!in_array($language, ['id', 'fil', 'en', 'hi', 'su', 'jv'], true)) {
    $language = 'id';
}

$check = cs_sensitive_check($question);
$structureAnswer = !$check['sensitive'] ? cs_structure_officer_answer($question, $config) : null;
$intent = $structureAnswer !== null ? 'structure-officer' : cs_detect_intent($question, $check);
$groqAnswer = ($structureAnswer === null && !$check['sensitive'] && cs_is_paskus_related($question)) ? cs_try_groq($question, $config, $intent, $language) : null;
$answer = $structureAnswer ?: ($groqAnswer ?: cs_localized_knowledge_answer($question, $check, $language));
$engine = $structureAnswer !== null ? 'structure-live' : ($groqAnswer ? 'groq' : 'website-knowledge');
$actions = cs_actions_for_intent($intent);
$history = cs_chat_append($config, $discord, [
    cs_chat_message('user', $question),
    cs_chat_message('bot', $answer, $check['sensitive'], $actions),
]);

$entry = [
    'time' => gmdate('c'),
    'risk' => $check['risk'],
    'reason' => $check['reason'],
    'question' => $question,
    'answer' => $answer,
    'history_count' => count($history),
    'ip' => cs_client_ip(),
    'discord_id' => cs_clean($discord['id'] ?? '', 32),
    'discord_display' => cs_clean($discord['display'] ?? '', 120),
    'posted_discord_id' => cs_clean($body['discord_user_id'] ?? '', 32),
    'page' => cs_clean($body['page'] ?? ($_SERVER['HTTP_REFERER'] ?? 'https://paskus.so791.com/'), 300),
    'user_agent' => cs_clean($_SERVER['HTTP_USER_AGENT'] ?? '-', 300),
];

$reported = false;
if ($check['sensitive']) {
    cs_log_sensitive($entry);
    $reported = cs_send_webhook($entry, $config);
} else {
    cs_store_learning($question, $intent, $engine, $intent === 'structure-officer' || cs_is_paskus_related($question));
}

cs_response(200, [
    'ok' => true,
    'answer' => $answer,
    'actions' => $actions,
    'history' => $history,
    'history_ttl' => CS_AI_CHAT_TTL,
    'intent' => $intent,
    'sensitive' => $check['sensitive'],
    'risk' => $check['risk'],
    'reported' => $reported,
    'engine' => $engine,
    'language' => $language,
]);
