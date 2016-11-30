function DrawingApp() {

    this.canvas = this.__canvas = new fabric.Canvas('c');

    this.statusCanvas = new fabric.Canvas('status');
    this.statusCanvas.setWidth(100);
    this.statusCanvas.setHeight(100);

    this.canvas.setWidth($('#canvas-container').get(0).offsetWidth - 50);
    this.canvas.setHeight(900);
    var canvasCenter = new fabric.Point(this.canvas.width/2, this.canvas.height/2); // center of canvas

    this.canvas.isDrawingMode = true;

    this.penSizeIndicator = new fabric.Circle({
        left: this.statusCanvas.width/2,
        top: this.statusCanvas.width/2,
        radius: this.canvas.freeDrawingBrush.width.radius,
        selectable: false,
        originX: 'center', originY: 'center'
    });
    this.statusCanvas.add(this.penSizeIndicator);


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
        this.penSizeIndicator.setRadius(scaling);
        console.log(this.penSizeIndicator.radius)
    };

    //Sets the Pan to an absolute Position
    this.setPan = function(position) {
        this.canvas.absolutePan(new fabric.Point(-position[0],-position[2]))
    };

    //Moves the DrwaingPan by a vector
    this.movePan = function (moveVector) {
        this.canvas.relativePan(new fabric.Point(moveVector[0],moveVector[2]))
    };

    //Sets the absolute Zoom
    this.setZoom = function(zoomValue) {
        canvas.zoomToPoint(new fabric.Point(this.canvas.width / 2, this.canvas.height / 2), this.canvas.getZoom() / zoomValue);
    };

    //ChangeZoom
    // zooms in or out with the hand position as center
    this.changeZoom = function (zoomVector,handPosition) {
        this.canvas.zoomToPoint(new fabric.Point(this.canvas.width / 2, this.canvas.height / 2), this.canvas.getZoom() * zoomVector);
    };

    this.render = function() {
        this.canvas.renderAll();
        this.statusCanvas.renderAll();
    };
}
