<?php
header('Content-Type: application/json; charset=UTF-8');

function jsonResponse($success, $message, $code = 200) {
    http_response_code($code);
    echo json_encode([
        'success' => $success,
        'message' => $message
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Метод не поддерживается.', 405);
}

$name      = trim(strip_tags($_POST['name']       ?? ''));
$email     = trim(strip_tags($_POST['email']      ?? ''));
$phone     = trim(strip_tags($_POST['phone']      ?? ''));
$phoneIntl = trim(strip_tags($_POST['phone_intl'] ?? ''));

if (empty($name) || empty($email) || empty($phone) || empty($phoneIntl)) {
    jsonResponse(false, 'Пожалуйста, заполните все поля.', 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(false, 'Некорректный адрес email.', 400);
}

$to = 'tiktokadswemirs@gmail.com';

$subject = '=?UTF-8?B?' . base64_encode('Новая заявка с сайта Universal Pack') . '?=';

$body  = "Новая заявка с сайта universal-pack.ru\r\n";
$body .= "=====================================\r\n";
$body .= "Имя:      $name\r\n";
$body .= "Email:    $email\r\n";
$body .= "Телефон:  $phone\r\n";
$body .= "Телефон (межд.): $phoneIntl\r\n";

$from_name = '=?UTF-8?B?' . base64_encode('Сайт Universal Pack') . '?=';

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "From: $from_name <no-reply@universal-pack.ru>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($to, $subject, $body, $headers)) {
    jsonResponse(true, 'Данные успешно отправлены.');
}

error_log("mail() failed: name=$name email=$email phone=$phone");
jsonResponse(false, 'Ошибка при отправке. Свяжитесь с нами: info@universal-pack.ru', 500);
