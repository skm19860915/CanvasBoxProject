//=======================================================================================================================================================
// WebGL Base
var LabGL = {
	debug: false,
	options: null,

	init: function (options) {
		$('#size_x').val(Properties.d2[bid].group.x.length);
		$('#size_y').val(Properties.d2[bid].group.y.length);
		$('#size_z').val(Properties.d2[bid].group.z.length);
		LabGL.Dynamic.currentSizes.x = Properties.d2[bid].group.x.length;
		LabGL.Dynamic.currentSizes.y = Properties.d2[bid].group.y.length;
		LabGL.Dynamic.currentSizes.z = Properties.d2[bid].group.z.length;
		LabGL.Dynamic.currentPoints.x.point = Properties.d2[bid].group.x.point;
		LabGL.Dynamic.currentPoints.y.point = Properties.d2[bid].group.y.point;
		LabGL.Dynamic.currentPoints.z.point = Properties.d2[bid].group.z.point;
		LabGL.Dynamic.currentPoints.x.stand = new Array(Properties.d2[bid].group.x.point.length);
		LabGL.Dynamic.currentPoints.y.stand = new Array(Properties.d2[bid].group.y.point.length);
		LabGL.Dynamic.currentPoints.z.stand = new Array(Properties.d2[bid].group.z.point.length);

		this.options = options;

		$('#viewer2d').css('position', 'absolute');
		$('#viewer2d').css('top', options.height3d - options.height2d + $('#viewer3d').offset().top);
//		$('#viewer2d').css('left', $('#viewer3d').offset().left);
		$('#viewer2d').css('z-index', '999');
		$('#viewer3d').css('z-index', '998');

		$('#viewer2d').css('padding', 0);
		$('#viewer3d').css('padding', 0);
		$('#viewer2d canvas').css('outline', 'none');
		$('#viewer3d canvas').css('outline', 'none');

		LabGL2D.canvasWidth = options.width2d;
		LabGL2D.canvasHeight = options.height2d;
		LabGL3D.canvasWidth = options.width3d;
		LabGL3D.canvasHeight = options.height3d;
		this.debug = options.debug;

		$('#expand_canvas').css('top', $('#viewer2d').offset().top + 10);
		$('#expand_canvas').css('left', $('#viewer2d').offset().left + 10);
		$('#compress_canvas').css('top', $('#viewer3d').offset().top + 10);
		$('#compress_canvas').css('left', $('#viewer3d').offset().left + 10);

		$.ajax({
			cache: false,
			url: options.dataURL,
			error: function (xhr, textStatus, errorThrown) {
				// error coding
				LabGL.Data.initStatus = -1;
			},
			beforeSend: function () {
				// before sending
				LabGL.Data.initStatus = 0;
			},
			success: function (response, textStatus, xhr) {
				console.log(response)
				response = $.parseJSON(response);

				// get data from server
				if (response.status === 'ERROR') {
					LabGL.Data.initStatus = -1;
					alert(response.message);
					return;
				}
				else {
					LabGL.Data.initData = response.initData;
					LabGL.Data.initStatus = 1;

					if (LabGL.Data.initStatus !== 1) {
						alert('Data init failed.');
						return;
					}

					if (!WEBGL.isWebGLAvailable && !WEBGL.isWebGL2Available) {
						alert('This browser/device doesn\'t support WebGL.');
						return;
					}

					// WebGL init
					LabGL2D.init();
					LabGL2D.animate();
					LabGL2D.Loader.loadLines();

					LabGL3D.init();
					LabGL3D.animate();
					LabGL3D.Loader.loadFloor();
//					LabGL3D.Loader.loadFaces();
					LabGL3D.Loader.loadBox();
					LabGL3D.Loader.loadLabels();

					window.addEventListener('resize', this.onWindowResize, false);		// window size changing
					window.addEventListener('scroll', this.onDocumentScroll, false);	// scroll moving
				}
			}
		});
	},

	onWindowResize: function () {
		LabGL2D.camera.aspect = LabGL2D.canvasWidth / LabGL2D.canvasHeight;
		LabGL2D.camera.updateProjectionMatrix();
		LabGL2D.renderer.setSize(LabGL2D.canvasWidth, LabGL2D.canvasHeight);

		LabGL3D.camera.aspect = LabGL3D.canvasWidth / LabGL3D.canvasHeight;
		LabGL3D.camera.updateProjectionMatrix();
		LabGL3D.renderer.setSize(LabGL3D.canvasWidth, LabGL3D.canvasHeight);

		//--------------------------------------------------------
		// set mouse position on changing window's size as scroll
		LabGL2D.setMouseClickedPoint();
		LabGL3D.setMouseClickedPoint();
		//--------------------------------------------------------
	},

	onDocumentScroll: function () {
		//--------------------------------------------------------
		// set mouse position on changing window's size as scroll
		LabGL2D.setMouseClickedPoint();
		LabGL3D.setMouseClickedPoint();
		//--------------------------------------------------------
	}
};
//=======================================================================================================================================================

