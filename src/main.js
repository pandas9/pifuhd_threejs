import * as THREE from './three.module.js';

import { OrbitControls } from './OrbitControls.js';

import { OBJLoader } from './OBJLoader.js';

let camera, controls, scene, renderer;

let object;

// opening rotate
let initRotate = 0;
let rotate = true;

const githubPages = true;

function chooseModel(n) {
    initRotate = 0;
    rotate = true;
    document.getElementById('model-image').src = '';
    document.getElementsByTagName('canvas')[0].remove();
    while (scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }

    if (n === 1) {
        init(githubPages ? './src/models/result_test2_512.obj' : './models/result_test2_512.obj');
    }
    
    if (n === 2) {
        init(githubPages ? './src/models/result_test3_512.obj' : './models/result_test3_512.obj');
    }

    if (n === 3) {
        init(githubPages ? './src/models/result_test4_512.obj' : './models/result_test4_512.obj');
    }
    
    animate();
}

document.getElementById( 'change-model-1' ).addEventListener( 'click', function() { chooseModel(1); } );
document.getElementById( 'change-model-2' ).addEventListener( 'click', function() { chooseModel(2); } );
document.getElementById( 'change-model-3' ).addEventListener( 'click', function() { chooseModel(3); } );

init();
//render(); // remove when using next line for animation loop (requestAnimationFrame)
animate();

function init(model=githubPages ? './src/models/result_test2_512.obj' : './models/result_test2_512.obj') {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    //scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(900, 0, 0);

    // controls

    controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window); // optional

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 100;
    controls.maxDistance = 500;

    //controls.maxPolarAngle = Math.PI / 2;

    // manager

    function loadModel() {

        object.traverse(function (child) {

            //if ( child.isMesh ) child.material.map = texture;

        });

        object.position.y = -15;
        scene.add(object);

    }

    const manager = new THREE.LoadingManager(loadModel);

    manager.onProgress = function (item, loaded, total) {

        document.getElementById('progress').innerHTML = `${item}, ${loaded}, ${total}`;
        document.getElementById('model-image').src = model.replace('obj', 'png');

    };

    // texture

    //const textureLoader = new THREE.TextureLoader( manager );
    //const texture = textureLoader.load( './textures/uv_grid_opengl.jpg' );

    // model

    function onProgress(xhr) {

        if (xhr.lengthComputable) {

            const percentComplete = xhr.loaded / xhr.total * 100;
            document.getElementById('progress').innerHTML = 'model ' + Math.round(percentComplete, 2) + '% downloaded';

        }

    }

    function onError() { }

    const loader = new OBJLoader(manager);
    loader.load(model, function (obj) {
        
        obj.scale.set( 200, 200, 200 );
        object = obj;

    }, onProgress, onError);

    // lights
    
    const dirLight1 = new THREE.DirectionalLight(0xffffff);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff);
    dirLight2.position.set(-1, -1, -1);
    scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0xffffff);
    dirLight3.position.set(0, 0, 0);
    scene.add(dirLight3);

    //const light = new THREE.PointLight( 0xffffff, 0.9 );
    //scene.add( light );

    window.addEventListener('resize', onWindowResize);

}

function initialRotation() {
    if (rotate) {
        initRotate++;
        if (initRotate <= 90) {
            object.rotation.y += Math.PI / 120;
        }

        if (initRotate === 90) rotate = false;
    }
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    render();

    if (object != null) {
        initialRotation();
    }
}

function render() {

    renderer.render(scene, camera);

}
