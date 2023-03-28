const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;
let canvas;

let pointsFinalized = false;

//initializes canvas if Node.js isn't being used
//this conditional statement will be used throughout the file for any reference to 'document' to avoid issues with Node.js
if (typeof document !== 'undefined') {
    canvas = document.querySelector('#canvas');
}

//initialize PointSet, ConvexHullViewer, and ConvexHull objects
let point_set = new PointSet();
let canvas_viewer = new ConvexHullViewer(canvas, point_set);
let convex_hull = new ConvexHull(point_set, canvas_viewer);


// An object that represents a 2-d point, consisting of an
// x-coordinate and a y-coordinate. The `compareTo` function
// implements a comparison for sorting with respect to x-coordinates,
// breaking ties by y-coordinate.
function Point (x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;

    // Compare this Point to another Point p for the purposes of
    // sorting a collection of points. The comparison is according to
    // lexicographical ordering. That is, (x, y) < (x', y') if (1) x <
    // x' or (2) x == x' and y < y'.
    this.compareTo = function (p) {
	if (this.x > p.x) {
	    return 1;
	}

	if (this.x < p.x) {
	    return -1;
	}

	if (this.y > p.y) {
	    return 1;
	}

	if (this.y < p.y) {
	    return -1;
	}

	return 0;
    }

    // return a string representation of this Point
    this.toString = function () {
	return "(" + x + ", " + y + ")";
    }
}

// An object that represents a set of Points in the plane. The `sort`
// function sorts the points according to the `Point.compareTo`
// function. The `reverse` function reverses the order of the
// points. The functions getXCoords and getYCoords return arrays
// containing x-coordinates and y-coordinates (respectively) of the
// points in the PointSet.
function PointSet () {
    this.points = [];
    this.curPointID = 0;

    // create a new Point with coordintes (x, y) and add it to this
    // PointSet
    this.addNewPoint = function (x, y) {
	this.points.push(new Point(x, y, this.curPointID));
	this.curPointID++;
    }

    // add an existing point to this PointSet
    this.addPoint = function (pt) {
	this.points.push(pt);
    }

    // sort the points in this.points 
    this.sort = function () {
	this.points.sort((a,b) => {return a.compareTo(b)});
    }

    // reverse the order of the points in this.points
    this.reverse = function () {
	this.points.reverse();
    }

    // return an array of the x-coordinates of points in this.points
    this.getXCoords = function () {
	let coords = [];
	for (let pt of this.points) {
	    coords.push(pt.x);
	}

	return coords;
    }

    // return an array of the y-coordinates of points in this.points
    this.getYCoords = function () {
	let coords = [];
	for (pt of this.points) {
	    coords.push(pt.y);
	}

	return coords;
    }

    // get the number of points 
    this.size = function () {
	return this.points.length;
    }

    // return a string representation of this PointSet
    this.toString = function () {
	let str = '[';
	for (let pt of this.points) {
	    str += pt + ', ';
	}
	str = str.slice(0,-2); 	// remove the trailing ', '
	str += ']';

	return str;
    }
}


function ConvexHullViewer (svg, ps) {
    this.svg = svg;  // a n svg object where the visualization is drawn
    this.ps = ps;    // a point set of the points to be visualized 

    let start, step, animate, rect;
    
    //initialises buttons and adds event listeners in node.js isn't being called
    if (typeof document !== 'undefined') {
        start = document.querySelector("#start"); //start button
        step = document.querySelector("#step"); //step button
        animate = document.querySelector("#animate"); //step button
        rect = svg.getBoundingClientRect();

        start.addEventListener('click', startButton); //if start button is clicked
    
        step.addEventListener('click', stepButton); //if step button is clicked
    
        animate.addEventListener('click', animateButton); // if animate button is clicked

        svg.addEventListener('click', draw);
    }

    //executes ConvexHull's animate function on click
    function animateButton(){
        convex_hull.animate();
    }

    //executes ConvexHull's start function and enables step and animate buttons on click 
    function startButton() {
        step.removeAttribute("disabled");
        animate.removeAttribute("disabled");

        convex_hull.start();
    }

    //executes ConvexHull's step function on click
    function stepButton() {
        convex_hull.step();

    }
    
    //draws a line on the svg element given two points and highlights the line
    this.drawFullLine = function(p1, p2){
        let line = document.createElementNS(SVG_NS, 'line');
        line.setAttribute('x1', p1.x-rect.left);
        line.setAttribute('y1', p1.y-rect.top);
        line.setAttribute('x2', p2.x-rect.left);
        line.setAttribute('y2', p2.y-rect.top);
        line.classList.add('line');
        this.highlight(line);
        svg.appendChild(line);
    }

    //mutes the color of a given element
    this.mute = function(el){
        el.classList.add('opac');
    }

    //highlights a given element
    this.highlight = function(el){
        el.classList.add('highlight');
    }

    //unhighlights all highlighted elements
    this.unhighlight = function(){
        document.querySelectorAll('.highlight').forEach(e => e.classList.remove('highlight'));
    }

    //draws dots on svg element on click
    function draw(event) {
        if(!pointsFinalized){
            let x = event.clientX;
            let y = event.clientY;
            let circle = document.createElementNS(SVG_NS, 'circle');
            circle.setAttribute('cx', x - rect.left);
            circle.setAttribute('cy', y - rect.top);
            circle.setAttribute('r', 5);
            circle.setAttribute('fill', '#49a078');
            circle.setAttribute("stroke", '#49a078');
            circle.classList.add("circle");
            ps.addNewPoint(x, y); //adds point to the point set
            svg.appendChild(circle);
        }
    }

    //disables step button
    this.disableStep = function(){
        step.setAttribute("disabled","");
    }

    //disables animate button
    this.disableAnimate = function(){
        animate.setAttribute("disabled","");
    }

    //removes all the lines on the svg element
    this.removeAllLines = function(){
        document.querySelectorAll('.line').forEach(e => e.remove());
    }

    //removes all muted lines on the svg element
    this.removeShadedLines = function(){
        document.querySelectorAll('.opac').forEach(e => e.remove());
    }
}

