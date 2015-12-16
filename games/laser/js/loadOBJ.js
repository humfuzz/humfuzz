  function loadOBJ(file, scaleFactor, xOff, yOff, zOff, xRot, yRot, zRot) {
				var manager = new THREE.LoadingManager();
				manager.onProgress = function ( item, loaded, total ) {
					console.log( item, loaded, total );
				};
				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};

				var onError = function ( xhr ) {
				};
				var loader = new THREE.OBJLoader( manager );
//				loader.load( '/Users/van/threejs-all/three.js/examples/obj/male02/minicooper.obj', function ( object ) {
loader.load(file, function( object ) {
//				loader.load( '/Users/van/threejs-all/three.js/examples/obj/male02/male02.obj', function ( object ) {
//				loader.load( 'obj/male02/bunnyLowRes.obj', function ( object ) {
					object.traverse( function ( child ) {
						if ( child instanceof THREE.Mesh ) {
//							child.material.map = texture;
							child.material = defaultPhongMaterial;
						}
					} );
//					object.scale.set(0.05,0.05,0.05);
					object.position.set(xOff,yOff,zOff);
					object.rotation.x= xRot;
					object.rotation.y = yRot;
					object.rotation.z = zRot;
					object.scale.set(scaleFactor,scaleFactor,scaleFactor);
					scene.add( object );
				        object.parent = originBox;
				        object.material = defaultPhongMaterial;
				}, onProgress, onError );
}

