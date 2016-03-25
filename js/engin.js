(function(self) {
/*===============================================================================================================
* private variables
**===============================================================================================================*/
	var ctx;

	var timeout = 1000, fps = 35, dt = timeout/fps;// число кадров в секунду
	var gDate = new Date(); //дата/время
	

	var Colors = {
		ground: '#e8e8e8',//Цвет фона
		fontMonth: '#000000',//цвет шрифта
	};

	var field = {
		fWidth: window.innerWidth,		// Ширина поля
		fHeight: window.innerHeight,	// Высота поля
		fontMonth: '15px Comic Sans MS',//Шрифт
		center: [0, 0],					// ХУ центра поля
		
		init: function() {
			this.fWidth *=1; // Ширина поля
			this.fHeight *=1; // Высота поля
			this.center[0] = this.fWidth/2; // Х центра поля
			this.center[1] = this.fHeight/2;// У центра поля
		},
	};

/*===============================================================================================================
* private Class Clock
**===============================================================================================================*/
	function classClock(){
		/*=======================================================================================================
		* private variables
		**=======================================================================================================*/
		var self = this;
		var hours, minutes, seconds;
		/*========================================================================================================
		* public function
		**========================================================================================================*/
		this.init = function(){
			hours   = gDate.getHours();
			minutes = gDate.getMinutes();
			seconds = gDate.getSeconds();
			console.log(hours + ':' + minutes + ':' + seconds);
		};
		
		this.draw = function(mod){
			draw(mod);
		};
		

		/*========================================================================================================
		* private function
		**========================================================================================================*/
		var draw = function(mod){//
			var mode = mod || 'init';
			switch(mode){
				case 'init': 
						
					break;
				case 'redraw': 
						
					break;
				default: break;
			}
		}.bind(this);
	};

/*===============================================================================================================
* public function
**=================================================================================================================*/
	self.init = function() {
		field.init();
	
		var canva = $("#field")[0];
		canva.width = field.fWidth;
		canva.height = field.fHeight;
		ctx = canva.getContext('2d');
	
		clock = new classClock().init();
	
		clear();
		console.log(field.fWidth + 'x' + field.fHeight);
	};

	self.events = function(e, data){
		switch(e){
			case 'resizeWindow':
				field.fWidth = window.innerWidth; field.fHeight = window.innerHeight;
				console.log(field.fWidth + 'x' + field.fHeight);
				break;
			case 'mousemove':
				break;
			case 'mouseClick':
				//year.ingoing(data);
				break;
			default: break;
		}
	}

/*===============================================================================================================
* private function
**=================================================================================================================*/

	clear = function(){
		ctx.clearRect(0, 0, field.fWidth, field.fHeight)
		ctx.fillStyle = Colors.ground; // меняем цвет
		ctx.fillRect(0, 0, field.fWidth, field.fHeight);//Закрашиваем область
		ctx.fill();
	};

	draw = function(obj){
		
		switch(obj.getType()){
			case '':
				break;
			case ' ':
				break;
			default: break;
		}
		
	};

})( this.engin = {});