<?php
// api/save.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Получаем данные, отправленные из JavaScript
$input = json_decode(file_get_contents('php://input'), true);

if ($input && isset($input['name']) && isset($input['phone'])) {
    $file = '../data/leads.json';
    
    // Читаем текущие заявки, если файл уже существует
    $current_data = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    if (!is_array($current_data)) {
        $current_data = [];
    }
    
    // Добавляем дату и время заявки
    $input['date'] = date('d.m.Y H:i:s');
    
    // Добавляем новую заявку в начало списка
    array_unshift($current_data, $input);
    
    // Сохраняем обновленный список обратно в файл
    file_put_contents($file, json_encode($current_data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    
    echo json_encode(['status' => 'success']);
} else {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Некорректные данные']);
}
?>