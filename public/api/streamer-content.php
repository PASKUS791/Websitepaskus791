<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow, noarchive');

function streamer_json(int $status, array $payload): void
{
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function streamer_clean(mixed $value, int $maxLength = 240): string
{
    $text = trim((string) $value);
    $text = preg_replace('/[\x00-\x1F\x7F]/u', ' ', $text) ?? '';
    $text = preg_replace('/\s+/u', ' ', $text) ?? '';
    if (function_exists('mb_substr')) {
        return mb_substr($text, 0, $maxLength);
    }
    return substr($text, 0, $maxLength);
}

function streamer_slug(mixed $value): string
{
    $slug = strtolower(streamer_clean($value, 80));
    $slug = preg_replace('/[^a-z0-9-]+/', '-', $slug) ?? '';
    $slug = trim($slug, '-');
    return substr($slug, 0, 40);
}

function streamer_config_path(): string
{
    return dirname(__DIR__, 4) . '/.paskus-recruitment/config.php';
}

function streamer_load_config(): array
{
    $path = streamer_config_path();
    if (!is_readable($path)) {
        return [];
    }
    $config = require $path;
    return is_array($config) ? $config : [];
}

function streamer_data_path(array $config): string
{
    $configured = streamer_clean($config['streamer_content_path'] ?? '', 512);
    if ($configured !== '') {
        return $configured;
    }
    return dirname(__DIR__, 4) . '/.paskus-recruitment/streamer-content.json';
}

function streamer_admin_secret(array $config): string
{
    $secret = streamer_clean($config['streamer_admin_secret'] ?? '', 512);
    if ($secret !== '') {
        return $secret;
    }
    return streamer_clean($_ENV['PASKUS_STREAMER_ADMIN_SECRET'] ?? getenv('PASKUS_STREAMER_ADMIN_SECRET') ?: '', 512);
}

function streamer_header(string $name): string
{
    $key = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
    return streamer_clean($_SERVER[$key] ?? '', 512);
}

function streamer_require_admin(array $config): void
{
    $expected = streamer_admin_secret($config);
    if ($expected === '') {
        streamer_json(503, [
            'ok' => false,
            'error' => 'streamer_admin_secret belum dikonfigurasi.',
        ]);
    }

    $provided = streamer_header('X-PASKUS-STREAMER-SECRET');
    if ($provided === '' || !hash_equals($expected, $provided)) {
        streamer_json(401, [
            'ok' => false,
            'error' => 'Token admin streamer tidak valid.',
        ]);
    }
}

function streamer_url(mixed $value, int $maxLength = 500): string
{
    $url = streamer_clean($value, $maxLength);
    if ($url === '') {
        return '';
    }
    if (str_starts_with($url, '/')) {
        return preg_match('/^\/[A-Za-z0-9._~!$&\'()*+,;=:@\/%-]*(?:\?[A-Za-z0-9._~!$&\'()*+,;=:@\/?%-]*)?$/', $url) ? $url : '';
    }
    $parts = parse_url($url);
    $scheme = strtolower((string) ($parts['scheme'] ?? ''));
    return in_array($scheme, ['http', 'https'], true) ? $url : '';
}

function streamer_tags(mixed $value): array
{
    if (is_string($value)) {
        $value = preg_split('/[,;\n]+/', $value) ?: [];
    }
    if (!is_array($value)) {
        return [];
    }
    return array_values(array_filter(array_map(
        static fn ($item): string => streamer_clean($item, 32),
        $value,
    )));
}

function streamer_int(mixed $value, int $default = 0, int $min = 0, int $max = 999): int
{
    if (!is_numeric($value)) {
        return $default;
    }
    return max($min, min($max, (int) $value));
}

function streamer_public_dir(): string
{
    return dirname(__DIR__);
}

function streamer_local_asset_path(string $url): string
{
    $path = parse_url($url, PHP_URL_PATH);
    if (!is_string($path) || $path === '' || !str_starts_with($path, '/')) {
        return '';
    }
    $realBase = realpath(streamer_public_dir());
    if ($realBase === false) {
        return '';
    }
    $candidate = realpath($realBase . '/' . ltrim($path, '/'));
    if ($candidate === false || !str_starts_with($candidate, $realBase . DIRECTORY_SEPARATOR)) {
        return '';
    }
    return $candidate;
}

function streamer_url_status(string $url): array
{
    $url = streamer_url($url);
    if ($url === '') {
        return ['ok' => false, 'status' => 0, 'label' => 'empty', 'url' => ''];
    }

    if (str_starts_with($url, '/')) {
        $path = streamer_local_asset_path($url);
        if ($path !== '' && is_file($path)) {
            return [
                'ok' => true,
                'status' => 200,
                'label' => 'available',
                'url' => $url,
                'size' => filesize($path) ?: 0,
                'mime' => function_exists('mime_content_type') ? (mime_content_type($path) ?: '') : '',
            ];
        }
        return ['ok' => false, 'status' => 404, 'label' => 'missing', 'url' => $url];
    }

    $status = 0;
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        if ($ch !== false) {
            curl_setopt_array($ch, [
                CURLOPT_NOBODY => true,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_CONNECTTIMEOUT => 4,
                CURLOPT_TIMEOUT => 6,
                CURLOPT_USERAGENT => 'PASKUS-Streamer-Admin/1.0',
            ]);
            curl_exec($ch);
            $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
            curl_close($ch);
        }
    }

    return [
        'ok' => $status >= 200 && $status < 400,
        'status' => $status,
        'label' => $status >= 200 && $status < 400 ? 'available' : ($status > 0 ? 'http_' . $status : 'unreachable'),
        'url' => $url,
    ];
}

