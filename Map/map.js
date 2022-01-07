import * as THREE from 'https://cdn.skypack.dev/three';
import {OrbitControls} from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js';


[...document.body.children].slice(1,-1).forEach(el => el.style.visibility = 'hidden');
document.body.style.overflowY = 'hidden';

let load = setInterval(() => {
    if (document. readyState === 'complete') {
        clearInterval(load);
        document.body.style.overflowY = '';
        document.getElementsByClassName('lds-roller')[0].style.display = 'none';
        [...document.body.children].slice(1,-1).forEach(el => el.id !== 'exitBtn' && el.id !== 'textBox' ? el.style.visibility = 'visible' : el);
    }
},10);




const districtsMap = document.getElementById('districtsMap');
let exitBtn = document.getElementById('exitBtn');
let textBox = document.getElementById('textBox');
const bgmap = document.getElementById('bgmap');
const areas = document.querySelectorAll('area');
let textBoxPlace = [0,0], previousRatio = 1, currentRatio = 1, currentModel;
let touchTimeout, touchIsLong = false; 




const png = new Image();
png.src = bgmap.src;
bgmap.style.height = png.height + 'px';
bgmap.style.width = png.width + 'px';
bgmap.style.visibility = 'hidden';

const firstH = Number(bgmap.style.height.replace('px',''));
const firstW = Number(bgmap.style.width.replace('px',''));
let firstValue = [];
areas.forEach(el => firstValue.push(el.getAttribute('value').split(',').map((e,i) => Number(e) - (i === 0 ? 749 / 2 : 0))));

function resize() {
    previousRatio = currentRatio;
    currentRatio = window.innerWidth / firstW;
    if (window.innerHeight < firstH * currentRatio) 
        currentRatio = window.innerHeight / firstH;
    let ratio = currentRatio / previousRatio;
        
        
    bgmap.style.height = Number(bgmap.style.height.replace('px','')) * ratio + 'px';
    bgmap.style.width = Number(bgmap.style.width.replace('px','')) * ratio + 'px';
    districtsMap.style.height = bgmap.style.height;
    districtsMap.style.width = bgmap.style.width;
    
    if (window.innerWidth < Number(bgmap.style.width.replace('px','')).toFixed(0) || window.innerHeight < Number(bgmap.style.height.replace('px','')).toFixed(0)) {
        resize();
    }

    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    
    let ax = (window.innerWidth - Number(bgmap.style.width.replace('px',''))) / 2;
    let ay = (window.innerHeight - Number(bgmap.style.height.replace('px',''))) / 2;
    let wr = (window.innerWidth - ax * 2) / firstW;
    let hr = (window.innerHeight - ay * 2) / firstH;

    areas.forEach((el,i) => {
        el.coords = el.coords.split(',').map(e => Number(e) * ratio).join(',');
        let val = firstValue[i].map((e,ii) => ii === 0 ? e * wr + ax : e * hr + ay).join(',');
        el.setAttribute('value',val);
    });

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

    if (canvas.style.visibility === 'visible') return
    bgmap.style.visibility = 'visible';
}

// area hover + click
if ('ontouchstart' in window || navigator.maxTouchPoints) {
    areas.forEach(el => el.addEventListener('touchstart', (e) => {
        textBox.style.visibility = 'hidden';
        e.preventDefault();
        e.stopImmediatePropagation();
        touchIsLong = true;
        touchTimeout = setTimeout(() => {
            if (touchIsLong) {
                areaInfo(e);
                touchIsLong = false;
            }
        },200);
    },{passive:false}));
    areas.forEach(el => el.addEventListener('touchend',(e) => {
        e.preventDefault();
        e.stopPropagation();
        clearTimeout(touchTimeout);
        if (touchIsLong) {
            areaClick(e);
            touchIsLong = false;
        }
        return true
    },{passive:false}));
} else {
    areas.forEach(el => el.addEventListener('mouseenter',areaInfo));
    areas.forEach(el => el.addEventListener('mouseleave',function(e){
        textBox.style.visibility = 'hidden';
    }));
    areas.forEach(el => el.addEventListener('click',areaClick));
}
function areaClick(e) {
    let objName = regionList[e.target.id].split(' <br>')[0];
    currentModel = models[objName];
    scene.add(currentModel);
    
    camera.position.set(0,0,100);
    camera.rotation.set(0,0,0);
    camera.zoom = 1;

    canvas.style.visibility = 'visible';
    for (let i = 0; i < 5; i++) {[...document.body.children][i].style.visibility = 'hidden';}
    exitBtn.style.visibility = 'visible';
    exitBtn.removeAttribute('hidden');
} 
function areaInfo(e) {
    textBoxPlace = e.target.getAttribute('value').split(',');
    textBox.style.left = Number(textBoxPlace[0]) + 'px';
    textBox.style.top = Number(textBoxPlace[1]) + 'px';
    textBox.innerHTML = regionList[e.target.id];
    textBox.style.visibility = 'visible';
    if (textBox.getBoundingClientRect().bottom > window.innerHeight) {
        textBox.style.maxWidth = '100000px';
    } else {
        textBox.style.maxWidth = '300px';
    }
}

