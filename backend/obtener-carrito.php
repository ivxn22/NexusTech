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

if (!isset($_GET['id_usuario'])) {
    echo json_encode(["success" => false, "error" => "ID de usuario no proporcionado."]);
    exit;
}

$id_usuario = intval($_GET['id_usuario']);

// Conexión a la base de datos
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

// Obtener productos del carrito con datos de productos
$sql = "SELECT c.id_producto, c.cantidad, p.nombre, p.precio, p.descripcion
        FROM carrito c
        JOIN productos p ON c.id_producto = p.id_producto
        WHERE c.id_usuario = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$result = $stmt->get_result();

$carrito = [];
while ($row = $result->fetch_assoc()) {
    $carrito[] = $row;
}

echo json_encode(["success" => true, "carrito" => $carrito]);

$stmt->close();
$conn->close();
?>
