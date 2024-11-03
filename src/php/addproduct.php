<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// 後續的數據處理邏輯
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "030826Ab";
$dbname = "shopcart_database";

// 建立連接
$conn = new mysqli($servername, $username, $password, $dbname);

// 檢查連接
if ($conn->connect_error) {
    die("連接失敗: " . $conn->connect_error);
}

// 獲取POST數據
$data = json_decode(file_get_contents('php://input'), true);
$productName = $data['productName'];
$price = $data['price'];
$category = $data['product_category'];

// 插入數據
$sql = "INSERT INTO product_table (product_name, product_price, product_show, product_category) VALUES ('$productName', '$price','1','$category')";

if ($conn->query($sql) === TRUE) {
  echo json_encode(["message" => "新記錄插入成功"]);
} else {
  echo json_encode(["message" => "錯誤: " . $sql . "<br>" . $conn->error]);
}

$conn->close();
?>
