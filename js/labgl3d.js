//=======================================================================================================================================================
// WebGL Base
var LabGL3D = {
	idAnimate: null,
	canvasWidth: 0,
	canvasHeight: 0,
	container: null,
	renderer: null,
	scene: null,
	camera: null,
	controls: null,
	lights: { ambient: null, direct: null, spot1: null, spot2: null, spot3: null, spot4: null, spot5: null },
	marginLeft: 0,
	marginTop: 0,
	raycaster: null,
	mouse: null,
	time: { start: 0, end: 0 },
	stats: null,

	release: function () {
		cancelAnimationFrame(LabGL3D.idAnimate);
	},

	// calculate mouse position
	setMouseClickedPoint: function () {
		// checkpoint : left/right scroll, window size change, webpage's area per whole browser screen, part exclusive of webgl
		var scrollLeft = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft;
		var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;

		this.marginLeft = $('#viewer3d').offset().left - scrollLeft;
		this.marginTop = $('#viewer3d').offset().top - scrollTop;
	},

	// canvas init
	init: function () {
		//----------------------------------------------------
		// create container
		this.container = document.getElementById('viewer3d');
		//----------------------------------------------------

		//--------------------------------------------------------
		// set mouse position on changing window's size as scroll
		LabGL3D.setMouseClickedPoint();
		//--------------------------------------------------------

		//------------------------------
		// scene
		this.scene = new THREE.Scene();
		this.scene.position.y += Properties.d3[bid].positionY
		//------------------------------

		//------------------------------------------------------------------------------------------------------------------
		// camera
		this.camera = new THREE.PerspectiveCamera(
			50,										// field of view
			this.canvasWidth / this.canvasHeight,	// aspect ratio
			0.1,									// near
			Properties.d3[bid].camera[1] * 30 / 2			// far
		);

		this.camera.position.set(Properties.d3[bid].camera[0], Properties.d3[bid].camera[1], Properties.d3[bid].camera[2]);
		this.camera.lookAt(this.scene.position);

		var geometry = new THREE.SphereGeometry(5, 20, 20);
		var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
		var sphere = new THREE.Mesh(geometry, material);
		sphere.position.set(0, 0, 0);
		this.scene.add(sphere);
		//------------------------------------------------------------------------------------------------------------------

		//-----------------------------------------------------------------------------------------------------------
		// light
		this.lights.ambient = new THREE.AmbientLight(0xffffff);
		this.lights.ambient.intensity = Properties.d3.intensity;
		this.scene.add(this.lights.ambient);

		this.lights.direct = new THREE.DirectionalLight(0xffffff);
		this.lights.direct.intensity = Properties.d3.intensity;
		this.lights.direct.position.set(10, Properties.d3.light[1], 10);
		this.lights.direct.castShadow = true;
		this.lights.direct.shadow.camera.near = 0.1;
		this.lights.direct.shadow.camera.far = this.camera.far;
		this.lights.direct.shadow.camera.left = -Properties.d3[bid].camera[1] * 2;
		this.lights.direct.shadow.camera.right = Properties.d3[bid].camera[1] * 2;
		this.lights.direct.shadow.camera.top = Properties.d3[bid].camera[1] * 2;
		this.lights.direct.shadow.camera.bottom = -Properties.d3[bid].camera[1] * 2;
		this.lights.direct.shadow.mapSize.width = this.canvasWidth;
		this.lights.direct.shadow.mapSize.height = this.canvasHeight;
		this.lights.direct.shadow.bias = 0.0001;
		this.scene.add(this.lights.direct);

		this.lights.spot1 = new THREE.SpotLight(0xffffff);
		this.lights.spot1.intensity = 3;
		this.lights.spot1.position.set(Properties.d3.light[0], Properties.d3.light[1], 0);
		this.scene.add(this.lights.spot1);

		this.lights.spot2 = new THREE.SpotLight(0xffffff);
		this.lights.spot2.intensity = 1;
		this.lights.spot2.position.set(-Properties.d3.light[0], Properties.d3.light[1], 0);
		this.scene.add(this.lights.spot2);

		this.lights.spot3 = new THREE.SpotLight(0xffffff);
		this.lights.spot3.intensity = 1;
		this.lights.spot3.position.set(0, Properties.d3.light[1], -Properties.d3.light[0]);
		this.scene.add(this.lights.spot3);

		this.lights.spot4 = new THREE.SpotLight(0xffffff);
		this.lights.spot4.intensity = 3;
		this.lights.spot4.position.set(0, Properties.d3.light[1], Properties.d3.light[0]);
		this.scene.add(this.lights.spot4);

		this.lights.spot5 = new THREE.SpotLight(0xffffff);
		this.lights.spot5.intensity = 2;
		this.lights.spot5.position.set(0, 0, 0);
		this.scene.add(this.lights.spot5);

		/*var geometry = new THREE.SphereGeometry(10, 20, 20);
		var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
		var sphere = new THREE.Mesh(geometry, material);
		sphere.position.copy(this.lights.spot5.position);
		this.scene.add(sphere);*/
		//-----------------------------------------------------------------------------------------------------------

		//-----------------------------------------------------------------------------------------------------------
		// renderer
		// set antialias true to get smoother output 
		// set preserveDrawingBuffer true to allow screenshot
		if (LabGL.Function.isMobile())
			this.renderer = new THREE.WebGLRenderer({ antialias: true/*, alpha: true*/ });
		else
			this.renderer = new THREE.WebGLRenderer({ antialias: true/*, alpha: true*/, preserveDrawingBuffer: true });
		this.renderer.setClearColor(Properties.d3.color.renderer, 1/*0*/);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.canvasWidth, this.canvasHeight);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.physicallyCorrectLights = true;
		this.renderer.gammaInput = true;
		this.renderer.gammaOutput = true;
		this.renderer.toneMapping = THREE.ReinhardToneMapping;
		this.renderer.toneMappingExposure = Math.pow(1.41, 5.0);
		this.container.appendChild(this.renderer.domElement);
		//-----------------------------------------------------------------------------------------------------------

		//---------------------------------------
		// mouse position
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		//---------------------------------------

		//-------------------------------------------------------------------------------
		// controller
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		LabGL3D.Dynamic.setControlLimit(false);
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

			var geometry = new THREE.SphereGeometry(10, 20, 20);
			var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
			var sphere = new THREE.Mesh(geometry, material);
			sphere.position.copy(this.lights.spot5.position);
			this.scene.add(sphere);

			this.stats = new Stats();
			this.stats.dom.style.top = '48px';
			document.body.append(this.stats.dom);

			this.scene.add(new THREE.CameraHelper(this.lights.direct.shadow.camera));
			var geometry = new THREE.SphereGeometry(1, 20, 20);
			var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
			var sphere = new THREE.Mesh(geometry, material);
			sphere.position.copy(this.lights.direct.position);
			this.scene.add(sphere);
		}
		//----------------------------------------------------------------------------
	},

	animate: function () {
		LabGL3D.idAnimate = requestAnimationFrame(LabGL3D.animate);

		if (LabGL3D.controls)
			LabGL3D.controls.update();

		if (LabGL3D.renderer)
			LabGL3D.renderer.render(LabGL3D.scene, LabGL3D.camera);

		if (LabGL3D.Dynamic.animations.on)
			TWEEN.update();

		if (LabGL3D.stats)
			LabGL3D.stats.update();

//		if (LabGL3D.Loader.objects[1])
//			LabGL3D.Loader.objects[1].rotation.y += 0.01;
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

		LabGL3D.mouse.x = ((x - LabGL3D.marginLeft) / LabGL3D.canvasWidth) * 2 - 1;
		LabGL3D.mouse.y = -((y - LabGL3D.marginTop) / LabGL3D.canvasHeight) * 2 + 1;

		LabGL3D.raycaster.setFromCamera(LabGL3D.mouse, LabGL3D.camera);
		var intersects = LabGL3D.raycaster.intersectObjects(LabGL3D.Dynamic.intersects, true);

		if (intersects.length > 0) {
			var intersection = intersects[0];
			var intersect = intersection.object;

			LabGL3D.container.style.cursor = 'pointer';
		}
		else {
			LabGL3D.container.style.cursor = 'default';
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

			LabGL3D.mouse.x = ((x - LabGL3D.marginLeft) / LabGL3D.canvasWidth) * 2 - 1;
			LabGL3D.mouse.y = -((y - LabGL3D.marginTop) / LabGL3D.canvasHeight) * 2 + 1;

			LabGL3D.raycaster.setFromCamera(LabGL3D.mouse, LabGL3D.camera);
			var intersects = LabGL3D.raycaster.intersectObjects(LabGL3D.Dynamic.intersects, true);

			if (intersects.length > 0) {
				var intersection = intersects[0];
				var intersect = intersection.object;
			}
			else {
			}
		}
		else
			LabGL3D.time.start = new Date().getTime();
	},

	onDocumentMouseUp: function (event) {
		if (LabGL.Function.isMobile())
			return;

		// prevent duplicated event: orbit mouse moving > mouseup into intersect
		LabGL3D.time.end = new Date().getTime();
		if (LabGL3D.time.end - LabGL3D.time.start > 500)
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

		LabGL3D.mouse.x = ((x - LabGL3D.marginLeft) / LabGL3D.canvasWidth) * 2 - 1;
		LabGL3D.mouse.y = -((y - LabGL3D.marginTop) / LabGL3D.canvasHeight) * 2 + 1;

		LabGL3D.raycaster.setFromCamera(LabGL3D.mouse, LabGL3D.camera);
		var intersects = LabGL3D.raycaster.intersectObjects(LabGL3D.Dynamic.intersects, true);

		if (intersects.length > 0) {
			var intersection = intersects[0];
			var intersect = intersection.object;

			LabGL3D.Dynamic.currentIdx = intersect.idx;
		}
		else
			LabGL3D.container.style.cursor = 'default';
	}
};
//=======================================================================================================================================================

