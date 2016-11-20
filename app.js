var cats = {};

var curScaling = 1;

Leap.loop(function (frame) {

    frame.hands.forEach(function (hand, index) {

        var cat = ( cats[index] || (cats[index] = new Cat()) );

        if (brushSizeGestureRecognized(hand)) {
            document.getElementById('bla').textContent = "Brush size gesture recognized!";
            curScaling = convertRange(hand.indexFinger.tipPosition[1],[0,700],[0.1,3]);
        } else {
            document.getElementById('bla').textContent = ""
        }
        cat.setTransform(hand.screenPosition(), hand.roll(), curScaling);

    });

}).use('screenPosition', {scale: 0.25});

function convertRange(value, from, to) {
    return ( value - from[0] ) * ( to[1] - to[0] ) / ( from[1] - from[0] ) + to[0];
}


function brushSizeGestureRecognized(hand) {

    if (!(hand.fingers.length === 5)) {
        return false;
    }

    var thumbPosition = hand.thumb.tipPosition;
    var pinkyPosition = hand.pinky.tipPosition;
    var pinkyDirection = hand.pinky.direction;

    var approxEqualLocation = function (a, b) {
        console.log(math.distance(a,b));
        return math.distance(a,b) < 90;
    };

    return approxEqualLocation(thumbPosition, pinkyPosition) &&
        pinkyDirection[1] < -0.5;
}

var Cat = function () {
    var cat = this;
    var img = document.createElement('img');
    img.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/109794/cat_2.png';
    img.style.position = 'absolute';
    img.onload = function () {
        cat.setTransform([window.innerWidth / 2, window.innerHeight / 2], 0);
        document.body.appendChild(img);
    };

    cat.setTransform = function (position, rotation, scaling) {

        var left = position[0] - img.width / 2 + "px";
        var top = position[2] + img.height + "px";


        img.style.left = 0 + "px";
        img.style.top = 0 + "px";

        img.style.transform = 'translate(' + left + "," + top + ")";
        img.style.transform += 'scale(' + scaling + ")";
        img.style.transform += 'rotate(' + -rotation + 'rad)';

        img.style.webkitTransform = img.style.MozTransform = img.style.msTransform =
            img.style.OTransform = img.style.transform;

    };


};

cats[0] = new Cat();