var drawingApp = {};
var curScaling = 1;

Leap.loop(function (frame) {

    var drawingApp = ( drawingApp || new DrawingApp());


    frame.hands.forEach(function (hand, index) {

        if (brushSizeGestureRecognized(hand)) {
            curScaling = convertRange(hand.indexFinger.tipPosition[1],[0,700],[0.1,3]);
            setDisplay('brushSize',true)
        } else {
            setDisplay('brushSize',false)
        }

        if (openDrawingToolsGestureRecognized(hand)) {
            setDisplay('toolbox',true)
        } else {
            setDisplay('toolbox',false)
        }

        drawingApp.transformRectangle(hand.screenPosition(), hand.roll(), curScaling);
    });

}).use('screenPosition', {scale: 0.25});


function setDisplay(elementId,isActive) {
    if (isActive) {
        document.getElementById(elementId).style.backgroundColor = "#00FF00";
    } else {
        document.getElementById(elementId).style.backgroundColor = "#FFFFFF";
    }

}
function convertRange(value, fromRange, toRange) {
    return ( value - fromRange[0] ) * ( toRange[1] - toRange[0] ) / ( fromRange[1] - fromRange[0] ) + toRange[0];
}

var DrawingApp = function () {

    var drawingApp = this;

    var canvas = this.__canvas = new fabric.Canvas('c');

    var rect = new fabric.Rect({
        left: 150,
        top: 200,
        originX: 'left',
        originY: 'top',
        width: 150,
        height: 120,
        angle: -10,
        fill: 'rgba(255,0,0,0.5)',
        transparentCorners: false
    });

    canvas.add(rect).setActiveObject(rect);

    drawingApp.transformRectangle = function (position, rotation, scaling) {
        rect.left = position[0];
        rect.top = position[2];
        rect.angle = rotation;
        rect.scale(scaling);
        canvas.renderAll();
    }


};

function brushSizeGestureRecognized(hand) {

    if (!(hand.fingers.length === 5)) {
        return false;
    }

    var thumbPosition = hand.thumb.tipPosition;
    var pinkyPosition = hand.pinky.tipPosition;
    var pinkyDirection = hand.pinky.direction;

    var approxEqualLocation = function (a, b) {
        return math.distance(a,b) < 50;
    };

    return approxEqualLocation(thumbPosition, pinkyPosition) &&
        pinkyDirection[1] < -0.5;
}

function openDrawingToolsGestureRecognized(hand) {
    var palmPosition = hand.palmPosition;

    for (var i = 1; i < 5; i++) {
        if (math.distance(palmPosition,hand.fingers[i].tipPosition) > 50) {
            return false;
        }
    }
    return true;
}