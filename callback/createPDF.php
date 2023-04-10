<?php
//header('Content-Type: application/json');
//header("Content-Type:text/html;charset=utf-8");
require_once('TCPDF/tcpdf.php');

$data = $_POST["data"];
if(!$data) $data = file_get_contents('php://input');
if(!$data) $data = file_get_contents("sample1.json");

ob_start();
echo date("Y-m-d H:i:s")."\n";
print_r($_POST);
print_r($_GET);
echo $data;
print_r(json_decode($data));
$buf = ob_get_contents();
ob_end_clean(); 
file_put_contents("./pdf/p.log",$buf);
//exit;
//

$json =  json_decode($data);

$mx = 50;
$my = 50;

$x1=$y1=10000;
$x2=$y2=0;
foreach($json->data as $k=>$v)
{
	foreach($v->points as $i=>$p) 
	{
		$x1=min($x1,$p[0]); $y1=min($y1,$p[1]);
		$x2=max($x2,$p[0]); $y2=max($y2,$p[1]);
	}
}

// create new PDF document
$w = $json->size[0];
$h = $json->size[1];

$x1 = $mx-$x1;
$y1 = $my-$y1;
$w = $x2+$mx+$x1;
$h = $y2+$my+$y1;

$orientation=($w>$h) ? 'L' : 'P';
$pdf = new TCPDF($orientation, 'mm', array($w,$h), true, 'UTF-8', false);

$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);
$pdf->SetMargins(0,0);

// set font
$pdf->SetFont('nanumgothic', '', 30);

// add a page
$pdf->AddPage();

$style0 = array('width' => 0.5, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(0, 0, 255));
$style1 = array('width' => 0.5, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(255, 0, 0));
foreach($json->data as $k=>$v)
{
	//echo $v->kind;
	//echo print_r($v->points);
	$pdf->SetLineStyle( ($v->kind=='in') ? $style0 : $style1);

	foreach($v->points as $i=>$p) 
	{
		$p[0]+=$x1;$p[1]+=$y1;

		if(!$i) $pdf->MoveTo($p[0],$p[1]);
		else $pdf->LineTo($p[0],$p[1]);
	}
	$pdf->stroke();
}
$tt = array("front"=>"앞면", "back"=>"뒷면", "side"=>"옆면");
foreach($json->text as $k=>$v)
{
	$v[1]+=$x1;$v[2]+=$y1;

	$pdf->Text($v[1], $v[2], $tt[$v[0]]);
	$pdf->Text($v[1]+100, $v[2], $v[0]);
}
//$pdf->Output();
//exit;

$path = 'pdf';
$filename = sprintf("%s_%s.pdf",date("YmdHis"),$json->box_id);

/*
$path = 'pdf/'.date("Y/m/d");
@mkdir($path,0777,TRUE);

while (true) {
	$filename = uniqid($json->box_id, true) . '.pdf';
	if (!file_exists($path .'/'. $filename)) break;
}
*/

//Close and output PDF document
$buffer = $pdf->Output('','S');
$f = fopen("./".$path."/".$filename, 'wb');
if($f)
{
	fwrite($f, $buffer, strlen($buffer));
	fclose($f);
	echo '{"status":"OK","url":"callback/'.$path.'/'.$filename.'"}';
}else{
	echo '{"status":"FAIL","url":""}';
}
?>
