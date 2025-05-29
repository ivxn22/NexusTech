<?php
header("Access-Control-Allow-Origin: http://nexustech.gal");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dbhost = "qamy010.nexustech.gal";
$dbuser = "qamy010";
$dbpass = "Ivxn231103";
$dbname = "qamy010";
$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
$conn->set_charset("utf8mb4");


$query = "SELECT id_categoria, nombre FROM categorias";
$result = $conn->query($query);

$categorias = [];

while ($row = $result->fetch_assoc()) {
    $categorias[] = $row;
}


echo json_encode($categorias);

$conn->close();
?>
