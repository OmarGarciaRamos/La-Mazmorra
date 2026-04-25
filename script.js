const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

canvas.tabIndex = 1;
canvas.focus();

const basewidth = 256;
const baseheight = 144;
const fondoWidth = 160;
const fondoHeight = 144;
const offsetX = (basewidth - fondoWidth) / 2; // esladdador

function resizeCanvas() {
  let scaleX = Math.floor(window.innerWidth / basewidth);
  let scaleY = Math.floor(window.innerHeight / baseheight);
  let scale = Math.max(1, Math.min(scaleX, scaleY));

  canvas.width = basewidth;
  canvas.height = baseheight;
  canvas.style.width = basewidth * scale + "px";
  canvas.style.height = baseheight * scale + "px";
}
//////////////// con esto ahora mi personaje mira al mouse ///neta eres incrible omar /////gracias omar te quiero mucho
let mousePos = { x: 0, y: 0 };

canvas.addEventListener("mousemove", (e) => {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    mousePos.x = (e.clientX - rect.left) * scaleX - offsetX;
    mousePos.y = (e.clientY - rect.top) * scaleY;
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const configuracionZonas = {
    "playa": { frames: 16, ruta: "assets/fondosAnimados/playa/untitled_" },
    "canio": { frames: 1, ruta: "assets/fondosAnimados/canio/canio_" },
    "cuartoroto": { frames: 9, ruta: "assets/fondosAnimados/cuartoroto/cuartoroto_" },
    "nieve": {frames: 1, ruta: "assets/fondosAnimados/nieve/nieve_"}
};

let zonaActual = "playa";
let framesFondo = [];
let esTutorial = true;

let transicion = {
    active: false,
    frame: 0,
    timer: 0,
    frames: []
};
const imgBurbujaE = new Image();
imgBurbujaE.src = "assets/E.png"; 

if (window.imgLlave === undefined) {
    window.imgLlave = new Image();
    window.imgLlave.src = "assets/protagonistaItems/items/llave.png";
}

if (window.imgCorazon === undefined) {
    window.imgCorazon = new Image();
    window.imgCorazon.src = "assets/protagonistaItems/vida/vida.png";
}

    window.objetosSuelo = [];


for (let i = 1; i <= 4; i++) {
    let img = new Image();
    let num = i.toString().padStart(4, "0");
    img.src = "assets/transiciones/transicion_" + num + ".png";
    transicion.frames.push(img);
}
function cargarFondosDeZona(nombreZona) {
    framesFondo = [];
    let info = configuracionZonas[nombreZona];
    for (let i = 1; i <= info.frames; i++) {
        let img = new Image();
        let num = i.toString().padStart(4, "0");
        img.src = info.ruta + num + ".png";
        framesFondo.push(img);
    }
}
cargarFondosDeZona("playa");

///////// jugador
let player = {
  x: fondoWidth / 2,
  y: fondoHeight / 2,
  width: 32,
  height: 32,
  speed: 1,
  dir: "down",
  moving: false,
  frame: 0,
  vida: 3,
  maxVida: 3,
  llaves: 0,
  maxLlaves: 4,
  invulnerable: false,
  invulnerableTimer: 0,
  invulnerableDuration: 240
};
let playerFrames = [];
for (let i = 1; i <= 12; i++) {
  let img = new Image();
  let num = i.toString().padStart(4, "0");
  img.src = "assets/protagonistaItems/protamovimiento/prota de frente_" + num + ".png";
  playerFrames.push(img);
}

function Dañoamiprotakkk() {
  if (!player.invulnerable && player.vida > 0) {
    player.vida--;
    player.invulnerable = true;
    player.invulnerableTimer = player.invulnerableDuration;
    
    if (player.vida <= 0) {
      console.log("Game Over");
    }
  }
}

///////// proyectiles
let proyectiles = [];
let lastShotTime = 0;
let shotCooldown = 500;

let proyectilImg = new Image();
proyectilImg.src =
  "assets/protagonistaItems/proyectilesprota/proyectil_0001.png";

let explosionImg = new Image();
explosionImg.src =
  "assets/protagonistaItems/proyectilesprota/proyectil_0002.png";

let animTimer = 0;


///////// mover
let keys = {};
document.addEventListener("keydown", (e) => (keys[e.key.toLowerCase()] = true));
document.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));

