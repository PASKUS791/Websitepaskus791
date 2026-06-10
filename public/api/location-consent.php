<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-PASKUS-LOCATION-SECRET, Authorization');
    http_response_code(204);
    exit;
}

function clean_text(mixed $value, int $maxLength = 160): string
{
    $text = trim((string) $value);
    $text = preg_replace('/[\x00-\x1F\x7F]/u', ' ', $text) ?? '';
    $text = preg_replace('/\s+/u', ' ', $text) ?? '';

    if (function_exists('mb_substr')) {
        return mb_substr($text, 0, $maxLength);
    }

    return substr($text, 0, $maxLength);
}

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function start_paskus_session(): void
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

function config_path(): string
{
    return dirname(__DIR__, 4) . '/.paskus-recruitment/config.php';
}

function load_config(): array
{
    $path = config_path();
    if (!is_readable($path)) {
        return [];
    }

    $config = require $path;
    return is_array($config) ? $config : [];
}

function post_json(string $url, array $payload, int $timeoutSeconds = 6): array
{
    if ($url === '') {
        return ['ok' => false, 'status' => 0, 'body' => '', 'error' => 'URL kosong.'];
    }

    $json = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        return ['ok' => false, 'status' => 0, 'body' => '', 'error' => 'Payload tidak valid.'];
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
    ];
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

