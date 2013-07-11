class EnemyMode {
    static public final var RANDOM_WALK = 1;
    static public final var ATTACK_TO_TARGET = 2;
    static public final var BYPASS_LEFT_TO_TARGET = 3;
    static public final var BYPASS_RIGHT_TO_TARGET = 4;
}

class Enemy1Behaviour extends BaseCharacter {
	
	var target:BaseCharacter = null;
	var aiWait:int = 0;
	var mode:int = EnemyMode.RANDOM_WALK;
	var path:Point2D[] = null;
	var nextToTarget:Point2D = null;
	
	function Start () {
		var bodyAnim : AnimationContainer = new AnimationContainer();
		bodyAnim.animations = BaseCharacter.BODY_ANIMATION;
		bodyAnim.numX = 8;
		bodyAnim.numY = 4;
		
		this.initialize(bodyAnim, "", "");
		var head = GetComponentInChildren(BodyAnimation);
		head.ac = this.bodyAnim;
		var foot = GetComponentInChildren(LegAnimation);
		foot.ac = this.legAnim;
		this.bodyAnim.gotoAndStop("walk");
	}
	
	function Update () {		
		super.Update();
	}
	
	function searchTarget() {
        var tempTarget = null;
        var tempDistance = 0;
        for (var other:BaseCharacter in context.characters) {
            if (other.teamNumber != this.teamNumber) {
                var otherDistance = Mathf.Sqrt(Mathf.Pow((other.transform.position.x - transform.position.x), 2)
                    + Mathf.Pow((other.transform.position.z - transform.position.z), 2));
                if (tempTarget) {
                    if (otherDistance < tempDistance) {
                        tempTarget = other;
                        tempDistance = otherDistance;
                    }
                } else {
                    tempTarget = other;
                    tempDistance = otherDistance;
                }
            }
        }
        if (tempTarget) {
            target =  tempTarget;
        }
    }
	
	function simpleAction() {
		var character = this;
		var context:AppContext = AppContext.getInstance();

        if (character.aiWait > 0) {
            character.aiWait--;
        }

        var deltaX:float;
        var deltaY:float;
        var range:float;
        var distance:float;
        var theta:float;
        var angleForTarget:float;
        
        var pathDeltaX:float;
        var pathDeltaY:float;
        var pathTheta:float;
        
        if (character.target) {
            deltaX = character.target.transform.position.x - character.transform.position.x;
            deltaY = character.target.transform.position.z - character.transform.position.z;
            range = character.target.transform.lossyScale.z / 2 + character.transform.lossyScale.z / 2;
            distance = Mathf.Sqrt(Mathf.Pow(deltaX, 2) + Mathf.Pow(deltaY, 2));
            theta = Mathf.Atan2(deltaY, deltaX);
            
            angleForTarget = ((theta - transform.localEulerAngles.y) * 180 / Mathf.PI) ;
        } else {
            theta = 0;
            angleForTarget = ((theta - transform.localEulerAngles.y) * 180 / Mathf.PI) - character.direction;
            searchTarget();
        }
        if (character.isAction && (character.action == CharacterAction.DAMAGE
            || character.action == CharacterAction.DEAD
            || character.action == CharacterAction.PARRIED)) {
            character.isWalk = false;
        } else {
            if (character.mode == EnemyMode.RANDOM_WALK) {
                if (!character.path) {
					if (character.target) {
	                    if (context.heavyTasks.length < 2) {
                            var _heavyTasks = new Array(context.heavyTasks);
                            _heavyTasks.push(character.stateId);
					        context.heavyTasks = _heavyTasks.ToBuiltin(String);
	                        character.path = pathToTargetByAStar(target.transform.position);
	                        if (character.path != null) {
	                            var _path = new Array(character.path);
                    			character.nextToTarget = _path.shift();
	                            character.path = _path.ToBuiltin(Point2D);
	                        }                                
	                    }
                    } else {
                    	character.path = pathToRandom();
                    	var _path0 = new Array(character.path);
                    	character.nextToTarget = _path0.shift();
                    	character.path = _path0.ToBuiltin(Point2D);
                    }
                }
                if (character.target) {
                    if ((distance < range * 5)
                        && (angleForTarget > -60) && (angleForTarget < 60)) {
                        character.mode = EnemyMode.ATTACK_TO_TARGET;
                    } else if (character.action == CharacterAction.DAMAGE) {
                        character.mode = EnemyMode.ATTACK_TO_TARGET;
                        character.direction = (theta * 180 / Mathf.PI);
                    }
                }

                if (character.mode != EnemyMode.ATTACK_TO_TARGET) {
                    character.isWalk = true;
                    if ((!character.target)
                        || (Random.value * 100 > 80)) {
                        //change to nearest target
                        searchTarget();
                    } else if(character.nextToTarget != null) {
                        var mapPt = context.getMapPoint(character.transform.position);
                        if ((character.nextToTarget.x == mapPt.x)
                            && (character.nextToTarget.y == mapPt.y)) {
                            var _path1 = new Array(character.path);
                    		character.nextToTarget = _path1.shift();
	                        character.path = _path1.ToBuiltin(Point2D);
                        }
                        if (character.nextToTarget) {
                            var _deltaX = (character.nextToTarget.x + 0.5) * context.tileSize - character.transform.position.x;
                            var _deltaY = (character.nextToTarget.y + 0.5) * context.tileSize - character.transform.position.z;
                            var _theta = Mathf.Atan2(_deltaY, _deltaX);
                            character.direction = (_theta * 180 / Mathf.PI);
                        }
                    }
                    if (character.path.length == 0) {
                        character.path = null;
                    }
                }
            } else if (character.mode == EnemyMode.ATTACK_TO_TARGET) {
                var inRange = (distance < range + character.rightArm.range);
                if (character.rightArm.isThrowWeapon()) {
                	var mPt1 = character.context.getMapPoint(character.transform.position);
                	var mPt2 = character.context.getMapPoint(character.target.transform.position);
                	var rand = Random.value * 1.5;
                    inRange = (((mPt1.x == mPt2.x) || (mPt1.y == mPt2.y))
                    		&& (distance < range + character.transform.lossyScale.z * (1.5 + rand)));
                }
                if (character.target.HP <= 0) {
                    character.mode = EnemyMode.RANDOM_WALK;
                } else if (inRange || (character.action == CharacterAction.ATTACK)) {
                    var dice = Random.value * 4;
                    if (!character.isAction) {
                        character.isWalk = false;
                        character.isAction = true;
                        character.action = CharacterAction.DEFENCE_MOTION;
                        character.aiWait = Mathf.Max((10 - character.speed) + Mathf.RoundToInt(dice), 0);
                    } else {
                        if (character.isWalk) {
                            character.action = CharacterAction.NONE;
                            character.isAction = false;
                        }
                        if ((character.action == CharacterAction.DEFENCE)
                            || (character.action == CharacterAction.DEFENCE_MOTION)) {
                            if (character.aiWait <= 0) {
                                character.action = CharacterAction.ATTACK;
                            }
                        }
                    }
                } else {
                    character.isWalk = true;
                }
                character.direction = (theta * 180 / Mathf.PI);
                if (distance > range * 5) {
                    character.mode = EnemyMode.RANDOM_WALK;
                }
            }
        }
    }
}