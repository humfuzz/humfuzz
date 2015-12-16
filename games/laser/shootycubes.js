//AMON GE
//
//Evil cubes have taken over the skies of UBC!
//Destroy them before it's too late!
//
//(let the sound load, speakers on)

  var scene = new THREE.Scene();
  var objects = new THREE.Object3D();
  var lines = new THREE.Object3D();
  var balls = new THREE.Object3D();
 
  lines.frustumCulled = false;

    // SETUP RENDERER

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0xffffff );                // white background colour
  document.body.appendChild( renderer.domElement );  // add to document canvas 

   // SETUP CAMERA

  var aspect = window.innerWidth/window.innerHeight;
  camera = new THREE.PerspectiveCamera( 30, aspect, 0.1, 10000);   // view angle, aspect ratio, near, far
  camera.position.set(10,15,40);
  camera.lookAt(scene.position);	
  scene.add(camera);

  // SETUP PROJECTOR 

  var projector = new THREE.Projector(); // add projector for raycasting

  // SETUP AUDIO LISTENER + PRELOAD SOUNDS
  var listener = new THREE.AudioListener();
        camera.add( listener );

  
  // ERIC SKIFF: "Come and Find Me" from Resistor Anthems
  // available under Creative Commons Attribution License
  //    http://ericskiff.com/music/
  var bg_music = new THREE.Audio( listener );
  bg_music.load( 'sounds/bg.mp3' ); 
  bg_music.setRefDistance( 100 ); 
  bg_music.setLoop(true); // loop that shit


    // DEFINE UNIT CUBE -- to be reused several times

  var unitCubeGeometry = new THREE.BoxGeometry( 1,1,1 );   

  var originBox = new THREE.Object3D;
  scene.add( originBox );
  
    // TEXT:

  var level = 1;
  level_text_g = new THREE.TextGeometry("LEVEL " + level.toString(),
    {
      size: 2,
      height: 1
    });

  level_text_m = new THREE.MeshPhongMaterial( { 
     ambient: 0x442200, color: 0x883322, specular: 0x404040, shininess: 40.0, shading: THREE.SmoothShading});
  level_text = new THREE.Mesh(level_text_g, level_text_m);


  level_text.position.set(0,0,0);
  scene.add(level_text);




  



  
      // LIGHTS:  needed for phong illumination model
      // The following will be used by (1) three.js; and (2) your own shaders, passed via uniforms

  lightColor = new THREE.Color(1,1,1);
  ambientColor = new THREE.Color(1,1,1);
  lightPosition = new THREE.Vector3(-70,100,70);