function client_ip(): string
{
    return clean_text($_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_REAL_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown', 80);
}

function request_context(): array
{
    return [
        'ip' => client_ip(),
        'remote_addr' => clean_text($_SERVER['REMOTE_ADDR'] ?? '', 80),
        'cf_ip' => clean_text($_SERVER['HTTP_CF_CONNECTING_IP'] ?? '', 80),
        'real_ip' => clean_text($_SERVER['HTTP_X_REAL_IP'] ?? '', 80),
        'forwarded_for' => clean_text($_SERVER['HTTP_X_FORWARDED_FOR'] ?? '', 240),
        'user_agent' => clean_text($_SERVER['HTTP_USER_AGENT'] ?? 'unknown', 420),
        'accept_language' => clean_text($_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '', 120),
        'referer' => clean_text($_SERVER['HTTP_REFERER'] ?? '', 300),
        'origin' => clean_text($_SERVER['HTTP_ORIGIN'] ?? '', 160),
        'host' => clean_text($_SERVER['HTTP_HOST'] ?? '', 160),
    ];
}

function location_root_dir(): string
{
    return dirname(__DIR__, 4) . '/.paskus-recruitment/locations';
}

function ensure_location_dir(): void
{
    $dir = location_root_dir();
    if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) {
        respond(500, [
            'ok' => false,
            'message' => 'Storage lokasi belum bisa dibuat.',
        ]);
    }

    if (is_dir($dir)) {
        @chmod($dir, 0700);
    }
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

function location_key(array $config): string
{
    $material = location_crypto_material($config);
    if (strlen($material) < 16) {
        respond(503, [
            'ok' => false,
            'message' => 'Kunci enkripsi lokasi belum dikonfigurasi.',
        ]);
    }

    return hash('sha256', $material, true);
}

function code_storage_name(string $code, array $config): string
{
    $secret = location_crypto_material($config);
    if (strlen($secret) < 16) {
        respond(503, [
            'ok' => false,
            'message' => 'Kunci penyimpanan lokasi belum dikonfigurasi.',
        ]);
    }

    return hash_hmac('sha256', strtoupper($code), $secret) . '.json';
}

function code_path(string $code, array $config): string
{
    return location_root_dir() . '/' . code_storage_name($code, $config);
}

function encrypt_payload(array $payload, array $config): array
{
    if (!function_exists('openssl_encrypt')) {
        respond(503, [
            'ok' => false,
            'message' => 'OpenSSL belum tersedia untuk enkripsi lokasi.',
        ]);
    }

    $plain = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($plain === false) {
        respond(500, [
            'ok' => false,
            'message' => 'Payload lokasi tidak bisa dikodekan.',
        ]);
    }

    $iv = random_bytes(12);
    $tag = '';
    $cipher = openssl_encrypt($plain, 'aes-256-gcm', location_key($config), OPENSSL_RAW_DATA, $iv, $tag);
    if ($cipher === false || $tag === '') {
        respond(500, [
            'ok' => false,
            'message' => 'Payload lokasi gagal dienkripsi.',
        ]);
    }

    return [
        'cipher' => 'aes-256-gcm',
        'iv' => base64_encode($iv),
        'tag' => base64_encode($tag),
        'data' => base64_encode($cipher),
    ];
}

function decrypt_payload(array $envelope, array $config): array
{
    if (!function_exists('openssl_decrypt')) {
        respond(503, [
            'ok' => false,
            'message' => 'OpenSSL belum tersedia untuk membuka lokasi.',
        ]);
    }

    $encrypted = is_array($envelope['encrypted'] ?? null) ? $envelope['encrypted'] : [];
    $iv = base64_decode(clean_text($encrypted['iv'] ?? '', 1024), true);
    $tag = base64_decode(clean_text($encrypted['tag'] ?? '', 1024), true);
    $data = base64_decode(clean_text($encrypted['data'] ?? '', 1048576), true);
    if ($iv === false || $tag === false || $data === false) {
        respond(500, [
            'ok' => false,
            'message' => 'Data lokasi terenkripsi tidak valid.',
        ]);
    }

    $plain = openssl_decrypt($data, 'aes-256-gcm', location_key($config), OPENSSL_RAW_DATA, $iv, $tag);
    if ($plain === false) {
        respond(403, [
            'ok' => false,
            'message' => 'Data lokasi tidak bisa dibuka dengan kunci saat ini.',
        ]);
    }

    $payload = json_decode($plain, true);
    if (!is_array($payload)) {
        respond(500, [
            'ok' => false,
            'message' => 'Payload lokasi tidak valid.',
        ]);
    }

    return $payload;
}

function write_envelope(string $code, array $payload, array $config, ?array $existingEnvelope = null): void
{
    ensure_location_dir();
    $now = gmdate('c');
    $retentionDays = (int) clean_text($config['location_retention_days'] ?? 90, 4);
    if ($retentionDays < 1 || $retentionDays > 365) {
        $retentionDays = 90;
    }

    $createdAt = clean_text($existingEnvelope['created_at'] ?? $payload['created_at'] ?? $now, 40);
    $envelope = [
        'version' => 1,
        'created_at' => $createdAt,
        'updated_at' => $now,
        'expires_at' => gmdate('c', time() + ($retentionDays * 86400)),
        'code_hint' => substr(strtoupper($code), -4),
        'encrypted' => encrypt_payload($payload, $config),
    ];

    $path = code_path($code, $config);
    $tmp = $path . '.' . bin2hex(random_bytes(4)) . '.tmp';
    $json = json_encode($envelope, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false || file_put_contents($tmp, $json, LOCK_EX) === false || !rename($tmp, $path)) {
        @unlink($tmp);
        respond(500, [
            'ok' => false,
            'message' => 'Data lokasi gagal disimpan.',
        ]);
    }

    @chmod($path, 0600);
}

function read_envelope(string $code, array $config): ?array
{
    $path = code_path($code, $config);
    if (!is_readable($path)) {
        return null;
    }

    $json = file_get_contents($path);
    $envelope = $json === false ? null : json_decode($json, true);
    return is_array($envelope) ? $envelope : null;
}

function generate_location_code(array $config): string
{
    for ($i = 0; $i < 8; $i++) {
        $code = 'LOC-' . strtoupper(bin2hex(random_bytes(2))) . '-' . strtoupper(bin2hex(random_bytes(2)));
        if (!is_readable(code_path($code, $config))) {
            return $code;
        }
    }

    return 'LOC-' . strtoupper(bin2hex(random_bytes(4)));
}

function number_or_null(mixed $value, float $min, float $max): ?float
{
    if ($value === null || $value === '') {
        return null;
    }

    if (!is_numeric($value)) {
        return null;
    }

    $number = (float) $value;
    if ($number < $min || $number > $max) {
        return null;
    }

    return $number;
}

function maps_url(float $latitude, float $longitude): string
{
    return 'https://www.google.com/maps?q=' . rawurlencode((string) $latitude . ',' . (string) $longitude);
}

function discord_session_user(): ?array
{
    start_paskus_session();
    $user = $_SESSION['discord_user'] ?? null;
    if (!is_array($user) || clean_text($user['id'] ?? '', 32) === '') {
        return null;
    }

    return $user;
}

function send_location_intel(array $config, string $code, string $status, array $context, array $extra = []): void
{
    $webhookUrl = intel_webhook_url($config);
    if ($webhookUrl === '') {
        return;
    }

    $baseUrl = public_base_url($config);
    $avatarUrl = $baseUrl . '/recruitment-webhook-logo.png';
    $page = clean_text($extra['page'] ?? $context['referer'] ?? '', 300);
    $discordId = clean_text($extra['discord_id'] ?? '', 32);
    $display = clean_text($extra['discord_display'] ?? '', 120);
    $accuracy = clean_text($extra['accuracy'] ?? '', 40);
    $description = $status === 'ATTACHED'
        ? 'Kode lokasi consent sudah ditautkan dengan akun Discord. Koordinat tetap terenkripsi dan hanya bisa dibuka melalui API terminal.'
        : 'User memberi izin lokasi saat menekan Sinkron Discord. Koordinat tidak ditampilkan di Discord dan hanya tersedia melalui API terminal.';

    $forwardedSignals = array_filter([
        clean_text($context['cf_ip'] ?? '', 80) !== '' ? 'CF: ' . clean_text($context['cf_ip'] ?? '', 80) : '',
        clean_text($context['real_ip'] ?? '', 80) !== '' ? 'Real: ' . clean_text($context['real_ip'] ?? '', 80) : '',
        clean_text($context['forwarded_for'] ?? '', 240) !== '' ? 'XFF: ' . clean_text($context['forwarded_for'] ?? '', 240) : '',
    ]);

    $fields = [
        intel_field('Status', intel_code($status, 40), true),
        intel_field('Location Lookup Code', intel_code($code, 40), true),
        intel_field('Coordinates', '`Encrypted server-side - tidak dikirim ke Discord`', false),
        intel_field('IP Observed', intel_code($context['ip'] ?? '', 80), true),
        intel_field('Accuracy Browser', $accuracy !== '' ? intel_code($accuracy . ' meter', 60) : '`-`', true),
        intel_field('Discord ID', $discordId !== '' ? intel_code($discordId, 40) : '`Belum tertaut`', true),
        intel_field('Discord Display', $display !== '' ? intel_code($display, 120) : '`Belum tertaut`', true),
        intel_field('IP Header Signal', !empty($forwardedSignals) ? intel_code(implode(' | ', $forwardedSignals), 240) : '`-`', false),
        intel_field('Jump', '[Buka section pendaftaran](' . $baseUrl . '/#enlist)', true),
        intel_field('Terminal API', '`POST /api/location-consent.php` dengan header `X-PASKUS-LOCATION-SECRET` dan kode lookup.', false),
        intel_field('Page / Referer', intel_code($page, 300), false),
        intel_field('User Agent', intel_code($context['user_agent'] ?? '', 420), false),
    ];

    $message = [
        'username' => 'One eye intel',
        'avatar_url' => $avatarUrl,
        'allowed_mentions' => ['parse' => []],
        'embeds' => [[
            'author' => [
                'name' => 'One eye intel',
                'icon_url' => $avatarUrl,
            ],
            'title' => 'LOCATION CONSENT • ' . $status,
            'description' => $description,
            'color' => $status === 'ATTACHED' ? 0x5865F2 : 0xFEE75C,
            'fields' => array_slice($fields, 0, 25),
            'footer' => [
                'text' => 'PASKUS One eye intel • Encrypted location log',
            ],
            'timestamp' => gmdate('c'),
        ]],
    ];

    post_json($webhookUrl, $message, 5);
}

function request_body(): array
{
    $rawBody = file_get_contents('php://input') ?: '';
    if (strlen($rawBody) > 65536) {
        respond(413, [
            'ok' => false,
            'message' => 'Payload terlalu besar.',
        ]);
    }

    $body = json_decode($rawBody, true);
    return is_array($body) ? $body : [];
}

function provided_location_secret(array $body): string
{
    $header = clean_text($_SERVER['HTTP_X_PASKUS_LOCATION_SECRET'] ?? '', 512);
    if ($header !== '') {
        return $header;
    }

    $authorization = clean_text($_SERVER['HTTP_AUTHORIZATION'] ?? '', 700);
    if (stripos($authorization, 'Bearer ') === 0) {
        return trim(substr($authorization, 7));
    }

    return '';
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, [
        'ok' => false,
        'message' => 'Metode tidak diizinkan.',
    ]);
}

