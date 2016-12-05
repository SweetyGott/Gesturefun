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

        var brushGesture = gestureRecognizer.brushGesture(hand);

        if(brushGesture !== gestureRecognizer.ZoomGestureEnum.NONE) {
            onBrushGesture(hand,brushGesture);
        }


        var zoomGesture = gestureRecognizer.zoomGesture(hand);

        if(zoomGesture !== gestureRecognizer.ZoomGestureEnum.NONE) {
            onZoomGesture(hand,referenceZoomMultiplier,zoomGesture);
            referenceZoomMultiplier = calcZoomMultiplier(hand,zoomGesture);
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

    function onBrushGesture(hand,zoomType) {
        var convertedSize = calcBrushSize(hand,zoomType);
        drawingApp.changeBrushSize(convertedSize);
    }

    function onPanGesture(hand,referencePanPosition) {
        if (referencePanPosition !== null) {
            var moveVector = Leap.vec3.create();
            Leap.vec3.subtract(moveVector, hand.screenPosition(),referencePanPosition);
            drawingApp.movePan(moveVector);
        }
    }

    function onZoomGesture(hand,referenceZoomMultiplier,zoomType) {
        if (referenceZoomMultiplier !== null) {
            var newZoomMultiplier = calcZoomMultiplier(hand,zoomType);
            var zoomMultiplier = newZoomMultiplier - referenceZoomMultiplier;
            if (zoomMultiplier < 0) {
                zoomMultiplier -= 1;
                zoomMultiplier = -1/zoomMultiplier;
            } else {
                zoomMultiplier += 1;
            }

            zoomMultiplier = Math.max(Math.min(zoomMultiplier,20),0.1);

            drawingApp.changeZoom(zoomMultiplier);

        }
    }


    function calcZoomMultiplier(hand,zoomType) {
        if (zoomType === gestureRecognizer.ZoomGestureEnum.WHOLE_HAND) {
            return convertRange(hand.indexFinger.tipPosition[1],[0,700],[1,20]);
        }

        if (zoomType === gestureRecognizer.ZoomGestureEnum.TWO_FINGERS) {
            return convertRange(math.distance(hand.thumb.tipPosition,hand.indexFinger.tipPosition),[30,120],[1,5]);
        }
    }

    function calcBrushSize(hand,zoomType) {
        if (zoomType === gestureRecognizer.ZoomGestureEnum.WHOLE_HAND) {
            return Math.max(1,convertRange(hand.indexFinger.tipPosition[1],[0,700],[1,20]));
        }

        if (zoomType === gestureRecognizer.ZoomGestureEnum.TWO_FINGERS) {
            return Math.max(1,convertRange(math.distance(hand.thumb.tipPosition,hand.indexFinger.tipPosition),[30,120],[1,20]));
        }
    }


    function convertRange(value, fromRange, toRange) {
        return ( value - fromRange[0] ) * ( toRange[1] - toRange[0] ) / ( fromRange[1] - fromRange[0] ) + toRange[0];
    }

}
