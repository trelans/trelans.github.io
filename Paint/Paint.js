var canvas;
var gl;

var index = 0;
var cBuffer;
var VBuffer;
var VPosition;
var vColor;
var isMouseDown = false;
var isPainting = false;
var isErasing = false;
var program;
var currentColor = vec4(0.0, 0.0, 0.0, 1.0); // Initial color (black)
var zoomEnabled = false;

let currentLayer = 0; // Initial layer (1)
let currentLayerOffset = 0; // Initial layer offset (0)
let currentLayerZIndex = 2; // Initial layer Z index (2)

let layerIndexes = [0, 1, 2];
const layerSizes = [0, 0, 0];

let layerVertices = [
    [],
    [],
    []
];

let layerColors = [
    [],
    [],
    []
];

let isSelectedBefore = false;
const numRows = 40; // Number of rows
const numColumns = 40; // Number of columns

const cubeSize = 0.05; // Size of each cube

// Define vertices and colors for the triangles
const vertices = [];
let currentVertices = [];
let currentColors = [];
const vertexColors = [];
let dynamicVertices = [];
let dynamicColors = [];

var indexColor;
var previousIndexColor = -1;
const undoHistory = {
    vertexStates: [],
    colorStates: [],
    layerIndexes: [],
    selectionRectVertices: [],
    currentIndex: -1,
    renderIndex: 0,
    maxHistoryLength: 30
};



let isDragging = false;
let lastX = 0;
let lastY = 0;

let zoomScale = 1;
let xOffset = 0;
let yOffset = 0;

const ZOOM_FACTOR = 0.1; // The zoom sensitivity. Adjust as needed.

var selectedVertices = []; // Store the selected vertices
var selectionStart = { x: 0, y: 0 };
var selectionEnd = { x: 0, y: 0 };

var lastSelectionStart = { x: 0, y: 0 };
var lastSelectionEnd = { x: 0, y: 0 };
var lastSelectionStartBase = { x: 0, y: 0 };
var lastSelectionEndBase = { x: 0, y: 0 };

var isSelectionOn = false;
let pushing = false;

var rectBuffer;
var positionLoc;
var rectVertices = [];
var canMove = false;
var brush = true;

var currentVerticesMoveBase = [];
var selectionRectVertices = [];

var willBeCopiedVertex = [];
var willBeCopiedColor = [];

let left = 0;
let right = 2;
let bottom = 0;
let top1 = 2;
let near = -10; // TODO - Adjust as needed
let far = 10; // TODO - Adjust as needed

