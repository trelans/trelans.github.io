var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

// Variables to store camera parameters
var cameraAngleX = 0;
var cameraAngleY = 0;

var vertical;
var horizontal;
var isDragging = false;
var lastMouseX, lastMouseY;
var azimuth = 0.0;  // Azimuth angle around the y-axis
var elevation = 0.0;  // Elevation angle above the x-z plane

var vertices = [

    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
];

var colors = [

    vec4(0.1, 0.1, 0.1, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.2, 0.2, 0.2, 1.0),
    vec4(0.2, 0.2, 0.2, 1.0),
    vec4(0.1, 0.1, 0.1, 1.0),
    vec4(0.3, 0.3, 0.3, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.1, 0.1, 0.1, 1.0)
];

var colorsAnother = [

    vec4(0, 0, 1, 1.0),
    vec4(1, 1, 1, 1.0),
    vec4(1, 1, 1, 1.0),
    vec4(1.0, 1.0, 1.0, 1.0),
    vec4(0.80, 0.80, 0.80, 1.0),
    vec4(0.90, 0.80, 0.80, 1.0),
    vec4(0.90, 0.80, 0.80, 1.0),
    vec4(1.0, 1.0, 1.0, 1.0)
];

var colorsWhite = [

    vec4(1.0, 1.0, 1.0, 1.0),
    vec4(1.0, 0.90, 0.90, 1.0),
    vec4(1.0, 0.80, 0.80, 1.0),
    vec4(1.0, 1.0, 1.0, 1.0),
    vec4(0.80, 0.80, 0.80, 1.0),
    vec4(0.90, 0.80, 0.80, 1.0),
    vec4(0.90, 0.80, 0.80, 1.0),
    vec4(1.0, 1.0, 1.0, 1.0)
];

let defaultTheta = [60, 180, 0, 0, 180, 0, 0, 180, 0, 0, 180, 0, 0, 180, 0, 0, 180, 0, 0, 180, 0, 0, 180, 0, 0];

// [{ id: 1, pointTime: 4.7, theta = [...], sliderValues = [...] }, { id: 2, pointTime: 1.0, theta = [...], sliderValues = [...] }, 
// { id: 3, pointTime: 1.5, theta = [...], sliderValues = [...] }]
let keyframes = [];
let currentKeyframe = 0;

let mode = "stop"; // stop, play, pause

// Body Parts
let upperLeg;
let middleLeg;
let lowerLeg;


var torsoId = 0;

// Leg 1
let cornerFrontLeftUpperId = 1;
let cornerFrontLeftMiddleId = 2;
let cornerFrontLeftLowerId = 3;

// Leg 2
let cornerFrontRightUpperId = 4;
let cornerFrontRightMiddleId = 5;
let cornerFrontRightLowerId = 6;

// Leg 3
let cornerBackLeftUpperId = 7;
let cornerBackLeftMiddleId = 8;
let cornerBackLeftLowerId = 9;


// Leg 4
let cornerBackRightUpperId = 10;
let cornerBackRightMiddleId = 11;
let cornerBackRightLowerId = 12;


// Leg 5
let middleFrontUpperId = 13;
let middleFrontMiddleId = 14;
let middleFrontLowerId = 15;


// Leg 6
let middleBackUpperId = 16;
let middleBackMiddleId = 17;
let middleBackLowerId = 18;


// Leg 7
let middleLeftUpperId = 19;
let middleLeftMiddleId = 20;
let middleLeftLowerId = 21;

// Leg 8
let middleRightUpperId = 22;
let middleRightMiddleId = 23;
let middleRightLowerId = 24;

//Movement 
let movementIdX = 25;
let movementIdY = 26;
let movementIdZ = 27;


let torsoNewRotateAngel = 28;
let torsoNewRotateAngel2 = 29;


// Width and height of body parts
var torsoHeight = 5.0;
var torsoWidth = 5.0;

var upperLegWidth = 0.8;
var middleLegWidth = 0.6;
var lowerLegWidth = 0.4;

var upperLegHeight = 5.0;
var middleLegHeight = 3.0;
var lowerLegHeight = 2.0;

var headHeight = 1.5;
var headWidth = 1.0;

var numNodes = 25;

var numAngles = 30;
var angle = 0;

var theta = [60, 180, 0, 0, 180, 0, 0, 180, 0, 0, 180, 0, 0, 180, 0, 0, 180, 0, 0, 180, 0, 0, 180, 0, 0, 0, 0, 0, 0, 0];

var numVertices = 25;

var stack = [];

var figure = [];

for (var i = 0; i < numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];
var colorsArray = [];

var rotationMatrix;
var rotationMatrixLoc;

var angle = 0.0;
var axis = [0, 0, 1];

var trackingMouse = false;
var trackballMove = false;

var lastPos = [0, 0, 0];
var curx, cury;
var startX, startY;

var texCoordsArray = [];

var texture;

var texCoord = [
    vec2(0.52, 0.52),
    vec2(0.98, 0.52),
    vec2(1, 0.98),
    vec2(0.52, 1)
];

var texCoordNew = [
    vec2(0.50, 0.50),
    vec2(1, 0.50),
    vec2(1, 1),
    vec2(0.50, 1)
];

var texCoordOld = [
    vec2(0, 0),
    vec2(1, 0),
    vec2(1, 1),
    vec2(0, 1)
];
var texCoordBackground = [
    vec2(0, 0.5),
    vec2(0.5, 0.5),
    vec2(0.5, 1),
    vec2(0, 1)
];

