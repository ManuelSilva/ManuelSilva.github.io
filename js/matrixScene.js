/*------------------
Manuel Silva 

Matrix Effect - 2016

-------------------*/
var loading = true;
//WebGL detector ------------------------------------------
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
//---------------------------------------------------------

//stats-------------------------------
var container, stats;
//------------------------------------


//Time---------------------------------
var clock = new THREE.Clock();
//-------------------------------------
//Graphics Pipeline vars-------------------------
var camera_stt, scene_stt, renderer, composer;
var camera, scene, light;

//
var bufferTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearMipMapLinear, magFilter: THREE.NearestFilter});
var test_mesh;
var torus;
//-----------------------------------------------

//InceptionScene
var meta_camera, meta_scene;
var meta_bufferTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearMipMapLinear, magFilter: THREE.NearestFilter});;
var sphere, meta_background;



//shader ----------------------------------
var uniforms, letter_material;
//-----------------------------------------

//------------------------------------------------

var mouseX = 0, mouseY = 0,
lat = 0, lon = 0, phy = 0, theta = 0;

var width = window.innerWidth || 2;
var height = window.innerHeight || 2;

var windowHalfX = width / 2;
var windowHalfY = height / 2;

//-------------------------------------------------


prepare_Texture_Scene();
texture_Scene_Main_Loop();


//-------------------------------------------------

function prepare_Texture_Scene() {

	container = document.getElementById( 'container' );

	camera_stt = new THREE.PerspectiveCamera( 20, windowHalfX / windowHalfY, 1, 3000 );
	camera_stt.position.z = 20;

	scene_stt = new THREE.Scene();

	// binary shader set up ---------------------------------------------------------------------------

	uniforms = {

		fogDensity: { type: "f", value: 0.01 },
		fogColor: { type: "v3", value: new THREE.Vector3( 0, 1, 0 ) },
		time: { type: "f", value: 1.0 },
		resolution: { type: "v2", value: new THREE.Vector2() },
		uvScale: { type: "v2", value: new THREE.Vector2( 0.3, 0.3 ) },
		texture1: { type: "t", value: THREE.ImageUtils.loadTexture( "../textures/binarytile2.png" ) },
		texture2: { type: "t", value: THREE.ImageUtils.loadTexture( "../textures/binarytile1.png" ) }

	};


	uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
	uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

	var size = 0.65;

	letter_material = new THREE.ShaderMaterial( {

		uniforms: uniforms,
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent

	} );

	uniforms2 = {

		fogDensity: { type: "f", value: 0.01 },
		fogColor: { type: "v3", value: new THREE.Vector3( 0, 1, 0 ) },
		time: { type: "f", value: 1.0 },
		resolution: { type: "v2", value: new THREE.Vector2() },
		uvScale: { type: "v2", value: new THREE.Vector2( 3.0, 1.0 ) },
		texture1: { type: "t", value: THREE.ImageUtils.loadTexture( "../textures/binarytile2.png" ) },
		texture2: { type: "t", value: THREE.ImageUtils.loadTexture( "../textures/binarytile1.png" ) }
	};


	uniforms2.texture1.value.wrapS = uniforms2.texture1.value.wrapT = THREE.RepeatWrapping;
	uniforms2.texture2.value.wrapS = uniforms2.texture2.value.wrapT = THREE.RepeatWrapping;

	var size = 0.65;

	material2 = new THREE.ShaderMaterial( {

		uniforms: uniforms2,
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent

	} );


	//-------------------------------------------------------------------------------------------------


	//inside the cube code
	//LOAD ALL LETTERS---------------------------------------------------------------------------------

	load_And_Draw(letter_material);

	background = new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshBasicMaterial({color: 0x000000}));
	background.z = -30;
	scene_stt.add(background);

	//-------------------------------------------------------------------------------------------------
	//outside the cube code

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 20, windowHalfX / windowHalfY, 1, 3000 );
	camera.position.z = 30;
	camera.zoom = 0;

	test_mesh = new THREE.Mesh( new THREE.BoxGeometry(4,4,4),
								new THREE.MeshBasicMaterial({map:bufferTexture.texture}));
	scene.add(test_mesh);

	torus = new THREE.Mesh(new THREE.TorusGeometry(4.5,0.7), material2);
	torus.position.set(0,0,0)
	scene.add(torus);


	//-----------------------------------------------------------------------------------------------

	meta_scene = new THREE.Scene();
	meta_camera = new THREE.PerspectiveCamera( 20, windowHalfX / windowHalfY, 1, 3000 );
	meta_camera.position.z = 30;

	sphere = new THREE.Mesh( new THREE.BoxGeometry(5,5,5),
								new THREE.MeshBasicMaterial({map:meta_bufferTexture.texture}));
	meta_scene.add(sphere);

	meta_background = new THREE.Mesh(new THREE.PlaneGeometry(50,50), new THREE.MeshBasicMaterial({map:bufferTexture}));
	meta_background.position.z = -30;

	meta_scene.add(meta_background);


	//-------------------------------------------------------------------------------------------------
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor(new THREE.Color(0x000000));

	container.appendChild( renderer.domElement );

	renderer.autoClear = true;


	//STATS-------------------------------------

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	//------------------------------------------



	//POST PROCESSING SET UP will remove for now ------------------------------------------
	
	//var renderModel = new THREE.RenderPass( scene, camera );

	//effectFilm.renderToScreen = true;

	//composer = new THREE.EffectComposer( renderer);

	//composer.addPass( renderModel );
	
	//-----------------------------------------------------------------

	//input Listeners -------------------------------------------------

	onWindowResize();

	window.addEventListener( 'resize', onWindowResize, false );

	//-----------------------------------------------------------------}}
}

