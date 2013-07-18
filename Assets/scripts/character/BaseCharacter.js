class CharacterAction {
	static public final var NONE = 0;
	static public final var DEFENCE_MOTION = 1;
	static public final var DEFENCE = 2;
	static public final var ATTACK = 3;
	static public final var PARRIED = 4;
	static public final var DAMAGE = 5;
	static public final var DEAD = 6;
}

class Node {
	var pos:Point2D;
	var goal:Point2D;
	var fs:int;
	var hs:int;
	var ownerList:Node[];
	var parentNode:Node;
	var context:AppContext = AppContext.getInstance();
	function Node(position:Vector3, target:Vector3) {
	    this.pos = context.getMapPoint(position);
	    Node(this.pos.x, this.pos.y, target);
	}
	
	function Node(x:int, y:int, target:Vector3) {
	    this.pos = Point2D(x, y);
	    this.goal = context.getMapPoint(target);
	
	    this.hs = Mathf.Pow((this.pos.x - this.goal.x), 2)
	        + Mathf.Pow((this.pos.y - this.goal.y), 2);
	    this.fs = 0;
	    this.ownerList = null;
	    this.parentNode = null;
	}
	
    function isGoal() {
    	if(this.goal == null) {
    		return false;
    	}
        return ((this.goal.x == this.pos.x) && (this.goal.y == this.pos.y));
    }
}

class NodeList {
    var list:Node[];
    function find(x:int, y:int) {
        var self = this.list;
        for (var t:Node in self) {
            if ((t.pos.x == x) && (t.pos.y == y)) {
                return t;
            }
        }
        return null;
    }

    function remove(node:Node) {
        var self = this.list;
        var array = new Array(self);
        for (var k = 0; k < array.length; k++) {
        	if(node == self[k]) {
	       		array.RemoveAt(k);
	       	}
        } 
        this.list = array.ToBuiltin(Node);
    }

    function append(object:Node) {
    	if(this.list == null){
    		this.list = new Node[1];
    		this.list[0] = object;
    	} else {
        	var array = new Array(this.list);
        	array.push(object);
        	this.list = array.ToBuiltin(Node);
        }
    }

    function minFs() {
        var min:int = -1;
        var self = this.list;
        var node:Node = null;
        for (var _node:Node in self) {            
        	node = _node;
            if ((min == -1) || (min > node.fs)) {
                min = node.fs;
            }
        }
        return node;
    }
}

class BaseCharacter extends MonoBehaviour {
	static public var HANDMAP_STANDARD = [
	    [
	        [0, 26, 90, false],
	        [-13, 26, 105, false],
	        [-21, 19, 130, false],
	        [-13, 26, 105, false],
	        [0, 26, 90, false],
	        [17, 19, 75, false],
	        [23, 10, 50, false],
	        [17, 19, 75, false],
	        [0, 26, 260, false],
	        [-23, 16, 290, false],
	        [-24, -3, 310, false],
	        [-13, 26, 180, false],
	        [0, 26, 160, false],
	        [23, 16, 115, false],
	        [28, -7, 60, false],
	        [17, 19, 75, false]
	    ],
	    [
	        [3, -27, 0, false],
	        [17, -19, 15, false],
	        [23, -10, 30, false],
	        [17, -19, 15, false],
	        [3, -27, 0, false],
	        [-13, -26, -25, false],
	        [-21, -19, -40, false],
	        [-13, -26, -25, false],
	        [3, -27, 0, false],
	        [23, -19, 50, false],
	        [28, 7, 90, false],
	        [17, -19, 0, false],
	        [3, -27, -15, false],
	        [-23, -19, -30, false],
	        [-24, 3, -65, false],
	        [-13, -26, -75, false]
	    ]
	];
	