var va = vec4(0.0, 0.0, -1.0, 1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333, 1);
var numTimesToSubdivide = 4;
var index = 0;


//-------------------------------------------

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child) {
    var node = {
        transform: transform,
        render: render,
        sibling: sibling,
        child: child,
    }
    return node;
}


function initNodes(Id) {

    var m = mat4();

    switch (Id) {

        case torsoId:

            m = rotate(theta[torsoId], 0, 1, 0);
            m = mult(m, rotate(theta[torsoNewRotateAngel], 1, 0, 0));
            m = mult(m, rotate(theta[torsoNewRotateAngel2], 0, 0, 1));
            m = mult(m, translate(theta[movementIdX], theta[movementIdY], theta[movementIdZ]));
            figure[torsoId] = createNode(m, torso, null, cornerFrontLeftUpperId);
            break;

        // Corner Front Leg Cases
        case cornerFrontLeftUpperId:
            m = translate(-(torsoWidth / 2 - upperLegWidth / 2), 0.0, 0.5 * torsoWidth - upperLegWidth / 2);
            m = mult(m, rotate(theta[cornerFrontLeftUpperId], 1, 0, 0));
            figure[cornerFrontLeftUpperId] = createNode(m, upperLeg, cornerFrontRightUpperId, cornerFrontLeftMiddleId);
            break;

        case cornerFrontLeftMiddleId:
            m = translate(0.0, upperLegHeight, 0);
            m = mult(m, rotate(theta[cornerFrontLeftMiddleId], 1, 0, 0));
            figure[cornerFrontLeftMiddleId] = createNode(m, middleLeg, null, cornerFrontLeftLowerId);
            break;
        case cornerFrontLeftLowerId:
            m = translate(0.0, middleLegHeight, 0.0);
            m = mult(m, rotate(theta[cornerFrontLeftLowerId], 1, 0, 0));
            figure[cornerFrontLeftLowerId] = createNode(m, lowerLeg, null, null);
            break;

        // Corner Front Right Leg Cases
        case cornerFrontRightUpperId:
            m = translate((torsoWidth / 2 - upperLegWidth / 2), 0.0, 0.5 * torsoWidth - upperLegWidth / 2);
            m = mult(m, rotate(theta[cornerFrontRightUpperId], 1, 0, 0));
            figure[cornerFrontRightUpperId] = createNode(m, upperLeg, cornerBackLeftUpperId, cornerFrontRightMiddleId);
            break;
        case cornerFrontRightMiddleId:
            m = translate(0.0, upperLegHeight, 0);
            m = mult(m, rotate(theta[cornerFrontRightMiddleId], 1, 0, 0));
            figure[cornerFrontRightMiddleId] = createNode(m, middleLeg, null, cornerFrontRightLowerId);
            break;
        case cornerFrontRightLowerId:
            m = translate(0.0, middleLegHeight, 0.0);
            m = mult(m, rotate(theta[cornerFrontRightLowerId], 1, 0, 0));
            figure[cornerFrontRightLowerId] = createNode(m, lowerLeg, null, null);
            break;

        // Corner Back Left Leg Cases
        case cornerBackLeftUpperId:
            m = translate(-(torsoWidth / 2 - upperLegWidth / 2), 0.0, -0.5 * torsoWidth + upperLegWidth / 2);
            m = mult(m, rotate(theta[cornerBackLeftUpperId], 1, 0, 0));
            figure[cornerBackLeftUpperId] = createNode(m, upperLeg, cornerBackRightUpperId, cornerBackLeftMiddleId);
            break;
        case cornerBackLeftMiddleId:
            m = translate(0.0, upperLegHeight, 0);
            m = mult(m, rotate(theta[cornerBackLeftMiddleId], 1, 0, 0));
            figure[cornerBackLeftMiddleId] = createNode(m, middleLeg, null, cornerBackLeftLowerId);
            break;
        case cornerBackLeftLowerId:
            m = translate(0.0, middleLegHeight, 0.0);
            m = mult(m, rotate(theta[cornerBackLeftLowerId], 1, 0, 0));
            figure[cornerBackLeftLowerId] = createNode(m, lowerLeg, null, null);
            break;

        // Corner Back Right Leg Cases
        case cornerBackRightUpperId:
            m = translate((torsoWidth / 2 - upperLegWidth / 2), 0.0, -0.5 * torsoWidth + upperLegWidth / 2);
            m = mult(m, rotate(theta[cornerBackRightUpperId], 1, 0, 0));
            figure[cornerBackRightUpperId] = createNode(m, upperLeg, middleFrontUpperId, cornerBackRightMiddleId);
            break;
        case cornerBackRightMiddleId:
            m = translate(0.0, upperLegHeight, 0);
            m = mult(m, rotate(theta[cornerBackRightMiddleId], 1, 0, 0));
            figure[cornerBackRightMiddleId] = createNode(m, middleLeg, null, cornerBackRightLowerId);
            break;
        case cornerBackRightLowerId:
            m = translate(0.0, middleLegHeight, 0.0);
            m = mult(m, rotate(theta[cornerBackRightLowerId], 1, 0, 0));
            figure[cornerBackRightLowerId] = createNode(m, lowerLeg, null, null);
            break;

        // Middle Front Leg Cases
        case middleFrontUpperId:
            m = translate(0.0, 0.0, 0.5 * torsoWidth - upperLegWidth / 2);
            m = mult(m, rotate(theta[middleFrontUpperId], 1, 0, 0));
            figure[middleFrontUpperId] = createNode(m, upperLeg, middleBackUpperId, middleFrontMiddleId);
            break;
        case middleFrontMiddleId:
            m = translate(0.0, upperLegHeight, 0);
            m = mult(m, rotate(theta[middleFrontMiddleId], 1, 0, 0));
            figure[middleFrontMiddleId] = createNode(m, middleLeg, null, middleFrontLowerId);
            break;
        case middleFrontLowerId:
            m = translate(0.0, middleLegHeight, 0.0);
            m = mult(m, rotate(theta[middleFrontLowerId], 1, 0, 0));
            figure[middleFrontLowerId] = createNode(m, lowerLeg, null, null);
            break;

        // Middle Back Leg Cases
        case middleBackUpperId:
            m = translate(0.0, 0.0, -0.5 * torsoWidth + upperLegWidth / 2);
            m = mult(m, rotate(theta[middleBackUpperId], 1, 0, 0));
            figure[middleBackUpperId] = createNode(m, upperLeg, middleLeftUpperId, middleBackMiddleId);
            break;
        case middleBackMiddleId:
            m = translate(0.0, upperLegHeight, 0);
            m = mult(m, rotate(theta[middleBackMiddleId], 1, 0, 0));
            figure[middleBackMiddleId] = createNode(m, middleLeg, null, middleBackLowerId);
            break;
        case middleBackLowerId:
            m = translate(0.0, middleLegHeight, 0.0);
            m = mult(m, rotate(theta[middleBackLowerId], 1, 0, 0));
            figure[middleBackLowerId] = createNode(m, lowerLeg, null, null);
            break;

        // Middle Left Leg Cases
        case middleLeftUpperId:
            m = translate(-(torsoWidth / 2 - upperLegWidth / 2), 0.0, 0.0);
            m = mult(m, rotate(theta[middleLeftUpperId], 0, 0, 1));
            figure[middleLeftUpperId] = createNode(m, upperLeg, middleRightUpperId, middleLeftMiddleId);
            break;
        case middleLeftMiddleId:
            m = translate(0.0, upperLegHeight, 0);
            m = mult(m, rotate(theta[middleLeftMiddleId], 0, 0, 1));
            figure[middleLeftMiddleId] = createNode(m, middleLeg, null, middleLeftLowerId);
            break;
        case middleLeftLowerId:
            m = translate(0.0, middleLegHeight, 0.0);
            m = mult(m, rotate(theta[middleLeftLowerId], 0, 0, 1));
            figure[middleLeftLowerId] = createNode(m, lowerLeg, null, null);
            break;

        // Middle Right Leg Cases
        case middleRightUpperId:
            m = translate((torsoWidth / 2 - upperLegWidth / 2), 0.0, 0.0);
            m = mult(m, rotate(theta[middleRightUpperId], 0, 0, 1));
            figure[middleRightUpperId] = createNode(m, upperLeg, null, middleRightMiddleId);
            break;
        case middleRightMiddleId:
            m = translate(0.0, upperLegHeight, 0);
            m = mult(m, rotate(theta[middleRightMiddleId], 0, 0, 1));
            figure[middleRightMiddleId] = createNode(m, middleLeg, null, middleRightLowerId);
            break;
        case middleRightLowerId:
            m = translate(0.0, middleLegHeight, 0.0);
            m = mult(m, rotate(theta[middleRightLowerId], 0, 0, 1));
            figure[middleRightLowerId] = createNode(m, lowerLeg, null, null);
            break;
    }

}

