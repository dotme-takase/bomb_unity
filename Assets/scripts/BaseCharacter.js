class BaseCharacter{
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
	
	
	
	static public var CharacterAction = {
	    'NONE': 0,
	    'DEFENCE_MOTION': 1,
	    'DEFENCE': 2,
	    'ATTACK': 3,
	    'PARRIED': 4,
	    'DAMAGE': 5,
	    'DEAD': 6
	};
	
	var initialize = function(bodyAnim) {
		var _this = this;
		_this.bodyAnim = bodyAnim;
	    if (_this.bodyAnim) {
	    	_this.legAnim = _this.bodyAnim.clone();
	    }
	};
	
	var context = null;
	var bodyAnim :AnimationContainer = null;
	var legAnim  :AnimationContainer = null;
	var handMap = HANDMAP_STANDARD;
	var speed = 10;
	var direction = 90;
	var vX = 0;
	var vY = 0;
	var isAction = false;
	var action = CharacterAction['NONE'];
	var parriedCount = 0;
	var attackFrame = 0;
	var isWalk = false;
	var HP = 20;
	var teamNumber = 0;
	var clientTime = 0;
	var dropList = [];
	var isPlayer = false;
	var updateFrame = function () {	
		var _this = this; 
		if (_this.bodyAnim && _this.legAnim) {	    
			var maxFrame = _this.bodyAnim.numX * _this.bodyAnim.numY / 2;
		    if (_this.bodyAnim.currentFrame >= maxFrame) {
		        _this.bodyAnim.gotoAndStop(maxFrame - 1);
		    }
		    _this.bodyAnim.tick();
		    _this.legAnim.currentFrame = (_this.bodyAnim.currentFrame + maxFrame);
	    }
	};
}	
