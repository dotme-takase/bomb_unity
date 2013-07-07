#pragma strict

function Start () {
	var generator = new MapGenerator();
	generator.generate(3, 3);
}