///////// disparo
canvas.addEventListener("mousedown", (e) => {
    e.preventDefault();
    if (e.button !== 0) return;

    let now = Date.now();
    if (now - lastShotTime < shotCooldown) return;
    lastShotTime = now;
    let dx = mousePos.x - player.x;
    let dy = mousePos.y - player.y;
    let angle = Math.atan2(dy, dx);

    proyectiles.push({
        x: player.x,
        y: player.y,
        vx: Math.cos(angle) * 2,
        vy: Math.sin(angle) * 2,
        size: 6,
        state: "move",
        timer: 0,
    });
});

let rutaDecidida = false;
let ruta = "";

let camaronTimer = 0;
let camaronTiempoLimite = 1900;

//////////////aca van todos los enemigos como cangrejo o etc aronou men
let enemigos = [];
let cangrejoFrames = [];
let cangrejoDanadoFrames = [];

// cargar frames de meu cangrejo
for (let i = 1; i <= 6; i++) {
    let img = new Image();
    let num = i.toString().padStart(4, "0");
    img.src = "assets/enemigos/cangrejo/normal/cangrejo_" + num + ".png";
    cangrejoFrames.push(img);

    let imgD = new Image();
    imgD.src = "assets/enemigos/cangrejo/danado/cangrejodanado_" + num + ".png";
    cangrejoDanadoFrames.push(imgD);
}

let magoFrames = [];
let magoDanadoFrames = [];

for (let i = 1; i <= 4; i++) {
    let img = new Image();
    let num = i.toString().padStart(4, "0");
    img.src = "assets/enemigos/mago/mago_" + num + ".png";
    magoFrames.push(img);

    let imgD = new Image();
    imgD.src = "assets/enemigos/mago/magodanado_" + num + ".png";
    magoDanadoFrames.push(imgD);
}
let proyectilesEnemigos = [];
const magoProyectilImg = new Image();
magoProyectilImg.src = "assets/enemigos/proyectilenemigo/proyectilenemigo_0001.png";

let fuegoFrames = [];
let fuegoDanadoFrames = [];

for (let i = 1; i <= 2; i++) {
    let imgN = new Image();
    let num = i.toString().padStart(4, "0");
    imgN.src = "assets/enemigos/fuego/enemigofuego_" + num + ".png";
    fuegoFrames.push(imgN);

    let imgD = new Image();
    imgD.src = "assets/enemigos/fuego/enemigofuegoDanado_" + num + ".png";
    fuegoDanadoFrames.push(imgD);
}

let slimeFrames = [];
let slimeDanadoFrames = [];

for (let i = 1; i <= 4; i++) {
    let imgN = new Image();
    let num = i.toString().padStart(4, "0");
    imgN.src = "assets/enemigos/slime/slime_" + num + ".png";
    slimeFrames.push(imgN);

    let imgD = new Image();
    imgD.src = "assets/enemigos/slime/slimedanado_" + num + ".png";
    slimeDanadoFrames.push(imgD);
}


// cristal gay
let cristalFrames = [];
for (let i = 1; i <= 8; i++) {
  let img = new Image();
  let num = i.toString().padStart(4, "0");
  img.src = "assets/cristal/cristalprotal_" + num + ".png";
  cristalFrames.push(img);
}

let cristal = {
  active: false,
  x: fondoWidth - 20,
  y: fondoHeight / 2,
  frame: 0,
  timer: 0
};

///////// camaron tutorial
let camaronFrames = [];
for (let i = 1; i <= 12; i++) {
  let img = new Image();
  let num = i.toString().padStart(4, "0");
  img.src = "assets/enemigos/camarontutorial/normal/camaron_" + num + ".png";
  camaronFrames.push(img);
}

let camaronDanadoFrames = [];
for (let i = 1; i <= 12; i++) {
  let img = new Image();
  let num = i.toString().padStart(4, "0");
  img.src =
    "assets/enemigos/camarontutorial/dañado/camarondañado_" +
    num +
    ".png";
  camaronDanadoFrames.push(img);
}

