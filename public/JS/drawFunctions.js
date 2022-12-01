// ----------- [ IMPORTS ] -----------
// -- { City data } --
import streetCoords from './cityData.js';

// ----------- [ DRAWING FUNCTIONS ] -----------
// -- { Draw roads } --
const drawRoads = (numberOfRoads, roadBlocks, angle, coords, orientation, scene) => {
  const streetTexture = new THREE.TextureLoader().load( '../textures/street_texture.jpeg' );
  let start;

  orientation == 'h' ? start = coords[0] : start = coords[2];

  for (let i = 0; i < numberOfRoads; i++) {
    for (let j = 0; j < roadBlocks; j++) {
      let street = new THREE.BoxGeometry(100, 0.1, 30);
      let streetMaterial = new THREE.MeshBasicMaterial({map: streetTexture});
      let streetMesh = new THREE.Mesh(street, streetMaterial);

      streetMesh.position.x = coords[0];
      streetMesh.position.y = coords[1];
      streetMesh.position.z = coords[2];

      streetMesh.rotation.y = angle; 

      // Add streets to scene
      console.log("yay");
      scene.add(streetMesh);

      orientation == 'h' ? coords[0] += 100 : coords[2] += 100;
    }
    
    coords[0] = start;

    if (numberOfRoads > 1) {
      orientation == 'h' ? coords[2] += 100 : coords[0] += 100;
    }
  }
}

// -- { Draw every intersection } --
const drawIntersections = (scene) => {
  const intersectionTexture = new THREE.TextureLoader().load( '../textures/intersection.png' );
  let intersectionX = -200;
  let intersectionY = 0.3;
  let intersectionZ = -200;

  let start = intersectionX;
  let cond = true;

  for (let rows = 0; rows < 6; rows++) {
    for (let columns = 0; columns < 5; columns++) {
      let intersection = new THREE.BoxGeometry(30, 0.1, 30);
      let intersectionMaterial = new THREE.MeshBasicMaterial({map: intersectionTexture});
      let intersectionMesh = new THREE.Mesh(intersection, intersectionMaterial);

      intersectionMesh.position.x = intersectionX;
      intersectionMesh.position.y = intersectionY;
      intersectionMesh.position.z = intersectionZ;

      if ((rows == 2 && columns == 2) || (rows == 2 && columns == 3)) { 
        cond = false;
      } 

      if (cond) {
        scene.add(intersectionMesh);
      }

      cond = true;
      intersectionX += 100;
    }
    intersectionX = start;
    intersectionZ += 100;
  }
}

const addRoads = (scene) => {
  for (const street in streetCoords) {
    let { start, dir, angle, nR, nB } = streetCoords[street];
    drawRoads(nR, nB, angle, start, dir, scene);
  }
}

const addIntersections = (scene) => {
  drawIntersections(scene);
}

export {
  addRoads,
  addIntersections
}