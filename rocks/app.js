/// <reference types="@argonjs/argon" />
/// <reference types="three" />
/// <reference types="dat-gui" />
/// <reference types="stats" />
// set up Argon
var app = Argon.init();
// set up THREE.  Create a scene, a perspective camera and an object
// for the user's location
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera();
var userLocation = new THREE.Object3D();
scene.add(camera);
scene.add(userLocation);
// We use the standard WebGLRenderer when we only need WebGL-based content
var renderer = new THREE.WebGLRenderer({
    alpha: true,
    logarithmicDepthBuffer: true
});
// account for the pixel density of the device
renderer.setPixelRatio(window.devicePixelRatio);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.bottom = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
app.view.element.appendChild(renderer.domElement);
// to easily control stuff on the display
var hud = new THREE.CSS3DArgonHUD();
// We put some elements in the index.html, for convenience. 
// Here, we retrieve the description box and move it to the 
// the CSS3DArgonHUD hudElements[0].  We only put it in the left
// hud since we'll be hiding it in stereo
var description = document.getElementById('description');
hud.hudElements[0].appendChild(description);
app.view.element.appendChild(hud.domElement);
// let's show the rendering stats
var stats = new Stats();
hud.hudElements[0].appendChild(stats.dom);
// create a bit of animated 3D text that says "argon.js" to display 
var uniforms = {
    amplitude: { type: "f", value: 0.0 }
};
var argonTextObject = new THREE.Object3D();
argonTextObject.position.z = -0.50;
userLocation.add(argonTextObject);
var loader = new THREE.FontLoader();
loader.load('resources/fonts/helvetiker_bold.typeface.js', function (font) {
    var textGeometry = new THREE.TextGeometry("argon.js", {
        font: font,
        size: 40,
        height: 5,
        curveSegments: 3,
        bevelThickness: 2,
        bevelSize: 1,
        bevelEnabled: true
    });
    textGeometry.center();
    var tessellateModifier = new THREE.TessellateModifier(8);
    for (var i = 0; i < 6; i++) {
        tessellateModifier.modify(textGeometry);
    }
    var explodeModifier = new THREE.ExplodeModifier();
    explodeModifier.modify(textGeometry);
    var numFaces = textGeometry.faces.length;
    var bufferGeometry = new THREE.BufferGeometry().fromGeometry(textGeometry);
    var colors = new Float32Array(numFaces * 3 * 3);
    var displacement = new Float32Array(numFaces * 3 * 3);
    var color = new THREE.Color();
    for (var f = 0; f < numFaces; f++) {
        var index = 9 * f;
        var h = 0.07 + 0.1 * Math.random();
        var s = 0.5 + 0.5 * Math.random();
        var l = 0.6 + 0.4 * Math.random();
        color.setHSL(h, s, l);
        var d = 5 + 20 * (0.5 - Math.random());
        for (var i = 0; i < 3; i++) {
            colors[index + (3 * i)] = color.r;
            colors[index + (3 * i) + 1] = color.g;
            colors[index + (3 * i) + 2] = color.b;
            displacement[index + (3 * i)] = d;
            displacement[index + (3 * i) + 1] = d;
            displacement[index + (3 * i) + 2] = d;
        }
    }
    bufferGeometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    bufferGeometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 3));
    var shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: "\n            uniform float amplitude;\n            attribute vec3 customColor;\n            attribute vec3 displacement;\n            varying vec3 vNormal;\n            varying vec3 vColor;\n            void main() {\n                vNormal = normal;\n                vColor = customColor;\n                vec3 newPosition = position + normal * amplitude * displacement;\n                gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );\n            }\n        ",
        fragmentShader: "\n            varying vec3 vNormal;\n            varying vec3 vColor;\n            void main() {\n                const float ambient = 0.4;\n                vec3 light = vec3( 1.0 );\n                light = normalize( light );\n                float directional = max( dot( vNormal, light ), 0.0 );\n                gl_FragColor = vec4( ( directional + ambient ) * vColor, 1.0 );\n            }\n        "
    });
    var textMesh = new THREE.Mesh(bufferGeometry, shaderMaterial);
    argonTextObject.add(textMesh);
    argonTextObject.scale.set(0.001, 0.001, 0.001);
    // add an argon updateEvent listener to slowly change the text over time.
    // we don't have to pack all our logic into one listener.
    app.context.updateEvent.addEventListener(function () {
        uniforms.amplitude.value = 1.0 + Math.sin(Date.now() * 0.001 * 0.5);
    });
});
app.vuforia.isAvailable().then(function (available) {
    // vuforia not available on this platform
    if (!available) {
        console.warn("vuforia not available on this platform.");
        return;
    }
    // tell argon to initialize vuforia for our app, using our license information.
    app.vuforia.init({
        encryptedLicenseData: "-----BEGIN PGP MESSAGE-----Version: OpenPGP.js v2.3.2 Comment: http://openpgpjs.org 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88Di-----END PGP MESSAGE-----"}).then(function (api) {
        // the vuforia API is ready, so we can start using it.
        // tell argon to download a vuforia dataset.  The .xml and .dat file must be together
        // in the web directory, even though we just provide the .xml file url here 
        api.objectTracker.createDataSetFromURL("resources/datasets/rocks.xml").then(function (dataSetID) {
            // the data set has been succesfully downloaded
            // tell vuforia to load the dataset.  
            api.objectTracker.loadDataSet(dataSetID).then(function (trackables) {
                // when it is loaded, we retrieve a list of trackables defined in the
                // dataset and set up the content for the target
                // tell argon we want to track a specific trackable.  Each trackable
                // has a Cesium entity associated with it, and is expressed in a 
                // coordinate frame relative to the camera.  Because they are Cesium
                // entities, we can ask for their pose in any coordinate frame we know
                // about.
                app.entity.subscribe(trackables["rock"].id).then(function (rockEntity) {
                    // the updateEvent is called each time the 3D world should be
                    // rendered, before the renderEvent.  The state of your application
                    // should be updated here.
                    app.context.updateEvent.addEventListener(function () {
                        // get the pose (in local coordinates) of the rock target
                        var rockPose = app.context.getEntityPose(rockEntity);
                        // if the pose is known the target is visible, so set the
                        // THREE object to the location and orientation
                        if (rockPose.poseStatus & Argon.PoseStatus.KNOWN) {
                            rockObject.position.copy(rockPose.position);
                            rockObject.quaternion.copy(rockPose.orientation);
                        }
                        // when the target is first seen after not being seen, the 
                        // status is FOUND.  Here, we move the 3D text object from the
                        // world to the target.
                        // when the target is first lost after being seen, the status 
                        // is LOST.  Here, we move the 3D text object back to the world
                        if (rockPose.poseStatus & Argon.PoseStatus.FOUND) {
                            rockObject.add(argonTextObject);
                            argonTextObject.position.z = 0;
                        }
                        else if (rockPose.poseStatus & Argon.PoseStatus.LOST) {
                            argonTextObject.position.z = -0.50;
                            userLocation.add(argonTextObject);
                        }
                    });
                });
                // create a THREE object to put on the trackable
                var rockObject = new THREE.Object3D;
                scene.add(rockObject);
            }).then(function () { return api.objectTracker.activateDataSet(dataSetID); })["catch"](function (err) {
                console.log("could not load dataset: " + err.message);
            });
            // activate the dataset.
        });
    })["catch"](function (err) {
        console.log("vuforia failed to initialize: " + err.message);
    });
});
// the updateEvent is called each time the 3D world should be
// rendered, before the renderEvent.  The state of your application
// should be updated here.
app.context.updateEvent.addEventListener(function () {
    // get the position and orientation (the "pose") of the user
    // in the local coordinate frame.
    var userPose = app.context.getEntityPose(app.context.user);
    // assuming we know the user pose, set the position of our 
    // THREE user object to match it
    if (userPose.poseStatus & Argon.PoseStatus.KNOWN) {
        userLocation.position.copy(userPose.position);
    }
});
// renderEvent is fired whenever argon wants the app to update its display
app.renderEvent.addEventListener(function () {
    // update the rendering stats
    stats.update();
    // get the subviews for the current frame
    var subviews = app.view.subviews;
    // if we have 1 subView, we're in mono mode.  If more, stereo.
    var monoMode = subviews.length == 1;
    // set the renderer to know the current size of the viewport.
    // This is the full size of the viewport, which would include
    // both views if we are in stereo viewing mode
    var view = app.view;
    renderer.setSize(view.renderWidth, view.renderHeight, false);
    renderer.setPixelRatio(app.suggestedPixelRatio);
    var viewport = view.viewport;
    hud.setSize(viewport.width, viewport.height);
    // there is 1 subview in monocular mode, 2 in stereo mode    
    for (var _i = 0, subviews_1 = subviews; _i < subviews_1.length; _i++) {
        var subview = subviews_1[_i];
        // set the position and orientation of the camera for 
        // this subview
        camera.position.copy(subview.pose.position);
        camera.quaternion.copy(subview.pose.orientation);
        // the underlying system provide a full projection matrix
        // for the camera. 
        camera.projectionMatrix.fromArray(subview.frustum.projectionMatrix);
        // set the viewport for this view
        var _a = subview.renderViewport, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        renderer.setViewport(x, y, width, height);
        // set the webGL rendering parameters and render this view
        renderer.setScissor(x, y, width, height);
        renderer.setScissorTest(true);
        renderer.render(scene, camera);
        // adjust the hud, but only in mono
        if (monoMode) {
            var _b = subview.viewport, x = _b.x, y = _b.y, width = _b.width, height = _b.height;
            hud.setViewport(x, y, width, height, subview.index);
            hud.render(subview.index);
        }
    }
});
