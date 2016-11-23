function DrawingApp() {

    this.canvas = this.__canvas = new fabric.Canvas('c');

    this.canvas.setWidth($('#canvas-container').get(0).offsetWidth - 50);
    this.canvas.setHeight(900);

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



        if (brushSizeGestureRecognized(hand) && touchState.penButton) {
            drawingApp.scale(convertRange(hand.indexFinger.tipPosition[1],[0,700],[0.1,5]));
        }
        setDisplay('brushSize',brushSizeGestureRecognized(hand),touchState.penButton);

        setDisplay('toolbox',openDrawingToolsGestureRecognized(hand),true); // no p action needed TODO: implement effect

        if (touchState.penHover || touchState.fingerTouch) {
            drawingApp.move(hand.screenPosition());
            drawingApp.rotate(hand.roll());
        }
        setDisplay('rotateCanvas',true,touchState.penHover || touchState.fingerTouch); //TODO: rotate around finger/pen
        setDisplay('pan',true,touchState.penHover || touchState.fingerTouch);

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

function setDisplay(elementId,npIsActive,pIsActive) {

    var gestureRow = document.getElementById(elementId);
    var tagCell = gestureRow.getElementsByClassName("DESC")[0];
    var npCell = gestureRow.getElementsByClassName("NP")[0];
    var pCell = gestureRow.getElementsByClassName("P")[0];


    npCell.style.backgroundColor = npIsActive ? "#00FF00" : "#FFFFFF";
    pCell.style.backgroundColor = pIsActive ? "#00FF00" : "#FFFFFF";
    tagCell.style.backgroundColor = npIsActive && pIsActive? "#00FF00" : "#FFFFFF";
}

function convertRange(value, fromRange, toRange) {
    return ( value - fromRange[0] ) * ( toRange[1] - toRange[0] ) / ( fromRange[1] - fromRange[0] ) + toRange[0];
}