//=======================================================================================================================================================
// Dynamic
LabGL.Dynamic = {
	currentPoints: { x: { point: null, stand: null }, y: { point: null, stand: null }, z: { point: null, stand: null }},
	currentSizes: { x: 0, y: 0, z: 0 },

	changeSize: function (id) {
		var to = $('#' + id).val();
		if (to === '')
			return;

		var key = id.replace('size_', '');

		// change 2D size
		LabGL2D.Dynamic.changeSize(key, to);

		// change 3D size
		LabGL3D.Dynamic.changeSize(key, to);

		this.currentSizes[key] = to;

		//----------------------------------------------------------------------
		// change 2D label's value
		/*for (var i = 0; i < LabGL2D.Loader.labels[this.currentIdx].length; i++) {
			if (LabGL2D.Loader.labels[this.currentIdx][i].label) {
				var name = LabGL2D.Loader.labels[this.currentIdx][i].label.name;
				var target = LabGL2D.scene.getObjectByName(name);
				if (target)
					LabGL2D.scene.remove(target);

				var ids = name.split('_');
				var idx = ids[1];
				var jdx = ids[2];
				LabGL2D.Loader.loadLabel(idx, jdx, size);
			}
		}*/
	}
};
//=======================================================================================================================================================

//=======================================================================================================================================================
// Data
LabGL.Data = {
	initData: null,
	initStatus: -1
};
//=======================================================================================================================================================

//=======================================================================================================================================================
// Export
LabGL.Export = {
	savePDF: function () {
		var pdfData = { box_id: bid, size: [0, 0], text: [['front', 100, 50], ['back', 100, 50], ['side', 100, 50]], data: []};

		var mins = [10000, 10000];
		var maxes = [0, 0];
		var moves = [0, 0];
		var lines = LabGL2D.Loader.lines;

		for (var i = 0; i < lines.length; i++) {
			for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
				pointX = lines[i].geometry.vertices[j].x;
				pointY = lines[i].geometry.vertices[j].y;

				if (mins[0] > pointX)
					mins[0] = pointX;
				if (mins[1] > pointY)
					mins[1] = pointY;

				if (maxes[0] < pointX)
					maxes[0] = pointX;
				if (maxes[1] < pointY)
					maxes[1] = pointY;
			}
		}

		if (mins[0] < 0)
			moves[0] = mins[0];
		if (mins[1] < 0)
			moves[1] = mins[1];

		pdfData.size[0] = (maxes[0] - mins[0]).toFixed(3);
		pdfData.size[1] = (maxes[1] - mins[1]).toFixed(3);

		for (var i = 0; i < lines.length; i++) {
			var line = {};
			line.kind = lines[i].kind;
			line.points = [];
			for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
				pointX = lines[i].geometry.vertices[j].x;
				pointY = lines[i].geometry.vertices[j].y;

				var point = [(pointX - moves[0]).toFixed(3), (pointY - moves[1]).toFixed(3)];
				line.points.push(point);
			}
			pdfData.data.push(line);
		}

		$.ajax({
			cache: false,
			type: 'post',
			url: 'callback/createPDF.php',
			data: JSON.stringify(pdfData),
			error: function (xhr, textStatus, errorThrown) {
				alert(errorThrown);
			},
			beforeSend: function () {
			},
			success: function (response, textStatus, xhr) {
				response = $.parseJSON(response);

				// get data from server
				if (response.status === 'OK') {
					setPDFUrl(response.url);
				}
			},
			complete: function () {
			}
		});

		// just for test
		/*LabGL2D.init();
		LabGL2D.animate();
		for (var i = 0; i < pdfData.data.length; i++) {
			var shape = new THREE.Shape();

			for (var j = 0; j < pdfData.data[i].points.length; j++) {
				if (j === 0)
					shape.moveTo(pdfData.data[i].points[0][0], pdfData.data[i].points[0][1]);
				else
					shape.lineTo(pdfData.data[i].points[j][0], pdfData.data[i].points[j][1]);
			}

			var point = shape.getPoints();
			var geometry = new THREE.Geometry().setFromPoints(point);

			var material = new THREE.LineBasicMaterial();
			material.color = new THREE.Color(Properties.d2.color[pdfData.data[i].kind]);

			var line = new THREE.Line(geometry, material);
			line.rotateX(Math.PI / 2);
			line.kind = Properties.d2[bid].vertices[i][Properties.d2[bid].vertices[i].length - 1];
			LabGL2D.scene.add(line);
		}*/
	},

	saveImage: function (format) {
		var mimetype = 'image/' + format;
		var imageName = 'download';
		var targetURL = 'callback/downloadImage.php';

		window.setTimeout(
			function () {
				var dataURL = LabGL2D.renderer.domElement.toDataURL(mimetype, 1.0);

				var form = $('<form name="frm_down"></form>');
				form.attr('action', targetURL);
				form.attr('method', 'post');
				form.appendTo('body');
				form.append('<input type="hidden" value="' + imageName + '.' + format + '" name="name">');
				form.append('<input type="hidden" value="' + mimetype + '" name="format">');
				form.append('<input type="hidden" value="' + dataURL + '" name="data">');
				form.submit();
			},
			50
		);
	}
};
//=======================================================================================================================================================

