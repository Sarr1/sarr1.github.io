window.log = function()
{
	if (this.console)
	{
		console.log(Array.prototype.slice.call(arguments));
	}
};

var wellDone = document.getElementById("wellDone");
var tryAgainMsg = document.getElementById("tryAgainMsg");
var ANSSemi = document.getElementById("ANSSemi");
var ANSOss = document.getElementById("ANSOss");

var instructionsBox = document.getElementById("instruction");
var instructionButton = document.getElementById("instructionButton");
var instructionText = document.getElementById("instructionText");

instructionButton.style.display = 'none';
tryAgainMsg.style.display = 'none';
ANSSemi.style.display = 'none';
ANSOss.style.display = 'none';
wellDone.style.display = "none";


function getWrongAnsMsg(retry){
  //console.log(object);
  var r = retry + 1;
  var wrongAnsMsg = "Wrong answer. Try again (" + r + ").";
  return wrongAnsMsg;
}

function getRightAnsMsg(object){
  var msg = "Correct answer is: " + object.name ;
  return msg;
}

function setInstructionText(text){
  instructionText.innerHTML = text;
}

function showAnswer(name){
  tryAgainMsg.value = "Correct answer is: " + name ;
  tryAgainMsg.style.display = 'block';
  tryAgainMsg.style.color = "green";
}

function toggleTryAgainMsg(flag, retry){
  var t = getWrongAnsMsg(retry);
  tryAgainMsg.value = t;
  tryAgainMsg.style.color = "red";
  if(flag){
    tryAgainMsg.style.display = 'block';
  }else{
    tryAgainMsg.style.display = 'none';
  }
}

function hideInstructions(){
  //console.log("instructionClicked");
  if(instructionsBox.style.display != "none"){
      instructionsBox.style.display = 'none';
  }
  
  if(instructionButton.style.display != "block"){
      instructionButton.style.display = 'block';
  }
}

function showInstructions(){
  if(instructionButton.style.display != "none"){
      instructionButton.style.display = 'none';
  }
  if(instructionsBox.style.display != "block"){
      instructionsBox.style.display = 'block';
  }
  
  //console.log("show instrucitons");
}
var quizCompleteText = "Quiz completed! Good job.";
var wellDoneText = "Well done! On to the next stage.";

var inputclick = false;
function inputclicked(){
  console.log("input clicked");
  inputclick = true;
}
var stageComplete = false;
// Namespace
var Defmech = Defmech ||
{};

