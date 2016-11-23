var drawingApp = {};
var curScaling = 1;

Leap.loop(function (frame) {

    var drawingApp = ( drawingApp || new DrawingApp());


    frame.hands.forEach(function (hand, index) {

        if (brushSizeGestureRecognized(hand)) {
            document.getElementById('bla').textContent = "Brush size gesture recognized!";
            curScaling = convertRange(hand.indexFinger.tipPosition[1],[0,700],[0.1,3]);
        } else {
            document.getElementById('bla').textContent = ""
        }
        drawingApp.transformRectangle(hand.screenPosition(), hand.roll(), curScaling);
    });

}).use('screenPosition', {scale: 0.25});

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
        return math.distance(a,b) < 90;
    };

    return approxEqualLocation(thumbPosition, pinkyPosition) &&
        pinkyDirection[1] < -0.5;
}