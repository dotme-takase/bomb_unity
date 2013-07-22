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
	
	function onModifyData(){
		var context:AppContext = AppContext.getInstance();
		if(this.HP <= 0) {
			context.playData = null;
			Application.LoadLevel('plane');
			
		} else if (context && context.playData) {
			context.playData.HP = this.HP;
			context.playData.MHP = this.MHP;
			if(this.rightArm) {
				context.playData.rightArmName = this.rightArm.itemName;
			} else {
				context.playData.rightArmName = null;
			}
			if(this.leftArm) {
				context.playData.leftArmName = this.leftArm.itemName;
			} else {
				context.playData.leftArmName = null;
			}
		}
	} 
	
	function Start () {
		super.Start();
		this.teamNumber = 1;
		this.MHP = this.HP = 100;
		this.speed = 10;
		this.equipRight("bombTimer");
		this.isPlayer = true;
		var context:AppContext = AppContext.getInstance();
		context.player = this;
		context.initializePlayData();
	}
	
	function Update () { 
		var context:AppContext = AppContext.getInstance();
		var cursor:Vector3;		 
		if(Input.touches.Length > 0){
		    var touch = Input.touches[0];
		    cursor = touch.position;
		    
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
			cursor = Input.mousePosition; 
			
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
		cursor.z = Camera.main.transform.position.y;
		cursor = Camera.main.ScreenToWorldPoint(cursor) - transform.position; 
		
		axisX = cursor.x; 
		axisY = cursor.z;
		
		clickDuration = Mathf.Max(0, clickDuration - 1);
		doubleClickDuration = Mathf.Max(0, doubleClickDuration - 1);
		
		inputAction();
		isMouseClick = isMouseDoubleClick = false;
		super.Update(); 
		
		if(context && context.playData) {
			var mapPoint = context.getMapPoint(this.transform.position);
       		var mapHeight = context.map.GetLength(0);
        	var mapWidth = context.map.GetLength(1);		
                
            if (context.downStairPoint != null
            	 && (context.downStairPoint.x == mapPoint.x)
            	 && (context.downStairPoint.y == mapPoint.y)) {
            	 context.playData.floorNumber++;
            	 this.HP = this.MHP;
            	 this.onModifyData();
            	 Application.LoadLevel('plane');
            }
		}
	}
	
	function inputAction() {
        var _this = this;
        var context = _this.context;
 
        if (_this.isAction) {
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
                        _this.isAction = true;
                        _this.action = CharacterAction.ATTACK;
                    } else if (_this.action == CharacterAction.DEFENCE_MOTION) {
                    	_this.isAction = true;
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