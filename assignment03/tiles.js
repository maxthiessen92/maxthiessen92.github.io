

function createColor(a, b ,c) {
  return `rgb(${a}, ${b}, ${c})`;
}

function drawGrid(){
    
    const main_block = document.querySelector(".grid-frame");
    let baseR = 0;
    let baseG= 240;
    let baseB = 50;
    let g = baseG;
    let b = baseB;
    let r = baseR;
    for (let i = 0; i < 10; i++) {
        g = baseG;
        b = baseB;
        r = baseR;
        for(let j = 0; j <10; j++){
        
        r+=10;
        g -= 10;
        b+=20;
        const tile = document.createElement("div");
        tile.classList.add("tile");
        let newColor = createColor(r, g, b);
        tile.style.backgroundColor = newColor;
        main_block.appendChild(tile);
        }
        if(i<5){
            baseR+=6;
            baseG-=20;
            baseB+=45;
        }
        else{
           baseR+=10;
           baseG-=20;
           baseB-=45; 
        }
    }
}