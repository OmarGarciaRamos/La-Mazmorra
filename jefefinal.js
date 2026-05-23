let jefe = {
    vida: 90,
    maxVida: 90,
    estado: "inactivo",
    frameActual: 0,
    timer: 0,
    ticsPorFrame: 10,
    hitboxIzquierda: { x: 0, y: 0, width: 16, height: 144, active: false },
    hitboxDerecha: { x: 144, y: 0, width: 16, height: 144, active: false },
    x: 0, y: 0, width: 160, height: 144,
    cooldownDisparo: 0
};

let imgFondoFinal = new Image(); imgFondoFinal.src = "assets/jefe/fondofinal.png";

let animIntroJefe = [];
let animFase1 = [];
let animTransFase2 = [];
let animFase2 = [];
let animTransFase3 = [];
let animFase3 = [];
let animFinalJefe = [];

function cargarSpritesJefe() {
    for(let i=1; i<=104; i++) {
        let img = new Image(); img.src = `assets/jefe/intro/animacionintrojefe_${i.toString().padStart(4, "0")}.png`;
        animIntroJefe.push(img);
    }
    for(let i=1; i<=4; i++) {
        let img = new Image(); img.src = `assets/jefe/fase1/fase1_${i.toString().padStart(4, "0")}.png`;
        animFase1.push(img);
    }
    for(let i=1; i<=5; i++) {
        let img = new Image(); img.src = `assets/jefe/transfase2/transfase2_${i.toString().padStart(4, "0")}.png`;
        animTransFase2.push(img);
    }
    for(let i=1; i<=4; i++) {
        let img = new Image(); img.src = `assets/jefe/fase2/fase2_${i.toString().padStart(4, "0")}.png`;
        animFase2.push(img);
    }
    for(let i=1; i<=8; i++) {
        let img = new Image(); img.src = `assets/jefe/transfase3/transfase3_${i.toString().padStart(4, "0")}.png`;
        animTransFase3.push(img);
    }
    for(let i=1; i<=3; i++) {
        let img = new Image(); img.src = `assets/jefe/fase3/fase3_${i.toString().padStart(4, "0")}.png`;
        animFase3.push(img);
    }
    for(let i=1; i<=79; i++) {
        let img = new Image(); img.src = `assets/jefe/final/animacionfinal_${i.toString().padStart(4, "0")}.png`;
        animFinalJefe.push(img);
    }
}
cargarSpritesJefe();


function iniciarPeleaFinal() {
    zonaActual = "final";
    jefe.estado = "intro";
    jefe.vida = 90;
    jefe.frameActual = 0;
    jefe.timer = 0;
    enemigos = [];
    proyectilesEnemigos = [];
    cristal.active = false;
}

let anguloEspiral = 0;

