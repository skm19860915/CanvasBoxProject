<?php
$name = $_POST["name"];
$format = $_POST["format"];
$data = $_POST["data"];

$image = str_replace(" ", "+", str_replace("data:".$format.";base64,", "", $data));
$binary = base64_decode($image);

header("Pargma", "no-cache");
header("Expires", "-1");
header("Content-Type: image/png");
header("Content-Disposition: attachment; filename=\"".$name."\"");
header("Content-Transfer-Encoding: binary");
header("Content-Length: ".strlen($binary));

echo $binary;
?>
