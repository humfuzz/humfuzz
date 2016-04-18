

// look up the text canvas.
var canvas = document.getElementById("canvas");

// make a 2D context for it
var ctx = canvas.getContext("2d");

// timing

var fps = 60;
var now = 0;
var then = Date.now();
var timestep = 1000/fps;
var delta;

var framecount = 0;
var first = then;
var time_elapsed;
var real_fps = 0;

// timeline timing

console.log(timestep);
var timeline_lap = 4000; // ms for the timeline to go from start to end
var timeline_stepsize = 100; // ms for each recorded 'step' on the timeline
var timeline_time = -1; // current timeline time: 
    // -1 if not started, [0, _lap] if started

var timeline_step = 0; // current step of the recording

var timeline_start_time; // absolute starting time


// recording positions at steps

var path = [];

// controller

var max_acc = 0.5; // pixels maximum acceleration per update timestep

var c_speed = 0;
var c_time = -1; 
var c_y;
var c_closest_step;

var c_start_time; 
var c_then; // time of last update
var c_delta; // time elapsed per update

var push = 0; // mouse push
var push_factor = 0.05;

// some event handlers

var mouse_x;
var mouse_y = window.innerHeight/2;

document.onkeydown = function(ev){ keydown(ev); };
document.onmousemove = function(ev){ mouse_logpos(ev); };
document.onmousedown = function(ev){ mouse_push(ev); };

window.addEventListener('resize', resize_canvas, false);


resize_canvas();
animate();

function resize_canvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    draw(); 
}

function animate() {
    requestAnimationFrame(animate);
     
    now = Date.now();
    delta = now - then;
     
    if (delta > timestep) {
        // update time stuffs
         
        // Just `then = now` is not enough.
        // Lets say we set fps at 10 which means
        // each frame must take 100ms
        // Now frame executes in 16ms (60fps) so
        // the loop iterates 7 times (16*7 = 112ms) until
        // delta > timestep === true
        // Eventually this lowers down the FPS as
        // 112*10 = 1120ms (NOT 1000ms).
        // So we have to get rid of that extra 12ms
        // by subtracting delta (112) % timestep (100).
        // Hope that makes sense.
         
        then = now - (delta % timestep);

        update();
        draw();

        // update fps counter
        time_elapsed = (then - first)/1000;
        framecount++;
        real_fps = framecount/time_elapsed;

        if (framecount >= 1000) {
            first = then;
            framecount = 0;
        }
    }
}

function update() {
    timeline_update();
    control_update();
}

// -------------------
// CONTROL FUNCTIONS
// -------------------

function control_start() {
    if (timeline_time >= timeline_lap) { // only start the controller if we finished recording
        c_start_time = Date.now();
        c_time = 0; // start the control time
        c_y = path[0][1]; // first y pos in the recording
        c_closest_step = 1; // closest step in the future

        c_speed = 0;

        console.log('start control')

    }
}

function control_update() {
     if (c_time != -1) { // control is running
        c_time = Date.now() - c_start_time;

        c_delta = c_time - c_then;

        if (c_time >= timeline_lap) { // reached the end
            c_time = -1; // stop control
        } else if (c_closest_step < timeline_lap / timeline_stepsize) {

            if (push) {
                push = 0;
                console.log('pushing');

                c_speed += (mouse_y - c_y) * push_factor;

            }






            if (c_time >= path[c_closest_step][0] && (c_closest_step + 1) < path.length) { // update to next step
                
                //c_y = path[c_closest_step][1];
                c_closest_step++;
            }  

            y_desired = path[c_closest_step][1];
            time_left = path[c_closest_step][0] - c_time;

            v_desired = (y_desired - c_y)/time_left;

            //acc = (v_desired - c_speed)/time_left; // need to limit to max_acc


            //acc = 0;


            if (v_desired > c_speed + max_acc) {
                c_speed += max_acc;
            } else if (v_desired < c_speed - max_acc) {
                c_speed -= max_acc;
            } else { // we are within max_acc away from desired speed
                c_speed = v_desired;
            }


            //c_speed += acc * c_delta;

            c_y += c_speed * c_delta; //+ 0.5*acc*c_delta*c_delta;

            //console.log(c_speed);




        }



        c_then = c_time;

    }

}

// returns the optimal acceleration at time
function control_optimal(time) {


}

// returns displacement y from the next `stepnum + 1`th step in the future
//   eg.
//   stepnum = 0 : from the closest step in the future
//   stepnum = 1 : from the second closest step in the future

function control_distance_to(stepnum, time) {

}




// -------------------
// TIMELINE FUNCTIONS
// -------------------

function timeline_start() {
    timeline_start_time = Date.now();
    timeline_time = 0; // start the timeline
    timeline_step = 0;

    // reset the path recording
    path = [];

    // stop controller
    c_time = -1;

}

