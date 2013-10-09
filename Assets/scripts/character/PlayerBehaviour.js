class PlayerBehaviour extends BaseCharacter {
	var isMouseDown = false;
	var isMouseDoubleDown = false;
	var isMouseClick = false;
	var isMouseDoubleClick = false;
	var isCursor = false;
	var clickDuration:float = 0; 
	var doubleDownDuration:float = 0;
	var singleDuration:float = 0.25; 
	var doubleDuration:float = 0.15;
	var defenceCount = -1; 
	var previousAxisX = 0.0; 
	var previousAxisY = 0.0;
	
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
		var _isMouseDown = false;
		var _isMouseUp = false;	 
		if(Input.touches.Length > 0){
		    var touch = Input.touches[0];
		    cursor = touch.position;	    
		    if(touch.phase == TouchPhase.Began){
		    	_isMouseDown = true; 
		    } else if (touch.phase == TouchPhase.Ended
		     || touch.phase == TouchPhase.Canceled){ 
		    	_isMouseUp = true;
		    }
		} else {
			cursor = Input.mousePosition; 
			if(Input.GetMouseButtonDown(0)){  
				_isMouseDown = true; 
	 	    } else if(Input.GetMouseButtonUp(0)) { 
		     	_isMouseUp = true;
		    }
		}
		 
		var cosAngleYZ:float = Mathf.Cos(CameraBehaviour.BASE_ANGLE_YZ * Mathf.PI / 180);
		var cosAngleXZ:float = Mathf.Cos(CameraBehaviour.BASE_ANGLE_XZ * Mathf.PI / 180);
		cursor.z = Camera.main.transform.position.y / (cosAngleYZ * cosAngleXZ);		
		cursor = Camera.main.ScreenToWorldPoint(cursor);
		
		var x_0:float = Camera.main.transform.position.x;
		var y_0:float = Camera.main.transform.position.y;
		var z_0:float = Camera.main.transform.position.z;
		
		var ex:float = cursor.x - x_0;
		var ey:float = cursor.y - y_0;
		var ez:float = cursor.z - z_0;
		
		if( ey != 0 ) {
			var _t:float = -1 * y_0 / ey;
			var _x:float = ex * _t + x_0;
			var _y:float = ey * _t + y_0;
			var _z:float = ez * _t + z_0;
			cursor = Vector3(_x, _y, _z);
		}

		//GameObject.Find("guide").transform.position = cursor;
		
		cursor = cursor - transform.position;
		
		axisX = cursor.x; 
		axisY = cursor.z; 
		
		if(_isMouseDown){  
	   		isMouseDown = true; 
	   		if (doubleDownDuration > 0) {
	   			var _distance:float = Mathf.Sqrt(Mathf.Pow(axisX - previousAxisX, 2) 
	   											+ Mathf.Pow(axisY - previousAxisY, 2));
	    		isMouseDoubleDown = (_distance < 4.0);
	    	}
	   		if (!isMouseClick) {
	   			clickDuration = singleDuration;
 			}
		} else if(_isMouseUp) {  
			previousAxisX = axisX;
			previousAxisY = axisY;	
	    	if(clickDuration > 0){ 
	     		isMouseClick = true; 
	     		doubleDownDuration = doubleDuration;
	     		if (isMouseDoubleDown) { 
	     			isMouseDoubleClick = true;
	     		}
	     	} 
	     	isMouseDoubleDown = isMouseDown = false; 
		} 
		
		clickDuration = Mathf.Max(0, clickDuration - Time.deltaTime); 
		doubleDownDuration = Mathf.Max(0, doubleDownDuration - Time.deltaTime);
		
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
	                if ((_this.currentAnimation == null)
		                || ((_this.currentAnimation != ("attack"))
		                	&& (_this.currentAnimation != ("throw")))) {
		                _this.action = CharacterAction.DEFENCE_MOTION; 
		                if( _this.rightArm ){
		                	_this.defenceCount = 8;
		                } else {
		                	_this.defenceCount = 0;
		                }
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