/*
 * An object representing an instance of the convex hull problem. A ConvexHull stores a PointSet ps that stores the input points, and a ConvexHullViewer viewer that displays interactions between the ConvexHull computation and the 
 */
function ConvexHull (ps, viewer) {
    this.ps = ps;          // a PointSet storing the input to the algorithm
    this.viewer = viewer;  // a ConvexHullViewer for this visualization

    let algo_stack = [];
    let rightTurn = true;
    let upper = true;
    let i = 2;

    //start a visualization of the Graham scan algorithm performed on ps
    this.start = function () {
        //stops if there is an ongoing animation
        //removes all lines on display
        this.stopAnimation();
        viewer.removeAllLines();
        
        //set index for upcoming step functions
        i = 2;

        //set the hull being calculated to the upper convex hull
        upper = true;

        //no more points can be added to the svg
        pointsFinalized = true;

        ps.sort();
        algo_stack = [];
        upper = true;

        //adds first two points to the stack
        algo_stack.push(ps.points[0]);
        algo_stack.push(ps.points[1]);

        //draws first line of algorithm
        viewer.drawFullLine(algo_stack[0], algo_stack[1]);
    }

    //perform a single step of the Graham scan algorithm performed on ps
    this.step = function () {
        
        //remove all muted lines and remove highlight from any lines
        viewer.removeShadedLines();
        viewer.unhighlight();

        //if the index is equal to the length of the point set and the lower hull has been the part being calculated
        //the algorithm is complete
        if((i==ps.size()) &&!upper){
            //disable the step button
            viewer.disableStep();
            return;
        }

        //if the index is equal to the length
        //set up the calculation of the lower hull
        if(i==ps.size()){
            algo_stack = [];
            ps.reverse();
            algo_stack.push(ps.points[0]);
            algo_stack.push(ps.points[1]);
            viewer.drawFullLine(algo_stack[0], algo_stack[1]);
            i = 2;
            upper = false;
            return;
        }
        //if the stack has only one point in it
        //add the point at the current index to the stack and draw a line
        if (algo_stack.length == 1) {
            viewer.drawFullLine(algo_stack[algo_stack.length-1], ps.points[i]);
            algo_stack.push(ps.points[i]);

        }
        //otherwise remove points from the stack until there are no left turns when including the point at the current index of the PointSet
        //after removing points, draw a line from the point at the top of the stack to the one at the current index of the PointSet
        //add point at the current index of the PointSet to the stack and increment the index value
        else{
            rightTurn = isRightTurn(algo_stack[algo_stack.length-2].x, algo_stack[algo_stack.length-2].y, algo_stack[algo_stack.length-1].x, algo_stack[algo_stack.length-1].y, ps.points[i].x, ps.points[i].y);
            let element = viewer.svg.lastElementChild;
            while((!rightTurn) && (algo_stack.length > 1)){
                algo_stack.pop();
                viewer.mute(element);
                element = element.previousElementSibling;
                if(algo_stack.length == 1){
                    break;
                }
                rightTurn = isRightTurn(algo_stack[algo_stack.length-2].x, algo_stack[algo_stack.length-2].y, algo_stack[algo_stack.length-1].x, algo_stack[algo_stack.length-1].y, ps.points[i].x, ps.points[i].y);
            }
            viewer.drawFullLine(algo_stack[algo_stack.length-1], ps.points[i]);
            algo_stack.push(ps.points[i]);
            i++;
        }   
    }

    //calls animateStep every 3/4 secs
    this.animate = function () {
        let btn = document.getElementById("animate");
        btn.setAttribute("disabled", "");
        if (this.curAnimation == null) {
            this.curAnimation = setInterval(() => {
            this.animateStep();
            }, 750);
        }
        }
    
    //Animating a Step
    
    this.animateStep = function () {
    if (i == this.ps.size() && !upper) {
        this.stopAnimation();
        this.step();
            
    } 
    else {
        this.step();
    }
    }
    
    //Stopping the Animation
    
    this.stopAnimation = function () {
        clearInterval(this.curAnimation);
        this.curAnimation = null;
    }
    
   
    // Return a new PointSet consisting of the points along the convex
    // hull of ps. This method should **not** perform any
    // visualization. It should **only** return the convex hull of ps
    // represented as a (new) PointSet. Specifically, the elements in
    // the returned PointSet should be the vertices of the convex hull
    // in clockwise order, starting from the left-most point, breaking
    // ties by minimum y-value.
    this.getConvexHull = function () {
        let toReturn = new PointSet(); //ps that will return convex hull of original ps

        ps.sort(); //sort the PointSet

        let stk = []; //stack storing first 2 points in X
        let p1x, p1y, p2x, p2y, p3x, p3y;

        stk.push(ps.points[0]);
        if(ps.points.length > 1){
        stk.push(ps.points[1]);
        }
        let rightTurn = true; //boolean for if the next point makes a right turn

        //gets upper hull
        for (let C = 2; C < ps.size(); C++) {
            if (stk.size == 1) {
                stk.push(ps.points[C]);
            }
            else {
                p1x = stk[stk.length-2].x;
                p1y = stk[stk.length-2].y;
                p2x = stk[stk.length-1].x;
                p2y = stk[stk.length-1].y;
                p3x = ps.points[C].x;
                p3y = ps.points[C].y;
                //if the point getting checked has a higher y value than the point at the top of the stack
                //rightTurn is false
                rightTurn = isRightTurn(p1x, p1y, p2x, p2y, p3x, p3y);
                //if right turn is false and the stack length is greater than 1
                //pop the top point of the stack and check rightTurn again
                //add push point getting checked 
                while ((!rightTurn) && (stk.length > 1)) {
                    stk.pop();
                    
                    if(stk.length == 1){
                        break;
                    }

                    p1x = stk[stk.length-2].x;
                    p1y = stk[stk.length-2].y;
                    p2x = stk[stk.length-1].x;
                    p2y = stk[stk.length-1].y;
                    p3x = ps.points[C].x;
                    p3y = ps.points[C].y;

                    rightTurn = isRightTurn(p1x, p1y, p2x, p2y, p3x, p3y);
                }
                stk.push(ps.points[C]);
            }
        }

        //record upper hull length
        let upperLength = stk.length;

        //reverse order of point set so we go right to left
        ps.reverse();
    
        //add second point of the lower hull
        if(ps.points.length > 1){
            stk.push(ps.points[1]);
        }
        //gets lower hull
        for (let C = 2; C < ps.size(); C++) {
            if (stk.size == 1) {
                stk.push(ps.points[C]);
            }
            else {
                p1x = stk[stk.length-2].x;
                p1y = stk[stk.length-2].y;
                p2x = stk[stk.length-1].x;
                p2y = stk[stk.length-1].y;
                p3x = ps.points[C].x;
                p3y = ps.points[C].y;
                //if the point getting checked has a lower y value than the point at the top of the stack
                //rightTurn is false
                rightTurn = isRightTurn(p1x, p1y, p2x, p2y, p3x, p3y);

                //if right turn is false and the stack length is greater than 1
                //pop the top point of the stack and check rightTurn again
                //push point getting checked 
                while ((!rightTurn) && (stk.length > upperLength)) { 
                    stk.pop();
                    
                    if(stk.length == 1){
                        break;
                    }
                    p1x = stk[stk.length-2].x;
                    p1y = stk[stk.length-2].y;
                    p2x = stk[stk.length-1].x;
                    p2y = stk[stk.length-1].y;
                    p3x = ps.points[C].x;
                    p3y = ps.points[C].y;

                    rightTurn = isRightTurn(p1x, p1y, p2x, p2y, p3x, p3y);
                  
                }
                stk.push(ps.points[C]);
            }
        }
       
        //pop all of the points in the stack into the PointSet to be returned
        while(stk.length != 0){
            toReturn.addPoint(stk.pop());
        }
        return toReturn;
    }

    //returns boolean value of whether three points make a right turn or not
    function isRightTurn(p1x, p1y, p2x, p2y, p3x, p3y){
        return ((p2x-p1x)*( p3y-p1y)-(p2y-p1y)*(p3x-p1x)) > 0;
    }
}

try {
    exports.PointSet = PointSet;
    exports.ConvexHull = ConvexHull;
  } catch (e) {
    console.log("not running in Node");
  }
