// ----------- [ IMPORTS ] -----------
// -- { Drawing functions } --
import { addRoads, addIntersections } from "./drawFunctions.js";

// -- { Main Three.js components } --
import { scene, camera, renderer, controls } from "./scene.js";

// ----------- [ HTTP REQUESTS DEPS ] -----------
const STEP_LOCATION = "/step";
const BASE_URL = "https://city-pipeline-lean-squirrel.mybluemix.net"; 

// Dictionary to store current objects
let objects = {
  "cars": {},
  "TL": {},
};

// -- { GLTF Loader } --
const loader3D = (type, id, path, scaleX, scaleY, scaleZ, scene) => {
  const LOADER = new THREE.GLTFLoader();
  LOADER.load(path, function ( gltf ) {
    objects[type][id] = gltf.scene;
    objects[type][id].scale.set(scaleX, scaleY, scaleZ);
    scene.add(objects[type][id]);
  }, undefined, function ( error ) {
    console.error( error );
  });
}

// ----------- [ MAIN RENDERER PROGRAM ] -----------
// -- { Start the simulation with a POST method } --
let init = () => {
  fetch(BASE_URL + "/simulation", {
    method: 'POST',
  }).then(response => {
    response.json().then((res) => {
      console.log(res)
    })
  });
}

// Load the map
init();

// Loading text
let loadingTimer = document.getElementById('load');

// Start the animation
let starterButton = document.getElementById('start');
starterButton.onclick = async () => {
  fetch(BASE_URL + STEP_LOCATION)
    .then((res) => {
      return res.json();
    }).
    then((res) => {
      let {body} = res;
      let {data} = JSON.parse(body);
      fillCarObjects(data);
      fillTlObjects(data);
    })
    .then(() => {
      loadingTimer.innerText = 'Loading...';
      render()
      setTimeout(() => {
        loadingTimer.innerText = ''; 
      }, 500)
    }
  );

}

// Works!!!

// -- { City model } --
let floorGeometry = new THREE.BoxGeometry(600, 0.1, 600);
let floorMaterial = new THREE.MeshBasicMaterial({color: 0x013017});
let floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

scene.add(floorMesh);

// Roads
addRoads(scene);

// Intersections
addIntersections(scene)

// -- { Animation configurations } --
// Refresh screen every 500 ms
const FRAMERATE = 1010; 
let previous_time = Date.now();


const fillCarObjects = (data) => {
    let { car_coords } = data[0]
    for (const id in car_coords) {
      loader3D('cars', id, './3D/car_models/car_1/scene.gltf', 3, 3, 3, scene);
    }
}

const fillTlObjects = (data) => {
    let { tl_data } = data[0]
    
    for (const id in tl_data ) {
      let tlLight = new THREE.BoxGeometry(10, 10, 10);
      let tlMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
      let tlMesh = new THREE.Mesh(tlLight, tlMaterial);
      objects['TL'][id] = tlMesh;
      scene.add(objects['TL'][id])
    }
  }


const updatePositions = (car_coords) => {
  for (const id in car_coords) {
    let { x, z, direction } = car_coords[id];
    if (direction == "left") {
      objects['cars'][id].rotation.y = Math.PI/2;
    } else if (direction == "right") {
      objects['cars'][id].rotation.y = (Math.PI*3)/2;
    } else if (direction == "down") {
      objects['cars'][id].rotation.y = 0;
    } else {
      objects['cars'][id].rotation.y = Math.PI;
    }
    objects['cars'][id].position.x = x;
    objects['cars'][id].position.z = z;
  }
}

const updateTrafficLights = (tl_data) => {
  for (const id in tl_data) {
    let { state } = tl_data[id]
    if (state == 'g') {
      objects['TL'][id].material.color = new THREE.Color(0x00FF00);
    } else if (state == 'r') {
      objects['TL'][id].material.color = new THREE.Color(0xFF0000);
    } else {
      objects['TL'][id].material.color = new THREE.Color(0xFFFF00);
    }
  }
}

const placeTL = (tl_data, renderer) => {
  for (const id in tl_data) {
    let { x, z, y } = tl_data[id]

    objects['TL'][id].position.x = x;
    objects['TL'][id].position.y = y;
    objects['TL'][id].position.z = z;

    renderer.render(scene, camera);
  }
}

let cond = true;
let step = 59;
let globalDATA = null;

// 60 FPS 
let render = async function () {
  let now, elapsed_time;

  now = Date.now();
  elapsed_time = now - previous_time;
  if (elapsed_time >= FRAMERATE) {
    // Prevent crashes
    if (STEP_LOCATION != ""){
      // Use GET method to retrieve coordinates
      fetch(BASE_URL + STEP_LOCATION)
        .then((res) => {
          globalDATA = null;
          return res.json();
        })
        .then((res) => {
          let { body } = res;
          let {data} = JSON.parse(body);
          globalDATA = data;
          step = 0;
          console.log(globalDATA)
          let { tl_data } = data[step]
          // Deestructure coordinates from the response
          if (cond) {
            placeTL(tl_data, renderer);
            cond = false;
          }
          
        });
      }
      previous_time = now;
  }
  console.log("between ifs")
  console.log(globalDATA)
  if (globalDATA != null && step < 60) {
    console.log(globalDATA);
    let { tl_data, car_coords } = globalDATA[step]
  
    updateTrafficLights(tl_data);
    updatePositions(car_coords);
    console.log(step);
  }
  step++;
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);

};