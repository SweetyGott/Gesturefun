
var touchState = {
    penTouch : false,
    penHover : false,
    penButton : false,
    fingerTouch : false
};

document.body.onmousedown = function() {
    touchState.penHover = false;
    touchState.penTouch = true;
};

document.body.onmouseup = function() {
    touchState.penHover = false;
    touchState.penTouch = false;
};

document.body.onkeydown = function(event) {
    if (event.which == 72) { // 'h' for hover
        touchState.penTouch = false;
        touchState.penHover = true;
    } else if (event.which == 66) { // 'b' for pen button
        touchState.penButton = true;
    }
};
document.body.onkeyup = function(event) {
    if (event.which == 72) { // 'h' for hover
        touchState.penHover = false;
    } else if (event.which == 66) { // 'b' for pen button
        touchState.penButton = false;
    }
};