function streamer_subdomain_status(string $slug): array
{
    $slug = streamer_slug($slug);
    if ($slug === '') {
        return ['ok' => false, 'status' => 'invalid_slug', 'subdomain' => '', 'url' => ''];
    }
    $host = $slug . '.so791.com';
    $status = streamer_url_status('https://' . $host . '/');
    return [
        'ok' => (bool) $status['ok'],
        'status' => $status['ok'] ? 'active' : 'pending_dns_route',
        'httpStatus' => $status['status'],
        'subdomain' => $host,
        'url' => 'https://' . $host,
        'workerRoute' => $host . '/*',
        'instruction' => 'Jika status pending, tambahkan route Cloudflare Worker ' . $host . '/* ke worker streamer dan pastikan /api/streamer-content.php diproxy ke origin utama.',
    ];
}

function streamer_default_data(): array
{
    return [
        'schema' => 1,
        'revision' => 'seed-20260606',
        'updatedAt' => gmdate('c'),
        'hub' => [
            'metaTitle' => 'Streamer Hub PASKUS Gi1 | Karya So-791',
            'heroKicker' => 'Highlight Play',
            'heroTitle' => 'PASKUS GI1',
            'heroSubtitle' => 'Streamer Hub / Karya So-791',
            'live' => [
                'badge' => 'Featured Play',
                'title' => 'Official Highlight',
                'video' => '/assets/paskus-streamer-highlight-download3-v1.mp4',
                'poster' => '/assets/paskus-streamer-highlight-download3-poster-v1.jpg',
            ],
            'socialKicker' => 'Official Social Media',
            'socialTitle' => 'Akun Resmi PASKUS Gi1',
            'discordSocial' => [
                'name' => 'Discord PASKUS',
                'handle' => 'PASKUS Gi1 / So-791',
                'status' => 'Community Hub',
                'href' => 'https://discord.gg/aaBR9ruFva',
            ],
            'officialSocials' => [
                [
                    'type' => 'tiktok',
                    'name' => 'TikTok PASKUS',
                    'handle' => '@paskus791',
                    'status' => 'Official Short Video',
                    'href' => 'https://www.tiktok.com/@paskus791',
                ],
                [
                    'type' => 'roblox',
                    'name' => 'Roblox Community',
                    'handle' => 'PASUKAN KHUSUS 791',
                    'status' => 'Official Roblox Group',
                    'href' => 'https://www.roblox.com/communities/767288802/PASUKAN-KHUSUS-791',
                ],
            ],
            'events' => [
                ['day' => '06', 'month' => 'JUN', 'title' => 'Highlight Drop', 'body' => 'Publish short video official.'],
                ['day' => '08', 'month' => 'JUN', 'title' => 'Training Clip', 'body' => 'Dokumentasi briefing dan orientasi.'],
                ['day' => '12', 'month' => 'JUN', 'title' => 'Operation Recap', 'body' => 'Event recap untuk arsip website.'],
            ],
            'galleryKicker' => 'Event Documentation',
            'galleryTitle' => 'Featured Operations Gallery',
            'galleryIntro' => 'Showcase horizontal untuk footage operasi, highlight event, POV unit, dan dokumentasi visual PASKUS Gi1.',
            'galleryMoreLabel' => 'See More',
            'archiveKicker' => 'Event Documentation',
            'archiveTitle' => 'Dokumentasi Event PASKUS',
            'creators' => [
                [
                    'slug' => 'gi1',
                    'name' => 'Gi1',
                    'role' => 'High Command / Proplayer',
                    'badge' => 'Counter-Strike Legend',
                    'nickname' => 'The Tactical Architect',
                    'focus' => 'Proplayer veteran yang membangun ritme komando PASKUS dari disiplin, aim legacy, dan keputusan cepat di bawah tekanan.',
                    'bio' => 'Gi1 dikenal sebagai legenda Counter-Strike yang membawa naluri kompetitif ke medan BRM5. Di PASKUS, ia bukan sekadar creator; ia adalah salah satu pemimpin tinggi yang mengubah pengalaman tempur menjadi standar komando, visual, dan budaya disiplin.',
                    'schedule' => 'Official / High Command / Event',
                    'tags' => ['Proplayer', 'High Command', 'CS Legacy'],
                    'href' => 'https://gi1.so791.com',
                    'avatar' => '/assets/gi1-profile-v2.jpg',
                    'background' => '/assets/gi1-background-v2.jpg',
                    'cover' => '/assets/gi1-background-v2.jpg',
                    'links' => [
                        ['type' => 'tiktok', 'label' => 'TikTok', 'url' => 'https://www.tiktok.com/@gi1_gaming?_r=1&_t=ZS-96xVVdUmuIL'],
                        ['type' => 'youtube', 'label' => 'YouTube', 'url' => 'https://youtube.com/@gi1_gr?si=bBRRFye5kfc5KHRI'],
                        ['type' => 'discord', 'label' => 'Discord', 'url' => 'https://discord.gg/aaBR9ruFva'],
                    ],
                ],
                [
                    'slug' => '4hn',
                    'name' => '4hn',
                    'role' => 'PvP MVP / Rule Master',
                    'badge' => 'MVP PvP & Rule Master',
                    'nickname' => 'The Rulebound Duelist',
                    'focus' => 'Spesialis PvP yang membaca duel cepat, menjaga ruleplay tetap bersih, dan mengubah momen lapangan menjadi konten yang tajam.',
                    'bio' => '4hn adalah wajah creator yang kuat di dua sisi: agresif saat PvP, presisi saat membaca aturan. Julukan MVP PvP dan Rule Master melekat karena ia menjaga tempo permainan tetap kompetitif, rapi, dan layak dijadikan referensi anggota.',
                    'schedule' => 'Event / PvP POV / Ruleplay',
                    'tags' => ['PvP MVP', 'Rule Master', 'Combat POV'],
                    'href' => 'https://4hn.so791.com',
                    'avatar' => '/assets/4hn-profile-v2.jpg',
                    'background' => '/assets/4hn-background-v2.jpg',
                    'cover' => '/assets/4hn-background-v2.jpg',
                    'links' => [
                        ['type' => 'tiktok', 'label' => 'TikTok', 'url' => 'https://www.tiktok.com/@soldier_791'],
                        ['type' => 'youtube', 'label' => 'YouTube', 'url' => 'https://www.youtube.com/@MrFarhanIsHere26'],
                        ['type' => 'discord', 'label' => 'Discord', 'url' => 'https://discord.gg/aaBR9ruFva'],
                    ],
                ],
                [
                    'slug' => 'aang',
                    'name' => 'Aang',
                    'role' => 'Special Ops / Combat Creator',
                    'badge' => 'Special Ops',
                    'nickname' => 'The Silent Operator',
                    'focus' => 'Special Ops yang bergerak senyap, membaca ruang dengan dingin, dan mengemas momen operasi PASKUS menjadi highlight yang tajam.',
                    'bio' => 'Aang adalah salah satu Special Ops PASKUS dengan karakter tenang dan presisi. Ia membawa aura low-profile ke medan permainan: masuk tanpa banyak suara, menjaga ritme squad tetap terkunci, lalu meninggalkan footage yang terasa cinematic dan berkelas.',
                    'schedule' => 'Special Ops / Tactical POV / Event',
                    'tags' => ['Special Ops', 'Tactical POV', 'Silent Play'],
                    'href' => 'https://aang.so791.com',
                    'avatar' => '/assets/aang-profile-v3.jpg',
                    'background' => '/assets/aang-background-v2.jpg',
                    'cover' => '/assets/aang-background-v2.jpg',
                    'links' => [
                        ['type' => 'tiktok', 'label' => 'TikTok', 'url' => 'https://www.tiktok.com/@.namakuaang?_r=1&_t=ZS-970xG9tEyRs'],
                        ['type' => 'discord', 'label' => 'Discord', 'url' => 'https://discord.gg/aaBR9ruFva'],
                    ],
                ],
            ],
            'contentCards' => [
                [
                    'type' => 'Featured Video',
                    'title' => 'PASKUS Gi1 Highlight Play',
                    'uploader' => 'PASKUS Official',
                    'unit' => 'Official',
                    'status' => 'Ready Watch',
                    'video' => '/assets/paskus-landing-download3-6-45-v1.webm',
                    'fallback' => '/assets/paskus-streamer-highlight-download3-v1.mp4',
                    'poster' => '/assets/paskus-landing-loop-poster-v2.jpg',
                ],
                [
                    'type' => 'Event Recap',
                    'title' => 'GATAM Operation Frame',
                    'uploader' => 'Media Archive',
                    'unit' => 'GATAM',
                    'status' => 'Photo Documentation',
                    'poster' => '/assets/gatam-card-bg-card.webp',
                ],
                [
                    'type' => 'Combat POV',
                    'title' => 'SIERRA Tactical Cell',
                    'uploader' => 'Combat Media',
                    'unit' => 'SIERRA',
                    'status' => 'Field Documentation',
                    'poster' => '/assets/sierra-card-bg-card-v1.webp',
                ],
                [
                    'type' => 'Air Insert',
                    'title' => 'TORUK Makto Air Wing',
                    'uploader' => 'Aviation Desk',
                    'unit' => 'TORUK MAKTO',
                    'status' => 'Operation Still',
                    'poster' => '/assets/toruk-card-bg-card.webp',
                ],
                [
                    'type' => 'Recon Shot',
                    'title' => 'Pathfinder Recon Route',
                    'uploader' => 'Recon Desk',
                    'unit' => 'PATHFINDER',
                    'status' => 'Photo Documentation',
                    'poster' => '/assets/pathfinder-card-bg-card.webp',
                ],
                [
                    'type' => 'Medic Recap',
                    'title' => 'Sentinel Field Support',
                    'uploader' => 'Medical Desk',
                    'unit' => 'SENTINEL',
                    'status' => 'Event Support',
                    'poster' => '/assets/sentinel-card-bg-card.webp',
                ],
            ],
        ],
        'profiles' => [
            [
                'slug' => 'gi1',
                'callSign' => 'Gi1',
                'displayName' => 'Gi1 Gaming',
                'role' => 'High Command / Proplayer',
                'handle' => '@gi1_gaming',
                'tagline' => 'The Tactical Architect. Legenda Counter-Strike dan pemimpin tinggi PASKUS yang membawa disiplin proplayer ke komando BRM5.',
                'theme' => '#d4af37',
                'avatar' => '/recruitment-webhook-logo.png',
                'media' => [
                    'avatar' => '/assets/gi1-profile-v2.jpg',
                    'pageBackground' => '/assets/gi1-background-v2.jpg',
                    'pageBackgroundPosition' => 'calc(50% - 400px) top',
                    'profileBackground' => '/assets/gi1-background-v2.jpg',
                    'highlightPoster' => '/assets/gi1-highlight-poster-v3.jpg',
                    'highlightWebm' => '/assets/gi1-highlight-v3.webm',
                    'highlightMp4' => '/assets/gi1-highlight-v3.mp4',
                    'avatarPhoto' => true,
                    'preferMp4' => true,
                ],
                'subdomain' => 'gi1.so791.com',
                'highlight' => [
                    'video' => '/assets/paskus-streamer-highlight-v1.webm',
                    'fallback' => '/assets/paskus-streamer-highlight-v1.mp4',
                    'poster' => '/assets/paskus-streamer-highlight-poster-v1.jpg',
                ],
                'links' => [
                    ['type' => 'tiktok', 'label' => 'TikTok', 'handle' => '@gi1_gaming', 'url' => 'https://www.tiktok.com/@gi1_gaming?_r=1&_t=ZS-96xVVdUmuIL'],
                    ['type' => 'youtube', 'label' => 'YouTube', 'handle' => 'Gi1 Gaming', 'url' => 'https://youtube.com/@gi1_gr?si=bBRRFye5kfc5KHRI'],
                    ['type' => 'discord', 'label' => 'Discord PASKUS', 'handle' => 'Community Hub', 'url' => 'https://discord.gg/aaBR9ruFva'],
                    ['type' => 'community', 'label' => 'Streamer Hub', 'handle' => 'PASKUS karya dan event', 'url' => 'https://paskus.so791.com/streamer'],
                ],
            ],
            [
                'slug' => '4hn',
                'callSign' => '4hn',
                'displayName' => '4hn',
                'role' => 'PvP MVP / Rule Master',
                'handle' => '@soldier_791',
                'tagline' => 'The Rulebound Duelist. MVP PvP dengan pembacaan aturan tajam, menjaga konten PASKUS tetap kompetitif dan tertata.',
                'theme' => '#8fbf64',
                'avatar' => '/recruitment-webhook-logo.png',
                'media' => [
                    'avatar' => '/assets/4hn-profile-v2.jpg',
                    'pageBackground' => '/assets/4hn-background-v2.jpg',
                    'profileBackground' => '/assets/4hn-background-v2.jpg',
                    'highlightPoster' => '/assets/4hn-highlight-poster-v1.jpg',
                    'highlightMp4' => '/assets/4hn-highlight-v1.mp4',
                    'avatarPhoto' => true,
                    'preferMp4' => true,
                ],
                'subdomain' => '4hn.so791.com',
                'highlight' => [
                    'video' => '/assets/paskus-streamer-highlight-v1.webm',
                    'fallback' => '/assets/paskus-streamer-highlight-v1.mp4',
                    'poster' => '/assets/paskus-streamer-highlight-poster-v1.jpg',
                ],
                'links' => [
                    ['type' => 'tiktok', 'label' => 'TikTok', 'handle' => '@soldier_791', 'url' => 'https://www.tiktok.com/@soldier_791'],
                    ['type' => 'youtube', 'label' => 'YouTube', 'handle' => 'MrFarhanIsHere26', 'url' => 'https://www.youtube.com/@MrFarhanIsHere26'],
                    ['type' => 'discord', 'label' => 'Discord PASKUS', 'handle' => 'Community Hub', 'url' => 'https://discord.gg/aaBR9ruFva'],
                    ['type' => 'community', 'label' => 'Streamer Hub', 'handle' => 'PASKUS karya dan event', 'url' => 'https://paskus.so791.com/streamer'],
                ],
            ],
            [
                'slug' => 'aang',
                'callSign' => 'Aang',
                'displayName' => 'Aang',
                'role' => 'Special Ops / Combat Creator',
                'handle' => '@.namakuaang',
                'tagline' => 'The Silent Operator. Special Ops PASKUS yang bergerak senyap, membaca ruang dengan dingin, dan mengubah momen operasi menjadi highlight yang bersih, tajam, dan berkelas.',
                'theme' => '#b9c7d6',
                'avatar' => '/assets/aang-profile-v3.jpg',
                'media' => [
                    'avatar' => '/assets/aang-profile-v3.jpg',
                    'pageBackground' => '/assets/aang-background-v2.jpg',
                    'pageBackgroundPosition' => 'center 22%',
                    'profileBackground' => '/assets/aang-background-v2.jpg',
                    'highlightPoster' => '/assets/aang-highlight-poster-v2.jpg',
                    'highlightWebm' => '/assets/aang-highlight-v2.webm',
                    'highlightMp4' => '/assets/aang-highlight-v2.mp4',
                    'avatarPhoto' => true,
                    'preferMp4' => true,
                ],
                'subdomain' => 'aang.so791.com',
                'highlight' => [
                    'video' => '/assets/aang-highlight-v2.webm',
                    'fallback' => '/assets/aang-highlight-v2.mp4',
                    'poster' => '/assets/aang-highlight-poster-v2.jpg',
                ],
                'links' => [
                    ['type' => 'tiktok', 'label' => 'TikTok', 'handle' => '@.namakuaang', 'url' => 'https://www.tiktok.com/@.namakuaang?_r=1&_t=ZS-970xG9tEyRs'],
                    ['type' => 'discord', 'label' => 'Discord PASKUS', 'handle' => 'Special Ops Channel', 'url' => 'https://discord.gg/aaBR9ruFva'],
                    ['type' => 'community', 'label' => 'Streamer Hub', 'handle' => 'PASKUS karya dan event', 'url' => 'https://paskus.so791.com/streamer'],
                ],
            ],
        ],
    ];
}

