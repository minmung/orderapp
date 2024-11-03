<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "030826Ab";
$dbname = "shopcart_database";

// 建立連接
$conn = new mysqli($servername, $username, $password, $dbname);

// 檢查連接
if ($conn->connect_error) {
    die(json_encode(['error' => '連接失敗: ' . $conn->connect_error]));
}

$period = isset($_GET['period']) ? $_GET['period'] : 'today';
$dateCondition = '';

switch ($period) {
    case 'today':
        $dateCondition = "DATE(order_time) = CURDATE()";
        break;
    case 'week':
        $dateCondition = "YEARWEEK(order_time, 1) = YEARWEEK(CURDATE(), 1)";
        break;
    case 'month':
        $dateCondition = "MONTH(order_time) = MONTH(CURDATE()) AND YEAR(order_time) = YEAR(CURDATE())";
        break;
    default:
        $dateCondition = "1 = 1"; // Default to no filtering
        break;
}

// 營業額查詢
$salesSql = "SELECT SUM(order_total) as order_sales FROM order_table WHERE $dateCondition";
$salesResult = $conn->query($salesSql);
$salesData = $salesResult->fetch_assoc();

// 訂單詳情查詢
$detailsSql = "SELECT order_id, order_item_id, order_item_num FROM order_item_table WHERE $dateCondition";
$detailsResult = $conn->query($detailsSql);
$orderDetails = [];

while ($row = $detailsResult->fetch_assoc()) {
    $orderDetails[] = $row;
}

$response = [
    'order_sales' => $salesData['order_sales'],
    'order_details' => $orderDetails
];

echo json_encode($response);

$conn->close();
?>