//=======================================================================================================================================================
// Function
LabGL.Function = {
	isIE: function () {
		return (
			(navigator.appName === 'Microsoft Internet Explorer') ||
			((navigator.appName === 'Netscape') && (new RegExp('Trident/.*rv:([0-9]{1,}[\.0-9]{0,})').exec(navigator.userAgent) !== null))
		);
	},

	isMobile: function () {
		var bMobile = false;

		var mobileInfo = new Array('Android', 'iPhone', 'iPod', 'iPad', 'BlackBerry', 'Windows CE', 'SAMSUNG', 'LG', 'MOT', 'SonyEricsson');
		for (var info in mobileInfo) {
			if (navigator.userAgent.match(mobileInfo[info]) !== null) {
				bMobile = true;
				break;
			}
		}

		return bMobile;
	},

	isTablet: function () {
		if (!this.isMobile())
			return false;

		var ua = navigator.userAgent.toLowerCase();

		if (ua.indexOf('ipad') > -1 || (ua.indexOf('android') > -1 && ua.indexOf('mobile') < 0))
			return true;

		return false;
	},

	clone: function (obj) {
		if (obj === null || typeof(obj) !== 'object')
			return obj;

		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr))
				copy[attr] = obj[attr];
		}

		return copy;
	},

	replaceAll: function (str, search, replace) {
		return str.split(search).join(replace);
	}
};
//=======================================================================================================================================================

