class BaseItem extends MonoBehaviour{ 

	var HP: int;
    var bonusPoint: int;
    var range: float;
    var speed:int;
    var type:String;
    var vX:float;
    var vY:float;
    var range2d:int[]; //radius x angle
    var useCharacter:BaseCharacter; 
    var frame = 0; 
    var thrownTime:float = -1;
    var itemName:String = "";

    function initialize(options:Hashtable) { 
    	if (options.ContainsKey("HP")) { 
    		 this.HP = options["HP"];
    	} else { 
    		 this.HP = 0;
    	}
    	
    	if (options.ContainsKey("bonusPoint")) { 
    		 this.bonusPoint = options["bonusPoint"];
    	} else { 
    		 this.bonusPoint = 0;
    	}
    	
    	if (options.ContainsKey("range")) { 
    		 this.range = options["range"];
    	} else { 
    		 this.range = 0;
    	}
    	
    	if (options.ContainsKey("speed")) { 
    		 this.speed = options["speed"];
    	} else { 
    		 this.speed = 0;
    	}
    	
    	if (options.ContainsKey("type")) { 
    		 this.type = options["type"];
    	} else { 
    		 this.type = "";
    	}
    	
    	if (options.ContainsKey("range2d")) { 
    		 this.range2d = options["range2d"];
    	} else { 
    		 this.range2d = [0, 0];
    	}
    	
    	if (options.ContainsKey("frame")) { 
    		 this.frame = options["frame"];
    	} else { 
    		 this.frame = 0;
    	}
    }

    public static final var TYPE_SWORD = "sword";
    public static final var TYPE_SHIELD = "shield";
    public static final var TYPE_MISC = "misc"; 
    public static final var TYPE_BULLET = "bullet";
    public static final var TYPE_BOMB = "bomb";
    public static final var TYPE_BOMB_TIMER = "bombTimer";
    public static final var TYPE_BOMB_REMOTE = "bombRemote";
 
 	public static final var PIXEL_SCALE:float = 0.0625;
 	public static final var SWORDS_NUM_X:int = 16;
 	public static final var SWORDS_NUM_Y:int = 1;
 	
 	public static final var SHIELDS_NUM_X:int = 16;
 	public static final var SHIELDS_NUM_Y:int = 2;
  
  	public static final var ITEMS_NUM_X:int = 16;
 	public static final var ITEMS_NUM_Y:int = 2;
  
    var onPick = function (character:BaseCharacter) {
        var _this:BaseItem = this; 
        var context = AppContext.getInstance();
        
        if(_this.type == BaseItem.TYPE_SWORD
        || _this.type == BaseItem.TYPE_BOMB
        || _this.type == BaseItem.TYPE_BOMB_REMOTE) {
            StageInitiator.playSound("pickup");
            character.equipRight(_this.itemName);
        } else if(_this.type == BaseItem.TYPE_SHIELD) {
        	StageInitiator.playSound("pickup");
            character.equipLeft(_this.itemName);
        } else {
            _this.onUse(character, character);
        }
         
        var _dropItems = new Array(context.dropItems);
        for (var k:int = 0; k < context.dropItems.Length ; k++) {
            if (_this == context.dropItems[k]) {
                _dropItems.RemoveAt(k);
                break;
            }
        } 
        context.dropItems =  _dropItems;
        Destroy(_this.gameObject);
    }; 
    
    var isThrowWeapon = function () {
        var _this = this;
        return (_this.type == BaseItem.TYPE_BOMB
            || _this.type == BaseItem.TYPE_BOMB_REMOTE
            || _this.type == BaseItem.TYPE_BOMB_TIMER);
    };

    var drop = function (x:float, y:float) {
    	var context = AppContext.getInstance();
       //ToDo
    };

    var onUse = function (character:BaseCharacter, target:BaseCharacter) {
        var _this = this;
        if(_this.type == BaseItem.TYPE_SHIELD) {
            var damage = Mathf.Ceil(Random.value * 5 + 5);
            character.HP -= Mathf.Max(0, (damage - _this.bonusPoint * 2));
            _this.HP -= Mathf.Max(0, damage - _this.bonusPoint);
            if (_this.HP <= 0) {
                character.ejectLeft();
            }
        }
    };
    
    function x() {
		return transform.position.x;
	}
	
	function y() {
		return transform.position.z;
	}
    
