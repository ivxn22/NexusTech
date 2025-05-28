<?php
header("Content-Type: application/json; charset=UTF-8");
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
    die(json_encode(["success" => false, "error" => "Conexión fallida: " . $conn->connect_error]));
}
$conn->set_charset("utf8mb4");


$data = json_decode(file_get_contents("php://input"), true);
$id_usuario = $data['id_usuario'] ?? '';
$nombre = $data['nombre'] ?? '';
$email = $data['email'] ?? '';
$direccion = $data['direccion'] ?? '';
$rol = $data['rol'] ?? '';

if (!$id_usuario || !$nombre || !$email || !$direccion || !$rol) {
    echo json_encode(["success" => false, "error" => "Todos los campos son obligatorios."]);
    exit;
}

// Actualizar usuario en la base de datos
$stmt = $conn->prepare("UPDATE usuarios SET nombre = ?, email = ?, direccion = ?, rol = ? WHERE id_usuario = ?");
$stmt->bind_param("ssssi", $nombre, $email, $direccion, $rol, $id_usuario);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Usuario actualizado correctamente."]);
} else {
    echo json_encode(["success" => false, "error" => "Error SQL: " . $stmt->error]);
}

$conn->close();
?>