	static public var HANDMAP_2X = [
	    [
	        [0, 52, 90, false],
	        [-26, 52, 105, false],
	        [-42, 38, 130, false],
	        [-26, 52, 105, false],
	        [0, 52, 90, false],
	        [34, 38, 75, false],
	        [46, 20, 50, false],
	        [34, 38, 75, false],
	        [0, 52, 260, false],
	        [-46, 32, 290, false],
	        [-48, -6, 310, false],
	        [-26, 52, 180, false],
	        [0, 52, 160, false],
	        [46, 32, 115, false],
	        [56, -14, 60, false],
	        [34, 38, 75, false]
	    ],
	    [
	        [6, -54, 0, false],
	        [34, -38, 15, false],
	        [46, -20, 30, false],
	        [34, -38, 15, false],
	        [6, -54, 0, false],
	        [-26, -52, -25, false],
	        [-42, -38, -40, false],
	        [-26, -52, -25, false],
	        [6, -54, 0, false],
	        [46, -38, 50, false],
	        [56, 14, 90, false],
	        [34, -38, 0, false],
	        [6, -54, -15, false],
	        [-46, -38, -30, false],
	        [-48, 6, -65, false],
	        [-26, -52, -75, false]
	    ]
	];
	
	static public var BODY_ANIMATION = {
	    'walk': [0, 7],
	    'attack': [10, 15],
	    'attack_1': [11, 15],
	    'attack_2': [12, 15],
	    'attack__1': [9, 15],
	    'attack__2': [8, 15],
	    'defence': [8, 10],
	    'damage': [0, 1],
	    'parried': [0, 7]
	};
	
	var initialize = function(bodyAnim, rightArmName, leftArmName) {
		var _this = this;
		_this.bodyAnim = bodyAnim;
	    if (_this.bodyAnim) {
	    	_this.legAnim = AnimationContainer.clone(_this.bodyAnim);
	    } 
	    
	    if (rightArmName != null ) {  
	    	equipRight(rightArmName);
	    }
	    
	    if (leftArmName != null) {  
	    	equipLeft(leftArmName);
	    }
	};
	
	var context :AppContext = AppContext.getInstance();
	var bodyAnim :AnimationContainer = null;
	var legAnim  :AnimationContainer = null;
	
	var leftArm:BaseItem = null;
	var rightArm:BaseItem = null;
	var rightArmThrown:String = null;

	var handMap = HANDMAP_STANDARD;
	var speed = 4;
	var direction = 90;
	var axisX:float = 0;
	var axisY:float = 0;
	var vX:float = 0;
	var vY:float = 0;
	var isAction = false;
	var action = CharacterAction.NONE;
	var parriedCount = 0;
	var attackFrame = 0;
	var isWalk = false;
	var HP = 20;
	var teamNumber = 0;
	var clientTime = 0;
	var dropList = [];
	var isPlayer = false; 
	var stateId:String = AppContext.uuid();
	
	var target:BaseCharacter = null;
	var path:Point2D[] = null;
	var nextToTarget:Point2D = null;
	var currentFrame = 0;
	var frameWaited = false;
	
	function die() {
		var _this = this;
    	_this.HP = 0;
    	_this.action = CharacterAction.DEAD;
	//ToDo
	}
	
