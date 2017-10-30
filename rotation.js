var y = 0;
var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0
};

AFRAME.registerComponent("rotate", {
      schema : 
      {
        type: 'string'
      },
  
      
      tick : function()
      {	
      	this.sceneEl.renderer.domElement.on('mousedown', function(e) {
		    isDragging = true;
		})
		.on('mousemove', function(e) {
		    //console.log(e);
		    var deltaMove = {
		        x: e.offsetX-previousMousePosition.x,
		        y: e.offsetY-previousMousePosition.y
		    };

		    if(isDragging) {
		            
		        var deltaRotationQuaternion = new three.Quaternion()
		            .setFromEuler(new three.Euler(
		                toRadians(deltaMove.y * 1),
		                toRadians(deltaMove.x * 1),
		                0,
		                'XYZ'
		            ));
		        
		        this.el.object3D.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.el.object3D.quaternion);
		    }
		    
		    previousMousePosition = {
		        x: e.offsetX,
		        y: e.offsetY
		    };
		});
		/* */

		document.on('mouseup', function(e) {
		    isDragging = false;
		});
      }
        
});





// function projectOnTrackball(touchX, touchY)
// {
// 	var mouseOnBall = new THREE.Vector3();

// 	mouseOnBall.set(
// 		clamp(touchX / windowHalfX, -1, 1), clamp(-touchY / windowHalfY, -1, 1),
// 		0.0
// 	);

// 	var length = mouseOnBall.length();

// 	if (length > 1.0)
// 	{
// 		mouseOnBall.normalize();
// 	}
// 	else
// 	{
// 		mouseOnBall.z = Math.sqrt(1.0 - length * length);
// 	}

// 	return mouseOnBall;
// }

// function rotateMatrix(rotateStart, rotateEnd)
// {
// 	var axis = new THREE.Vector3(),
// 		quaternion = new THREE.Quaternion();

// 	var angle = Math.acos(rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length());

// 	if (angle)
// 	{
// 		axis.crossVectors(rotateStart, rotateEnd).normalize();
// 		angle *= rotationSpeed;
// 		quaternion.setFromAxisAngle(axis, angle);
// 	}
// 	return quaternion;
// }

// function clamp(value, min, max)
// {
// 	return Math.min(Math.max(value, min), max);
// }

// function update()
// {
// var v = 1 + ((scaleslider.value - 50) / 100);
// //console.log(v);
// root.scale.x = v;
// root.scale.y = v;
// root.scale.z = v;

// //info.innerHTML = infotext + "  " + deltaX + "  " + deltaY;
// 	requestAnimationFrame(update);
// 	render();
// }

// function render()
// { 

// 	if (!mouseDown)
// 	{
// 		var drag = 0.95;
// 		var minDelta = 0.05;

// 		if (deltaX < -minDelta || deltaX > minDelta)
// 		{
// 			deltaX *= drag;
// 		}
// 		else
// 		{
// 			deltaX = 0;
// 		}

// 		if (deltaY < -minDelta || deltaY > minDelta)
// 		{
// 			deltaY *= drag;
// 		}
// 		else
// 		{
// 			deltaY = 0;
// 		}

// 		handleRotation();
// 	}

// 	renderer.render(scene, camera);
// }

// var handleRotation = function()
// {
// if(!cube) return;
// 	rotateEndPoint = projectOnTrackball(deltaX, deltaY);

// 	var rotateQuaternion = rotateMatrix(rotateStartPoint, rotateEndPoint);
// 	curQuaternion = cube.quaternion;
// 	curQuaternion.multiplyQuaternions(rotateQuaternion, curQuaternion);
// 	curQuaternion.normalize();
// 	cube.setRotationFromQuaternion(curQuaternion);

// 	rotateEndPoint = rotateStartPoint;
// };

// // PUBLIC INTERFACE
// return {
// 	init: function()
// 	{
// 		setup();
// 	}
// };