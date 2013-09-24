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

class BaseCharacter extends BaseObject {
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
	
	var initialize = function(rightArmName, leftArmName) {
		var _this = this;
	    if (rightArmName != null ) {  
	    	equipRight(rightArmName);
	    }
	    
	    if (leftArmName != null) {  
	    	equipLeft(leftArmName);
	    }
	    
	    _this.transform.localScale = Vector3(_this.transform.localScale.x * _this.scale, _this.transform.localScale.y, _this.transform.localScale.z * _this.scale); 
	    _this.transform.position += Vector3.up * _this.transform.position.y * _this.scale;
	};
	
	var context :AppContext = AppContext.getInstance();
	
	var leftArm:BaseItem = null;
	var rightArm:BaseItem = null;
	var itemThrownName:String = null;
	var itemThrownMaxCount:int = 0;
	var itemThrownCount:int = 0;

	var handMap = HANDMAP_STANDARD;
	var scale:float = 1.0;
	var speed = 4;
	var direction = 90;
	var axisX:float = 0;
	var axisY:float = 0;
	var vX:float = 0;
	var vY:float = 0;
	var isAction = false;
	var action = CharacterAction.NONE;
	var parriedCount = 0;
	var isAttackFrame = false;
	var isWalk = false;
	var teamNumber = 0;
	var clientTime = 0;
	var dropList:Hashtable;
	var damageLoop = 0;
	
	var target:BaseCharacter = null;
	var path:Point2D[] = null;
	var nextToTarget:Point2D = null;
	var currentAnimation = "";
	var frameWaited = false;
	
	var onAnimationEnd:Hashtable = new Hashtable();
	
	var onAttackStart = function(){
	};
	
	function playAnimation(clip:String, callback:function()) {
		playAnimationWithNormalizedStartTime(clip, callback, 0.0);
	}
	
	function playAnimationWithNormalizedStartTime(clip:String, callback:function(), time:float) {
		if (animation[clip] != null) {
			if(time > 0.0) {
				animation[clip].normalizedTime = time;
			}
			animation.Play(clip);
			currentAnimation = clip;
			var length:float = animation[clip].length;
			var waitTime:float = length * (1.0 - time);
			if (callback != null) {
				var callbackId = AppContext.uuid();
				this.onAnimationEnd[callbackId] = callback;
				StartCoroutine(callOnAnimationEnd(waitTime, callbackId));
			} 
		}
	}
	
	function callOnAnimationEnd(waitTime:float, callbackId:String){
		yield WaitForSeconds (waitTime);
		if (this.onAnimationEnd[callbackId] != null) {
			var callback:function() = this.onAnimationEnd[callbackId];
			callback();
			this.onAnimationEnd.Remove(callbackId);
			currentAnimation = "";
		}
	}
	
	function callOnAttackStart(waitTime:float){
		yield WaitForSeconds (waitTime);
		if (this.onAttackStart != null) {
			this.onAttackStart();
			this.onAttackStart = null;
		}
	}
	
	function die() {
		var _this = this;
    	_this.HP = 0;
    	_this.action = CharacterAction.DEAD;
    	_this.onModifyData();
		
		if (_this.dropList && (Mathf.FloorToInt(Random.value * 100) < 90)) {
	        var rateSum:int = 0;
	        var rateMap:Hashtable = new Hashtable();
	        for (var k:String in _this.dropList.Keys) {  
	        	var rate:int = _this.dropList[k];  
	        	rateSum += rate;
	            rateMap[rateSum] = k;
	        }
	        var dice:int = Mathf.FloorToInt(Random.value * rateSum);
	        for (var k2:int in rateMap.Keys) {
	            if (dice < k2) { 
	            	var initiator = GameObject.Find("Initialize").GetComponent(StageInitiator);			
	                var dropItem = 
	                		initiator.createItemByName(_this.transform.position.x, 
            										 _this.transform.position.z,
            									  	 rateMap[k2], false); 
		            dropItem.dropFlag = true; 
		            dropItem.transform.position += Vector3.up * 2;
	                break;
	            }
	        }
	    }
	}
	
