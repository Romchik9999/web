<?php
// admin/index.php
$file = '../data/leads.json';
$leads = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
if (!is_array($leads)) $leads = [];
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Заявки NordWood</title>
    <style>
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: #f6f4ef;
            color: #1e2b24;
            padding: 40px 20px;
            margin: 0;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        h1 {
            color: #2f4d3e;
            margin-bottom: 24px;
        }
        .card {
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 8px 40px rgba(30, 43, 36, 0.08);
            overflow: hidden;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 16px 20px;
            text-align: left;
            border-bottom: 1px solid #e2ddd4;
        }
        th {
            background: #2f4d3e;
            color: #fff;
            font-weight: 600;
        }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #fbfbf9; }
        .empty {
            padding: 40px;
            text-align: center;
            color: #8a9b8f;
        }
        .badge {
            display: inline-block;
            background: #c79e6b;
            color: #fff;
            padding: 4px 10px;
            border-radius: 50px;
            font-size: 0.8rem;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Входящие заявки</h1>
        <div class="card">
            <?php if (empty($leads)): ?>
                <div class="empty">Пока нет ни одной заявки.</div>
            <?php else: ?>
                <table>
                    <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Имя</th>
                            <th>Телефон</th>
                            <th>Интерес</th>
                            <th>Комментарий</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($leads as $lead): ?>
                            <tr>
                                <td><?= htmlspecialchars($lead['date'] ?? '') ?></td>
                                <td><strong><?= htmlspecialchars($lead['name'] ?? '') ?></strong></td>
                                <td><a style="color: #2f4d3e; font-weight: 600; text-decoration: none;" href="tel:<?= htmlspecialchars($lead['phone'] ?? '') ?>"><?= htmlspecialchars($lead['phone'] ?? '') ?></a></td>
                                <td>
                                    <?php if (!empty($lead['product'])): ?>
                                        <span class="badge"><?= htmlspecialchars($lead['product']) ?></span>
                                    <?php elseif (!empty($lead['type'])): ?>
                                        <span class="badge"><?= htmlspecialchars($lead['type']) ?></span>
                                    <?php else: ?>
                                        —
                                    <?php endif; ?>
                                </td>
                                <td><?= htmlspecialchars($lead['message'] ?? '—') ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
