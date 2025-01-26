import * as THREE from "three";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

// const gui = new GUI();
const canvas = document.querySelector(".webgl");


// シーン
const scene = new THREE.Scene();

// サイズ
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
console.log(size)


// カメラ
const camera = new THREE.PerspectiveCamera(40, size.width / size.height, 0.1, 100);
camera.position.set(0, 0, 60);
camera.lookAt(0,-3,0);
scene.add(camera);

// レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ライト
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
directionalLight.position.set(0, 0, 40);
directionalLight.castShadow = true;
scene.add(directionalLight);

// GUIでライトを調整
// const lightFolder = gui.addFolder("Directional Light");
// lightFolder.add(directionalLight.position, "x", -50, 50);
// lightFolder.add(directionalLight.position, "y", -50, 50);
// lightFolder.add(directionalLight.position, "z", -50, 50);
// lightFolder.add(directionalLight, "intensity", 0, 5);
// lightFolder.open();

const rectLight1 = new THREE.RectAreaLight(0xffffff, 2, 10, 10);
rectLight1.position.set(1.5, 0, 37);
rectLight1.lookAt(0, 0, 0); // 中心方向を向く
scene.add(rectLight1);

// ライトのヘルパー
// const rectLight1Helper = new RectAreaLightHelper(rectLight1);
// rectLight1.add(rectLight1Helper);

// GUIでライトを調整
// const areaLightFolder = gui.addFolder("rectLight1 Light");
// areaLightFolder.add(rectLight1.position, "x", -50, 50);
// areaLightFolder.add(rectLight1.position, "y", -50, 50);
// areaLightFolder.add(rectLight1.position, "z", -50, 50);
// areaLightFolder.add(rectLight1, "intensity", 0, 5);
// areaLightFolder.open();

// メッシュを円形に配置するためのグループ
const group = new THREE.Group();
scene.add(group); // メッシュ用のグループをシーンに追加

// メッシュを格納する配列
const meshes = [];

// メッシュを作成して追加する関数
const createMeshWithTexture = (path, angle, radius) => {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(
    path,
    (texture) => {
      const material = new THREE.MeshStandardMaterial({
        map: texture,
      });
      const geometry = new THREE.BoxGeometry(9, 16, 0.5);
      const mesh = new THREE.Mesh(geometry, material);

      // 円形配置
      mesh.position.set(
        radius * Math.cos(angle),
        0,
        radius * Math.sin(angle)
      );

      mesh.lookAt(0, 0, 0); // 中心を向く
      mesh.castShadow = true;

      // グループに追加
      group.add(mesh);
      meshes.push(mesh);
    },
    undefined,
    (error) => {
      console.error(`Failed to load texture at ${path}`, error);
    }
  );
};

// 円の半径と配置するアイテム数
const radius = 30; // 円の半径
const itemCount = 12; // 配置するアイテムの数

// メッシュを円形に配置
for (let i = 0; i < itemCount; i++) {
  const texturePath = `src/images/texture/texture${String(i + 1).padStart(2, "0")}.jpg`;
  const angle = (i / itemCount) * Math.PI * 2; // 配置の角度
  createMeshWithTexture(texturePath, angle, radius);
}


// 背景
const bgTextureLoader = new THREE.TextureLoader();
const bgTexture = bgTextureLoader.load("src/images/bg.png");
scene.background = bgTexture;


// 床
const bgGeometry = new THREE.PlaneGeometry(200, 100);
const bgMaterial = new THREE.MeshStandardMaterial({
  color: 0x16434e,
  side: THREE.DoubleSide,
});
const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
bgMesh.position.set(0, -9, 0);
bgMesh.rotation.x = Math.PI / 2;
scene.add(bgMesh);


// particle
// パーティクルジオメトリ
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 500;
const positionArray = new Float32Array(particlesCount * 3);
const velocityArray = new Float32Array(particlesCount * 3); // 各パーティクルの速度

const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("src/images/texture/particle.png");

const speedMultiplier = 0.05; // 速度

// ランダムな位置と速度を設定
for (let i = 0; i < particlesCount * 3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 70; // ランダムな初期位置
    velocityArray[i] = (Math.random() - 0.5) * speedMultiplier; // 速度を小さく設定
}

particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));

// マテリアル
const particlesMaterial = new THREE.PointsMaterial({
    size: 1.5,
    sizeAttenuation: true,
    alphaMap: particleTexture,
    transparent: true,
    alphaTest: 0.001,
    color: 0xF9D664,
    blending: THREE.AdditiveBlending,
});

const particle = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particle);

// パーティクルを動かす
const animateParticles = () => {
    const positions = particlesGeometry.attributes.position.array;

    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] += velocityArray[i]; // 速度を加算して位置を更新

        // 範囲外に出た場合は反対側に移動
        if (positions[i] > 35 || positions[i] < -35) {
            velocityArray[i] = -velocityArray[i]; // 速度を反転
        }
    }

    // ジオメトリの更新を通知
    particlesGeometry.attributes.position.needsUpdate = true;
};




