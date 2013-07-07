var isMouseDown = false;
var isMouseDoubleDown = false;
var isMouseClick = false;
var doubleDownDuration = false;
var isMouseDoubleClick = false;
var isCursor = false;
var axisX = 0;
var axisY = 0;

var clickDuration = 0;
var doubleClickDuration = 0;
 
var duration = 100;

var character:BaseCharacter = null;

function Start () {
	character = new BaseCharacter();
	var bodyAnim : AnimationContainer = new AnimationContainer();
	bodyAnim.animations = BaseCharacter.BODY_ANIMATION;
	bodyAnim.numX = 8;
	bodyAnim.numY = 4;
	
	character.initialize(bodyAnim);
	var head = GetComponentInChildren(BodyAnimation);
	head.ac = character.bodyAnim;
	var foot = GetComponentInChildren(LegAnimation);
	foot.ac = character.legAnim;
	character.bodyAnim.gotoAndPlay("walk");
}

function Update () {
	var controller : CharacterController = GetComponent(CharacterController);
	if(Input.touches.Length > 0){
	    var touch = Input.touches[0];
	    axisX = touch.position.x - Screen.width / 2;
	    axisY = touch.position.y - Screen.height / 2;
	    
	    if(touch.phase == TouchPhase.Began){
	    	isMouseDown = true; 
	    	if(isMouseClick){
	    		clickDuration = duration;
	   		} else {
	   			doubleClickDuration = duration;
	    	} 
	    } else if (touch.phase == TouchPhase.Ended
	     || touch.phase == TouchPhase.Canceled){ 
	    	isMouseDown = false; 
	     	if(clickDuration > 0){ 
	     		isMouseClick = true;
	     	}
	    }
	} else {
		var pos = Input.mousePosition; 
		axisX = pos.x - Screen.width / 2;
		axisY = pos.y - Screen.height / 2; 
		
		if(Input.GetMouseButtonDown(0)){  
	   		isMouseDown = true; 
	   		if(!isMouseClick){
	   			clickDuration = duration;
 			} else {
	   			doubleClickDuration = duration;
	    	} 
	    } else if(Input.GetMouseButtonUp(0)) { 
	    	isMouseDown = false; 
	     	if(clickDuration > 0){ 
	     		isMouseClick = true;
	     	}
	    }
	}
	
	var angle = Mathf.Atan2(axisY, axisX) * 180 / Mathf.PI; 
	var angle2 = angle * Mathf.PI / 180;
	if( isMouseDown ) {
		transform.rotation = Quaternion.Euler(0, (-180 - angle), 0);
		var vX = 0.2 * Mathf.Cos(angle2);
		var vY = 0.2 * Mathf.Sin(angle2);
		controller.Move(Vector3(vX, 0, vY));
	}
	
	if (character) {
		character.updateFrame();
	}
}