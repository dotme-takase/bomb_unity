class PlayerBehaviour extends BaseCharacter {
	var isMouseDown = false;
	var isMouseDoubleDown = false;
	var isMouseClick = false;
	var doubleDownDuration = false;
	var isMouseDoubleClick = false;
	var isCursor = false;
	var clickDuration = 0;
	var doubleClickDuration = 0;
	var duration = 10;
	var defenceCount = -1;
	
	function Start () {
		var bodyAnim : AnimationContainer = new AnimationContainer();
		bodyAnim.animations = BaseCharacter.BODY_ANIMATION;
		bodyAnim.numX = 8;
		bodyAnim.numY = 4;
		
		this.initialize(bodyAnim, "shortSword", "woodenShield");
		var head = GetComponentInChildren(BodyAnimation);
		head.ac = this.bodyAnim;
		var foot = GetComponentInChildren(LegAnimation);
		foot.ac = this.legAnim;
		this.bodyAnim.gotoAndStop("walk");
	}
	
	function Update () {		
		if(Input.touches.Length > 0){
		    var touch = Input.touches[0];
		    axisX = touch.position.x - Screen.width / 2;
		    axisY = touch.position.y - Screen.height / 2;
		    
		    if(touch.phase == TouchPhase.Began){
		    	isMouseDown = true; 
		    	if (!isMouseClick) {
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
		   		if (!isMouseClick) {
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
		
		clickDuration = Mathf.Max(0, clickDuration - 1);
		doubleClickDuration = Mathf.Max(0, doubleClickDuration - 1);
		
		inputAction();
		isMouseClick = isMouseDoubleClick = false;
		super.Update();
	}
	
	function inputAction() {
        var _this = this;
        var context = _this.context;
 
        if (_this.isAction && (_this.action == CharacterAction.DAMAGE
            || _this.action == CharacterAction.DEAD
            || _this.action == CharacterAction.PARRIED)) {
            _this.isWalk = false;
        } else {
            if (_this.isMouseDown || _this.isMouseClick) {
                _this.direction = (Mathf.Atan2(_this.axisY, _this.axisX) * 180 / Mathf.PI);
            }
            if (_this.isMouseDoubleDown && !_this.isMouseClick) {
                _this.isWalk = false;
                if (_this.isAction && _this.action != CharacterAction.ATTACK) {
                    if (_this.action == CharacterAction.DEFENCE) {
                        if (_this.defenceCount > 0) {
                            _this.defenceCount--;
                        }
                    }
                } else {
                    _this.isAction = true;
                    _this.action = CharacterAction.DEFENCE_MOTION;
                    if( _this.rightArm ){
                    	_this.defenceCount = 8;
                    } else {
                    	_this.defenceCount = 0;
                    }
                }
            } else if (_this.isMouseDown && !_this.isMouseClick) {
            	_this.isWalk = true;
                _this.isAction = false;
            } else {
                _this.isWalk = false;
                if ((!_this.isAction || _this.action == CharacterAction.DEFENCE_MOTION)
                		&& _this.isMouseClick) {
                    _this.isAction = true;
                    _this.action = CharacterAction.ATTACK;
                }

                if (_this.isAction) {
                    if (_this.action == CharacterAction.ATTACK) {
                    } else if ((_this.action == CharacterAction.DEFENCE)
                        && (_this.defenceCount > 0)) {
                        _this.action = CharacterAction.ATTACK;
                    } else if (_this.action == CharacterAction.DEFENCE_MOTION) {
                        _this.action = CharacterAction.ATTACK;
                    } else {
                        _this.isAction = false;
                        _this.action = CharacterAction.NONE;
                    }
                } else {

                }
            }
        }
    }
}