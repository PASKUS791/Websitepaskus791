<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function start_discord_session(): void
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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, [
        'ok' => false,
        'message' => 'Metode tidak diizinkan.',
    ]);
}

$configPath = dirname(__DIR__, 4) . '/.paskus-recruitment/config.php';
if (!is_readable($configPath)) {
    respond(500, [
        'ok' => false,
        'message' => 'Konfigurasi enlistment belum tersedia di server.',
    ]);
}

$config = require $configPath;
if (!is_array($config)) {
    respond(500, [
        'ok' => false,
        'message' => 'Konfigurasi enlistment tidak valid.',
    ]);
}

function clean_text(mixed $value, int $maxLength = 120): string
{
    $text = trim((string) $value);
    $text = preg_replace('/[\x00-\x1F\x7F]/u', ' ', $text) ?? '';
    $text = preg_replace('/\s+/u', ' ', $text) ?? '';

    if (function_exists('mb_substr')) {
        return mb_substr($text, 0, $maxLength);
    }

    return substr($text, 0, $maxLength);
}

function normalize_unit(mixed $value): string
{
    $unit = strtoupper(clean_text($value, 40));
    $unit = str_replace('-', ' ', $unit);
    return preg_replace('/\s+/u', ' ', $unit) ?? '';
}

function client_ip(): string
{
    return clean_text($_SERVER['REMOTE_ADDR'] ?? 'unknown', 80);
}

function strip_markdown_value(mixed $value): string
{
    $text = clean_text($value, 300);
    return trim($text, "`* \t\n\r\0\x0B");
}

function discord_oauth_config(array $config): array
{
    $oauth = $config['discord_oauth'] ?? [];
    return is_array($oauth) ? $oauth : [];
}

function discord_oauth_configured(array $config): bool
{
    $oauth = discord_oauth_config($config);
    return clean_text($oauth['client_id'] ?? '') !== ''
        && clean_text($oauth['client_secret'] ?? '') !== ''
        && clean_text($oauth['guild_id'] ?? '') !== ''
        && clean_text($oauth['redirect_uri'] ?? '') !== '';
}

function discord_session_user(): ?array
{
    start_discord_session();
    $user = $_SESSION['discord_user'] ?? null;
    if (!is_array($user) || clean_text($user['id'] ?? '') === '') {
        return null;
    }

    return $user;
}

function discord_display_name(array $user): string
{
    $display = clean_text($user['display'] ?? '', 100);
    if ($display !== '') {
        return $display;
    }

    return clean_text($user['username'] ?? 'Discord User', 100);
}

function discord_guild_member_verified(?array $user): bool
{
    if ($user === null) {
        return false;
    }

    $status = (int) ($user['guild_member_status'] ?? 0);
    return $status >= 200 && $status < 300;
}

function discord_member_status_label(?array $user): string
{
    $status = (int) ($user['guild_member_status'] ?? 0);
    if ($status >= 200 && $status < 300) {
        return "Terverifikasi di server (`HTTP {$status}`)";
    }

    if ($status === 404) {
        return "Belum terdeteksi sebagai member server (`HTTP 404`)";
    }

    if ($status > 0) {
        return "Tidak bisa diverifikasi (`HTTP {$status}`)";
    }

    return 'Tidak bisa diverifikasi';
}

function discord_dualisme_result(?array $user): array
{
    $raw = is_array($user['dualisme'] ?? null) ? $user['dualisme'] : [];
    $ids = [];
    $rawIds = is_array($raw['guild_ids'] ?? null) ? $raw['guild_ids'] : [];
    foreach ($rawIds as $guildId) {
        $clean = clean_text($guildId, 32);
        if ($clean !== '') {
            $ids[] = $clean;
        }
    }

    $names = [];
    $rawNames = is_array($raw['guild_names'] ?? null) ? $raw['guild_names'] : [];
    foreach ($rawNames as $name) {
        $clean = clean_text($name, 120);
        if ($clean !== '') {
            $names[] = $clean;
        }
    }

    $matches = [];
    $rawMatches = is_array($raw['matches'] ?? null) ? $raw['matches'] : [];
    foreach ($rawMatches as $match) {
        if (!is_array($match)) {
            continue;
        }

        $guildId = clean_text($match['guild_id'] ?? '', 32);
        if ($guildId === '') {
            continue;
        }

        $matchName = clean_text($match['name'] ?? 'Resimen/fraksi terpantau', 120);
        $matches[] = [
            'guild_id' => $guildId,
            'name' => $matchName,
            'category' => clean_text($match['category'] ?? 'resimen', 40),
        ];

        $ids[] = $guildId;
        $names[] = $matchName;
    }

    $ids = array_values(array_unique($ids));
    $names = array_values(array_unique($names));

    return [
        'detected' => !empty($raw['detected']) && count($ids) > 0,
        'guild_ids' => $ids,
        'guild_names' => $names,
        'matches' => $matches,
        'checked_at' => clean_text($raw['checked_at'] ?? gmdate('c'), 40),
        'source' => clean_text($raw['source'] ?? 'discord_oauth_guilds', 80),
    ];
}

function dualisme_payload_fields(array $dualisme): array
{
    $ids = is_array($dualisme['guild_ids'] ?? null) ? $dualisme['guild_ids'] : [];
    $names = is_array($dualisme['guild_names'] ?? null) ? $dualisme['guild_names'] : [];

    return [
        'dualisme_detected' => (bool) ($dualisme['detected'] ?? false),
        'dualisme_guild_ids' => array_values($ids),
        'dualisme_guild_names' => array_values($names),
        'dualisme_checked_at' => clean_text($dualisme['checked_at'] ?? '', 40),
        'dualisme_source' => clean_text($dualisme['source'] ?? 'discord_oauth_guilds', 80),
    ];
}

function discord_allowed_roles(array $config): array
{
    $oauth = discord_oauth_config($config);
    $roles = $oauth['allowed_role_ids'] ?? [];
    if (!is_array($roles)) {
        return [];
    }

    return array_values(array_filter(array_map(static fn ($role) => clean_text($role, 32), $roles)));
}

function discord_embed_payload(string $username, string $title, int $color, array $fields): array
{
    return [
        'username' => $username,
        'allowed_mentions' => ['parse' => []],
        'embeds' => [[
            'title' => $title,
            'description' => 'Pendaftar baru telah mengirimkan data melalui website PASKUS-791.',
            'color' => $color,
            'fields' => $fields,
            'footer' => [
                'text' => 'PASKUS-791 Automated Admission',
            ],
            'timestamp' => gmdate('c'),
        ]],
    ];
}

