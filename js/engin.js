(function(self) {
/*===============================================================================================================
* private variables
**===============================================================================================================*/
	let ctx;

	const timeout = 1000, fps = 5, dt = timeout/fps;// число кадров в секунду
	let gDate = new Date(); //дата/время


	let Colors = {
		ground: '#e8e8e8',//Цвет фона
		fontMonth: '#000000',//цвет шрифта
		scoreboard: ['#444444', '#cccccc'],
		hours: ['#110000', '#ff99aa', '#881122', '#440011', '#000000'],
		minutes: ['#0080ff', '#4000ff'],
	};

	let field = {
		fWidth: window.innerWidth,		// Ширина поля
		fHeight: window.innerHeight,	// Высота поля
		fontMonth: '15px Comic Sans MS',// Шрифт
		center: [0, 0],					// ХУ центра поля
		startAngle: -Math.PI/2,			// Стартовый угол
		coeffSpiral: 4,					// Доля на которую уменьшится радиус спирали за целый поворот
		hHours: 12,						// Высота часовой спирали
		hMinutes: 12,					// Высота минутного указателя
		rExternal: 0,					// Внешний радиус календаря
		rClock: 0,						// Внешний радиус часов
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
		let self = this;
		let hours, minutes, seconds;
		let hSpiral = [];
		let hAngle = Math.PI/12;
		
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
		let draw = function(mod){//
			let mode = mod || 'init';
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
	
		let canva = $("#field")[0];
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
		/* switch(obj.getType()){
			case '':
				break;
			case ' ':
				break;
			default: break;
		} */
		//Табло часов
			drawScoreboard();
		//Спираль часовая
			drawHours();
		//Стрелка минутная
			drawMinutes();
	};

	drawScoreboard = function(){//Табло часов
		ctx.shadowBlur = 10;
		ctx.shadowColor = "black";
		//createRadialGradient(X_star, Y_start, Radius_inner, X_end, Y_end, Radius_external)
		let grdr = ctx.createRadialGradient(field.center[0],field.center[1], 20, field.center[0], field.center[1], field.rClock);
		grdr.addColorStop( 0, Colors.scoreboard[0] );//Color_start
		grdr.addColorStop( 1, Colors.scoreboard[1] );//Color_end
		ctx.fillStyle = grdr; // меняем цвет
		
		ctx.beginPath();//context.arc(x,y,r,sAngle,eAngle,counterclockwise);
			ctx.arc(field.center[0], field.center[1], field.rClock, 0, 2*Math.PI);
		ctx.closePath();
		ctx.fill();
	};

	drawHours = function(){//Спираль часовая
		let h = new Date().getHours(), m = new Date().getMinutes();
		let drH = field.rClock/(field.coeffSpiral*12);	 //За 12 часов радиус уменьшится на field.coeffSpiral
		let drM = drH/60;				 //За 60 минут радиус часовой спирали ещё уменьшится
		let daH = Math.PI/6;			 //угол одного часа спирали
		let daM = daH/60;				 //угол минуты часовой спирали
		//Риски - отметки часов
		for(let i = 0; i <= 24; i++){//new Date().getHours()
			let cos = Math.cos(field.startAngle + i*daH);
			let sin = Math.sin(field.startAngle + i*daH);
			let x1 = field.center[0] + (field.rClock - field.hHours - i*drH ) * cos;
			let y1 = field.center[1] + (field.rClock - field.hHours - i*drH ) * sin;
			let x2 = field.center[0] + (field.rClock - i*drH ) * cos;
			let y2 = field.center[1] + (field.rClock - i*drH ) * sin;
			
			ctx.strokeStyle = Colors.hours[4];
			
			ctx.beginPath();
				ctx.moveTo( x1, y1 );
				ctx.lineTo( x2, y2 );
			ctx.closePath();
			ctx.lineCap = "round";
			ctx.lineWidth = 1;
			ctx.stroke();
		}
		
		ctx.shadowBlur  = 15;
		ctx.shadowColor = "black";
		//часовая спираль
		for(let i = 0; i < h; i++){//new Date().getHours()
			for(let j = 0; j < 60; j++){
				let cos = Math.cos(field.startAngle + i*daH + j*daM);
				let sin = Math.sin(field.startAngle + i*daH + j*daM);
				let x1 = field.center[0] + (field.rClock - field.hHours + 2 - i*drH - j*drM ) * cos;
				let y1 = field.center[1] + (field.rClock - field.hHours + 2 - i*drH - j*drM ) * sin;
				let x2 = field.center[0] + (field.rClock - 2 - i*drH - j*drM ) * cos;
				let y2 = field.center[1] + (field.rClock - 2 - i*drH - j*drM ) * sin;
				
				let grd = ctx.createRadialGradient(x1, y1, 1, x2, y2, 2);
				grd.addColorStop( 0, Colors.hours[0] );//Color_start
				grd.addColorStop( 0.4, Colors.hours[1] );//Color_end
				grd.addColorStop( 0.6, Colors.hours[2] );//Color_end
				grd.addColorStop( 1, Colors.hours[3] );//Color_end
				ctx.strokeStyle = grd;
				
				ctx.beginPath();
					ctx.moveTo( x1, y1 );
					ctx.lineTo( x2, y2 );
				ctx.closePath();
				ctx.lineCap = "round";
				ctx.lineWidth = 2;
				ctx.stroke();
			}
		}
		//Продолжение часовой спирали с учётом количества минут
		for(let j = 0; j < m; j++){
			let cos = Math.cos(field.startAngle + h*daH + j*daM);
			let sin = Math.sin(field.startAngle + h*daH + j*daM);
			let x1 = field.center[0] + (field.rClock - field.hHours + 2 - h*drH - j*drM ) * cos;
			let y1 = field.center[1] + (field.rClock - field.hHours + 2 - h*drH - j*drM ) * sin;
			let x2 = field.center[0] + (field.rClock - 2 - h*drH - j*drM ) * cos;
			let y2 = field.center[1] + (field.rClock - 2 - h*drH - j*drM ) * sin;
			
			let grd = ctx.createRadialGradient(x1, y1, 1, x2, y2, 2);
			grd.addColorStop( 0, Colors.hours[0] );//Color_start
			grd.addColorStop( 0.4, Colors.hours[1] );//Color_end
			grd.addColorStop( 0.6, Colors.hours[2] );//Color_end
			grd.addColorStop( 1, Colors.hours[3] );//Color_end
			ctx.strokeStyle = grd;
			
			ctx.beginPath();
				ctx.moveTo( x1, y1 );
				ctx.lineTo( x2, y2 );
			ctx.closePath();
			ctx.lineCap = "round";
			ctx.lineWidth = 2;
			ctx.stroke();
		}
	};

	drawMinutes = function(){
		let h = new Date().getHours(), m = new Date().getMinutes();
		ctx.shadowBlur  = 6;
		ctx.shadowColor = Colors.minutes[1];
		let drH = field.rClock/field.coeffSpiral;	 //За 12 часов радиус уменьшится на field.coeffSpiral
		let drM = field.rClock/(field.coeffSpiral*60);	 //За 60 минут радиус уменьшится на field.coeffSpiral
		let daM = Math.PI/30;							 //угол одной минуты
		let daMp = daM/3;								 //угол указателя минуты
		let dr = field.rClock - 3*drH/5 - m*drM;
		let drp = h < 12 ? field.hMinutes/2 : -field.hMinutes/2;
		let cos = Math.cos(field.startAngle + m*daM);
		let sin = Math.sin(field.startAngle + m*daM);
		let x1 = field.center[0] + (dr + drp) * cos;
		let y1 = field.center[1] + (dr + drp) * sin;
		cos = Math.cos(field.startAngle + m*daM - daMp);
		sin = Math.sin(field.startAngle + m*daM - daMp);
		let x2 = field.center[0] + (dr - drp) * cos;
		let y2 = field.center[1] + (dr - drp) * sin;
		cos = Math.cos(field.startAngle + m*daM + daMp);
		sin = Math.sin(field.startAngle + m*daM + daMp);
		let x3 = field.center[0] + (dr - drp) * cos;
		let y3 = field.center[1] + (dr - drp) * sin;
		
		ctx.strokeStyle = Colors.minutes[0];
		
		ctx.beginPath();
			ctx.moveTo( x1, y1 );
			ctx.lineTo( x2, y2 );	ctx.lineTo( x3, y3 );	ctx.lineTo( x1, y1 );
		ctx.closePath();
		ctx.lineCap = "round";
		ctx.lineWidth = 2;
		ctx.stroke();
	};

	function animation(){
		setTimeout(function(){
			requestAnimationFrame(animation);
			clear();
			draw();
		}, dt);
	}

})( this.engin = {});