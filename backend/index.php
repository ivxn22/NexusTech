<?
ob_start();
ini_set('display_errors', 1); 
ini_set('log_errors', 1);
error_reporting(E_ALL);


header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://nexustech.gal");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "OPTIONS preflight OK"]);
    exit;
}


$host = "qamy010.nexustech.gal";
$user = "qamy010";
$pass = "Ivxn231103";
$dbname = "qamy010";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error en la conexión a la base de datos"]);
    exit;
}
$conn->set_charset("utf8mb4");

$productosDestacados = [];
$sql = "
    SELECT p.id_producto, p.nombre, p.descripcion, p.precio, 
        (SELECT ruta FROM url_imagenes ui WHERE ui.id_producto = p.id_producto LIMIT 1) AS imagen
    FROM productos p
    ORDER BY RAND()
    LIMIT 6
";
if ($res = $conn->query($sql)) {
    while ($row = $res->fetch_assoc()) {
        $productosDestacados[] = $row;
    }
} else {
    echo json_encode(["success" => false, "error" => "Error en productos destacados"]);
    exit;
}


$categorias = [];
$sql = "
    SELECT c.id_categoria, c.nombre AS categoria_nombre, c.descripcion AS categoria_descripcion,
        (SELECT ui.ruta FROM productos p 
            JOIN url_imagenes ui ON ui.id_producto = p.id_producto 
            WHERE p.id_categoria = c.id_categoria 
            LIMIT 1) AS imagen_representativa
    FROM categorias c
";
if ($res = $conn->query($sql)) {
    while ($row = $res->fetch_assoc()) {
        $categorias[] = $row;
    }
} else {
    echo json_encode(["success" => false, "error" => "Error en categorías"]);
    exit;
}


$productos = [];
$sql = "
    SELECT p.id_producto, p.nombre, p.descripcion, p.precio, p.id_categoria,
        (SELECT ruta FROM url_imagenes ui WHERE ui.id_producto = p.id_producto LIMIT 1) AS imagen
    FROM productos p
";
if ($res = $conn->query($sql)) {
    while ($row = $res->fetch_assoc()) {
        $productos[] = $row;
    }
} else {
    echo json_encode(["success" => false, "error" => "Error en productos"]);
    exit;
}


if (ob_get_length()) {
    ob_end_clean();
}


echo json_encode([
    "success" => true,
    "productos_destacados" => $productosDestacados,
    "categorias" => $categorias,
    "productos" => $productos
]);

$conn->close();
exit;