let camaron = {
    active: false,
    x: fondoWidth -24,
    y: fondoHeight / 2,
    frame: 0,
    timer: 0,
    vida: 3,
    hitTimer: 0,
    muriendo: false
};

///////// player update
function updatePlayer() {
  let dx = 0;
  let dy = 0;

  if (keys["a"]) {
    dx--;
    player.dir = "left";
  }
  if (keys["d"]) {
    dx++;
    player.dir = "right";
  }
  if (keys["w"]) {
    dy--;
    player.dir = "up";
  }
  if (keys["s"]) {
    dy++;
    player.dir = "down";
  }

  player.moving = dx !== 0 || dy !== 0;

  player.x += dx * player.speed;
  player.y += dy * player.speed;

  let hitbox = 20;
  let minX = hitbox / 2;
  let maxX = fondoWidth - hitbox / 2;
  let minY = hitbox / 2;
  let maxY = fondoHeight - hitbox / 2;

  player.x = Math.max(minX, Math.min(player.x, maxX));
  player.y = Math.max(minY, Math.min(player.y, maxY));
}

/////////////////////////////////////////
function updateAnimation() {
  if (player.moving) {
    animTimer++;
    if (animTimer > 14) {
      player.frame++;
      if (player.frame > 2) player.frame = 1;
      animTimer = 0;
    }
  } else {
    player.frame = 0;
  }
}

function updateInvulnerability() {
  if (player.invulnerable) {
    player.invulnerableTimer--;
    if (player.invulnerableTimer <= 0) {
      player.invulnerable = false;
    }
  }
}

//////////
function getPlayerFrame() {
  let base = 0;

  if (player.dir === "down") base = 0;
  if (player.dir === "left") base = 3;
  if (player.dir === "right") base = 6;
  if (player.dir === "up") base = 9;

  return playerFrames[base + player.frame];
}

function updatePlayerDirection() {
    let dx = mousePos.x - player.x;
    let dy = mousePos.y - player.y;
    let angle = Math.atan2(dy, dx);
    let degrees = angle * (180 / Math.PI);
    if (degrees > -45 && degrees <= 45) {
        player.dir = "right";
    } else if (degrees > 45 && degrees <= 135) {
        player.dir = "down";
    } else if (degrees > 135 || degrees <= -135) {
        player.dir = "left";
    } else {
        player.dir = "up";
    }
}

////////// fondo animado
let currentFrame = 0;
let lastTime = 0;
let frameDuration = 1000 / 6;

function updateFondo(timestamp) {
  let delta = timestamp - lastTime;
  if (delta >= frameDuration) {
    currentFrame = (currentFrame + 1) % frames.length;
    lastTime = timestamp;
  }
}
let ultimaZona = "";

