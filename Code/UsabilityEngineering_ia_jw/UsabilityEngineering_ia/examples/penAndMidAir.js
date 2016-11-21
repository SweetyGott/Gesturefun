///////////////////library

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


var targetDiv = document.getElementById("body");

var firstTime = true;

var ctx;
var canvas;
var oldX;                   
var oldY;
var myStroke = new Stroke("no color set yet", 5, 1);

function myTouchStart(posX, posY) {
		oldX = posX;
		oldY = posY;
	}

function myTouchMove(posX, posY) {
	if(firstTime) {
		canvas = document.getElementById("canvas");  
		ctx = canvas.getContext("2d");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		firstTime = false;	
	}
	else {

		ctx.beginPath();
		ctx.strokeStyle = myStroke.color;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.lineWidth = myStroke.size;
	
		ctx.moveTo(oldX,oldY);
		newX = posX;
		newY = posY;
		
		ctx.lineTo(newX,newY);
		ctx.stroke();		
		
		oldX = posX;
		oldY = posY;	
	}
}


function myTouchEnd() {	
;//
}

debug = 0; // in debug modus when set to 1

// this is the loop function, which is called repeatedly and each frame. 
// In this loop we can access the hand information provided by the leap sdk	
Leap.loop({enableGestures:false},function(frame) {
   
   //console.log("hello");	

   	//Erstes
	if (typeof(frame.hands[0]) != 'undefined' && frame.hands[0] != null) {
		if(debug==1) {
			//Nur Schriftgröße
			
			//Eine Art Handerkennung glaube ich
			if (typeof(frame.fingers[0]) != 'undefined' && frame.fingers[0] != null && typeof(frame.fingers[1]) != 'undefined' && frame.fingers[1] != null) {
				
				var hand_angle = map_range(frame.hands[0].direction[0], -1,1,-190,550);			
				var hand_distance = map_range(frame.hands[0].palmPosition[1], 0,300,-20,80);
							
				var hand_rotation_V = map_range(frame.hands[0].direction[1], -1,1,0,100);
					
					
					
					
				myStroke.color = ("hsl(100, 100%,50%)");
					
				modeDiv = document.getElementById("mode");
					
				if(modeDiv != undefined) {
					modeDiv.style.backgroundColor = myStroke.color;
					//console.log(myStroke.getColor());
					modeDiv.style.width = hand_distance + "px";
					modeDiv.style.height = hand_distance + "px";
					modeDiv.style.borderRadius = (hand_distance / 0.5) + "px";
	            }
				
				if(hand_distance < 0) {hand_distance = 1;}
				
				myStroke.size = hand_distance;		
			}
			
		}
		else {
			//Mit Farbe durch den Winkel
			var hand_angle = map_range(frame.hands[0].direction[0], -1,1,-190,550);			
			var hand_distance = map_range(frame.hands[0].palmPosition[1], 0,300,-20,80);			
			var hand_rotation_V = map_range(frame.hands[0].direction[1], -1,1,0,100);
				
			myStroke.color = ("hsl("+Math.floor(hand_angle)+", 100%,"+Math.floor(hand_rotation_V)+"%)");
				
			modeDiv = document.getElementById("mode");
				
			if(modeDiv != undefined) {
				modeDiv.style.backgroundColor = myStroke.color;
				//console.log(myStroke.getColor());
				modeDiv.style.width = hand_distance + "px";
				modeDiv.style.height = hand_distance + "px";
				modeDiv.style.borderRadius = (hand_distance / 0.5) + "px";
            }
			
			if(hand_distance < 0) {hand_distance = 1;}
			
			myStroke.size = hand_distance;	
				
		}
			
		
	}
	
 });
	
	
	
