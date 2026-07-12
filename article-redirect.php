<?php
// article-redirect.php — поиск статьи по названию

// Получаем название из URL
$title = isset($_GET['title']) ? urldecode($_GET['title']) : '';

if (empty($title)) {
    header('Location: /404.html');
    exit;
}

// Подключаем Firebase
require_once 'vendor/autoload.php';
use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;

// Инициализация Firebase
$serviceAccount = ServiceAccount::fromJsonFile(__DIR__.'/serviceAccountKey.json');
$firebase = (new Factory)
    ->withServiceAccount($serviceAccount)
    ->withDatabaseUri('https://sosial2-440f4-default-rtdb.firebaseio.com')
    ->create();

$db = $firebase->getFirestore();

// Ищем статью по названию
$articles = $db->collection('articles')
    ->where('title', '==', $title)
    ->limit(1)
    ->documents();

$found = false;
foreach ($articles as $article) {
    if ($article->exists()) {
        $found = true;
        $articleId = $article->id();
        // Редирект на статью
        header('Location: /article?id=' . $articleId);
        exit;
    }
}

// Если статья не найдена — 404
if (!$found) {
    header('Location: /404.html');
    exit;
}
?>