//=======================================================================================================================================================
// WebGL Base
var LabGL2D = {
	idAnimate: null,
	canvasWidth: 0,
	canvasHeight: 0,
	container: null,
	renderer: null,
	scene: null,
	camera: null,
	controls: null,
	ambientLight: null,
	marginLeft: 0,
	marginTop: 0,
	raycaster: null,
	mouse: null,
	time: { start: 0, end: 0 },
	stats: null,

	release: function () {
		cancelAnimationFrame(LabGL2D.idAnimate);
	},

	// calculate mouse position
	setMouseClickedPoint: function () {
		// checkpoint : left/right scroll, window size change, webpage's area per whole browser screen, part exclusive of webgl
		var scrollLeft = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft;
		var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;

		this.marginLeft = $('#viewer2d').offset().left - scrollLeft;
		this.marginTop = $('#viewer2d').offset().top - scrollTop;
	},

	// canvas init
	init: function () {
		//----------------------------------------------------
		// create container
		this.container = document.getElementById('viewer2d');
		//----------------------------------------------------

		//--------------------------------------------------------
		// set mouse position on changing window's size as scroll
		LabGL2D.setMouseClickedPoint();
		//--------------------------------------------------------

		//----------------------------------------------------
		// scene
		this.scene = new THREE.Scene();
		this.scene.position.x += Properties.d2[bid].scene[0];
		this.scene.position.z += Properties.d2[bid].scene[1];
		//----------------------------------------------------

		//------------------------------------------------------------------------------------------------------------------
		// camera
		this.camera = new THREE.PerspectiveCamera(
			50,										// field of view
			this.canvasWidth / this.canvasHeight,	// aspect ratio
			0.1,									// near
			Properties.d2[bid].camera[1] * 30 / 2			// far
		);

		this.camera.position.set(Properties.d2[bid].camera[0], Properties.d2[bid].camera[1], Properties.d2[bid].camera[2]);
		this.camera.lookAt(this.scene.position);
		//------------------------------------------------------------------------------------------------------------------

		var geometry = new THREE.SphereGeometry(5, 20, 20);
		var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
		var sphere = new THREE.Mesh(geometry, material);
		sphere.position.set(0, 0, 0);
		this.scene.add(sphere);

		//-------------------------------------------------------
		// light
		this.ambientLight = new THREE.AmbientLight(0xffffff);
		this.ambientLight.intensity = Properties.d2.intensity;
		this.scene.add(this.ambientLight);
		//-------------------------------------------------------

		//--------------------------------------------------------------------------------------------------------------
		// renderer
		// set antialias true to get smoother output
		// set preserveDrawingBuffer true to allow screenshot
		if (LabGL.Function.isMobile())
			this.renderer = new THREE.WebGLRenderer({ antialias: true/*, alpha: true*/ });
		else
			this.renderer = new THREE.WebGLRenderer({ antialias: true/*, alpha: true*/, preserveDrawingBuffer: true });
		this.renderer.setClearColor(Properties.d2.color.renderer, 1/*0*/);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.canvasWidth, this.canvasHeight);
		this.container.appendChild(this.renderer.domElement);
		//--------------------------------------------------------------------------------------------------------------

		//---------------------------------------
		// mouse position
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		//---------------------------------------

		//-------------------------------------------------------------------------------
		// controller
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		LabGL2D.Dynamic.setControlLimit(false);
		//-------------------------------------------------------------------------------

		//---------------------------------------------------------------------------------------------------------------
		// event listener
		if (LabGL.Function.isMobile()) {
			this.container.addEventListener('touchmove', this.onDocumentMouseMove, false);		// mobile moving
			this.container.addEventListener('touchstart', this.onDocumentMouseDown, false);		// mobile touch
			this.container.addEventListener('touchend', this.onDocumentMouseUp, false);			// mobile touched
		}
		else {
			// iPad's useragent is Mac
			this.container.addEventListener('pointermove', this.onDocumentMouseMove, false);	// mouse moving for pc
			this.container.addEventListener('pointerdown', this.onDocumentMouseDown, false);	// mouse left click
			this.container.addEventListener('pointerup', this.onDocumentMouseUp, false);		// mouse left clicked
		}
		//---------------------------------------------------------------------------------------------------------------

		//----------------------------------------------------------------------------
		if (LabGL.debug) {
			// debug mode
			var helper = new THREE.CameraHelper(this.camera);
			this.scene.add(helper);

			this.stats = new Stats();
			document.body.append(this.stats.dom);
		}
		//----------------------------------------------------------------------------
	},

	animate: function () {
		LabGL2D.idAnimate = requestAnimationFrame(LabGL2D.animate);

		if (LabGL2D.controls)
			LabGL2D.controls.update();

		if (LabGL2D.renderer)
			LabGL2D.renderer.render(LabGL2D.scene, LabGL2D.camera);

		if (LabGL2D.stats)
			LabGL2D.stats.update();
	},

	onDocumentMouseMove: function (event) {
		var x, y;
		if (event.changedTouches) {
			x = event.changedTouches[0].clientX;
			y = event.changedTouches[0].clientY;
		}
		else {
			x = event.clientX;
			y = event.clientY;
		}

		LabGL2D.mouse.x = ((x - LabGL2D.marginLeft) / LabGL2D.canvasWidth) * 2 - 1;
		LabGL2D.mouse.y = -((y - LabGL2D.marginTop) / LabGL2D.canvasHeight) * 2 + 1;

		LabGL2D.raycaster.setFromCamera(LabGL2D.mouse, LabGL2D.camera);
		var intersects = LabGL2D.raycaster.intersectObjects(LabGL2D.Dynamic.intersects, true);

		if (intersects.length > 0) {
			var intersection = intersects[0];
			var intersect = intersection.object;

			LabGL2D.container.style.cursor = 'pointer';
		}
		else {
			LabGL2D.container.style.cursor = 'default';
		}
	},

	onDocumentMouseDown: function () {
		if (LabGL.Function.isMobile()) {
			var x, y;
			if (event.changedTouches) {
				x = event.changedTouches[0].clientX;
				y = event.changedTouches[0].clientY;
			}
			else {
				x = event.clientX;
				y = event.clientY;
			}

			LabGL2D.mouse.x = ((x - LabGL2D.marginLeft) / LabGL2D.canvasWidth) * 2 - 1;
			LabGL2D.mouse.y = -((y - LabGL2D.marginTop) / LabGL2D.canvasHeight) * 2 + 1;

			LabGL2D.raycaster.setFromCamera(LabGL2D.mouse, LabGL2D.camera);
			var intersects = LabGL2D.raycaster.intersectObjects(LabGL2D.Dynamic.intersects, true);

			if (intersects.length > 0) {
				var intersection = intersects[0];
				var intersect = intersection.object;
			}
			else {
			}
		}
		else
			LabGL2D.time.start = new Date().getTime();
	},

	onDocumentMouseUp: function (event) {
		if (LabGL.Function.isMobile())
			return;

		// prevent duplicated event: orbit mouse moving > mouseup into intersect
		LabGL2D.time.end = new Date().getTime();
		if (LabGL2D.time.end - LabGL2D.time.start > 500)
			return;

		var x, y;
		if (event.changedTouches) {
			x = event.changedTouches[0].clientX;
			y = event.changedTouches[0].clientY;
		}
		else {
			x = event.clientX;
			y = event.clientY;
		}

		LabGL2D.mouse.x = ((x - LabGL2D.marginLeft) / LabGL2D.canvasWidth) * 2 - 1;
		LabGL2D.mouse.y = -((y - LabGL2D.marginTop) / LabGL2D.canvasHeight) * 2 + 1;

		LabGL2D.raycaster.setFromCamera(LabGL2D.mouse, LabGL2D.camera);
		var intersects = LabGL2D.raycaster.intersectObjects(LabGL2D.Dynamic.intersects, true);

		if (intersects.length > 0) {
			var intersection = intersects[0];
			var intersect = intersection.object;

			LabGL2D.Dynamic.currentIdx = intersect.idx;
		}
		else
			LabGL2D.container.style.cursor = 'default';
	}
};
//=======================================================================================================================================================