function cambiarDeZona() {
    objetosSuelo = [];
    esTutorial = false;
    tutorialActive = false;
    camaron.active = false;
    proyectilesEnemigos = [];
    const opciones = Object.keys(configuracionZonas);
    let nueva;
    do {
        nueva = opciones[Math.floor(Math.random() * opciones.length)];
    } while (nueva === zonaActual && opciones.length > 1); 
    zonaActual = nueva;
    currentFrame = 0;
    cargarFondosDeZona(zonaActual);
    player.x = 20; 
    player.y = fondoHeight / 2;
    cristal.active = false;
    spawnEnemigos(); 
    console.log("Cambiando a: " + zonaActual);
}
//////////////bastarda funcion de aparecer enemigos neta matenme
function spawnEnemigos() {
    enemigos = [];
    if (esTutorial) return;
    if (zonaActual === "playa") {
        const spawns = [
            { x: 40, y: 40 },
            { x: 120, y: 40 },
            { x: 40, y: 100 },
            { x: 120, y: 100 }
        ];
        spawns.sort(() => Math.random() - 0.5);
        spawns.forEach((pos, index) => {
            if (index < 2 || Math.random() > 0.8) {
                enemigos.push(crearCangrejo(pos.x, pos.y));
            }
        });
        cristal.active = false;
    }
     else if (zonaActual === "cuartoroto") {
        const spawnsMago = [
            { x: 30, y: 30 }, { x: 130, y: 30 },
            { x: 30, y: 110 }, { x: 130, y: 110 }
        ];
        spawnsMago.sort(() => Math.random() - 0.5);
        
        spawnsMago.forEach((pos, index) => {
            if (index < 2 || Math.random() > 0.8) {
                enemigos.push(crearMago(pos.x, pos.y));
            }
        });
        cristal.active = false;
    }
    else if (zonaActual === "nieve") {
        const spawnsFuego = [{ x: 40, y: 40 }, { x: 120, y: 40 }, { x: 40, y: 100 }, { x: 120, y: 100 }];
        spawnsFuego.sort(() => Math.random() - 0.5);
        spawnsFuego.forEach((pos, index) => {
            if (index < 2 || Math.random() > 0.7) {
                enemigos.push(crearEnemigoFuego(pos.x, pos.y));
            }
        });
        cristal.active = false;
    }
    else if (zonaActual === "canio") {
    const spawnsSlime = [
        { x: 50, y: 50 }, { x: 110, y: 50 },
        { x: 50, y: 90 }, { x: 110, y: 90 }
    ];
    spawnsSlime.sort(() => Math.random() - 0.5);
    spawnsSlime.forEach((pos, index) => {
        if (index < 2 || Math.random() > 0.7) {
            enemigos.push(crearSlime(pos.x, pos.y));
        }
    });
    cristal.active = false;
}
    else {
        enemigos.push(crearCangrejo(80, 72)); 
        cristal.active = false;
    }
}
///////cangrejo odioso
function crearCangrejo(x, y) {
    return {
        x: x,
        y: y,
        vida: 5,
        speed: 0.3,
        width: 32,
        height: 32,
        frame: 0,
        timer: 0,
        hitTimer: 0,
        estado: "caminar"
    };
}

function crearMago(x, y) {
    return {
        tipo: "mago",
        x: x,
        y: y,
        vida: 4,
        speed: 0.2,
        width: 32,
        height: 32,
        frame: 0,
        timer: 0,
        hitTimer: 0,
        lastShot: 0,
        lastShot: Date.now() + 500,
        shotCooldown: 1500,
        estado: "caminar"
    };
}

function crearEnemigoFuego(x, y) {
    return {
        tipo: "fuego",
        x: x,
        y: y,
        vida: 3,
        speed: 0.3,
        width: 32,
        height: 32,
        frame: 0,
        timer: 0,
        hitTimer: 0,
        estado: "caminar"
    };
}

function crearSlime(x, y) {
    return {
        tipo: "slime",
        x: x,
        y: y,
        vida: 4,
        speed: 0.3,
        width: 32,
        height: 32,
        frame: 0,
        timer: 0,
        hitTimer: 0,
        lastShot: Date.now() + 300,
        shotCooldown: 1500,
        estado: "caminar"
    };
}
///////// tutorial textbox
let tutorialFrames = [];
for (let i = 1; i <= 141; i++) {
  let img = new Image();
  let num = i.toString().padStart(4, "0");
  img.src = "assets/textbox/textbox_" + num + ".png";
  tutorialFrames.push(img);
}
let textboxAmable = [];
for (let i = 1; i <= 54; i++) {
  let img = new Image();
  let num = i.toString().padStart(4, "0");
  img.src = "assets/textbox/texboxamable/textboxamable_" + num + ".png";
  textboxAmable.push(img);
}

let textboxAgresivo = [];
for (let i = 1; i <= 49; i++) {
  let img = new Image();
  let num = i.toString().padStart(4, "0");
  img.src = "assets/textbox/texboxagresivo/textboxagresivo_" + num + ".png";
  textboxAgresivo.push(img);
}

let tutorialActive = true;
let tutorialFrame = 0;
let tutorialTimer = 0;

function updateTutorial() {
  if (!tutorialActive) return;
  tutorialTimer++;
  if (tutorialTimer > 10) {
    tutorialFrame++;
    tutorialTimer = 0;
  }
  if (tutorialFrame >= tutorialFrames.length) {
    tutorialActive = false;
  }
  if (tutorialFrame === 85 && !camaron.active && !rutaDecidida) {
    camaron.active = true;
    camaronTimer = 0;
  }
}
function updateFondo(timestamp) {
  if (framesFondo.length === 0) return;

  let delta = timestamp - lastTime;
  if (delta >= frameDuration) {
    currentFrame = (currentFrame + 1) % framesFondo.length;
    lastTime = timestamp;
  }
}