function timeline_update() {
    if (timeline_time != -1) { // timeline is running
        timeline_time = Date.now() - timeline_start_time;

        if (timeline_time >= timeline_lap) { // reached the end
            timeline_time = timeline_lap; // stop timeline
        } else if (timeline_time >= timeline_step * timeline_stepsize) {// record a step
            path.push([(timeline_step * timeline_stepsize), mouse_y]); // clean (time, y)
            console.log(path[timeline_step]);
            timeline_step++;
        }  

    }

}

function time_to_x(t) { // converts a timeline time t -> x coord

    x_step = canvas.width / timeline_lap; // how many pixels each ms should take on screen
    return t * x_step; // x coord of the timeline
}

// -------------------
// DRAW FUNCTIONS
// -------------------

function draw() {
   
    // Clear the 2D canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // mouse circle

    if (timeline_time < timeline_lap) {
        draw_circle(time_to_x(timeline_time), mouse_y, 30, 'green');
    }


    // draw timeline
    if (timeline_time != -1) {
        draw_timeline(timeline_time);
        draw_path();
        draw_timeline_steps(timeline_time);
    }

    // draw control
    if (c_time != -1) {
        draw_control(c_time, c_y);
    }

    draw_fps();
}




function draw_control(time, y) {
    draw_circle(time_to_x(time), y, 30, 'darkseagreen');
    draw_push(20, c_y);
    draw_speed_indicator(time_to_x(time), y, c_speed);
}

// indicator for pushing the circle around
function draw_push(x, y) {
    ctx.lineWidth = 10;

    gradient = ctx.createLinearGradient(0,0,0,canvas.height);
    
    if (y > canvas.height) {
        gradient.addColorStop("0","red");
        gradient.addColorStop("1.0","grey");
    } else if (y < 0) {
        gradient.addColorStop("0","grey");
        gradient.addColorStop("1.0","blue");
    } else {
        gradient.addColorStop("0","red");
        gradient.addColorStop((y/canvas.height).toString(),"grey");
        gradient.addColorStop("1.0","blue");
    }   
    ctx.strokeStyle = gradient;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, mouse_y);
    ctx.stroke();

}

function draw_speed_indicator(x, y, speed) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'firebrick';

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + speed * 150);
    ctx.stroke();

}

function draw_timeline(time) {

    // visual params of the line
    width = 5;
    color = 'red';

    draw_line_vert(time_to_x(time), width, color);    
}

// draw all the steps the timeline has passed over
function draw_timeline_steps(time) {
    x_max = time_to_x(time); // current x coord of the timeline, don't draw steps past this

    // visual params of the line
    width = 2;
    color = 'lightgrey';

    for (var x = 0; x <= x_max; x += timeline_stepsize * x_step) {       
        draw_line_vert(x, width, color); 
    }
}

function draw_path() {
    for (i = 0; i < path.length; i++) { // each point in the path
        x = time_to_x(path[i][0]); // x of the point
        y = path[i][1];

        //console.log('drawing', x, y);

        draw_circle(x, y, 10, 'greenyellow');

    }
}

function draw_line_vert(x, width, color) {
    ctx.lineWidth = width;
    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
}

function draw_circle(x, y, radius, color) {

    //ctx.lineWidth = 0;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function draw_fps() {

    // fps

    ctx.font = "15px Helvetica Neue";
    ctx.textAlign = "left";
    ctx.fillStyle = "firebrick";
    // ctx.fillText(parseInt(real_fps) + ' fps', 20, 30); 
    ctx.fillText(timeline_lap + ' ms length of', 20, 30); 
    ctx.fillText(timeline_stepsize + ' ms steps', 20, 60); 
    ctx.fillText('speed: ' + c_speed, 20, 90);


}

function mouse_logpos(ev) {
    //mouse_x = (event.clientX / window.innerWidth)*2-1; // NDCS coords of mouse
    //mouse_y = -(event.clientY / window.innerHeight)*2+1;
    mouse_x = event.clientX;
    mouse_y = event.clientY;
    //console.log(mouse_x, mouse_y);
}

// trigger a push
function mouse_push(ev) {
    //mouse_x = (event.clientX / window.innerWidth)*2-1; // NDCS coords of mouse
    //mouse_y = -(event.clientY / window.innerHeight)*2+1;
    if (push != 1) {
        push = 1;
    }
}

function keydown(ev) {
    if(ev.keyCode == 82) { // r records
        console.log("pressed r");
        timeline_start();
    } else if(ev.keyCode == 32) { // spacebar begins controller generation
        console.log("pressed spacebar");
        control_start();
    } else if(ev.keyCode == 37) { // left
        console.log("pressed left");
        timeline_lap -= 500;
    } else if(ev.keyCode == 39) { // right
        console.log("pressed right");
        timeline_lap += 500;
    } else if(ev.keyCode == 38) { // up
        console.log("pressed up");
        timeline_stepsize += 50;
    } else if(ev.keyCode == 40) { // down
        console.log("pressed down");
        timeline_stepsize -= 50;
    }


}