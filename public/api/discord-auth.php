<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');

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

function respond_json(int $status, array $payload): void
{
    header('Content-Type: application/json; charset=utf-8');
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

function redirect_to(string $target): void
{
    header('Location: ' . $target, true, 302);
    exit;
}

function pti_oauth_callback_url(): string
{
    return 'https://strategic.so791.com/auth/discord/callback';
}

function raw_query_value(string $key, int $maxLength = 2048): string
{
    $value = $_GET[$key] ?? '';
    if (is_array($value)) {
        return '';
    }

    return substr(trim((string) $value), 0, $maxLength);
}

function is_pti_oauth_state(string $state): bool
{
    return str_starts_with($state, 'pti_');
}

function redirect_pti_oauth_callback(string $state): void
{
    $params = ['state' => $state];

    foreach (['code', 'error', 'error_description'] as $key) {
        $value = raw_query_value($key, $key === 'code' ? 2048 : 300);
        if ($value !== '') {
            $params[$key] = $value;
        }
    }

    redirect_to(pti_oauth_callback_url() . '?' . http_build_query($params));
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

function oauth_config(array $config): array
{
    $oauth = $config['discord_oauth'] ?? [];
    return is_array($oauth) ? $oauth : [];
}

function oauth_missing_keys(array $oauth): array
{
    $required = ['client_id', 'client_secret', 'guild_id', 'redirect_uri'];
    return array_values(array_filter($required, static fn ($key) => clean_text($oauth[$key] ?? '') === ''));
}

function allowed_role_ids(array $oauth): array
{
    $roles = $oauth['allowed_role_ids'] ?? [];
    if (!is_array($roles)) {
        return [];
    }

    return array_values(array_filter(array_map(static fn ($role) => clean_text($role, 32), $roles)));
}

function dualisme_watchlist_paths(): array
{
    return [
        dirname(__DIR__, 4) . '/.paskus-recruitment/discord_resimen_watchlist.php',
        dirname(__DIR__, 2) . '/config/discord_resimen_watchlist.php',
        dirname(__DIR__) . '/config/discord_resimen_watchlist.php',
    ];
}

function dualisme_watchlist(): array
{
    $watchlist = [];
    foreach (dualisme_watchlist_paths() as $path) {
        if (is_readable($path)) {
            $loaded = require $path;
            $watchlist = is_array($loaded) ? $loaded : [];
            break;
        }
    }

    $rows = is_array($watchlist['guilds'] ?? null) ? $watchlist['guilds'] : $watchlist;
    $normalized = [];
    foreach ($rows as $row) {
        if (!is_array($row)) {
            continue;
        }

        $guildId = clean_text($row['guild_id'] ?? $row['id'] ?? '', 32);
        if ($guildId === '') {
            continue;
        }

        $normalized[] = [
            'guild_id' => $guildId,
            'name' => clean_text($row['name'] ?? 'Resimen/fraksi terpantau', 120),
            'category' => clean_text($row['category'] ?? 'resimen', 40),
        ];
    }

    return $normalized;
}

function dualisme_default_result(): array
{
    return [
        'detected' => false,
        'guild_ids' => [],
        'guild_names' => [],
        'matches' => [],
        'checked_at' => gmdate('c'),
        'source' => 'discord_oauth_guilds',
    ];
}

function dualisme_detect_from_guilds(array $guilds, array $watchlist): array
{
    $result = dualisme_default_result();
    if (empty($watchlist)) {
        return $result;
    }

    $mapped = [];
    foreach ($watchlist as $item) {
        $guildId = clean_text($item['guild_id'] ?? '', 32);
        if ($guildId !== '') {
            $mapped[$guildId] = $item;
        }
    }

    foreach ($guilds as $guild) {
        if (!is_array($guild)) {
            continue;
        }

        $guildId = clean_text($guild['id'] ?? '', 32);
        if ($guildId === '' || !isset($mapped[$guildId])) {
            continue;
        }

        $match = [
            'guild_id' => $guildId,
            'name' => clean_text($mapped[$guildId]['name'] ?? 'Resimen/fraksi terpantau', 120),
            'category' => clean_text($mapped[$guildId]['category'] ?? 'resimen', 40),
        ];

        $result['matches'][] = $match;
        $result['guild_ids'][] = $match['guild_id'];
        $result['guild_names'][] = $match['name'];
    }

    $result['guild_ids'] = array_values(array_unique($result['guild_ids']));
    $result['guild_names'] = array_values(array_unique($result['guild_names']));
    $result['detected'] = count($result['guild_ids']) > 0;

    return $result;
}

function dualisme_error_log_path(array $config): string
{
    $configured = clean_text($config['dualisme_error_log_path'] ?? '', 512);
    if ($configured !== '') {
        return $configured;
    }

    return dirname(__DIR__, 4) . '/.paskus-recruitment/dualisme-errors.log';
}

function log_dualisme_error(array $config, string $discordId, string $message, array $context = []): void
{
    $path = dualisme_error_log_path($config);
    $dir = dirname($path);
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }

    $safeContext = [];
    foreach ($context as $key => $value) {
        $safeContext[clean_text($key, 80)] = clean_text($value, 300);
    }

    $line = json_encode([
        'time' => gmdate('c'),
        'discord_id' => clean_text($discordId, 32),
        'message' => clean_text($message, 240),
        'context' => $safeContext,
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    if ($line !== false) {
        @file_put_contents($path, $line . PHP_EOL, FILE_APPEND | LOCK_EX);
        @chmod($path, 0600);
    }
}

function user_display_name(array $user): string
{
    $globalName = clean_text($user['global_name'] ?? '', 100);
    if ($globalName !== '') {
        return $globalName;
    }

    $username = clean_text($user['username'] ?? 'Discord User', 100);
    $discriminator = clean_text($user['discriminator'] ?? '', 8);
    if ($discriminator !== '' && $discriminator !== '0') {
        return "{$username}#{$discriminator}";
    }

    return $username;
}

function post_form(string $url, array $fields, string $clientId, string $clientSecret): array
{
    $body = http_build_query($fields);
    $headers = [
        'Content-Type: application/x-www-form-urlencoded',
        'Authorization: Basic ' . base64_encode($clientId . ':' . $clientSecret),
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
    ]);
    $responseBody = (string) curl_exec($ch);
    $error = curl_error($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);

    return [
        'ok' => $error === '' && $status >= 200 && $status < 300,
        'status' => $status,
        'body' => $responseBody,
        'error' => $error,
        'json' => json_decode($responseBody, true),
    ];
}

function get_discord_json(string $url, string $accessToken, int $timeoutSeconds = 15): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_HTTPGET => true,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $accessToken],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => $timeoutSeconds,
    ]);
    $responseBody = (string) curl_exec($ch);
    $error = curl_error($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);

    return [
        'ok' => $error === '' && $status >= 200 && $status < 300,
        'status' => $status,
        'body' => $responseBody,
        'error' => $error,
        'json' => json_decode($responseBody, true),
    ];
}

