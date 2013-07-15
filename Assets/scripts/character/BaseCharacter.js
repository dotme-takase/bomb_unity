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

	var handMap = HANDMAP_STANDARD;
	var speed = 10;
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
	
	function die() {
	//ToDo
	}
	
	function preUpdate() {	
		var _this = this; 
		if (_this.bodyAnim && _this.legAnim) {
			if (_this.HP <= 0) {
		        _this.die();
		    }
			_this.vX = _this.vY = 0;
		    if (_this.isWalk) {
		        _this.bodyAnim.isStopped = false;
		        _this.bodyAnim.gotoAndPlay("walk"); 
		        _this.bodyAnim.isLooping = true;
		        
		        _this.vX = Mathf.Cos(_this.direction * Mathf.PI / 180) * _this.speed * 0.05;
		        _this.vY = Mathf.Sin(_this.direction * Mathf.PI / 180) * _this.speed * 0.05;
		    } else if (_this.isAction) {
		        if (_this.action == CharacterAction.DEFENCE_MOTION) {
		            if (_this.bodyAnim.currentAnimation != "defence") {
		                _this.bodyAnim.gotoAndPlay("defence");
		                _this.bodyAnim.onAnimationEnd = function () {
		                    _this.vX = _this.vY = 0;
		                    _this.action = CharacterAction.DEFENCE;
		                    _this.bodyAnim.gotoAndStopFrame(_this.bodyAnim.currentAnimation[1]);
		                    _this.bodyAnim.isStopped = true;
		                };
		            }
		            _this.vX = Mathf.Cos(_this.direction * Mathf.PI / 180) * -2;
		            _this.vY = Mathf.Sin(_this.direction * Mathf.PI / 180) * -2;
		        } else if (_this.action == CharacterAction.DEFENCE) {
		
		        } else if (_this.action == CharacterAction.PARRIED) {
		            if (_this.bodyAnim.currentAnimation != "parried") {
		                _this.bodyAnim.gotoAndPlay("parried");
		                if (_this.parriedCount > 0) {
		                    _this.context.addEffect(transform.position.x, transform.position.z, "parried");
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
		                _this.context.playSound("parried");
		            }
		            _this.vX = Mathf.Cos(_this.direction * Mathf.PI / 180) * -1;
		            _this.vY = Mathf.Sin(_this.direction * Mathf.PI / 180) * -1;
		        } else if (_this.action == CharacterAction.DAMAGE) {
		            if (_this.bodyAnim.currentAnimation != "damage") {
		                _this.bodyAnim.gotoAndPlay("damage");
		                _this.context.addEffect(transform.position.x, transform.position.z, "damage");
		                _this.bodyAnim.onAnimationEnd = function () {
		                    _this.vX = _this.vY = 0;
		                    _this.action = CharacterAction.NONE;
		                };
		                _this.context.playSound("hit");
		            }
		        } else if (_this.action == CharacterAction.DEAD) {
		            //ToDo
		        } else if (_this.action == CharacterAction.ATTACK) {
		 			_this.attackFrame = _this.bodyAnim.currentAnimationFrame; 
		 			//ToDo
		 			if ((_this.bodyAnim.currentAnimation == null)
		                || (!_this.bodyAnim.currentAnimationName.Contains("attack"))) {
		                _this.bodyAnim.gotoAndPlay("attack");
		                _this.bodyAnim.onAnimationEnd = function () {
		                    if (_this.action != CharacterAction.ATTACK) {
		                        return;
		                    }
		                    _this.attackFrame = 0;
		                    _this.vX = _this.vY = 0;
		                    _this.action = CharacterAction.NONE;
		                };
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