function traverse(Id) {

    if (Id == null) return;
    stack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
    figure[Id].render();
    if (figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
    if (figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.4 * torsoHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(1.1 * torsoWidth, torsoHeight, 1.2 * torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 6; i < 12; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function head(x , y, frameRate) {

    let oteleme = 1 * Math.sin(frameRate * 0.1) * 0.3;

    instanceMatrix = mult(modelViewMatrix, translate(-10 + x + oteleme, -8 * headHeight + y, -20.0));
    instanceMatrix = mult(instanceMatrix, scale4(1 * headWidth, 10 * headHeight, headWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 12; i < 18; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function lowerHead() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function createBodyPart(height, width, scale) {
    return function () {
        instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * height, 0.0));
        instanceMatrix = mult(instanceMatrix, scale4(width, scale * height, width));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
        for (let i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }
}

function renderRock(height, width) {


    instanceMatrix = mult(modelViewMatrix, translate(17.5, 2 * -1.2 * height, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(width, height, width));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 72; i < index + 200; i += 3)
        gl.drawArrays(gl.TRIANGLES, i, 3)

}


function renderBaloon(height, width, position, scale = 1, positionX = 0) {

    let y_axis = ((position % 30) - 15) * height;

    let scaleAxis = 1.2 * ((30 - y_axis) / 30) * scale;

    // -15 15 is the range
    instanceMatrix = mult(modelViewMatrix, translate(-10.5 + positionX, y_axis, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(scaleAxis * width, scaleAxis * height, scaleAxis * width));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 72; i < index; i += 3)
        gl.drawArrays(gl.TRIANGLES, i, 3)

}



function lowerLowerHead() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerHeadHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(lowerHeadWidth, lowerHeadHeight, lowerHeadWidth))
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function quad(a, b, c, d, isFront, pos, color, isBg) {
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[a]);
    var normal = normalize(cross(t2, t1));
    normal = vec4(normal);
    normal[3] = 0.0;

    pointsArray.push(vertices[a]);
    colorsArray.push(color[pos]);
    if (isFront) {
        texCoordsArray.push(texCoord[0]);
    }
    else if (isBg) {
        texCoordsArray.push(texCoordBackground[0]);
    }
    else {
        texCoordsArray.push(texCoord[1]);
    }

    pointsArray.push(vertices[b]);
    colorsArray.push(color[pos]);
    if (isFront) {
        texCoordsArray.push(texCoord[1]);
    }
    else if (isBg) {
        texCoordsArray.push(texCoordBackground[1]);
    }
    else {
        texCoordsArray.push(texCoord[0]);
    }

    pointsArray.push(vertices[c]);
    colorsArray.push(color[pos]);
    if (isFront) {
        texCoordsArray.push(texCoord[2]);
    }
    else if (isBg) {
        texCoordsArray.push(texCoordBackground[2]);
    }
    else {
        texCoordsArray.push(texCoord[0]);
    }

    pointsArray.push(vertices[d]);
    colorsArray.push(color[pos]);
    if (isFront) {
        texCoordsArray.push(texCoord[3]);
    }
    else if (isBg) {
        texCoordsArray.push(texCoordBackground[3]);
         
    }
    else {
        texCoordsArray.push(texCoord[0]);
    }
}


function cube(isHead, color, isBg) {
    quad(1, 0, 3, 2, isHead, 0, color, isBg);
    quad(2, 3, 7, 6, false, 1, color, isBg);
    quad(3, 0, 4, 7, false, 2, color, isBg);
    quad(6, 5, 1, 2, false, 3, color, isBg);
    quad(4, 5, 6, 7, false, 4, color, isBg);
    quad(5, 4, 0, 1, false, 5, color, isBg);

}

function trackballView(x, y) {
    var d, a;
    var v = [];

    v[0] = x;
    v[1] = y;

    d = v[0] * v[0] + v[1] * v[1];
    if (d < 1.0)
        v[2] = Math.sqrt(1.0 - d);
    else {
        v[2] = 0.0;
        a = 1.0 / Math.sqrt(d);
        v[0] *= a;
        v[1] *= a;
    }
    return v;
}


function mouseMotion(x, y) {
    var dx, dy, dz;

    var curPos = trackballView(x, y);
    if (trackingMouse) {
        dx = curPos[0] - lastPos[0];
        dy = curPos[1] - lastPos[1];
        dz = curPos[2] - lastPos[2];

        if (dx || dy || dz) {
            angle = -0.1 * Math.sqrt(dx * dx + dy * dy + dz * dz);


            axis[0] = lastPos[1] * curPos[2] - lastPos[2] * curPos[1];
            axis[1] = lastPos[2] * curPos[0] - lastPos[0] * curPos[2];
            axis[2] = lastPos[0] * curPos[1] - lastPos[1] * curPos[0];

            lastPos[0] = curPos[0];
            lastPos[1] = curPos[1];
            lastPos[2] = curPos[2];



        }
    }
}

function startMotion(x, y) {
    trackingMouse = true;
    startX = x;
    startY = y;
    curx = x;
    cury = y;

    lastPos = trackballView(x, y);
    trackballMove = true;
}

function stopMotion(x, y) {
    trackingMouse = false;
    if (startX != x || startY != y) {
    }
    else {
        angle = 0.0;
        trackballMove = false;
    }
}

function triangle(a, b, c) {
    colorsArray.push(colorsAnother[0]);
    colorsArray.push(colorsAnother[1]);
    colorsArray.push(colorsAnother[2]);

    pointsArray.push(a);
    pointsArray.push(b);
    pointsArray.push(c);

    texCoordsArray.push(texCoordNew[0]);
    texCoordsArray.push(texCoordNew[0]);
    texCoordsArray.push(texCoordNew[0]);
    index += 3;
}


function divideTriangle(a, b, c, count) {
    if (count > 0) {

        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var bc = mix(b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle(a, ab, ac, count - 1);
        divideTriangle(ab, b, bc, count - 1);
        divideTriangle(bc, c, ac, count - 1);
        divideTriangle(ab, bc, ac, count - 1);
    }
    else {
        triangle(a, b, c);
    }
}


function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}

window.onload = function init() {


    const sliderIds = ["torsoId", "cornerFrontLeftUpperLegId", "cornerFrontLeftMiddleLegId",
        "cornerFrontLeftLowerLegId", "cornerFrontRightUpperLegId", "cornerFrontRightMiddleLegId",
        "cornerFrontRightLowerLegId", "cornerBackLeftUpperLegId", "cornerBackLeftMiddleLegId",
        "cornerBackLeftLowerLegId", "cornerBackRightUpperLegId", "cornerBackRightMiddleLegId",
        "cornerBackRightLowerLegId", "middleFrontUpperLegId", "middleFrontMiddleLegId",
        "middleFrontLowerLegId", "middleBackUpperLegId", "middleBackMiddleLegId",
        "middleBackLowerLegId", "middleLeftUpperLegId", "middleLeftMiddleLegId",
        "middleLeftLowerLegId", "middleRightUpperLegId", "middleRightMiddleLegId",
        "middleRightLowerLegId", "translationXSlider", "translationYSlider", "translationZSlider",
        "torsoRotation2", "torsoRotation3"]

    const sliderVariables = {
        "torsoId": torsoId,
        "cornerFrontLeftUpperLegId": cornerFrontLeftUpperId,
        "cornerFrontLeftMiddleLegId": cornerFrontLeftMiddleId,
        "cornerFrontLeftLowerLegId": cornerFrontLeftLowerId,
        "cornerFrontRightUpperLegId": cornerFrontRightUpperId,
        "cornerFrontRightMiddleLegId": cornerFrontRightMiddleId,
        "cornerFrontRightLowerLegId": cornerFrontRightLowerId,
        "cornerBackLeftUpperLegId": cornerBackLeftUpperId,
        "cornerBackLeftMiddleLegId": cornerBackLeftMiddleId,
        "cornerBackLeftLowerLegId": cornerBackLeftLowerId,
        "cornerBackRightUpperLegId": cornerBackRightUpperId,
        "cornerBackRightMiddleLegId": cornerBackRightMiddleId,
        "cornerBackRightLowerLegId": cornerBackRightLowerId,
        "middleFrontUpperLegId": middleFrontUpperId,
        "middleFrontMiddleLegId": middleFrontMiddleId,
        "middleFrontLowerLegId": middleFrontLowerId,
        "middleBackUpperLegId": middleBackUpperId,
        "middleBackMiddleLegId": middleBackMiddleId,
        "middleBackLowerLegId": middleBackLowerId,
        "middleLeftUpperLegId": middleLeftUpperId,
        "middleLeftMiddleLegId": middleLeftMiddleId,
        "middleLeftLowerLegId": middleLeftLowerId,
        "middleRightUpperLegId": middleRightUpperId,
        "middleRightMiddleLegId": middleRightMiddleId,
        "middleRightLowerLegId": middleRightLowerId,
        "translationXSlider": movementIdX,
        "translationYSlider": movementIdY,
        "translationZSlider": movementIdZ,
        "torsoRotation2": torsoNewRotateAngel,
        "torsoRotation3": torsoNewRotateAngel2
    }

    const sliderOptions = {
        "torsoId": {
            notReversed: true
        },
        "cornerFrontLeftUpperLegId": {
            offsetAngle: -180
        },
        "cornerFrontRightUpperLegId": {
            offsetAngle: -180
        },
        "middleFrontUpperLegId": {
            offsetAngle: -180
        },
        "cornerBackLeftUpperLegId": {
            notReversed: true,
            offsetAngle: -180
        },
        "cornerBackLeftMiddleLegId": {
            notReversed: true,
        },
        "cornerBackLeftLowerLegId": {
            notReversed: true,
        },
        "cornerBackRightUpperLegId": {
            notReversed: true,
            offsetAngle: -180
        },
        "cornerBackRightMiddleLegId": {
            notReversed: true,
        },
        "cornerBackRightLowerLegId": {
            notReversed: true,
        },
        "middleBackUpperLegId": {
            notReversed: true,
            offsetAngle: -180
        },
        "middleBackMiddleLegId": {
            notReversed: true,
        },
        "middleBackLowerLegId": {
            notReversed: true,
        },

        "middleLeftUpperLegId": {
            offsetAngle: -180
        },
        "middleRightUpperLegId": {
            notReversed: true,
            offsetAngle: -180
        },
        "middleRightMiddleLegId": {
            notReversed: true,
        },
        "middleRightLowerLegId": {
            notReversed: true,
        },
        "translationXSlider": {
            offsetAngle: 0,
            notReversed: true
        },
        "translationYSlider": {
            notReversed: true,
            offsetAngle: 0
        },
        "translationZSlider": {
            notReversed: true,
            offsetAngle: 0
        },
        "torsoRotation2": {
            notReversed: true,
            offsetAngle: 0
        },
        "torsoRotation3": {
            notReversed: true,
            offsetAngle: 0
        }

    }

    let normalizedSliderValue = (value, id) => {
        if (sliderOptions[id] && sliderOptions[id].offsetAngle) {
            value = value + sliderOptions[id].offsetAngle;
        }
        if (sliderOptions[id] && sliderOptions[id].notReversed) {
            value = value;
        } else {
            value = -value;
        }
        return value;
    }

    let sliderValues = Array(sliderIds.length).fill(0).map(Number);
    currentKeyframe = 0;

    let updateSliders = () => {          
        const deep_copy_theta = deepCopy(keyframes[currentKeyframe].theta);
        theta = deepCopy(deep_copy_theta);

        sliderIds.forEach((id, index) => {
            const slider = document.getElementById(id).getElementsByClassName("slide")[0];
            const newValue = parseInt(keyframes[currentKeyframe].sliderValues[index]);
            if (slider.value != newValue) {
                 
                slider.value = newValue;
                sliderValues[index] = parseInt(slider.value);
                if (sliderVariables[id] >= 25 && sliderVariables[id] <= 29) {
                    initNodes(torsoId);
                } else {
                    initNodes(sliderVariables[id]);
                }
            }
        });
    }

    document.getElementById("click-listener").addEventListener("click", () => {
         
         
         
         

        const copyOperations = deepCopy(operations);

        copyOperations.splice(previousOperations.length, copyOperations.length).forEach(operation => {
             
            // if last operation is move
            if (operation.type === "move") {
                // update the keyframe
                /*
                if (currentKeyframe == operation.id) {
                    keyframes[currentKeyframe].pointTime = operation.position;
                }
                */


            } else if (operation.type === "delete") {
                /*
                // delete the keyframe
                const index = keyframes.findIndex(keyframe => keyframe.id === operation.id);
                if (index !== -1) {
                    keyframes.splice(index, 1);
                }
                */
            } else if (operation.type === "create") {
                keyframes.push({ id: operation.id, pointTime: operation.position, theta: deepCopy(theta), sliderValues: deepCopy(sliderValues) });
                 
                 
                keyframeContainers[currentKeyframeContainer].pointTimePositions = deepCopy(pointTimePositions);
                if (keyframeContainers[currentKeyframeContainer].ids.indexOf(operation.id) === -1) {
                    keyframeContainers[currentKeyframeContainer].ids.push(operation.id);
                }
                if (keyframeContainers[currentKeyframeContainer].positions.indexOf(operation.position) === -1) {
                    keyframeContainers[currentKeyframeContainer].positions.push(operation.position);
                }

                currentKeyframe = operation.id;
                 
            } else if (operation.type === "select") {
                // save the current theta
                keyframes[currentKeyframe].theta = deepCopy(theta);

                // save the current slider values
                keyframes[currentKeyframe].sliderValues = deepCopy(sliderValues);

                currentKeyframe = parseInt(operation.id);
                 
                 
                // update the theta
                 
                theta = deepCopy(keyframes[currentKeyframe].theta);
                updateSliders();
            } else if (operation.type === "layer-change-before") {
                keyframes[currentKeyframe].theta = deepCopy(theta);
                keyframes[currentKeyframe].sliderValues = deepCopy(sliderValues);

                if (currentKeyframeContainer < keyframeLayers.length) {
                    keyframeLayers[currentKeyframeContainer] = deepCopy(keyframes);
                } else {
                    keyframeLayers.push(deepCopy(keyframes));
                }
                keyframes = [];
                currentKeyframe = 0;
                sliderValues = Array(sliderIds.length).fill(0).map(Number);
                theta = deepCopy(defaultTheta);
                 
            } else if (operation.type === "layer-change-after") {
                 
                 
                 
                 
                if (currentKeyframeContainer < keyframeLayers.length) {
                     
                     
                    keyframes = deepCopy(keyframeLayers[currentKeyframeContainer]);
                    currentKeyframe = 0;
                    theta = deepCopy(keyframes[currentKeyframe].theta);
                    updateSliders();
                } else {
                     
                    currentKeyframe = 0;
                    if (keyframes.length === 0) {
                        keyframes = [{ id: 0, pointTime: 0, theta: deepCopy(theta), sliderValues: deepCopy(sliderValues) }];
                    }
                    keyframeLayers.push(deepCopy(keyframes));
                    updateSliders();
                }
                 
                 
            } else if (operation.type === "save") {
                // save the current theta
                keyframes[currentKeyframe].theta = deepCopy(theta);

                // save the current slider values
                keyframes[currentKeyframe].sliderValues = deepCopy(sliderValues);

                keyframeLayers[currentKeyframeContainer] = deepCopy(keyframes);
            } else if (operation.type === "play") {

                currentKeyframe = parseInt(operation.id);

                // update the theta
                theta = deepCopy(keyframes[currentKeyframe].theta);
            }

        });

        previousOperations = deepCopy(operations);
         
         
    });


    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.7, 0.85, 1.0);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0, 10.0, -10.0, 10.0, -30.0, 30.0);
    modelViewMatrix = mat4();

    upperLeg = createBodyPart(upperLegHeight, upperLegWidth, 1.1);
    middleLeg = createBodyPart(middleLegHeight, middleLegWidth, 1.1);
    lowerLeg = createBodyPart(lowerLegHeight, lowerLegWidth, 1);


    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

    cube(false, colorsWhite, false);
    cube(true, colorsWhite, false);
     
    cube(false, colorsWhite, true);
     

    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

    vBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var colorLocation = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLocation);


    // Load texture coordinates into a buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);


    var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]));
    // Asynchronously load an image
    var image = new Image();
    image.src = "image-texture.png";
    image.addEventListener('load', function () {
        // Now that the image has loaded make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
    });
     
    textureBackground = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]));
    // Asynchronously load an image
    var image = new Image();
    image.src = "image-texture4.png";
    image.addEventListener('load', function () {
        // Now that the image has loaded make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_2D, textureBackground);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
    });

    let fillValues = (value, id, option = null) => {
        if (option) {
            if (option === "middle") {
                if (!id.includes("Middle")) {
                    return;
                }
            } else if (option === "lower") {
                if (!id.includes("Lower")) {
                    return;
                }
            }
        }
        sliderValues[sliderIds.indexOf(id)] = value;
        value = normalizedSliderValue(value, id);
         
         
         
        theta[sliderVariables[id]] = value;
        if (sliderVariables[id] >= 25 && sliderVariables[id] <= 29) {
            initNodes(torsoId);
        } else {
            initNodes(sliderVariables[id]);
        }
    }

    sliderIds.forEach(id => {
        document.getElementById(id).onchange = function () {
            let value = parseInt(event.srcElement.value);
            fillValues(value, id);
        }
    });

    document.getElementById("moveAllLegs").onchange = function () {
        let value = parseInt(event.srcElement.value);
        sliderIds.forEach(id => {
            if (id !== "torsoId" && id !== "translationXSlider" && id !== "translationYSlider" && id !== "translationZSlider" && id !== "torsoRotation2" && id !== "torsoRotation3") {
                fillValues(value, id);
            }
        });

        if (currentKeyframe < keyframes.length) {
            keyframes[currentKeyframe].theta = deepCopy(theta);
            keyframes[currentKeyframe].sliderValues = deepCopy(sliderValues);
        } else {
            keyframes.push({ id: currentKeyframe, pointTime: 0, theta: deepCopy(theta), sliderValues: deepCopy(sliderValues) });
        }
        updateSliders();
    }

    document.getElementById("moveMiddleLegs").onchange = function () {
        let value = parseInt(event.srcElement.value);
        sliderIds.forEach(id => {
            if (id !== "torsoId" && id !== "translationXSlider" && id !== "translationYSlider" && id !== "translationZSlider" && id !== "torsoRotation2" && id !== "torsoRotation3") {
                fillValues(value, id, "middle");
            }
        });

        if (currentKeyframe < keyframes.length) {
            keyframes[currentKeyframe].theta = deepCopy(theta);
            keyframes[currentKeyframe].sliderValues = deepCopy(sliderValues);
        } else {
            keyframes.push({ id: currentKeyframe, pointTime: 0, theta: deepCopy(theta), sliderValues: deepCopy(sliderValues) });
        }
        updateSliders();
    }

    document.getElementById("moveLowerLegs").onchange = function () {
        let value = parseInt(event.srcElement.value);
        sliderIds.forEach(id => {
            if (id !== "torsoId" && id !== "translationXSlider" && id !== "translationYSlider" && id !== "translationZSlider" && id !== "torsoRotation2" && id !== "torsoRotation3") {
                fillValues(value, id, "lower");
            }
        });

        if (currentKeyframe < keyframes.length) {
            keyframes[currentKeyframe].theta = deepCopy(theta);
            keyframes[currentKeyframe].sliderValues = deepCopy(sliderValues);
        } else {
            keyframes.push({ id: currentKeyframe, pointTime: 0, theta: deepCopy(theta), sliderValues: deepCopy(sliderValues) });
        }
        updateSliders();
    }

    for (i = 0; i < numNodes; i++) initNodes(i);


    rotationMatrix = mat4();
    rotationMatrixLoc = gl.getUniformLocation(program, "r");
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(rotationMatrix));

    document.getElementById("play-btn").onclick = function () {
        mode = "play";
    }

    document.getElementById("pause-btn").onclick = function () {
        mode = "pause";
    }

    document.getElementById("stop-btn").onclick = function () {
        mode = "stop";
    }


    vertical = 0;
    horizontal = 0;

    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowUp" && event.shiftKey) {
            vertical += 0.1; 
        } else if (event.key === "ArrowDown" && event.shiftKey) {
            vertical -= 0.1; 
        } else if (event.key === "ArrowLeft" && event.shiftKey) {
            horizontal -= 0.1; 
        } else if (event.key === "ArrowRight" && event.shiftKey) {
            horizontal += 0.1;
        }

        // Update the view matrix based on new camera angles
        setUpViewMatrix();
    });

    canvas.addEventListener("mousedown", function (event) {
        isDragging = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    });

    canvas.addEventListener("mouseup", function (event) {
        isDragging = false;
    });

    // Get the background element
    var backgroundElement = document.getElementById("background");

    // Get the initial background position
    var initialBackgroundPosition = getComputedStyle(backgroundElement).backgroundPosition;
    var [initialX, initialY] = initialBackgroundPosition.split(" ").map(parseFloat);

    // Initialize variables to store the current background position
    var currentX = initialX || 0;
    var currentY = initialY || 0;


    // Get the actual width and height of the background image
    var backgroundImageWidth = backgroundElement.width; 
    var backgroundImageHeight = backgroundElement.height;


    document.addEventListener("mousemove", function (event) {
        if (!isDragging) { 
            return;
        }
      
        var sensitivity = 0.01; 

        azimuth += sensitivity * event.movementX;
        elevation -= sensitivity * event.movementY;

        elevation = Math.max(-89.0, Math.min(89.0, elevation));

        setUpViewMatrix();

        // Calculate the new background position based on mouse movement
        var newX = currentX + event.movementX;
        var newY = currentY + event.movementY;


        // Bound checking to prevent moving beyond the borders
        if (newX > 130) newX = 130;
        if (newX < 0) newX = 0;
        if (newY > 0) newY = 0;
        if (newY < -100) newY = -100;


        // Set the new background position
        backgroundElement.style.backgroundPosition = newX + "px " + newY + "px";

        // Update the current position
        currentX = newX;
        currentY = newY;
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
             
            // Find all sliders on the page
            var sliders = document.querySelectorAll(".slide");
            // Find the currently focused input element
            var focusedElement = document.activeElement;

            if (!focusedElement || !focusedElement.classList.contains("slide")) {
                sliders[0].focus();
            }

            // Check if it's a slider with the 'slide' class
            if (focusedElement && focusedElement.classList.contains("slide")) {

                // Find the index of the currently focused slider
                var currentIndex = Array.from(sliders).indexOf(focusedElement);

                // Move focus to the next slider in the sequence
                if (currentIndex !== -1 && currentIndex < sliders.length - 1) {
                    sliders[currentIndex + 1].focus();
                }
                if (currentIndex === sliders.length - 1) {
                    sliders[0].focus();
                }
            }
        } else if (event.ctrlKey) {
            // Do the reverse of the above
            var sliders = document.querySelectorAll(".slide");
            var focusedElement = document.activeElement;

            if (!focusedElement || !focusedElement.classList.contains("slide")) {
                sliders[sliders.length - 1].focus();
            }

            if (focusedElement && focusedElement.classList.contains("slide")) {

                var currentIndex = Array.from(sliders).indexOf(focusedElement);

                if (currentIndex !== -1 && currentIndex > 0) {
                    sliders[currentIndex - 1].focus();
                }
                if (currentIndex === 0) {
                    sliders[sliders.length - 1].focus();
                }
            }
        }
    });

    render();
}