//=======================================================================================================================================================
// Loader
LabGL2D.Loader = {
	lines: null,
	previousMaxes: [0, 0],
	previousMins: [10000, 10000],

	loadLines: function () {
		this.lines = new Array(Properties.d2[bid].vertices.length);

		for (var i = 0; i < Properties.d2[bid].vertices.length; i++) {
			var shape = new THREE.Shape();
			var points = Properties.d2[bid].vertices[i];

			for (var j = 0; j < points.length; j++) {
				var isArray = Array.isArray(points[j]);
				if (isArray) {
					if (j === 0)
						shape.moveTo(points[j][0] - Properties.d2[bid].gap[0], points[j][1] - Properties.d2[bid].gap[1]);
					else {
						if (points[j].length > 3)	// curve
							shape.bezierCurveTo(points[j][0] - Properties.d2[bid].gap[0], points[j][1] - Properties.d2[bid].gap[1], points[j][2] - Properties.d2[bid].gap[0], points[j][3] - Properties.d2[bid].gap[1], points[j][4] - Properties.d2[bid].gap[0], points[j][5] - Properties.d2[bid].gap[1]);
						else	// line
							shape.lineTo(points[j][0] - Properties.d2[bid].gap[0], points[j][1] - Properties.d2[bid].gap[1]);
					}
				}
			}

			var point = shape.getPoints();
			var geometry = new THREE.Geometry().setFromPoints(point);

			var kind = Properties.d2[bid].vertices[i][Properties.d2[bid].vertices[i].length - 1];
			var group = Properties.d2[bid].vertices[i][Properties.d2[bid].vertices[i].length - 2];

			var material = new THREE.LineBasicMaterial();
			material.color = new THREE.Color(Properties.d2.color[kind]);

			this.lines[i] = new THREE.Line(geometry, material);
			this.lines[i].matrixWorldNeedsUpdate = true;
			this.lines[i].rotateX(Math.PI / 2);
			this.lines[i].kind = kind;
			this.lines[i].group = group;

			LabGL2D.scene.add(this.lines[i]);
		}

		// set stand position's index of vertices
		for (var k = 0; k < 3; k++) {
			if (k === 0)
				var key = 'x';
			else if (k === 1)
				var key = 'y';
			else if (k === 2)
				var key = 'z';

			for (var i = 0; i < this.lines.length; i++) {
				var group = this.lines[i].group[key];
				var from = LabGL.Dynamic.currentPoints[key].point[group];

				if (from) {
					for (var j = 0; j < this.lines[i].geometry.vertices.length; j++) {
						if (from.toFixed(3) === (this.lines[i].geometry.vertices[j].x).toFixed(3)) {
							LabGL.Dynamic.currentPoints[key].stand[group] = [i, j];
							//console.log(key + "|" + group + "|" + j + "|"  + j + "|" + from.toFixed(3));
						}
					}
				}
			}
		}
		//console.log(LabGL.Dynamic.currentPoints);

		// set the first max x, y
		/*for (var i = 0; i < this.lines.length; i++) {
			for (var j = 0; j < this.lines[i].geometry.vertices.length; j++) {
				pointX = this.lines[i].geometry.vertices[j].x;
				pointY = this.lines[i].geometry.vertices[j].y;

				if (LabGL2D.Dynamic.previousMaxes[0] < pointX)
					LabGL2D.Dynamic.previousMaxes[0] = pointX;
				if (LabGL2D.Dynamic.previousMaxes[1] < pointY)
					LabGL2D.Dynamic.previousMaxes[1] = pointY;

				if (LabGL2D.Dynamic.previousMins[0] > pointX)
					LabGL2D.Dynamic.previousMins[0] = pointX;
				if (LabGL2D.Dynamic.previousMins[1] > pointY)
					LabGL2D.Dynamic.previousMins[1] = pointY;
			}
		}*/

		var max = 0;
		var min = 10000;
		for (var i = 0; i < Properties.d2[bid].vertices.length; i++) {
			var points = Properties.d2[bid].vertices[i];
			var group = Properties.d2[bid].vertices[i][Properties.d2[bid].vertices[i].length - 2];
			if (group.z === 1) {
				for (var j = 0; j < points.length; j++) {
					var isArray = Array.isArray(points[j]);
					if (isArray) {
						if (max < points[j][1] - Properties.d2[bid].gap[1])
							max = points[j][1] - Properties.d2[bid].gap[1];
						if (min > points[j][1] - Properties.d2[bid].gap[1])
							min = points[j][1] - Properties.d2[bid].gap[1];
					}
				}
			}
		}
		//console.log(min + "|" + max);
	}
};
//=======================================================================================================================================================

