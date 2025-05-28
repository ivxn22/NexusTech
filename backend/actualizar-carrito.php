<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://nexustech.gal");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "OPTIONS request allowed."]);
    exit;
}
header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(["success" => false, "error" => "No se pudo decodificar JSON."]); exit;
}

if (!isset($data['id_usuario'], $data['id_producto'], $data['cantidad'])) {
    echo json_encode(["success" => false, "error" => "Datos incompletos."]); exit;
}

$id_usuario = intval($data['id_usuario']);
$id_producto = intval($data['id_producto']);
$cantidad = intval($data['cantidad']);

// Conexión a la base de datos
$dbhost = "qamy010.nexustech.gal";
$dbuser = "qamy010";
$dbpass = "Ivxn231103";
$dbname = "qamy010";
$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Conexión fallida: " . $conn->connect_error]); exit;
}
$conn->set_charset("utf8mb4");

if ($cantidad > 0) {
    // Verificar si ya existe
    $stmt = $conn->prepare("SELECT cantidad FROM carrito WHERE id_usuario = ? AND id_producto = ?");
    if (!$stmt) {
        echo json_encode(["success" => false, "error" => "Error SELECT: " . $conn->error]); exit;
    }

    $stmt->bind_param("ii", $id_usuario, $id_producto);
    $stmt->execute();
    $result = $stmt->get_result();

    echo "Paso 4: SELECT ejecutado.\n"; flush();

    if ($result->num_rows > 0) {
        $stmt_update = $conn->prepare("UPDATE carrito SET cantidad = ? WHERE id_usuario = ? AND id_producto = ?");
        if (!$stmt_update) {
            echo json_encode(["success" => false, "error" => "Error UPDATE: " . $conn->error]); exit;
        }
        $stmt_update->bind_param("iii", $cantidad, $id_usuario, $id_producto);
        $stmt_update->execute();
        $stmt_update->close();

        echo "Paso 5: UPDATE ejecutado.\n"; flush();
    } else {
        $stmt_insert = $conn->prepare("INSERT INTO carrito (id_usuario, id_producto, cantidad) VALUES (?, ?, ?)");
        if (!$stmt_insert) {
            echo json_encode(["success" => false, "error" => "Error INSERT: " . $conn->error]); exit;
        }
        $stmt_insert->bind_param("iii", $id_usuario, $id_producto, $cantidad);
        $stmt_insert->execute();
        $stmt_insert->close();

        echo "Paso 6: INSERT ejecutado.\n"; flush();
    }
    $stmt->close();

    echo json_encode(["success" => true, "message" => "Carrito actualizado."]);
} else {
    $stmt = $conn->prepare("DELETE FROM carrito WHERE id_usuario = ? AND id_producto = ?");
    if (!$stmt) {
        echo json_encode(["success" => false, "error" => "Error DELETE: " . $conn->error]); exit;
    }

    $stmt->bind_param("ii", $id_usuario, $id_producto);
    $stmt->execute();
    $stmt->close();

    echo json_encode(["success" => true, "message" => "Producto eliminado del carrito."]);
}

$conn->close();
?>
