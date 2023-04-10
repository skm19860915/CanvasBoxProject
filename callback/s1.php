<?php
//header('Content-Type: application/json');
//header("Content-Type:text/html;charset=utf-8");
require_once('TCPDF/tcpdf.php');

$data = $_POST["data"];
if(!$data) $data = file_get_contents('php://input');
if(!$data) $data = file_get_contents("sample2.json");

$json =  json_decode($data);

$filename = sprintf("%s_%s.pdf",date("YmdHis"),$json->box_id);

// create new PDF document
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

$pdf->AddPage();

$file = "4.jpg";
$pdf->Image($file, $mx, $my, $w-($mx*2), $h-($my*2) );
$pdf->Rect($mx, $my, $w-($mx*2), $h-($my*2) );


$pdf->Output();
exit;

//Close and output PDF document
$buffer = $pdf->Output("pdf/$filename",'S');
$f = fopen("./pdf/$filename", 'wb');
if($f)
{
	fwrite($f, $buffer, strlen($buffer));
	fclose($f);
	echo '{"status":"OK","url":"callback/pdf/'.$filename.'"}';
}else{
	echo '{"status":"FAIL","url":""}';
}
?>