Defmech.RotationWithQuaternion = (function()
{
	'use_strict';

	var container;

	var camera, scene, scene2, css3div, element, renderer, renderer2;

	var cube, plane;

	var mouseDown = false;
	var rotateStartPoint = new THREE.Vector3(0, 0, 1);
	var rotateEndPoint = new THREE.Vector3(0, 0, 1);

	var curQuaternion;
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	var rotationSpeed = 2;
	var lastMoveTimestamp,
		moveReleaseTimeDelta = 50;

	var startPoint = new THREE.Vector2();

	var deltaX = 0,
		deltaY = 0;
  
  var infotext = 'Drag to rotate';
  var info;
  
  var scaleslider = document.getElementById("scaleslider");
  var root = new THREE.Object3D;
  root.position.x = -0.3;
  var stage = 4;
  var S1TextBox = [];
  var S1Points = [];
  var S1Lines = [];
  
  var S2TextBox = [];
  var S2Points = [];
  var S2Lines = [];
  
  var S3TextBox = [];
  var S3Points = [];
  var S3Lines = [];
  var S3bPoints = [];
  var S3bLines = [];
  
  var S4TextBox = [];
  var S4Points = [];
  var S4Lines = [];

  var pointColor = {r: 0.5, g: 0.8, b:0.1};
  var pointSelectedColor = {r: 0.3, g: 0.3, b:0.8};
  var pointAnsweredColor = {r: 0.4, g: 0.4, b:0.4};
  
  var raycaster = new THREE.Raycaster();
  var points = [];
  var lines = [];
  var objects = [];
  
	var setup = function()
	{
		container = document.createElement('div');
		document.body.appendChild(container);

		// info = document.createElement('div');
		// info.style.position = 'absolute';
		// info.style.top = '10px';
		// info.style.width = '100%';
		// info.style.textAlign = 'center';
		// info.innerHTML = 'Adjust Scale';
		// container.appendChild(info);

		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);

		scene = new THREE.Scene();
    scene.add(camera);
    
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
    
    scene.add(directionalLight);
    var ambientlight = new THREE.AmbientLight(0xBBBBBB); // soft white ambient light
    scene.add(ambientlight);
    
    
    //===============================================================================
    // Interact points
    //===============================================================================
    
    function InteractionPoint(name, pos, section)
    {

      var pointgeom = new THREE.SphereGeometry(0.2, 0.2, 0.2);
      var point = new THREE.Mesh(pointgeom);
      point.name = name;
      point.retry = 2;
      point.input = "";
      point.description = "";
      point.section = section;
      point.isAnswered = false;
      point.isController = true;
      point.c_type = "InteractionPoint";
      point.position.x = pos.x;
      point.position.y = pos.y;
      point.position.z = pos.z;
      point.material.color = pointColor;
      
      //console.log(point.material.color);
      return point;
    }

    function CreateLine(name, from, to) 
    {
      var lineGeo = new THREE.Geometry();
      lineGeo.vertices.push(from);
      lineGeo.vertices.push(to);
      //create a blue LineBasicMaterial
      var linemat = new THREE.LineBasicMaterial({ color: 0x3030FF });
      var line = new THREE.Line(lineGeo, linemat);
      line.name = name;
      return line;
    }
    
    points = [
      InteractionPoint("Pinna", {x:4, y:1.8, z:1}, "outer"), //positioned correctly
      InteractionPoint("Auditory Canal", {x:2.2, y:1.2, z:1.5}, "outer"), //positioned correctly
      InteractionPoint("Eustachian Tube", {x:-2.8, y:0.7, z:1.2}, "middle"), //positioned correctly
      InteractionPoint("Tympanic Membrane", {x:0.5, y:1.4, z:1}, "middle"), //positioned correctly
      InteractionPoint("Cochlea", {x:-2, y:4, z:0}, "inner"), //positioned correctly
      InteractionPoint("Semicircular Canals", {x:-0.6, y:5, z:-0.2}, "inner"), //positioned correctly
      InteractionPoint("Malleus", {x:1, y:5, z:2}, "middle"), //positioned correctly
      InteractionPoint("Incus", {x:-1, y:5, z:2}, "middle"), //positioned correctly
      InteractionPoint("Stapes", {x:-2, y:5, z:2}, "middle"), //positioned correctly
      InteractionPoint("Auditory Nerve", {x:-2, y:4, z:-2}, "inner"),
      InteractionPoint("Ossicles", {x:-1, y:5, z:2}, "middle")
    ];

    
    lines = [
      new CreateLine("Tympanic Membrane", new THREE.Vector3(0.5, 1.4, 1), new THREE.Vector3(-0.9, 1.5, 0.8)), //positioned correctly Tympanic membrane
      new CreateLine("Cochlea", new THREE.Vector3(-2, 4, 0), new THREE.Vector3(-2, 2, 0.2)), //positioned correctly Cochlea
      new CreateLine("Semicircular Canals", new THREE.Vector3(-0.6, 5, -0.2), new THREE.Vector3(-1.1, 3.4, -0.2)), //positioned correctly Semicircular canals
      new CreateLine("Semicircular Canals", new THREE.Vector3(-0.6, 5, -0.2), new THREE.Vector3(-0.15, 2.4, -0.4)), //positioned correctly Semicircular canals
      new CreateLine("Semicircular Canals", new THREE.Vector3(-0.6, 5, -0.2), new THREE.Vector3(-0.7, 2.95, -1)), //positioned correctly Semicircular canals  
      new CreateLine("Malleus", new THREE.Vector3(1, 5, 2), new THREE.Vector3(-0.35, 2.2, 0.65)), //positioned correctly Malleus
      new CreateLine("Incus", new THREE.Vector3(-1, 5, 2), new THREE.Vector3(-0.5, 2, 0.38)), //positioned correctly Incus
      new CreateLine("Stapes", new THREE.Vector3(-2, 5, 2), new THREE.Vector3(-0.9, 2, 0.3)), //positioned correctly Stapes
      new CreateLine("Auditory Nerve", new THREE.Vector3(-2, 4, -2), new THREE.Vector3(-2.2, 2, -0.6)), //positioned correctly Auditory Nerve
      new CreateLine("Ossicles", new THREE.Vector3(-1, 5, 2), new THREE.Vector3(-0.35, 2.2, 0.65)), //positioned correctly Malleus
      new CreateLine("Ossicles", new THREE.Vector3(-1, 5, 2), new THREE.Vector3(-0.5, 2, 0.38)), //positioned correctly Incus
      new CreateLine("Ossicles", new THREE.Vector3(-1, 5, 2), new THREE.Vector3(-0.9, 2, 0.3)) //positioned correctly Stapes    
    ];
    
    
    //===============================================================================
    // GUI
    //===============================================================================
    
    function IDBox(object, text) {
      text.style.display = "none";
      text.onchange = function()
      {
        
        //box logic for stage 1
        if (stage == 1) {
          object.input = text.value;
          if ((object.input).toLowerCase().replace(/ /g,'') == (object.name).toLowerCase().replace(/ /g,'')) {
            object.isAnswered = true;
            if (CheckAnswers(S1Points)) {
              stage = 2;
              ResetAnswers();
              stageComplete = true;
              wellDone.innerHTML = wellDoneText;
              wellDone.style.display = "block";
              //SetUpStage(S2Points, S2Lines);
              toggleTryAgainMsg(false, 2);
              HideAllText(S1TextBox);
            } 
            text.style.backgroundColor = "green";
          } else {
            object.isAnswered = false;
            text.style.backgroundColor = "red";
            if(object.retry > 0){
              object.retry -= 1;
              toggleTryAgainMsg(true, object.retry);
            }else{
              showAnswer(object.name);
            }
            console.log(object.retry);
          }
        }
        
        //box logic for stage 2
        if (stage == 2) {
          if (text.id == "SemiI") {
            object.input = text.value;
            if ((object.input).toLowerCase().replace(/ /g,'') == (object.name).toLowerCase().replace(/ /g,'')) {
                text.style.backgroundColor = "green";
            } else {
                text.style.backgroundColor = "red";

                if(object.retry > 0){
                  object.retry -= 1;
                  toggleTryAgainMsg(true, object.retry);
                }else{
                  showAnswer(object.name);
                }
                console.log(object.retry);
            }
          } else if (text.id == "SemiD") {
            object.description = text.value;
            ANSSemi.style.display = 'block';
          }
          
          if ((object.input).toLowerCase().replace(/ /g,'') == 
              (object.name).toLowerCase().replace(/ /g,'') &&
             object.description != "") {
            stage = 3;
            ResetAnswers();
            stageComplete = true;
            wellDone.innerHTML = wellDoneText;
            wellDone.style.display = "block";
            //SetUpStage(S3Points, S3Lines);
            HideAllText(S2TextBox);
          }
        }
        
        //box logic for stage 3
        if (stage == 3) {
          if (text.id == "IncusI" || text.id == "StapesI" || text.id == "MalleusI") {
            object.input = text.value;
            if ((object.input).toLowerCase().replace(/ /g,'') == (object.name).toLowerCase().replace(/ /g,'')) {
              text.style.backgroundColor = "green";
            } else {
              text.style.backgroundColor = "red";
              
              if(object.retry > 0){
                object.retry -= 1;
                toggleTryAgainMsg(true, object.retry);
              }else{
                showAnswer(object.name);
              }
              console.log(object.retry);
            }
          } else if (text.id == "OssiclesD") {
            object.description = text.value;
            ANSOss.style.display = 'block';
          }
          
          if ((object.input).toLowerCase().replace(/ /g,'') == 
              (object.name).toLowerCase().replace(/ /g,''))
          {
            object.isAnswered = true;
          }
          
          if (CheckAnswers(S3Points)) {
            HideAllText(S3TextBox);
            SetUpStage(S3bPoints, S3bLines);
            if (object.description != "") {
              stage = 4;
              ResetAnswers();
              stageComplete = true;
              wellDone.innerHTML = wellDoneText;
              wellDone.style.display = "block";
              //SetUpStage(S4Points, S4Lines);
              HideAllText(S3TextBox);
            }
          }
        }
        
        if (stage == 4) {
          object.input = text.value;
    
          if ((object.input).toLowerCase().replace(/ /g,'') == (object.section).toLowerCase().replace(/ /g,'')) {
            text.style.backgroundColor = "green";
            object.isAnswered = true;
          } else {
            text.style.backgroundColor = "red";
          }
          
          if (CheckAnswers(S4Points)) {
            stage = 0;
            ResetAnswers();
            stageComplete = true;
            wellDone.innerHTML = quizCompleteText;
            wellDone.style.display = "block";
            SetUpStage([], []);
            HideAllText(S4TextBox);
          }
        }
        

      }
      return text;
    }
    

    
    // ========================================================================================
    // Set up stage one
    // ========================================================================================
    
    S1TextBox = [
      IDBox(points[0], document.getElementById("PinnaI")),
      IDBox(points[1], document.getElementById("AuditoryCI")),
      IDBox(points[2], document.getElementById("EustachianI")),
      IDBox(points[3], document.getElementById("TympanicI")),
      IDBox(points[4], document.getElementById("CochleaI")),
      IDBox(points[9], document.getElementById("AuditoryNI"))
    ];
    
    S1Points = [
      points[0],
      points[1],
      points[2],
      points[3],
      points[4],
      points[9] 
    ];
    
    S1Lines = [
      lines[0],
      lines[1],
      lines[8] 
    ];
     
    // ========================================================================================
    // Set up stage two
    // ========================================================================================
    
    S2TextBox = [
      IDBox(points[5], document.getElementById("SemiI")),
      IDBox(points[5], document.getElementById("SemiD"))
    ];
    
    S2Points = [
      points[5]
    ];
    
    S2Lines = [
      lines[2],
      lines[3],
      lines[4] 
    ];
    
    // ========================================================================================
    // Set up stage three
    // ========================================================================================
    
    S3TextBox = [
      IDBox(points[6], document.getElementById("MalleusI")),
      IDBox(points[7], document.getElementById("IncusI")),
      IDBox(points[8], document.getElementById("StapesI")),
      IDBox(points[10], document.getElementById("OssiclesD")),
      
    ];
    
    S3Points = [
      points[6],
      points[7],
      points[8]
    ];
    
    S3Lines = [
      lines[5],
      lines[6],
      lines[7] 
    ];
    
    S3bPoints = [
      points[10]
    ];
    
    S3bLines = [
      lines[9],
      lines[10],
      lines[11] 
    ];
    
    
    // ========================================================================================
    // Set up stage two
    // ========================================================================================
    
    S4TextBox = [
      IDBox(points[0], document.getElementById("PinnaS")),
      IDBox(points[1], document.getElementById("AuditoryCS")),
      IDBox(points[2], document.getElementById("EustachianS")),
      IDBox(points[3], document.getElementById("TympanicS")),
      IDBox(points[4], document.getElementById("CochleaS")),
      IDBox(points[5], document.getElementById("SemiS")),
      IDBox(points[6], document.getElementById("MalleusS")),
      IDBox(points[7], document.getElementById("IncusS")),
      IDBox(points[8], document.getElementById("StapesS")),
      IDBox(points[9], document.getElementById("AuditoryNS"))
    ];
    
    S4Points = [
      points[0],
      points[1],
      points[2],
      points[3],
      points[4],
      points[5],
      points[6],
      points[7],
      points[8],
      points[9]
    ];
    
    S4Lines = [
      lines[0],
      lines[1],
      lines[2],
      lines[3],
      lines[4],
      lines[5],
      lines[6],
      lines[7],
      lines[8]
    ];
    
    SetUpStage(S4Points, S4Lines);

    
    // ========================================================================================
    // Load OBJ models
    // ========================================================================================
    
    var zOffset = -10;
    
    var yOffset = -2;
    var modelScale = 1;
    
    scene.add(root);
    var textureLoader = new THREE.TextureLoader();
    cube = root;
    root.position.y += yOffset;
    root.position.z += zOffset;
    
    var ear1Object = new THREE.Object3D;
    var loader = new THREE.OBJLoader( );
    loader.load('https://sarr1.github.io/DynModelQuiz/assets/Ear1.obj', function ( object ) {
        var child = object.children[0];

        child.material.map = textureLoader.load( "https://sarr1.github.io/DynModelQuiz/assets/Ear1_color.jpg" );
        child.material.normalMap = textureLoader.load( "https://sarr1.github.io/DynModelQuiz/assets/Ear1_normal.jpg" );
        
        object.position.x = -0.48;
        object.position.y = 1.75;
        object.position.z = 0.6;

        ear1Object = object;

        root.add(object);
    });
    
   

    var ear2Object = new THREE.Object3D;
    var loader = new THREE.OBJLoader( );
    loader.load('https://sarr1.github.io/DynModelQuiz/assets/Ear2.obj', function ( object ) {
        var child = object.children[0];

        child.material.map = textureLoader.load( "https://sarr1.github.io/DynModelQuiz/assets/Ear2_color.jpg?1507082281503" );
        child.material.normalMap = textureLoader.load( "https://sarr1.github.io/DynModelQuiz/assets/Ear2_normals.jpg" );
        object.position.x = -1.38697;
        object.position.y = 2.28417;
        object.position.z = -0.31602;

        ear2Object = object;
      
        root.add(object);
    });


    var ear3Object = new THREE.Object3D;
    var loader = new THREE.OBJLoader( );
    loader.load('https://sarr1.github.io/DynModelQuiz/assets/EarMain.obj', function ( object ) {
        var child = object.children[0];
        // child.material.map = ear3ObjectTex;
        child.material.map = textureLoader.load( "https://sarr1.github.io/DynModelQuiz/assets/Ear_main.jpg" );
        child.material.normalMap = textureLoader.load( "https://sarr1.github.io/DynModelQuiz/Ear_main_Normal.jpg" );
        object.scale.x = modelScale;
        object.scale.y = modelScale;
        object.scale.z = modelScale;

        ear3Object = object;
        objects.push(object);
        root.add(ear3Object);
        for (var i=0;i<points.length;i++)
        {
          ear3Object.add(points[i]);
          objects.push(points[i]);
        }

        for (var i=0;i<lines.length;i++)
        {
          ear3Object.add(lines[i]);  
        }
    });
 
    
    //===============================================================================
    // WebGL renderer
    //===============================================================================
    
		renderer = new THREE.WebGLRenderer({
        alpha: true,
        logarithmicDepthBuffer: true,
        antialias: true
    });
		renderer.setClearColor(0xf0f0f0);
		renderer.setSize(window.innerWidth, window.innerHeight);

		container.appendChild(renderer.domElement);
    
    
		//document.addEventListener('pointerdown', onDocumentMouseDown, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentMouseDown, false);

		window.addEventListener('resize', onWindowResize, false);

		update();
	};

	function onWindowResize()
	{
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	}
  
  function touch(event){
    alert(event.touches[0].screenX);
  }
  
  function HideAllText(textBoxes) {
    for (var i = 0; i < textBoxes.length; i++)
    {
      textBoxes[i].style.display = "none";
    }
  }
  
  function ResetPointsColor(){
      for(var i = 0; i < points.length; i++){
        
        if(points[i].isAnswered){
          console.log(points[i]);
          points[i].material.color = pointAnsweredColor;
        }else{
          points[i].material.color = pointColor;
        }
      }
  }
  
  function CheckAnswers(SPoints) {
    for (var i = 0; i < SPoints.length; i++)
    {
      if (SPoints[i].isAnswered == false)
        return false;
    }
    return true;
  }
  
  function ResetAnswers() {
    for (var i = 0; i < points.length; i++)
    {
      points[i].isAnswered = false;
    }
  }
  
  function IntersectMouse(x,y){
    var _x = (x / window.innerWidth) * 2 - 1;
    var _y = -(y / window.innerHeight) * 2 + 1;
    console.log(_x, _y);
    raycaster.setFromCamera({x: _x, y: _y}, camera);
    
    var intersects = raycaster.intersectObjects(points,true);
    return intersects;
  }
  
	function onDocumentMouseDown(event)
	{ 
    if(stageComplete){
        stageComplete = false;
        if(stage == 2){
            SetUpStage(S2Points, S2Lines);
        }else if(stage == 3){
            SetUpStage(S3Points, S3Lines);
        }
        else if(stage == 4){
            SetUpStage(S4Points, S4Lines);
        }
    }
    wellDone.style.display = "none";
    hideInstructions();
    if(inputclick){
      inputclick = false;
      return
    }else{
      HideAllText(S1TextBox);
      HideAllText(S2TextBox);
      HideAllText(S3TextBox);
      HideAllText(S4TextBox);
      ResetPointsColor();
    }
    toggleTryAgainMsg(false);
    ANSSemi.style.display = 'none';
    ANSOss.style.display = 'none';
    
    var INTERSECTED = IntersectMouse(getClientX(event), getClientY(event));
    console.log(INTERSECTED);
    if (INTERSECTED[0]) {
      INTERSECTED[0].object.material.color = pointSelectedColor;
      switch(INTERSECTED[0].object.name) {
        case "Pinna":
          HideAllText(S1TextBox);
          HideAllText(S4TextBox);
          if (stage == 1)
            S1TextBox[0].style.display = "block";
          if (stage == 4)
            S4TextBox[0].style.display = "block";
          break;
        case "Auditory Canal":
          HideAllText(S1TextBox);
          HideAllText(S4TextBox);
          if (stage == 1)
            S1TextBox[1].style.display = "block";
          if (stage == 4)
            S4TextBox[1].style.display = "block";
          break;
        case "Eustachian Tube":
          HideAllText(S1TextBox);
          HideAllText(S4TextBox);
          if (stage == 1)
            S1TextBox[2].style.display = "block";
          if (stage == 4)
            S4TextBox[2].style.display = "block";
          break;
        case "Tympanic Membrane":
          HideAllText(S1TextBox);
          HideAllText(S4TextBox);
          if (stage == 1)
            S1TextBox[3].style.display = "block";
          if (stage == 4)
            S4TextBox[3].style.display = "block";
          break;
        case "Cochlea":
          HideAllText(S1TextBox);
          HideAllText(S4TextBox);
          if (stage == 1)
            S1TextBox[4].style.display = "block";
          if (stage == 4)
            S4TextBox[4].style.display = "block";
          break;
        case "Auditory Nerve":
          HideAllText(S1TextBox);
          HideAllText(S4TextBox);
          if (stage == 1)
            S1TextBox[5].style.display = "block";
          if (stage == 4)
            S4TextBox[9].style.display = "block";
          break;
        case "Semicircular Canals":
          HideAllText(S4TextBox);
          if (stage == 2) {
            S2TextBox[0].style.display = "block";
            S2TextBox[1].style.display = "block";
          }
          if (stage == 4)
            S4TextBox[5].style.display = "block";
          break;
        case "Malleus":
          HideAllText(S3TextBox);
          HideAllText(S4TextBox);
          if (stage == 3)
            S3TextBox[0].style.display = "block";
          if (stage == 4)
            S4TextBox[6].style.display = "block";
          break;
        case "Incus":
          HideAllText(S3TextBox);
          HideAllText(S4TextBox);
          if (stage == 3)
            S3TextBox[1].style.display = "block";
          if (stage == 4)
            S4TextBox[7].style.display = "block";
          break;
        case "Stapes":
          HideAllText(S3TextBox);
          HideAllText(S4TextBox);
          if (stage == 3)
            S3TextBox[2].style.display = "block";  
          if (stage == 4)
            S4TextBox[8].style.display = "block";
          break;
        case "Ossicles":
          HideAllText(S3TextBox);
          if (stage == 3)
            S3TextBox[3].style.display = "block";
          break;
      }
      return;
    }
        
		//event.preventDefault();
    
		// document.addEventListener('pointermove', onDocumentMouseMove, false);
		// document.addEventListener('pointerup', onDocumentMouseUp, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
		document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('touchmove', onDocumentMouseMove, false);
		document.addEventListener('touchend', onDocumentMouseUp, false);

		mouseDown = true;
    
		// startPoint = {
		// 	x: event.clientX,
		// 	y: event.clientY
		// };
    
    startPoint = {
			x: getClientX(event),
			y: getClientY(event)
		};

		rotateStartPoint = rotateEndPoint = projectOnTrackball(0, 0);
	}
  
  function SetUpStage(SPoints, SLines) {
    var remove = true;
    for (var i = 0; i < points.length; i++) {
      for (var j = 0; j < SPoints.length; j++) {
        if (points[i].name == SPoints[j].name) {
            points[i].visible = true;
            remove = false;
        }
      }
      if (remove == true) {
        points[i].visible = false;
      }
      remove = true;
    }
    for (var i = 0; i < lines.length; i++) {
      for (var j = 0; j < SLines.length; j++) {
        if (lines[i].name == SLines[j].name) {
            lines[i].visible = true;
            remove = false;
        }
      }
      if (remove == true) {
        lines[i].visible = false;
      }
      remove = true;
    }
  }

	function onDocumentMouseMove(event)
	{
    //alert(event.x);
		deltaX = getClientX(event) - startPoint.x;
		deltaY = getClientY(event) - startPoint.y;

		handleRotation();

		startPoint.x = getClientX(event);
		startPoint.y = getClientY(event);

		lastMoveTimestamp = new Date();
	}

	function onDocumentMouseUp(event)
	{
    if(lastMoveTimestamp){
        //alert("pointer up");
        if (new Date().getTime() - lastMoveTimestamp.getTime() > moveReleaseTimeDelta)
        {
          deltaX = getClientX(event) - startPoint.x;
          deltaY = getClientY(event) - startPoint.y;
        }
    }
		mouseDown = false;

		// document.removeEventListener('pointermove', onDocumentMouseMove, false);
		// document.removeEventListener('pointerup', onDocumentMouseUp, false);
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
		document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('touchmove', onDocumentMouseMove, false);
		document.removeEventListener('touchup', onDocumentMouseUp, false);
	}

	function projectOnTrackball(touchX, touchY)
	{
		var mouseOnBall = new THREE.Vector3();

		mouseOnBall.set(
			clamp(touchX / windowHalfX, -1, 1), clamp(-touchY / windowHalfY, -1, 1),
			0.0
		);

		var length = mouseOnBall.length();

		if (length > 1.0)
		{
			mouseOnBall.normalize();
		}
		else
		{
			mouseOnBall.z = Math.sqrt(1.0 - length * length);
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

	function clamp(value, min, max)
	{
		return Math.min(Math.max(value, min), max);
	}
  
	function update()
	{
    var v = 1 + ((scaleslider.value - 50) / 100);
    //console.log(v);
    root.scale.x = v;
    root.scale.y = v;
    root.scale.z = v;
    
    //info.innerHTML = infotext + "  " + deltaX + "  " + deltaY;
		requestAnimationFrame(update);
		render();
	}

	function render()
	{ 
    
		if (!mouseDown)
		{
			var drag = 0.95;
			var minDelta = 0.05;

			if (deltaX < -minDelta || deltaX > minDelta)
			{
				deltaX *= drag;
			}
			else
			{
				deltaX = 0;
			}

			if (deltaY < -minDelta || deltaY > minDelta)
			{
				deltaY *= drag;
			}
			else
			{
				deltaY = 0;
			}

			handleRotation();
		}

		renderer.render(scene, camera);
	}

	var handleRotation = function()
	{
    if(!cube) return;
		rotateEndPoint = projectOnTrackball(deltaX, deltaY);

		var rotateQuaternion = rotateMatrix(rotateStartPoint, rotateEndPoint);
		curQuaternion = cube.quaternion;
		curQuaternion.multiplyQuaternions(rotateQuaternion, curQuaternion);
		curQuaternion.normalize();
		cube.setRotationFromQuaternion(curQuaternion);

		rotateEndPoint = rotateStartPoint;
	};

	// PUBLIC INTERFACE
	return {
		init: function()
		{
			setup();
		}
	};
})();



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
  
  function getScreenX(event){
      switch(event.type){
          case "mousedown":
          case "mouseup":
          case "mousemove":
              return event.ScreenX;
          
          case "touchstart":
          case "touchend":
          case "touchmove":
              return event.touches[0].ScreenX;
      }
  }
  
  function getScreenY(event){
      switch(event.type){
          case "mousedown":
          case "mouseup":
          case "mousemove":
              return event.ScreenY;
          
          case "touchstart":
          case "touchend":
          case "touchmove":
              return event.touches[0].ScreenY;
          default: 
              return 0;
      }
  }

document.onreadystatechange = function()
{
	if (document.readyState === 'complete')
	{
		Defmech.RotationWithQuaternion.init();
	}
};