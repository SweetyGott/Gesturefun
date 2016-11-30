/**
 * Created by Lukas on 30.11.2016.
 */

function DrawingAppController(drawingApp) {

    var gestureRecognizer = new GestureRecognizer();

    this.run = function(hand) {
        //TODO: implement effect
        if (gestureRecognizer.toolboxGesture(hand)) {

        }

        if(gestureRecognizer.brushGesture(hand)) {
            var convertedSize = convertRange(hand.indexFinger.tipPosition[1],[0,700],[1,20]);
            drawingApp.changeBrushSize(convertedSize);
        }

        if(gestureRecognizer.zoomGesture(hand)) {
            if(!zoomCalibrated) {
                zoomHand = convertRange(hand.indexFinger.tipPosition[1],[0,700],[1,20]);
                zoomCalibrated = true;
            } else {
                var newZoomHand = convertRange(hand.indexFinger.tipPosition[1],[0,700],[1,20]);
                var zoomMultiplier = newZoomHand - zoomHand;
                if (zoomMultiplier < 0) {
                    zoomMultiplier -= 1;
                    zoomMultiplier = -1/zoomMultiplier;
                } else {
                    zoomMultiplier += 1;
                }
                drawingApp.changeZoom(zoomMultiplier);
                zoomHand = newZoomHand;
            }

        } else {
            zoomCalibrated = false;
        }

        if (gestureRecognizer.panGesture(hand)) {
            if(!screenpositionCalibrated) {
                screenpositionHand = hand.screenPosition();
                screenpositionCalibrated = true;
            } else {
                var newScreenpositionHand = hand.screenPosition();
                var moveVector = Leap.vec3.create();
                Leap.vec3.subtract(moveVector, newScreenpositionHand,screenpositionHand);
                drawingApp.movePan(moveVector);
                screenpositionHand = newScreenpositionHand;
            }

        } else {
            screenpositionCalibrated = false;
        }

//render new picture after recognizing everything
        drawingApp.render();
    };

    function convertRange(value, fromRange, toRange) {
        return ( value - fromRange[0] ) * ( toRange[1] - toRange[0] ) / ( fromRange[1] - fromRange[0] ) + toRange[0];
    }

}