//Texture Main Loop ------------------------------------------------

function texture_Scene_Main_Loop() {

	//Request next Frame
	requestAnimationFrame( texture_Scene_Main_Loop );

	var delta = 5 * clock.getDelta();

	if(!loading){

		//Update objects-----------------------------------------

		rain(delta);
		test_mesh.rotation.y += 0.05 * delta; 
		torus.rotation.x += 0.05 * delta;
		torus.rotation.z += 0.05 * delta;
		sphere.rotation.x += 0.05 * delta;
		sphere.rotation.y += 0.05 * delta;

		//-------------------------------------------------------
		
		//Render------------------------------------------------

		render(delta);
		stats.update();
	}
	//document.getElementById('info').innerHTML = '<br>Loading - ' + ((lettersLoaded / numberOfLetters) * 100).toString();

	//------------------------------------------------------}
}
//render-------------------------------------------------------------


function render(delta) {


	uniforms.time.value += 0.05 * delta;
	uniforms2.time.value += 0.1 * delta;

	renderer.clear();
	
	renderer.render(scene_stt, camera_stt, bufferTexture);
	renderer.render(scene, camera, meta_bufferTexture);
	renderer.render(meta_scene, meta_camera);
	//composer.render( 0.01 );
}

//-------------------------------------------------------------------



//EVENT LISTENERS -----------------------------------------------------------------------------

function onWindowResize( event ) {

	uniforms.resolution.value.x = window.innerWidth;
	uniforms.resolution.value.y = window.innerHeight;
	uniforms2.resolution.value.x = window.innerWidth;
	uniforms2.resolution.value.y = window.innerHeight;

	renderer.setSize( window.innerWidth, window.innerHeight );

	//camera_stt.aspect = window.innerWidth / window.innerHeight;
	//camera_stt.updateProjectionMatrix();

	//camera.aspect = window.innerWidth / window.innerHeight;
	//camera.updateProjectionMatrix();

	meta_camera.aspect = window.innerWidth / window.innerHeight;
	meta_camera.updateProjectionMatrix();

	//composer.reset();
	//post processing

}