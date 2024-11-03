<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// 处理预检 OPTIONS 请求
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if ($data === null) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => '无效的 JSON']);
        exit();
    }

    $total = $data['total'] ?? null;
    $cart = $data['cart'] ?? null;

    if (!is_numeric($total) || !is_array($cart)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => '无效的数据']);
        exit();
    }

    $servername = "localhost";
    $username = "root";
    $password = "030826Ab";
    $dbname = "shopcart_database";

    // 创建数据库连接
    $conn = new mysqli($servername, $username, $password, $dbname);

    // 检查连接
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => '数据库连接失败: ' . $conn->connect_error]);
        exit();
    }
    $conn->set_charset("utf8");

    // 准备并绑定插入订单的语句
    $order = [
        'order_time' => date('Y-m-d H:i:s'),
        'status' => '1', // 初始订单状态
        'total_amount' => $total
    ];

    $insert_order_query = "INSERT INTO order_table (order_time, order_total, order_status) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($insert_order_query);
    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => '准备订单语句失败']);
        exit();
    }

    $stmt->bind_param('sii', $order['order_time'], $order['total_amount'], $order['status']);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $order_id = $stmt->insert_id; // 获取新插入的订单ID

        // 插入订单项
        foreach ($cart as $product_name => $quantity) {
            $insert_item_query = "INSERT INTO order_item_table (order_item_id, order_item_num, order_id,order_time) VALUES (?, ?, ?, ?)";
            $stmt = $conn->prepare($insert_item_query);
            if ($stmt === false) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => '准备订单项语句失败']);
                exit();
            }

            $stmt->bind_param('siss', $product_name, $quantity, $order_id,$order['order_time']);
            $stmt->execute();

            if ($stmt->affected_rows <= 0) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => '插入订单项失败']);
                exit();
            }
        }

        echo json_encode(['status' => 'success', 'order_id' => $order_id, 'total' => $total, 'cart' => $cart]);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => '插入订单失败']);
    }

    $stmt->close();
    $conn->close();
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => '方法不允许']);
}
?>
