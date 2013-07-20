class EffectAnimation extends TextureAnimation {
	var yToCamera = 2.0;
	var _position:Vector3;
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
		transform.position.y = 0;
		_position = transform.position;
	}
	
	function Update(){
		if(ac){
			ac.tick();
		}
		
		if( Camera.main ) {
			transform.position.y = 0;
			var vN:Vector3 = (Camera.main.transform.position - _position).normalized;
			transform.position = _position + vN * yToCamera;
			
			var v:Vector3 = Camera.main.transform.position - transform.position;
	        v.x = v.z = 0.0;
	        transform.LookAt(Camera.main.transform.position - v); 
	        
	         
        }
		super.Update();
	}
}