function streamer_normalize_socials(mixed $rows): array
{
    if (!is_array($rows)) {
        return [];
    }
    $items = [];
    foreach ($rows as $row) {
        if (!is_array($row)) {
            continue;
        }
        $url = streamer_url($row['href'] ?? $row['url'] ?? '');
        if ($url === '') {
            continue;
        }
        $items[] = [
            'type' => streamer_clean($row['type'] ?? 'link', 32),
            'icon' => streamer_clean($row['icon'] ?? $row['type'] ?? 'link', 32),
            'name' => streamer_clean($row['name'] ?? $row['label'] ?? 'Link', 80),
            'label' => streamer_clean($row['label'] ?? $row['name'] ?? 'Link', 80),
            'handle' => streamer_clean($row['handle'] ?? '', 100),
            'status' => streamer_clean($row['status'] ?? '', 100),
            'href' => $url,
            'url' => $url,
            'order' => streamer_int($row['order'] ?? 0, 0),
            'active' => array_key_exists('active', $row) ? streamer_bool($row['active']) : true,
        ];
    }
    usort($items, static fn (array $a, array $b): int => ($a['order'] <=> $b['order']) ?: strcmp($a['label'], $b['label']));
    return $items;
}

function streamer_normalize_events(mixed $rows): array
{
    if (!is_array($rows)) {
        return [];
    }
    $items = [];
    foreach ($rows as $row) {
        if (!is_array($row)) {
            continue;
        }
        $title = streamer_clean($row['title'] ?? '', 100);
        if ($title === '') {
            continue;
        }
        $items[] = [
            'day' => streamer_clean($row['day'] ?? '', 4),
            'month' => streamer_clean($row['month'] ?? '', 12),
            'title' => $title,
            'body' => streamer_clean($row['body'] ?? '', 240),
        ];
    }
    return $items;
}

