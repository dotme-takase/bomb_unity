class EffectAnimation extends TextureAnimation{
	static var EFFECT_ANIMATIONS =  {
            'damage': [0, 4],
            'parried': [5, 9],
            'heal': [10, 24],
            'dead': [25, 39],
            'fire': [40, 49],
            'bomb': [50, 69]
    };
    
	function initialize(name:String) {
		ac = new AnimationContainer();
		ac.animations = EFFECT_ANIMATIONS;
		ac.numX = 5;
		ac.numY = 16;
		ac.gotoAndPlay(name);
		ac.onAnimationEnd = function(){
			Destroy(gameObject);
		};
	}
	
	function Update(){
		if(ac){
			ac.tick();
		}
		super.Update();
	}
}