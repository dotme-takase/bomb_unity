class Enemy1Behaviour extends BaseCharacter {
	
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
	
	function simpleAction() {
        var _this = this;
        var context = _this.context;
 
    }
}