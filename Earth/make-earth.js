var textureLoader = new THREE.TextureLoader();

AFRAME.registerComponent('make-earth', {
  schema: {
  },
  init: function () {
    console.log(this.el.children[0].children[0])
    var geometry = new THREE.SphereGeometry(0.5, 32, 32);
    var material = new THREE.MeshPhongMaterial();
    material.map = new THREE.TextureLoader().load('https://cdn.glitch.com/967f5ae5-2d26-4347-bc20-2c6e91e234ed%2Fearthmap1k.jpg?1510721889257');
    material.bumpMap = new THREE.TextureLoader().load('https://cdn.glitch.com/967f5ae5-2d26-4347-bc20-2c6e91e234ed%2Fearthbump1k.jpg?1510721887499');
    material.bumpScale = 0.05;
    material.specularMap = new THREE.TextureLoader().load('https://cdn.glitch.com/967f5ae5-2d26-4347-bc20-2c6e91e234ed%2Fearthspec1k.jpg?1510721887500')
    material.specular  = new THREE.Color('grey')
    var earthMesh = new THREE.Mesh(geometry, material)

    this.el.children[0].children[0].setObject3D("Earth", earthMesh);
  }
});
