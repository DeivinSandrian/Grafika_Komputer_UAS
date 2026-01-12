import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { sign, texture } from 'three/tsl';

var loader = new GLTFLoader();
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 2, 20);
camera.lookAt(0, 2, 10);
camera.fov = 60;
camera.updateProjectionMatrix();

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
document.body.appendChild(renderer.domElement);

// var controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 1.7, 8); // tinggi mata
camera.lookAt(0, 1.7, 0);

// Kontrol keyboard untuk navigasi(AI)
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


// Event listeners untuk keyboard (AI)
window.addEventListener('keydown', (e) => {
    if (keys[e.key] !== undefined) keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    if (keys[e.key] !== undefined) keys[e.key] = false;
});


// Kontrol mouse untuk melihat sekeliling (AI)
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


// Fungsi untuk memperbarui posisi kamera berdasarkan input keyboard (AI)
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


// Lampu utama ruangan
// var mainLight = new THREE.PointLight(0xffffff, 80);
// mainLight.position.set(0, 6, 0);
// scene.add(mainLight);

var titik_0 = new THREE.BoxGeometry(1, 1, 1);
var titik_0_material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
var titik_0_mesh = new THREE.Mesh(titik_0, titik_0_material);
titik_0_mesh.position.set(0, 0, 0);
scene.add(titik_0_mesh);

var textureLoader = new THREE.TextureLoader();

// AI untuk tekstur wall
function makePokemonWallMaterial() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;

    const ctx = canvas.getContext('2d');

    // Pokeball base: top red, center black band, bottom white
    const bandH = canvas.height * 0.18;
    const bandY = (canvas.height - bandH) * 0.5;

    ctx.fillStyle = '#d62828';
    ctx.fillRect(0, 0, canvas.width, bandY);
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, bandY, canvas.width, bandH);
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, bandY + bandH, canvas.width, canvas.height - (bandY + bandH));

    // Gentle shading for depth
    const shade = ctx.createLinearGradient(0, 0, 0, canvas.height);
    shade.addColorStop(0, 'rgba(0,0,0,0.12)');
    shade.addColorStop(0.5, 'rgba(0,0,0,0.02)');
    shade.addColorStop(1, 'rgba(0,0,0,0.10)');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Central button (proper pokeball style)
    const cx = canvas.width * 0.5;
    const cy = canvas.height * 0.5;
    const outerR = canvas.height * 0.19;
    const ringR = canvas.height * 0.12;
    const innerR = canvas.height * 0.07;

    // Outer black ring
    ctx.fillStyle = '#0f0f0f';
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fill();

    // Inner ring (light gray)
    ctx.fillStyle = '#d9d9d9';
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.fill();

    // Button core (white)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fill();

    // Thin outline to avoid "tabrak" look
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.stroke();

    // Subtle border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.NearestFilter;

    return new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });
}
// Sampai Sini

var wallMaterial = makePokemonWallMaterial();

var wall_belakang = new THREE.Mesh(new THREE.PlaneGeometry(20, 6), wallMaterial);
wall_belakang.position.set(0, 3, -10);
// wall_belakang.castShadow = true;
wall_belakang.receiveShadow = true;

// var wall_belakang_2 = new THREE.Mesh(new THREE.PlaneGeometry(16, 2), new THREE.MeshLambertMaterial({ color: 0x000000, side: THREE.DoubleSide }));
// wall_belakang_2.position.set(0, 3, -6);
// scene.add(wall_belakang_2);

// var wall_belakang_3 = new THREE.Mesh(new THREE.PlaneGeometry(16, 2), new THREE.MeshLambertMaterial({ color: 0xff0000, side: THREE.DoubleSide }));
// wall_belakang_3.position.set(0, 5, -6);
// scene.add(wall_belakang_3);

// ===== WALL DEPAN DENGAN PINTU =====
const doorWidth = 4;
const doorHeight = 4;

