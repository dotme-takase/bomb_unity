class AnimationContainer {
	var animations = {};
	var numX = 1; //number of x frames
	var numY = 1; //number of y frames
	var currentFrame = 0;
	var currentAnimationFrame = 0;
	var currentAnimation = [0, 0];
	var fps = 16;
	var isStopped = false;
	var isLooping = true;
	var tempTime = 0;
	var onAnimationEnd = function(){
	};
	var beforeDraw = function(){
	};
	var tick = function() {
		if (this.currentAnimation) {
			var start : int = this.currentAnimation[0];
			var end : int = this.currentAnimation[1];
			if (!this.isStopped) {
				this.currentAnimationFrame = ((Time.time - this.tempTime) * this.fps) % (end - start);
			}
			if (this.currentFrame >= end) {
				if(!isLooping) {
					isStopped = true;
				} else {
					this.currentFrame = start;
				}
			}
			this.beforeDraw();
			this.currentFrame = this.currentAnimationFrame + start;
		}
	};
	
	var setAnimation = function (name){
		if(animations[name]) {
			this.tempTime = Time.time;
			this.currentAnimation = animations[name];
			var start = this.currentAnimation[0];
			var end = this.currentAnimation[1];
			this.currentFrame = start;
			this.currentAnimationFrame = 0;
		} else if (typeof name == "number") {
			this.currentFrame = name;
			this.currentAnimationFrame = 0;
		}
	};
	var gotoAndPlay = function(name){
		this.setAnimation(name);
		this.isStopped = false;
	};
	var gotoAndStop = function(name){
		this.setAnimation(name);
		this.isStopped = true;
	};
	
	var clone = function () {
		var _this = this;
	    var _clone = new AnimationContainer();
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