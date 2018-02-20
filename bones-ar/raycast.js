AFRAME.registerComponent('raycast-view', {
  init: function () {
    var object;
    var textScene = this.el.sceneEl.children.text;
    this.el.addEventListener('raycaster-intersected', function (evt) {
      object = evt.detail.intersection.object;
      
      console.log(object.name)
      
      object.material.color.setHex( 0xffff00 );

    });

    this.el.addEventListener('raycaster-intersected-cleared', function (evt) {
      textScene.removeObject3D(object.name)
      object.material.color.setHex( 0xff0000 );
    });
  }
});