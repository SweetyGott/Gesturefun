
var touchState = {
    penTouch : false,
    penHover : false,
    penButton : false,
    fingerTouch : false
};

document.body.onmousedown = function() {
    touchState.penHover = false;
    touchState.penTouch = true;
    setTouchStateDisplay();
};

document.body.onmouseup = function() {
    touchState.penHover = false;
    touchState.penTouch = false;
    setTouchStateDisplay();
};

document.body.onkeydown = function(event) {
    if (event.which == 72) { // 'h' for hover
        touchState.penTouch = false;
        touchState.penHover = true;
    } else if (event.which == 66) { // 'b' for pen button
        touchState.penButton = true;
    }
    setTouchStateDisplay();
};
document.body.onkeyup = function(event) {
    if (event.which == 72) { // 'h' for hover
        touchState.penHover = false;
    } else if (event.which == 66) { // 'b' for pen button
        touchState.penButton = false;
    }
    setTouchStateDisplay();
};

function setTouchStateDisplay() {
    document.getElementById("penTouch").style.backgroundColor = touchState.penTouch  ? "#00FF00" : "#FFFFFF";
    document.getElementById("penHover").style.backgroundColor = touchState.penHover  ? "#00FF00" : "#FFFFFF";
    document.getElementById("penButton").style.backgroundColor = touchState.penButton  ? "#00FF00" : "#FFFFFF";
    document.getElementById("fingerTouch").style.backgroundColor = touchState.fingerTouch  ? "#00FF00" : "#FFFFFF";
}