	function preUpdate() {	
		var _this = this; 
		if (_this.bodyAnim && _this.legAnim) { 
			if (_this.HP <= 0) {
		        _this.die();
		    }
			_this.vX = _this.vY = 0; 
			
			if (_this.action != CharacterAction.ATTACK) { 
				if (_this.rightArmThrown && _this.rightArm == null) { 
            		_this.equipRight(_this.rightArmThrown); 
            		_this.rightArmThrown = null;
            	}
			}
			
		    if (_this.isWalk) {
		        _this.bodyAnim.isStopped = false;
		        _this.bodyAnim.gotoAndPlay("walk"); 
		        _this.bodyAnim.isLooping = true;
		        
		        _this.vX = Mathf.Cos(_this.direction * Mathf.PI / 180) * _this.speed * 0.05;
		        _this.vY = Mathf.Sin(_this.direction * Mathf.PI / 180) * _this.speed * 0.05;
		    } else if (_this.isAction) {
		        if (_this.action == CharacterAction.DEFENCE_MOTION) {
		            if (_this.bodyAnim.currentAnimationName != "defence") {
		                _this.bodyAnim.gotoAndPlay("defence");
		                _this.bodyAnim.onAnimationEnd = function () {
		                    _this.vX = _this.vY = 0;
		                    _this.action = CharacterAction.DEFENCE;
		                    _this.bodyAnim.gotoAndStopFrame(_this.bodyAnim.currentAnimation[1]);
		                    _this.bodyAnim.isStopped = true;
		                };
		            } 
		            if (!frameWaited) {
		            	_this.vX = Mathf.Cos(_this.direction * Mathf.PI / 180) * - 0.1;
		            	_this.vY = Mathf.Sin(_this.direction * Mathf.PI / 180) * - 0.1; 
		            }
		        } else if (_this.action == CharacterAction.DEFENCE) {
		
		        } else if (_this.action == CharacterAction.PARRIED) {
		            if (_this.bodyAnim.currentAnimationName != "parried") {
		                _this.bodyAnim.gotoAndPlay("parried");
		                if (_this.parriedCount > 0) {
		                    StageInitiator.addEffect(transform.position.x, transform.position.z, "parried");
		                }
		                _this.bodyAnim.onAnimationEnd = function () {
		
		                    if (_this.parriedCount <= 0) {
		                        _this.vX = _this.vY = 0;
		                        _this.action = CharacterAction.NONE;
		                    } else {
		                        _this.parriedCount--;
		                        _this.bodyAnim.currentAnimationFrame = 0;
		                        _this.bodyAnim.gotoAndPlay("parried");
		                    }
		                };
		                StageInitiator.playSound("parried");
		            }
		            _this.vX = Mathf.Cos(_this.direction * Mathf.PI / 180) * -1;
		            _this.vY = Mathf.Sin(_this.direction * Mathf.PI / 180) * -1;
		        } else if (_this.action == CharacterAction.DAMAGE) {
		            if (_this.bodyAnim.currentAnimationName != "damage") {
		                _this.bodyAnim.gotoAndPlay("damage");
		                StageInitiator.addEffect(transform.position.x, transform.position.z, "damage");
		                _this.bodyAnim.onAnimationEnd = function () {
		                    _this.vX = _this.vY = 0;
		                    _this.action = CharacterAction.NONE;
		                };
		                StageInitiator.playSound("hit");
		            }
		        } else if (_this.action == CharacterAction.DEAD) {
		            var size = transform.lossyScale.z * 2;
		            var half = size / 2;
		            for (var i = 0; i < 8; i++) {
		                StageInitiator.addEffect(_this.x() + Random.value * size - half, _this.y() + Random.value * size - half, "dead");
		            }
		            StageInitiator.playSound("defeat");
		            _this.context.removeCharacter(_this);
		            Destroy(_this.gameObject);
		        } else if (_this.action == CharacterAction.ATTACK) {
		 			_this.attackFrame = _this.bodyAnim.currentAnimationFrame; 
		 			if ((_this.bodyAnim.currentAnimationName == null)
		                || (!_this.bodyAnim.currentAnimationName.Contains("attack"))) {
		                if (_this.rightArm && _this.rightArm.isThrowWeapon()) {
		                	if (_this.isPlayer){
		                		_this.prepareThrowWeapon(Vector2(_this.axisX + _this.x(), _this.axisY + _this.y()));
		                	} else if(_this.target) {
		                		_this.prepareThrowWeapon(Vector2(_this.target.x(), _this.target.y()));
		                	} else {
		                		_this.prepareThrowWeapon(Vector2(Mathf.Cos(_this.direction * Mathf.PI / 180) * _this.context.tileSize + _this.x(), 
		                										Mathf.Sin(_this.direction * Mathf.PI / 180) * _this.context.tileSize + _this.y()));
		                	}		
		                    if (_this.rightArm.range > _this.context.tileSize * 3) {
		                        _this.bodyAnim.gotoAndPlay("attack__1");
		                    } else if (_this.rightArm.range > _this.context.tileSize * 2) {
		                        _this.bodyAnim.gotoAndPlay("attack");
		                    } else {
		                        _this.bodyAnim.gotoAndPlay("attack_1");
		                    }
		                } else {
			                var weaponSpeed = 2;
			                if (_this.rightArm) {
			                    if (_this.currentFrame == 10) {
			                        weaponSpeed = 0;
			                    } else {
			                        weaponSpeed = _this.rightArm.speed;
			                    }
			                }
			                if (weaponSpeed >= 2) {
			                    _this.bodyAnim.gotoAndPlay("attack_2");
			                } else if (weaponSpeed == 1) {
			                    _this.bodyAnim.gotoAndPlay("attack_1");
			                } else if (weaponSpeed == -1) {
			                    _this.bodyAnim.gotoAndPlay("attack__1");
			                } else if (weaponSpeed <= -2) {
			                    _this.bodyAnim.gotoAndPlay("attack__2");
			                } else {
			                    _this.bodyAnim.gotoAndPlay("attack");
			                }
			                StageInitiator.playSound("attack");
			            }
		                _this.bodyAnim.onAnimationEnd = function () {		                	
		                    if (_this.action != CharacterAction.ATTACK) {
		                        return;
		                    }
		                    _this.attackFrame = 0;
		                    _this.vX = _this.vY = 0;
		                    _this.action = CharacterAction.NONE;
		                };
		            }
		            
		            if (!_this.frameWaited){ 
			            if (_this.currentFrame < 10) {
			                _this.vX = Mathf.Cos(_this.direction * Mathf.PI / 180) * -0.1;
			                _this.vY = Mathf.Sin(_this.direction * Mathf.PI / 180) * -0.1;
			            } else if (_this.currentFrame > 12) {
			                _this.vX = Mathf.Cos(_this.direction * Mathf.PI / 180) * -0.15;
			                _this.vY = Mathf.Sin(_this.direction * Mathf.PI / 180) * -0.15;
			            } else {
			                _this.vX = Mathf.Cos(_this.direction * Mathf.PI / 180) * 0.15;
			                _this.vY = Mathf.Sin(_this.direction * Mathf.PI / 180) * 0.15;
			            }
			            if (_this.rightArm && _this.rightArm.isThrowWeapon()) {
		            		if (_this.currentFrame >= 12 && _this.currentFrame < 15) {  
		            			var armDirection:Vector3 = Vector3(_this.rightArm.vX
                    									, 0
                    									,_this.rightArm.vY) * 1.25; 
                    									
								var forceDirection:Vector3 = armDirection * 20;                    									  
                    									
                    		    var _x1:float = _this.rightArm.range - (armDirection.magnitude); 
                    		    var _y1:float = _this.transform.position.y;
                    		    var _x2:float = forceDirection.magnitude; 
                    		    var _y2:float = _y1 * _x2 / _x1; 
                    		    forceDirection += Vector3.down * _y2 * 8;
                    		      
 								_this.rightArmThrown = _this.rightArm.itemName;
								Destroy(_this.rightArm.gameObject);                    									
                    			_this.rightArm = null;	
                    			
                    			var initiator = GameObject.Find("Initialize").GetComponent(StageInitiator);			
		            			var armClone = initiator.createItemByName(_this.transform.position.x + armDirection.x, 
		            													_this.transform.position.y + armDirection.z,
		            													_this.rightArmThrown, false);
			                    armClone.vX = armDirection.x;
			                    armClone.vY = armDirection.z;
			                    armClone.thrownTime = 0;
			                    armClone.useCharacter = _this; 
			                    
			                    armClone.transform.position = _this.transform.position + armDirection;
			                    armClone.rigidbody.AddForce(forceDirection, ForceMode.VelocityChange);
			                } 
			            }  
		            } 
		        } else if (_this.action == CharacterAction.NONE) {
		            _this.isAction = false;
		            _this.vX = _this.vY = 0;
		            _this.bodyAnim.gotoAndStop("walk");     //animate
		            _this.bodyAnim.isStopped = true;
		        }
		    } else {   	
		        _this.isAction = false;
		        _this.vX = _this.vY = 0;
		        _this.bodyAnim.gotoAndStop("walk");     //animate
		        _this.bodyAnim.isStopped = true;
		    } 
		    
		    for (var other:BaseCharacter in context.characters) {
		    	if(other.stateId == this.stateId) {
		    		continue;
		    	}    	
		    	var deltaX = other.x() - x();
                var deltaY = other.y() - y();
                var range = _this.transform.lossyScale.z * 2 + other.transform.lossyScale.z * 2;
                var collisionRange = range * 0.6;
                var distance = Mathf.Sqrt(Mathf.Pow(deltaX, 2) + Mathf.Pow(deltaY, 2));
                var theta = Mathf.Atan2(deltaY, deltaX);
                var angleForOther = (theta * 180 / Mathf.PI) - _this.direction;
                angleForOther = AppContext.fixAngle(angleForOther);
                var angleForObj = (theta * 180 / Mathf.PI) - 180 - other.direction;
                angleForObj = AppContext.fixAngle(angleForObj);

                if (_this.teamNumber != other.teamNumber
                    && _this.isAction && !_this.isWalk
                    && (_this.action == CharacterAction.ATTACK)
                    && (_this.attackFrame > 2)
                    && (_this.rightArm != null)) {
                    var weaponRange = 0;
                    var weaponPoint = 0;
                    if (_this.rightArm.type == BaseItem.TYPE_SWORD) {
                        weaponRange = _this.rightArm.range * BaseItem.PIXEL_SCALE;
                        weaponPoint = _this.rightArm.bonusPoint;
                    }
				
                    if ((distance < range + weaponRange)
                        && ((angleForOther > -20) && (angleForOther < 80))) {
                        // right
                        var kickBackRange = -1 * Random.value;
                        if ((other.isAction && (other.action == CharacterAction.DEFENCE)
                            && (other.leftArm != null && other.leftArm.type == BaseItem.TYPE_SHIELD))
                            && ((angleForObj > -30) && (angleForObj < 30))) {
                            _this.vX -= Mathf.Cos(theta) * kickBackRange;
                            _this.vY -= Mathf.Sin(theta) * kickBackRange;
                            _this.isAction = true;
                            _this.action = CharacterAction.PARRIED;
                            _this.parriedCount = 1;
                            other.leftArm.onUse(other, _this);
                        } else if (!other.isAction || (other.action != CharacterAction.DAMAGE)) {
                            other.vX -= Mathf.Cos(theta) * kickBackRange;
                            other.vY -= Mathf.Sin(theta) * kickBackRange;
                            other.isAction = true;
                            other.action = CharacterAction.DAMAGE;
                            other.HP -= Mathf.CeilToInt(weaponPoint * (Random.value * 0.20 + 1));
                            //ToDo
                            //if ((_this.playData != null) && (other == _this.player)) {
                                //_this.playData.enemy = _this;
                            //}
                        }
                    }
                }
		    }
		
			var maxFrame = _this.bodyAnim.numX * _this.bodyAnim.numY / 2;
		    if (_this.bodyAnim.currentFrame >= maxFrame) {
		        _this.bodyAnim.gotoAndStopFrame(maxFrame - 1);
		    }
		    _this.bodyAnim.tick();
		    _this.legAnim.currentFrame = (_this.bodyAnim.currentFrame + maxFrame); 
		    
		    if (_this.rightArm) {  
		    	var rhandMapPos:Array = _this.handMap[0][_this.bodyAnim.currentFrame];  
		     	transformItemByHandMap(_this.rightArm, rhandMapPos);
		    }
		
		    if (_this.leftArm) {
		        var lhandMapPos:Array = _this.handMap[1][_this.bodyAnim.currentFrame];
		        transformItemByHandMap(_this.leftArm, lhandMapPos);
		    }  
		     
		    _this.frameWaited = (_this.currentFrame == _this.bodyAnim.currentFrame);
		    _this.currentFrame = _this.bodyAnim.currentFrame; 
	    }
	}
	
