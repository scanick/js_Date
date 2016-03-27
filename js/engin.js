(function(self) {
/*===============================================================================================================
* private variables
**===============================================================================================================*/
	var ctx;

	var timeout = 1000, fps = 15, dt = timeout/fps;// число кадров в секунду
	var gDate = new Date(); //дата/время


	var Colors = {
		ground: '#e8e8e8',//Цвет фона
		fontMonth: '#000000',//цвет шрифта
		scoreboard: ['#000000', '#aaaaaa'],
		hours: ['#110000', '#ff99aa', '#881122', '#440011'],
	};

	var field = {
		fWidth: window.innerWidth,		// Ширина поля
		fHeight: window.innerHeight,	// Высота поля
		fontMonth: '15px Comic Sans MS',// Шрифт
		center: [0, 0],					// ХУ центра поля
		startAngle: -Math.PI/2,			// Стартовый угол
		rExternal: 0,					// Внешний радиус календаря
		rClock: 0,						//Внешний радиус часов
		init: function() {
			this.fWidth = window.innerWidth; 	// Ширина поля
			this.fHeight = window.innerHeight; 	// Высота поля
			this.center[0] = this.fWidth/2; 	// Х центра поля
			this.center[1] = this.fHeight/2;	// У центра поля
			this.rExternal = this.fWidth > this.fHeight ? 2*this.fHeight/5 : 2*this.fWidth/5; // Внешний радиус календаряthis.rExternal = this.fWidth > this.fHeight ? 2*this.fHeight/5 : 2*this.fWidth/5; // Внешний радиус календаря
			this.rClock = this.rExternal/1.9; // Внешний радиус календаря
			
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
		var hSpiral = [];
		var hAngle = Math.PI/12;
		
		/*========================================================================================================
		* public function
		**========================================================================================================*/
		this.init = function(){
			/* hours   = gDate.getHours();
			minutes = gDate.getMinutes();
			seconds = gDate.getSeconds();
			console.log(hours + ':' + minutes + ':' + seconds); */
		};
		this.getTime = function(){
			hours   = new Date().getHours();
			minutes = new Date().getMinutes();
			seconds = new Date().getSeconds();
			
			return hours + ':' + minutes + ':' + seconds;
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
	
		clock = new classClock();
		clock.init();
	
		clear();
		draw();
		//console.log(field.fWidth + 'x' + field.fHeight);
		animation();
	};

	self.events = function(e, data){
		switch(e){
			case 'resizeWindow':
				field.init();
				//field.fWidth = window.innerWidth; field.fHeight = window.innerHeight;
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
		ctx.strokeText(clock.getTime(), field.center[0]*5/4, field.center[1]/2);
		
		//createRadialGradient(X_star, Y_start, Radius_inner, X_end, Y_end, Radius_external)
		var grdr = ctx.createRadialGradient(field.center[0],field.center[1], 0, field.center[0], field.center[1], field.rClock);
		grdr.addColorStop( 0, Colors.scoreboard[0] );//Color_start
		grdr.addColorStop( 1, Colors.scoreboard[1] );//Color_end
		ctx.fillStyle = grdr; // меняем цвет
		
		ctx.beginPath();//context.arc(x,y,r,sAngle,eAngle,counterclockwise);
			ctx.arc(field.center[0], field.center[1], field.rClock, 0, 2*Math.PI);
		ctx.closePath();
		ctx.fill();
		/* switch(obj.getType()){
			case '':
				break;
			case ' ':
				break;
			default: break;
		} */
		
	};

	drawHourse = function(){
		let drH = field.rClock/(4*12);	 //За 12 часов радиус уменьшится на 4
		let drM = drH/60;				 // За 60 минут радиус часовой спирали ещё уменьшится
		let daH = Math.PI/6;			 //угол одного часа спирали
		let daM = daH/60;				 //угол минуты часовой спирали
		for(let i = 0; i < new Date().getHours(); i++){//new Date().getHours()
			for(let j = 0; j < 60; j++){
				let cos = Math.cos(field.startAngle + i*daH + j*daM);
				let sin = Math.sin(field.startAngle + i*daH + j*daM);
				let x1 = field.center[0] + (field.rClock - 8 - i*drH - j*drM ) * cos;
				let y1 = field.center[1] + (field.rClock - 8 - i*drH - j*drM ) * sin;
				let x2 = field.center[0] + (field.rClock     - i*drH - j*drM ) * cos;
				let y2 = field.center[1] + (field.rClock     - i*drH - j*drM ) * sin;
				
				var grd = ctx.createRadialGradient(x1, y1, 1, x2, y2, 2);
				grd.addColorStop( 0, Colors.hours[0] );//Color_start
				grd.addColorStop( 0.4, Colors.hours[1] );//Color_end
				grd.addColorStop( 0.6, Colors.hours[2] );//Color_end
				grd.addColorStop( 1, Colors.hours[3] );//Color_end
				ctx.strokeStyle = grd;
				
				ctx.shadowBlur=20;
				ctx.shadowColor="black";
				
				ctx.beginPath();
					ctx.moveTo( x1, y1 );
					ctx.lineTo( x2, y2 );
				ctx.closePath();
				ctx.lineWidth = 2;
				ctx.stroke();
			}
			/* ctx.beginPath();//context.arc(x,y,r,sAngle,eAngle,counterclockwise);
				ctx.arc(x, y, 4, 0, 2*Math.PI);
			ctx.closePath();
			ctx.fill(); */
		}
		
	};

	function animation(){
		setTimeout(function(){
			requestAnimationFrame(animation);
			clear();
			draw();
			drawHourse();
			//console.log('anim');
		}, dt);
	}
})( this.engin = {});