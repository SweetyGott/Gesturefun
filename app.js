function DrawingApp() {

    this.canvas = this.__canvas = new fabric.Canvas('c');

    this.rect = new fabric.Rect({
        left: 150,
        top: 200,
        originX: 'center',
        originY: 'center',
        width: 150,
        height: 120,
        fill: 'rgba(255,0,0,0.5)',
        transparentCorners: false
    });

    this.canvas.add(this.rect);

    this.rotate = function (rotation) {
        this.rect.setAngle(-(rotation / Math.PI) * 180);
    };

    this.scale = function(scaling) {
        this.rect.setScaleX(scaling);
        this.rect.setScaleY(scaling);
    };

    this.move = function(position) {
        this.rect.left = position[0];
        this.rect.top = position[2];
    };

    this.render = function() {
        this.canvas.renderAll();
    }
}

var drawingApp = null;

Leap.loop(function (frame) {

    if (!drawingApp) {
        drawingApp = new DrawingApp();
    }

    frame.hands.forEach(function (hand, index) {


        if (brushSizeGestureRecognized(hand)) {
            drawingApp.scale(convertRange(hand.indexFinger.tipPosition[1],[0,700],[0.1,5]));
            setDisplay('brushSize',true)
        } else {
            setDisplay('brushSize',false)
        }

        if (openDrawingToolsGestureRecognized(hand)) {
            setDisplay('toolbox',true)
        } else {
            setDisplay('toolbox',false)
        }

        drawingApp.move(hand.screenPosition());
        drawingApp.rotate(hand.roll());
        drawingApp.render();

    });

}).use('screenPosition', {scale: 0.25});

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