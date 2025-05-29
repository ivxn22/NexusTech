<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://nexustech.gal");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (!isset($_SESSION['id_usuario']) || !isset($_SESSION['rol'])) {
    echo json_encode(["success" => false, "error" => "No estás autenticado. Se requiere sesión."]);
    exit;
}

if ($_SESSION['rol'] !== 'admin') {
    echo json_encode(["success" => false, "error" => "Acceso denegado. Se requiere rol de administrador."]);
    exit;
}

// Conexión a la base de datos
$dbhost = "qamy010.nexustech.gal";
$dbuser = "qamy010";
$dbpass = "Ivxn231103";
$dbname = "qamy010";
$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
$conn->set_charset("utf8mb4");

$nombre = $_POST['nombre'] ?? '';
$descripcion = $_POST['descripcion'] ?? '';
$precio = $_POST['precio'] ?? '';
$stock = $_POST['stock'] ?? '';
$id_categoria = $_POST['id_categoria'] ?? '';

if (!$nombre || !$descripcion || !$precio || !$stock || !$id_categoria) {
    echo json_encode(["success" => false, "error" => "Faltan datos obligatorios."]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO productos (nombre, descripcion, precio, stock, id_categoria) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssdii", $nombre, $descripcion, $precio, $stock, $id_categoria);
$stmt->execute();

$id_producto = $stmt->insert_id;
$stmt->close();

if (!empty($_FILES['imagenes']['name'][0])) {
    $rutaBase = "imagenes/";
    if (!is_dir($rutaBase)) {
        mkdir($rutaBase, 0777, true);
    }

    foreach ($_FILES['imagenes']['tmp_name'] as $index => $tmpName) {
        $nombreArchivo = basename($_FILES['imagenes']['name'][$index]);
        $rutaDestino = $rutaBase . time() . '_' . $nombreArchivo;

        if (move_uploaded_file($tmpName, $rutaDestino)) {
            $stmtImg = $conn->prepare("INSERT INTO url_imagenes (id_producto, ruta) VALUES (?, ?)");
            $stmtImg->bind_param("is", $id_producto, $rutaDestino);
            $stmtImg->execute();
            $stmtImg->close();
        }
    }
}


echo json_encode(["success" => true, "message" => "Producto añadido correctamente."]);
$conn->close();
