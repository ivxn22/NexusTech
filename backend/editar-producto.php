<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Habilitar CORS con credenciales
header('Content-Type: application/json');
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://nexustech.gal");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Verificar sesión y rol admin
if (!isset($_SESSION['id_usuario']) || $_SESSION['rol'] !== 'admin') {
    echo json_encode(["success" => false, "error" => "Acceso denegado. Se requiere sesión de administrador."]);
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

// Obtener los datos del formulario
$id_producto = $_POST['id_producto'] ?? '';
$nombre = $_POST['nombre'] ?? '';
$descripcion = $_POST['descripcion'] ?? '';
$precio = $_POST['precio'] ?? '';
$stock = $_POST['stock'] ?? '';
$id_categoria = $_POST['id_categoria'] ?? '';

// Validar campos
if (!$id_producto || !$nombre || !$descripcion || !$precio || !$stock || !$id_categoria) {
    echo json_encode(["success" => false, "error" => "Faltan datos obligatorios."]);
    exit;
}

// Actualizar los datos del producto
$stmt = $conn->prepare("UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, id_categoria = ? WHERE id_producto = ?");
$stmt->bind_param("ssdiis", $nombre, $descripcion, $precio, $stock, $id_categoria, $id_producto);
$stmt->execute();
$stmt->close();

// Procesar nuevas imágenes si se han enviado
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

echo json_encode(["success" => true, "message" => "Producto editado correctamente."]);
$conn->close();