/////////////////////////// THREE.JS ILLUMINATION ////////////////////////////

    // LIGHT SOURCES

  var light = new THREE.PointLight(lightColor.getHex());
  light.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
  scene.add(light);
  var ambientLight = new THREE.AmbientLight(ambientColor.getHex());
  scene.add(ambientLight);

    // DEFAULT PHONG MATERIAL  (used by the car + statue)

  var defaultPhongMaterial = new THREE.MeshPhongMaterial( { 
       ambient: 0x004000, color: 0x008000, specular: 0x404040, shininess: 40.0});


    // ENVIRONMENT SPHERE
    // AERIAL SPHERICAL PANORAMA OF UBC FROM 
    // http://davidashcroft.wordpress.com/2010/04/19/aerial-panos/


  var environmentSphereGeometry = new THREE.SphereGeometry( 50, 32, 32 );
  var environmentSphereMaterial = new THREE.MeshBasicMaterial( { 
       map: THREE.ImageUtils.loadTexture('images/ubcpano.jpg')});
  var environmentSphere = new THREE.Mesh( environmentSphereGeometry, environmentSphereMaterial );
  scene.add( environmentSphere );            // add to scene
  environmentSphere.position.set(0,0,0);    // reposition it where we want
  environmentSphere.parent = originBox;      // make it a child of the rotating checkerboard
  environmentSphere.scale.x = -1; // make it inside out

  function generate_level(n, min_s, max_s, max_v, max_rv, cam_s) {

    camera_speed = cam_s;

    for (i = 0; i < n; i++) {
      var size = rand_range(min_s,max_s);
      var v_x = rand_range(-max_v, max_v);
      var v_y = rand_range(-max_v, max_v);
      var v_z = rand_range(-max_v, max_v);

      var rv_x = rand_range(-max_rv, max_rv);
      var rv_y = rand_range(-max_rv, max_rv);
      var rv_z = rand_range(-max_rv, max_rv);

      var c = rand_range(0x000000, 0xFFFFFF);
      var c_a = rand_range(0x000000, 0xFFFFFF);

      var ball_m_array = [];
      ball_m_array.push( new THREE.MeshPhongMaterial( { 
           ambient: c_a, color: 0xff3333, specular: 0x008000, shininess: 40.0, shading: THREE.SmoothShading}));  // red
      ball_m_array.push( new THREE.MeshPhongMaterial( { 
           ambient: c_a, color: 0xff8800, specular: 0x008000, shininess: 40.0, shading: THREE.SmoothShading}));  // orange
      ball_m_array.push( new THREE.MeshPhongMaterial( { 
           ambient: c_a, color: 0xffff33, specular: 0x008000, shininess: 40.0, shading: THREE.SmoothShading}));  // yellow
      ball_m_array.push( new THREE.MeshPhongMaterial( { 
           ambient: c_a, color: 0x33ff33, specular: 0x008000, shininess: 40.0, shading: THREE.SmoothShading}));  // green
      ball_m_array.push( new THREE.MeshPhongMaterial( { 
           ambient: c_a, color: 0x3333ff, specular: 0x008000, shininess: 40.0, shading: THREE.SmoothShading}));  // blue
      ball_m_array.push( new THREE.MeshPhongMaterial( { 
           ambient: c_a, color: 0x8833ff, specular: 0x008000, shininess: 40.0, shading: THREE.SmoothShading}));  // purple
      var ball_m = new THREE.MeshFaceMaterial( ball_m_array );
      var ball_g = new THREE.BoxGeometry( size, size, size);             // cube dimensions
      ball = new THREE.Mesh( ball_g, ball_m );
      ball.position.set(rand_range(-10, 10),
                        rand_range(0, 10),
                        rand_range(-10, 10)); 

      var twopi = 2 * Math.PI;

      ball.rotation.set(Math.random() * twopi, Math.random() * twopi, Math.random() * twopi);

      ball.parent = originBox;      // make it a child of the rotating checkerboard
      balls.add( ball );

      var ball_v = new THREE.Vector3(v_x,v_y,v_z);    // position velocity
      //balls_v.push(ball_v);
      
      var ball_rv = new THREE.Vector3(rv_x, rv_y, rv_z); //rotation velocity
      //balls_rv.push(ball_rv);

      ball.userData = {v: ball_v, rv: ball_rv}; // store the velocity inside the ball object

    }
  }

  
  function rand_range(min, max) {
    return Math.random() * (max - min) + min;
  }

  scene.add(objects);  
  scene.add(lines);  
  scene.add(balls);

  //////////////////////////// TIME TO DO FUN GAME THINGS /////////////////////////

  var camera_theta = 0.93;
  var camera_radius = 41;
  var mouse_x = 0;
  var mouse_y = 0;

  // level specific vars
  var num_balls = 5;
  var min_size = 3;
  var max_size = 5;
  var max_velocity = 0.16;
  var max_rvelocity = 0.03;
  var camera_speed = 0.003;// = 0.007;

  // difficulty ramp
  var num_balls_diff_add = 1; // add to num balls
  var size_diff = 0.92; // the rest of vars get multiplied by these factors
  var velocity_diff = 1.07;
  var rvelocity_diff = 1.2;
  var camera_speed_diff = 1.3;// = 0.007;


  document.onmousedown = function(ev){ mousedown(ev); };

  generate_level(num_balls, min_size, max_size, max_velocity, max_rvelocity, camera_speed); 

  //generate_level(10, 1, 3, 0.16, 0.03, 0.007); //num_balls, min_size, max_size, max_v, max_rv, cam_speed


    // SETUP RENDER CALL-BACK

  var render = function () {
    
    requestAnimationFrame( render );
    //originBox.rotation.y += 0.012 * turn_camera;

    camera_theta += camera_speed; //* turn_camera;

    camera.position.x = camera_radius * Math.cos(camera_theta);
    camera.position.z = camera_radius * Math.sin(camera_theta);
    camera.lookAt(originBox.position);
    //camera.position.set(10,15,40);

    //console.log(camera_theta);

    move_balls();
    fade_lines();
    check_win();

    renderer.render(scene, camera);
  };

  render();


  function move_balls() {

    for (i = 0; i < balls.children.length; i++) {
      var b = balls.children[i];
      var b_v = b.userData.v;
      var b_rv = b.userData.rv;

      //var b_v = balls_v[i];
      //var b_rv = balls_rv[i];

      //console.log(b.position);
      //console.log(b.position.x, b.position.y, b.position.z, b_v);
      b.position.add(b_v);

      b.rotation.set(b.rotation.x + b_rv.x, 
                      b.rotation.y + b_rv.y, 
                      b.rotation.z + b_rv.z);

      check_bounce(b.position, b_v);
    }
  }

  function check_bounce(b_p, b_v) {
    console.log(b_p);
    if (b_p.x > 10 || b_p.x < -10) {
        //console.log("flip x");
        b_v.x *= -1;
      }

    if (b_p.y > 10 || b_p.y < -10) {
        //console.log("flip y");
        b_v.y *= -1;
      }

    if (b_p.z > 10 || b_p.z < -10) {
        //console.log("flip z");
        b_v.z *= -1;
      }
  }

  function fade_lines() {
    for (i = 0; i < lines.children.length; i++) {
      var line = lines.children[i];
      var t = line.userData.t;

      line.userData.t -= 0.01;
      line.material.color.multiplyScalar(0.99);

      if (t <= 0) 
        lines.remove(line);


    }
  }

  function check_win() { // if there are no more balls, we've won. generate a harder level.
    if (balls.children.length == 0) {
      level++;

      scene.remove(level_text);

      level_text_g = new THREE.TextGeometry("LEVEL " + level.toString(),
        {
          size: 2,
          height: 1
        });

      level_text_m = new THREE.MeshPhongMaterial( { 
         ambient: 0x442200, color: 0x883322, specular: 0x404040, shininess: 40.0, shading: THREE.SmoothShading});
      level_text = new THREE.Mesh(level_text_g, level_text_m);


      level_text.position.set(0,0,0);
      scene.add(level_text);

      // RAMP IT UP 
      num_balls += num_balls_diff_add;
      min_size *= size_diff;
      max_size *= size_diff;
      max_velocity *= velocity_diff;
      max_rvelocity *= rvelocity_diff;
      camera_speed *= camera_speed_diff;

      // generate new level
      generate_level(num_balls, min_size, max_size, max_velocity, max_rvelocity, camera_speed); 
    }
  }

