<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, max-age=0, s-maxage=0, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow, noarchive');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-PASKUS-STRUCTURE-SECRET');
    http_response_code(204);
    exit;
}

function sync_response(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function sync_clean_text(mixed $value, int $maxLength = 160): string
{
    $text = trim((string) $value);
    $text = preg_replace('/[\x00-\x1F\x7F]/u', ' ', $text) ?? '';
    $text = preg_replace('/\s+/u', ' ', $text) ?? '';

    if (function_exists('mb_substr')) {
        return mb_substr($text, 0, $maxLength);
    }

    return substr($text, 0, $maxLength);
}

function sync_upper(string $value): string
{
    return function_exists('mb_strtoupper') ? mb_strtoupper($value, 'UTF-8') : strtoupper($value);
}

function sync_load_config(): array
{
    $path = dirname(__DIR__, 4) . '/.paskus-recruitment/config.php';
    if (!is_readable($path)) {
        return [];
    }

    $config = require $path;
    return is_array($config) ? $config : [];
}

function sync_secret(array $config): string
{
    $secret = sync_clean_text($config['structure_sync_secret'] ?? '', 256);
    if ($secret !== '') {
        return $secret;
    }

    return sync_clean_text(getenv('PASKUS_STRUCTURE_SYNC_SECRET') ?: '', 256);
}

function sync_provided_secret(): string
{
    $header = sync_clean_text($_SERVER['HTTP_X_PASKUS_STRUCTURE_SECRET'] ?? '', 256);
    if ($header !== '') {
        return $header;
    }

    $authorization = sync_clean_text($_SERVER['HTTP_AUTHORIZATION'] ?? '', 300);
    if (stripos($authorization, 'Bearer ') === 0) {
        return sync_clean_text(substr($authorization, 7), 256);
    }

    return '';
}

function sync_member_name(mixed $member): string
{
    if (is_array($member)) {
        foreach (['display', 'name', 'nickname', 'username', 'discord', 'tag'] as $key) {
            $value = sync_clean_text($member[$key] ?? '', 120);
            if ($value !== '') {
                return $value;
            }
        }
        return '';
    }

    return sync_clean_text($member, 120);
}

function sync_order(array $item): int
{
    return filter_var($item['order'] ?? 9999, FILTER_VALIDATE_INT) ?: 9999;
}

function sync_member_count(array $rank, int $membersCount): int
{
    $rawCount = $rank['member_count']
        ?? $rank['memberCount']
        ?? $rank['members_count']
        ?? $rank['personnel_count']
        ?? $rank['personil_count']
        ?? $rank['count']
        ?? null;
    $parsed = filter_var($rawCount, FILTER_VALIDATE_INT);
    if ($parsed === false || $parsed < 0) {
        $parsed = 0;
    }

    return max($membersCount, $parsed);
}

function sync_array_is_list(array $value): bool
{
    if (function_exists('array_is_list')) {
        return array_is_list($value);
    }
    if ($value === []) {
        return true;
    }

    return array_keys($value) === range(0, count($value) - 1);
}

function sync_unit_slug(string $value): string
{
    $source = strtolower(sync_clean_text($value, 120));
    if (strpos($source, 'gatam') !== false || strpos($source, 'garuda') !== false) {
        return 'gatam';
    }
    if (strpos($source, 'bringas') !== false || strpos($source, 'beringas') !== false) {
        return 'bringas';
    }
    if (strpos($source, 'toruk') !== false || strpos($source, 'sky') !== false) {
        return 'toruk';
    }
    if (strpos($source, 'pathfinder') !== false || strpos($source, 'ranger') !== false) {
        return 'pathfinder';
    }
    if (strpos($source, 'sentinel') !== false || strpos($source, 'medic') !== false) {
        return 'sentinel';
    }
    if (strpos($source, 'sierra') !== false) {
        return 'sierra';
    }
    if (strpos($source, 'komodo') !== false || strpos($source, 'reguler') !== false || strpos($source, 'regular') !== false) {
        return 'komodo';
    }

    $slug = preg_replace('/[^a-z0-9]+/i', '-', $source) ?? '';
    return trim($slug, '-');
}

function sync_unit_member(mixed $member): mixed
{
    if (is_array($member)) {
        $name = sync_member_name($member);
        if ($name === '') {
            return null;
        }

        $normalized = ['name' => $name];
        $rank = sync_rank_name(sync_clean_text($member['rank'] ?? $member['rank_name'] ?? $member['rankName'] ?? $member['pangkat'] ?? '', 80));
        if ($rank !== '') {
            $normalized['rank'] = $rank;
        }
        $discordId = sync_clean_text($member['discord_id'] ?? $member['discordId'] ?? $member['id'] ?? '', 80);
        if ($discordId !== '') {
            $normalized['discord_id'] = $discordId;
        }

        return $normalized;
    }

    $name = sync_clean_text($member, 120);
    return $name === '' ? null : $name;
}

function sync_unit_count(array $unit, int $membersCount): int
{
    $rawCount = $unit['member_count']
        ?? $unit['memberCount']
        ?? $unit['active_count']
        ?? $unit['activeCount']
        ?? $unit['count']
        ?? null;
    $parsed = filter_var($rawCount, FILTER_VALIDATE_INT);
    if ($parsed === false || $parsed < 0) {
        $parsed = 0;
    }

    return max($membersCount, $parsed);
}

function sync_normalize_units(array $payload): array
{
    $source = $payload['combat_units']
        ?? $payload['combatUnits']
        ?? $payload['unit_members']
        ?? $payload['unitMembers']
        ?? $payload['units']
        ?? [];
    if (!is_array($source)) {
        return [];
    }

    $entries = [];
    if (sync_array_is_list($source)) {
        foreach ($source as $unit) {
            if (is_array($unit)) {
                $entries[] = [
                    sync_clean_text($unit['slug'] ?? $unit['key'] ?? $unit['name'] ?? $unit['title'] ?? $unit['role_name'] ?? $unit['roleName'] ?? '', 120),
                    $unit,
                ];
            }
        }
    } else {
        foreach ($source as $key => $unit) {
            $entries[] = [$key, $unit];
        }
    }

    $normalized = [];
    foreach ($entries as [$key, $unit]) {
        if (!is_array($unit)) {
            continue;
        }

        $slug = sync_unit_slug((string) ($key ?: ($unit['slug'] ?? $unit['name'] ?? $unit['title'] ?? $unit['role_name'] ?? $unit['roleName'] ?? '')));
        if ($slug === '') {
            continue;
        }

        $rawMembers = $unit['members']
            ?? $unit['active_members']
            ?? $unit['activeMembers']
            ?? $unit['personnel']
            ?? (sync_array_is_list($unit) ? $unit : []);
        $members = [];
        foreach ((is_array($rawMembers) ? $rawMembers : []) as $member) {
            $normalizedMember = sync_unit_member($member);
            if ($normalizedMember !== null) {
                $members[] = $normalizedMember;
            }
        }

        $unitName = sync_clean_text($unit['name'] ?? $unit['title'] ?? $slug, 120);
        if ($slug === 'sierra') {
            $unitName = 'SIERRA';
        }

        $normalized[$slug] = [
            'slug' => $slug,
            'name' => $unitName,
            'role_id' => sync_clean_text($unit['role_id'] ?? $unit['roleId'] ?? '', 80),
            'members' => $members,
            'member_count' => sync_unit_count($unit, count($members)),
        ];
    }

    return $normalized;
}

function sync_should_exclude_member(string $categoryName, string $rankName, string $memberName): bool
{
    $categoryName = sync_upper(sync_clean_text($categoryName, 80));
    $rankName = sync_upper(sync_clean_text($rankName, 80));
    $memberName = sync_upper(sync_clean_text($memberName, 120));

    if ($categoryName === 'PERWIRA PERTAMA' && $memberName === 'WEBCAM REGI') {
        return true;
    }

    return $categoryName === 'PERWIRA TINGGI'
        && $rankName === 'MAYOR JENDRAL'
        && strpos($memberName, 'BRIGJEN. GI1') !== false;
}

function sync_category_name(string $categoryName): string
{
    $normalized = sync_upper(sync_clean_text($categoryName, 80));
    if (
        $normalized === 'SIPIL'
        || $normalized === 'CIVIL'
        || $normalized === 'CIVILIAN'
        || strpos($normalized, 'SIPIL') !== false
        || strpos($normalized, 'CIVILIAN') !== false
    ) {
        return 'SIPIL';
    }
    if ($normalized === 'BINTARA') {
        return 'BINTARA MUDA';
    }
    if ($normalized === 'TAMTAMA MUDA') {
        return 'TAMTAMA JUNIOR';
    }

    return $normalized;
}

function sync_category_for_rank(string $categoryName, string $rankName): string
{
    $categoryName = sync_category_name($categoryName);
    $rankName = sync_upper(sync_clean_text($rankName, 80));

    if (
        $categoryName === 'SIPIL'
        || $rankName === 'SIPIL'
        || $rankName === 'CIVIL'
        || $rankName === 'CIVILIAN'
        || strpos($rankName, 'SIPIL') !== false
        || strpos($rankName, 'CIVILIAN') !== false
    ) {
        return 'SIPIL';
    }

    if (strpos($rankName, 'SERSAN') !== false) {
        return $rankName === 'SERSAN MAYOR' ? 'BINTARA TINGGI' : 'BINTARA MUDA';
    }

    if ($categoryName === 'TAMTAMA') {
        if (strpos($rankName, 'KOPRAL') !== false) {
            return 'TAMTAMA SENIOR';
        }
        if (strpos($rankName, 'PRAJURIT') !== false || $rankName === 'PRADA') {
            return 'TAMTAMA JUNIOR';
        }
    }

    return $categoryName;
}

function sync_category_order(string $categoryName, int $fallback): int
{
    $orders = [
        'PERWIRA TINGGI' => 1,
        'PERWIRA MENENGAH' => 2,
        'PERWIRA PERTAMA' => 3,
        'BINTARA TINGGI' => 4,
        'BINTARA MUDA' => 5,
        'TAMTAMA SENIOR' => 6,
        'TAMTAMA JUNIOR' => 7,
        'SIPIL' => 8,
    ];

    return $orders[sync_category_name($categoryName)] ?? $fallback;
}

function sync_rank_name(string $rankName): string
{
    $rankName = sync_upper(sync_clean_text($rankName, 80));
    if ($rankName === 'PRADA') {
        return 'PRAJURIT DUA';
    }
    if (
        $rankName === 'CIVIL'
        || $rankName === 'CIVILIAN'
        || $rankName === 'SIPIL'
        || strpos($rankName, 'SIPIL') !== false
        || strpos($rankName, 'CIVILIAN') !== false
    ) {
        return 'SIPIL';
    }

    return $rankName;
}

function sync_canonical_categories(): array
{
    return [
        [
            'category' => 'PERWIRA TINGGI',
            'order' => 1,
            'ranks' => [
                ['name' => 'MAYOR JENDRAL', 'role' => 'DIVISION GENERAL', 'order' => 1],
                ['name' => 'BRIGADIR JENDRAL', 'role' => 'BRIGADE GENERAL', 'order' => 2],
            ],
        ],
        [
            'category' => 'PERWIRA MENENGAH',
            'order' => 2,
            'ranks' => [
                ['name' => 'KOLONEL', 'role' => 'REGIMENT COMMANDER', 'order' => 1],
                ['name' => 'LETNAN KOLONEL', 'role' => 'BATTALION COMMANDER', 'order' => 2],
                ['name' => 'MAYOR', 'role' => 'BATTALION EXECUTIVE OFFICER', 'order' => 3],
            ],
        ],
        [
            'category' => 'PERWIRA PERTAMA',
            'order' => 3,
            'ranks' => [
                ['name' => 'KAPTEN', 'role' => 'COMPANY COMMANDER', 'order' => 1],
                ['name' => 'LETNAN SATU', 'role' => 'FIELD OFFICER', 'order' => 2],
                ['name' => 'LETNAN DUA', 'role' => 'JUNIOR OFFICER', 'order' => 3],
            ],
        ],
        [
            'category' => 'BINTARA TINGGI',
            'order' => 4,
            'ranks' => [
                ['name' => 'SERSAN MAYOR', 'role' => 'SENIOR NCO', 'order' => 1],
            ],
        ],
        [
            'category' => 'BINTARA MUDA',
            'order' => 5,
            'ranks' => [
                ['name' => 'SERSAN KEPALA', 'role' => 'PLATOON ASSISTANT', 'order' => 1],
                ['name' => 'SERSAN SATU', 'role' => 'SENIOR SQUAD LEADER', 'order' => 2],
                ['name' => 'SERSAN DUA', 'role' => 'SQUAD LEADER', 'order' => 3],
            ],
        ],
        [
            'category' => 'TAMTAMA SENIOR',
            'order' => 6,
            'ranks' => [
                ['name' => 'KOPRAL KEPALA', 'role' => 'FIRETEAM LEADER', 'order' => 1],
                ['name' => 'KOPRAL SATU', 'role' => 'SENIOR ASSISTANT', 'order' => 2],
                ['name' => 'KOPRAL DUA', 'role' => 'ASSISTANT TEAM LEADER', 'order' => 3],
            ],
        ],
        [
            'category' => 'TAMTAMA JUNIOR',
            'order' => 7,
            'ranks' => [
                ['name' => 'PRAJURIT KEPALA', 'role' => 'SENIOR OPERATOR', 'order' => 1],
                ['name' => 'PRAJURIT SATU', 'role' => 'OPERATOR FIRST CLASS', 'order' => 2],
                ['name' => 'PRAJURIT DUA', 'role' => 'RECRUIT / TRAINEE', 'order' => 3],
            ],
        ],
        [
            'category' => 'SIPIL',
            'order' => 8,
            'ranks' => [
                ['name' => 'SIPIL', 'role' => '', 'order' => 1, 'count_only' => true],
            ],
        ],
    ];
}

function sync_rank_order(string $rankName, int $fallback = 9999): int
{
    $rankName = sync_rank_name($rankName);
    foreach (sync_canonical_categories() as $category) {
        foreach ($category['ranks'] as $rank) {
            if ($rank['name'] === $rankName) {
                return (int) $rank['order'];
            }
        }
    }

    return $fallback;
}

function sync_apply_canonical_categories(array $normalized): array
{
    foreach (sync_canonical_categories() as $canonicalCategory) {
        $categoryName = $canonicalCategory['category'];
        if (!isset($normalized[$categoryName])) {
            $normalized[$categoryName] = [
                'category' => $categoryName,
                'label' => '',
                'ranks' => [],
                'order' => (int) $canonicalCategory['order'],
            ];
        }

        $existingRankNames = [];
        foreach ($normalized[$categoryName]['ranks'] as $rank) {
            $existingRankNames[sync_rank_name($rank['name'] ?? '')] = true;
        }

        foreach ($canonicalCategory['ranks'] as $rank) {
            if (isset($existingRankNames[$rank['name']])) {
                continue;
            }

            $normalized[$categoryName]['ranks'][] = [
                'name' => $rank['name'],
                'role' => $rank['role'],
                'color' => '',
                'members' => [],
                'member_count' => 0,
                'order' => (int) $rank['order'],
                'count_only' => !empty($rank['count_only']),
            ];
        }
    }

    foreach ($normalized as &$category) {
        usort($category['ranks'], static fn (array $a, array $b): int => sync_rank_order($a['name'] ?? '') <=> sync_rank_order($b['name'] ?? ''));
    }
    unset($category);

    return $normalized;
}

function sync_normalize_payload(array $payload): array
{
    $units = sync_normalize_units($payload);
    $categories = is_array($payload['categories'] ?? null) ? array_values(array_filter(
        $payload['categories'],
        static fn ($category): bool => is_array($category),
    )) : [];

    usort($categories, static fn (array $a, array $b): int => sync_order($a) <=> sync_order($b));
    $normalized = [];

    foreach ($categories as $category) {
        $categoryName = sync_category_name(sync_clean_text($category['category'] ?? $category['name'] ?? '', 80));
        $ranks = is_array($category['ranks'] ?? null) ? array_values(array_filter(
            $category['ranks'],
            static fn ($rank): bool => is_array($rank),
        )) : [];
        if ($categoryName === '' || empty($ranks)) {
            continue;
        }

        usort($ranks, static fn (array $a, array $b): int => sync_order($a) <=> sync_order($b));
        foreach ($ranks as $rank) {
            $rankName = sync_rank_name(sync_clean_text($rank['name'] ?? $rank['rank'] ?? '', 80));
            if ($rankName === '') {
                continue;
            }

            $targetCategory = sync_category_for_rank($categoryName, $rankName);
            $members = [];
            $removedMembers = 0;
            foreach ((is_array($rank['members'] ?? null) ? $rank['members'] : []) as $member) {
                $memberName = sync_member_name($member);
                if ($memberName === '') {
                    continue;
                }

                if (sync_should_exclude_member($targetCategory, $rankName, $memberName)) {
                    $removedMembers++;
                    continue;
                }

                $members[] = $memberName;
            }
            $members = array_values($members);
            $memberCount = sync_member_count($rank, count($members));
            if ($removedMembers > 0) {
                $memberCount = max(count($members), $memberCount - $removedMembers);
            }
            $countOnly = $targetCategory === 'SIPIL'
                || !empty($rank['count_only'] ?? null)
                || !empty($rank['countOnly'] ?? null)
                || !empty($rank['hide_members'] ?? null)
                || !empty($rank['hideMembers'] ?? null);
            if ($countOnly) {
                $members = [];
            }

            if (!isset($normalized[$targetCategory])) {
                $normalized[$targetCategory] = [
                    'category' => $targetCategory,
                    'label' => sync_clean_text($category['label'] ?? '', 120),
                    'ranks' => [],
                    'order' => sync_category_order($targetCategory, sync_order($category)),
                ];
            }

            $normalized[$targetCategory]['ranks'][] = [
                'name' => $rankName,
                'role' => $targetCategory === 'SIPIL'
                    ? ''
                    : sync_clean_text($rank['role'] ?? $rank['label'] ?? 'Rank Position', 120),
                'color' => sync_clean_text($rank['color'] ?? '', 160),
                'members' => $members,
                'member_count' => $memberCount,
                'order' => sync_order($rank),
                'count_only' => $countOnly,
            ];
        }
    }

    $normalized = sync_apply_canonical_categories($normalized);
    $normalized = array_values(array_filter($normalized, static fn (array $category): bool => !empty($category['ranks'])));
    usort($normalized, static fn (array $a, array $b): int => sync_order($a) <=> sync_order($b));

    $result = [
        'title' => 'Struktural SO-791',
        'overview' => 'Struktur komando, jenjang pangkat, dan daftar personel aktif SO-791.',
        'categories' => $normalized,
        'updated_at' => gmdate('c'),
    ];
    if (!empty($units)) {
        $result['combat_units'] = $units;
        $result['units'] = $units;
    }

    return $result;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sync_response(405, [
        'ok' => false,
        'message' => 'Metode tidak diizinkan.',
    ]);
}

$config = sync_load_config();
$expectedSecret = sync_secret($config);
if ($expectedSecret === '') {
    sync_response(503, [
        'ok' => false,
        'message' => 'Structure sync secret belum dikonfigurasi.',
    ]);
}

$providedSecret = sync_provided_secret();
if ($providedSecret === '' || !hash_equals($expectedSecret, $providedSecret)) {
    sync_response(401, [
        'ok' => false,
        'message' => 'Structure sync tidak terotorisasi.',
    ]);
}

$rawBody = file_get_contents('php://input') ?: '';
if (strlen($rawBody) > 524288) {
    sync_response(413, [
        'ok' => false,
        'message' => 'Payload struktur terlalu besar.',
    ]);
}

$decoded = json_decode($rawBody, true);
if (!is_array($decoded)) {
    sync_response(400, [
        'ok' => false,
        'message' => 'Payload JSON tidak valid.',
    ]);
}

$payload = sync_normalize_payload($decoded);
if (empty($payload['categories'])) {
    sync_response(422, [
        'ok' => false,
        'message' => 'Payload tidak berisi kategori dan pangkat yang valid.',
    ]);
}

$storagePath = sync_clean_text(
    $config['structure_live_path'] ?? (dirname(__DIR__, 4) . '/.paskus-recruitment/structure-live.json'),
    400,
);
$storageDir = dirname($storagePath);
if (!is_dir($storageDir) && !mkdir($storageDir, 0700, true) && !is_dir($storageDir)) {
    sync_response(500, [
        'ok' => false,
        'message' => 'Folder structure live tidak bisa dibuat.',
    ]);
}

$payload['revision'] = hash('sha256', json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: gmdate('c'));
$json = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($json === false) {
    sync_response(500, [
        'ok' => false,
        'message' => 'Payload struktur tidak bisa dikodekan.',
    ]);
}

$tempPath = $storagePath . '.tmp';
if (file_put_contents($tempPath, $json, LOCK_EX) === false || !rename($tempPath, $storagePath)) {
    @unlink($tempPath);
    sync_response(500, [
        'ok' => false,
        'message' => 'Data struktur live gagal disimpan.',
    ]);
}

@chmod($storagePath, 0600);
@touch($storagePath);
clearstatcache(true, $storagePath);

sync_response(200, [
    'ok' => true,
    'message' => 'Data struktur live berhasil diperbarui.',
    'categories' => count($payload['categories']),
    'ranks' => array_sum(array_map(static fn (array $category): int => count($category['ranks']), $payload['categories'])),
    'members' => array_sum(array_map(
        static fn (array $category): int => array_sum(array_map(static fn (array $rank): int => max((int) ($rank['member_count'] ?? 0), count($rank['members'])), $category['ranks'])),
        $payload['categories'],
    )),
    'revision' => $payload['revision'],
    'updated_at' => $payload['updated_at'],
]);
