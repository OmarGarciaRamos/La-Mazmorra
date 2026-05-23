let derrotaActive = false;
let derrotaFrameActual = 0;
let derrotaTimer = 0;
const ticsPorFrame = 10;

let derrota = [];
for (let i = 1; i <= 53; i++) {
    let img = new Image();
    let num = i.toString().padStart(4, "0");
    img.src = "assets/derrota/derrota_" + num + ".png";
    derrota.push(img);
}
