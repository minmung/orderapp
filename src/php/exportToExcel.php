<?php
require '../../vendor/autoload.php'; // Ensure you have the PhpSpreadsheet library installed


use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="sales_data.xlsx"');
header('Cache-Control: max-age=0');

// 創建新的 Spreadsheet 對象
$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();

// 添加標題
$sheet->setCellValue('A1', 'Order ID');
$sheet->setCellValue('B1', 'Item ID');
$sheet->setCellValue('C1', 'Quantity');
$sheet->setCellValue('D1', 'Total Sales');

// 獲取期別參數
$period = isset($_GET['period']) ? $_GET['period'] : 'today';

$servername = "localhost";
$username = "root";
$password = "030826Ab";
$dbname = "shopcart_database";

// 創建連接
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

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
        $dateCondition = "1 = 1"; // 默認無過濾
        break;
}

// 訂單詳情查詢
$detailsSql = "SELECT order_id, order_item_id, order_item_num FROM order_item_table WHERE $dateCondition";
$detailsResult = $conn->query($detailsSql);

if ($detailsResult === false) {
    die("Query failed: " . $conn->error);
}

// 將結果寫入 Excel
$row = 2; // 從第二行開始填寫數據
while ($data = $detailsResult->fetch_assoc()) {
    $sheet->setCellValue('A' . $row, $data['order_id']);
    $sheet->setCellValue('B' . $row, $data['order_item_id']);
    $sheet->setCellValue('C' . $row, $data['order_item_num']);
    $row++;
}

// 計算總金額
$sumSql = "SELECT SUM(order_total) as order_sales FROM order_table WHERE $dateCondition";
$sumResult = $conn->query($sumSql);

if ($sumResult === false) {
    die("Query failed: " . $conn->error);
}

$sumData = $sumResult->fetch_assoc();
$totalSales = $sumData['order_sales'];

// 添加總金額行
$sheet->setCellValue('A' . $row, 'Total Sales');
$sheet->setCellValue('B' . $row, '');
$sheet->setCellValue('C' . $row, '');
$sheet->setCellValue('D' . $row, $totalSales);

$conn->close();

// 寫入文件
$writer = new Xlsx($spreadsheet);
$writer->save('php://output');
exit;
?>