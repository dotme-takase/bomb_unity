class AnimationContainer {
	var animations = {};
	var numX = 1; //number of x frames
	var numY = 1; //number of y frames
	var currentFrame:int = 0;
	var stopFrame:int = 0;
	var currentAnimationFrame:int = 0;
	var currentAnimation = [0, 0];
	var currentAnimationName:String = "";
	var fps:float = 20.0;
	var isStopped = false;
	var isLooping = false;
	var tempTime:float = 0;
	var resetFlag = false;
	var onAnimationEnd = function() { 

	}; 
	
	var beforeDraw = function(){
	}; 
	
	var reset = function () {
		resetFlag = true;
	};
	
	var tick = function() {
		if (this.currentAnimation) {
			var start : int = this.currentAnimation[0];
			var end : int = this.currentAnimation[1]; 
			var size = end - start + 1;
			
			if (!this.isStopped) {  
				if (resetFlag == true) {
					this.tempTime = Time.time;
					resetFlag = false;
				}
				this.currentAnimationFrame = Mathf.RoundToInt((Time.time - this.tempTime) * (this.fps)) % (size + 1); 				
			} else {  
				this.currentFrame = this.stopFrame;
				isLooping = false;
			} 
			
			if (this.currentAnimationFrame >= size) {  
				this.currentAnimationFrame = size - 1;
				if(!isLooping) { 
					this.onAnimationEnd();
					this.currentAnimationName = null;
					isStopped = true;  
				} else { 
					this.currentAnimationFrame = 0;
				}
			}
			
			this.beforeDraw();
			if (this.currentAnimationName != null) {  
				this.currentFrame = this.currentAnimationFrame + start; 	
			} 
		}
	};
	
	var setAnimation = function (name:String) { 		 
		reset();
		this.currentAnimation = animations[name]; 
		if (this.currentAnimation) {
			var start = this.currentAnimation[0];
			var end = this.currentAnimation[1];
			this.currentFrame = start;
		} else {
			this.currentFrame = 0;
		}
		this.currentAnimationFrame = 0;
		this.currentAnimationName = name; 
		this.isLooping = false;
	};
	
	var setCurrentFrame = function (frame:int) { 
		reset();
		this.currentFrame = frame;
		this.currentAnimationFrame = 0;
		this.currentAnimationName = "";
		this.isLooping = false;
	};
	
	var gotoAndPlay = function(name:String){
		this.setAnimation(name);
		this.isStopped = false;
		this.stopFrame = 0;
	};
	
	var gotoAndPlayFrame = function(frame:int){
		this.setCurrentFrame(frame);
		this.isStopped = false;
		this.stopFrame = 0;
	};
	
	var gotoAndStop = function(name:String){
		this.setAnimation(name);
		this.isStopped = true;
		this.stopFrame = this.currentFrame;
	};
	
	var gotoAndStopFrame = function(frame:int){
		this.setCurrentFrame(frame);
		this.isStopped = true;
		this.stopFrame = this.currentFrame;
	};
	
	static var clone = function (_this : AnimationContainer) {
	    var _clone:AnimationContainer = new AnimationContainer();
		_clone.animations = _this.animations;
		_clone.numX = _this.numX;
		_clone.numY = _this.numY;
		_clone.currentFrame = _this.currentFrame;
		_clone.currentAnimationFrame = _this.currentAnimationFrame;
		_clone.currentAnimation = _this.currentAnimation;
		_clone.fps = _this.fps;
		_clone.isStopped = _this.isStopped;
		_clone.isLooping = _this.isLooping;
		_clone.tempTime = _this.tempTime;
		_clone.onAnimationEnd = _this.onAnimationEnd;
		_clone.beforeDraw = _this.beforeDraw;
		_clone.tick = _this.tick;
		_clone.setAnimation = _this.setAnimation;
		_clone.gotoAndPlay = _this.gotoAndPlay;
		_clone.gotoAndStop = _this.gotoAndStop;
		return _clone;
	};
}