<?php
session_save_path('sessionData');//設定session路徑
session_start();

// 更新購物車
if (isset($_POST['product_id']) && isset($_POST['quantity'])) {
    $product_id = $_POST['product_id'];
    $quantity = $_POST['quantity'];

    // 更新購物車中該產品的數量
    $_SESSION['cart'][$product_id] = $quantity;

    // 返回購物車頁面或其他操作
    header('Location: cart.php');
}
?>