// kiri
var wall_depan_kiri = new THREE.Mesh(
    new THREE.PlaneGeometry((20 - doorWidth) / 2, 6),
    wallMaterial
);
wall_depan_kiri.position.set(-(20 - doorWidth) / 4 - doorWidth / 2, 3, 10);

// kanan
var wall_depan_kanan = new THREE.Mesh(
    new THREE.PlaneGeometry((20 - doorWidth) / 2, 6),
    wallMaterial
);
wall_depan_kanan.position.set((20 - doorWidth) / 4 + doorWidth / 2, 3, 10);

// atas pintu
const wallHeight = 6;
const topHeight = wallHeight - doorHeight;

// Interior gelap (fake depth)
var doorInterior = new THREE.Mesh(
    new THREE.PlaneGeometry(doorWidth, doorHeight),
    new THREE.MeshStandardMaterial({
        color: 0x000000,
        metalness: 0.1,
        roughness: 0.9
    })
);
doorInterior.position.set(0, doorHeight / 2, 9.99);

// Frame pintu
var doorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(doorWidth + 0.3, doorHeight, 0.3),
    new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.4,
        roughness: 0.3
    })
);
doorFrame.position.set(0, doorHeight / 2, 10);
// ===== SAMPAI SINI =====;

var wall_depan = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 6),
    wallMaterial
);
wall_depan.position.set(0, 3, 10);
wall_depan.receiveShadow = true;
wall_depan.userData.type = "frontWall";

var wall_kiri = new THREE.Mesh(new THREE.PlaneGeometry(20, 6), wallMaterial);
wall_kiri.position.set(-10, 3, 0);
wall_kiri.rotation.y = Math.PI / 2;
// wall_kiri.castShadow = true;
wall_kiri.receiveShadow = true;

//Wall kanan

var wall_kanan = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 6),
    wallMaterial
);
wall_kanan.position.set(10, 3, 0);
wall_kanan.rotation.y = Math.PI / 2;
wall_kanan.receiveShadow = true;

var positions = [
    [-5.5, 0, -5.8], // kiri belakang
    [0, 0, -5.8],  // tengah belakang
    [5.5, 0, -5.8],  // kanan belakang
    [-5.5, 0, 0],  // kiri tengah
    [0, 0, 0],   // tengah
    [5.5, 0, 0],   // kanan tengah
    [-5.5, 0, 5.8],  // kiri depan
    [0, 0, 5.8],   // tengah depan
    [5.5, 0, 5.8]    // kanan depan
];

var pokemonMeshes = [];
const galleryNormalModels = [
    'models/Pidgeot.glb',
    'models/Stoutland.glb',
    'models/Toucannon.glb',
    'models/Pidgeotto.glb',
    'models/Herdier.glb',
    'models/Trumbeak.glb',
    'models/Pidgey.glb',
    'models/Lillipup.glb',
    'models/Pikipek.glb'
];

const galleryNormal2Models = [
    'models/Wigglytuff.glb',
    'models/Staraptor.glb',
    'models/Blissey.glb',
    'models/Jigglypuff.glb',
    'models/Staravia.glb',
    'models/Chansey.glb',
    'models/Igglybuff.glb',
    'models/Starly.glb',
    'models/Happiny.glb'
];

const galleryNormal3Models = [
    'models/Porygon-z.glb',
    'models/Zangoose.glb',
    'models/Audino.glb',
    'models/Porygon2.glb',
    'models/Delcatty.glb',
    'models/Sawsbuck.glb',
    'models/Porygon.glb',
    'models/Skitty.glb',
    'models/Deerling.glb'
];

const galleryFire1Models = [
    'models/Charizard.glb',
    'models/Infernape.glb',
    'models/Talonflame.glb',
    'models/Charmeleon.glb',
    'models/Monferno.glb',
    'models/Fletchinder.glb',
    'models/Charmander.glb',
    'models/Chimchar.glb',
    'models/Fletchling.glb'
];