function duplicate_scope_for_entry(array $entry): string
{
    $storedScope = clean_text($entry['duplicate_scope'] ?? '', 40);
    if ($storedScope === 'pendaftaran_awal' || $storedScope === 'unit_tempur') {
        return $storedScope;
    }

    $type = strtolower(clean_text($entry['type'] ?? '', 20));
    if ($type === 'unit') {
        return 'unit_tempur';
    }

    if ($type === 'main') {
        return 'pendaftaran_awal';
    }

    $unit = normalize_unit($entry['unit'] ?? '');
    return $unit !== '' && $unit !== 'MAIN' ? 'unit_tempur' : 'pendaftaran_awal';
}

function duplicate_message_for_scope(string $scope): string
{
    if ($scope === 'unit_tempur') {
        return 'Akun Discord ini sudah pernah mengirim pendaftaran unit tempur. Jika data lama sudah diterima atau dihapus, silakan coba lagi.';
    }

    return 'Akun Discord ini sudah pernah mengirim pendaftaran awal anggota. Jika data lama sudah diterima atau dihapus, silakan coba lagi.';
}

function post_json(string $url, array $payload, int $timeoutSeconds = 12): array
{
    if ($url === '') {
        return [
            'ok' => false,
            'status' => 0,
            'body' => '',
            'error' => 'URL tujuan kosong.',
        ];
    }

    $json = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        return [
            'ok' => false,
            'status' => 0,
            'body' => '',
            'error' => 'Payload tidak bisa dikodekan.',
        ];
    }

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_POSTFIELDS => $json,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => false,
            CURLOPT_TIMEOUT => $timeoutSeconds,
        ]);
        $body = (string) curl_exec($ch);
        $error = curl_error($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);

        return [
            'ok' => $error === '' && $status >= 200 && $status < 300,
            'status' => $status,
            'body' => $body,
            'error' => $error,
            'json' => json_decode($body, true),
        ];
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => $json,
            'timeout' => $timeoutSeconds,
            'ignore_errors' => true,
        ],
    ]);
    $body = @file_get_contents($url, false, $context);
    $status = 0;
    foreach ($http_response_header ?? [] as $header) {
        if (preg_match('/^HTTP\/\S+\s+(\d+)/', $header, $matches)) {
            $status = (int) $matches[1];
            break;
        }
    }

    return [
        'ok' => $body !== false && $status >= 200 && $status < 300,
        'status' => $status,
        'body' => $body === false ? '' : $body,
        'error' => $body === false ? 'Gagal membuka koneksi HTTP.' : '',
        'json' => $body === false ? null : json_decode($body, true),
    ];
}

function discord_wait_url(string $url): string
{
    $url = trim($url);
    if ($url === '' || !preg_match('~https://(?:ptb\.|canary\.)?discord(?:app)?\.com/api/webhooks/\d+/~i', $url)) {
        return $url;
    }

    if (str_contains($url, 'wait=true')) {
        return $url;
    }

    return $url . (str_contains($url, '?') ? '&' : '?') . 'wait=true';
}

function discord_message_jump_url(array $result, string $fallbackGuildId = ''): string
{
    $json = $result['json'] ?? null;
    if (!is_array($json)) {
        $decoded = json_decode((string) ($result['body'] ?? ''), true);
        $json = is_array($decoded) ? $decoded : [];
    }

    $messageId = clean_text($json['id'] ?? '', 32);
    $channelId = clean_text($json['channel_id'] ?? '', 32);
    $guildId = clean_text($json['guild_id'] ?? $fallbackGuildId, 32);

    if ($messageId === '' || $channelId === '') {
        return '';
    }

    return 'https://discord.com/channels/' . ($guildId !== '' ? $guildId : '@me') . '/' . $channelId . '/' . $messageId;
}

function public_base_url(array $config): string
{
    $configured = clean_text($config['public_base_url'] ?? '', 240);
    if ($configured !== '') {
        return rtrim($configured, '/');
    }

    $host = clean_text($_SERVER['HTTP_HOST'] ?? 'paskus.so791.com', 160);
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

    return ($secure ? 'https://' : 'http://') . $host;
}

function intel_webhook_url(array $config): string
{
    $configured = clean_text($config['intel_webhook'] ?? '', 512);
    if ($configured !== '') {
        return $configured;
    }

    $env = getenv('PASKUS_INTEL_WEBHOOK_URL') ?: getenv('ONE_EYE_INTEL_WEBHOOK_URL') ?: '';
    return clean_text($env, 512);
}

function dualisme_webhook_url(array $config): string
{
    $configured = clean_text($config['dualisme_webhook'] ?? $config['dualisme_alert_webhook'] ?? '', 512);
    if ($configured !== '') {
        return $configured;
    }

    $env = getenv('PASKUS_DUALISME_WEBHOOK_URL') ?: '';
    if ($env !== '') {
        return clean_text($env, 512);
    }

    return intel_webhook_url($config);
}

function request_context(): array
{
    return [
        'ip' => client_ip(),
        'cf_ip' => clean_text($_SERVER['HTTP_CF_CONNECTING_IP'] ?? '', 80),
        'real_ip' => clean_text($_SERVER['HTTP_X_REAL_IP'] ?? '', 80),
        'forwarded_for' => clean_text($_SERVER['HTTP_X_FORWARDED_FOR'] ?? '', 240),
        'user_agent' => clean_text($_SERVER['HTTP_USER_AGENT'] ?? 'unknown', 420),
        'accept_language' => clean_text($_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '', 120),
        'referer' => clean_text($_SERVER['HTTP_REFERER'] ?? '', 240),
        'origin' => clean_text($_SERVER['HTTP_ORIGIN'] ?? '', 160),
        'host' => clean_text($_SERVER['HTTP_HOST'] ?? '', 160),
    ];
}

function request_header_host(mixed $value): string
{
    $host = strtolower(clean_text($value, 160));
    return preg_replace('/:\d+$/', '', $host) ?? $host;
}

function request_has_same_origin(array $request): bool
{
    $host = request_header_host($request['host'] ?? '');
    if ($host === '') {
        return false;
    }

    foreach (['origin', 'referer'] as $header) {
        $value = clean_text($request[$header] ?? '', 300);
        if ($value === '') {
            continue;
        }

        $headerHost = parse_url($value, PHP_URL_HOST);
        if (is_string($headerHost) && request_header_host($headerHost) === $host) {
            return true;
        }
    }

    return false;
}

function request_uses_direct_tool(array $request): bool
{
    $userAgent = strtolower(clean_text($request['user_agent'] ?? '', 420));
    if ($userAgent === '') {
        return false;
    }

    return (bool) preg_match('/\b(curl|wget|python-requests|httpie|postmanruntime|insomnia|libwww-perl|go-http-client|java\/|node-fetch)\b/i', $userAgent);
}

function direct_tool_submission_blocked(array $request): bool
{
    return request_uses_direct_tool($request) && !request_has_same_origin($request);
}