///////// proyectiles logica
function updateProyectiles() {
  for (let i = proyectiles.length - 1; i >= 0; i--) {
    let p = proyectiles[i];

    if (p.state === "move") {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > fondoWidth || p.y < 0 || p.y > fondoHeight) {
        p.state = "explode";
        p.timer = 0;
      }
      enemigos.forEach(e => {
        let dx = p.x - e.x;
        let dy = p.y - e.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 15) {
          p.state = "explode";
          p.timer = 0;
          e.vida--;
          e.hitTimer = 12;
        }
      });
      if (camaron.active) {
        let dx = p.x - camaron.x;
        let dy = p.y - camaron.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 12) {
          p.state = "explode";
          p.timer = 0;
          camaron.vida--;
          camaron.hitTimer = 6;
          if (camaron.vida <= 0) { camaron.muriendo = true; camaron.hitTimer = 12; }
        }
      }

    } else if (p.state === "explode") {
      p.timer++;
      if (p.timer > 12) {
        proyectiles.splice(i, 1);
      }
    }
  }
}

//// camaron update
function updateCamaron() {
  if (!camaron.active) return;
///aca ta la animacion
  camaron.timer++;
  if (camaron.timer > 10) {
    camaron.frame++;
    if (camaron.frame >= 12) camaron.frame = 0;
    camaron.timer = 0;
  }

  if (camaron.hitTimer > 0) {
    camaron.hitTimer--;
  }

  if (!rutaDecidida) {
    camaronTimer++;

    if (camaronTimer >= camaronTiempoLimite && camaron.vida > 0) {
      ruta = "agresiva";
      rutaDecidida = true;

      camaron.active = false;
      cristal.active = true;

      tutorialFrame = 0;
      tutorialTimer = 0;
    }

    if (camaron.vida <= 0 && camaron.hitTimer <= 0) {
      ruta = "amable";
      rutaDecidida = true;

      camaron.active = false;
      cristal.active = true;

      tutorialFrame = 0;
      tutorialTimer = 0;
    }
  }

  // muerte c camaron papu misterioso
  if (camaron.vida <= 0 && camaron.hitTimer <= 0) {
    camaron.active = false;
  }
}
//////////////////funcion hacerme sufrir para mover enemigos pdt gracias CodigoData por salvarme
function updateEnemigos() {
    if (enemigos.length === 0 && !esTutorial && !transicion.active) {
        cristal.active = true;
    }

    for (let i = enemigos.length - 1; i >= 0; i--) {
        let e = enemigos[i];
        let dx = player.x - e.x;
        let dy = player.y - e.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 5) {
            e.x += (dx / dist) * e.speed;
            e.y += (dy / dist) * e.speed;
            e.estado = "caminar";
        } else {
            e.estado = "atacar";
        }
        if (e.tipo === "mago" || e.tipo === "slime") {
            let now = Date.now();
            if (dist < 100 && now - e.lastShot > e.shotCooldown) {
                let angle = Math.atan2(dy, dx);
                proyectilesEnemigos.push({
                    x: e.x,
                    y: e.y,
                    vx: Math.cos(angle) * .8,
                    vy: Math.sin(angle) * .8,
                    timer: 0
                });
                e.lastShot = now;
            }
        }
        else if (dist <= 10) { 
            Dañoamiprotakkk();
        }
        e.timer++;
        if (e.timer > 15) {
            if (e.tipo === "mago" || e.tipo === "slime") {
                e.frame = (e.frame + 1) % 4;
            } else {
                if (e.estado === "caminar") {
                    e.frame = (e.frame === 0) ? 1 : 0;
                }
                else if (e.tipo === "fuego") {
                  e.frame = (e.frame === 0) ? 1 : 0; 
                } 
                else {
                    let base = (dx < 0) ? 2 : 4;
                    e.frame = base + (e.timer % 30 < 15 ? 0 : 1);
                }
            }
            e.timer = 0;
        }
        if (e.hitTimer > 0) e.hitTimer--;

    if (e.vida <= 0) {
            let suerte = Math.random(); 
            if(suerte < 1/15){
              objetosSuelo.push({x: e,x, y: e.y, tipo: "llave", width: 16, height: 16});
            }
             else if (suerte < 2/15) { 
                objetosSuelo.push({ x: e.x, y: e.y, tipo: "corazon", width: 16, height: 16 });
            }

            enemigos.splice(i, 1);
        }/////jala porfavor github
    }
}