const galleryElectric1Models = [
    'models/Raichu.glb',
    'models/Magnezone.glb',
    'models/Electivire.glb',
    'models/Pikachu.glb',
    'models/Magneton.glb',
    'models/Electabuzz.glb',
    'models/Pichu.glb',
    'models/Magnemite.glb',
    'models/Elekid.glb'
];

const globalAmbient = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(globalAmbient);

function createRoomLights(offsetX = 0) {

    const main = new THREE.PointLight(0xffffff, 25, 30);
    main.position.set(offsetX, 6, 0);
    main.castShadow = true;
    scene.add(main);

    const spot = new THREE.SpotLight(
        0xffffff,
        50,
        35,
        Math.PI / 2,
        0.3,
        1
    );

    spot.position.set(offsetX, 9, 3);
    spot.target.position.set(offsetX, 1.5, 0);
    spot.castShadow = false;

    scene.add(spot);
    scene.add(spot.target);
}

function createFloor(offsetX = 0) {
    const floorGeo = new THREE.PlaneGeometry(20, 20);
    const floorMat = new THREE.MeshStandardMaterial({color: 0xffffff, side: THREE.DoubleSide , map : textureLoader.load('./img/keramik.jpg')});

    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(offsetX, 0, 0);
    floor.receiveShadow = true;

    scene.add(floor);
}

function createDoorSign({
    offsetX = 0,
    side = 'front',
    imagePath = ''
}) {

    const texture = textureLoader.load(imagePath);

    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.6,
        metalness: 0.1,
        side: THREE.DoubleSide
    });

    const sign = new THREE.Mesh(
        new THREE.PlaneGeometry(doorWidth, topHeight),
        material
    );

    // FRONT
    if (side === 'front') {
        sign.position.set(
            offsetX,
            wallHeight - topHeight / 2,
            10.01
        );
    }

    // RIGHT
    if (side === 'right') {
        sign.position.set(
            10.01 + offsetX,
            wallHeight - topHeight / 2,
            0
        );
        sign.rotation.y = -Math.PI / 2;
    }

    // LEFT
    if (side === 'left') {
        sign.position.set(
            -10.01 + offsetX,
            wallHeight - topHeight / 2,
            0
        );
        sign.rotation.y = Math.PI / 2;
    }

    scene.add(sign);
}

function createWalls(
    offsetX = 0,
    corridors = {
        front: false,
        right: false,
        left: false,
        back: false
    }
) {

    function clone(mesh) {
        const c = mesh.clone();
        c.position.x += offsetX;
        scene.add(c);
    }

    // FRONT
    if (corridors.front) {
        createWallWithDoor({ offsetX, side: 'front' });
    } else {
        clone(wall_depan);
    }

    // RIGHT
    if (corridors.right) {
        createWallWithDoor({ offsetX, side: 'right' });
    } else {
        clone(wall_kanan);
    }

    // LEFT
    if (corridors.left) {
        createWallWithDoor({ offsetX, side: 'left' });
    } else {
        clone(wall_kiri);
    }

    // BACK
    if (corridors.back) {
        createWallWithDoor({ offsetX, side: 'back' }); // kalau ada
    } else {
        clone(wall_belakang);
    }
}

function createWallWithDoor({
    offsetX = 0,
    side = 'front',
    flip = false
}) {

    function clone(mesh) {
        const c = mesh.clone();

        // FRONT WALL
        if (side === 'front') {
            c.position.set(
                mesh.position.x + offsetX,
                mesh.position.y,
                10
            );
        }

        // RIGHT WALL
        if (side === 'right') {
            c.position.set(
                10 + offsetX,
                mesh.position.y,
                mesh.position.x
            );
            c.rotation.y = -Math.PI / 2;
        }

        // LEFT WALL
        if (side === 'left') {
            c.position.set(
                -10 + offsetX,
                mesh.position.y,
                -mesh.position.x
            );
            c.rotation.y = Math.PI / 2;
        }

        scene.add(c);
    }

    clone(wall_depan_kiri);
    clone(wall_depan_kanan);
    clone(doorInterior);
    clone(doorFrame);
}