function config_value(array $config, string $key, string $envKey = ''): string
{
    $value = clean_text($config[$key] ?? '', 512);
    if ($value !== '') {
        return $value;
    }

    if ($envKey !== '') {
        return clean_text(getenv($envKey) ?: '', 512);
    }

    return '';
}

function oauth_client_secret(array $config): string
{
    $oauth = $config['discord_oauth'] ?? [];
    if (!is_array($oauth)) {
        return '';
    }

    return clean_text($oauth['client_secret'] ?? '', 256);
}

function location_lookup_secret(array $config): string
{
    $explicit = config_value($config, 'location_lookup_secret', 'PASKUS_LOCATION_LOOKUP_SECRET');
    if ($explicit !== '') {
        return $explicit;
    }

    return config_value($config, 'structure_sync_secret', 'PASKUS_STRUCTURE_SYNC_SECRET');
}

function location_crypto_material(array $config): string
{
    $explicit = config_value($config, 'location_encryption_key', 'PASKUS_LOCATION_ENCRYPTION_KEY');
    if ($explicit !== '') {
        return $explicit;
    }

    $parts = array_filter([
        location_lookup_secret($config),
        oauth_client_secret($config),
        config_value($config, 'ip_salt', 'PASKUS_IP_SALT'),
        config_value($config, 'app_secret', 'PASKUS_APP_SECRET'),
    ]);

    return implode('|', $parts);
}

function location_root_dir(): string
{
    return dirname(__DIR__, 4) . '/.paskus-recruitment/locations';
}

function location_code_path(string $code, array $config): string
{
    $secret = location_crypto_material($config);
    if (strlen($secret) < 16) {
        return '';
    }

    return location_root_dir() . '/' . hash_hmac('sha256', strtoupper($code), $secret) . '.json';
}

function location_code_is_valid(string $code, array $config): bool
{
    if (!preg_match('/^LOC-[A-F0-9]{4}-[A-F0-9]{4}$/', $code) && !preg_match('/^LOC-[A-F0-9]{8}$/', $code)) {
        return false;
    }

    $path = location_code_path($code, $config);
    return $path !== '' && is_readable($path);
}

function session_location_lookup_code(array $config): string
{
    start_discord_session();
    $code = strtoupper(clean_text($_SESSION['paskus_location_lookup_code'] ?? '', 40));
    if (location_code_is_valid($code, $config)) {
        return $code;
    }

    unset($_SESSION['paskus_location_lookup_code'], $_SESSION['paskus_location_created_unix']);
    return '';
}

function intel_trim_value(mixed $value, int $maxLength = 900): string
{
    $text = clean_text($value, $maxLength);
    if ($text === '') {
        return '`-`';
    }

    return $text;
}

function intel_code(mixed $value, int $maxLength = 160): string
{
    $text = str_replace('`', "'", clean_text($value, $maxLength));
    return $text !== '' ? "`{$text}`" : '`-`';
}

function intel_field(string $name, mixed $value, bool $inline = false): array
{
    $text = (string) $value;
    if ($text === '') {
        $text = '`-`';
    }

    if (function_exists('mb_substr')) {
        $text = mb_substr($text, 0, 1024);
    } else {
        $text = substr($text, 0, 1024);
    }

    return [
        'name' => clean_text($name, 256),
        'value' => $text,
        'inline' => $inline,
    ];
}

function partial_entry_from_body(string $type, array $body, array $apiPayload): array
{
    if ($type === 'unit') {
        return [
            'type' => 'unit',
            'username' => clean_text($body['callsign'] ?? '', 64),
            'discord' => clean_text($body['discord'] ?? '', 100),
            'unit' => normalize_unit($body['unit'] ?? ''),
            'duplicate_scope' => 'unit_tempur',
        ];
    }

    return [
        'type' => 'main',
        'username' => clean_text($apiPayload['username'] ?? '', 64),
        'discord' => clean_text($apiPayload['discord_name'] ?? $apiPayload['discord'] ?? '', 100),
        'unit' => 'MAIN',
        'duplicate_scope' => 'pendaftaran_awal',
    ];
}

function count_existing_records(array $state, string $ipHash, string $discordUserId, string $duplicateScope, string $username): array
{
    $sameIp = 0;
    $sameDiscord = 0;
    $sameScope = 0;
    $sameUsername = 0;
    $discordIdsOnIp = [];

    foreach ($state['entries'] ?? [] as $existingEntry) {
        if (!is_array($existingEntry)) {
            continue;
        }

        $existingDiscordId = clean_text($existingEntry['discord_user_id'] ?? '', 32);
        if (($existingEntry['ip_hash'] ?? '') === $ipHash) {
            $sameIp++;
            if ($existingDiscordId !== '') {
                $discordIdsOnIp[$existingDiscordId] = true;
            }
        }

        if ($discordUserId !== '' && $existingDiscordId === $discordUserId) {
            $sameDiscord++;
            if (duplicate_scope_for_entry($existingEntry) === $duplicateScope) {
                $sameScope++;
            }
        }

        if ($username !== '' && strcasecmp(clean_text($existingEntry['username'] ?? '', 64), $username) === 0) {
            $sameUsername++;
        }
    }

    return [
        'same_ip' => $sameIp,
        'same_discord' => $sameDiscord,
        'same_scope' => $sameScope,
        'same_username' => $sameUsername,
        'discord_ids_on_ip' => count($discordIdsOnIp),
    ];
}