function streamer_normalize_creators(mixed $rows): array
{
    if (!is_array($rows)) {
        return [];
    }
    $items = [];
    foreach ($rows as $row) {
        if (!is_array($row)) {
            continue;
        }
        $name = streamer_clean($row['name'] ?? $row['callSign'] ?? '', 80);
        if ($name === '') {
            continue;
        }
        $slug = streamer_slug($row['slug'] ?? $name);
        $items[] = [
            'slug' => $slug,
            'name' => $name,
            'role' => streamer_clean($row['role'] ?? 'Creator', 80),
            'active' => array_key_exists('active', $row) ? streamer_bool($row['active']) : true,
            'badge' => streamer_clean($row['badge'] ?? $row['role'] ?? 'Creator', 100),
            'nickname' => streamer_clean($row['nickname'] ?? $row['alias'] ?? '', 120),
            'alias' => streamer_clean($row['alias'] ?? $row['nickname'] ?? '', 120),
            'focus' => streamer_clean($row['focus'] ?? $row['tagline'] ?? '', 320),
            'bio' => streamer_clean($row['bio'] ?? $row['description'] ?? $row['focus'] ?? $row['tagline'] ?? '', 520),
            'schedule' => streamer_clean($row['schedule'] ?? '', 120),
            'tags' => streamer_tags($row['tags'] ?? []),
            'href' => streamer_url($row['href'] ?? ''),
            'avatar' => streamer_url($row['avatar'] ?? ''),
            'background' => streamer_url($row['background'] ?? $row['cover'] ?? ''),
            'cover' => streamer_url($row['cover'] ?? $row['background'] ?? ''),
            'links' => streamer_normalize_socials($row['links'] ?? []),
        ];
    }
    return $items;
}

