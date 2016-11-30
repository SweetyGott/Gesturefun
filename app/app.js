var drawingApp = null;
var drawingAppController = null;

Leap.loop(function (frame) {
    if (!drawingApp) {
        drawingApp = new DrawingApp();
    }

    if (!drawingAppController) {
        drawingAppController = new DrawingAppController(drawingApp);
    }

    frame.hands.forEach(function (hand, index) {
        drawingAppController.update(hand);
    });

}).use('screenPosition', {changeBrushSize: 0.25});