function assess_intel_risk(array $stats, array $signals = []): array
{
    $status = 'GREEN';
    $color = 0x57F287;
    $reasons = [];

    if (!empty($signals['duplicate_scope'])) {
        $status = 'RED';
        $reasons[] = 'Discord ID sudah pernah mengirim di jalur yang sama.';
    }

    if (!empty($signals['discord_mismatch'])) {
        $status = 'RED';
        $reasons[] = 'Discord ID payload tidak sama dengan session Discord.';
    }

    if (!empty($signals['missing_discord'])) {
        $status = 'RED';
        $reasons[] = 'Percobaan submit tanpa session Discord valid.';
    }

    if (!empty($signals['direct_submit_tool'])) {
        $status = 'RED';
        $reasons[] = 'Percobaan submit langsung dari tool otomatis tanpa konteks browser website.';
    }

    if (!empty($signals['not_guild_member'])) {
        $status = 'RED';
        $reasons[] = 'Discord OAuth valid, tetapi akun belum terdeteksi sebagai member server.';
    }

    if (!empty($signals['missing_location'])) {
        $status = 'RED';
        $reasons[] = 'Session Discord valid, tetapi kode login lokasi tidak ditemukan.';
    }

    if (!empty($signals['invalid_role']) && $status !== 'RED') {
        $status = 'YELLOW';
        $reasons[] = 'Akun mencoba mendaftar unit tempur tanpa role akses.';
    }

    if (($stats['same_ip'] ?? 0) > 0 && $status === 'GREEN') {
        $status = 'YELLOW';
        $reasons[] = 'IP pernah tercatat pada pendaftaran sebelumnya.';
    }

    if (($stats['discord_ids_on_ip'] ?? 0) > 1 && $status !== 'RED') {
        $status = 'YELLOW';
        $reasons[] = 'Satu IP terhubung ke lebih dari satu Discord ID.';
    }

    if (($stats['same_username'] ?? 0) > 0 && $status === 'GREEN') {
        $status = 'YELLOW';
        $reasons[] = 'Nama Roblox/callsign pernah tercatat.';
    }

    if (($stats['same_discord'] ?? 0) > 0 && $status === 'GREEN') {
        $status = 'YELLOW';
        $reasons[] = 'Discord ID pernah tercatat pada jalur pendaftaran lain.';
    }

    if ($status === 'YELLOW') {
        $color = 0xFEE75C;
    }

    if ($status === 'RED') {
        $color = 0xED4245;
    }

    if (empty($reasons)) {
        $reasons[] = 'Discord baru, IP belum tercatat, dan payload sinkron.';
    }

    return [
        'status' => $status,
        'color' => $color,
        'reasons' => $reasons,
    ];
}

function send_intel_log(array $config, array $options): void
{
    $webhookUrl = intel_webhook_url($config);
    if ($webhookUrl === '') {
        return;
    }

    $entry = is_array($options['entry'] ?? null) ? $options['entry'] : [];
    $payload = is_array($options['payload'] ?? null) ? $options['payload'] : [];
    $request = is_array($options['request'] ?? null) ? $options['request'] : request_context();
    $stats = is_array($options['stats'] ?? null) ? $options['stats'] : [];
    $risk = is_array($options['risk'] ?? null) ? $options['risk'] : assess_intel_risk($stats);
    $dispatch = is_array($options['dispatch'] ?? null) ? $options['dispatch'] : [];
    $submissionId = clean_text($options['submission_id'] ?? '', 32);
    $locationLookupCode = clean_text($options['location_lookup_code'] ?? '', 40);
    $jumpUrl = clean_text($options['jump_url'] ?? '', 300);
    $discordUserId = clean_text($options['discord_user_id'] ?? '', 40);
    $discordMemberStatus = (int) ($options['discord_member_status'] ?? $payload['discord_member_status'] ?? 0);
    $discordMemberVerified = $discordMemberStatus >= 200 && $discordMemberStatus < 300;
    $discordMemberLabel = discord_member_status_label(['guild_member_status' => $discordMemberStatus]);
    $discordMention = $discordMemberVerified && $discordUserId !== ''
        ? '<@' . $discordUserId . '>'
        : ($discordUserId !== '' ? '`Tidak dirender - bukan member server terverifikasi`' : '`-`');
    $scope = clean_text($entry['duplicate_scope'] ?? '', 40);
    $isUnit = ($entry['type'] ?? '') === 'unit';
    $routeLabel = $scope === 'unit_tempur' ? 'Pendaftaran Unit Tempur' : 'Pendaftaran Awal Anggota';
    $status = clean_text($risk['status'] ?? 'GREEN', 12);
    $statusEmoji = ['GREEN' => '🟢', 'YELLOW' => '🟡', 'RED' => '🔴'][$status] ?? '⚪';
    $baseUrl = public_base_url($config);
    $avatarUrl = $baseUrl . '/recruitment-webhook-logo.png';
    $reasonText = implode("\n", array_map(static fn ($reason): string => '• ' . clean_text($reason, 180), $risk['reasons'] ?? []));
    $forwardedSignals = array_filter([
        $request['cf_ip'] !== '' ? 'CF: ' . $request['cf_ip'] : '',
        $request['real_ip'] !== '' ? 'Real: ' . $request['real_ip'] : '',
        $request['forwarded_for'] !== '' ? 'XFF: ' . $request['forwarded_for'] : '',
    ]);
    $jumpText = $jumpUrl !== ''
        ? "[Jump to pendaftaran]({$jumpUrl})"
        : "[Buka section pendaftaran]({$baseUrl}/#enlist)";

    $fields = [
        intel_field('Status Intel', "{$statusEmoji} **{$status}**\n{$reasonText}", false),
        intel_field('Jalur', intel_code($routeLabel), true),
        intel_field($isUnit ? 'Callsign' : 'Nama Roblox', intel_code($entry['username'] ?? ''), true),
        intel_field('Discord', intel_code($entry['discord'] ?? ''), true),
        intel_field('Discord ID', intel_code($discordUserId, 40), true),
        intel_field('Status Member Server', $discordMemberLabel, true),
        intel_field('Mention', $discordMention, true),
        intel_field('Unit / Assignment', intel_code($entry['unit'] ?? '', 80), true),
        intel_field('IP Observed', intel_code($request['ip'] ?? '', 80), true),
        intel_field('Location Lookup Code', $locationLookupCode !== '' ? intel_code($locationLookupCode, 40) : '`MISSING`', true),
        intel_field('IP Header Signal', !empty($forwardedSignals) ? intel_code(implode(' | ', $forwardedSignals), 240) : '`-`', false),
        intel_field('Record Check', sprintf(
            "`IP:%d` `Discord:%d` `Scope:%d` `Nama:%d` `Discord/IP:%d`",
            (int) ($stats['same_ip'] ?? 0),
            (int) ($stats['same_discord'] ?? 0),
            (int) ($stats['same_scope'] ?? 0),
            (int) ($stats['same_username'] ?? 0),
            (int) ($stats['discord_ids_on_ip'] ?? 0),
        ), false),
        intel_field('Dispatch Status', sprintf(
            "`API:%s` `Discord:%s`",
            clean_text((string) ($dispatch['api_status'] ?? '-'), 20),
            clean_text((string) ($dispatch['discord_status'] ?? '-'), 20),
        ), true),
        intel_field('Submission ID', intel_code($submissionId !== '' ? $submissionId : '-'), true),
        intel_field('Jump', $jumpText, true),
        intel_field('User Agent', intel_code($request['user_agent'] ?? '', 420), false),
        intel_field('Referer / Origin', intel_code(trim(($request['referer'] ?? '') . ' | ' . ($request['origin'] ?? ''), ' |'), 300), false),
    ];

    if ($isUnit) {
        $fields[] = intel_field('Motivasi', intel_trim_value($payload['motivation'] ?? '', 700), false);
    } else {
        $fields[] = intel_field('Profil Pendaftaran', sprintf(
            "`Gender:%s` `Age:%s` `Via:%s` `Status:%s` `Device:%s` `Gol:%s`",
            clean_text($payload['gender'] ?? '-', 30),
            clean_text((string) ($payload['age'] ?? '-'), 10),
            clean_text($payload['joined_via'] ?? '-', 60),
            clean_text($payload['status'] ?? '-', 40),
            clean_text($payload['device'] ?? '-', 40),
            clean_text($payload['golongan'] ?? '-', 40),
        ), false);
    }

    $message = [
        'username' => 'One eye intel',
        'avatar_url' => $avatarUrl,
        'allowed_mentions' => ['parse' => []],
        'embeds' => [[
            'author' => [
                'name' => 'One eye intel',
                'icon_url' => $avatarUrl,
            ],
            'title' => "{$statusEmoji} {$status} • {$routeLabel}",
            'description' => 'Log otomatis pendaftaran website PASKUS untuk pengecekan anomali, duplikasi, dan percobaan submit.',
            'color' => (int) ($risk['color'] ?? 0x57F287),
            'fields' => array_slice($fields, 0, 25),
            'footer' => [
                'text' => 'PASKUS One eye intel • Server side log',
            ],
            'timestamp' => gmdate('c'),
        ]],
    ];

    post_json($webhookUrl, $message, 5);
}

