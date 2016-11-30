/**
 * Created by Lukas on 30.11.2016.
 */

function DrawingAppController(drawingApp) {

    var gestureRecognizer = new GestureRecognizer();

    var referencePanPosition = null;
    var referenceZoomMultiplier = null;

    this.update = function(hand) {

        //TODO: implement effect
        if (gestureRecognizer.toolboxGesture(hand)) {

        }

        if(gestureRecognizer.brushGesture(hand)) {
            onBrushGesture(hand);
        }

        if(gestureRecognizer.zoomGesture(hand)) {
            onZoomGesture(hand,referenceZoomMultiplier);
            referenceZoomMultiplier = convertRange(hand.indexFinger.tipPosition[1],[0,700],[1,20]);
        } else {
            referenceZoomMultiplier = null;
        }

        if (gestureRecognizer.panGesture(hand)) {
            onPanGesture(hand,referencePanPosition);
            referencePanPosition = hand.screenPosition();
        } else {
            referencePanPosition = null;
        }

        //render new picture after recognizing everything
        drawingApp.render();
    };

    function onBrushGesture(hand) {
        var convertedSize = convertRange(hand.indexFinger.tipPosition[1],[0,700],[1,20]);
        drawingApp.changeBrushSize(convertedSize);
    }

    function onPanGesture(hand,referencePanPosition) {
        if (referencePanPosition !== null) {
            var moveVector = Leap.vec3.create();
            Leap.vec3.subtract(moveVector, hand.screenPosition(),referencePanPosition);
            drawingApp.movePan(moveVector);
        }
    }

    function onZoomGesture(hand,referenceZoomMultiplier) {
        if (referenceZoomMultiplier !== null) {
            var newZoomMultiplier = convertRange(hand.indexFinger.tipPosition[1],[0,700],[1,20]);
            var zoomMultiplier = newZoomMultiplier - referenceZoomMultiplier;
            if (zoomMultiplier < 0) {
                zoomMultiplier -= 1;
                zoomMultiplier = -1/zoomMultiplier;
            } else {
                zoomMultiplier += 1;
            }
            drawingApp.changeZoom(zoomMultiplier);

        }
    }

    function convertRange(value, fromRange, toRange) {
        return ( value - fromRange[0] ) * ( toRange[1] - toRange[0] ) / ( fromRange[1] - fromRange[0] ) + toRange[0];
    }

}