function updateCristal() {
    if (!cristal.active || transicion.active) return;
    cristal.timer++;
    if (cristal.timer > 10) {
        cristal.frame = (cristal.frame + 1) % cristalFrames.length;
        cristal.timer = 0;
    }
    let dx = player.x - cristal.x;
    let dy = player.y - cristal.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 20 && keys["e"]) {
        iniciarTransicion();
    }
}

function updateObjetos() {
    for (let i = objetosSuelo.length - 1; i >= 0; i--) {
        let obj = objetosSuelo[i];
        let dx = player.x - obj.x;
        let dy = player.y - obj.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 15) {
            if (obj.tipo === "llave") {
                player.llaves++;
                objetosSuelo.splice(i, 1);
            } 
            else if (obj.tipo === "corazon") {
                if (player.vida < 3) {
                    player.vida++;
                    objetosSuelo.splice(i, 1);
                }
            }
        }
    }
}

function iniciarTransicion() {
    transicion.active = true;
    transicion.frame = 0;
    transicion.timer = 0;
}
function updateTransicionLogic() {
    if (!transicion.active) return;

    transicion.timer++;
    if (transicion.timer > 8) {
        transicion.frame++;
        transicion.timer = 0;
    }

    if (transicion.frame === 2 && transicion.timer === 0) {
        cambiarDeZona();
    }
    if (transicion.frame >= 4) {
        transicion.active = false;
        transicion.frame = 0;
    }
}

function updateProyectilesEnemigos() {
    for (let i = proyectilesEnemigos.length - 1; i >= 0; i--) {
        let p = proyectilesEnemigos[i];
        p.x += p.vx;
        p.y += p.vy;
        let dx = p.x - player.x;
        let dy = p.y - player.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 12) { 
            Dañoamiprotakkk();
            proyectilesEnemigos.splice(i, 1);
            continue;
        }
        if (p.x < 0 || p.x > fondoWidth || p.y < 0 || p.y > fondoHeight) {
            proyectilesEnemigos.splice(i, 1);
        }
    }
}


///////// loop
function loop(timestamp) {
  updateFondo(timestamp);
  updatePlayer();
  updatePlayerDirection();
  updateAnimation();
  updateTutorial();
  updateProyectiles();
  updateCamaron();
  updateEnemigos();
  updateProyectilesEnemigos();
  updateObjetos();
  updateCristal();
  updateInvulnerability();
  updateTransicionLogic();

  if (camaron.active && !camaron.muriendo) {
    let dx = player.x - camaron.x;
    let dy = player.y - camaron.y;
    if (Math.sqrt(dx*dx + dy*dy) < 15) Dañoamiprotakkk();
  }
  
  draw();
  requestAnimationFrame(loop);
}

///////// draw general
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawFondo();
  if (!(player.invulnerable && Math.floor(Date.now() / 50) % 2)) {
    drawPlayer();
  }
  drawProyectiles();
  drawProyectilesEnemigos();
  drawCamaron();
  if (cristal.active) {
    drawCristal();
    let dx = player.x - cristal.x;
    let dy = player.y - cristal.y;
    if (Math.sqrt(dx*dx + dy*dy) < 20 && !transicion.active) 
      {
        ctx.drawImage(imgBurbujaE, Math.floor(cristal.x + offsetX - 16), Math.floor(cristal.y - 35), 32, 32);
    }
  }
  if (transicion.active) {
    let img = transicion.frames[transicion.frame];
    if (img && img.complete) {
      ctx.drawImage(img, offsetX, 0, 160, 144);
    }
  }
  drawEnemigos();
  drawObjetos();
  drawHUD();
  if (tutorialActive) drawTutorial();
}