function dualisme_match_text(array $dualisme): string
{
    $matches = is_array($dualisme['matches'] ?? null) ? $dualisme['matches'] : [];
    $lines = [];
    foreach ($matches as $match) {
        if (!is_array($match)) {
            continue;
        }

        $name = clean_text($match['name'] ?? 'Resimen/fraksi terpantau', 120);
        $guildId = clean_text($match['guild_id'] ?? '', 32);
        if ($guildId !== '') {
            $lines[] = "{$name} (`{$guildId}`)";
        }
    }

    if (!empty($lines)) {
        return implode("\n", $lines);
    }

    $ids = is_array($dualisme['guild_ids'] ?? null) ? $dualisme['guild_ids'] : [];
    $names = is_array($dualisme['guild_names'] ?? null) ? $dualisme['guild_names'] : [];
    foreach ($ids as $index => $guildId) {
        $cleanId = clean_text($guildId, 32);
        if ($cleanId === '') {
            continue;
        }

        $name = clean_text($names[$index] ?? 'Resimen/fraksi terpantau', 120);
        $lines[] = "{$name} (`{$cleanId}`)";
    }

    return !empty($lines) ? implode("\n", $lines) : '`-`';
}

function send_dualisme_alert(array $config, array $options): void
{
    $dualisme = is_array($options['dualisme'] ?? null) ? $options['dualisme'] : [];
    if (empty($dualisme['detected'])) {
        return;
    }

    $webhookUrl = dualisme_webhook_url($config);
    if ($webhookUrl === '') {
        return;
    }

    $entry = is_array($options['entry'] ?? null) ? $options['entry'] : [];
    $discordUserId = clean_text($options['discord_user_id'] ?? '', 40);
    $submissionId = clean_text($options['submission_id'] ?? '', 32);
    $jumpUrl = clean_text($options['jump_url'] ?? '', 300);
    $routeLabel = ($entry['duplicate_scope'] ?? '') === 'unit_tempur' ? 'Pendaftaran Unit Tempur' : 'Pendaftaran Awal Anggota';
    $baseUrl = public_base_url($config);
    $avatarUrl = $baseUrl . '/recruitment-webhook-logo.png';
    $jumpText = $jumpUrl !== ''
        ? "[Buka detail pendaftar]({$jumpUrl})"
        : "[Buka section pendaftaran]({$baseUrl}/#enlist)";

    $message = [
        'username' => 'One eye intel',
        'avatar_url' => $avatarUrl,
        'allowed_mentions' => ['parse' => []],
        'embeds' => [[
            'author' => [
                'name' => 'One eye intel',
                'icon_url' => $avatarUrl,
            ],
            'title' => '⚠️ Deteksi Dualisme Resimen',
            'description' => 'User ini tidak diblokir otomatis. Data hanya ditandai untuk review staff PASKUS.',
            'color' => 0xFEE75C,
            'fields' => [
                intel_field('Nama Discord', intel_code($entry['discord'] ?? '', 160), true),
                intel_field('Discord ID', intel_code($discordUserId, 40), true),
                intel_field('Nama Roblox', intel_code($entry['username'] ?? '', 80), true),
                intel_field('Jalur Pendaftaran', intel_code($routeLabel, 80), true),
                intel_field('Submission ID', intel_code($submissionId, 40), true),
                intel_field('Waktu Deteksi', intel_code($dualisme['checked_at'] ?? gmdate('c'), 60), true),
                intel_field('Resimen/fraksi terdeteksi', dualisme_match_text($dualisme), false),
                intel_field('Sumber Deteksi', intel_code($dualisme['source'] ?? 'discord_oauth_guilds', 80), true),
                intel_field('Link / Detail Data', $jumpText, true),
            ],
            'footer' => [
                'text' => 'PASKUS One eye intel • Dualisme monitor',
            ],
            'timestamp' => gmdate('c'),
        ]],
    ];

    post_json($webhookUrl, $message, 5);
}

$rawBody = file_get_contents('php://input') ?: '';
if (strlen($rawBody) > 65536) {
    respond(413, [
        'ok' => false,
        'message' => 'Payload terlalu besar.',
    ]);
}

$body = json_decode($rawBody, true);
if (!is_array($body)) {
    respond(400, [
        'ok' => false,
        'message' => 'Payload JSON tidak valid.',
    ]);
}

$type = strtolower(clean_text($body['type'] ?? '', 20));
$apiPayload = is_array($body['api'] ?? null) ? $body['api'] : [];
$isMain = $type === 'main';
$isUnit = $type === 'unit';

if (!$isMain && !$isUnit) {
    respond(400, [
        'ok' => false,
        'message' => 'Jenis enlistment tidak dikenali.',
    ]);
}

$entry = [
    'type' => $type,
    'username' => '',
    'discord' => '',
    'unit' => '',
    'duplicate_scope' => $isUnit ? 'unit_tempur' : 'pendaftaran_awal',
];
$apiForwardPayload = [];
$discordPayload = [];
$primaryDispatch = null;
$discordConfigured = discord_oauth_configured($config);
$discordUser = null;
$discordUserId = '';
$discordMention = '';
$locationLookupCode = '';
$requestContext = request_context();
$submissionId = 'PASKUS-' . strtoupper(bin2hex(random_bytes(5)));
$postedDiscordUserId = '';

