<?php
// send-mail.php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

// Get the raw POST data
$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON Payload']);
    exit;
}

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$company = trim($data['company'] ?? '');
$challenge = trim($data['challenge'] ?? '');

if (empty($name) || empty($email) || empty($company) || empty($challenge)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Todos los campos son obligatorios']);
    exit;
}

require 'vendor/phpmailer/Exception.php';
require 'vendor/phpmailer/PHPMailer.php';
require 'vendor/phpmailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.titan.email';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'admin@alddea.com';
    $mail->Password   = 'g8LccgL6hy(N43Aw';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Enable implicit TLS encryption (SSL)
    $mail->Port       = 465;

    // Recipients
    $mail->setFrom('admin@alddea.com', 'Sitio Web - Lead');
    $mail->addAddress('admin@alddea.com', 'Administrador');
    $mail->addReplyTo($email, $name);

    // Content
    $mail->isHTML(true);
    $mail->Subject = "Nuevo Lead desde la web: $name ($company)";
    $mail->Body    = "
        <div style='font-family: Arial, sans-serif; color: #333;'>
            <h2 style='color: #a855f7;'>Nuevo contacto desde la web</h2>
            <p><strong>Nombre:</strong> $name</p>
            <p><strong>Correo electrónico:</strong> $email</p>
            <p><strong>Empresa:</strong> $company</p>
            <p><strong>Pilar de Interés (Desafío):</strong> $challenge</p>
            <hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'>
            <p style='font-size: 12px; color: #999;'>Este correo fue generado automáticamente por el formulario de contacto del sitio web.</p>
        </div>
    ";
    $mail->AltBody = "Nuevo contacto desde la web.\nNombre: $name\nCorreo: $email\nEmpresa: $company\nDesafío: $challenge";

    $mail->send();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => "Error al enviar correo: {$mail->ErrorInfo}"]);
}
