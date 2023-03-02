// Array of 1s and 0s that will be read through to determine how a rule is displayed
let config = new Array(100);

// Rule number
let rule = 0;

// Function that runs on window load after the rule number is selected
function main(){
    setUp();
    updateGrid();
    for(let i = 0; i < config.length-1; i++){
        config = applyRule(config, rule);
        updateGrid();
    }
}

// Function that creates the array that will represent the first row of the grid, a title h1 element, and the grid frame
function setUp(){
    // Sets up inital array
    for(let i = 0; i < config.length; i++){
        config[i] = 0;
    }
    config[(config.length/2)-1] = 1;

    // Create title h1 element
    const main_block = document.querySelector(".root");
    const title = document.createElement("h1");
    title.textContent = `Rule ${rule}`;
    main_block.appendChild(title);

    // Create the frame of the grid
    const frame = document.createElement("div");
    frame.classList.add("grid-frame");
    main_block.appendChild(frame);
}

// Adds a row to the grid. Color of div elements dependent on config array values
function updateGrid(){
    const frame = document.querySelector(".grid-frame");

     for(let i = 0; i < config.length; i++){
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if(config[i] == 0){
            cell.style.backgroundColor = "#8EE4AF";
            cell.style.outlineColor = "#8EE4AF";
        }
        else{
            cell.style.backgroundColor = "#379683";
            cell.style.outlineColor = "#379683";
        }
        frame.appendChild(cell);
    }      
}
// Determines the values (0 or 1) for the next row of the grid
function applyRule(config, rule){
    let binary = rule.toString(2).padStart(8, '0');
    let newConfig = new Array(config.length); // New array that is returned
    let left = 0; 
    let center = 0;
    let right = 0;
    //for loop that fills the new array
    for(let i = 0; i < config.length; i++){
        // if statements that check for edge cases
        if(i == 0){
            left = config[config.length - 1];
            center = config[i];
            right = config[i+1];  
        }

        if(i == config.length - 1){
            left = config[i-1];
            center = config[i]
            right = config[0];
        }

        if(i != 0 && i != config.length-1){
            left = config[i-1];
            center = config[i];
            right = config[i+1];
        }

        //checks conditions to determine 0 or 1 value
        if(left == 1 && center == 1 && right == 1){
            newConfig[i] = Number(binary.charAt(0));
        }
        if(left == 1 && center == 1 && right == 0){
            newConfig[i] = Number(binary.charAt(1));
        }
        if(left == 1 && center == 0 && right == 1){
            newConfig[i] = Number(binary.charAt(2));
        }
        if(left == 1 && center == 0 && right == 0){
            newConfig[i] = Number(binary.charAt(3));
        }
        if(left == 0 && center == 1 && right == 1){
            newConfig[i] = Number(binary.charAt(4));
        }
        if(left == 0 && center == 1 && right == 0){
            newConfig[i] = Number(binary.charAt(5));
        }
        if(left == 0 && center == 0 && right == 1){
            newConfig[i] = Number(binary.charAt(6));
        }
        if(left == 0 && center == 0 && right == 0){
            newConfig[i] = Number(binary.charAt(7));
        }
    }
    return newConfig; // Return the new array
}

// User input on window load that determines what cellular automata rule will be displayed
function selectRule() {

    rule = Number(prompt("Enter a rule number (0-255):", "57"));

    // If statements that ensure the value is between 0 and 255
    if(rule > 255){
        rule = 255;
    }
    if(rule < 0){
        rule = 0;
    }
  }

  // Gives the option to randomize the first row of the grid
/*function initArray(){
    let display = prompt("do you want the cellular automata to begin centered (type 'c') or randomized (type 'r'):", "c");
    if(display == "c"){
        
    }
    else{
        
        for(let i = 0; i < config.length; i++){
            let rand = Math.floor(Math.random()*10);
            if(rand < 5)
            config[i] = 0;
            else
            config[i] = 1;
        }
    }
} */
  
  module.exports = { applyRule };