//=======================================================================================================================================================
// Loader
LabGL3D.Loader = {
	objects: [[], [], [], [], [], [], [], [], [], []],
	labels: [
		{ label: null, position: [0, 155], value: 260 },
		{ label: null, position: [150, 0], value: 266 }
	],
	floor: null,
	box: null,

	setCenterPosition: function () {
		var center = new THREE.Box3().setFromObject(this.box).getCenter(this.box.position).multiplyScalar(-1);
		this.box.position.set(center.x, 0, center.z);
	},

	loadBox: function () {
		var loader = new THREE.ColladaLoader();
		loader.load(
			'box/' + Properties.d3[bid].file,
			function (collada) {
				LabGL3D.Loader.box = collada.scene;
				LabGL3D.Loader.box.traverse(function (child) {
					//----------------------------------------------------------------------------------------------------------------------
					// materials
					if (child instanceof THREE.Mesh) {
						child.castShadow = true;	// shadow subject
						child.material.side = THREE.DoubleSide;

						if (bid === 1) {
							var edge = new THREE.LineSegments(
								new THREE.EdgesGeometry(child.geometry.clone()),
								new THREE.LineBasicMaterial({ color: Properties.d3.color.line })
							);
							child.add(edge);

							if (child.name === 'group_3') {
								child.position.y += 1.946;
								child.position.z -= 11.02;
								LabGL3D.Loader.objects[bid - 1]['lip1'] = new THREE.Object3D();
								LabGL3D.Loader.objects[bid - 1]['lip1'].add(child.clone());
								child.visible = false;

								LabGL3D.Loader.objects[bid - 1]['lip1'].position.y -= 1.946;
								LabGL3D.Loader.objects[bid - 1]['lip1'].position.z += 11.02;
								child.parent.add(LabGL3D.Loader.objects[bid - 1]['lip1']);
							}

							if (child.name === 'group_0') {
								child.rotation.y = 0.1;
							}

							if (child.name === 'group_1') {
								child.rotation.y = -0.1;
							}
						}
						else if (bid === 2) {
							var edge = new THREE.LineSegments(
								new THREE.EdgesGeometry(child.geometry.clone()),
								new THREE.LineBasicMaterial({ color: Properties.d3.color.line })
							);
							child.add(edge);

							if (child.name === 'group_3') {
								child.position.y += 1.946;
								child.position.z -= 11.02;
								LabGL3D.Loader.objects[bid - 1]['lip1'] = new THREE.Object3D();
								LabGL3D.Loader.objects[bid - 1]['lip1'].add(child.clone());
								child.visible = false;

								LabGL3D.Loader.objects[bid - 1]['lip1'].position.y -= 1.946;
								LabGL3D.Loader.objects[bid - 1]['lip1'].position.z += 11.02;
								child.parent.add(LabGL3D.Loader.objects[bid - 1]['lip1']);
							}

							if (child.name === 'group_0') {
								child.rotation.y = -0.1;
							}

							if (child.name === 'group_1') {
								child.rotation.y = 0.1;
							}

							console.log(child);
						}
						else if (bid === 3) {
							var edge = new THREE.LineSegments(
								new THREE.EdgesGeometry(child.geometry.clone()),
								new THREE.LineBasicMaterial({ color: Properties.d3.color.line })
							);
							child.add(edge);

							/*if (child.name === 'group_3') {
								child.position.y += 1.946;
								child.position.z -= 11.02;
								LabGL3D.Loader.objects[bid - 1]['lip1'] = new THREE.Object3D();
								LabGL3D.Loader.objects[bid - 1]['lip1'].add(child.clone());
								child.visible = false;

								LabGL3D.Loader.objects[bid - 1]['lip1'].position.y -= 1.946;
								LabGL3D.Loader.objects[bid - 1]['lip1'].position.z += 11.02;
								child.parent.add(LabGL3D.Loader.objects[bid - 1]['lip1']);

								LabGL3D.Loader.box.children[0].children[1].rotation.y = 0.1;
								LabGL3D.Loader.box.children[0].children[2].rotation.y = -0.1;
							}

							if (child.name === 'group_0') {
								child.rotation.y = 0.1;
								LabGL3D.Loader.box.children[0].children[2].rotation.y = -0.1;
							}

							if (child.name === 'group_1') {
								child.rotation.y = -0.1;
							}*/
						}
					}

					if (child instanceof THREE.LineSegments) {
						child.material.color = new THREE.Color(Properties.d3.color.line);
					}
					//----------------------------------------------------------------------------------------------------------------------
				});

				LabGL3D.Loader.box.scale.set(Properties.d3[bid].scale, Properties.d3[bid].scale, Properties.d3[bid].scale);
				LabGL3D.Loader.box.updateMatrix();
				LabGL3D.scene.add(LabGL3D.Loader.box);

				//console.log(LabGL3D.Loader.box.children[0].children);
				//console.log(LabGL3D.scene);

				//LabGL3D.Loader.setCenterPosition();
			}
		);
	},

	loadLabels: function () {
		for (var i = 0; i < this.labels.length; i++) {
			this.loadLabel(i);
		}
	},

	// https://manu.ninja/webgl-three-js-annotations
	loadLabel: function (i) {
		if (i > 1)
			return;

		var label = document.createElement('canvas');
		label.width = 64;
		label.height = 64;

		var context = label.getContext('2d');
		var x = 32;
		var y = 32;
		var radius = 30;
		var startAngle = 0;
		var endAngle = Math.PI * 2;

		context.fillStyle = 'rgb(0, 0, 0)';
		context.beginPath();
		context.arc(x, y, radius, startAngle, endAngle);
		context.fill();

		context.fillStyle = 'rgb(255, 255, 255)';
		context.font = '24px arial';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillText(this.labels[i].value, x, y);

		var numberTexture = new THREE.CanvasTexture(label);

		var spriteMaterial = new THREE.SpriteMaterial({
			map: numberTexture,
			transparent: true,
			opacity: 0.8
		});

		this.labels[i].label = new THREE.Sprite(spriteMaterial);
		this.labels[i].label.idx = i;
		this.labels[i].label.name = 'label_' + i;
		this.labels[i].label.position.set(this.labels[i].position[0], 200, this.labels[i].position[1]);
		this.labels[i].label.scale.set(30, 30, 1);

		LabGL3D.scene.add(this.labels[i].label);
	},

	loadFloor: function () {
		var geometry = new THREE.PlaneBufferGeometry(10000, 10000);

		this.floor = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Properties.d3.color.floor, transparent: true, opacity: 0.3 }));
		this.floor.rotateX(-Math.PI / 2);
		this.floor.position.y -= 10;
		this.floor.receiveShadow = true;

		LabGL3D.scene.add(this.floor);
	}
};
//=======================================================================================================================================================