let zoomInEnabled = false;
let zoomOutEnabled = false;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set size value
    const size = gl.getUniformLocation(program, 'size');
    gl.uniform1f(size, 0.1); // Cube Size
    manageZoomAndPan(canvas);
    // Orthographic Projection

    const projectionMatrix = ortho(left, right, bottom, top1, near, far);
    const u_ProjectionMatrix = gl.getUniformLocation(program, 'projectionMatrix');
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, flatten(projectionMatrix));

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            const x = j * cubeSize;
            const y = i * cubeSize;
            const z = 0.0; // Z coordinate

            // Define the vertices for a single square divided into four triangles
            const squareVertices = [

                x, y + cubeSize, z,
                x + cubeSize / 2, y + cubeSize / 2, z, //left
                x, y, z,

                x + cubeSize, y + cubeSize, z,
                x, y + cubeSize, z,
                x + cubeSize / 2, y + cubeSize / 2, z, //top

                x + cubeSize, y + cubeSize, z,
                x + cubeSize / 2, y + cubeSize / 2, z, //right
                x + cubeSize, y, z,

                x, y, z,
                x + cubeSize / 2, y + cubeSize / 2, z, //bottom
                x + cubeSize, y, z
            ];

            vertices.push(...squareVertices);

        }
    }

    pushState(); // Save the initial state
    VBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, numColumns * numRows * 3 * 16 * layerVertices.length * 3, gl.STATIC_DRAW);

    VPosition = gl.getAttribLocation(program, "position");
    gl.vertexAttribPointer(VPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(VPosition);


    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, numColumns * numRows * 4 * 32 * layerColors.length * 3, gl.STATIC_DRAW);

    vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);


    function redrawingCanvas() {

        // Define rectangle vertices using selectionStart and selectionEnd.
        rectVertices = [
            vec3(selectionStart.x, selectionStart.y, 0),
            vec3(selectionEnd.x, selectionStart.y, 0),
            vec3(selectionStart.x, selectionEnd.y, 0),

            vec3(selectionEnd.x, selectionStart.y, 0),
            vec3(selectionEnd.x, selectionEnd.y, 0),
            vec3(selectionStart.x, selectionEnd.y, 0)

        ];

        colorVertices = [
            vec4(0.0, 1.0, 0.0, 0.5),
            vec4(0.0, 1.0, 0.0, 0.5),
            vec4(0.0, 1.0, 0.0, 0.5),

            vec4(0.0, 1.0, 0.0, 0.5),
            vec4(0.0, 1.0, 0.0, 0.5),
            vec4(0.0, 1.0, 0.0, 0.5)

        ];
        let indexVertices = layerVertices[currentLayer].length - 6;
        selectionRectVertices = [indexVertices, 6]
        layerVertices[currentLayer].splice(indexVertices, 6);
        layerColors[currentLayer].splice(indexVertices, 6);

        layerVertices[currentLayer].push(...rectVertices);
        layerColors[currentLayer].push(...colorVertices);


        fillBuffers();
        render();

    }

    function redrawCanvas() {


        if (isSelectedBefore) {

            deSelect()

        }
        isSelectedBefore = true;
        // Define rectangle vertices using selectionStart and selectionEnd.
        rectVertices = [
            vec3(selectionStart.x, selectionStart.y, 0),
            vec3(selectionEnd.x, selectionStart.y, 0),
            vec3(selectionStart.x, selectionEnd.y, 0),

            vec3(selectionEnd.x, selectionStart.y, 0),
            vec3(selectionEnd.x, selectionEnd.y, 0),
            vec3(selectionStart.x, selectionEnd.y, 0)

        ];

        colorVertices = [
            vec4(0.0, 1.0, 0.0, 0.5),
            vec4(0.0, 1.0, 0.0, 0.5),
            vec4(0.0, 1.0, 0.0, 0.5),

            vec4(0.0, 1.0, 0.0, 0.5),
            vec4(0.0, 1.0, 0.0, 0.5),
            vec4(0.0, 1.0, 0.0, 0.5)

        ];
        layerVertices[currentLayer].push(...rectVertices);
        layerColors[currentLayer].push(...colorVertices);

        index = index + 6;
        fillBuffers();
        render();


    }

    // Event listener for Ctrl+Z (undo)
    document.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.key === "z") {
            // Ctrl+Z was pressed
            undo();
         
        }

    });
    // Event listener for Ctrl+Y (redo)
    document.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.key === "y") {
            // Ctrl+Y was pressed
            redo();
        }

    });

    // Event listener for Ctrl+C (copy)
    document.addEventListener("keyup", function (event) {
        if (event.ctrlKey && event.key === "c") {
            // Ctrl+C was pressed

            copy();
        }

    });

    // Event listener for Ctrl+V (paste)
    document.addEventListener("keyup", function (event) {
        if (event.ctrlKey && event.key === "v") {
            // Ctrl+V was pressed
            // You can perform your paste logic here

            copy();

            if (willBeCopiedVertex.length > 0) {
                index = index + willBeCopiedVertex.length;

                layerVertices[currentLayer].push(...willBeCopiedVertex);
                layerColors[currentLayer].push(...willBeCopiedColor);
                fillBuffers();
                render();
                pushState()
            }

        }
    });

    // Add a mousedown event listener
    canvas.addEventListener("mousedown", function (event) {
        isMouseDown = true;

        if (canMove) {

            var x = event.clientX - canvas.getBoundingClientRect().left;
            var y = event.clientY - canvas.getBoundingClientRect().top;


            x = (2 * x / canvas.width);
            y = 2 - (2 * y / canvas.height);


            selectionStart.x = x;
            selectionStart.y = y;

            currentVerticesMoveBase = JSON.parse(JSON.stringify(layerVertices[currentLayer]));

        }

        else if (isSelectionOn) {


            var x = event.clientX - canvas.getBoundingClientRect().left;
            var y = event.clientY - canvas.getBoundingClientRect().top;


            x = (2 * x / canvas.width);
            y = 2 - (2 * y / canvas.height);


            selectionStart.x = x;
            selectionStart.y = y;
            selectionEnd.x = x;
            selectionEnd.y = y;
            selectedVertices = []; // Clear the selected vertices list.
            redrawCanvas()
        }
        else if (brush || isErasing) {

            drawing();

        }
        else if (zoomEnabled) {
            isDragging = true;
            lastX = event.clientX;
            lastY = event.clientY;
        }
    });


    // Add a mousemove event listener to enable painting while dragging
    canvas.addEventListener("mousemove", function (event) {
        if (isMouseDown) {

            if (canMove) {


                var x = event.clientX - canvas.getBoundingClientRect().left;
                var y = event.clientY - canvas.getBoundingClientRect().top;


                x = (2 * x / canvas.width);
                y = 2 - (2 * y / canvas.height);

                selectionEnd.x = x;
                selectionEnd.y = y;

                var deltaMovementX = selectionEnd.x - selectionStart.x;
                var deltaMovementY = selectionEnd.y - selectionStart.y;
                lastSelectionStart.x = lastSelectionStartBase.x + deltaMovementX;
                lastSelectionStart.y = lastSelectionStartBase.y + deltaMovementY;
                lastSelectionEnd.x = lastSelectionEndBase.x + deltaMovementX;
                lastSelectionEnd.y = lastSelectionEndBase.y + deltaMovementY;

                for (var i = 0; i < selectedVertices.length; i++) {
                    var currentIndex = selectedVertices[i];
                    layerVertices[currentLayer][currentIndex][0] = currentVerticesMoveBase[currentIndex][0] + deltaMovementX;
                    layerVertices[currentLayer][currentIndex][1] = currentVerticesMoveBase[currentIndex][1] + deltaMovementY;
                }

                fillBuffers();
                render();

            }
            else if (isSelectionOn) {
                var x = event.clientX - canvas.getBoundingClientRect().left;
                var y = event.clientY - canvas.getBoundingClientRect().top;


                x = (2 * x / canvas.width);
                y = 2 - (2 * y / canvas.height);


                selectionEnd.x = x;
                selectionEnd.y = y;
                redrawingCanvas();


            } else if (brush || isErasing) {
                // Set the flag to indicate painting
                isPainting = true;
                drawing();

            } else if (zoomEnabled) {
                if (isDragging) {
                    let dx = event.clientX - lastX;
                    let dy = event.clientY - lastY;

                    // Adjust the offsets based on the mouse drag
                    xOffset -= dx / canvas.width * zoomScale;
                    yOffset += dy / canvas.height * zoomScale;

                    updateProjection();

                    lastX = event.clientX;
                    lastY = event.clientY;
                }
            }
        }
    });

    // Add a mouseup event listener to stop painting when the mouse is released
    canvas.addEventListener("mouseup", function (event) {
        isMouseDown = false;


        if (isSelectionOn) {
            identifySelectedVertices();

            redrawingCanvas()

            var xMax = Math.max(selectionStart.x, selectionEnd.x);
            var xMin = Math.min(selectionStart.x, selectionEnd.x);
            var yMax = Math.max(selectionStart.y, selectionEnd.y);
            var yMin = Math.min(selectionStart.y, selectionEnd.y);

            lastSelectionStartBase = { x: xMin, y: yMin }
            lastSelectionEndBase = { x: xMax, y: yMax }
            lastSelectionStart = { x: xMin, y: yMin }
            lastSelectionEnd = { x: xMax, y: yMax }
            selectionStart = { x: 0, y: 0 };
            selectionEnd = { x: 0, y: 0 };

            canMove = true;
            isSelectionOn = false;

        } else if (canMove) {

            var x = event.clientX - canvas.getBoundingClientRect().left;
            var y = event.clientY - canvas.getBoundingClientRect().top;


            x = (2 * x / canvas.width);
            y = 2 - (2 * y / canvas.height);



            if ((x >= lastSelectionStart.x && x <= lastSelectionEnd.x) && (y >= lastSelectionStart.y && y <= lastSelectionEnd.y)) {
                console.log("inside");
            } else {
                deSelect();
            }
        }
        else if (brush || isErasing) {
            if (pushing) {
                pushState();
                pushing = false;
            }
            isPainting = false;
        }
        else if (zoomInEnabled) {
            zoomScale *= (1 - ZOOM_FACTOR);
            updateProjection();
        }
        else if (zoomOutEnabled) {
            zoomScale *= (1 + ZOOM_FACTOR);
            updateProjection();
        }
    });

    canvas.addEventListener("mouseout", function (event) {
        isMouseDown = false;
        isPainting = false;
    });
}

