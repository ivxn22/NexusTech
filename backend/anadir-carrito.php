<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://nexustech.gal");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["success" => false, "error" => "No estás autenticado (sesión no detectada)."]);
    exit;
}

$id_usuario = $_SESSION['id_usuario'];

// Conectar a la base de datos
$dbhost = "qamy010.nexustech.gal";
$dbuser = "qamy010";
$dbpass = "Ivxn231103";
$dbname = "qamy010";

$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error de conexión a la base de datos: " . $conn->connect_error
    ]);
    exit;
}
$conn->set_charset("utf8mb4");


$data = json_decode(file_get_contents("php://input"), true);
$id_producto = intval($data['id_producto'] ?? 0);
$cantidad = intval($data['cantidad'] ?? 1);

if ($id_producto <= 0 || $cantidad <= 0) {
    echo json_encode(["success" => false, "error" => "Datos inválidos."]);
    exit;
}


$stmt = $conn->prepare("SELECT cantidad FROM carrito WHERE id_usuario = ? AND id_producto = ?");
$stmt->bind_param("ii", $id_usuario, $id_producto);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $nuevaCantidad = $row['cantidad'] + $cantidad;

    $stmtUpdate = $conn->prepare("UPDATE carrito SET cantidad = ? WHERE id_usuario = ? AND id_producto = ?");
    $stmtUpdate->bind_param("iii", $nuevaCantidad, $id_usuario, $id_producto);
    $stmtUpdate->execute();
    $stmtUpdate->close();
} else {
    $stmtInsert = $conn->prepare("INSERT INTO carrito (id_usuario, id_producto, cantidad) VALUES (?, ?, ?)");
    $stmtInsert->bind_param("iii", $id_usuario, $id_producto, $cantidad);
    $stmtInsert->execute();
    $stmtInsert->close();
}

$stmt->close();
$conn->close();

echo json_encode(["success" => true, "message" => "Producto añadido al carrito (backend)."]);
