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
		yToCamera = 4.0;
		_position = transform.position;
	}
	
    function x() {
		return transform.position.x;
	}
	
	function y() {
		return transform.position.z;
	}
	
	function Update(){
		if(ac){
			ac.tick();
		}
		
		if( Camera.main ) {
			var mainCamera = Camera.main;
		
			transform.position.y = 0.0;
			var vN:Vector3 = (mainCamera.transform.position - _position).normalized;
			transform.position = _position + vN * yToCamera;
			
			
	        var vec = mainCamera.transform.forward;
	        vec.Normalize();
	        this.transform.LookAt(this.transform.position + 
	        	mainCamera.transform.rotation * Vector3.down,
	        	mainCamera.transform.rotation * Vector3.back);
	        
        }
		super.Update();
	}
	
	var onTrigger = function(other:BaseObject){};
	var triggerMaxAnimationFrame = 0;
	function OnTriggerEnter (collider : Collider) { 
		if(ac) {
			if(triggerMaxAnimationFrame <= 0 || triggerMaxAnimationFrame >= ac.currentAnimationFrame) {
				var other = collider.gameObject.GetComponent('BaseObject'); 
				if (other) {
					onTrigger(other);
				}
			}
		}
	}
}