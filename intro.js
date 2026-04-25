const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const baseWidth = 256;
const baseHeight = 144;

// escalao
function resizeCanvas() {
    let scaleX = Math.floor(window.innerWidth / baseWidth);
    let scaleY = Math.floor(window.innerHeight / baseHeight);

    let scale = Math.max(1, Math.min(scaleX, scaleY));

    canvas.width = baseWidth;
    canvas.height = baseHeight;

    canvas.style.width = (baseWidth * scale) + "px";
    canvas.style.height = (baseHeight * scale) + "px";
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

///////// carga introone (escqeu agregue una intro antes de la otra intro )
let introOneFrames = [];
for (let i = 1; i <= 109; i++) {
    let img = new Image();
    let num = i.toString().padStart(4, "0");
    img.src = "assets/introimg/introone_" + num + ".png";
    introOneFrames.push(img);
}

///////// carga intro
let introFrames = [];

for (let i = 1; i <= 120; i++) {
    let img = new Image();
    let num = i.toString().padStart(4, "0");
    img.src = "assets/introimg/intro_" + num + ".png";
    introFrames.push(img);
}

/////////
let currentFrame = 0;
let animationState = "introone";

function playIntroOne() {
    if (currentFrame >= introOneFrames.length) {
        currentFrame = 0;
        animationState = "intro"; 
        playIntro();
        return;
    }

    draw();
    currentFrame++;
    setTimeout(playIntroOne, 1000 / 6);
}

function playIntro() {
    if (currentFrame >= introFrames.length) {
        startGame();
        return;
    }

    draw();
    currentFrame++;
    setTimeout(playIntro, 1000 / 6);
}

/////////
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let img;
    if (animationState === "introone") {
        img = introOneFrames[currentFrame];
    } else {
        img = introFrames[currentFrame];
    }
    if (img && img.complete) {
        let x = (baseWidth - 160) / 2;
        let y = 0;
        ctx.drawImage(img, x, y, 160, 144);
    }
}

///////// acaba intro inicia juego
function startGame() {
    window.location.href = "game.html";
}

playIntroOne();