if (direct_tool_submission_blocked($requestContext)) {
    send_intel_log($config, [
        'entry' => partial_entry_from_body($type, $body, $apiPayload),
        'payload' => $apiPayload,
        'request' => $requestContext,
        'submission_id' => $submissionId,
        'risk' => assess_intel_risk([], ['direct_submit_tool' => true]),
        'dispatch' => ['api_status' => 'blocked', 'discord_status' => 'blocked'],
    ]);

    respond(403, [
        'ok' => false,
        'message' => 'Permintaan pendaftaran harus dikirim melalui website PASKUS-791.',
        'blocked_direct_submit' => true,
    ]);
}

if (!$discordConfigured) {
    send_intel_log($config, [
        'entry' => partial_entry_from_body($type, $body, $apiPayload),
        'payload' => $apiPayload,
        'request' => $requestContext,
        'submission_id' => $submissionId,
        'risk' => assess_intel_risk([], ['missing_discord' => true]),
        'dispatch' => ['api_status' => 'blocked', 'discord_status' => 'blocked'],
    ]);

    respond(503, [
        'ok' => false,
        'message' => 'Discord sync wajib aktif sebelum pendaftaran. Data tidak dikirim ke aplikasi perekrut maupun Discord.',
        'requires_discord_sync' => true,
    ]);
}

$discordUser = discord_session_user();
if ($discordUser === null) {
    send_intel_log($config, [
        'entry' => partial_entry_from_body($type, $body, $apiPayload),
        'payload' => $apiPayload,
        'request' => $requestContext,
        'submission_id' => $submissionId,
        'risk' => assess_intel_risk([], ['missing_discord' => true]),
        'dispatch' => ['api_status' => 'blocked', 'discord_status' => 'blocked'],
    ]);

    respond(401, [
        'ok' => false,
        'message' => 'Silakan sinkronkan akun Discord terlebih dahulu.',
        'requires_discord_sync' => true,
    ]);
}

$discordUserId = clean_text($discordUser['id'] ?? '', 32);
if ($discordUserId === '') {
    send_intel_log($config, [
        'entry' => partial_entry_from_body($type, $body, $apiPayload),
        'payload' => $apiPayload,
        'request' => $requestContext,
        'submission_id' => $submissionId,
        'risk' => assess_intel_risk([], ['missing_discord' => true]),
        'dispatch' => ['api_status' => 'blocked', 'discord_status' => 'blocked'],
    ]);

    respond(401, [
        'ok' => false,
        'message' => 'Session Discord tidak valid. Silakan sinkronkan ulang akun Discord terlebih dahulu.',
        'requires_discord_sync' => true,
    ]);
}

if (!discord_guild_member_verified($discordUser)) {
    $blockedEntry = partial_entry_from_body($type, $body, $apiPayload);
    $blockedEntry['discord'] = discord_display_name($discordUser);
    $memberStatus = (int) ($discordUser['guild_member_status'] ?? 0);

    send_intel_log($config, [
        'entry' => $blockedEntry,
        'payload' => [
            'discord_user_id' => $discordUserId,
            'discord_member_status' => $memberStatus,
        ],
        'request' => $requestContext,
        'submission_id' => $submissionId,
        'discord_user_id' => $discordUserId,
        'discord_member_status' => $memberStatus,
        'risk' => assess_intel_risk([], ['not_guild_member' => true]),
        'dispatch' => ['api_status' => 'blocked', 'discord_status' => 'blocked'],
    ]);

    respond(403, [
        'ok' => false,
        'message' => 'Akun Discord ini belum terdeteksi sebagai member server PASKUS-791. Silakan join server lalu sinkronkan Discord ulang.',
        'requires_discord_server' => true,
        'requires_discord_resync' => true,
        'guild_member_status' => $memberStatus,
    ]);
}

$discordMention = "<@{$discordUserId}>";
$locationLookupCode = session_location_lookup_code($config);

if ($locationLookupCode === '') {
    $blockedEntry = partial_entry_from_body($type, $body, $apiPayload);
    $blockedEntry['discord'] = discord_display_name($discordUser);
    send_intel_log($config, [
        'entry' => $blockedEntry,
        'payload' => $apiPayload,
        'request' => $requestContext,
        'submission_id' => $submissionId,
        'discord_user_id' => $discordUserId,
        'discord_member_status' => (int) ($discordUser['guild_member_status'] ?? 0),
        'risk' => assess_intel_risk([], ['missing_location' => true]),
        'dispatch' => ['api_status' => 'blocked', 'discord_status' => 'blocked'],
    ]);

    unset($_SESSION['discord_user'], $_SESSION['discord_oauth_state'], $_SESSION['discord_oauth_return']);

    respond(403, [
        'ok' => false,
        'message' => 'Validasi administrasi lokasi wajib dilakukan ulang sebelum pendaftaran. Session Discord lama sudah direset, silakan sinkronkan Discord ulang.',
        'requires_location_validation' => true,
        'requires_discord_resync' => true,
    ]);
}

$dualisme = discord_dualisme_result($discordUser);
$dualismePayload = dualisme_payload_fields($dualisme);

if ($isUnit && empty($discordUser['has_allowed_role'])) {
    $blockedEntry = partial_entry_from_body($type, $body, $apiPayload);
    $blockedEntry['discord'] = discord_display_name($discordUser);
    send_intel_log($config, [
        'entry' => $blockedEntry,
        'payload' => [
            'motivation' => clean_text($body['motivation'] ?? '', 900),
        ],
        'request' => $requestContext,
        'submission_id' => $submissionId,
        'discord_user_id' => $discordUserId,
        'discord_member_status' => (int) ($discordUser['guild_member_status'] ?? 0),
        'location_lookup_code' => $locationLookupCode,
        'risk' => assess_intel_risk([], ['invalid_role' => true]),
        'dispatch' => ['api_status' => 'blocked', 'discord_status' => 'blocked'],
    ]);

    respond(403, [
        'ok' => false,
        'message' => 'Akun Discord ini belum memiliki role yang diizinkan untuk mendaftar unit tempur.',
        'requires_allowed_role' => true,
        'allowed_role_ids' => discord_allowed_roles($config),
    ]);
}