//=======================================================================================================================================================
// Dynamic
LabGL3D.Dynamic = {
	currentIdx: -1,
	controlLimit: false,
	intersects: [],
	animations: { on: false, status: 'close' },

	setControlLimit: function (controlLimit) {
		this.controlLimit = controlLimit;

		if (controlLimit) {
			if (LabGL3D.controls) {
				LabGL3D.controls.minPolarAngle = Properties.d3.angle[0];
				LabGL3D.controls.maxPolarAngle = Properties.d3.angle[1];
				LabGL3D.controls.minAzimuthAngle = Properties.d3.angle[2];
				LabGL3D.controls.maxAzimuthAngle = Properties.d3.angle[3];
				LabGL3D.controls.minDistance = Properties.d3[bid].distance[0];
				LabGL3D.controls.maxDistance = Properties.d3[bid].distance[1];
			}
		}
		else {
			if (LabGL3D.controls) {
				LabGL3D.controls.minPolarAngle = 0;
				LabGL3D.controls.maxPolarAngle = Math.PI;
				LabGL3D.controls.minAzimuthAngle = -Infinity;
				LabGL3D.controls.maxAzimuthAngle = Infinity;
				LabGL3D.controls.minDistance = 0;
				LabGL3D.controls.maxDistance = Infinity;
			}
		}
	},

	changeColor: function () {
		var color = $('#box_color').val();

		LabGL3D.Loader.box.traverse(function (child) {
			if (child instanceof THREE.Mesh)
				child.material.specular = child.material.color = new THREE.Color(String(color));
		});
	},

	autoRotate: function () {
		if (LabGL3D.controls.autoRotate)
			LabGL3D.controls.autoRotate = false;
		else
			LabGL3D.controls.autoRotate = true;
	},

	openLip: function () {
		console.log(this.animations);
		if (this.animations.on)
			return;

		if (this.animations.status === 'open')
			return;

		// https://discourse.threejs.org/t/how-to-rotate-an-object-around-a-pivot-point/6838
		this.animations.on = true;
		var duration = 500;

		if (bid === 1) {
			var radian = 2.57;
			var object1 = LabGL3D.Loader.box.children[0].children[5];
			var object2 = LabGL3D.Loader.box.children[0].children[1];
			var object3 = LabGL3D.Loader.box.children[0].children[2];

			object1.scale.y *= 0.95;

			this.tween = new TWEEN.Tween(object1.rotation)
			.to({ x: radian }, duration)
			.easing(TWEEN.Easing.Quadratic.In)
			.onUpdate (function () {
			})
			.onComplete (function () {
				object1.scale.y /= 0.95;

				var tween = new TWEEN.Tween(object2.rotation)
				.to({ y: -radian }, duration)
				.easing(TWEEN.Easing.Quadratic.In)
				.onUpdate (function () {
				})
				.onComplete (function () {
				})
				.start();

				var tween = new TWEEN.Tween(object3.rotation)
				.to({ y: radian }, duration)
				.easing(TWEEN.Easing.Quadratic.In)
				.onUpdate (function () {
				})
				.onComplete (function () {
					LabGL3D.Dynamic.animations.on = false;
					LabGL3D.Dynamic.animations.status = 'open';
				})
				.start();
			})
			.start();
		}
		else if (bid === 2) {
			var radian = 2.57;
			var object1 = LabGL3D.Loader.box.children[0].children[5];
			var object2 = LabGL3D.Loader.box.children[0].children[1];
			var object3 = LabGL3D.Loader.box.children[0].children[2];

			object1.scale.y *= 0.95;

			this.tween = new TWEEN.Tween(object1.rotation)
			.to({ x: radian }, duration)
			.easing(TWEEN.Easing.Quadratic.In)
			.onUpdate (function () {
			})
			.onComplete (function () {
				object1.scale.y /= 0.95;

				/*var tween = new TWEEN.Tween(object2.rotation)
				.to({ y: radian }, duration)
				.easing(TWEEN.Easing.Quadratic.In)
				.onUpdate (function () {
				})
				.onComplete (function () {
				})
				.start();

				var tween = new TWEEN.Tween(object3.rotation)
				.to({ y: -radian }, duration)
				.easing(TWEEN.Easing.Quadratic.In)
				.onUpdate (function () {
				})
				.onComplete (function () {
					LabGL3D.Dynamic.animations.on = false;
					LabGL3D.Dynamic.animations.status = 'open';
				})
				.start();*/
			})
			.start();
		}
	},

	closeLip: function () {
		console.log(this.animations);
		if (this.animations.on)
			return;

		if (this.animations.status === 'close')
			return;

		// https://discourse.threejs.org/t/how-to-rotate-an-object-around-a-pivot-point/6838
		this.animations.on = true;
		var duration = 500;

		if (bid === 1) {
			var object2 = LabGL3D.Loader.box.children[0].children[1];
			var object3 = LabGL3D.Loader.box.children[0].children[2];
			var object1 = LabGL3D.Loader.box.children[0].children[5];

			var tween = new TWEEN.Tween(object2.rotation)
			.to({ y: 0.1 }, duration)
			.easing(TWEEN.Easing.Quadratic.In)
			.onUpdate (function () {
			})
			.onComplete (function () {
			})
			.start();

			var tween = new TWEEN.Tween(object3.rotation)
			.to({ y: -0.1 }, duration)
			.easing(TWEEN.Easing.Quadratic.In)
			.onUpdate (function () {
			})
			.onComplete (function () {
				this.tween = new TWEEN.Tween(object1.rotation)
				.to({ x: 0 }, duration)
				.easing(TWEEN.Easing.Quadratic.In)
				.onUpdate (function () {
				})
				.onComplete (function () {
					LabGL3D.Dynamic.animations.on = false;
					LabGL3D.Dynamic.animations.status = 'close';
				})
				.start();
			})
			.start();
		}
	},

	changeSize: function (key, size) {
		var orgLength = LabGL.Dynamic.currentSizes[key];
		var ratio = size / orgLength;
		var distance = size - orgLength;
		LabGL3D.Loader.box.scale[key] *= ratio;

		if (bid === 1) {
			var object2 = LabGL3D.Loader.box.children[0].children[1];
			var object3 = LabGL3D.Loader.box.children[0].children[2];

			if (key === 'x') {
				object2.scale.y /= ratio;
				object3.scale.y /= ratio;
			}
			else if (key === 'z') {
				/*if (size > 500) {
					LabGL3D.scene.position.y -= distance * 0.5;
					LabGL3D.camera.position.x += distance;
					LabGL3D.camera.position.z -= distance;
				}*/
			}

			//LabGL3D.Loader.box.children[0].children[1].scale[key] *= ratio;
		}


		//LabGL3D.Loader.setCenterPosition();

		//LabGL3D.Loader.objects[0].scale.y = 2;
		//-------------------------------------------------------------------------------------------------------------------------------------------------
		// origin values
		/*var oLength = LabGL3D.Loader.lineGeometries[this.currentIdx][0].vertices[0].distanceTo(LabGL3D.Loader.lineGeometries[this.currentIdx][0].vertices[1]);
		var gap = size - oLength;

		// change lines
		//----------------------------------------------------------------------
		if (this.currentIdx === 0) {
			LabGL3D.Loader.lineGeometries[0][0].vertices[1].x += gap;
		}
		else if (this.currentIdx === 1) {
			LabGL3D.Loader.lineGeometries[1][0].vertices[1].z += gap;
			LabGL3D.Loader.lineGeometries[1][1].vertices[1].z += gap;

			LabGL3D.Loader.lineGeometries[2][0].vertices[1].z += gap;

			LabGL3D.Loader.lineGeometries[4][0].vertices[0].z += gap;
			LabGL3D.Loader.lineGeometries[4][0].vertices[1].z += gap;
		}
		else if (this.currentIdx === 2) {
		}
		else if (this.currentIdx === 3) {
		}
		else if (this.currentIdx === 4) {
		}
		else if (this.currentIdx === 5) {
		}

		for (var i = 0; i < LabGL3D.Loader.lineGeometries.length; i++) {
			for (var j = 0; j < LabGL3D.Loader.lineGeometries[i].length; j++)
				LabGL3D.Loader.lineGeometries[i][j].verticesNeedUpdate = true;
		}

		//----------------------------------------------------------------------
		// change boxes
		for (var i = 0; i < LabGL3D.Loader.boxes.length; i++) {
			for (var j = 0; j < LabGL3D.Loader.boxes[i].length; j++) {
				var name = LabGL3D.Loader.boxes[i][j].name;
				var target = LabGL3D.scene.getObjectByName(name);
				if (target)
					LabGL3D.scene.remove(target);
			}
		}

		LabGL3D.Loader.loadBoxes();*/

		/*var ratio = size / oLength;
		for (var i = 0; i < LabGL3D.Loader.lineGeometries.length; i++) {
			for (var j = 0; j < LabGL3D.Loader.lineGeometries[i].length; j++) {
				LabGL3D.Loader.boxes[i][j].scale.z *= ratio;
				LabGL3D.Loader.boxes[i][j].position.copy(LabGL3D.Loader.lineGeometries[i][j].vertices[0]);
				LabGL3D.Loader.boxes[i][j].lookAt(LabGL3D.Loader.lineGeometries[i][j].vertices[1]);
			}
		}*/

		//----------------------------------------------------------------------
		// change dash's position
		/*if (this.currentIdx === 0) {
			LabGL3D.Loader.dashes[0][0].geometry.vertices[1].x += gap;
		}
		else if (this.currentIdx === 1) {
			LabGL3D.Loader.dashes[1][0].geometry.vertices[1].z += gap;
		}
		else if (this.currentIdx === 2) {
		}
		else if (this.currentIdx === 3) {
		}
		else if (this.currentIdx === 4) {
		}
		else if (this.currentIdx === 5) {
		}

		for (var i = 0; i < LabGL3D.Loader.dashes.length; i++) {
			for (var j = 0; j < LabGL3D.Loader.dashes[i].length; j++)
				LabGL3D.Loader.dashes[i][j].geometry.verticesNeedUpdate = true;
		}

		//----------------------------------------------------------------------
		// change label's value
		for (var i = 0; i < LabGL3D.Loader.labels[this.currentIdx].length; i++) {
			if (LabGL3D.Loader.labels[this.currentIdx][i].label) {
				var name = LabGL3D.Loader.labels[this.currentIdx][i].label.name;
				var target = LabGL3D.scene.getObjectByName(name);
				if (target)
					LabGL3D.scene.remove(target);

				var ids = name.split('_');
				var idx = ids[1];
				var jdx = ids[2];
				LabGL3D.Loader.loadLabel(idx, jdx, size);
			}
		}

		// change label's position
		if (this.currentIdx === 0) {
			LabGL3D.Loader.labels[0][0].position[0] += gap / 2;
			LabGL3D.Loader.labels[0][0].label.position.x += gap / 2;
		}
		else if (this.currentIdx === 1) {
			LabGL3D.Loader.labels[1][0].position[2] += gap / 2;
			LabGL3D.Loader.labels[1][0].label.position.z += gap / 2;
		}
		else if (this.currentIdx === 2) {
		}
		else if (this.currentIdx === 3) {
		}
		else if (this.currentIdx === 4) {
		}
		else if (this.currentIdx === 5) {
		}*/
	}
};
//=======================================================================================================================================================
