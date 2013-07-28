class PlayerBehaviour extends BaseCharacter {
	var isMouseDown = false;
	var isMouseDoubleDown = false;
	var isMouseClick = false;
	var isMouseDoubleClick = false;
	var isCursor = false;
	var clickDuration = 0; 
	var doubleDownDuration = 0;
	var duration = 10;
	var defenceCount = -1;
	
	function onModifyData(){
		var context:AppContext = AppContext.getInstance();
		if(this.HP <= 0) {
			context.playData = null;
			StageInitiator.fadeOut(3, function(){
				Application.LoadLevel('title');
			});
		} else if (context && context.playData) {
			context.playData.HP = this.HP;
			context.playData.MHP = this.MHP; 
			context.playData.itemThrownMaxCount = this.itemThrownMaxCount; 
			
			if(this.rightArm) {
				context.playData.rightArmName = this.rightArm.itemName;
			} else {
				context.playData.rightArmName = this.itemThrownName;
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
		    	if (doubleDownDuration > 0) { 
		    		isMouseDoubleDown = true;
		    	}
		    	if (!isMouseClick) {
		    		clickDuration = duration;
		   		}
		    } else if (touch.phase == TouchPhase.Ended
		     || touch.phase == TouchPhase.Canceled){ 
		    	if(clickDuration > 0){ 
		     		isMouseClick = true; 
		     		doubleDownDuration = 3;
		     		if (isMouseDoubleDown) { 
		     			isMouseDoubleClick = true;
		     		}
		     	} 
		     	isMouseDoubleDown = isMouseDown = false; 
		    }
		} else {
			cursor = Input.mousePosition; 
			
			if(Input.GetMouseButtonDown(0)){  
		   		isMouseDown = true; 
		   		if (doubleDownDuration > 0) { 
		    		isMouseDoubleDown = true;
		    	}
		   		if (!isMouseClick) {
		   			clickDuration = duration;
	 			}
		    } else if(Input.GetMouseButtonUp(0)) { 
		     	if(clickDuration > 0){ 
		     		isMouseClick = true; 
		     		doubleDownDuration = 3;
		     		if (isMouseDoubleDown) { 
		     			isMouseDoubleClick = true;
		     		}
		     	} 
		     	isMouseDoubleDown = isMouseDown = false; 
		    }
		} 		
		clickDuration = Mathf.Max(0, clickDuration - 1); 
		doubleDownDuration = Mathf.Max(0, doubleDownDuration - 1);
		
		cursor.z = Camera.main.transform.position.y;
		cursor = Camera.main.ScreenToWorldPoint(cursor) - transform.position; 
		
		axisX = cursor.x; 
		axisY = cursor.z;
		
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
				if(!context.isLoading) {
	            	context.playData.floorNumber++;
	            	this.HP = this.MHP;
	            	this.onModifyData();
	            	StageInitiator.playSound("downstair");
	            	StageInitiator.fadeOut(0.5, function(){
						Application.LoadLevel('dungeon');
					});
					context.isLoading = true;
				}
            }
		}
	}
	
	function inputAction() {
        var _this = this;
        var context = _this.context;
   		
   		var controllableFlag = (!_this.isAction 
                			|| _this.action == CharacterAction.DEFENCE_MOTION
                			|| _this.action == CharacterAction.DEFENCE);
  
  		if ((_this.isMouseDown || _this.isMouseClick) && controllableFlag) {
                _this.direction = (Mathf.Atan2(_this.axisY, _this.axisX) * 180 / Mathf.PI);
        } 
        
        if (_this.isAction && (_this.action == CharacterAction.DAMAGE
            || _this.action == CharacterAction.DEAD
            || _this.action == CharacterAction.PARRIED)) {
            _this.isWalk = false;
        } else {
	        if (_this.isMouseDoubleDown) {
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
	        } else if (_this.isMouseDown) {
	        	_this.isWalk = true;
	            _this.isAction = false;
	        } else {
	            _this.isWalk = false;
	            if (controllableFlag && _this.isMouseClick) {
	                _this.isAction = true;
	                _this.action = CharacterAction.ATTACK;
	            }
	
	            if (_this.isAction) {
	                if (_this.action == CharacterAction.ATTACK) {
	                } else if (_this.action == CharacterAction.DEFENCE) { 
	                	if (_this.defenceCount > 0) {
	                    	_this.isAction = true;
	                    	_this.action = CharacterAction.ATTACK; 
	                    } else { 
	                    	_this.isAction = false;
	                    	_this.action = CharacterAction.NONE;
	                    }
	                } else if (_this.action == CharacterAction.DEFENCE_MOTION) {
	                	_this.isAction = true;
	                    _this.action = CharacterAction.ATTACK;
	                } else {
	                    _this.isAction = false;
	                    _this.action = CharacterAction.NONE;
	                }
	            } 
	        }
		}
    }
}