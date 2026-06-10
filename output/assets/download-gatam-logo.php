<?php
declare(strict_types=1);

$file = __DIR__ . '/gatam-logo-upscaled-4096.png';
$downloadName = 'gatam-logo-upscaled-4096.png';

if (!is_file($file) || !is_readable($file)) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'File download tidak ditemukan.';
    exit;
}

header('Content-Type: image/png');
header('Content-Disposition: attachment; filename="' . $downloadName . '"');
header('Content-Length: ' . (string) filesize($file));
header('Cache-Control: public, max-age=31536000, immutable');
header('X-Content-Type-Options: nosniff');

readfile($file);
