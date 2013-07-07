class AnimationContainer {
	var animations = {};
	var numX = 1; //number of x frames
	var numY = 1; //number of y frames
	var currentFrame:int = 0;
	var currentAnimationFrame:int = 0;
	var currentAnimation = [0, 0];
	var currentAnimationName:String = "";
	var fps:float = 16.0;
	var isStopped = false;
	var isLooping = false;
	var tempTime = 0;
	var onAnimationEnd = function() { 

	}; 
	
	var beforeDraw = function(){
	}; 
	
	var reset = function () {
		this.tempTime = Time.time;
	};
	
	var tick = function() {
		if (this.currentAnimation) {
			var start : int = this.currentAnimation[0];
			var end : int = this.currentAnimation[1]; 
			var size = end - start;
			if (!this.isStopped) {  
				this.currentAnimationFrame = ((Time.time - this.tempTime) * (this.fps) % (size)); 				
			} else {  
				isLooping = false;
			} 
			
			this.beforeDraw();
			this.currentFrame = this.currentAnimationFrame + start; 
			
			if (this.currentAnimationFrame >= size - 1) {  
				if(!isLooping) { 
					this.onAnimationEnd();
					isStopped = true;  
				}
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
	};
	
	var gotoAndPlayFrame = function(frame:int){
		this.setCurrentFrame(frame);
		this.isStopped = false;
	};
	
	var gotoAndStop = function(name:String){
		this.setAnimation(name);
		this.isStopped = true;
	};
	
	var gotoAndStopFrame = function(frame:int){
		this.setCurrentFrame(frame);
		this.isStopped = true;
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