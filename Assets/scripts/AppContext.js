class AppContext {
	static var instance: AppContext = null;
	static function getInstance() {
		if (instance == null) {
			instance = new AppContext();
		}
		return instance;
	}
	
	function addEffect(x:float, y:float, name: String){
		//ToDo
	}
	
	function playSound(name: String) {
		//ToDo
	}
}