	function transformItemByHandMap(item:BaseItem, handMapPos:Array){
		var _xM0:float = handMapPos[0];
        var _yM0:float = handMapPos[1];
        
        var _xM:float = _xM0 * BaseItem.PIXEL_SCALE;
        var _yM:float = _yM0 * BaseItem.PIXEL_SCALE; 
        var _thM:float = handMapPos[2]; 
    	
    	var optionalOffset = Vector3(0, 0, 0);
    	if (item.type == BaseItem.TYPE_SWORD) {
    		var _thOpt:float = _thM * Mathf.PI / 180;
    		var pos = -1.38;
    		optionalOffset = Vector3(pos * Mathf.Sin(_thOpt), 0, pos * Mathf.Cos(_thOpt));
    	} else if (item.type == BaseItem.TYPE_SHIELD) {
    		optionalOffset = Vector3(0, 0.2, 0);
    	}
    	
    	item.transform.localPosition = Vector3(-1 * _xM, 0, _yM) + optionalOffset; 
    	item.transform.localEulerAngles = Vector3(0, _thM, 0); 
	}
	 
	function getItemForEquip(itemName:String) { 
		var initiator = GameObject.Find("Initialize").GetComponent(StageInitiator);
		var item:BaseItem = initiator.createItemByName(x(), y(), itemName, true); 
		return item;
	};
	 
