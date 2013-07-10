class BaseItem extends MonoBehaviour{ 

	var HP: int;
    var bonusPoint: int;
    var range: int;
    var speed:int;
    var type:String;
    var vX:float;
    var vY:float;
    var range2d:int[]; //radius x angle
    var useCharacter:BaseCharacter; 
    var frame = 0; 
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
            context.playSound("pickup");
            character.equipRight(_this.itemName);
        } else if(_this.type == BaseItem.TYPE_SHIELD) {
        	context.playSound("pickup");
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
}