start_paskus_session();

$config = load_config();
$body = request_body();
$action = strtolower(clean_text($body['action'] ?? 'store', 40));

if ($action === 'status') {
    $code = strtoupper(clean_text($_SESSION['paskus_location_lookup_code'] ?? '', 40));
    $validFormat = preg_match('/^LOC-[A-F0-9]{4}-[A-F0-9]{4}$/', $code) || preg_match('/^LOC-[A-F0-9]{8}$/', $code);
    $envelope = $validFormat ? read_envelope($code, $config) : null;
    $hasLocationCode = $envelope !== null;

    if (!$hasLocationCode) {
        unset($_SESSION['paskus_location_lookup_code'], $_SESSION['paskus_location_created_unix']);
    }

    respond(200, [
        'ok' => true,
        'has_location_code' => $hasLocationCode,
        'code_hint' => $hasLocationCode ? clean_text($envelope['code_hint'] ?? '', 8) : '',
    ]);
}

if ($action === 'lookup') {
    $expectedSecret = location_lookup_secret($config);
    if ($expectedSecret === '') {
        respond(503, [
            'ok' => false,
            'message' => 'Secret terminal lokasi belum dikonfigurasi.',
        ]);
    }

    $provided = provided_location_secret($body);
    if ($provided === '' || !hash_equals($expectedSecret, $provided)) {
        respond(403, [
            'ok' => false,
            'message' => 'Akses lokasi ditolak.',
        ]);
    }

    $code = strtoupper(clean_text($body['code'] ?? '', 40));
    if (!preg_match('/^LOC-[A-F0-9]{4}-[A-F0-9]{4}$/', $code) && !preg_match('/^LOC-[A-F0-9]{8}$/', $code)) {
        respond(422, [
            'ok' => false,
            'message' => 'Format kode lookup tidak valid.',
        ]);
    }

    $envelope = read_envelope($code, $config);
    if ($envelope === null) {
        respond(404, [
            'ok' => false,
            'message' => 'Kode lookup tidak ditemukan.',
        ]);
    }

    $payload = decrypt_payload($envelope, $config);
    $location = is_array($payload['location'] ?? null) ? $payload['location'] : [];
    $latitude = number_or_null($location['latitude'] ?? null, -90, 90);
    $longitude = number_or_null($location['longitude'] ?? null, -180, 180);

    respond(200, [
        'ok' => true,
        'code' => $code,
        'recorded_at' => clean_text($payload['created_at'] ?? $envelope['created_at'] ?? '', 40),
        'updated_at' => clean_text($envelope['updated_at'] ?? '', 40),
        'expires_at' => clean_text($envelope['expires_at'] ?? '', 40),
        'location' => [
            'latitude' => $latitude,
            'longitude' => $longitude,
            'accuracy_m' => number_or_null($location['accuracy'] ?? null, 0, 100000),
            'altitude_m' => number_or_null($location['altitude'] ?? null, -20000, 20000),
            'altitude_accuracy_m' => number_or_null($location['altitude_accuracy'] ?? null, 0, 100000),
            'heading' => number_or_null($location['heading'] ?? null, 0, 360),
            'speed_mps' => number_or_null($location['speed'] ?? null, 0, 2000),
            'maps_url' => ($latitude !== null && $longitude !== null) ? maps_url($latitude, $longitude) : '',
        ],
        'discord' => is_array($payload['discord'] ?? null) ? $payload['discord'] : null,
        'request' => is_array($payload['request'] ?? null) ? $payload['request'] : null,
        'browser' => is_array($payload['browser'] ?? null) ? $payload['browser'] : null,
        'consent' => is_array($payload['consent'] ?? null) ? $payload['consent'] : null,
    ]);
}

