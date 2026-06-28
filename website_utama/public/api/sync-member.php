<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, max-age=0, s-maxage=0, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-PASKUS-STRUCTURE-SECRET');
    http_response_code(204);
    exit;
}

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
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

// 1. Load Config
$configPath = dirname(__DIR__, 4) . '/.paskus-recruitment/config.php';
if (!is_readable($configPath)) {
    respond(500, ['ok' => false, 'message' => 'Konfigurasi server belum tersedia.']);
}
$config = require $configPath;
if (!is_array($config)) {
    respond(500, ['ok' => false, 'message' => 'Konfigurasi server tidak valid.']);
}

// 2. Auth Secret Verification
$expectedSecret = clean_text($config['structure_sync_secret'] ?? '', 256);
if ($expectedSecret === '') {
    respond(503, ['ok' => false, 'message' => 'Structure sync secret belum dikonfigurasi di server.']);
}

$providedSecret = clean_text($_SERVER['HTTP_X_PASKUS_STRUCTURE_SECRET'] ?? '', 256);
if ($providedSecret === '') {
    $authorization = clean_text($_SERVER['HTTP_AUTHORIZATION'] ?? '', 300);
    if (stripos($authorization, 'Bearer ') === 0) {
        $providedSecret = clean_text(substr($authorization, 7), 256);
    }
}

if ($providedSecret === '' || !hash_equals($expectedSecret, $providedSecret)) {
    respond(401, ['ok' => false, 'message' => 'Sync tidak terotorisasi.']);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'message' => 'Metode tidak diizinkan.']);
}

// 3. Setup SQLite Database
$dbPath = $config['database_path'] ?? (dirname(__DIR__, 4) . '/.paskus-recruitment/paskus.sqlite');
$dbDir = dirname($dbPath);
if (!is_dir($dbDir) && !mkdir($dbDir, 0700, true) && !is_dir($dbDir)) {
    respond(500, ['ok' => false, 'message' => 'Direktori database tidak bisa dibuat.']);
}