function updateJefe() {
    if (jefe.estado === "inactivo") return;

    jefe.timer++;
    switch (jefe.estado) {
        case "intro":
            if (jefe.timer >= jefe.ticsPorFrame) {
                jefe.frameActual++;
                jefe.timer = 0;
            }
            if (jefe.frameActual >= animIntroJefe.length) {
                jefe.estado = "fase1";
                jefe.frameActual = 0;
                jefe.timer = 0;
            }
            break;

        case "fase1":
            if (jefe.timer >= jefe.ticsPorFrame) {
                jefe.frameActual = (jefe.frameActual + 1) % animFase1.length;
                jefe.timer = 0;
            }
            jefe.cooldownDisparo++;
            if (jefe.cooldownDisparo > 120) { 
                for (let i = 0; i < 3; i++) {
                    let origenX = 80;
                    let origenY = 34;
                    let dx = player.x - origenX;
                    let dy = player.y - origenY;
                    let distancia = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distancia > 0) {
                        let dirX = dx / distancia;
                        let dirY = dy / distancia;
                        let velocidadBase = 0.4 + (i * 0.3) + (Math.random() * 0.2);
                        proyectilesEnemigos.push({ 
                            x: origenX, 
                            y: origenY, 
                            vx: dirX * velocidadBase, 
                            vy: dirY * velocidadBase, 
                            timer: 0 
                        });
                    }
                }
            
                jefe.cooldownDisparo = 0;
            }

            if (jefe.vida <= 60) {
                jefe.estado = "trans2";
                jefe.frameActual = 0;
                jefe.timer = 0;
            }
            break;

        case "trans2":
            if (jefe.timer >= jefe.ticsPorFrame) {
                jefe.frameActual++;
                jefe.timer = 0;
            }
            if (jefe.frameActual >= animTransFase2.length) {
                jefe.estado = "fase2";
                jefe.frameActual = 0;
                jefe.timer = 0;
            }
            break;

        case "fase2":
            if (jefe.timer >= jefe.ticsPorFrame) {
                jefe.frameActual = (jefe.frameActual + 1) % animFase2.length;
                jefe.timer = 0;
            }

            jefe.cooldownDisparo++;
            if (jefe.cooldownDisparo > 15) {
                
                if (jefe.anguloEspiral === undefined) jefe.anguloEspiral = 0;

                let screenCenterX = 80; 
                let screenCenterY = 72; 
                let velocidadBala = 1.2; 
                for (let i = 0; i < 4; i++) {
                    let anguloBala = jefe.anguloEspiral + (i * Math.PI / 2);

                    let vx = Math.cos(anguloBala) * velocidadBala;
                    let vy = Math.sin(anguloBala) * velocidadBala;

                    proyectilesEnemigos.push({ 
                        x: screenCenterX, 
                        y: screenCenterY, 
                        vx: vx, 
                        vy: vy, 
                        timer: 0 
                    });
                }
                jefe.anguloEspiral += 0.2; 
                jefe.cooldownDisparo = 0;
            }

            if (jefe.vida <= 30) {
                jefe.estado = "trans3";
                jefe.frameActual = 0;
                jefe.timer = 0;
            }
            break;

        case "trans3":
            if (jefe.timer >= jefe.ticsPorFrame) {
                jefe.frameActual++;
                jefe.timer = 0;
            }
            if (jefe.frameActual >= (typeof animTransFase3 !== 'undefined' ? animTransFase3.length : 1)) {
                jefe.estado = "fase3";
                jefe.frameActual = 0;
                jefe.timer = 0;
            }
            break;

        case "fase3":
            if (jefe.timer >= jefe.ticsPorFrame) {
                jefe.frameActual = (jefe.frameActual + 1) % animFase3.length;
                jefe.timer = 0;
            }

            jefe.cooldownDisparo++;
            if (jefe.cooldownDisparo > 35) {
                let zonasY = [30, 60, 90, 120]; 
                let yAleatoria = zonasY[Math.floor(Math.random() * zonasY.length)];
                let lado = Math.floor(Math.random() * 2); 
                
                let origenX, vx;
                let velocidadAleatoria = 0.4 + Math.random() * 0.7; 

                if (lado === 0) {
                    origenX = 5; 
                    vx = velocidadAleatoria;
                } else {
                    origenX = 155;
                    vx = -velocidadAleatoria;
                }
                proyectilesEnemigos.push({ 
                    x: origenX, 
                    y: yAleatoria, 
                    vx: vx, 
                    vy: 0, 
                    timer: 0 
                });

                jefe.cooldownDisparo = 0;
            }

            if (jefe.vida <= 0) {
                jefe.estado = "muerto";
                jefe.frameActual = 0;
                jefe.timer = 0;
            }
            break;

        case "muerto":
            if (jefe.timer >= jefe.ticsPorFrame) {
                if (jefe.frameActual < animFinalJefe.length - 1) {
                    jefe.frameActual++;
                }
                jefe.timer = 0;
            }
            break;
    }
}

function drawJefe() {
    if (jefe.estado === "inactivo") return;

    let img;
    switch (jefe.estado) {
        case "intro":
            img = animIntroJefe[jefe.frameActual];
            if (img && img.complete) ctx.drawImage(img, offsetX, 0, 160, 144);
            break;
        case "fase1":
            img = animFase1[jefe.frameActual];
            if (img && img.complete) ctx.drawImage(img, offsetX, 0, 160, 34);
            break;
        case "trans2":
            img = animTransFase2[jefe.frameActual];
            if (img && img.complete) ctx.drawImage(img, offsetX, 0, 160, 144);
            break;
        case "fase2":
            img = animFase2[jefe.frameActual];
            if (img && img.complete) ctx.drawImage(img, offsetX + 63, 55, 34, 34);
            break;
        case "trans3":
            img = animTransFase3[jefe.frameActual];
            if (img && img.complete) ctx.drawImage(img, offsetX, 0, 160, 144);
            break;
        case "fase3":
            img = animFase3[jefe.frameActual];
            if (img && img.complete) ctx.drawImage(img, offsetX, 0, 160, 144);
            break;
        case "muerto":
            img = animFinalJefe[jefe.frameActual];
            if (img && img.complete) ctx.drawImage(img, offsetX, 0, 160, 144);
            break;
    }
}