	function equipLeft(itemName:String) {
	    if(StageInitiator.ITEMS.ContainsKey(itemName)) {  
	    	 var item:BaseItem = getItemForEquip(itemName);
	    	 item.transform.parent = this.transform;
	    	 this.leftArm = item;
	    }
	}
	
	function equipRight(itemName:String) {
	    if(StageInitiator.ITEMS.ContainsKey(itemName)) {  
	    	 var item:BaseItem = getItemForEquip(itemName); 
	    	 item.transform.parent = this.transform;
	    	 this.rightArm = item;
	    }
	}
	
	function ejectLeft() {
	    //ToDo
	}
	
	function ejectRight() {
	    //ToDo
	}
	
	function x() {
		return transform.position.x;
	}
	
	function y() {
		return transform.position.z;
	}
	
	function restart(list:Point2D[], index:int) {
        var start = index % list.Length;
        var extra = (list.Length - start);
        var newList = new Point2D[list.Length];
        for (var x = 0; x < extra; x++){
        	newList[x] = list[x + start];
        }
        
        for (var y = extra; y < list.Length; y++){
        	newList[y] = list[y - extra];
        }
        return newList;
    }
        
	function pathToRandom() {
		var character = this; 
     	var context:AppContext = AppContext.getInstance();   
     	var result:Point2D[];
        var vectors:Point2D[] = [
            Point2D(1, 0),
            Point2D(0, -1),
            Point2D(-1, 0),
            Point2D(0, 1)
        ];

        var _vectors = vectors;
        _vectors = restart(vectors, Mathf.FloorToInt(Random.value * vectors.length)); 
        
        var temp = new Array(); 
        var mapPt = context.getMapPoint(character.transform.position);
        for (var j = 0; j < 10; j++) { 
        	var deadEnd = false;
            var mapHeight = context.map.GetLength(0);
            var mapWidth = context.map.GetLength(1);
            var vectorsSize = vectors.length;
            for (var i = 0; i < vectorsSize; i++) {
                var v = _vectors[i];
                var x = mapPt.x + v.x;
                var y = mapPt.y + v.y;
                if ((y <= 0) || (y >= mapHeight)
                    || (x <= 0) || (x >= mapWidth)
                    || (context.map[y, x] != null)) {
                    continue;
                } 
                 
                if (context.map[y, x] == null) {
	                for (var exists:Point2D in temp) { 
	                	if ((exists.x == x) && (exists.y == y)) { 
	                		deadEnd = true;
	                		break;
	                	}
	                } 
	                if(!deadEnd) {
	                	
	                	while(true) {
	                		mapPt = Point2D(x, y);
		                	temp.push(mapPt); 
	                		x = mapPt.x + v.x;
                			y = mapPt.y + v.y;
		                	if ((y <= 0) || (y >= mapHeight)
			                    || (x <= 0) || (x >= mapWidth)
			                    || (context.map[y, x] != null)) {
			                    break;
			                } 
	                	}
		                _vectors = restart(_vectors, i); 
	                }
	                break; 
                }
            }
        }
        
        result = temp.ToBuiltin(Point2D); 
        character.path = result;
        
        var _heavyTasks = new Array(context.heavyTasks);
        for(var i1 = 0; i1 < context.heavyTasks.Length; i1++){  
        	if (context.heavyTasks[i1] == this.stateId) {
        		_heavyTasks.RemoveAt(i1);
        	}
        }
        context.heavyTasks = _heavyTasks.ToBuiltin(String);
    }
    