try {
    $db = new PDO('sqlite:' . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create members table if not exists
    $db->exec("CREATE TABLE IF NOT EXISTS members (
        discord_id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        display_name TEXT,
        avatar TEXT,
        role TEXT,
        unit TEXT,
        position TEXT,
        status TEXT,
        last_sync TEXT
    )");
} catch (PDOException $e) {
    respond(500, ['ok' => false, 'message' => 'Koneksi database gagal: ' . $e->getMessage()]);
}

// 4. Process Incoming Member Data
$rawBody = file_get_contents('php://input') ?: '';
$data = json_decode($rawBody, true);
if (!is_array($data)) {
    respond(400, ['ok' => false, 'message' => 'Payload JSON tidak valid.']);
}

// Support single member or bulk sync
$membersToSync = isset($data['discord_id']) ? [$data] : $data;

// Define ranks mapping by Discord Role ID
$ranksOrder = [
    '1497982157786845385' => 'MAYOR JENDRAL',
    '1462392165820006451' => 'BRIGADIR JENDRAL',
    '1410219152496525352' => 'KOLONEL',
    '1419238009936810026' => 'LETNAN KOLONEL',
    '1416959579170013254' => 'MAYOR',
    '1410219625052110971' => 'KAPTEN',
    '1410217275818250352' => 'LETNAN SATU',
    '1410972074914218055' => 'LETNAN DUA',
    '1410295302182670386' => 'SERSAN MAYOR',
    '1503315344725639168' => 'SERSAN KEPALA',
    '1418265333080391760' => 'SERSAN SATU',
    '1410219786436087858' => 'SERSAN DUA',
    '1410220425455210528' => 'KOPRAL KEPALA',
    '1424773523720634388' => 'KOPRAL SATU',
    '1416970817023246377' => 'KOPRAL DUA',
    '1422690701212127384' => 'PRAJURIT KEPALA',
    '1410220554979377162' => 'PRAJURIT SATU',
    '1425059818875650058' => 'PRAJURIT DUA'
];

$unitsMapping = [
    '1419932277781172274' => 'gatam',
    '1416209761161973883' => 'sierra',
    '1416629163892412489' => 'bringas',
    '1417280286286417920' => 'sentinel',
    '1417279879807893585' => 'pathfinder',
    '1420406865959059649' => 'toruk',
    '1487498186028486857' => 'komodo'
];

$stmtInsert = $db->prepare("INSERT OR REPLACE INTO members 
    (discord_id, username, display_name, avatar, role, unit, position, status, last_sync) 
    VALUES (:discord_id, :username, :display_name, :avatar, :role, :unit, :position, :status, :last_sync)");

$syncCount = 0;
$now = gmdate('c');

foreach ($membersToSync as $m) {
    $discordId = clean_text($m['discord_id'] ?? '', 80);
    $username = clean_text($m['username'] ?? '', 120);
    
    if ($discordId === '' || $username === '') {
        continue; // Skip invalid record
    }

    $displayName = clean_text($m['display_name'] ?? $m['nickname'] ?? '', 120);
    $avatar = clean_text($m['avatar'] ?? '', 256);
    $roles = is_array($m['roles'] ?? null) ? $m['roles'] : [];
    $rolesStr = implode(', ', array_map('strval', $roles));
    $status = clean_text($m['status'] ?? 'active', 40);

    // Map Roles to Position (Rank) and Unit
    $mappedPosition = 'SIPIL';
    $mappedUnit = '';

    // Check rank
    foreach ($ranksOrder as $roleId => $rankName) {
        if (in_array($roleId, $roles, true)) {
            $mappedPosition = $rankName;
            break;
        }
    }

    // Check unit
    foreach ($unitsMapping as $roleId => $unitSlug) {
        if (in_array($roleId, $roles, true)) {
            $mappedUnit = $unitSlug;
            break;
        }
    }

    $stmtInsert->execute([
        ':discord_id' => $discordId,
        ':username' => $username,
        ':display_name' => $displayName,
        ':avatar' => $avatar,
        ':role' => $rolesStr,
        ':unit' => $mappedUnit,
        ':position' => $mappedPosition,
        ':status' => $status,
        ':last_sync' => $now
    ]);
    
    $syncCount++;
}

// 5. Regenerate structure-live.json
// Read all active members
$stmtActive = $db->query("SELECT * FROM members WHERE status = 'active'");
$allActive = $stmtActive->fetchAll(PDO::FETCH_ASSOC);

// Initialize canonical categories structure
$canonicalCategories = [
    'PERWIRA TINGGI' => [
        'category' => 'PERWIRA TINGGI',
        'label' => 'Jajaran Jenderal Komando',
        'ranks' => [
            'MAYOR JENDRAL' => ['name' => 'MAYOR JENDRAL', 'role' => 'DIVISION GENERAL', 'color' => '#EFBF04', 'members' => [], 'member_count' => 0, 'count_only' => false],
            'BRIGADIR JENDRAL' => ['name' => 'BRIGADIR JENDRAL', 'role' => 'BRIGADE GENERAL', 'color' => '#EFBF04', 'members' => [], 'member_count' => 0, 'count_only' => false]
        ]
    ],
    'PERWIRA MENENGAH' => [
        'category' => 'PERWIRA MENENGAH',
        'label' => 'Komandan Resimen & Batalyon',
        'ranks' => [
            'KOLONEL' => ['name' => 'KOLONEL', 'role' => 'REGIMENT COMMANDER', 'color' => '#d4af37', 'members' => [], 'member_count' => 0, 'count_only' => false],
            'LETNAN KOLONEL' => ['name' => 'LETNAN KOLONEL', 'role' => 'BATTALION COMMANDER', 'color' => '#d4af37', 'members' => [], 'member_count' => 0, 'count_only' => false],
            'MAYOR' => ['name' => 'MAYOR', 'role' => 'BATTALION EXECUTIVE OFFICER', 'color' => '#d4af37', 'members' => [], 'member_count' => 0, 'count_only' => false]
        ]
    ],
    'PERWIRA PERTAMA' => [
        'category' => 'PERWIRA PERTAMA',
        'label' => 'Komandan Kompi & Staf Lapangan',
        'ranks' => [
            'KAPTEN' => ['name' => 'KAPTEN', 'role' => 'COMPANY COMMANDER', 'color' => '#8c9f9e', 'members' => [], 'member_count' => 0, 'count_only' => false],
            'LETNAN SATU' => ['name' => 'LETNAN SATU', 'role' => 'FIELD OFFICER', 'color' => '#8c9f9e', 'members' => [], 'member_count' => 0, 'count_only' => false],
            'LETNAN DUA' => ['name' => 'LETNAN DUA', 'role' => 'JUNIOR OFFICER', 'color' => '#8c9f9e', 'members' => [], 'member_count' => 0, 'count_only' => false]
        ]
    ],
    'BINTARA TINGGI' => [
        'category' => 'BINTARA TINGGI',
        'label' => 'Jajaran NCO Senior',
        'ranks' => [
            'SERSAN MAYOR' => ['name' => 'SERSAN MAYOR', 'role' => 'SENIOR NCO', 'color' => '#8a9a5b', 'members' => [], 'member_count' => 0, 'count_only' => false]
        ]
    ],
    'BINTARA MUDA' => [
        'category' => 'BINTARA MUDA',
        'label' => 'Komandan Squad & Asisten',
        'ranks' => [
            'SERSAN KEPALA' => ['name' => 'SERSAN KEPALA', 'role' => 'PLATOON ASSISTANT', 'color' => '#8a9a5b', 'members' => [], 'member_count' => 0, 'count_only' => false],
            'SERSAN SATU' => ['name' => 'SERSAN SATU', 'role' => 'SENIOR SQUAD LEADER', 'color' => '#8a9a5b', 'members' => [], 'member_count' => 0, 'count_only' => false],
            'SERSAN DUA' => ['name' => 'SERSAN DUA', 'role' => 'SQUAD LEADER', 'color' => '#8a9a5b', 'members' => [], 'member_count' => 0, 'count_only' => false]
        ]
    ],
    'TAMTAMA SENIOR' => [
        'category' => 'TAMTAMA SENIOR',
        'label' => 'Komandan Fireteam',
        'ranks' => [
            'KOPRAL KEPALA' => ['name' => 'KOPRAL KEPALA', 'role' => 'FIRETEAM LEADER', 'color' => '#4a5d4e', 'members' => [], 'member_count' => 0, 'count_only' => false],
            'KOPRAL SATU' => ['name' => 'KOPRAL SATU', 'role' => 'SENIOR ASSISTANT', 'color' => '#4a5d4e', 'members' => [], 'member_count' => 0, 'count_only' => false],
            'KOPRAL DUA' => ['name' => 'KOPRAL DUA', 'role' => 'ASSISTANT TEAM LEADER', 'color' => '#4a5d4e', 'members' => [], 'member_count' => 0, 'count_only' => false]
        ]
    ],
    'TAMTAMA JUNIOR' => [
        'category' => 'TAMTAMA JUNIOR',
        'label' => 'Operator Lapangan',
        'ranks' => [
            'PRAJURIT KEPALA' => ['name' => 'PRAJURIT KEPALA', 'role' => 'SENIOR OPERATOR', 'color' => '#4a5d4e', 'members' => [], 'member_count' => 0, 'count_only' => false],
            'PRAJURIT SATU' => ['name' => 'PRAJURIT SATU', 'role' => 'OPERATOR FIRST CLASS', 'color' => '#4a5d4e', 'members' => [], 'member_count' => 0, 'count_only' => false],
            'PRAJURIT DUA' => ['name' => 'PRAJURIT DUA', 'role' => 'RECRUIT / TRAINEE', 'color' => '#4a5d4e', 'members' => [], 'member_count' => 0, 'count_only' => false]
        ]
    ],
    'SIPIL' => [
        'category' => 'SIPIL',
        'label' => 'Civilians / Members Only',
        'ranks' => [
            'SIPIL' => ['name' => 'SIPIL', 'role' => 'CIVILIAN', 'color' => '#7a7a7a', 'members' => [], 'member_count' => 0, 'count_only' => true]
        ]
    ]
];

$combatUnits = [
    'gatam' => ['slug' => 'gatam', 'name' => 'GATAM', 'members' => [], 'member_count' => 0],
    'bringas' => ['slug' => 'bringas', 'name' => 'BRINGAS', 'members' => [], 'member_count' => 0],
    'sierra' => ['slug' => 'sierra', 'name' => 'SIERRA', 'members' => [], 'member_count' => 0],
    'pathfinder' => ['slug' => 'pathfinder', 'name' => 'PATHFINDER', 'members' => [], 'member_count' => 0],
    'sentinel' => ['slug' => 'sentinel', 'name' => 'SENTINEL', 'members' => [], 'member_count' => 0],
    'toruk' => ['slug' => 'toruk', 'name' => 'TORUK MAKTO', 'members' => [], 'member_count' => 0],
    'komodo' => ['slug' => 'komodo', 'name' => 'KOMODO', 'members' => [], 'member_count' => 0]
];

// Distribute active members to ranks and units
foreach ($allActive as $member) {
    $name = !empty($member['display_name']) ? $member['display_name'] : $member['username'];
    $pos = $member['position'];
    $unit = $member['unit'];

    // Map to rank categories
    $foundCategory = null;
    foreach ($canonicalCategories as $catName => $catData) {
        if (isset($catData['ranks'][$pos])) {
            $foundCategory = $catName;
            break;
        }
    }

    if ($foundCategory !== null) {
        if ($canonicalCategories[$foundCategory]['ranks'][$pos]['count_only']) {
            $canonicalCategories[$foundCategory]['ranks'][$pos]['member_count']++;
        } else {
            $canonicalCategories[$foundCategory]['ranks'][$pos]['members'][] = $name;
            $canonicalCategories[$foundCategory]['ranks'][$pos]['member_count']++;
        }
    } else {
        // Fallback to civilian / sipil
        $canonicalCategories['SIPIL']['ranks']['SIPIL']['member_count']++;
    }

    // Map to combat units
    if ($unit !== '' && isset($combatUnits[$unit])) {
        $roleCode = 'OPERATOR';
        if ($foundCategory !== null) {
            $roleCode = $canonicalCategories[$foundCategory]['ranks'][$pos]['role'];
        }
        
        $combatUnits[$unit]['members'][] = [
            'name' => $name,
            'rank' => $roleCode,
            'discord_id' => $member['discord_id']
        ];
        $combatUnits[$unit]['member_count']++;
    }
}

// Convert categories dictionary to indexed array for structure.php/frontend compatibility
$finalCategories = [];
foreach ($canonicalCategories as $catName => $catData) {
    $ranksArray = array_values($catData['ranks']);
    $finalCategories[] = [
        'category' => $catData['category'],
        'label' => $catData['label'],
        'ranks' => $ranksArray
    ];
}

$payload = [
    'ok' => true,
    'title' => 'Struktural SO-791',
    'overview' => 'Struktur komando, jenjang pangkat, dan daftar personel aktif SO-791.',
    'categories' => $finalCategories,
    'combat_units' => $combatUnits,
    'units' => $combatUnits,
    'updated_at' => $now,
    'revision' => hash('sha256', json_encode($finalCategories) . $now)
];

// Write json structure-live.json
$storagePath = $config['structure_live_path'] ?? (dirname(__DIR__, 4) . '/.paskus-recruitment/structure-live.json');
$json = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$tempPath = $storagePath . '.tmp';

if (file_put_contents($tempPath, $json, LOCK_EX) !== false && rename($tempPath, $storagePath)) {
    @chmod($storagePath, 0600);
    respond(200, [
        'ok' => true,
        'message' => 'Sinkronisasi berhasil.',
        'synced_count' => $syncCount,
        'updated_at' => $now
    ]);
} else {
    @unlink($tempPath);
    respond(500, ['ok' => false, 'message' => 'Gagal menulis berkas cache data.']);
}