function copy() {
    if (canMove) {

        // Copy
        for (var i = 0; i < selectedVertices.length - 6; i++) {
            var currentIndex = selectedVertices[i];
            willBeCopiedVertex.push(vec3(layerVertices[currentLayer][currentIndex][0], layerVertices[currentLayer][currentIndex][1], layerVertices[currentLayer][currentIndex][2]));
            willBeCopiedColor.push(vec4(layerColors[currentLayer][currentIndex][0], layerColors[currentLayer][currentIndex][1], layerColors[currentLayer][currentIndex][2], layerColors[currentLayer][currentIndex][3]));


        }
    }
}

function reallocateBuffers() {

    gl.bindBuffer(gl.ARRAY_BUFFER, VBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, numColumns * numRows * 3 * 16 * layerVertices.length, gl.STATIC_DRAW);


    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, numColumns * numRows * 4 * 32 * layerColors.length, gl.STATIC_DRAW);

}

function fillBuffers() {

    reallocateBuffers();

    let layerOffset = 0;

    for (var i = layerIndexes.length - 1; i >= 0; i--) {
        for (var j = 0; j < layerVertices[layerIndexes[i]].length; j++) {
            var offsetVertex = j * 12;
            var offsetColor = j * 16;
            var offsetLayerVertex = layerOffset * 12;
            var offsetLayerColor = layerOffset * 16;
            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, offsetLayerColor + offsetColor, flatten(layerColors[layerIndexes[i]][j]));

            gl.bindBuffer(gl.ARRAY_BUFFER, VBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, offsetLayerVertex + offsetVertex, flatten(layerVertices[layerIndexes[i]][j]));
        }
        layerOffset += layerVertices[layerIndexes[i]].length;
    }
}