exitBtn.addEventListener('click',function(e){
    canvas.style.visibility = 'hidden';
    exitBtn.setAttribute('hidden',true);
    for (let i = 0; i < 3; i++) {[...document.body.children][i].style.visibility = 'visible';}
    scene.remove(currentModel);
});
window.addEventListener('keyup',(e) => {
    if (e.code === 'Escape') {
        canvas.style.visibility = 'hidden';
        exitBtn.setAttribute('hidden',true);
        for (let i = 0; i < 3; i++) {[...document.body.children][i].style.visibility = 'visible';}
        scene.remove(currentModel);
    }
});
    

const Българи = `Българи <br>
    Според най-разпространената теория българската народност се формира в резултат на сливането на три племенни общности на Балканския полуостров в периода V-X век-траки, славяни и прабългари.`;
const Евреи = `Евреи <br>
    Евреите се заселват в Европа, като този процес се засилва особено след IV век. Църквата успява да привлече в лоното си всички европейци едва през IX век, като налага каноничното право сред европейските народи.`;
const Турци = `Турци <br>
    Турците започват да се заселват по българските земи, непосредствено с падането на България под османско робство през 1396г.`;
const Арменци = `Арменци <br>
    За първите преселници от Армения в българските земи се споменава V век. Второто преселение е през VII –IX век в Тракия. За първите арменци, заселили се в селището Бургас, се споменава през 1549 г.`;
const Роми = `Роми <br>
    В България циганските общности се делят на три основни - йерлии, кардараши и рудари.`;

const regionList = {
    Видинска: Българи,
    Монтанска: Роми,        
    Врачанска: Българи,
    Плевненска: Българи,
    Софийска: Българи,
    София: Българи,
    Пернишка: Българи,
    Ловешка: Българи,
    Кюстендилска: Българи,
    Пазарджишка: Българи,
    Благоевградска: Българи,
    Габровска: Българи,
    ВеликоТърновска: Българи,
    Русенска: Арменци,
    Пловдивска: Евреи,
    Старозагорска: Роми,
    Разградска: Турци,
    Смолянска: Българи,
    Търговишка: Българи,
    Хасковска: Българи,
    Кърджалийска: Турци,
    Силистренска: Българи,
    Сливенска: Турци,
    Ямболска: Българи,
    Шуменска: Турци,
    Добричка: Българи,
    Варненска: Арменци,
    Бургаска: Евреи,
}




// 3D

const scene = new THREE.Scene({background: 0xffffff});
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const directinalLight = new THREE.DirectionalLight(0xffffff, 100);
const light = new THREE.PointLight(0xc4c4c4,10);
const controls = new OrbitControls(camera, renderer.domElement);

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);
const canvas = document.querySelector('canvas');
canvas.style.visibility = 'hidden';
light.position.set(100,300,100);
directinalLight.position.set(0,1,0);
directinalLight.castShadow = true;
controls.addEventListener('change',() => renderer.render(scene, camera));
camera.position.z = 100;

scene.background = new THREE.Color(0xdddddd)
light.intensity = 1;
light.castShadow = true;
scene.add(light);

const models = {};
const allModels = {
    Българи: 'Bulgari',
    Евреи: 'Evrein',
    Турци: 'Turchin',
    Арменци: 'Armenka',
    Роми: 'Gypsy'
}

for (let i = 0; i < Object.keys(allModels).length; i++) {
    new GLTFLoader().load('../models/' + Object.values(allModels)[i] + '/scene.gltf', function (obj) {
        models[Object.keys(allModels)[i]] = obj.scene;
    }, undefined, function (error) {
        console.error( error );
    });
}


function animate() {
    requestAnimationFrame(animate);
    light.position.set(camera.position.x + 30,camera.position.y + 30,camera.position.z + 30);
    renderer.render(scene, camera);
}
animate();


window.addEventListener('resize', resize);
window.addEventListener('load',()=>{resize();resize()});