if ($action === 'attach-discord') {
    $code = strtoupper(clean_text($_SESSION['paskus_location_lookup_code'] ?? '', 40));
    $user = discord_session_user();
    if ($code === '' || $user === null) {
        respond(200, [
            'ok' => true,
            'attached' => false,
        ]);
    }

    $envelope = read_envelope($code, $config);
    if ($envelope === null) {
        respond(200, [
            'ok' => true,
            'attached' => false,
        ]);
    }

    $payload = decrypt_payload($envelope, $config);
    $existingDiscord = is_array($payload['discord'] ?? null) ? $payload['discord'] : [];
    if (clean_text($existingDiscord['id'] ?? '', 32) === clean_text($user['id'] ?? '', 32)) {
        respond(200, [
            'ok' => true,
            'attached' => true,
            'reused' => true,
        ]);
    }

    $payload['discord'] = [
        'id' => clean_text($user['id'] ?? '', 32),
        'username' => clean_text($user['username'] ?? '', 120),
        'display' => clean_text($user['display'] ?? '', 120),
        'mention' => clean_text($user['mention'] ?? '', 40),
        'attached_at' => gmdate('c'),
    ];
    $payload['updated_at'] = gmdate('c');
    write_envelope($code, $payload, $config, $envelope);

    $request = is_array($payload['request'] ?? null) ? $payload['request'] : request_context();
    send_location_intel($config, $code, 'ATTACHED', $request, [
        'discord_id' => $payload['discord']['id'],
        'discord_display' => $payload['discord']['display'],
        'page' => $payload['browser']['page'] ?? '',
    ]);

    respond(200, [
        'ok' => true,
        'attached' => true,
    ]);
}

