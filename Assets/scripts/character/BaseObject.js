class BaseObject extends MonoBehaviour {
	var MHP = 20;
	var HP = MHP;
	var isPlayer = false; 
	var stateId:String = AppContext.uuid();
		
	function x() {
		return transform.position.x;
	}
	
	function y() {
		return transform.position.z;
	}
		
	function die() {
		var _this = this;
    	_this.HP = 0;
	}
		
	function Update(){	
		var _this = this;
		if (_this.HP <= 0) {
		        _this.die();
		}
	} 
}	
