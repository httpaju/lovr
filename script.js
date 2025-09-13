// -------- Data handling --------
function getData() {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');
    if (!dataParam) {
        return null;
    }
    try {
        return JSON.parse(decodeURIComponent(dataParam));
    } catch(e) {
        console.error("Invalid JSON data");
        return null;
    }
}

function showSurprise(data) {
    if (!data) return;
    document.getElementById('greeting').textContent = "Happy Birthday!";
    document.getElementById('birthday-person').textContent = data.birthdayPerson || '';
    document.getElementById('message').textContent = data.message || '';

    const spinContainer = document.getElementById('spin-container');
    spinContainer.innerHTML = '';
    if (data.images && Array.isArray(data.images)) {
        data.images.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.width = 120;
            img.height = 170;
            spinContainer.appendChild(img);
        });
    }
    init();
}

// -------- 3D view logic --------
const radius = 240;
const autoRotate = true;
const rotateSpeed = -60;
const imgWidth = 120;
const imgHeight = 170;

const odrag = document.getElementById('drag-container');
const ospin = document.getElementById('spin-container');
const ground = document.getElementById('ground');

let aImg = ospin.getElementsByTagName('img');
let aEle = [];

let sX = 0, sY = 0, nX = 0, nY = 0;
let desX = 0, desY = 0;
let tX = 0, tY = 10;

function init(delayTime) {
    aImg = ospin.getElementsByTagName('img');
    aEle = [...aImg];
    ospin.style.width = imgWidth + "px";
    ospin.style.height = imgHeight + "px";
    ground.style.width = radius * 3 + "px";
    ground.style.height = radius * 3 + "px";
    for (let i = 0; i < aEle.length; i++) {
        aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
        aEle[i].style.transition = "transform 1s";
        aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
    }
    if (autoRotate) {
        const animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
        ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
    }
}

function applyTransform(obj) {
    if (tY > 180) tY = 180;
    if (tY < 0) tY = 0;
    obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

function playSpin(yes) {
    ospin.style.animationPlayState = (yes ? 'running' : 'paused');
}

document.onpointerdown = function (e) {
    clearInterval(odrag.timer);
    e = e || window.event;
    sX = e.clientX;
    sY = e.clientY;

    document.onpointermove = function(e) {
        e = e || window.event;
        nX = e.clientX;
        nY = e.clientY;
        desX = nX - sX;
        desY = nY - sY;
        tX += desX * 0.1;
        tY += desY * 0.1;
        applyTransform(odrag);
        sX = nX;
        sY = nY;
    };

    document.onpointerup = function(e) {
        odrag.timer = setInterval(function() {
            desX *= 0.95;
            desY *= 0.95;
            tX += desX * 0.1;
            tY += desY * 0.1;
            applyTransform(odrag);
            playSpin(false);
            if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                clearInterval(odrag.timer);
                playSpin(true);
            }
        }, 17);
        document.onpointermove = document.onpointerup = null;
    };
    return false;
};

document.onmousewheel = function(e) {
    e = e || window.event;
    let d = e.wheelDelta / 20 || -e.detail;
    radius += d;
    init(1);
};

// -------- Run --------
window.onload = () => {
    const data = getData();
    showSurprise(data);
};