    function pathToTargetByAStar(target:Vector3) {
        var maxDepth = 100;
     	var context:AppContext = AppContext.getInstance();  
        var depth = 0;

        var startNode = new Node(this.transform.position, target);
        var endNode = null;
        var mapHeight = context.map.GetLength(0);
        var mapWidth = context.map.GetLength(1);

        var openList = new NodeList();
        var closeList = new NodeList();
        startNode.fs = startNode.hs;
        openList.append(startNode);

        var vectors:Point2D[] = [
            Point2D(1, 0),
            Point2D(0, -1),
            Point2D(-1, 0),
            Point2D(0, 1)
        ];
        var vectorsSize:int = vectors.Length;

        while (true) {
            depth++;
            if (depth > maxDepth) {
                break;
            }

            if (openList.list.length == 0) {
                break;
            }
            var n = openList.minFs();
            if (n == null) {
                break;
            }
            openList.remove(n);
            closeList.append(n);


            if (n.isGoal()) {
                endNode = n;
                break;
            }

            var n_gs = n.fs - n.hs;

            for (var i = 0; i < vectorsSize; i++) {
                var v = vectors[i];
                var x = n.pos.x + v.x;
                var y = n.pos.y + v.y;
                if ((y < 0) || (y >= mapHeight)
                    || (x < 0) || (x >= mapWidth)
                    || (context.map[y, x] != null)) {
                    continue;
                }

                var m = openList.find(x, y);
                var dist = Mathf.Pow((n.pos.x - x), 2)
                    + Mathf.Pow((n.pos.y - y), 2);
                if (m) {
                    if (m.fs > n_gs + m.hs + dist) {
                        m.fs = n_gs + m.hs + dist;
                        m.parentNode = n;
                    }
                } else {
                    m = closeList.find(x, y);
                    if (m) {
                        if (m.fs > n_gs + m.hs + dist) {
                            m.fs = n_gs + m.hs + dist;
                            m.parentNode = n;
                            openList.append(m);
                            closeList.remove(m);
                        }

                    } else {
                        m = new Node(x, y, target);
                        m.fs = n_gs + m.hs + dist;
                        m.parentNode = n;
                        openList.append(m);
                    }
                }
            }
        }
        
        var list:Array = Array();
        if (endNode != null) {
            var n2:Node = endNode;
            while ((n2 != null) && (n2.parentNode != null)) {
                list.Unshift(n.pos);
                n2 = n2.parentNode;
            } 
            this.path = list;
        } else {
        	this.path = null;
        }
                 
        var _heavyTasks = new Array(context.heavyTasks);
        for(var i1 = 0; i1 < context.heavyTasks.Length; i1++){  
        	if (context.heavyTasks[i1] == this.stateId) {
        		_heavyTasks.RemoveAt(i1);
        	}
        }
        context.heavyTasks = _heavyTasks.ToBuiltin(String);
    }
	
