function GestureRecognizer() {

    this.ZoomGestureEnum = Object.freeze({"TWO_FINGERS":1, "WHOLE_HAND":2, "NONE":3});


    this.zoomGesture = function(hand) {
        var zoomWholeHand = zoomBrushGesture(hand);
        var zoomTwoFingers = twoFingerZoomGesture(hand);
        var pTrigger = touchState.fingerTouch || touchState.penHover;
        setDisplay('zoom',zoomWholeHand,pTrigger);
        setDisplay('zoom-two-fingers',zoomTwoFingers,pTrigger);

        if (!pTrigger) {
            return this.ZoomGestureEnum.NONE;
        } else if (zoomWholeHand) {
            return this.ZoomGestureEnum.WHOLE_HAND
        } else if (zoomTwoFingers) {
            return this.ZoomGestureEnum.TWO_FINGERS
        } else {
            return this.ZoomGestureEnum.NONE;
        }
    };

    this.brushGesture = function(hand) {
        var brushWholeHand = zoomBrushGesture(hand);
        var brushTwoFingers = twoFingerZoomGesture(hand);

        setDisplay('brushSize',brushWholeHand,touchState.penButton);
        setDisplay('brushSize-two-fingers',brushTwoFingers,touchState.penTouch || touchState.penButton);

        if (touchState.penButton && brushWholeHand) {
            return this.ZoomGestureEnum.WHOLE_HAND;
        } else if (touchState.penButton && brushTwoFingers) {
            return this.ZoomGestureEnum.TWO_FINGERS;
        } else if (touchState.penTouch && brushTwoFingers) {
            return this.ZoomGestureEnum.TWO_FINGERS;
        } else {
            return this.ZoomGestureEnum.NONE;
        }
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

    this.rotationGesture = function(hand) {
        var rotationRecognized = hand.fingers.length === 5;
        var npTrigger = touchState.penHover || touchState.fingerTouch;
        setDisplay('rotate',rotationRecognized,npTrigger);
        return rotationRecognized && npTrigger
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

    function twoFingerZoomGesture(hand) {

        var gestureRecognized = true;
        var palmPosition = hand.palmPosition;
        //Thumb and index finger ignored
        for (var i = 2; i < 5; i++) {
            if (math.distance(palmPosition,hand.fingers[i].tipPosition) > 100) {
                gestureRecognized = false
            }
        }
        return gestureRecognized;

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