// マウスドラッグでグループ回転
let isDragging = false;
let previousMouseX = 0;

canvas.addEventListener("mousedown", (event) => {
  isDragging = true;
  previousMouseX = event.clientX;
});

canvas.addEventListener("mousemove", (event) => {
  if (!isDragging) return;
  const deltaX = event.clientX - previousMouseX;
  previousMouseX = event.clientX;

  // グループを回転
  group.rotation.y += deltaX * 0.01;
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});


// リサイズ
function onResize() {
    // サイズを取得
    let width = window.innerWidth - 17;
    let height = window.innerHeight;
  
    // レンダラーのサイズを調整する
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
  
    // カメラのアスペクト比を正す
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
// アニメーションループ
  const animate = () => {
  renderer.render(scene, camera);
  group.rotation.y += 0.0003;

  animateParticles(); // パーティクルを動かす



  window.addEventListener('resize', onResize);
  window.requestAnimationFrame(animate);
};

animate();


// import { gsap } from "gsap";
// gsap.to(camera.position, {
//   x: 2,
//   y: 8,
//   z: 5
// })





// let scene, camera, renderer, pointLight, controls, ballMesh;


// // でバック
// const gui = new GUI();


// window.addEventListener("load", init())
// function init(){
//     scene = new THREE.Scene();
//     // bubble_bg
    
    
//     camera = new THREE.PerspectiveCamera(
//         75, //視野角
//         window.innerWidth / window.innerHeight, //アスペクト比 .loadにいれたい
//         0.1, //開始距離
//         1000 //終了距離
//     )
//     camera.position.set(0, 0, 500)
    
//     // レンダラー
//     renderer = new THREE.WebGLRenderer({alpha: true})
//     renderer.setSize(window.innerWidth, window.innerHeight)
//     renderer.setPixelRatio(window.devicePixelRatio)
//     document.getElementById('bubble_bg').appendChild(renderer.domElement)
    
//     // テクスチャ
//     let textures = new THREE.TextureLoader().load("./textures/earth.jpg")
    
    
//     // ジオメトリ
//     let ballGeometry = new THREE.SphereGeometry( 20,1,1 ); 
    
//     // マテリアル
//     let ballMaterial = new THREE.MeshPhysicalMaterial({
//         color: "red",
//         // transparent: true,
//         // opacity: 0.5,
//     })
//     // let ballMaterial = new THREE.MeshPhysicalMaterial({ map: textures})

//     // 両面見えるように
//     // ballMaterial.side = THREE.DoubleSide

//     //メッシュ化
//     ballMesh = new THREE.Mesh(ballGeometry, ballMaterial)
    
//     scene.add(ballMesh)

//     // デバッグ
//     const positionFolder = gui.addFolder("position")
//     positionFolder.add(ballMesh.position, "x" ).min(-100).max(100).step(0.01).name("transformX")
//     positionFolder.add(ballMesh.position, "y" ).min(-100).max(100).step(0.01).name("transformY")
//     positionFolder.add(ballMesh.position, "z" ).min(-100).max(100).step(0.01).name("transformZ")

//     gui.add(ballMesh, "visible")
//     gui.add(ballMaterial, "wireframe")
//     gui.addColor(ballMaterial, "color")
    
//     let ambientLight = new THREE.AmbientLight(0xffffff, 1)
//     scene.add(ambientLight)

//     // 平行光源
//     let directionalLight = new THREE.DirectionalLight(0xffffff, 2)
//     directionalLight.position.set(1,1,100)
//     scene.add(directionalLight)
    
//     let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 100)
//     scene.add(directionalLightHelper)
    
    
//     // ポイント光源
//     // pointLight = new THREE.PointLight(0xffffff, 1);
//     // pointLight.position.set(-200, -200, -200);
     
//     // // 以下の２行をscene.add(pointLight)の前に追加
//     // pointLight.decay = 1;
//     // pointLight.power = 1000;
     
//     // scene.add(pointLight);
    
//     // //ポイント光源がどこにあるか特定する
//     // let pointLightHelper = new THREE.PointLightHelper(pointLight, 30)
//     // scene.add(pointLightHelper)
    
    
//     // マウス操作
//     controls = new OrbitControls(camera, renderer.domElement)
    
//     window.addEventListener('resize', onResize);
//     animate()
// }


// // リサイズ
// function onResize() {
//     // サイズを取得
//     const width = window.innerWidth;
//     const height = window.innerHeight;
  
//     // レンダラーのサイズを調整する
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(width, height);
  
//     // カメラのアスペクト比を正す
//     camera.aspect = width / height;
//     camera.updateProjectionMatrix();
//   }
// function animate(){
// // ポイント光源を巡回
//     // pointLight.position.set(
//     //     200 * Math.sin(Date.now() / 500),
//     //     200 * Math.sin(Date.now() / 1000),
//     //     200 * Math.cos(Date.now() / 500),
//     // )
//     requestAnimationFrame(animate)

//     // レンダリング
//     renderer.render(scene, camera);
// }



