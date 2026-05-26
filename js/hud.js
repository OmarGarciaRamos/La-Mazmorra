const imgVida = new Image();
imgVida.src = "assets/protagonistaItems/vida/vida.png";

const imgVidaGris = new Image();
imgVidaGris.src = "assets/protagonistaItems/vida/vidagris.png";

const imgLlave = new Image();
imgLlave.src = "assets/protagonistaItems/items/llave.png";

const imgLlaveGris = new Image();
imgLlaveGris.src = "assets/protagonistaItems/items/llavegris.png";



function drawHUD() {
    const yInicio = 10;
    const espacio = 18; 
    const tamañoIcono = 16;
    const xVida = 15; 
    for (let i = 0; i < player.maxVida; i++) {
        let img = (i < player.vida) ? imgVida : imgVidaGris;
        if (img.complete) {
            ctx.drawImage(img, xVida, yInicio + (i * espacio), tamañoIcono, tamañoIcono);
        }
    }
    /////////////////////////////////
    const xLlaves = basewidth - 15 - tamañoIcono; 
    for (let i = 0; i < player.maxLlaves; i++) {
        let img = (i < player.llaves) ? imgLlave : imgLlaveGris;
        
        if (img.complete) {
            ctx.drawImage(
                img, 
                xLlaves, 
                yInicio + (i * espacio), 
                tamañoIcono, tamañoIcono
            );
        }
    }
}
