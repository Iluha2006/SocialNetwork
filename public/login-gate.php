<?php
$token = '7f3c5a91e2b84d6f';
$password = 'Social2026';

if (isset($_GET['logout'])) {
    setcookie('authgate', '', time() - 3600, '/');
    $loggedOut = true;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
    if (hash_equals($password, $_POST['password'])) {
        setcookie('authgate', $token, [
            'expires' => 0,
            'path' => '/',
            'secure' => false,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        header('Location: /');
        exit;
    }
    $error = 'Неверный пароль';
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Вход на сайт</title>
<style>
 body { font-family: system-ui, -apple-system, sans-serif; background:#f3f4f6; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; }
 .card { background:#fff; padding:32px; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,.1); width:320px; }
 h1 { font-size:20px; margin:0 0 20px; color:#111827; }
 input { width:100%; box-sizing:border-box; padding:10px 12px; margin-bottom:12px; border:1px solid #d1d5db; border-radius:8px; font-size:15px; }
 input:focus { outline:none; border-color:#2563eb; }
 button { width:100%; padding:10px; background:#2563eb; color:#fff; border:0; border-radius:8px; cursor:pointer; font-size:15px; }
 button:hover { background:#1d4ed8; }
 .error { color:#dc2626; font-size:14px; margin:0 0 12px; }
 .ok { color:#16a34a; font-size:14px; margin:0 0 12px; }
</style>
</head>
<body>
  <div class="card">
    <h1>Доступ к сайту</h1>
    <?php if (!empty($loggedOut)): ?><p class="ok">Вы вышли из системы</p><?php endif; ?>
    <form method="post">
      <input type="password" name="password" placeholder="Введите пароль" required autofocus>
      <button type="submit">Войти</button>
    </form>
    <?php if (!empty($error)): ?><p class="error"><?= htmlspecialchars($error) ?></p><?php endif; ?>
  </div>
</body>
</html>