function mousedown(ev) {
  mouse_x = (event.clientX / window.innerWidth)*2-1; // NDCS coords of mouse
  mouse_y = -(event.clientY / window.innerHeight)*2+1;
  fire(mouse_x, mouse_y);
}


function fire(x, y) {
  var fire_vector = new THREE.Vector3( x, y, 0.5 );
  var caster = projector.pickingRay(fire_vector.clone(), camera);
  var intersects = caster.intersectObjects( balls.children, true );

  if (intersects.length > 0) { // hit something!

    var line_material = new THREE.LineBasicMaterial({
      color: 0xffffff
    });

    var line_geometry = new THREE.Geometry(); // draw a line of the fired beam
    
    line_geometry.vertices.push(new THREE.Vector3(camera.position.x,
                                                  camera.position.y - 5,
                                                  camera.position.z - 5));
    line_geometry.vertices.push(intersects[0].point);

    var line = new THREE.Line(line_geometry, line_material);
    line.userData = {t: 1} // lifetime [1, 0]

    lines.add(line);
    line.parent = originBox;

    // play blip sound, made using BFXR: http://www.bfxr.net/

    var sound1 = new THREE.Audio( listener );
    sound1.load( 'sounds/b.wav' );
    sound1.setRefDistance( 20 );
    intersects[0].object.add( sound1 );

    // remove ball hit
    balls.remove(intersects[0].object);

  }

}
