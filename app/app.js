var drawingApp = null;
var drawingAppController = null;
var zoomHand = null;
var zoomCalibrated = false;

var screenpositionHand = Leap.vec3.create();
var screenpositionCalibrated = false;

Leap.loop(function (frame) {
    if (!drawingApp) {
        drawingApp = new DrawingApp();
    }

    if (!drawingAppController) {
        drawingAppController = new DrawingAppController(drawingApp);
    }

    frame.hands.forEach(function (hand, index) {
        drawingAppController.run(hand);
    });

}).use('screenPosition', {changeBrushSize: 0.25});


function convertRange(value, fromRange, toRange) {
    return ( value - fromRange[0] ) * ( toRange[1] - toRange[0] ) / ( fromRange[1] - fromRange[0] ) + toRange[0];
}