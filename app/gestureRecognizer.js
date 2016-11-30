function GestureRecognizer() {

    this.zoomGesture = function(hand) {
        var zoomRecognized = zoomBrushGesture(hand);
        var pTrigger = touchState.fingerTouch || touchState.penHover;
        setDisplay('zoom',zoomRecognized,pTrigger);

        return zoomRecognized && pTrigger;
    };

    this.brushGesture = function(hand) {
        var brushSizeRecognized = zoomBrushGesture(hand);
        var pTrigger = touchState.penButton;
        setDisplay('brushSize',brushSizeRecognized,pTrigger);

        return brushSizeRecognized && pTrigger;
    };

    this.toolboxGesture = function(hand) {
        var toolboxRecognized = true;
        var palmPosition = hand.palmPosition;
        //Thumb ignored
        for (var i = 1; i < 5; i++) {
            if (math.distance(palmPosition,hand.fingers[i].tipPosition) > 50) {
                toolboxRecognized = false
            }
        }
        //Toolbox
        setDisplay('toolbox',toolboxRecognized,true); // no p action needed, why the second is always true
        return toolboxRecognized;
    };

    this.panGesture = function(hand) {
        var panRecognized = hand.fingers.length === 5;
        var npTrigger = touchState.penHover || touchState.fingerTouch;
        setDisplay('pan',panRecognized,npTrigger);
        return panRecognized && npTrigger
    };

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
}


