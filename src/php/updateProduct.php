<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$servername = "localhost";
$username = "root";
$password = "12345";
$dbname = "shopcart_database";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
}
$conn->set_charset("utf8");

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data)) {
    $product_sn = $data['product_sn'];
    $product_name = $data['product_name'];
    $product_price = $data['product_price'];
    $product_category = $data['product_category'];

    $sql = "UPDATE product_table SET product_name=?, product_price=?, product_category=? WHERE product_sn=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssi", $product_name, $product_price, $product_category, $product_sn);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "无效的输入"]);
}

$conn->close();
?>