function createCorridorLight(offsetX = 0) {
    const light = new THREE.PointLight(0xffffff, 12, 25);
    light.position.set(offsetX, 5, 0);
    scene.add(light);
}

function createCorridorWalls(offsetX = 0) {
    const wallLen = 5;
    const wallH = 4;

    // Kiri
    const left = new THREE.Mesh(
        new THREE.PlaneGeometry(wallLen, wallH),
        corridorWallMat
    );
    left.position.set(offsetX, wallH / 2, -3);
    scene.add(left);

    // Kanan
    const right = left.clone();
    right.position.z = 3;
    scene.add(right);

    // Strip tengah (aksen)
    const strip = new THREE.Mesh(
        new THREE.PlaneGeometry(wallLen, 0.25),
        new THREE.MeshStandardMaterial({ color: 0x000000 })
    );
    strip.position.set(offsetX, 2, -3.01);
    scene.add(strip);

    const strip2 = strip.clone();
    strip2.position.z = 3.01;
    scene.add(strip2);
}

function createCorridorCeiling(offsetX = 0) {
    const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 6),
        new THREE.MeshStandardMaterial({
            color: 0x101010,
            roughness: 0.9,
            side: THREE.DoubleSide
        })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(offsetX, 4.05, 0);
    scene.add(ceiling);

    const stripLight = new THREE.PointLight(0xffffff, 8, 10);
    stripLight.position.set(offsetX, 4, 0);
    scene.add(stripLight);
}

function createCorridor(offsetX = 0) {
    const corridorLength = 5;
    const corridorWidth = 6;

    const floorGeo = new THREE.PlaneGeometry(corridorLength, corridorWidth);
    const floorMat = new THREE.MeshStandardMaterial({
        color: 0x555555,
        roughness: 0.9,
        map: textureLoader.load('./img/keramik.jpg')
    });

    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(offsetX, 0.01, 0);
    floor.receiveShadow = true;
    scene.add(floor);
}

// ===== MATERIAL KHUSUS CORRIDOR =====
const corridorWallMat = new THREE.MeshStandardMaterial({
    color: 0x1f1f1f,
    roughness: 0.85,
    metalness: 0.05,
    side: THREE.DoubleSide
});

const corridorFrameMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.4,
    metalness: 0.6
});

const corridorDarkMat = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 1,
    metalness: 0
});

const OVERSIZED_MODEL_SCALE = {
    'Questionmark.glb': 0.002,
    'Staraptor.glb': 0.2,
    'Staravia.glb': 0.25,
    'Starly.glb': 0.15,
    'Chansey.glb': 0.0065,
    'Igglybuff.glb': 2,
    'Toucannon.glb': 2,
    'Trumbeak.glb': 2,
    'Pikipek.glb': 2,
    'Sawsbuck.glb': 0.25,
    'Deerling.glb': 0.25,
    'Skitty.glb': 2,
    'Delcatty.glb': 2,
    'Porygon.glb': 0.5,
    'Magnemite.glb': 1.5,
    'Magneton.glb': 1.5,
    'Magnezone.glb': 0.1,
    'Elekid.glb': 0.15,
    'Electabuzz.glb': 0.01,
    'Chimchar.glb': 0.15,
    'Monferno.glb': 1.5,
};

function applyOversizeScale(model, modelPath) {
    for (const key in OVERSIZED_MODEL_SCALE) {
        if (modelPath.includes(key)) {
            model.scale.setScalar(OVERSIZED_MODEL_SCALE[key]);
            return;
        }
    }
}

