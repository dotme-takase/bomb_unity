class CharacterAction {
	static public final var NONE = 0;
	static public final var DEFENCE_MOTION = 1;
	static public final var DEFENCE = 2;
	static public final var ATTACK = 3;
	static public final var PARRIED = 4;
	static public final var DAMAGE = 5;
	static public final var DEAD = 6;
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
	
	var initialize = function(bodyAnim) {
		var _this = this;
		_this.bodyAnim = bodyAnim;
	    if (_this.bodyAnim) {
	    	_this.legAnim = _this.bodyAnim.clone();
	    }
	};
	
	var context :AppContext = AppContext.getInstance();
	var bodyAnim :AnimationContainer = null;
	var legAnim  :AnimationContainer = null;
	
	var leftArm = null;
	var rightArm = null;	

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
		                    _this.context.addEffect(transform.position.x, transform.position.y, "parried");
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
		                _this.context.addEffect(transform.position.x, transform.position.y, "damage");
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
		
		    if (_this.rightArm) {
		        var handMapPos = _this.handMap[0][_this.bodyAnim.currentFrame];
		        //ToDo
		    }
		
		    if (_this.leftArm) {
		        var lhandMapPos = _this.handMap[1][_this.bodyAnim.currentFrame];
		        //ToDo
		    }

			var maxFrame = _this.bodyAnim.numX * _this.bodyAnim.numY / 2;
		    if (_this.bodyAnim.currentFrame >= maxFrame) {
		        _this.bodyAnim.gotoAndStopFrame(maxFrame - 1);
		    }
		    _this.bodyAnim.tick();
		    _this.legAnim.currentFrame = (_this.bodyAnim.currentFrame + maxFrame);
	    }
	}
	
	// Override
	function Update(){	
		var controller : CharacterController = GetComponent(CharacterController);
		this.preUpdate();
		
		transform.rotation = Quaternion.Euler(0, (-180 - this.direction), 0);
		controller.Move(Vector3(this.vX, 0, this.vY));
		controller.Move(Vector3(0, -1 * transform.position.y, 0));	
	}
}	
