<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true"); 
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
    echo json_encode(["success" => false, "error" => "Conexión fallida"]);
    exit;
}
$conn->set_charset("utf8mb4");

$input = json_decode(file_get_contents("php://input"), true);

$id_usuario = isset($input['id_usuario']) ? intval($input['id_usuario']) : 11;
$carrito = isset($input['carrito']) ? $input['carrito'] : [];
$total = isset($input['total']) ? floatval($input['total']) : 0.0;

if (empty($carrito)) {
    echo json_encode(["success" => false, "error" => "Carrito vacío"]);
    exit;
}

// 1. Insertar en pedidos
$stmt = $conn->prepare("INSERT INTO pedido (id_usuario, fecha_pedido, total) VALUES (?, NOW(), ?)");
$stmt->bind_param("id", $id_usuario, $total);
if (!$stmt->execute()) {
    echo json_encode(["success" => false, "error" => "Error al crear pedido"]);
    exit;
}

$id_pedido = $stmt->insert_id;
$stmt->close();

// 2. Insertar cada producto en detalle_pedido
$stmtDetalle = $conn->prepare("INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)");
foreach ($carrito as $item) {
    $id_producto = $item['id_producto'];
    $cantidad = $item['cantidad'];
    $precio_unitario = $item['precio'];

    $stmtDetalle->bind_param("iiid", $id_pedido, $id_producto, $cantidad, $precio_unitario);
    $stmtDetalle->execute();
}
$stmtDetalle->close();

// 3. Limpiar carrito del usuario si no es invitado
if ($id_usuario !== 11) {
    $stmtDelete = $conn->prepare("DELETE FROM carrito WHERE id_usuario = ?");
    $stmtDelete->bind_param("i", $id_usuario);
    $stmtDelete->execute();
    $stmtDelete->close();
}

// 4. Respuesta final
echo json_encode([
    "success" => true,
    "message" => "Pedido creado con éxito",
    "id_pedido" => $id_pedido
]);

$conn->close();