function streamer_normalize_content(mixed $rows): array
{
    if (!is_array($rows)) {
        return [];
    }
    $items = [];
    foreach ($rows as $row) {
        if (!is_array($row)) {
            continue;
        }
        $title = streamer_clean($row['title'] ?? '', 120);
        if ($title === '') {
            continue;
        }
        $items[] = [
            'type' => streamer_clean($row['type'] ?? 'Video', 60),
            'title' => $title,
            'uploader' => streamer_clean($row['uploader'] ?? 'PASKUS Official', 80),
            'unit' => streamer_clean($row['unit'] ?? '', 80),
            'status' => streamer_clean($row['status'] ?? '', 80),
            'video' => streamer_url($row['video'] ?? ''),
            'fallback' => streamer_url($row['fallback'] ?? ''),
            'poster' => streamer_url($row['poster'] ?? ''),
            'href' => streamer_url($row['href'] ?? ''),
        ];
    }
    return $items;
}

function streamer_bool(mixed $value): bool
{
    if (is_bool($value)) {
        return $value;
    }
    if (is_numeric($value)) {
        return (int) $value === 1;
    }
    $text = strtolower(streamer_clean($value, 16));
    return in_array($text, ['1', 'true', 'yes', 'on'], true);
}

function streamer_normalize_media(mixed $row): array
{
    if (!is_array($row)) {
        return [];
    }

    $media = [];
    $urlFields = [
        'avatar',
        'background',
        'pageBackground',
        'bannerBackground',
        'profileBackground',
        'highlightPoster',
        'highlightVideo',
        'highlightWebm',
        'highlightMp4',
        'highlightFallback',
    ];

    foreach ($urlFields as $field) {
        $url = streamer_url($row[$field] ?? '');
        if ($url !== '') {
            $media[$field] = $url;
        }
    }

    $position = streamer_clean($row['pageBackgroundPosition'] ?? '', 80);
    if ($position !== '') {
        $media['pageBackgroundPosition'] = $position;
    }
    foreach (['pageBackgroundPositionDesktop', 'pageBackgroundPositionMobile'] as $field) {
        $position = streamer_clean($row[$field] ?? '', 80);
        if ($position !== '') {
            $media[$field] = $position;
        }
    }

    foreach (['avatarPhoto', 'preferMp4'] as $field) {
        if (array_key_exists($field, $row)) {
            $media[$field] = streamer_bool($row[$field]);
        }
    }

    return $media;
}