	function actionDamage(value:int) {
		this.isAction = true;
        this.action = CharacterAction.DAMAGE; 
        this.HP -= value;                             
		StageInitiator.addEffect(transform.position.x, transform.position.z, "damage");
		StageInitiator.playSound("hit");
	}
	
	function preUpdate() {	
		var _this = this; 
		var _onAnimationEnd = null;
		var controller : CharacterController = GetComponent(CharacterController);
		if (_this.HP <= 0) {
	        _this.die();
	    }
		_this.vX = _this.vY = 0; 
		
		if (_this.isWalk || (_this.action != CharacterAction.ATTACK)) { 
			if (_this.itemThrownName 
				&& _this.rightArm == null
				&& (_this.itemThrownCount < _this.itemThrownMaxCount)) { 
        		_this.equipRight(_this.itemThrownName);  
        	}
		} 
		
	    if (_this.isWalk) {
	        if (_this.currentAnimation != "run") {
	        	_this.playAnimation("run", null); 
	        }
	        
	        _this.vX = Mathf.Cos(_this.direction * Mathf.PI / 180) * _this.speed * 0.08;
	        _this.vY = Mathf.Sin(_this.direction * Mathf.PI / 180) * _this.speed * 0.08;
	    } else if (_this.isAction) {
	        if (_this.action == CharacterAction.DAMAGE) {
	            if (_this.currentAnimation != "damaged") {
	                _onAnimationEnd = function () {
	                	_this.vX = _this.vY = 0;
	                    _this.action = CharacterAction.NONE;
	                };
	                _this.playAnimation("damaged", _onAnimationEnd);
	            }
	        } else if (_this.action == CharacterAction.PARRIED) {
	        	// ToDo
	            if (_this.currentAnimation != "damaged") {
	                if (_this.parriedCount > 0) {
	                    StageInitiator.addEffect(transform.position.x, transform.position.z, "parried");
	                }
	                _onAnimationEnd = function () {
						_this.vX = _this.vY = 0;
	                	_this.action = CharacterAction.NONE;
	                };
	                _this.playAnimation("damaged", _onAnimationEnd);
	            } 
	        } else if (_this.action == CharacterAction.DEAD) {
	            var size = transform.lossyScale.z * 4;
	            var half = size / 2;
	            for (var i = 0; i < 8; i++) {
	                StageInitiator.addEffect(_this.x() + Random.value * size - half, _this.y() + Random.value * size - half, "dead");
	            }
	            StageInitiator.playSound("defeat");
	            _this.context.removeCharacter(_this);
	            Destroy(_this.gameObject);
	        } else if (_this.action == CharacterAction.DEFENCE_MOTION) {
	        	//ToDo
	            if (_this.currentAnimation != "normal") { 
	                _onAnimationEnd = function () {
	                    _this.vX = _this.vY = 0;
	                    _this.action = CharacterAction.DEFENCE;
	                    _this.playAnimation("normal", _onAnimationEnd);
	                };
	                _this.playAnimation("normal", null);
	            } 
	        } else if (_this.action == CharacterAction.DEFENCE) {
	
	        } else if (_this.action == CharacterAction.ATTACK) {
	 			var startY: float = _this.transform.position.y + controller.center.y;
	 			if ((_this.currentAnimation == null)
	                || ((_this.currentAnimation != "attack")
	                	&& (_this.currentAnimation != "throw"))) {
	                _onAnimationEnd = function () {		                	
	                    if (_this.action != CharacterAction.ATTACK) {
	                        return;
	                    }
	                    _this.isAttackFrame = false;
	                    _this.vX = _this.vY = 0;
	                    _this.action = CharacterAction.NONE;
	                };
	                if (_this.rightArm && _this.rightArm.isThrowWeapon()) {
	                	if (_this.isPlayer){
	                		_this.prepareThrowWeaponByAxis(_this.axisX, _this.axisY, startY);
	                	} else if(_this.target) {
	                		_this.prepareThrowWeapon(Vector2(_this.target.x(), _this.target.y()), startY);
	                	} else {
	                		_this.prepareThrowWeapon(Vector2(Mathf.Cos(_this.direction * Mathf.PI / 180) * _this.context.tileSize + _this.x(), 
	                										Mathf.Sin(_this.direction * Mathf.PI / 180) * _this.context.tileSize + _this.y()),
	                										startY);
	                	}		          	
	                	
	                    if (_this.rightArm.range > _this.context.tileSize * 3) {
	                    	_this.playAnimationWithNormalizedStartTime("throw", _onAnimationEnd, 0.2);
	                    } else if (_this.rightArm.range > _this.context.tileSize * 2) {
	                        _this.playAnimationWithNormalizedStartTime("throw", _onAnimationEnd, 0.4);
	                    } else {
	                        _this.playAnimationWithNormalizedStartTime("throw", _onAnimationEnd, 0.5);
	                    }
	                    
	                    _this.onAttackStart = function() { 
		            		var armDirection:Vector3 = 
		            					Vector3(_this.rightArm.vX, _this.rightArm.vY ,_this.rightArm.vZ); 
							var forceDirection:Vector3 = armDirection * 25;                    									  
                    									
 							_this.itemThrownCount++;
 							_this.itemThrownName = _this.rightArm.itemName;
                    			
                    		var initiator = GameObject.Find("Initialize").GetComponent(StageInitiator);			
		            		var armClone = initiator.createItemByName(_this.transform.position.x + armDirection.x, 
		            													_this.transform.position.z + armDirection.z,
		            													_this.itemThrownName, true); 
		            													
		            		armClone.vX = armDirection.x;
			                armClone.vY = armDirection.z;
			                armClone.thrownTime = 0;
			                armClone.useCharacter = _this; 
			                    
			                armClone.transform.position = _this.rightArm.gameObject.transform.position + armDirection;
			                armClone.transform.position.y = startY;
			                    
			                var mapPoint = context.getMapPoint(armClone.transform.position); 
	                        var block:String = null;
	                        if ((mapPoint.y > 0 && mapPoint.y < context.map.GetLength(0)) 
	                        	&& (mapPoint.x > 0 && mapPoint.x < context.map.GetLength(1))) {
	                        	block = context.map[mapPoint.y, mapPoint.x]; 
	                        }
	                        if (block) {
	                        	armClone.transform.position -= armDirection * 2;
	                        }
	                        
			                armClone.collider.isTrigger = false;
			                armClone.rigidbody.AddForce(forceDirection, ForceMode.VelocityChange);
			                armClone.rigidbody.useGravity = true; 
			                    
			                Destroy(_this.rightArm.gameObject);                 									
                    		_this.rightArm = null;	
		            	};
						StartCoroutine(callOnAttackStart(_this.animation["throw"].length * 0.85 
														* (1.0 - _this.animation["throw"].normalizedTime)));
	                } else if (_this.rightArm) {
		                var weaponSpeed = _this.rightArm.speed;
		                if (weaponSpeed >= 2) {
		                    _this.playAnimationWithNormalizedStartTime("attack", _onAnimationEnd, 0.7);
		                } else if (weaponSpeed == 1) {
		                    _this.playAnimationWithNormalizedStartTime("attack", _onAnimationEnd, 0.6);
		                } else if (weaponSpeed == -1) {
		                    _this.playAnimationWithNormalizedStartTime("attack", _onAnimationEnd, 0.3);
		                } else if (weaponSpeed <= -2) {
		                    _this.playAnimationWithNormalizedStartTime("attack", _onAnimationEnd, 0.1);
		                } else {
		                    _this.playAnimationWithNormalizedStartTime("attack", _onAnimationEnd, 0.5);
		                }
		                if (_this.rightArm ) {
		                	StageInitiator.playSound("attack");
		                }
		            } else {
		            	this.isAttackFrame = false;
	                    _this.vX = _this.vY = 0;
	                    _this.action = CharacterAction.NONE;
		            }
	            }
	        } else if (_this.action == CharacterAction.NONE) {
	            _this.isAction = false;
	            _this.vX = _this.vY = 0;
	            _this.playAnimation("normal", null);     //animate
	        }
	    } else {   	
	        _this.isAction = false;
	        _this.vX = _this.vY = 0;
	        _this.playAnimation("normal", null);     //animate
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
		ejectLeft();
	    if(StageInitiator.ITEMS.ContainsKey(itemName)) {  
	    	 var item:BaseItem = getItemForEquip(itemName);
	    	 item.transform.parent = this.transform;
	    	 this.leftArm = item; 
	    	 item.useCharacter = this;
	    }
	}
	
	function equipRight(itemName:String) {  
		var oldItemThrownName = this.itemThrownName;
		ejectRight(); 
	    if(StageInitiator.ITEMS.ContainsKey(itemName)) {  
	    	 var item:BaseItem = getItemForEquip(itemName); 	    	
             if (this.rightArm) { 
             	if (item.itemName != this.rightArm.itemName) {  
             		this.itemThrownMaxCount = item.thrownMaxCount;
             	}
             } else if (oldItemThrownName == null || item.itemName != oldItemThrownName){ 
             	 this.itemThrownMaxCount = item.thrownMaxCount;
             } 
             var handR = transform.Find("rig/root/MCH-upper_arm_R_socket2/MCH-upper_arm_R_hinge/upper_arm_R/forearm_R/hand_R/hand_R_equip000");
             item.rigidbody.constraints = RigidbodyConstraints.FreezePositionX
             						 | RigidbodyConstraints.FreezePositionY
             						 | RigidbodyConstraints.FreezePositionZ;
             
             if(handR != null) {
	    	 	item.transform.parent = handR;
	    	 	item.transform.localPosition = Vector3.zero + Vector3.left * 0.3;
	    	 } else {
	    	 	item.transform.parent = this.transform;
	    	 }
	    	 
	    	 this.itemThrownName = itemName;
	    	 this.rightArm = item;
	    	 item.useCharacter = this;
	    }
	}
	
	function ejectLeft() {
	     if(this.leftArm) {   
	     	Destroy(this.leftArm.gameObject); 
	    	this.leftArm = null; 
	     }
	}
	
	function ejectRight() {  
		this.itemThrownName = null;
		if(this.rightArm) {   
	     	Destroy(this.rightArm.gameObject); 
	    	this.rightArm = null; 
	    }
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
    
    function prepareThrowWeaponByAxis(deltaX:float, deltaY:float, startY:float) {
	    var _this = this;
	    if (_this.rightArm && _this.rightArm.isThrowWeapon()) {
	        var theta:float = Mathf.Atan2(deltaY, deltaX);
	        var range:float = Mathf.Sqrt(Mathf.Pow(deltaX, 2) + Mathf.Pow(deltaY, 2));
	        var theta2:float = Mathf.Atan2(startY, range);
	        _this.rightArm.range = range;
	        
	        _this.rightArm.vX = _this.rightArm.speed * Mathf.Cos(theta) * BaseItem.PIXEL_SCALE;
	        _this.rightArm.vY = -1 * _this.rightArm.speed * Mathf.Sin(theta2) * BaseItem.PIXEL_SCALE;
	        _this.rightArm.vZ = _this.rightArm.speed * Mathf.Sin(theta) * BaseItem.PIXEL_SCALE;
	        
	        /* cheap workaround             */
	        var kY:float = range - 24.0;
	        _this.rightArm.vY += kY * 0.02;
	        /********************************/
	        
	        _this.rightArm.useCharacter = this;
	    }
	}
	
	function prepareThrowWeapon(target: Vector2, startY:float) {
	    var _this = this;
        var deltaX = target.x - _this.x();
        var deltaY = target.y - _this.y();
        prepareThrowWeaponByAxis(deltaX, deltaY, startY);
	}
	 
	 
	function onModifyData(){
	} 
	// Override
	
	function Start() {
		this.playAnimation("normal", null);
		this.initialize(null, null);
		var context:AppContext = AppContext.getInstance();
		context.addCharacter(this); 
		stateId = AppContext.uuid();
	}
	
	function Update(){	
		var controller : CharacterController = GetComponent(CharacterController);
		this.preUpdate();
		
		transform.rotation = Quaternion.Euler(0, (90 - this.direction), 0);
		controller.Move(Vector3(this.vX, 1.0, this.vY));
		controller.Move(Vector3(0, -1 * transform.position.z, 0));	
	} 
}	