start_discord_session();

$config = load_config();
$oauth = oauth_config($config);
$missing = oauth_missing_keys($oauth);
$configured = count($missing) === 0;
$action = clean_text($_GET['action'] ?? 'status', 24);

if ($action === 'status') {
    $user = $_SESSION['discord_user'] ?? null;
    $authenticated = is_array($user) && clean_text($user['id'] ?? '') !== '';

    respond_json(200, [
        'ok' => true,
        'configured' => $configured,
        'missing' => $missing,
        'authenticated' => $authenticated,
        'user' => $authenticated ? [
            'id' => clean_text($user['id'] ?? '', 32),
            'username' => clean_text($user['username'] ?? '', 100),
            'display' => clean_text($user['display'] ?? '', 100),
            'mention' => clean_text($user['mention'] ?? '', 40),
        ] : null,
        'guild' => [
            'id' => clean_text($oauth['guild_id'] ?? '', 32),
        ],
        'hasAllowedRole' => $authenticated ? (bool) ($user['has_allowed_role'] ?? false) : false,
        'matchedRoleIds' => $authenticated && is_array($user['matched_role_ids'] ?? null)
            ? array_values($user['matched_role_ids'])
            : [],
        'allowedRoleIds' => allowed_role_ids($oauth),
    ]);
}

if ($action === 'logout') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'] ?? '', $params['secure'], $params['httponly']);
    }
    session_destroy();

    $returnTo = clean_text($_GET['return'] ?? '/', 240);
    redirect_to(str_starts_with($returnTo, '/') ? $returnTo : '/');
}

if ($action === 'reset-discord') {
    unset($_SESSION['discord_user'], $_SESSION['discord_oauth_state'], $_SESSION['discord_oauth_return']);

    respond_json(200, [
        'ok' => true,
        'message' => 'Discord sync lama sudah direset. Silakan sinkron ulang.',
    ]);
}

if ($action === 'login') {
    if (!$configured) {
        respond_json(503, [
            'ok' => false,
            'message' => 'Discord OAuth belum dikonfigurasi.',
            'missing' => $missing,
        ]);
    }

    $returnTo = clean_text($_GET['return'] ?? '/', 240);
    $_SESSION['discord_oauth_state'] = bin2hex(random_bytes(16));
    $_SESSION['discord_oauth_return'] = str_starts_with($returnTo, '/') ? $returnTo : '/';

    $query = http_build_query([
        'response_type' => 'code',
        'client_id' => clean_text($oauth['client_id'] ?? '', 64),
        'scope' => 'identify guilds guilds.members.read',
        'state' => $_SESSION['discord_oauth_state'],
        'redirect_uri' => clean_text($oauth['redirect_uri'] ?? '', 240),
        'prompt' => 'consent',
    ]);

    redirect_to('https://discord.com/oauth2/authorize?' . $query);
}