function streamer_normalize_profiles(mixed $rows): array
{
    if (!is_array($rows)) {
        return [];
    }
    $items = [];
    foreach ($rows as $row) {
        if (!is_array($row)) {
            continue;
        }
        $slug = streamer_slug($row['slug'] ?? $row['callSign'] ?? '');
        if ($slug === '') {
            continue;
        }
        $links = streamer_normalize_socials($row['links'] ?? []);
        $highlight = is_array($row['highlight'] ?? null) ? $row['highlight'] : [];
        $media = streamer_normalize_media($row['media'] ?? []);
        $subdomain = streamer_clean($row['subdomain'] ?? ($slug . '.so791.com'), 120);
        $items[] = [
            'slug' => $slug,
            'callSign' => streamer_clean($row['callSign'] ?? $slug, 60),
            'displayName' => streamer_clean($row['displayName'] ?? $row['name'] ?? $slug, 100),
            'role' => streamer_clean($row['role'] ?? 'Streamer PASKUS791', 100),
            'handle' => streamer_clean($row['handle'] ?? '', 100),
            'tagline' => streamer_clean($row['tagline'] ?? '', 260),
            'theme' => preg_match('/^#[0-9a-f]{6}$/i', (string) ($row['theme'] ?? '')) ? (string) $row['theme'] : '#d4af37',
            'active' => array_key_exists('active', $row) ? streamer_bool($row['active']) : true,
            'avatar' => streamer_url($row['avatar'] ?? ''),
            'media' => $media,
            'subdomain' => $subdomain,
            'highlight' => [
                'video' => streamer_url($highlight['video'] ?? ''),
                'fallback' => streamer_url($highlight['fallback'] ?? ''),
                'poster' => streamer_url($highlight['poster'] ?? ''),
            ],
            'links' => $links,
        ];
    }
    return $items;
}

function streamer_normalize_data(array $input): array
{
    $fallback = streamer_default_data();
    $hub = is_array($input['hub'] ?? null) ? $input['hub'] : [];
    $live = is_array($hub['live'] ?? null) ? $hub['live'] : [];
    $discord = is_array($hub['discordSocial'] ?? null) ? $hub['discordSocial'] : [];

    $data = [
        'schema' => 1,
        'revision' => streamer_clean($input['revision'] ?? $fallback['revision'], 80),
        'updatedAt' => streamer_clean($input['updatedAt'] ?? $fallback['updatedAt'], 40),
        'hub' => [
            'metaTitle' => streamer_clean($hub['metaTitle'] ?? $fallback['hub']['metaTitle'], 140),
            'heroKicker' => streamer_clean($hub['heroKicker'] ?? $fallback['hub']['heroKicker'], 80),
            'heroTitle' => streamer_clean($hub['heroTitle'] ?? $fallback['hub']['heroTitle'], 80),
            'heroSubtitle' => streamer_clean($hub['heroSubtitle'] ?? $fallback['hub']['heroSubtitle'], 100),
            'live' => [
                'badge' => streamer_clean($live['badge'] ?? $fallback['hub']['live']['badge'], 80),
                'title' => streamer_clean($live['title'] ?? $fallback['hub']['live']['title'], 120),
                'video' => streamer_url($live['video'] ?? $fallback['hub']['live']['video']),
                'poster' => streamer_url($live['poster'] ?? $fallback['hub']['live']['poster']),
            ],
            'socialKicker' => streamer_clean($hub['socialKicker'] ?? $fallback['hub']['socialKicker'], 80),
            'socialTitle' => streamer_clean($hub['socialTitle'] ?? $fallback['hub']['socialTitle'], 100),
            'discordSocial' => [
                'name' => streamer_clean($discord['name'] ?? $fallback['hub']['discordSocial']['name'], 80),
                'handle' => streamer_clean($discord['handle'] ?? $fallback['hub']['discordSocial']['handle'], 100),
                'status' => streamer_clean($discord['status'] ?? $fallback['hub']['discordSocial']['status'], 100),
                'href' => streamer_url($discord['href'] ?? $fallback['hub']['discordSocial']['href']),
            ],
            'officialSocials' => streamer_normalize_socials($hub['officialSocials'] ?? $fallback['hub']['officialSocials']),
            'events' => streamer_normalize_events($hub['events'] ?? $fallback['hub']['events']),
            'galleryKicker' => streamer_clean($hub['galleryKicker'] ?? $fallback['hub']['galleryKicker'], 80),
            'galleryTitle' => streamer_clean($hub['galleryTitle'] ?? $fallback['hub']['galleryTitle'], 120),
            'galleryIntro' => streamer_clean($hub['galleryIntro'] ?? $fallback['hub']['galleryIntro'], 260),
            'galleryMoreLabel' => streamer_clean($hub['galleryMoreLabel'] ?? $fallback['hub']['galleryMoreLabel'], 40),
            'archiveKicker' => streamer_clean($hub['archiveKicker'] ?? $fallback['hub']['archiveKicker'], 80),
            'archiveTitle' => streamer_clean($hub['archiveTitle'] ?? $fallback['hub']['archiveTitle'], 120),
            'creators' => streamer_normalize_creators($hub['creators'] ?? $fallback['hub']['creators']),
            'contentCards' => streamer_normalize_content($hub['contentCards'] ?? $fallback['hub']['contentCards']),
        ],
        'profiles' => streamer_normalize_profiles($input['profiles'] ?? $fallback['profiles']),
    ];

    if (empty($data['hub']['officialSocials'])) {
        $data['hub']['officialSocials'] = streamer_normalize_socials($fallback['hub']['officialSocials']);
    }
    if (empty($data['profiles'])) {
        $data['profiles'] = streamer_normalize_profiles($fallback['profiles']);
    }

    return $data;
}

