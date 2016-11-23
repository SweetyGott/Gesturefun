function DrawingApp() {

    this.canvas = this.__canvas = new fabric.Canvas('c');

    this.canvas.setWidth($('#canvas-container').get(0).offsetWidth - 50);
    this.canvas.setHeight(900);
    var canvasCenter = new fabric.Point(this.canvas.width/2, this.canvas.height/2); // center of canvas

    this.canvas.isDrawingMode = true;

    this.setRotation = function(rads) {

        var angle = -(rads / Math.PI) * 180;
        this.canvas.getObjects().forEach(function (obj) {
            var objectOrigin = new fabric.Point(obj.left, obj.top);
            var new_loc = fabric.util.rotatePoint(objectOrigin, canvasCenter, rads);
            obj.top = new_loc.y;
            obj.left = new_loc.x;
            obj.setAngle(angle); //setRotation each object buy the same rads
        });


    };


    this.changeBrushSize = function(scaling) {
        this.canvas.freeDrawingBrush.width = scaling;
    };

    this.pan = function(position) {
       this.canvas.absolutePan(new fabric.Point(-position[0],-position[2]))
    };

    this.zoom = function(zoomValue) {
        this.canvas.setZoom(zoomValue);
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



        if (zoomGesture(hand)) {
            var convertedSize = convertRange(hand.indexFinger.tipPosition[1],[0,700],[1,20]);
            if (touchState.penButton) {
                drawingApp.changeBrushSize(convertedSize);
            }

            if (touchState.fingerTouch || touchState.penHover) {
                drawingApp.zoom(convertedSize);
            }
        }
        setDisplay('brushSize',zoomGesture(hand),touchState.penButton);
        setDisplay('zoom',true,touchState.fingerTouch || touchState.penHover);

        setDisplay('toolbox',openDrawingToolsGestureRecognized(hand),true); // no p action needed TODO: implement effect

        if (touchState.penHover || touchState.fingerTouch) {
            drawingApp.pan(hand.screenPosition());
            //drawingApp.setRotation(hand.roll());
        }
        setDisplay('rotateCanvas',true,touchState.penHover || touchState.fingerTouch); //TODO: setRotation around finger/pen
        setDisplay('pan',true,touchState.penHover || touchState.fingerTouch);



        drawingApp.render();

    });

}).use('screenPosition', {changeBrushSize: 0.25});

function zoomGesture(hand) {

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