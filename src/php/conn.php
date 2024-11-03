<?php
/**database connect**/
$mysql_url="localhost";//資料庫server名稱
$mysql_database=" shopcart_database";//資料庫名稱
$mysql_username="root";//資料庫使用者ID
$mysql_password="030826Ab";//資料庫使用者pass
$link=mysqli_connect($mysql_url,$mysql_username,$mysql_password,$mysql_database)or die("資料庫連結失敗");//連結資料庫



?>