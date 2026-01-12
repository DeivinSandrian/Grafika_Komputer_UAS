import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { texture } from 'three/tsl';

var loader = new GLTFLoader();
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 13, 10);

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
document.body.appendChild(renderer.domElement);

// var controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 1.7, 8); // tinggi mata
camera.lookAt(0, 1.7, 0);

const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

window.addEventListener('keydown', (e) => {
    if (keys[e.key] !== undefined) keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    if (keys[e.key] !== undefined) keys[e.key] = false;
});

let yaw = 0;
let pitch = 0;
const mouseSensitivity = 0.002;

document.body.addEventListener('click', () => {
    document.body.requestPointerLock();
});

document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === document.body) {
        yaw -= e.movementX * mouseSensitivity;
        pitch -= e.movementY * mouseSensitivity;

        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));

        camera.rotation.set(pitch, yaw, 0);
    }
});

function updateMovement() {
    const speed = 0.08;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    if (keys.w || keys.ArrowUp) {
        camera.position.add(forward.clone().multiplyScalar(speed));
    }
    if (keys.s || keys.ArrowDown) {
        camera.position.add(forward.clone().multiplyScalar(-speed));
    }
    if (keys.a || keys.ArrowLeft) {
        camera.position.add(right.clone().multiplyScalar(-speed));
    }
    if (keys.d || keys.ArrowRight) {
        camera.position.add(right.clone().multiplyScalar(speed));
    }

    // Kunci tinggi kamera (biar tidak terbang)
    camera.position.y = 1.7;
}


var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// var pointLight = new THREE.PointLight(0xffffff, 3);
// pointLight.position.set(0, 5, 0);
// scene.add(pointLight);
// scene.add(new THREE.PointLightHelper(pointLight, 0.2, 0x00ff00));

var spotLight = new THREE.SpotLight(
    0xffffff,       // Warna cahaya
    250,            // Intensitas cahaya
    12,             // Jarak maksimum cahaya
    Math.PI / 6);   // Sudut penyebaran cahaya 
spotLight.position.set(0, 10, 0);
spotLight.castShadow = true;
scene.add(spotLight);
scene.add(new THREE.SpotLightHelper(spotLight));

// var titik_0 = new THREE.BoxGeometry(1, 1, 1);
// var titik_0_material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
// var titik_0_mesh = new THREE.Mesh(titik_0, titik_0_material);
// titik_0_mesh.position.set(0, 0, 0);
// scene.add(titik_0_mesh);


// Lantai dengan tekstur
var textureLoader = new THREE.TextureLoader();
var lantai = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 12),
    new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide , map : textureLoader.load('./img/keramik.jpg')})
);
lantai.rotation.x = Math.PI / 2;
lantai.castShadow = true;
lantai.receiveShadow = true;
scene.add(lantai);

var wallMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00, side: THREE.DoubleSide });

var wall_belakang = new THREE.Mesh(new THREE.PlaneGeometry(16, 6), new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, map : textureLoader.load('./img/axio.png')}));
wall_belakang.position.set(0, 3, -6);
scene.add(wall_belakang);

var wall_depan = new THREE.Mesh(new THREE.PlaneGeometry(16, 6), new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, map : textureLoader.load('./img/wall1.webp')}));
wall_depan.position.set(0, 3, 6);
scene.add(wall_depan);

var wall_kiri = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), wallMaterial);
wall_kiri.position.set(-8, 3, 0);
wall_kiri.rotation.y = Math.PI / 2;
scene.add(wall_kiri);

var wall_kanan = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), wallMaterial);
wall_kanan.position.set(8, 3, 0);
wall_kanan.rotation.y = Math.PI / 2;
scene.add(wall_kanan);

var positions = [
    [-5, 0, -3], // kiri belakang
    [0, 0, -3],  // tengah belakang
    [5, 0, -3],  // kanan belakang
    [-5, 0, 0],  // kiri tengah
    [0, 0, 0],   // tengah
    [5, 0, 0],   // kanan tengah
    [-5, 0, 3],  // kiri depan
    [0, 0, 3],   // tengah depan
    [5, 0, 3]    // kanan depan
];


var pokemonModels = [
    "models/Pikachu.glb",
    "models/Charmender.glb",
    "models/Haunter.glb",
    "models/Mew.glb",
];

var placements = {
    0: pokemonModels[0], // depan tengah → Pikachu
    // 2: pokemonModels[1], // tengah tengah → Charmander
    // 3: pokemonModels[2],  // belakang kanan → Haunter
    // 4: pokemonModels[3], // belakang kiri → Mew
    // 5: pokemonModels[0], // tengah belakang → Pikachu
};


var pokemonMeshes = [];

for (let i = 0; i < positions.length; i++) {
    let pos = positions[i];

    // pedestal tetap dibuat
    var pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.6),
        new THREE.MeshLambertMaterial({ color: 0x00ffff })
    );
    pedestal.position.set(pos[0], 0.5, pos[2]);
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // kalau posisi ini punya pokemon
    if (placements[i]) {
        loader.load(placements[i], function (gltf) {
            let pokemon = gltf.scene;
            pokemon.position.set(pos[0], 1.9, pos[2]);
            pokemon.rotation.y = Math.PI;

            pokemon.traverse(n => {
                if (n.isMesh) {
                    n.castShadow = true;
                    n.receiveShadow = true;
                }
            });

            scene.add(pokemon);
            pokemonMeshes.push(pokemon);
        });
    }
}



// Dari AI untuk menampilkan pokemon ketika di klik
var pokemonNames = ["Pikachu", "Pikachu", "Pikachu", "Pikachu", "Pikachu", "Pikachu", "Pikachu", "Pikachu", "Pikachu"];
var pokemonTypes = ["Electric", "Electric", "Electric", "Electric", "Electric", "Electric", "Electric", "Electric", "Electric"];
var pokemonDescs = ["Pikachu", "Pikachu", "Pikachu", "Pikachu", "Pikachu", "Pikachu", "Pikachu", "Pikachu", "Pikachu"];

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var infoPanel = document.getElementById('info-panel');
var pokemonName = document.getElementById('pokemon-name');
var pokemonType = document.getElementById('pokemon-type');
var pokemonDesc = document.getElementById('pokemon-desc');
var closeBtn = document.getElementById('close-btn');

function showPanel(index) {
    pokemonName.textContent = pokemonNames[index];
    pokemonType.textContent = "Tipe: " + pokemonTypes[index];
    pokemonDesc.textContent = pokemonDescs[index];
    infoPanel.style.display = 'block';
}

function hidePanel() {
    infoPanel.style.display = 'none';
}

closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    hidePanel();
});

window.addEventListener('click', function(e) {
    if (e.target === renderer.domElement) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(pokemonMeshes);

        if (intersects.length > 0) {
            var index = pokemonMeshes.indexOf(intersects[0].object);
            if (index !== -1) {
                showPanel(index);
            }
        } else {
            hidePanel();
        }
    }
});

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
// Sampai Sini

function draw() {
    updateMovement(); // ← TAMBAHKAN INI

    for (var i = 0; i < pokemonMeshes.length; i++) {
        pokemonMeshes[i].rotation.y += 0.005;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(draw);
    for (var i = 0; i < pokemonMeshes.length; i++) {
        pokemonMeshes[i].rotation.y += 0.005;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
}

draw();