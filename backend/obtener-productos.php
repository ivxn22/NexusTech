<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://nexustech.gal");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (!isset($_GET['id'])) {
    echo json_encode(["success" => false, "error" => "ID de producto no proporcionado."]);
    exit;
}

$id_producto = intval($_GET['id']);

$dbhost = "qamy010.nexustech.gal";
$dbuser = "qamy010";
$dbpass = "Ivxn231103";
$dbname = "qamy010";

$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Conexión fallida: " . $conn->connect_error]);
    exit;
}
$conn->set_charset("utf8mb4");

$stmt = $conn->prepare("SELECT * FROM productos WHERE id_producto = ?");
$stmt->bind_param("i", $id_producto);
$stmt->execute();
$resultado = $stmt->get_result();
$producto = $resultado->fetch_assoc();
$stmt->close();

if (!$producto) {
    echo json_encode(["success" => false, "error" => "Producto no encontrado."]);
    $conn->close();
    exit;
}


$stmt = $conn->prepare("SELECT ruta FROM url_imagenes WHERE id_producto = ?");
$stmt->bind_param("i", $id_producto);
$stmt->execute();
$resultadoImg = $stmt->get_result();
$imagenes = [];

while ($fila = $resultadoImg->fetch_assoc()) {
    $imagenes[] = $fila['ruta'];
}

$producto['imagenes'] = $imagenes;

echo json_encode(["success" => true, "producto" => $producto]);
$conn->close();