function createGallery(offsetX = 0, modelList = []) {
    for (let i = 0; i < positions.length; i++) {
        const pos = positions[i];

        // === Pedestal ===
        var pedestalGeo = new THREE.CylinderGeometry(1.2, 0.6, 1.0);
        var pedestalMat = new THREE.MeshLambertMaterial({ color: 0x00ffff });
        var pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
        pedestal.position.set(pos[0] + offsetX, 0.5, pos[2]);
        pedestal.castShadow = true;
        pedestal.receiveShadow = true;
        scene.add(pedestal);

        // === Pokémon ===
        const model = modelList[i % modelList.length];
        loader.load(model, function (gltf) {
            const pokemonModel = gltf.scene;

            pokemonModel.position.set(pos[0] + offsetX, 1.4, pos[2]);
            pokemonModel.rotation.y = Math.PI;
            pokemonModel.scale.set(0.7, 0.7, 0.7);
            pokemonModel.userData.index = i;

            applyOversizeScale(pokemonModel, model);

            pokemonModel.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            scene.add(pokemonModel);
            pokemonMeshes.push(pokemonModel);
        });
    }
}

// Gallery 1
createFloor(0);
createWalls(0, {front: true, right: true, left: true, back: false});
createDoorSign({offsetX: 0, side: 'front', imagePath: './img/normal.jpg'});
createDoorSign({offsetX: 0, side: 'left', imagePath: './img/normal.jpg'});
createDoorSign({offsetX: 0, side: 'right', imagePath: './img/normal.jpg'});
createRoomLights(0);
createGallery(0, galleryNormalModels);

// Corridor
createCorridor(12.5);
createCorridorWalls(12.5);
createCorridorCeiling(12.5);
createCorridorLight(12.5);

// Gallery 2
createFloor(25);
createWalls(25, {front: false, right: true, left: true, back: false });
createDoorSign({offsetX: 25, side: 'left', imagePath: './img/normal.jpg'});
createDoorSign({offsetX: 25, side: 'right', imagePath: './img/normal.jpg'});
createRoomLights(25);
createGallery(25, galleryNormal2Models);

// Corridor
createCorridor(-12.5);
createCorridorWalls(-12.5);
createCorridorCeiling(-12.5);
createCorridorLight(-12.5);

// Gallery 3
createFloor(-25);
createWalls(-25, {front: false, right: true, left: true, back: false });
createDoorSign({offsetX: -25, side: 'left', imagePath: './img/normal.jpg'});
createDoorSign({offsetX: -25, side: 'right', imagePath: './img/normal.jpg'});
createRoomLights(-25);
createGallery(-25, galleryNormal3Models);

// Corridor
createCorridor(-37.5);
createCorridorWalls(-37.5);
createCorridorCeiling(-37.5);
createCorridorLight(-37.5);

//Gallery 4
createFloor(-50);
createWalls(-50,  {front: false, right: true, left: false, back: false });
createDoorSign({offsetX: -50, side: 'right', imagePath: './img/fire.jpg'});
createRoomLights(-50);
createGallery(-50, galleryFire1Models);

// Corridor
createCorridor(37.5);
createCorridorWalls(37.5);
createCorridorCeiling(37.5);
createCorridorLight(37.5);

//Gallery 5
createFloor(50);
createWalls(50, {front: false, right: false, left: true, back: false});
createDoorSign({offsetX: 50, side: 'left', imagePath: './img/electric.jpg'});
createRoomLights(50);
createGallery(50, galleryElectric1Models);

//Gallery 6
createFloor(50);
createWalls(50, {front: false, right: false, left: true, back: false});
createDoorSign({offsetX: 50, side: 'left', imagePath: './img/electric.jpg'});
createRoomLights(50);
createGallery(50, galleryElectric1Models);

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
        var intersects = raycaster.intersectObjects(pokemonMeshes, true);

        if (intersects.length > 0) {
            var hit = intersects[0].object;
            while (hit && hit.userData.index === undefined) {
                hit = hit.parent;
            }
            if (hit && hit.userData.index !== undefined) {
                showPanel(hit.userData.index);
                startEvolution(hit);
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

var entering = true;
function draw() {
    updateMovement();

    for (var i = 0; i < pokemonMeshes.length; i++) {
        pokemonMeshes[i].rotation.y += 0.005;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(draw);

    if (entering && camera.position.z > 10) {
    camera.position.z -= 0.05;
    camera.lookAt(0, 2, 0);
    } else {
        entering = false;
    }
}
draw();
