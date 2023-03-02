const ns = "http://www.w3.org/2000/svg";

// Boolean that determines if svg element gets drawn or not
let isDrawing = false;

// x and y elements for svg elements that are saved on click
let x = 0;
let y = 0;

// Variable that is copied and pasted so that object isn't erased when a new object is drawn
var c;

// String which determines what shape is drawn
var state = "line";

// Canvas to draw on
const box = document.querySelector("#dot-box");

// Add event listeners for click and move to draw shapes
box.addEventListener("click", getState);
box.addEventListener("mousemove", draw);

// Button that sets shape to draw a circle when clicked
const circleButton = document.querySelector("#circle-button");
circleButton.addEventListener("click", setStateCircle);

// Button that sets shape to draw a rectangle when clicked
const rectButton = document.querySelector("#rect-button");
rectButton.addEventListener("click", setStateRect);

// Button that sets shape to draw a line when clicked
const lineButton = document.querySelector("#line-button");
lineButton.addEventListener("click", setStateLine);

// Button that sets shape to draw an ellipse when clicked
const ellipseButton = document.querySelector("#ellipse-button");
ellipseButton.addEventListener("click", setStateEllipse);

// Range sliders that are used to change the rgb values of the shapes that will be drawn
var redSlider = document.querySelector("#redSlider");
var greenSlider = document.querySelector("#greenSlider");
var blueSlider = document.querySelector("#blueSlider");

// Button to click when a new color wants to be set out of rgb sliders
const colorButton = document.querySelector("#color-button");
colorButton.addEventListener("click", setColor);

// Color is saved to this variable
var stroke = `rgb(0, 0, 0)`;




// Function executed on mouse click
function getState(e){
    // Sets x and y values according to mouse location
    x = e.offsetX;
    y = e.offsetY;

    // Creates a circle on click and deletes it after 0.1sec
    let clickCircle = document.createElementNS(ns, "circle");
    clickCircle.setAttributeNS(null, "cx", x);
    clickCircle.setAttributeNS(null, "cy", y);
    clickCircle.setAttributeNS(null, "r", 20);
    clickCircle.setAttributeNS(null, "stroke", stroke);
    clickCircle.setAttributeNS(null, "fill", "transparent");
    clickCircle.setAttribute("id","to-delete");
    box.insertBefore(clickCircle, box.lastChild);
    setTimeout(removeElement, 100);

    // If drawing boolean is false set it to true
    if(isDrawing==false){
        isDrawing = true;
    }
    // Otherwise set drawing to false and add the clone element to the canvas
    else{
        isDrawing = false;
        box.insertBefore(c, box.lastChild);
    }
}

// Function executed on mouse move
function draw(e){
    
    // Only draws shape if boolean is true
    if(isDrawing){
        let rect = box.getBoundingClientRect();

        //Draws line on drag (replacing last child of the canvas) and creates clone if state is line
        if(state == "line"){
            let line = document.createElementNS(ns, "line");
            line.setAttributeNS(null, "x1", x);
            line.setAttributeNS(null, "y1", y);
            line.setAttributeNS(null, "x2", e.clientX-rect.left);
            line.setAttributeNS(null, "y2", e.clientY-rect.top);
            line.setAttributeNS(null, "stroke", stroke);
            line.classList.add("line");
            box.replaceChild(line, box.lastChild);
            c = line.cloneNode(true);
        }
        //Draws circle on drag (replacing last child of the canvas) and creates clone if state is line
        if(state == "circle"){
            // create radius value with two click indexes according to Pythagorean Theorem
            let radius = Math.sqrt(Math.pow(Math.abs(x-(e.clientX-rect.left)),2)+Math.pow(Math.abs(y-(e.clientY-rect.top)),2));
            let circle = document.createElementNS(ns, "circle");
            circle.setAttributeNS(null, "cx", x);
            circle.setAttributeNS(null, "cy", y);
            circle.setAttributeNS(null, "r", radius);
            circle.setAttributeNS(null, "stroke", stroke);
            circle.classList.add("circle");
            box.replaceChild(circle, box.lastChild);
            c = circle.cloneNode(true);
        }
        //Draws rectangle on drag (replacing last child of the canvas) and creates clone if state is line
        if(state == "rect"){
            let newRect = document.createElementNS(ns, "rect");
            newRect.setAttributeNS(null, "x", x);
            newRect.setAttributeNS(null, "y", y);
            newRect.setAttributeNS(null, "width", Math.abs(e.clientX-rect.left-x));
            newRect.setAttributeNS(null, "height", Math.abs(e.clientY-rect.top-y));
            newRect.setAttributeNS(null, "stroke", stroke);
            newRect.classList.add("rect");
            box.replaceChild(newRect, box.lastChild);
            c = newRect.cloneNode(true);
        }
        //Draws ellipse on drag (replacing last child of the canvas) and creates clone if state is line
        if(state == "ellipse"){
            let ellipse = document.createElementNS(ns, "ellipse");
            ellipse.setAttributeNS(null, "cx", x);
            ellipse.setAttributeNS(null, "cy", y);
            ellipse.setAttributeNS(null, "rx", Math.abs(e.clientX-rect.left-x));
            ellipse.setAttributeNS(null, "ry", Math.abs(e.clientY-rect.top-y));
            ellipse.setAttributeNS(null, "stroke", stroke);
            ellipse.classList.add("ellipse");
            box.replaceChild(ellipse, box.lastChild);
            c = ellipse.cloneNode(true);
        }
    }
}

// Sets state to circle
function setStateCircle(e){
    state = "circle";
}

// Sets state to rectangle
function setStateRect(e){
    state = "rect";
}

// Sets state to line
function setStateLine(e){
    state = "line";
}

// Sets state to ellipse
function setStateEllipse(e){
    state = "ellipse";
}

// Sets color according to slider values
function setColor(e){
    stroke = `rgb(${redSlider.value},${greenSlider.value},${blueSlider.value})`;
}

// removes element if it has a to-delete tag
function removeElement() {
    var elem = document.getElementById("to-delete");
    return box.removeChild(elem);
}