function streamer_read_data(array $config): array
{
    $path = streamer_data_path($config);
    if (is_readable($path)) {
        $decoded = json_decode((string) file_get_contents($path), true);
        if (is_array($decoded)) {
            return streamer_normalize_data($decoded);
        }
    }
    return streamer_normalize_data(streamer_default_data());
}

function streamer_write_data(array $config, array $data): array
{
    $path = streamer_data_path($config);
    $dir = dirname($path);
    if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) {
        streamer_json(500, ['ok' => false, 'error' => 'Folder data streamer tidak bisa dibuat.']);
    }

    $data['updatedAt'] = gmdate('c');
    $data['revision'] = 'rev-' . gmdate('YmdHis') . '-' . bin2hex(random_bytes(3));

    $encoded = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($encoded === false || file_put_contents($path, $encoded . PHP_EOL, LOCK_EX) === false) {
        streamer_json(500, ['ok' => false, 'error' => 'Data streamer gagal disimpan.']);
    }
    @chmod($path, 0600);
    return $data;
}

function streamer_shell_available(): bool
{
    if (!function_exists('shell_exec')) {
        return false;
    }
    $disabled = strtolower((string) ini_get('disable_functions'));
    return !str_contains($disabled, 'shell_exec');
}

function streamer_command_path(string $command): string
{
    if (!streamer_shell_available()) {
        return '';
    }
    $path = trim((string) @shell_exec('command -v ' . escapeshellarg($command) . ' 2>/dev/null'));
    return is_file($path) && is_executable($path) ? $path : '';
}

function streamer_optimize_image(string $source, string $mime, string $targetBase): ?array
{
    if (!extension_loaded('gd') || !function_exists('imagewebp')) {
        return null;
    }

    $image = null;
    if ($mime === 'image/jpeg' && function_exists('imagecreatefromjpeg')) {
        $image = @imagecreatefromjpeg($source);
    } elseif ($mime === 'image/png' && function_exists('imagecreatefrompng')) {
        $image = @imagecreatefrompng($source);
    } elseif ($mime === 'image/webp' && function_exists('imagecreatefromwebp')) {
        $image = @imagecreatefromwebp($source);
    }
    if (!$image) {
        return null;
    }

    imagepalettetotruecolor($image);
    imagesavealpha($image, true);
    $width = imagesx($image);
    $height = imagesy($image);
    $maxSide = 1920;
    $output = $image;
    if ($width > $maxSide || $height > $maxSide) {
        $ratio = min($maxSide / $width, $maxSide / $height);
        $newWidth = max(1, (int) round($width * $ratio));
        $newHeight = max(1, (int) round($height * $ratio));
        $scaled = imagescale($image, $newWidth, $newHeight, IMG_BICUBIC_FIXED);
        if ($scaled) {
            imagesavealpha($scaled, true);
            $output = $scaled;
        }
    }

    $target = $targetBase . '.webp';
    $ok = @imagewebp($output, $target, 82);
    if ($output !== $image) {
        imagedestroy($output);
    }
    imagedestroy($image);
    if (!$ok || !is_file($target) || filesize($target) <= 0) {
        @unlink($target);
        return null;
    }

    return [
        'path' => $target,
        'ext' => 'webp',
        'mime' => 'image/webp',
        'optimized' => true,
        'processor' => 'gd-webp',
    ];
}

function streamer_transcode_video(string $source, string $targetBase): ?array
{
    $ffmpeg = streamer_command_path('ffmpeg');
    if ($ffmpeg === '') {
        return null;
    }

    $target = $targetBase . '.mp4';
    $command = escapeshellarg($ffmpeg)
        . ' -y -i ' . escapeshellarg($source)
        . ' -map 0:v:0 -map 0:a? '
        . ' -vf ' . escapeshellarg("scale='min(1280,iw)':-2")
        . ' -c:v libx264 -preset veryfast -crf 28 '
        . ' -c:a aac -b:a 96k -ac 2 -movflags +faststart '
        . escapeshellarg($target)
        . ' 2>/dev/null';
    @shell_exec($command);
    if (!is_file($target) || filesize($target) <= 0) {
        @unlink($target);
        return null;
    }

    return [
        'path' => $target,
        'ext' => 'mp4',
        'mime' => 'video/mp4',
        'optimized' => true,
        'processor' => 'ffmpeg-h264',
    ];
}