function render() {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, index);

}

function manageZoomAndPan(canvas) {

    if (zoomEnabled) {
        canvas.onmousedown = function (event) {
            isDragging = true;
            lastX = event.clientX;
            lastY = event.clientY;
        }

        canvas.onmouseup = function (event) {
            isDragging = false;
        }

        canvas.onmousemove = function (event) {
            if (isDragging) {
                let dx = event.clientX - lastX;
                let dy = event.clientY - lastY;

                // Adjust the offsets based on the mouse drag
                xOffset -= dx / canvas.width * zoomScale;
                yOffset += dy / canvas.height * zoomScale;

                updateProjection();

                lastX = event.clientX;
                lastY = event.clientY;
            }
        }

        canvas.onwheel = function (event) {
            // Adjust the zoom scale based on the mouse wheel movement
            zoomScale *= (event.deltaY > 0) ? 1 + ZOOM_FACTOR : 1 - ZOOM_FACTOR;

            updateProjection();
        }
    }
}

function updateProjection() {
    left = (0 + xOffset) * zoomScale;
    right = (2 + xOffset) * zoomScale;
    bottom = (0 + yOffset) * zoomScale;
    top1 = (2 + yOffset) * zoomScale;

    const projectionMatrix = ortho(left, right, bottom, top1, near, far);
    const u_ProjectionMatrix = gl.getUniformLocation(program, 'projectionMatrix');
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, flatten(projectionMatrix));

    // Render function to redraw your scene with the updated projection
    render();
}

