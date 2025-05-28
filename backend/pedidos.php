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
header('Content-Type: application/json');

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Conexión fallida: " . $conn->connect_error]);
    exit;
}
$conn->set_charset("utf8mb4");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT 
                p.id_pedido, 
                p.id_usuario,
                p.fecha_pedido, 
                p.total,
                p.estado,
                u.nombre, 
                u.apellidos, 
                u.email, 
                u.direccion, 
                u.rol, 
                u.tlfn, 
                u.localidad
            FROM pedido p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            ORDER BY p.fecha_pedido DESC";

    $result = $conn->query($sql);

    if (!$result) {
        echo json_encode(["success" => false, "error" => "Error en la consulta: " . $conn->error]);
        $conn->close();
        exit;
    }

    $pedidos = [];

    while ($row = $result->fetch_assoc()) {
        $pedidos[] = $row;
    }

    echo json_encode(["success" => true, "pedidos" => $pedidos]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id_pedido']) || !isset($data['estado'])) {
        echo json_encode(["success" => false, "error" => "Datos incompletos."]);
        $conn->close();
        exit;
    }

    $id_pedido = intval($data['id_pedido']);
    $estado = $conn->real_escape_string($data['estado']);

    $sql = "UPDATE pedido SET estado = '$estado' WHERE id_pedido = $id_pedido";
    $result = $conn->query($sql);

    if ($result) {
        echo json_encode(["success" => true, "message" => "Estado actualizado correctamente."]);
    } else {
        echo json_encode(["success" => false, "error" => "Error al actualizar: " . $conn->error]);
    }
}

$conn->close();
?>
