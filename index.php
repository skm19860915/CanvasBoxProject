<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<title>Dantwort Prototype</title>

<link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Product+Sans:300,500">
<link rel="stylesheet" type="text/css" href="https://getbootstrap.com/docs/4.1/dist/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="css/default.css">

<script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script type="text/javascript" src="https://getbootstrap.com/docs/4.1/dist/js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/three.js"></script>
<script type="text/javascript" src="js/three.lib.js"></script>
<script type="text/javascript" src="js/properties.js"></script>
<script type="text/javascript" src="js/labgl2d.js"></script>
<script type="text/javascript" src="js/labgl3d.js"></script>

<script type="text/javascript">
var bid = 1;
$(document).ready(function () {
	if (LabGL.Function.isMobile()) {
		var width2d = window.innerWidth / 3;
		var height2d = window.innerHeight / 3;
		var width3d = window.innerWidth;
		var height3d = window.innerHeight;
	}
	else {
		var width2d = 400;
		var height2d = 300;
		var width3d = 1200;
		var height3d = 880;
	}

	var options = {
		dataURL: 'data/init.php?bid=' + bid,	// this box's data path
		width2d: width2d,	// 2d canvas width
		height2d: height2d,	// 2d canvas height
		width3d: width3d,	// 3d canvas width
		height3d: height3d,	// 3d canvas height
		debug: false
	};

	LabGL.init(options);
});

var pdfUrl = '';
function setPDFUrl(url) {
	pdfUrl = url;

	getPDFUrl();
}

function getPDFUrl() {
	console.log(pdfUrl);
	window.open(pdfUrl);
}
</script>
</head>

<body>

<div class="container-fluid">

	<div id="header" class="text-center">
		<a href="index.php?bid=1">Box1</a>
		<a href="index.php?bid=2">Box2</a>
		<a href="index.php?bid=3">Box3</a>
		<a href="index.php?bid=4">Box4</a>
		<a href="index.php?bid=5">Box5</a>
		<a href="index.php?bid=6">Box6</a>
		<a href="index.php?bid=7">Box7</a>
		<a href="index.php?bid=8">Box8</a>
		<a href="index.php?bid=9">Box9</a>
		<a href="index.php?bid=10">Box10</a>
		<a href="index.php?bid=11">TEST</a>
	</div>

	<!-- viewer -->
	<div id="viewer2d"></div>
	<div id="viewer3d"></div>

	<i id="expand_canvas" class="fa fa-expand" aria-hidden="true" onclick="javascript: LabGL2D.Dynamic.expandCanvas();"></i>
	<i id="compress_canvas" class="fa fa-compress" aria-hidden="true" onclick="javascript: LabGL2D.Dynamic.compressCanvas();"></i>

	<div id="dropdown">
		<a class="menu"><span>Menu &raquo;</span></a>
		<div class="submenu">
			<ul class="root">
				<li>
					<a onclick="javascript: LabGL.Export.saveImage('png');">Save PNG</a>
				</li>
				<li>
					<a onclick="javascript: LabGL.Export.saveImage('jpeg');">Save JPEG</a>
				</li>
				<li>
					<a onclick="javascript: LabGL.Export.savePDF();">Save PDF</a>
				</li>
				<li>
					<a onclick="javascript: LabGL3D.Dynamic.openLip();">Open lip</a>
				</li>
				<li>
					<a onclick="javascript: LabGL3D.Dynamic.closeLip();">Close lip</a>
				</li>
				<li>
					<hr />
				</li>
				<li>
					<span>x</span><input type="text" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" id="size_x" onchange="javascript: LabGL.Dynamic.changeSize('size_x');" value="0"><br />
					<span>y</span><input type="text" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" id="size_y" onchange="javascript: LabGL.Dynamic.changeSize('size_y');" value="0"><br />
					<span>z</span><input type="text" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" id="size_z" onchange="javascript: LabGL.Dynamic.changeSize('size_z');" value="0"><br />
					<span>cork</span><input type="text" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" id="size_c" onchange="javascript: LabGL.Dynamic.changeSize('size_c');" value="0"><br />
					<span>wing</span><input type="text" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" id="size_w" onchange="javascript: LabGL.Dynamic.changeSize('size_w');" value="0"><br />
				</li>
				<li>
					<hr />
				</li>
				<li>
					<span>Color(hex)</span><input type="text" id="box_color" value="#ffffff" onchange="javascript: LabGL3D.Dynamic.changeColor();">
				</li>
				<li>
					<a href="javascript: LabGL3D.Dynamic.autoRotate();">Auto rotate</a>
				</li>
			</ul>
		</div>
	</div>

	<div class="text-center"><br /><br /><br /><br /><br />Another contents<br /><br /><br /><br /><br /></div>

</div>

</body>
</html>