function drawing() {


    if (isMouseDown) {

        // Get the mouse coordinates relative to the canvas
        var x = event.clientX - canvas.getBoundingClientRect().left;
        var y = event.clientY - canvas.getBoundingClientRect().top;

        // Convert mouse coordinates to WebGL coordinates (-1 to 1)
        x = (2 * x / canvas.width);
        y = 2 - (2 * y / canvas.height);




        var leftOrder = Math.floor(x / cubeSize + 1);
        var bottomOrder = Math.floor(y / cubeSize + 1);

        var maxY = bottomOrder * cubeSize;
        var middleY = maxY - (cubeSize / 2);
        var minY = (bottomOrder - 1) * cubeSize;

        var maxX = leftOrder * cubeSize;
        var middleX = maxX - (cubeSize / 2);
        var minX = (leftOrder - 1) * cubeSize;

        // top
        var G1x = (minX + middleX + maxX) / 3;
        var G1y = (middleY + maxY + maxY) / 3;


        // left
        var G2x = (minX + minX + middleX) / 3;
        var G2y = (minY + maxY + middleY) / 3;


        // right
        var G3x = (maxX + middleX + maxX) / 3;
        var G3y = (minY + maxY + middleY) / 3;


        // down
        var G4x = (minX + middleX + maxX) / 3;
        var G4y = (middleY + minY + minY) / 3;


        // Calculate distances to each of the G points
        var distanceToG1 = Math.sqrt(Math.pow(G1x - x, 2) + Math.pow(G1y - y, 2));
        var distanceToG2 = Math.sqrt(Math.pow(G2x - x, 2) + Math.pow(G2y - y, 2));
        var distanceToG3 = Math.sqrt(Math.pow(G3x - x, 2) + Math.pow(G3y - y, 2));
        var distanceToG4 = Math.sqrt(Math.pow(G4x - x, 2) + Math.pow(G4y - y, 2));

        // Find the closest point
        var offset;
        var minDistance = Math.min(distanceToG1, distanceToG2, distanceToG3, distanceToG4);


        if (minDistance === distanceToG1) {
            offset = 1;
        } else if (minDistance === distanceToG2) {
            offset = 0;
        } else if (minDistance === distanceToG3) {
            offset = 2;
        } else {
            offset = 3;
        }

        // Change Color

        indexColor = 12 * (((bottomOrder - 1) * numColumns + leftOrder) - 1) + (3 * offset);
        if ((indexColor != previousIndexColor) || isErasing) {

            var offsetVertex = index * 12;
            var offsetColor = index * 16;
            var offsetLayerVertex = currentLayerOffset * 12;
            var offsetLayerColor = currentLayerOffset * 16;

            previousIndexColor = indexColor;

            for (var i = indexColor; i < indexColor + 3; i++) {

                if (!isErasing) {
                    index++;
                    layerVertices[currentLayer].push([vertices[i * 3], vertices[(i * 3) + 1], currentLayerZIndex]);
                    layerColors[currentLayer].push(currentColor);
                }
                dynamicVertices.push([vertices[i * 3], vertices[(i * 3) + 1], currentLayerZIndex]);
                dynamicColors.push(currentColor);

            }
            
            if (isErasing) {

                var found = false
                var foundIndex = -1;
                for (var i = 0; i < layerVertices[currentLayer].length; i = i + 3) {
                    var currentVertex = layerVertices[currentLayer][i];
                    var currentVertex2 = layerVertices[currentLayer][i + 1];
                    var currentVertex3 = layerVertices[currentLayer][i + 2];


                    if (arraysAreEqual(currentVertex, dynamicVertices[0]) && arraysAreEqual(currentVertex2, dynamicVertices[1]) && arraysAreEqual(currentVertex3, dynamicVertices[2])) {
                        found = true;
                        foundIndex = i;
                        break;
                    }

                }
                if (!found) {
                    for (var i = 0; i < layerVertices[currentLayer].length; i = i + 3) {
                        var currentVertex = layerVertices[currentLayer][i];
                        var currentVertex2 = layerVertices[currentLayer][i + 1];
                        var currentVertex3 = layerVertices[currentLayer][i + 2];


                        if (arraysAreEqual(currentVertex, dynamicVertices[0]) && arraysAreEqual(currentVertex2, dynamicVertices[1]) && arraysAreEqual(currentVertex3, dynamicVertices[2])) {
                            found = true;
                            foundIndex = i;
                            break;
                        }
                        const isInside = isPointInTriangle([x, y], currentVertex, currentVertex2, currentVertex3);
                        if (isInside) {
                            found = true;
                            foundIndex = i;
                            break;
                        } else {
                            console.log("The point is outside the triangle.");
                        }
                    }
                }

                if (found) {
                    console.log("V")
                    console.log(layerVertices[currentLayer]);
                    console.log("C")
                    console.log(layerColors[currentLayer]);
                    layerVertices[currentLayer].splice(foundIndex, 3);
                    layerColors[currentLayer].splice(foundIndex, 3);
                    fillBuffers();
                    index = index - 3;
                    pushing = true;
                    render();

                } else {
                    console.log("dynamicVertices[0] not found in layerVertices[currentLayer]");
                }




            }
            else {
                // Updating vertex color buffer
                gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                gl.bufferSubData(gl.ARRAY_BUFFER, offsetLayerColor + offsetColor, flatten(dynamicColors));


                // Assuming vBuffer is your buffer for vertices
                gl.bindBuffer(gl.ARRAY_BUFFER, VBuffer);
                gl.bufferSubData(gl.ARRAY_BUFFER, offsetLayerVertex + offsetVertex, flatten(dynamicVertices));
                pushing = true;
                render();
            }


            dynamicVertices = [];
            dynamicColors = [];


        }
    }
}

// Function to check if a point (px, py) is inside a triangle defined by three points (p1, p2, p3)
function isPointInTriangle(p, p1, p2, p3) {
    // Calculate the area of the whole triangle
    const totalArea = triangleArea(p1, p2, p3);

    // Calculate the areas of the three sub-triangles formed by the point and the vertices
    const area1 = triangleArea(p, p2, p3);
    const area2 = triangleArea(p1, p, p3);
    const area3 = triangleArea(p1, p2, p);

    // Define a small epsilon value for tolerance in comparisons
    const epsilon = 1e-10;

    // If the sum of the areas of the sub-triangles is very close to the area of the whole triangle, the point is inside the triangle
    return Math.abs(totalArea - (area1 + area2 + area3)) < epsilon;
}

// Function to calculate the area of a triangle defined by three points
function triangleArea(p1, p2, p3) {
    return 0.5 * Math.abs((p1[0] * (p2[1] - p3[1]) + p2[0] * (p3[1] - p1[1]) + p3[0] * (p1[1] - p2[1])));
}

function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (var j = 0; j < arr1.length; j++) {
        if (arr1[j] !== arr2[j]) {
            return false;
        }
    }
    return true;
}

function changeColor(color) {
    var colorMap = {
        'black': [0.0, 0.0, 0.0, 1.0],
        'red': [1.0, 0.0, 0.0, 1.0],
        'green': [0.0, 1.0, 0.0, 1.0],
        'blue': [0.0, 0.0, 1.0, 1.0],
        'yellow': [1.0, 1.0, 0.0, 1.0],
        'orange': [1.0, 0.5, 0.0, 1.0],
    };

    if (colorMap[color]) {
        currentColor = colorMap[color];
    }
}


