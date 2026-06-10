<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, max-age=0, s-maxage=0, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow, noarchive');

function structure_json_response(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function structure_clean_text(mixed $value): string
{
    $value = (string) $value;
    $value = preg_replace('/`([^`]+)`/u', '$1', $value) ?? $value;
    $value = preg_replace('/\*\*([^*]+)\*\*/u', '$1', $value) ?? $value;
    $value = preg_replace('/\*([^*]+)\*/u', '$1', $value) ?? $value;
    $value = preg_replace('/\[([^\]]+)\]\([^)]+\)/u', '$1', $value) ?? $value;
    return trim($value);
}

function structure_config_path(): string
{
    return dirname(__DIR__, 4) . '/.paskus-recruitment/config.php';
}

function structure_load_config(): array
{
    $path = structure_config_path();
    if (!is_readable($path)) {
        return [];
    }

    $config = require $path;
    return is_array($config) ? $config : [];
}

function structure_upper(string $value): string
{
    return function_exists('mb_strtoupper') ? mb_strtoupper($value, 'UTF-8') : strtoupper($value);
}

function structure_parse_quoted_strings(string $value): array
{
    preg_match_all('/"((?:\\\\.|[^"\\\\])*)"/u', $value, $matches);
    return array_map(
        static fn (string $item): string => stripcslashes($item),
        $matches[1] ?? [],
    );
}

function structure_parse_from_headings(string $markdown): array
{
    $categories = [];
    $currentIndex = null;
    foreach (preg_split('/\r?\n/', $markdown) ?: [] as $line) {
        if (preg_match('/^###\s+\d+\.\s+(.+?)(?:\s+\((.+)\))?\s*$/u', $line, $match)) {
            $categories[] = [
                'category' => structure_upper(structure_clean_text($match[1])),
                'label' => structure_clean_text($match[2] ?? ''),
                'ranks' => [],
            ];
            $currentIndex = count($categories) - 1;
            continue;
        }

        if (
            $currentIndex !== null
            && preg_match('/^-\s+\*\*([^*]+)\*\*:\s+(.+?)(?:\s+\*\(Insignia:\s*([^)]+)\)\*)?\s*$/u', $line, $match)
        ) {
            $role = preg_replace('/\s*\(Insignia:.+$/iu', '', structure_clean_text($match[2])) ?? structure_clean_text($match[2]);
            $categories[$currentIndex]['ranks'][] = [
                'name' => structure_upper(structure_clean_text($match[1])),
                'role' => $role,
                'insignia' => structure_clean_text($match[3] ?? ''),
                'members' => [],
                'member_count' => 0,
            ];
        }
    }
    return $categories;
}

function structure_parse_markdown(string $markdown): array
{
    $title = 'Struktural SO-791';
    $overview = 'Struktur komando, jenjang pangkat, dan daftar personel aktif SO-791.';

    $categories = [];
    $currentIndex = null;
    foreach (preg_split('/\r?\n/', $markdown) ?: [] as $line) {
        if (preg_match('/category:\s*"([^"]+)"/u', $line, $match)) {
            $categories[] = [
                'category' => structure_upper(structure_clean_text($match[1])),
                'label' => '',
                'ranks' => [],
            ];
            $currentIndex = count($categories) - 1;
            continue;
        }

        if (
            $currentIndex === null
            || !preg_match('/\{\s*name:\s*"([^"]+)"\s*,\s*role:\s*"([^"]+)"/u', $line, $match)
        ) {
            continue;
        }

        $members = [];
        if (preg_match('/members:\s*\[(.*)\]/u', $line, $memberMatch)) {
            $members = structure_parse_quoted_strings($memberMatch[1]);
        }

        $color = '';
        if (preg_match('/color:\s*"([^"]+)"/u', $line, $colorMatch)) {
            $color = $colorMatch[1];
        }

        $categories[$currentIndex]['ranks'][] = [
            'name' => structure_upper(structure_clean_text($match[1])),
            'role' => structure_clean_text($match[2]),
            'color' => $color,
            'members' => $members,
            'member_count' => count($members),
        ];
    }

    $categories = array_values(array_filter(
        $categories,
        static fn (array $category): bool => !empty($category['ranks']),
    ));

    if (empty($categories)) {
        $categories = structure_parse_from_headings($markdown);
    }

    return [
        'title' => $title,
        'overview' => $overview,
        'categories' => $categories,
    ];
}

function structure_member_name(mixed $member): string
{
    if (is_array($member)) {
        foreach (['display', 'name', 'nickname', 'username', 'discord', 'tag'] as $key) {
            $value = structure_clean_text($member[$key] ?? '');
            if ($value !== '') {
                return $value;
            }
        }
        return '';
    }

    return structure_clean_text($member);
}

function structure_sort_order(array $item): int
{
    return filter_var($item['order'] ?? 9999, FILTER_VALIDATE_INT) ?: 9999;
}

function structure_member_count(array $rank, int $membersCount): int
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

function structure_array_is_list(array $value): bool
{
    if (function_exists('array_is_list')) {
        return array_is_list($value);
    }
    if ($value === []) {
        return true;
    }

    return array_keys($value) === range(0, count($value) - 1);
}

function structure_unit_slug(string $value): string
{
    $source = strtolower(structure_clean_text($value));
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
    if (strpos($source, 'sierra') !== false || strpos($source, 'serigala') !== false) {
        return 'serigala';
    }
    if (strpos($source, 'komodo') !== false || strpos($source, 'reguler') !== false || strpos($source, 'regular') !== false) {
        return 'komodo';
    }

    $slug = preg_replace('/[^a-z0-9]+/i', '-', $source) ?? '';
    return trim($slug, '-');
}

function structure_unit_member(mixed $member): mixed
{
    if (is_array($member)) {
        $name = structure_member_name($member);
        if ($name === '') {
            return null;
        }

        $normalized = ['name' => $name];
        $rank = structure_rank_name(structure_clean_text($member['rank'] ?? $member['rank_name'] ?? $member['rankName'] ?? $member['pangkat'] ?? ''));
        if ($rank !== '') {
            $normalized['rank'] = $rank;
        }
        $discordId = structure_clean_text($member['discord_id'] ?? $member['discordId'] ?? $member['id'] ?? '');
        if ($discordId !== '') {
            $normalized['discord_id'] = $discordId;
        }

        return $normalized;
    }

    $name = structure_clean_text($member);
    return $name === '' ? null : $name;
}

function structure_unit_count(array $unit, int $membersCount): int
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

function structure_normalize_units(array $payload): array
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
    if (structure_array_is_list($source)) {
        foreach ($source as $unit) {
            if (is_array($unit)) {
                $entries[] = [
                    structure_clean_text($unit['slug'] ?? $unit['key'] ?? $unit['name'] ?? $unit['title'] ?? $unit['role_name'] ?? $unit['roleName'] ?? ''),
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

        $slug = structure_unit_slug((string) ($key ?: ($unit['slug'] ?? $unit['name'] ?? $unit['title'] ?? $unit['role_name'] ?? $unit['roleName'] ?? '')));
        if ($slug === '') {
            continue;
        }

        $rawMembers = $unit['members']
            ?? $unit['active_members']
            ?? $unit['activeMembers']
            ?? $unit['personnel']
            ?? (structure_array_is_list($unit) ? $unit : []);
        $members = [];
        foreach ((is_array($rawMembers) ? $rawMembers : []) as $member) {
            $normalizedMember = structure_unit_member($member);
            if ($normalizedMember !== null) {
                $members[] = $normalizedMember;
            }
        }

        $normalized[$slug] = [
            'slug' => $slug,
            'name' => structure_clean_text($unit['name'] ?? $unit['title'] ?? $slug),
            'role_id' => structure_clean_text($unit['role_id'] ?? $unit['roleId'] ?? ''),
            'members' => $members,
            'member_count' => structure_unit_count($unit, count($members)),
        ];
    }

    return $normalized;
}

function structure_should_exclude_member(string $categoryName, string $rankName, string $memberName): bool
{
    $categoryName = structure_upper(structure_clean_text($categoryName));
    $rankName = structure_upper(structure_clean_text($rankName));
    $memberName = structure_upper(structure_clean_text($memberName));

    if ($categoryName === 'PERWIRA PERTAMA' && $memberName === 'WEBCAM REGI') {
        return true;
    }

    return $categoryName === 'PERWIRA TINGGI'
        && $rankName === 'MAYOR JENDRAL'
        && strpos($memberName, 'BRIGJEN. GI1') !== false;
}

function structure_category_name(string $categoryName): string
{
    $normalized = structure_upper(structure_clean_text($categoryName));
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

function structure_category_for_rank(string $categoryName, string $rankName): string
{
    $categoryName = structure_category_name($categoryName);
    $rankName = structure_upper(structure_clean_text($rankName));

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

function structure_category_order(string $categoryName, int $fallback): int
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

    return $orders[structure_category_name($categoryName)] ?? $fallback;
}

function structure_rank_name(string $rankName): string
{
    $rankName = structure_upper(structure_clean_text($rankName));
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

function structure_canonical_categories(): array
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

function structure_rank_order(string $rankName, int $fallback = 9999): int
{
    $rankName = structure_rank_name($rankName);
    foreach (structure_canonical_categories() as $category) {
        foreach ($category['ranks'] as $rank) {
            if ($rank['name'] === $rankName) {
                return (int) $rank['order'];
            }
        }
    }

    return $fallback;
}

function structure_apply_canonical_categories(array $normalized): array
{
    foreach (structure_canonical_categories() as $canonicalCategory) {
        $categoryName = $canonicalCategory['category'];
        if (!isset($normalized[$categoryName])) {
            $normalized[$categoryName] = [
                'category' => $categoryName,
                'label' => '',
                'ranks' => [],
                '_order' => (int) $canonicalCategory['order'],
            ];
        }

        $existingRankNames = [];
        foreach ($normalized[$categoryName]['ranks'] as $rank) {
            $existingRankNames[structure_rank_name($rank['name'] ?? '')] = true;
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
                'count_only' => !empty($rank['count_only']),
            ];
        }
    }

    foreach ($normalized as &$category) {
        usort($category['ranks'], static fn (array $a, array $b): int => structure_rank_order($a['name'] ?? '') <=> structure_rank_order($b['name'] ?? ''));
    }
    unset($category);

    return $normalized;
}

function structure_normalize_live_payload(array $payload): array
{
    $units = structure_normalize_units($payload);
    $categories = is_array($payload['categories'] ?? null) ? array_values(array_filter(
        $payload['categories'],
        static fn ($category): bool => is_array($category),
    )) : [];
    $normalized = [];

    usort($categories, static fn (array $a, array $b): int => structure_sort_order($a) <=> structure_sort_order($b));

    foreach ($categories as $category) {
        if (!is_array($category)) {
            continue;
        }

        $categoryName = structure_category_name(structure_clean_text($category['category'] ?? $category['name'] ?? ''));
        $ranks = is_array($category['ranks'] ?? null) ? array_values(array_filter(
            $category['ranks'],
            static fn ($rank): bool => is_array($rank),
        )) : [];
        if ($categoryName === '' || empty($ranks)) {
            continue;
        }

        usort($ranks, static fn (array $a, array $b): int => structure_sort_order($a) <=> structure_sort_order($b));
        foreach ($ranks as $rank) {
            if (!is_array($rank)) {
                continue;
            }

            $rankName = structure_rank_name(structure_clean_text($rank['name'] ?? $rank['rank'] ?? ''));
            if ($rankName === '') {
                continue;
            }

            $targetCategory = structure_category_for_rank($categoryName, $rankName);
            $members = [];
            $removedMembers = 0;
            $rawMembers = is_array($rank['members'] ?? null) ? $rank['members'] : [];
            foreach ($rawMembers as $member) {
                $memberName = structure_member_name($member);
                if ($memberName === '') {
                    continue;
                }

                if (structure_should_exclude_member($targetCategory, $rankName, $memberName)) {
                    $removedMembers++;
                    continue;
                }

                $members[] = $memberName;
            }
            $members = array_values($members);
            $memberCount = structure_member_count($rank, count($members));
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
                    'label' => structure_clean_text($category['label'] ?? ''),
                    'ranks' => [],
                    '_order' => structure_category_order($targetCategory, structure_sort_order($category)),
                ];
            }

            $normalized[$targetCategory]['ranks'][] = [
                'name' => $rankName,
                'role' => $targetCategory === 'SIPIL'
                    ? ''
                    : structure_clean_text($rank['role'] ?? $rank['label'] ?? 'Rank Position'),
                'color' => structure_clean_text($rank['color'] ?? ''),
                'members' => $members,
                'member_count' => $memberCount,
                'count_only' => $countOnly,
            ];
        }
    }

    $normalized = structure_apply_canonical_categories($normalized);
    $normalized = array_values(array_filter($normalized, static fn (array $category): bool => !empty($category['ranks'])));
    usort($normalized, static fn (array $a, array $b): int => ($a['_order'] ?? 9999) <=> ($b['_order'] ?? 9999));
    foreach ($normalized as &$category) {
        unset($category['_order']);
    }
    unset($category);

    $result = [
        'title' => 'Struktural SO-791',
        'overview' => 'Struktur komando, jenjang pangkat, dan daftar personel aktif SO-791.',
        'categories' => $normalized,
    ];
    if (!empty($units)) {
        $result['combat_units'] = $units;
        $result['units'] = $units;
    }

    $revision = structure_clean_text($payload['revision'] ?? '');
    if ($revision === '') {
        $revisionSource = json_encode($normalized, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $revision = hash('sha256', is_string($revisionSource) ? $revisionSource : gmdate('c'));
    }
    $result['revision'] = $revision;

    $updatedAt = structure_clean_text($payload['updated_at'] ?? $payload['updatedAt'] ?? '');
    if ($updatedAt !== '') {
        $result['updated_at'] = $updatedAt;
    }

    return $result;
}

function structure_live_path(array $config): string
{
    $configured = structure_clean_text($config['structure_live_path'] ?? '');
    if ($configured !== '') {
        return $configured;
    }

    return dirname(__DIR__, 4) . '/.paskus-recruitment/structure-live.json';
}

function structure_read_live_payload(array $config): ?array
{
    $path = structure_live_path($config);
    if (!is_file($path) || !is_readable($path)) {
        return null;
    }

    $raw = file_get_contents($path);
    if (!is_string($raw) || trim($raw) === '') {
        return null;
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        return null;
    }

    $payload = structure_normalize_live_payload($decoded);
    if (empty($payload['categories'])) {
        return null;
    }

    $payload['ok'] = true;
    $payload['lastModified'] = gmdate('c', (int) filemtime($path));
    $payload['serverTime'] = gmdate('c');
    return $payload;
}

$config = structure_load_config();
$livePayload = structure_read_live_payload($config);
if (is_array($livePayload)) {
    structure_json_response(200, $livePayload);
}

$candidates = [
    dirname(__DIR__, 2) . '/structure_documentation.md',
    dirname(__DIR__) . '/data/structure_documentation.md',
];

$sourcePath = '';
foreach ($candidates as $candidate) {
    if (is_file($candidate) && is_readable($candidate)) {
        $sourcePath = $candidate;
        break;
    }
}

if ($sourcePath === '') {
    structure_json_response(404, [
        'ok' => false,
        'message' => 'Data struktural belum tersedia.',
    ]);
}

$markdown = file_get_contents($sourcePath);
if (!is_string($markdown) || trim($markdown) === '') {
    structure_json_response(500, [
        'ok' => false,
        'message' => 'Data struktural kosong.',
    ]);
}

$payload = structure_normalize_live_payload(structure_parse_markdown($markdown));
$payload['ok'] = true;
$payload['lastModified'] = gmdate('c', (int) filemtime($sourcePath));

structure_json_response(200, $payload);