let startTime = null;

function setUpViewMatrix() {
    var eye = vec3(5.0 * Math.sin(azimuth), 5.0 * Math.sin(elevation), 5.0 * Math.cos(azimuth));
    var at = vec3(horizontal, vertical, 0.0);
    var up = vec3(0.0, 1.0, 0.0);


    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));
}


var render = function (timestamp) {
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    setUpViewMatrix();

    // Configure texture
    gl.activeTexture(gl.TEXTURE0); // Set the active texture unit
    gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the texture
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0); // Set the texture unit to 0

    if (mode === "play") {
        if (startTime === null) {
            startTime = timestamp; // Set the start time only once
        }
        currentKeyframe = 0;
        preparePlayingScene(timestamp);
    } else if (mode === "pause") {
        // disable the sliders etc.
        traverse(torsoId);
        renderRock(5.0, 5.0);
        renderBaloon(1, 1, 20)
        requestAnimFrame(render);
    } else if (mode === "stop") {
        // Only works in edit mode
        if (trackballMove) {
            axis = normalize(axis);
            rotationMatrix = mult(rotationMatrix, rotate(angle, axis));
            gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(rotationMatrix));
        }
        renderRock(5.0, 5.0);
        renderBaloon(1, 1, 20)
        traverse(torsoId);
        requestAnimFrame(render);
    } else if (mode === "idle") {
        // wait for animation to finish

        renderRock(5.0, 5.0);
        renderBaloon(1, 1, 20);
    }

    head(-4 , 2, 1);
    head(-6 , 1, 1);
    head(-8 , 3, 1);
    head(-2 , 0, 1);
}

