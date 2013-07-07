var context = AppContext.getInstance();
function Start () {
	var generator = new MapGenerator();
	generator.generate(3, 3);
}
