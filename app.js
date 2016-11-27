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

    //Sets the Pan to an absolute Position
    this.pan = function(position) {
        this.canvas.absolutePan(new fabric.Point(-position[0],-position[2]))
    };

    //Moves the DrwaingPan by a vector
    this.movePan = function (moveVector) {
        this.canvas.relativePan(new fabric.Point(moveVector[0],moveVector[2]))
    };

    this.zoom = function(zoomValue) {
        this.canvas.setZoom(zoomValue);
    };

    this.render = function() {
        this.canvas.renderAll();
    }
}

var drawingApp = null;
var screenpositionHand = Leap.vec3.create();
var screenpositionCalibrated = false;

//Leap Schleife zur Erkennung von Gesten
Leap.loop(function (frame) {
    if (!drawingApp) {
        drawingApp = new DrawingApp();
    }

    //Iterates through each recognized hand
    frame.hands.forEach(function (hand, index) {
        //GetGestures
        var toolbox = toolboxGesture(hand);
        var zoomBrush = zoomBrushGesture(hand);
        var pan = panGesture(hand);

        //Toolbox
        setDisplay('toolbox',toolbox,true); // no p action needed, why the second is always true
        //TODO: implement effect
        if (toolboxGesture) {

        }

        //Brushsize effect
        setDisplay('brushSize',zoomBrush,touchState.penButton);
        if(zoomBrush && touchState.penButton) {
            var convertedSize = convertRange(hand.indexFinger.tipPosition[1],[0,700],[1,20]);
            drawingApp.changeBrushSize(convertedSize);
        }

        //RotateCanvas
        setDisplay('rotateCanvas',false,touchState.penHover || touchState.fingerTouch); //TODO: setRotation around finger/pen

        //Zoom effect
        setDisplay('zoom',zoomBrush,touchState.fingerTouch || touchState.penHover);
        if(zoomBrush && (touchState.fingerTouch || touchState.penHover)) {
            var convertedSize = convertRange(hand.indexFinger.tipPosition[1],[0,700],[1,20]);
            drawingApp.zoom(convertedSize);
        }

        //MoveCanvas
        setDisplay('pan',pan,touchState.penHover || touchState.fingerTouch);
        if (touchState.penHover || touchState.fingerTouch) {
            if(!screenpositionCalibrated) {
                screenpositionHand = hand.screenPosition();
                screenpositionCalibrated = true;
            } else {
                var newScreenpositionHand = hand.screenPosition();
                var moveVector = Leap.vec3.create();

                Leap.vec3.subtract(moveVector, newScreenpositionHand,screenpositionHand);
                console.log("Start");
                console.log(newScreenpositionHand );
                console.log(screenpositionHand);
                console.log(moveVector);
                drawingApp.movePan(moveVector);
                screenpositionHand = newScreenpositionHand;
            }

            //drawingApp.setRotation(hand.roll());
        } else {
            screenpositionCalibrated = false;
        }



        //render new picture after recognizing everything
        drawingApp.render();

    });

}).use('screenPosition', {changeBrushSize: 0.25});

function panGesture(hand) {
    if (!(hand.fingers.length === 5)) {
        return false;
    }
    return true;
}

function zoomBrushGesture(hand) {

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

function toolboxGesture(hand) {
    var palmPosition = hand.palmPosition;
    //Thumb ignored
    for (var i = 1; i < 5; i++) {
        if (math.distance(palmPosition,hand.fingers[i].tipPosition) > 50) {
            return false;
        }
    }
    return true;
}

//Sets border of recognized gestures
function setDisplay(elementId,npIsActive,pIsActive) {
    //Gets Row for Showing
    var gestureRow = document.getElementById(elementId);
    //Sets the cells
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