let preparePlayingScene = (timestamp) => {
    keyframes = keyframes.sort((a, b) => a.pointTime - b.pointTime);
    if (currentKeyframe + 1 == keyframes.length) {
        startTime = null;
        currentKeyframe = keyframes[0].id;
        operations.push({ type: "play", id: currentKeyframe });
         
         
        document.getElementById("click-listener").click();

        mode = "stop";
        document.getElementById("stop-btn").click();
        requestAnimationFrame(render);
        return;
    }

    let time_difference_in_fps = (keyframes[currentKeyframe + 1].pointTime - keyframes[currentKeyframe].pointTime) * 60;
    theta = deepCopy(keyframes[currentKeyframe].theta);
     
     
     

    let difference_theta = keyframes[currentKeyframe + 1].theta.map((value, index) => {
        let dif_theta_op_1 = (value - theta[index]);
        let dif_theta_op_2 = dif_theta_op_1;
        while (dif_theta_op_2 < 0) {
            dif_theta_op_2 += 360;
        }
        if (Math.abs(dif_theta_op_1) < Math.abs(dif_theta_op_2)) {
            return dif_theta_op_1;
        } else {
            return dif_theta_op_2;
        }
    });
    playScene(timestamp, (keyframes[currentKeyframe].pointTime * 1000 + timestamp), time_difference_in_fps, difference_theta, 0);
}