function streamer_upload(array $config): void
{
    streamer_require_admin($config);

    if (!isset($_FILES['file']) || !is_array($_FILES['file'])) {
        streamer_json(400, ['ok' => false, 'error' => 'File upload tidak ditemukan.']);
    }

    $file = $_FILES['file'];
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        streamer_json(400, ['ok' => false, 'error' => 'Upload gagal. Kode: ' . (int) ($file['error'] ?? -1)]);
    }

    $tmp = (string) ($file['tmp_name'] ?? '');
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($tmp) ?: '';
    $allowed = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'video/mp4' => 'mp4',
        'video/webm' => 'webm',
        'video/quicktime' => 'mov',
    ];
    if (!isset($allowed[$mime])) {
        streamer_json(415, ['ok' => false, 'error' => 'Format hanya JPG, PNG, WEBP, MP4, WEBM, atau MOV.']);
    }

    $size = (int) ($file['size'] ?? 0);
    $isImage = str_starts_with($mime, 'image/');
    $limit = $isImage ? 12 * 1024 * 1024 : 100 * 1024 * 1024;
    if ($size <= 0 || $size > $limit) {
        streamer_json(413, ['ok' => false, 'error' => $isImage ? 'Ukuran gambar maksimal 12MB.' : 'Ukuran video maksimal 100MB.']);
    }

    $dir = dirname(__DIR__) . '/uploads/streamer';
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        streamer_json(500, ['ok' => false, 'error' => 'Folder upload tidak bisa dibuat.']);
    }

    $base = streamer_slug(pathinfo((string) ($file['name'] ?? 'streamer-file'), PATHINFO_FILENAME));
    if ($base === '') {
        $base = 'streamer-file';
    }
    $hash = substr(sha1_file($tmp) ?: bin2hex(random_bytes(8)), 0, 12);
    $targetBase = $dir . '/' . gmdate('Ymd-His') . '-' . $base . '-' . $hash;
    $result = null;

    if ($isImage) {
        $result = streamer_optimize_image($tmp, $mime, $targetBase);
    }

    if ($result === null) {
        $target = $targetBase . '.' . $allowed[$mime];
        if (!move_uploaded_file($tmp, $target)) {
            streamer_json(500, ['ok' => false, 'error' => 'File gagal dipindahkan ke server.']);
        }
        $result = [
            'path' => $target,
            'ext' => $allowed[$mime],
            'mime' => $mime,
            'optimized' => false,
            'processor' => 'original',
        ];

        if (!$isImage && is_file($target)) {
            $transcoded = streamer_transcode_video($target, $targetBase . '-light');
            if ($transcoded !== null) {
                @unlink($target);
                $result = $transcoded;
            }
        }
    }
    @chmod($result['path'], 0644);
    $name = basename($result['path']);

    streamer_json(200, [
        'ok' => true,
        'url' => '/uploads/streamer/' . $name,
        'mime' => $result['mime'],
        'sourceMime' => $mime,
        'size' => $size,
        'storedSize' => filesize($result['path']) ?: 0,
        'optimized' => (bool) $result['optimized'],
        'processor' => $result['processor'],
    ]);
}

$config = streamer_load_config();
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$action = streamer_clean($_GET['action'] ?? $_POST['action'] ?? '', 32);

if ($method === 'OPTIONS') {
    streamer_json(204, ['ok' => true]);
}

if ($method === 'GET' && $action === 'status') {
    streamer_require_admin($config);
    $kind = streamer_clean($_GET['kind'] ?? 'asset', 24);
    header('Cache-Control: no-store, no-cache, max-age=0, s-maxage=0, must-revalidate');
    if ($kind === 'subdomain') {
        streamer_json(200, [
            'ok' => true,
            'result' => streamer_subdomain_status((string) ($_GET['slug'] ?? '')),
        ]);
    }
    streamer_json(200, [
        'ok' => true,
        'result' => streamer_url_status((string) ($_GET['url'] ?? '')),
    ]);
}

if ($method === 'GET') {
    $data = streamer_read_data($config);
    $isAdmin = ($_GET['admin'] ?? '') === '1';
    if ($isAdmin) {
        streamer_require_admin($config);
    }
    header('Cache-Control: no-store, no-cache, max-age=0, s-maxage=0, must-revalidate');
    streamer_json(200, [
        'ok' => true,
        'revision' => $data['revision'],
        'updatedAt' => $data['updatedAt'],
        'data' => $data,
    ]);
}

if ($method === 'POST' && $action === 'upload') {
    streamer_upload($config);
}

if ($method === 'POST') {
    streamer_require_admin($config);
    $raw = file_get_contents('php://input') ?: '';
    $payload = json_decode($raw, true);
    if (!is_array($payload)) {
        streamer_json(400, ['ok' => false, 'error' => 'Payload JSON tidak valid.']);
    }
    $data = streamer_normalize_data(is_array($payload['data'] ?? null) ? $payload['data'] : $payload);
    $data = streamer_write_data($config, $data);
    streamer_json(200, [
        'ok' => true,
        'revision' => $data['revision'],
        'updatedAt' => $data['updatedAt'],
        'data' => $data,
    ]);
}

streamer_json(405, ['ok' => false, 'error' => 'Method tidak didukung.']);