if ($isMain) {
    $username = clean_text($apiPayload['username'] ?? '', 64);
    $discord = discord_display_name($discordUser);
    $postedDiscordUserId = clean_text(
        $apiPayload['discordUserId'] ?? $apiPayload['discord_user_id'] ?? $apiPayload['discord_id'] ?? '',
        32,
    );
    $gender = clean_text($apiPayload['gender'] ?? '', 30);
    $age = filter_var($apiPayload['age'] ?? null, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1, 'max_range' => 99],
    ]);
    $joinedVia = clean_text($apiPayload['joined_via'] ?? '', 80);
    $resimen = clean_text($apiPayload['resimen'] ?? '', 80);
    $status = clean_text($apiPayload['status'] ?? '', 40);
    $device = clean_text($apiPayload['device'] ?? '', 40);
    $golongan = clean_text($apiPayload['golongan'] ?? '', 40);

    if (strlen($username) < 4 || $discord === '' || $age === false || $gender === '' || $joinedVia === '' || $status === '' || $device === '' || $golongan === '') {
        respond(400, [
            'ok' => false,
            'message' => 'Data pendaftaran belum lengkap atau tidak valid.',
        ]);
    }

    $apiForwardPayload = array_merge([
        'username' => $username,
        'discord_name' => $discord,
        'discordUserId' => $discordUserId,
        'discord_user_id' => $discordUserId,
        'discord_id' => $discordUserId,
        'locationLookupCode' => $locationLookupCode,
        'location_lookup_code' => $locationLookupCode,
        'gender' => $gender,
        'age' => $age,
        'joined_via' => $joinedVia,
        'resimen' => $resimen,
        'status' => $status,
        'device' => $device,
        'golongan' => $golongan,
    ], $dualismePayload);

    $discordPayload = discord_embed_payload('PASKUS ADMIN REKRUT', '📄 Lampiran Baru Pendaftar Resimen', 13938487, [
        ['name' => 'Jalur Pendaftaran', 'value' => '`Pendaftaran Awal Anggota`', 'inline' => false],
        ['name' => '👤 Nama Roblox', 'value' => "`{$username}`", 'inline' => true],
        ['name' => '👤 Nama Discord', 'value' => "`{$discord}`", 'inline' => true],
        ['name' => '🆔 Discord ID', 'value' => $discordUserId !== '' ? "`{$discordUserId}`" : '`Belum tersinkron`', 'inline' => true],
        ['name' => '🏷️ Mention', 'value' => $discordMention !== '' ? $discordMention : '`Belum tersedia`', 'inline' => true],
        ['name' => 'Status Member Server', 'value' => discord_member_status_label($discordUser), 'inline' => true],
        ['name' => 'Location Lookup Code', 'value' => "`{$locationLookupCode}`", 'inline' => true],
        ['name' => 'Jenis Kelamin', 'value' => "`{$gender}`", 'inline' => true],
        ['name' => '🕰️ Age/Umur', 'value' => "`{$age}`", 'inline' => true],
        ['name' => 'Masuk Via', 'value' => "`{$joinedVia}`", 'inline' => true],
        ['name' => '📇 Resimen', 'value' => "`{$resimen}`", 'inline' => true],
        ['name' => 'Status', 'value' => "`{$status}`", 'inline' => true],
        ['name' => 'Status Device', 'value' => "`{$device}`", 'inline' => true],
        ['name' => 'Mengikuti Gol', 'value' => "`{$golongan}`", 'inline' => true],
    ]);

    $entry['username'] = $username;
    $entry['discord'] = $discord;
    $entry['unit'] = 'MAIN';
    $primaryDispatch = 'api';
}

if ($isUnit) {
    $callsign = clean_text($body['callsign'] ?? '', 64);
    $discord = discord_display_name($discordUser);
    $unit = normalize_unit($body['unit'] ?? '');
    $motivation = clean_text($body['motivation'] ?? '', 900);
    $postedDiscordUserId = clean_text(
        $body['discordUserId'] ?? $body['discord_user_id'] ?? $body['discord_id'] ?? '',
        32,
    );
    $allowedUnits = array_keys($config['unit_webhooks'] ?? []);

    if (strlen($callsign) < 2 || $discord === '' || $motivation === '' || !in_array($unit, $allowedUnits, true)) {
        respond(400, [
            'ok' => false,
            'message' => 'Data rekrutmen unit belum lengkap atau divisi tidak valid.',
        ]);
    }

    $discordPayload = discord_embed_payload('PASKUS COMMAND CENTER', "📡 APLIKASI REKRUTMEN: {$unit}", 14068535, [
        ['name' => 'Jalur Pendaftaran', 'value' => '`Pendaftaran Unit Tempur`', 'inline' => false],
        ['name' => '👤 Callsign', 'value' => "`{$callsign}`", 'inline' => true],
        ['name' => '🆔 Discord', 'value' => "`{$discord}`", 'inline' => true],
        ['name' => 'Discord ID', 'value' => $discordUserId !== '' ? "`{$discordUserId}`" : '`Belum tersinkron`', 'inline' => true],
        ['name' => 'Mention', 'value' => $discordMention !== '' ? $discordMention : '`Belum tersedia`', 'inline' => true],
        ['name' => 'Status Member Server', 'value' => discord_member_status_label($discordUser), 'inline' => true],
        ['name' => 'Location Lookup Code', 'value' => "`{$locationLookupCode}`", 'inline' => true],
        ['name' => '⚔️ Assignment', 'value' => "**{$unit}**", 'inline' => false],
        ['name' => '📝 Motivasi', 'value' => $motivation, 'inline' => false],
    ]);

    $entry['username'] = $callsign;
    $entry['discord'] = $discord;
    $entry['unit'] = $unit;
    $primaryDispatch = 'discord';
}

$storagePath = (string) ($config['storage_path'] ?? (dirname(__DIR__, 4) . '/.paskus-recruitment/submissions.json'));
$storageDir = dirname($storagePath);
if (!is_dir($storageDir) && !mkdir($storageDir, 0700, true) && !is_dir($storageDir)) {
    respond(500, [
        'ok' => false,
        'message' => 'Storage pendaftaran tidak bisa dibuat.',
    ]);
}

$ip = client_ip();
$salt = (string) ($config['ip_salt'] ?? 'paskus-791');
$ipHash = hash('sha256', $salt . '|' . $ip);
$duplicateScope = $entry['duplicate_scope'];
$discordMismatch = $postedDiscordUserId !== '' && $postedDiscordUserId !== $discordUserId;
$discordScopeHash = $discordUserId !== ''
    ? hash('sha256', $salt . '|discord-scope|' . $duplicateScope . '|' . strtolower($discordUserId))
    : '';

if ($discordMismatch) {
    send_intel_log($config, [
        'entry' => $entry,
        'payload' => $primaryDispatch === 'api' ? $apiForwardPayload : [
            'motivation' => clean_text($body['motivation'] ?? '', 900),
        ],
        'request' => $requestContext,
        'submission_id' => $submissionId,
        'discord_user_id' => $discordUserId,
        'discord_member_status' => (int) ($discordUser['guild_member_status'] ?? 0),
        'location_lookup_code' => $locationLookupCode,
        'risk' => assess_intel_risk([], ['discord_mismatch' => true]),
        'dispatch' => ['api_status' => 'blocked', 'discord_status' => 'blocked'],
    ]);

    respond(403, [
        'ok' => false,
        'message' => 'Data Discord pada payload tidak sesuai dengan session OAuth. Silakan sinkronkan Discord ulang.',
        'requires_discord_resync' => true,
    ]);
}