	function prepareThrowWeapon(target: Vector2) {
	    var _this = this;
	    if (_this.rightArm && _this.rightArm.isThrowWeapon()) {
	        var deltaX = target.x - _this.x();
	        var deltaY = target.y - _this.y();
	        var theta = Mathf.Atan2(deltaY, deltaX);
	        _this.rightArm.range = Mathf.Sqrt(Mathf.Pow(deltaX, 2) + Mathf.Pow(deltaY, 2));
	        _this.rightArm.vX = _this.rightArm.speed * Mathf.Cos(theta) * BaseItem.PIXEL_SCALE;
	        _this.rightArm.vY = _this.rightArm.speed * Mathf.Sin(theta) * BaseItem.PIXEL_SCALE;
	        _this.rightArm.useCharacter = this;
	    }
	}
	
	// Override
	
	function Start() {
		var bodyAnim : AnimationContainer = new AnimationContainer();
		bodyAnim.animations = BaseCharacter.BODY_ANIMATION;
		bodyAnim.numX = 8;
		bodyAnim.numY = 4;
		
		this.initialize(bodyAnim, null, null);
		
		var head = GetComponentInChildren(BodyAnimation);
		head.ac = this.bodyAnim;
		var foot = GetComponentInChildren(LegAnimation);
		foot.ac = this.legAnim;
		this.bodyAnim.gotoAndStop("walk");
		var context:AppContext = AppContext.getInstance();
		context.addCharacter(this); 
		stateId = AppContext.uuid();
	}
	
	function Update(){	
		var controller : CharacterController = GetComponent(CharacterController);
		this.preUpdate();
		
		transform.rotation = Quaternion.Euler(0, (-180 - this.direction), 0);
		controller.Move(Vector3(this.vX, 1.0, this.vY));
		controller.Move(Vector3(0, -1 * transform.position.z, 0));	
	}
}	
