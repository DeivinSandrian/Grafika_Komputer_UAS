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

var controls = new OrbitControls(camera, renderer.domElement);

var ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

var pointLight = new THREE.PointLight(0xffffff, 100);
pointLight.position.set(0, 5, 0);
pointLight.castShadow = true;
scene.add(pointLight);
scene.add(new THREE.PointLightHelper(pointLight, 0.2, 0x00ff00));

var spotLight = new THREE.SpotLight(0xffffff, 200, 12, Math.PI / 6);
spotLight.position.set(8, 8, 5);
spotLight.castShadow = true;
scene.add(spotLight);
scene.add(new THREE.SpotLightHelper(spotLight));

var titik_0 = new THREE.BoxGeometry(1, 1, 1);
var titik_0_material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
var titik_0_mesh = new THREE.Mesh(titik_0, titik_0_material);
titik_0_mesh.position.set(0, 0, 0);
scene.add(titik_0_mesh);

var textureLoader = new THREE.TextureLoader();
var lantai = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 12),
    new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide , map : textureLoader.load('./img/keramik.jpg')})
);
lantai.rotation.x = Math.PI / 2;
// lantai.castShadow = true;
lantai.receiveShadow = true;
scene.add(lantai);

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

    return new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });
}
// Sampai Sini

var wallMaterial = makePokemonWallMaterial();

var wall_belakang = new THREE.Mesh(new THREE.PlaneGeometry(16, 6), wallMaterial);
wall_belakang.position.set(0, 3, -6);
// wall_belakang.castShadow = true;
wall_belakang.receiveShadow = true;
scene.add(wall_belakang);

// var wall_belakang_2 = new THREE.Mesh(new THREE.PlaneGeometry(16, 2), new THREE.MeshLambertMaterial({ color: 0x000000, side: THREE.DoubleSide }));
// wall_belakang_2.position.set(0, 3, -6);
// scene.add(wall_belakang_2);

// var wall_belakang_3 = new THREE.Mesh(new THREE.PlaneGeometry(16, 2), new THREE.MeshLambertMaterial({ color: 0xff0000, side: THREE.DoubleSide }));
// wall_belakang_3.position.set(0, 5, -6);
// scene.add(wall_belakang_3);

var wall_depan = new THREE.Mesh(new THREE.PlaneGeometry(16, 6), wallMaterial);
wall_depan.position.set(0, 3, 6);
// wall_depan.castShadow = true;
wall_depan.receiveShadow = true;
scene.add(wall_depan);

var wall_kiri = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), wallMaterial);
wall_kiri.position.set(-8, 3, 0);
wall_kiri.rotation.y = Math.PI / 2;
// wall_kiri.castShadow = true;
wall_kiri.receiveShadow = true;
scene.add(wall_kiri);

var wall_kanan = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), wallMaterial);
wall_kanan.position.set(8, 3, 0);
wall_kanan.rotation.y = Math.PI / 2;
// wall_kanan.castShadow = true;
wall_kanan.receiveShadow = true;
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

var pokemonMeshes = [];
var models = [
    'models/Pikachu.glb',
    'models/Bulbasaur.glb',
    'models/Squirtle.glb',
]; // buat path model nanti
for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];

    var pedestalGeo = new THREE.CylinderGeometry(0.6, 0.6);
    var pedestalMat = new THREE.MeshLambertMaterial({ color: 0x00ffff });
    var pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.set(pos[0], 0.5, pos[2]);
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // var pokemonGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    // var pokemonMat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    // var pokemonMesh = new THREE.Mesh(pokemonGeo, pokemonMat);
    // pokemonMesh.position.set(pos[0], 1.5, pos[2]);
    // pokemonMesh.castShadow = true;
    // pokemonMesh.receiveShadow = true;
    // scene.add(pokemonMesh);

    const model = models[i % models.length];
    loader.load(model, function(gltf) {
        const pokemonModel = gltf.scene;
        pokemonModel.scale.set(1, 1, 1);
        pokemonModel.position.set(pos[0], 1.9, pos[2]);
        pokemonModel.rotation.y = Math.PI;
        pokemonModel.userData.index = i;
        // Dari AI untuk shadow pada pokemon supaya muncul semua
        pokemonModel.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        // Sampai Sini
        scene.add(pokemonModel);
        pokemonMeshes.push(pokemonModel);
    });

    // pokemonMeshes.push(pokemonMesh);
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
        var intersects = raycaster.intersectObjects(pokemonMeshes, true);

        if (intersects.length > 0) {
            var hit = intersects[0].object;
            while (hit && hit.userData.index === undefined) {
                hit = hit.parent;
            }
            if (hit && hit.userData.index !== undefined) {
                showPanel(hit.userData.index);
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
    for (var i = 0; i < pokemonMeshes.length; i++) {
        pokemonMeshes[i].rotation.y += 0.005;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
}

draw();
