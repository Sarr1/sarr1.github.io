////////////////////////////
////      GLOBALS       ////
////////////////////////////

var mouseDown = false;
var rotateStartPoint = new THREE.Vector3(0, 1, 0);
var rotateEndPoint = new THREE.Vector3(0, 1, 0);
var mainObj;
var curQuaternion;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var rotationSpeed = 2;
var lastMoveTimestamp,
  moveReleaseTimeDelta = 50;

var startPoint = {
  x: 0,
  y: 0
};

var deltaX = 0,
  deltaY = 0;

////////////////////////////
//// ROTATION COMPONENT ////
////////////////////////////
AFRAME.registerComponent('drag-rotate-component',{
  schema : { speed : {default:1}},
  init : function() {
    console.log(this.el.object3D)
    mainObj = this.el.object3D;
    document.addEventListener('mousedown', this.OnDocumentMouseDown.bind(this), false);
    document.addEventListener('touchstart', this.OnDocumentMouseDown.bind(this), false);
  },
  OnDocumentMouseDown : function(event) {

    event.preventDefault();
    document.addEventListener('mousemove', this.OnDocumentMouseMove.bind(this), false);
    document.addEventListener('mouseup', this.OnDocumentMouseUp.bind(this), false);
    document.addEventListener('touchmove', this.OnDocumentMouseMove.bind(this), false);
    document.addEventListener('touchend', this.OnDocumentMouseUp.bind(this), false);

    mouseDown = true;

    startPoint = {
      x: getClientX(event),
      y: getClientY(event)
    };

    rotateStartPoint = rotateEndPoint = projectOnTrackball(0, 0);
  },
  OnDocumentMouseUp : function(event) {
    if (new Date().getTime() - lastMoveTimestamp.getTime() > moveReleaseTimeDelta)
    {
      deltaX = getClientX(event) - startPoint.x;
      deltaY = getClientY(event) - startPoint.y;
    }

    mouseDown = false;

    document.removeEventListener('mousemove', this.OnDocumentMouseMove, false);
    document.removeEventListener('mouseup', this.OonDocumentMouseUp, false);
    document.removeEventListener('touchmove', this.OnDocumentMouseMove, false);
    document.removeEventListener('touchend', this.OnDocumentMouseUp, false);
  },
  OnDocumentMouseMove : function(event)
  {
    if (mouseDown) {
      deltaX = getClientX(event) - startPoint.x;
      deltaY = getClientY(event) - startPoint.y;

      handleRotation();

      startPoint.x = getClientX(event);
      startPoint.y = getClientY(event); 

      lastMoveTimestamp = new Date();
    }
  } 
});
 
////////////////////////////
////  ROTATION HELPERS  ////
////////////////////////////
var handleRotation = function()
{
  if(!mainObj) return;
  rotateEndPoint = projectOnTrackball(deltaX, deltaY);

  var rotateQuaternion = rotateMatrix(rotateStartPoint, rotateEndPoint);
  curQuaternion = mainObj.quaternion;
  curQuaternion.multiplyQuaternions(rotateQuaternion, curQuaternion);
  curQuaternion.normalize();
  mainObj.setRotationFromQuaternion(curQuaternion);

  rotateEndPoint = rotateStartPoint;
};

function clamp(value, min, max)
{
  return Math.min(Math.max(value, min), max);
}

function projectOnTrackball(touchX, touchY)
{
  var mouseOnBall = new THREE.Vector3();

  mouseOnBall.set(
    clamp(touchX / windowHalfX, -1, 1),
    0.0,
    clamp(touchY / windowHalfY, -1, 1)
  );

  var length = mouseOnBall.length();

  if (length > 1.0)
  {
    mouseOnBall.normalize();
  }
  else
  {
    mouseOnBall.y = Math.sqrt(1.0 - length * length);
  }

  return mouseOnBall;
}

function rotateMatrix(rotateStart, rotateEnd)
{
  var axis = new THREE.Vector3(),
    quaternion = new THREE.Quaternion();

  var angle = Math.acos(rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length());

  if (angle)
  {
    axis.crossVectors(rotateStart, rotateEnd).normalize();
    angle *= rotationSpeed;
    quaternion.setFromAxisAngle(axis, angle);
  }
  return quaternion;
}

function getClientX(event){
    switch(event.type){
        case "mousedown":
        case "mouseup":
        case "mousemove":
            return event.clientX;

        case "touchstart":
        case "touchend":
        case "touchmove":
            return event.touches[0].clientX;
    }
}

function getClientY(event){
    switch(event.type){
        case "mousedown":
        case "mouseup":
        case "mousemove":
            return event.clientY;

        case "touchstart":
        case "touchend":
        case "touchmove":
            return event.touches[0].clientY;
        default: 
            return 0;
    }
}