const fps = 60;
let fps_counter = 0;
let item_fps_counter = 0;

let playScene = (timestamp, start_time, time_difference, difference_theta, previous_progress) => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Configure texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
    renderRock(5.0, 5.0);
    renderBaloon(1, 1, (item_fps_counter / 5) + 5, 1);
    renderBaloon(1, 1, (item_fps_counter / 5) + 10, 0.8, 5);
    renderBaloon(1, 1, (item_fps_counter / 5) + 15, 0.8, -5);
    head(-4 , 2, item_fps_counter);
    head(-6 , 1, item_fps_counter);
    head(-8 , 3, item_fps_counter);
    head(-2 , 0, item_fps_counter);



    fps_counter++;
    item_fps_counter++;
    let progress = fps_counter / time_difference;
    let elapsed_progress = progress - previous_progress;

    theta = theta.map((value, index) => value + difference_theta[index] * elapsed_progress);

    for (let i = 0; i < 25; i++) {
        initNodes(i);
    }
    traverse(torsoId);

    // Continue rendering if not in play mode
    if (progress < 1) {
        // Continue rendering if the animation is not finished
        setTimeout(() => {
            requestAnimationFrame(function (timestamp) {
                playScene(timestamp, startTime, time_difference, difference_theta, progress);
            })
        }, 1000 / fps);
    } else {
        // Reset the fps counter
        fps_counter = 0;
        currentKeyframe++;
        preparePlayingScene(timestamp);
    }
}