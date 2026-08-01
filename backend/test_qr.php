<?php

require_once __DIR__ . '/vendor/autoload.php';

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

$qrCode = new QrCode('Hello EventEase!');
$qrCode->setSize(300);
$qrCode->setMargin(10);

$writer = new PngWriter();

$result = $writer->write($qrCode);

$result->saveToFile(
    __DIR__ . '/uploads/qr/test.png'
);

echo "QR Code Generated Successfully!";