function redo() {

    if (undoHistory.currentIndex < undoHistory.vertexStates.length - 1) {
        undoHistory.currentIndex++;

        // Restore the next state from the redo history with deep copy
        const nextVertices = undoHistory.vertexStates[undoHistory.currentIndex].map(vertices => [...vertices]);
        const nextColors = undoHistory.colorStates[undoHistory.currentIndex].map(colors => [...colors]);
        const nextIndexes = [...undoHistory.layerIndexes[undoHistory.currentIndex]];
        const nextSelectionRectVertices = [...undoHistory.selectionRectVertices[undoHistory.currentIndex]];

        // Update the current layer's state
        layerVertices = nextVertices;
        layerColors = nextColors;
        layerIndexes = nextIndexes;
        index = undoHistory.renderIndex;
        selectionRectVertices = nextSelectionRectVertices;


        fillBuffers();
        render();
        updateLayerOrder(layerIndexes);
        deSelect2();
    }
}


// Function to save the current state to the undo history
function pushState() {

    if (undoHistory.currentIndex < undoHistory.vertexStates.length - 1) {
        // Remove redo history when a new action is performed
        undoHistory.vertexStates.splice(undoHistory.currentIndex + 1);
        undoHistory.colorStates.splice(undoHistory.currentIndex + 1);
        undoHistory.layerIndexes.splice(undoHistory.currentIndex + 1);
        undoHistory.selectionRectVertices.splice(undoHistory.currentIndex + 1);
    }

    // Create deep copies of the arrays
    let clonedVertices = [];
    let clonedColors = [];
    const clonedIndexes = []; // Add an array for layerIndexes
    let clonedSelectionRectVertices = [];
    clonedVertices = JSON.parse(JSON.stringify(layerVertices));
    clonedColors = JSON.parse(JSON.stringify(layerColors));
    clonedSelectionRectVertices = JSON.parse(JSON.stringify(selectionRectVertices));


    for (let i = 0; i < layerVertices.length; i++) {
        clonedIndexes.push(layerIndexes[i]);
    }

    undoHistory.vertexStates.push(clonedVertices);
    undoHistory.colorStates.push(clonedColors);
    undoHistory.layerIndexes.push(clonedIndexes);
    undoHistory.selectionRectVertices.push(clonedSelectionRectVertices);
    undoHistory.renderIndex = index;

    if (undoHistory.vertexStates.length > undoHistory.maxHistoryLength) {
        // Remove the oldest state if the history exceeds the limit
        undoHistory.vertexStates.shift();
        undoHistory.colorStates.shift();
        undoHistory.layerIndexes.shift();
        undoHistory.selectionRectVertices.shift();
    }

    undoHistory.currentIndex = undoHistory.vertexStates.length - 1;
}

// Function to undo the last action
function undo() {
    if (undoHistory.currentIndex > 0) {
        undoHistory.currentIndex--;

        // Restore the previous state from the undo history
        const previousVertices = undoHistory.vertexStates[undoHistory.currentIndex].map(v => [...v]);
        const previousColors = undoHistory.colorStates[undoHistory.currentIndex].map(c => [...c]);
        const previousIndexes = [...undoHistory.layerIndexes[undoHistory.currentIndex]];
        const previousSelectionRectVertices = [...undoHistory.selectionRectVertices[undoHistory.currentIndex]];


        // Update the current layer's state
        layerVertices = previousVertices;
        layerColors = previousColors;
        layerIndexes = previousIndexes;
        index = undoHistory.renderIndex;
        selectionRectVertices = previousSelectionRectVertices;

        fillBuffers();
        render();
        updateLayerOrder(layerIndexes);
        deSelect2();

    }
}


function eraser() {
    toolChange();
    isErasing = true;
    isSelectionOn = false;
    brush = false;
    canMove = false;
}
function setBrush() {
    toolChange();
    isErasing = false;
    isSelectionOn = false;
    canMove = false;
    brush = true;

}
function saveDataToFile() {
    const saveData = {
        vertices: layerVertices,
        vertexColors: layerColors,
        index: index,
    };

    const jsonSaveData = JSON.stringify(saveData);

    // Create a Blob (binary large object) from the JSON data
    const blob = new Blob([jsonSaveData], { type: 'application/json' });

    // Create a download link for the Blob
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'paint-work.ko'; // File name
    a.style.display = 'none';

    // Append the link to the document and trigger a click event to download the file
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
}



function loadFileData(inputFile) {
    const file = inputFile.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const jsonSaveData = event.target.result;
            const saveData = JSON.parse(jsonSaveData);

            // Update the arrays with the loaded data
            layerVertices = [...saveData.vertices];
            layerColors = [...saveData.vertexColors];
            index = saveData.index;
            // Update WebGL buffers with the loaded data
            fillBuffers();

            render(); // Redraw the canvas with the loaded data

        };

        reader.readAsText(file);

    }
}