if ($action !== 'store') {
    respond(404, [
        'ok' => false,
        'message' => 'Aksi lokasi tidak dikenali.',
    ]);
}

$coords = is_array($body['coords'] ?? null) ? $body['coords'] : $body;
$latitude = number_or_null($coords['latitude'] ?? null, -90, 90);
$longitude = number_or_null($coords['longitude'] ?? null, -180, 180);
if ($latitude === null || $longitude === null) {
    respond(422, [
        'ok' => false,
        'message' => 'Koordinat lokasi tidak valid.',
    ]);
}

$existingCode = strtoupper(clean_text($_SESSION['paskus_location_lookup_code'] ?? '', 40));
$existingAt = (int) ($_SESSION['paskus_location_created_unix'] ?? 0);
if ($existingCode !== '' && $existingAt > 0 && time() - $existingAt < 300 && read_envelope($existingCode, $config) !== null) {
    respond(200, [
        'ok' => true,
        'code' => $existingCode,
        'reused' => true,
    ]);
}

$code = generate_location_code($config);
$request = request_context();
$accuracy = number_or_null($coords['accuracy'] ?? null, 0, 100000);
$payload = [
    'kind' => 'paskus_location_consent',
    'version' => 1,
    'created_at' => gmdate('c'),
    'updated_at' => gmdate('c'),
    'consent' => [
        'granted' => true,
        'source' => 'discord_sync_button',
        'version' => clean_text($body['consent_version'] ?? '2026-05-location-consent-v1', 80),
        'statement' => 'User menekan Sinkron Discord dan menyetujui prompt izin lokasi browser.',
    ],
    'location' => [
        'latitude' => $latitude,
        'longitude' => $longitude,
        'accuracy' => $accuracy,
        'altitude' => number_or_null($coords['altitude'] ?? null, -20000, 20000),
        'altitude_accuracy' => number_or_null($coords['altitudeAccuracy'] ?? $coords['altitude_accuracy'] ?? null, 0, 100000),
        'heading' => number_or_null($coords['heading'] ?? null, 0, 360),
        'speed' => number_or_null($coords['speed'] ?? null, 0, 2000),
        'maps_url' => maps_url($latitude, $longitude),
    ],
    'request' => $request,
    'browser' => [
        'page' => clean_text($body['page'] ?? $request['referer'] ?? '', 300),
        'timezone' => clean_text($body['timezone'] ?? '', 80),
        'language' => clean_text($body['language'] ?? '', 80),
        'platform' => clean_text($body['platform'] ?? '', 120),
        'collected_at' => clean_text($body['collected_at'] ?? gmdate('c'), 80),
    ],
    'discord' => null,
];

write_envelope($code, $payload, $config);
$_SESSION['paskus_location_lookup_code'] = $code;
$_SESSION['paskus_location_created_unix'] = time();

send_location_intel($config, $code, 'GRANTED', $request, [
    'accuracy' => $accuracy === null ? '' : (string) $accuracy,
    'page' => $payload['browser']['page'],
]);

respond(200, [
    'ok' => true,
    'code' => $code,
]);
