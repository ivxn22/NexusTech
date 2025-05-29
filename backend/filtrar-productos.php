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

if (!isset($_GET['termino'])) {
    echo json_encode(["success" => false, "error" => "Término de búsqueda no proporcionado."]);
    exit;
}

$termino = strtolower(trim($_GET['termino']));

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


$query = "
    SELECT p.id_producto, p.nombre AS producto_nombre, p.descripcion, p.precio, p.stock,
           c.nombre AS categoria_nombre
    FROM productos p
    JOIN categorias c ON p.id_categoria = c.id_categoria
    WHERE LOWER(p.nombre) LIKE ? OR LOWER(c.nombre) LIKE ?
";

$stmt = $conn->prepare($query);
if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Error al preparar la consulta SQL: " . $conn->error]);
    exit;
}

$busqueda = "%$termino%";
$stmt->bind_param("ss", $busqueda, $busqueda);
$stmt->execute();

$resultado = $stmt->get_result();
$productos = [];

while ($fila = $resultado->fetch_assoc()) {
    $id_producto = $fila['id_producto'];

    $imagenes = [];
    $stmt_img = $conn->prepare("SELECT ruta FROM url_imagenes WHERE id_producto = ?");
    if ($stmt_img) {
        $stmt_img->bind_param("i", $id_producto);
        $stmt_img->execute();
        $res_img = $stmt_img->get_result();
        while ($img = $res_img->fetch_assoc()) {
            $imagenes[] = $img['ruta'];
        }
        $stmt_img->close();
    }

    $fila['nombre'] = $fila['producto_nombre'];
    $fila['categoria'] = $fila['categoria_nombre'];
    unset($fila['producto_nombre'], $fila['categoria_nombre']);

    $fila['imagenes'] = $imagenes;
    $productos[] = $fila;
}

$stmt->close();
$conn->close();

echo json_encode(["success" => true, "productos" => $productos]);