//=======================================================================================================================================================
// Dynamic
LabGL2D.Dynamic = {
	currentIdx: -1,
	controlLimit: false,
	intersects: [],

	setControlLimit: function (controlLimit) {
		this.controlLimit = controlLimit;

		if (controlLimit) {
			if (LabGL2D.controls) {
				LabGL2D.controls.minPolarAngle = Properties.d2.angle[0];
				LabGL2D.controls.maxPolarAngle = Properties.d2.angle[1];
				LabGL2D.controls.minAzimuthAngle = Properties.d2.angle[2];
				LabGL2D.controls.maxAzimuthAngle = Properties.d2.angle[3];
				LabGL2D.controls.minDistance = Properties.d2[bid].distance[0];
				LabGL2D.controls.maxDistance = Properties.d2[bid].distance[1];
			}
		}
		else {
			if (LabGL2D.controls) {
				LabGL2D.controls.minPolarAngle = 0;
				LabGL2D.controls.maxPolarAngle = Math.PI;
				LabGL2D.controls.minAzimuthAngle = -Infinity;
				LabGL2D.controls.maxAzimuthAngle = Infinity;
				LabGL2D.controls.minDistance = 0;
				LabGL2D.controls.maxDistance = Infinity;
			}
		}
	},

	changeSize: function (key, size) {
		var orgLength = LabGL.Dynamic.currentSizes[key];
		console.log(orgLength)
		var ratio = size / orgLength;
		var distance = size - orgLength;
		var lines = LabGL2D.Loader.lines;
		console.log(lines);

		if (bid === 1) {
			// 10000 is min. 0 is max. null is not using. always use min!!!!!
			// array length is same as Properties.group[key].point's length
			var standsX = [null, 10000, null, 10000];
			var standsY = [10000, null, 10000];
			var standsZ = [null, 10000];

			if (key === 'x')
			{
				for (var i = 0; i < lines.length; i++) {
					//---------------------------------------------------------------
					// change stand
					var standX = LabGL.Dynamic.currentPoints.x.stand;
					for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
						for (var k = 0; k < standX.length; k++) {
							if (standX[k]) {
								if (i === standX[k][0] && j === standX[k][1]) {
									var result = lines[i].geometry.vertices[j].x;
									LabGL.Dynamic.currentPoints.x.point[k] = result;
								}
							}
						}
					}
					//---------------------------------------------------------------

					var group = lines[i].group[key];

					if (group === 1) {
						for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
							lines[i].geometry.vertices[j].x *= ratio;

							if (standsX[group] > lines[i].geometry.vertices[j].x)
								standsX[group] = lines[i].geometry.vertices[j].x;
						}
					}
					else if (group === 3) {
						for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
							lines[i].geometry.vertices[j].x *= ratio;

							if (standsX[group] > lines[i].geometry.vertices[j].x)
								standsX[group] = lines[i].geometry.vertices[j].x;
						}
					}

					lines[i].geometry.verticesNeedUpdate = true;
				}

				for (var i = 0; i < lines.length; i++) {
					var group = lines[i].group[key];
					var from = LabGL.Dynamic.currentPoints[key].point[group];

					if (group === 1) {
						var gap = from - standsX[group];
						for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
							lines[i].geometry.vertices[j].x += gap;
						}
					}
					else if (group === 2) {
						for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
							lines[i].geometry.vertices[j].x += distance;
						}
					}
					else if (group === 3) {
						var gap = from - standsX[group];
						for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
							lines[i].geometry.vertices[j].x += gap + distance;
						}
					}
					else if (group === 4) {
						for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
							lines[i].geometry.vertices[j].x += distance * 2;
						}
					}

					lines[i].geometry.verticesNeedUpdate = true;

					//---------------------------------------------------------------
					// change stand
					var standY = LabGL.Dynamic.currentPoints.y.stand;
					for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
						for (var k = 0; k < standY.length; k++) {
							if (standY[k]) {
								if (i === standY[k][0] && j === standY[k][1]) {
									var result = lines[i].geometry.vertices[j].x;
									LabGL.Dynamic.currentPoints.y.point[k] = result;
								}
							}
						}
					}
					//---------------------------------------------------------------
				}

				// reset camera and scene position
				/*LabGL2D.scene.position.x -= distance * 3 / 2;
				LabGL2D.camera.position.y += distance * 3 / 2;*/
			}
			else if (key === 'y') {
				for (var i = 0; i < lines.length; i++) {
					//---------------------------------------------------------------
					// change stand
					var standY = LabGL.Dynamic.currentPoints.y.stand;
					for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
						for (var k = 0; k < standY.length; k++) {
							if (standY[k]) {
								if (i === standY[k][0] && j === standY[k][1]) {
									var result = lines[i].geometry.vertices[j].x;
									LabGL.Dynamic.currentPoints.y.point[k] = result;
								}
							}
						}
					}
					//---------------------------------------------------------------

					var group = lines[i].group[key];

					if (group === 0) {
						for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
							lines[i].geometry.vertices[j].x *= ratio;

							// max
							if (standsY[group] > lines[i].geometry.vertices[j].x)
								standsY[group] = lines[i].geometry.vertices[j].x;
						}
					}
					else if (group === 2) {
						for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
							lines[i].geometry.vertices[j].x *= ratio;

							// min
							if (standsY[group] > lines[i].geometry.vertices[j].x)
								standsY[group] = lines[i].geometry.vertices[j].x;
						}
					}

					lines[i].geometry.verticesNeedUpdate = true;
				}

				for (var i = 0; i < lines.length; i++) {
					var group = lines[i].group[key];
					var from = LabGL.Dynamic.currentPoints[key].point[group];

					if (group === 0) {
						var gap = from - standsY[group];
						for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
							lines[i].geometry.vertices[j].x += gap;
						}
					}
					else if (group === 1) {
						for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
							lines[i].geometry.vertices[j].x += distance;
						}
					}
					else if (group === 2) {
						var gap = from - standsY[group];
						for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
							lines[i].geometry.vertices[j].x += gap + distance;
						}
					}
					else if (group === 3) {
						for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
							lines[i].geometry.vertices[j].x += distance * 2;
						}
					}

					lines[i].geometry.verticesNeedUpdate = true;

					//---------------------------------------------------------------
					// change stand
					var standX = LabGL.Dynamic.currentPoints.x.stand;
					for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
						for (var k = 0; k < standX.length; k++) {
							if (standX[k]) {
								if (i === standX[k][0] && j === standX[k][1]) {
									var result = lines[i].geometry.vertices[j].x;
									LabGL.Dynamic.currentPoints.x.point[k] = result;
								}
							}
						}
					}
					//---------------------------------------------------------------
				}
				// reset camera and scene position
				/*LabGL2D.scene.position.x -= distance * 3 / 2;
				LabGL2D.camera.position.y += distance * 3 / 2;*/
			}
			else if (key === 'z') {
				for (var i = 0; i < lines.length; i++) {
					var group = lines[i].group[key];

					if (group === 1) {
						for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
							lines[i].geometry.vertices[j].y *= ratio;

							// min
							if (standsZ[group] > lines[i].geometry.vertices[j].y)
								standsZ[group] = lines[i].geometry.vertices[j].y;
						}
					}

					lines[i].geometry.verticesNeedUpdate = true;
				}

				for (var i = 0; i < lines.length; i++) {
					var group = lines[i].group[key];
					var from = LabGL.Dynamic.currentPoints[key].point[group];

					if (group === 1) {
						var gap = from - standsZ[group];
						for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
							lines[i].geometry.vertices[j].y += gap;
						}
					}
					else if (group === 2) {
						for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
							lines[i].geometry.vertices[j].y += distance;
						}
					}

					lines[i].geometry.verticesNeedUpdate = true;

					//---------------------------------------------------------------
					// change stand
					// Z doesn't have to change stand
					//---------------------------------------------------------------
				}

				// reset camera and scene position
				/*LabGL2D.scene.position.z -= distance;
				LabGL2D.camera.position.y += distance * 2;*/
			}
		}
		else if (bid === 2) {
		}
		else if (bid === 3) {
		}
		else if (bid === 4) {
		}
		else if (bid === 5) {
		}
		else if (bid === 6) {
		}
		else if (bid === 7) {
		}
		else if (bid === 8) {
		}
		else if (bid === 9) {
		}
		else if (bid === 10) {
		}

		// fit scene's position
		/*var maxes = [0, 0];
		for (var i = 0; i < lines.length; i++) {
			for (var j = 0; j < lines[i].geometry.vertices.length; j++) {
				pointX = lines[i].geometry.vertices[j].x;
				pointY = lines[i].geometry.vertices[j].y;

				if (maxes[0] < pointX)
					maxes[0] = pointX;
				if (maxes[1] < pointY)
					maxes[1] = pointY;
			}
		}

		var moves = [0, 0];
		moves[0] = ((LabGL2D.Dynamic.previousMaxes[0] + LabGL2D.Dynamic.previousMins[0]) / -2) - LabGL2D.scene.position.x;
		moves[1] = ((LabGL2D.Dynamic.previousMaxes[1] + LabGL2D.Dynamic.previousMins[1]) / -2) - LabGL2D.scene.position.z;*/
	},

	expandCanvas: function () {
		$('#viewer2d').css('top', $('#viewer3d').offset().top);
		$('#expand_canvas').hide();
		$('#compress_canvas').show();

		LabGL2D.canvasWidth = LabGL3D.canvasWidth;
		LabGL2D.canvasHeight = LabGL3D.canvasHeight;

		LabGL2D.camera.aspect = LabGL2D.canvasWidth / LabGL2D.canvasHeight;
		LabGL2D.camera.updateProjectionMatrix();
		LabGL2D.renderer.setSize(LabGL2D.canvasWidth, LabGL2D.canvasHeight);

		//--------------------------------------------------------
		// set mouse position on changing window's size as scroll
		LabGL2D.setMouseClickedPoint();
		//--------------------------------------------------------
	},

	compressCanvas: function () {
		$('#viewer2d').css('top', LabGL.options.height3d - LabGL.options.height2d + $('#viewer3d').offset().top);
		$('#expand_canvas').show();
		$('#compress_canvas').hide();

		LabGL2D.canvasWidth = LabGL.options.width2d;
		LabGL2D.canvasHeight = LabGL.options.height2d;

		LabGL2D.camera.aspect = LabGL2D.canvasWidth / LabGL2D.canvasHeight;
		LabGL2D.camera.updateProjectionMatrix();
		LabGL2D.renderer.setSize(LabGL2D.canvasWidth, LabGL2D.canvasHeight);

		//--------------------------------------------------------
		// set mouse position on changing window's size as scroll
		LabGL2D.setMouseClickedPoint();
		//--------------------------------------------------------
	}
};
//=======================================================================================================================================================
