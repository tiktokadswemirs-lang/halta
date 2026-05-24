<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name'] ?? '');
    $email = htmlspecialchars($_POST['email'] ?? '');
    $phone = htmlspecialchars($_POST['phone'] ?? '');

    // Надо поставитьт сюда E-mail
    $to = "tiktokadswemirs@gmail.com";
    
    $subject = "Новая заявка с сайта";
    $message = "Имя: $name\nEmail: $email\nТелефон: $phone";
    $headers = "From: no-reply@universal-pack.ru\r\n" .
               "Reply-To: $email\r\n" .
               "Content-Type: text/plain; charset=UTF-8\r\n" .
               "X-Mailer: PHP/" . phpversion();

    if (mail($to, $subject, $message, $headers)) {
        echo "<script>alert('Спасибо! Ваша заявка успешно отправлена.'); window.location.href='index.html';</script>";
    } else {
        echo "<script>alert('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.'); window.location.href='index.html';</script>";
    }
} else {
    header("Location: index.html");
    exit();
}
?>
