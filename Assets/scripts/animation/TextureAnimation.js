var ac:AnimationContainer = null;

function Update () {
 	if(ac){  
		// Calculate index
		var uvAnimationTileX = ac.numX;
		var uvAnimationTileY = ac.numY;
	 
		// Size of every tile
		var size = Vector2 (1.0 / uvAnimationTileX, 1.0 / uvAnimationTileY);
	 
		// split into horizontal and vertical index
		var uIndex = ac.currentFrame % uvAnimationTileX;
		var vIndex = ac.currentFrame / uvAnimationTileX;
	 
		// build offset
		// v coordinate is the bottom of the image in opengl so we need to invert.
		var offset = Vector2 (uIndex * size.x, 1.0 - size.y - vIndex * size.y);
	 
		renderer.material.SetTextureOffset ("_MainTex", offset);
		renderer.material.SetTextureScale ("_MainTex", size);
	}
}