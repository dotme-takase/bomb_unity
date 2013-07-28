class WoodenBoxBehaviour extends BaseObject {
	function Start(){
		this.MHP = this.HP = 1;
	}
	function die() {
		var _this = this;
    	_this.HP = 0;
    	var size = transform.lossyScale.z * 8;
		var half = size / 2;
		for (var i = 0; i < 32; i++) {
			var effect = StageInitiator.addEffect(_this.x() + Random.value * size - half, _this.y() + Random.value * size - half, "bomb");
			effect.yToCamera = transform.lossyScale.z * 1.5;
        }
        StageInitiator.playSound("bomb");
        Destroy(gameObject);
	}
}	