if ($action !== 'callback') {
    respond_json(404, [
        'ok' => false,
        'message' => 'Aksi Discord auth tidak dikenali.',
    ]);
}

$bridgeState = clean_text($_GET['state'] ?? '', 120);
if ($bridgeState !== '' && is_pti_oauth_state($bridgeState)) {
    redirect_pti_oauth_callback($bridgeState);
}

if (!$configured) {
    respond_json(503, [
        'ok' => false,
        'message' => 'Discord OAuth belum dikonfigurasi.',
        'missing' => $missing,
    ]);
}

$state = clean_text($_GET['state'] ?? '', 80);
$expectedState = clean_text($_SESSION['discord_oauth_state'] ?? '', 80);
if ($state === '' || $expectedState === '' || !hash_equals($expectedState, $state)) {
    respond_json(400, [
        'ok' => false,
        'message' => 'State OAuth tidak valid.',
    ]);
}

$code = clean_text($_GET['code'] ?? '', 512);
if ($code === '') {
    respond_json(400, [
        'ok' => false,
        'message' => 'Discord tidak mengirim authorization code.',
    ]);
}

$tokenResult = post_form(
    'https://discord.com/api/oauth2/token',
    [
        'grant_type' => 'authorization_code',
        'code' => $code,
        'redirect_uri' => clean_text($oauth['redirect_uri'] ?? '', 240),
    ],
    clean_text($oauth['client_id'] ?? '', 64),
    clean_text($oauth['client_secret'] ?? '', 128),
);

if (!$tokenResult['ok'] || !is_array($tokenResult['json'] ?? null)) {
    respond_json(502, [
        'ok' => false,
        'message' => 'Gagal menukar authorization code Discord.',
        'status' => $tokenResult['status'],
    ]);
}

$accessToken = clean_text($tokenResult['json']['access_token'] ?? '', 2048);
if ($accessToken === '') {
    respond_json(502, [
        'ok' => false,
        'message' => 'Token Discord kosong.',
    ]);
}

$userResult = get_discord_json('https://discord.com/api/users/@me', $accessToken);
if (!$userResult['ok'] || !is_array($userResult['json'] ?? null)) {
    respond_json(502, [
        'ok' => false,
        'message' => 'Gagal membaca profil Discord.',
        'status' => $userResult['status'],
    ]);
}

$guildId = clean_text($oauth['guild_id'] ?? '', 32);
$memberResult = get_discord_json("https://discord.com/api/users/@me/guilds/{$guildId}/member", $accessToken);
$member = is_array($memberResult['json'] ?? null) ? $memberResult['json'] : [];
$roles = is_array($member['roles'] ?? null) ? array_values(array_map(static fn ($role) => clean_text($role, 32), $member['roles'])) : [];
$allowed = allowed_role_ids($oauth);
$matched = array_values(array_intersect($roles, $allowed));
$user = $userResult['json'];
$userId = clean_text($user['id'] ?? '', 32);
$display = user_display_name($user);
$dualismeResult = dualisme_default_result();
$guildsResult = get_discord_json('https://discord.com/api/users/@me/guilds', $accessToken, 8);
if ($guildsResult['ok'] && is_array($guildsResult['json'] ?? null)) {
    $dualismeResult = dualisme_detect_from_guilds($guildsResult['json'], dualisme_watchlist());
} else {
    log_dualisme_error($config, $userId, 'Discord guild list request failed', [
        'status' => (string) ($guildsResult['status'] ?? 0),
        'error' => $guildsResult['error'] ?? '',
        'body' => $guildsResult['body'] ?? '',
    ]);
}

$_SESSION['discord_user'] = [
    'id' => $userId,
    'username' => clean_text($user['username'] ?? '', 100),
    'display' => $display,
    'mention' => $userId !== '' ? "<@{$userId}>" : '',
    'roles' => $roles,
    'matched_role_ids' => $matched,
    'has_allowed_role' => count($matched) > 0,
    'guild_member_status' => $memberResult['status'],
    'dualisme' => $dualismeResult,
    'synced_at' => gmdate('c'),
];

unset($_SESSION['discord_oauth_state']);
$returnTo = clean_text($_SESSION['discord_oauth_return'] ?? '/', 240);
unset($_SESSION['discord_oauth_return']);
redirect_to((str_starts_with($returnTo, '/') ? $returnTo : '/') . (str_contains($returnTo, '?') ? '&' : '?') . 'discord_sync=ok');
