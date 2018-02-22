var textureLoader = new THREE.TextureLoader();

AFRAME.registerComponent('give-texture', {
  schema: {
    texture: {type: 'string'},
    normal: {type: 'string'}
  },
  init: function () {
    if (this.data.texture)
      this.el.components.material.material.map = textureLoader.load( this.data.texture );
    if (this.data.normal)
      this.el.components.material.material.normalMap = textureLoader.load( this.data.texture );
  }
});