function identifySelectedVertices() {
    selectedVertices = [];
    // Loop through your vertices and check if they fall within the selection rectangle.
    var minX = Math.min(selectionStart.x, selectionEnd.x);
    var maxX = Math.max(selectionStart.x, selectionEnd.x);
    var minY = Math.min(selectionStart.y, selectionEnd.y);
    var maxY = Math.max(selectionStart.y, selectionEnd.y);

    for (var i = 0; i < layerVertices[currentLayer].length; i += 1) {
        var x = layerVertices[currentLayer][i][0];
        var y = layerVertices[currentLayer][i][1];

        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
            selectedVertices.push(i); // Store the index of the selected vertex.
        }
    }
    
    selectedVertices = generateSelectedArray(selectedVertices);
    // Now you have the indices of the selected vertices in the selectedVertices array.
    // You can use this information to move the selected triangles as needed.
}

function selectionOn() {
    toolChange();
    isSelectionOn = true;



}


function deSelect() {
    isSelectedBefore = false;
    selectedVertices = [];
    layerVertices[currentLayer].splice(selectionRectVertices[0], selectionRectVertices[1]);
    layerColors[currentLayer].splice(selectionRectVertices[0], selectionRectVertices[1]);

    fillBuffers();
    render();
    toolChange();
    selectionOn();

}
function deSelect2() {
    isSelectedBefore = false;
    selectedVertices = [];
    layerVertices[currentLayer].splice(selectionRectVertices[0], selectionRectVertices[1]);
    layerColors[currentLayer].splice(selectionRectVertices[0], selectionRectVertices[1]);

    fillBuffers();
    render();

}

function generateSelectedArray(inputArray) {
    // Initialize an empty result array
    const resultArray = [];


    for (let j = 0; j < inputArray.length - 6; j++) {
        // Calculate the quotient when dividing by 3
        const quotient = Math.floor(inputArray[j] / 3);

        // Iterate to generate the sequence based on the quotient
        for (let i = 0; i < 3; i++) {
            const generatedNumber = quotient * 3 + i;

            // Check if the generated number is not already in the result array
            if (!resultArray.includes(generatedNumber)) {
                resultArray.push(generatedNumber);
            }
        }
    }

    for (let j = inputArray.length - 6; j < inputArray.length; j++) {
        resultArray.push(inputArray[j]);
    }

    return resultArray;
}


function selectLayer(layer) {
    currentLayer = layer;
    currentLayerZIndex = 2 - layerIndexes.indexOf(layer);
    updateCurrentLayerOffset();
}

function updateCurrentLayerOffset() {
    let offset = 0;
    for (let i = 0; i <= currentLayer; i++) {
        offset += layerSizes[i];
    }
    currentLayerOffset = offset;
}

function increaseLayer(layer) {
    const index = layerIndexes.indexOf(layer);

    if (index !== 0) {
        // Swap the layer with the next one
        layerIndexes[index] = layerIndexes[index - 1];
        layerIndexes[index - 1] = layer;

        updateLayerVerticesZIndex(layer, 2 - (index - 1));
        updateLayerVerticesZIndex(layerIndexes[index], 2 - index);
        if (currentLayer == layer) {
            selectLayer(layer);
        }
        pushState();
        fillBuffers();
        render();
    }

}

function decreaseLayer(layer) {
    const index = layerIndexes.indexOf(layer);

    if (index !== layerIndexes.length - 1) {
        // Swap the layer with the previous one
        layerIndexes[index] = layerIndexes[index + 1];
        layerIndexes[index + 1] = layer;
        updateLayerVerticesZIndex(layer, 2 - (index + 1));
        updateLayerVerticesZIndex(layerIndexes[index], 2 - index);
        if (currentLayer == layer) {
            selectLayer(layer);
        }
        pushState();
        fillBuffers();
        render();
    }
}

function updateLayerVerticesZIndex(layer, zIndex) {
    for (let i = 0; i < layerVertices[layer].length; i += 1) {
        layerVertices[layer][i][2] = zIndex;
    }
}

function hand() {
    toolChangeNoProject()
    isErasing = false;
    isSelectionOn = false;
    brush = false;
    canMove = false;
    zoomEnabled = true;
}

function zoomIn() {
    toolChangeNoProject()
    zoomInEnabled = true;

}