/////////
function drawFondo() {
  let x = (basewidth - 160) / 2;
  if (framesFondo[currentFrame]) {
    ctx.drawImage(framesFondo[currentFrame], x, 0, 160, 144);
  }
}

/////////
function drawPlayer() {
  let img = getPlayerFrame();
  ctx.drawImage(
    img,
    Math.floor(player.x + offsetX - player.width / 2),
    Math.floor(player.y - player.height / 2),
    player.width,
    player.height
  );
}

/////////
function drawProyectiles() {
  for (let p of proyectiles) {
    let drawX = Math.floor(p.x + offsetX);
    let drawY = Math.floor(p.y);

    if (p.state === "move") {
      ctx.drawImage(
        proyectilImg,
        0,
        0,
        proyectilImg.width,
        proyectilImg.height,
        drawX - 7,
        drawY - 7,
        14,
        14
      );
    } else {
      ctx.drawImage(
        explosionImg,
        0,
        0,
        explosionImg.width,
        explosionImg.height,
        drawX - 7,
        drawY - 7,
        14,
        14
      );
    }
  }
}

/////////
function drawTutorial() {
  let x = offsetX;
  let y = 144 - 32;

  let img;

  if (!rutaDecidida) {
    img = tutorialFrames[tutorialFrame];
  } 
  else if (ruta === "amable") {
    let index = Math.min(tutorialFrame, textboxAmable.length - 1);
    img = textboxAmable[index];
  } 
  else if (ruta === "agresiva") {
    let index = Math.min(tutorialFrame, textboxAgresivo.length - 1);
    img = textboxAgresivo[index];
  }

  if (!img || !img.complete) return;

  ctx.drawImage(img, x, y, 160, 32);
}

///////// camaron draw
function drawCamaron() {
  if (!camaron.active) return;

  let drawX = Math.floor(camaron.x + offsetX - 32);
  let drawY = Math.floor(camaron.y - 32);

  let img;
  if (camaron.hitTimer > 0) {
    img = camaronDanadoFrames[camaron.frame];
  } else {
    img = camaronFrames[camaron.frame];
  }

  ctx.drawImage(
  img,
  0, 0, img.width, img.height,
  drawX,
  drawY,
  64,
  64
  );
}

function drawEnemigos() {
    enemigos.forEach(e => {
        let imgSet;
        if (e.tipo === "mago") {
            imgSet = (e.hitTimer > 0) ? magoDanadoFrames : magoFrames;
        }
        else if (e.tipo === "fuego") {
            imgSet = (e.hitTimer > 0) ? fuegoDanadoFrames : fuegoFrames;
        } 
        else if (e.tipo === "slime") {
            imgSet = (e.hitTimer > 0) ? slimeDanadoFrames : slimeFrames;
        }
        else {
            imgSet = (e.hitTimer > 0) ? cangrejoDanadoFrames : cangrejoFrames;
        }let img = imgSet[e.frame];
        if (img && img.complete) {
            ctx.drawImage(
                img, 
                Math.floor(e.x + offsetX - 16), 
                Math.floor(e.y - 16), 
                32, 32
            );
        }});
}

function drawProyectilesEnemigos() {
    proyectilesEnemigos.forEach(p => {
        ctx.drawImage(
            magoProyectilImg, 
            Math.floor(p.x + offsetX - 6),
            Math.floor(p.y - 6), 
            14, 14
        );
    });
}

function drawCristal() {
  if (!cristal.active) return;

  let img = cristalFrames[cristal.frame];

  let drawX = Math.floor(cristal.x + offsetX - 16);
  let drawY = Math.floor(cristal.y - 16);

  ctx.drawImage(img, drawX, drawY, 32, 32);
}

function drawObjetos() {
    objetosSuelo.forEach(obj => {
        let img = (obj.tipo === "llave") ? imgLlave : imgCorazon;
        
        if (img && img.complete) {
            ctx.drawImage(
                img,
                Math.floor(obj.x + offsetX - obj.width / 2),
                Math.floor(obj.y - obj.height / 2),
                obj.width,
                obj.height
            );
        }
    });
}

requestAnimationFrame(loop);