$handle = fopen($storagePath, 'c+');
if ($handle === false) {
    respond(500, [
        'ok' => false,
        'message' => 'Storage pendaftaran tidak bisa dibuka.',
    ]);
}

flock($handle, LOCK_EX);
rewind($handle);
$current = stream_get_contents($handle);
$state = json_decode($current !== false && $current !== '' ? $current : '{"entries":[]}', true);
if (!is_array($state) || !is_array($state['entries'] ?? null)) {
    $state = ['entries' => []];
}

$recordStats = count_existing_records($state, $ipHash, $discordUserId, $duplicateScope, $entry['username']);
$duplicateDetected = false;
foreach ($state['entries'] as $existingEntry) {
    if (!is_array($existingEntry)) {
        continue;
    }

    $existingScope = duplicate_scope_for_entry($existingEntry);
    if ($existingScope !== $duplicateScope) {
        continue;
    }

    $sameDiscord = $discordScopeHash !== '' && (
        ($existingEntry['discord_scope_hash'] ?? '') === $discordScopeHash
        || clean_text($existingEntry['discord_user_id'] ?? '', 32) === $discordUserId
    );

    if ($sameDiscord) {
        $duplicateDetected = true;
        break;
    }
}

if ($duplicateDetected) {
    flock($handle, LOCK_UN);
    fclose($handle);

    send_intel_log($config, [
        'entry' => $entry,
        'payload' => $primaryDispatch === 'api' ? $apiForwardPayload : [
            'motivation' => clean_text($body['motivation'] ?? '', 900),
        ],
        'request' => $requestContext,
        'stats' => $recordStats,
        'submission_id' => $submissionId,
        'discord_user_id' => $discordUserId,
        'discord_member_status' => (int) ($discordUser['guild_member_status'] ?? 0),
        'location_lookup_code' => $locationLookupCode,
        'risk' => assess_intel_risk($recordStats, [
            'duplicate_scope' => true,
            'discord_mismatch' => $discordMismatch,
        ]),
        'dispatch' => ['api_status' => 'blocked', 'discord_status' => 'blocked'],
    ]);

    respond(409, [
        'ok' => false,
        'message' => duplicate_message_for_scope($duplicateScope),
        'duplicate_scope' => $duplicateScope,
    ]);
}

$apiResult = null;
$discordResult = null;

if ($primaryDispatch === 'api') {
    $apiResult = post_json((string) ($config['api_url'] ?? ''), $apiForwardPayload, 12);
    $discordResult = post_json(discord_wait_url((string) ($config['general_webhook'] ?? '')), $discordPayload, 8);
}

if ($primaryDispatch === 'discord') {
    $webhookUrl = (string) (($config['unit_webhooks'] ?? [])[$entry['unit']] ?? '');
    $discordResult = post_json(discord_wait_url($webhookUrl), $discordPayload, 10);
}

$discordOauth = discord_oauth_config($config);
$jumpUrl = $discordResult !== null ? discord_message_jump_url($discordResult, clean_text($discordOauth['guild_id'] ?? '', 32)) : '';
    $submissionRecord = [
	    'submission_id' => $submissionId,
    'ip_hash' => $ipHash,
    'duplicate_scope' => $duplicateScope,
    'type' => $entry['type'],
    'unit' => $entry['unit'],
    'username' => $entry['username'],
    'discord_user_id' => $discordUserId,
    'location_lookup_code' => $locationLookupCode,
    'discord_scope_hash' => $discordScopeHash,
	    'discord_display' => $entry['discord'],
	    'discord_hash' => hash('sha256', $salt . '|discord|' . strtolower($entry['discord'])),
	    'dualisme_detected' => $dualismePayload['dualisme_detected'],
	    'dualisme_guild_ids' => $dualismePayload['dualisme_guild_ids'],
	    'dualisme_guild_names' => $dualismePayload['dualisme_guild_names'],
	    'dualisme_checked_at' => $dualismePayload['dualisme_checked_at'],
	    'dualisme_source' => $dualismePayload['dualisme_source'],
	    'payload' => $primaryDispatch === 'api' ? $apiForwardPayload : [
	        'callsign' => $entry['username'],
	        'discord' => $entry['discord'],
	        'discordUserId' => $discordUserId,
	        'discord_user_id' => $discordUserId,
	        'unit' => $entry['unit'],
	        'motivation' => clean_text($body['motivation'] ?? '', 900),
	        'dualisme_detected' => $dualismePayload['dualisme_detected'],
	        'dualisme_guild_ids' => $dualismePayload['dualisme_guild_ids'],
	        'dualisme_guild_names' => $dualismePayload['dualisme_guild_names'],
	        'dualisme_checked_at' => $dualismePayload['dualisme_checked_at'],
	        'dualisme_source' => $dualismePayload['dualisme_source'],
	    ],
    'api_status' => $apiResult['status'] ?? null,
    'api_ok' => $apiResult['ok'] ?? null,
    'discord_status' => $discordResult['status'] ?? null,
    'discord_ok' => $discordResult['ok'] ?? null,
    'jump_url' => $jumpUrl,
	    'needs_review' => !($apiResult['ok'] ?? true) || !($discordResult['ok'] ?? true) || $dualismePayload['dualisme_detected'],
    'created_at' => gmdate('c'),
];

$state['entries'][] = $submissionRecord;

rewind($handle);
ftruncate($handle, 0);
fwrite($handle, json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
fflush($handle);
flock($handle, LOCK_UN);
fclose($handle);
@chmod($storagePath, 0600);

send_intel_log($config, [
    'entry' => $entry,
    'payload' => $submissionRecord['payload'],
    'request' => $requestContext,
    'stats' => $recordStats,
    'submission_id' => $submissionId,
    'discord_user_id' => $discordUserId,
    'discord_member_status' => (int) ($discordUser['guild_member_status'] ?? 0),
    'location_lookup_code' => $locationLookupCode,
    'jump_url' => $jumpUrl,
    'risk' => assess_intel_risk($recordStats, [
        'discord_mismatch' => $discordMismatch,
    ]),
    'dispatch' => [
        'api_status' => $apiResult['status'] ?? '-',
        'discord_status' => $discordResult['status'] ?? '-',
    ],
]);

send_dualisme_alert($config, [
    'entry' => $entry,
    'dualisme' => $dualisme,
    'submission_id' => $submissionId,
    'discord_user_id' => $discordUserId,
    'jump_url' => $jumpUrl,
]);

respond(200, [
    'ok' => true,
    'message' => 'Data enlistment berhasil diterima.',
    'submission_id' => $submissionId,
    'jump_url' => $jumpUrl,
]);