function zoomOut() {
    toolChangeNoProject()
    zoomOutEnabled = true;

}
function toolChange() {
    zoomOutEnabled = false;
    zoomInEnabled = false;
    isSelectionOn = false;
    brush = false;
    canMove = false;
    isSelectionOn = false;
    zoomEnabled = false;
    isErasing = false;
    left = 0;
    right = 2;
    bottom = 0;
    top1 = 2;
    near = -10; // TODO - Adjust as needed
    far = 10; // TODO - Adjust as needed
    xOffset = 0;
    yOffset = 0;
    zoomScale = 1;
    updateProjection();
}
function toolChangeNoProject() {
    zoomOutEnabled = false;
    zoomInEnabled = false;
    isSelectionOn = false;
    brush = false;
    canMove = false;
    isSelectionOn = false;
    zoomEnabled = false;
    isErasing = false;

}
/* UI Elements Functions */

// Function to change the color and set the selectedColor class
function changeColorUI(element, color) {
    // Remove selectedColor class from all clickableColor elements
    const clickableColors = document.querySelectorAll('.clickableColor');
    clickableColors.forEach((clickableColor) => {
        clickableColor.classList.remove('selectedColor');
    });

    // Add selectedColor class to the clicked color element
    element.classList.add('selectedColor');
    changeColor(color);

    const brush = document.getElementById("brush");
    selectTool(brush, 'brush');
}

// Function to move a layer up or down
function moveLayer(direction, element, layerIndex) {
    const listItem = element.closest('.layer');
    const list = listItem.parentElement;

    if (direction === 'up' && listItem.previousElementSibling) {
        list.insertBefore(listItem, listItem.previousElementSibling);
        // Update layer order in the code
        increaseLayer(layerIndex);
    } else if (direction === 'down' && listItem.nextElementSibling) {
        list.insertBefore(listItem.nextElementSibling, listItem);
        // Update layer order in the code
        decreaseLayer(layerIndex);
    }

}

// Function to select a layer and deselect the previously selected one
function selectLayerUI(layer, layerIndex) {
    const layerList = document.querySelectorAll('.layer');

    // Deselect all layers
    layerList.forEach((item) => {
        item.classList.remove('selectedLayer');
    });

    // Add 'selectedLayer' class to the closest li element (parent)
    const closestLi = layer.closest('li');
    if (closestLi) {
        closestLi.classList.add('selectedLayer');
    }

    // Update the current layer
    selectLayer(layerIndex);
}

// Function to select a tool and deselect the previously selected one
function selectTool(element, tool) {
    const toolList = document.querySelectorAll('.clickable.selectedTool');

    // Deselect all tools
    toolList.forEach((item) => {
        item.classList.remove('selectedTool');
    });

    // Select the clicked tool
    element.classList.add('selectedTool');

    if (tool == "brush") {
        deSelect();
        setBrush();
    } else if (tool == "eraser") {
        deSelect();
        eraser();
    } else if (tool == "selection") {
        selectionOn();
    } else if (tool == "zoom-in") {
        zoomIn();
    } else if (tool == "zoom-out") {
        zoomOut();
    } else if (tool == "hand") {
        hand();
    }
}

function updateLayerOrder(newLayerIndexes) {
    // Create an array to hold the layers in the desired order
    const layers = [];

    // Map the layer elements to the layers array based on their new order
    newLayerIndexes.forEach(index => {
        const layerId = `layer${index}`;
        const layerElement = document.getElementById(layerId);
        layers.push(layerElement);
    });

    // Get the parent element that holds the layers
    const layersContainer = document.querySelector('.layer-list');

    // Remove all layers from the container
    while (layersContainer.firstChild) {
        layersContainer.removeChild(layersContainer.firstChild);
    }

    // Add the layers back to the container in the new order
    layers.forEach(layerElement => {
        layersContainer.appendChild(layerElement);
    });
}

function toggleShortcutList() {
    const shortcutList = document.querySelector('.shortcut-list');
    
    // Check if the shortcut list is visible
    if (shortcutList.style.display === 'block') {
        // Hide the shortcut list
        shortcutList.style.display = 'none';
    } else {
        // Show the shortcut list

        // Check if the shortcut list is already filled to avoid duplicating the elements
        if (shortcutList.innerHTML.trim() === '') {
            // Define the predefined elements
            const shortcuts = [
                { key: 'Ctrl + Z', action: 'Undo' },
                { key: 'Ctrl + Y', action: 'Redo' },
                { key: 'Ctrl + C', action: 'Copy' },
                { key: 'Ctrl + V', action: 'Paste On Selection' },
            ];

            // Create a list of shortcuts
            const shortcutUl = document.createElement('ul');
            shortcuts.forEach((shortcut) => {
                const shortcutLi = document.createElement('li');
                shortcutLi.textContent = `${shortcut.key} - ${shortcut.action}`;
                shortcutUl.appendChild(shortcutLi);
            });

            // Append the list of shortcuts to the "shortcut-list" div
            shortcutList.appendChild(shortcutUl);
        }

        // Show the shortcut list
        shortcutList.style.display = 'block';
    }
}