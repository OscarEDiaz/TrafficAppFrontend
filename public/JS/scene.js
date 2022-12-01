// -- { Initialize main Three.js components } --
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);

// Canvas size depends of the game-container div size
let canvas = document.getElementById('game');
let container = document.getElementById('game-container');

let renderer = new THREE.WebGLRenderer({canvas: canvas});

const controls = new THREE.OrbitControls( camera, renderer.domElement );

// Camera position attributes
let cam_y = 350.0;
let cam_z = 450.0;
let cam_x = 0.0;

camera.position.y = cam_y;
camera.position.z = cam_z;
camera.position.x = cam_x;
controls.update();

camera.lookAt(0, 0, 0);

// Scene lights
const light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add( light );

// Renderer attributes
// Sky box color
renderer.setClearColor(0x000000, 1);
renderer.setSize(container.offsetWidth, container.offsetHeight);

export {
    scene,
    camera,
    renderer,
    controls
}