    function bomb() { 
    	var context = AppContext.getInstance();
        if (this.type == BaseItem.TYPE_BOMB
            || this.type == BaseItem.TYPE_BOMB_REMOTE
            || this.type == BaseItem.TYPE_BOMB_TIMER) {
            var damagedStateId = new Array();
            if (range2d.length == 2) { 
            	var _range2d:float[] = new float[2]; 
            	_range2d[0] = range2d[0] * PIXEL_SCALE;
            	_range2d[1] = range2d[1];
            	
                var bStep1 = context.tileSize / 4;
                for (var b2 = 1; b2 <= _range2d[1]; b2++) {
                    for (var b1 = 0; b1 <= _range2d[0]; b1 += bStep1) {
                        var bAngle = ((Mathf.PI * 2 * b2) / _range2d[1]);
                        var bX = b1 * Mathf.Cos(bAngle) + this.x();
                        var bY = b1 * Mathf.Sin(bAngle) + this.y();
                        var mapPoint = context.getMapPoint(Vector3(bX, 0, bY)); 
                        var block:String = null;
                        if ((mapPoint.y > 0 && mapPoint.y < context.map.GetLength(0)) 
                        	&& (mapPoint.x > 0 && mapPoint.x < context.map.GetLength(1))) {
                        	block = context.map[mapPoint.y, mapPoint.x]; 
                        }
                        if (block == null) {
                            StageInitiator.addEffect(bX, bY, "bomb");
                            for (var other in context.characters) {
                                if (!other.isPlayer && (this.useCharacter.stateId == other.stateId)){
                                	continue;
                                } 
                                var contains = false;
                                for(var _stateId in damagedStateId) {
                                	if( other.stateId == _stateId ) { 
                                		contains = true;
                                		break;
                                	} 
                                }
                                if (!contains) {
                                    var deltaX = other.x() - bX;
                                    var deltaY = other.y() - bY;
                                    var range = (other.transform.lossyScale.z) * 4;
                                    var distance = Mathf.Sqrt(Mathf.Pow(deltaX, 2) + Mathf.Pow(deltaY, 2));
                                    if (distance <= range) {
                                        var theta = Mathf.Atan2((other.y() - this.y()), (other.x() - this.x()));
                                        var angleForObj = (theta * 180 / Mathf.PI) - 180 - other.direction;
                                        angleForObj = AppContext.fixAngle(angleForObj);
                                        if ((other.isAction && (other.action == CharacterAction.DEFENCE)
                                            && (other.leftArm != null && other.leftArm.type == BaseItem.TYPE_SHIELD))
                                            && ((angleForObj > -30) && (angleForObj < 30))) {
                                            other.leftArm.onUse(this.useCharacter, other);
                                        } else if (!other.isAction || (other.action != CharacterAction.DAMAGE)) {
                                            var kickBackRange = -1 * Random.value * range / 4;
                                            other.vX -= Mathf.Cos(theta) * kickBackRange;
                                            other.vY -= Mathf.Sin(theta) * kickBackRange;
                                            other.isAction = true;
                                            other.action = CharacterAction.DAMAGE;
                                            other.HP -= Mathf.CeilToInt(this.bonusPoint * (Random.value * 0.20 + 1));
											 
											//ToDo
                                        }
                                    }
                                }
                            }
                        } else {
                            //break;
                        }
                    }
                }
                StageInitiator.playSound("bomb");
            }
            Destroy(this.gameObject);
        }
    }
    
    //Override
    function Update(){
    	if( thrownTime == 0 ) {
    		thrownTime = Time.time;
    	} else if ( thrownTime > 0) {
    		if ((Time.time - thrownTime) > 1) { 
	    		if (this.type == BaseItem.TYPE_BOMB_TIMER ) { 
	    			 this.bomb();
	    		} 
    		}
    	}
    }
    
    function OnCollisionEnter (collision : Collision) {
    	if( thrownTime > 0 ) {  
    		rigidbody.useGravity = true;
    		if ( this.type == BaseItem.TYPE_BOMB ) { 
    			this.bomb();
    		} else if (collision.gameObject.transform.position.y <= 0.5) { 
    			var f:Vector3  = -(rigidbody.mass * rigidbody.velocity); 
    			rigidbody.AddForce(f, ForceMode.Impulse); 
    		}
    	}
    }
}