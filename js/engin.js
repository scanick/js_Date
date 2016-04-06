(function(self) {
/*===============================================================================================================
* private variables
**===============================================================================================================*/
	let ctx;

	const timeout = 1000, fps = 10, dt = timeout/fps;// число кадров в секунду
	let gDate = new Date(); //дата/время
	let arrHours = [];
	let arrMinutes = [];
	let arrSecond = [];


	let Colors = {
		ground: '#e8e8e8',//Цвет фона
		fontMonth: '#000000',//цвет шрифта
		scoreboard: ['#444444', '#cccccc'],//табло часов
		hours: ['#110000', '#ff99aa', '#881122', '#440011', '#000000'],//Часовая спираль
		minutes: ['#0080ff', '#4000ff'],//Минутный указатель
		seconds:['#00ff80', '#00ff40'],//Секундная стрелка
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
		hSecond: 42,					// Высота секундной стрелки
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
* private Class Year
**===============================================================================================================*/
	function classYear(){
		/*=======================================================================================================
		* private variables
		**=======================================================================================================*/
		var self = this;
		var now;
		var year;
		var months = [ [0, 'Январь', 31], [1, 'Февраль', 28], [2, 'Март', 31],
					[3, 'Апрель', 30], [4, 'Май', 31], [5, 'Июнь', 30],
					[6, 'Июль', 31], [7, 'Август', 31], [8, 'Сентябрь', 30],
					[9, 'Октябрь', 31], [10, 'Ноябрь', 30], [11, 'Декабрь', 31] ];
		var months_list = [];//Массив месяцев
		/*========================================================================================================
		* public function
		**========================================================================================================*/
		this.init = function(){
			now = new Date();
			year = now.getFullYear();
			if( (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)){//Если год високосный
				//amount_of_days = 366;
				months[1][2] = 29;//в феврале будет 29 дней
			}
		}
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
	
		initMinutes();
		initSecond();
		/* clear();
		draw(); */
		animation();
	};

	self.events = function(e, data){
		switch(e){
			case 'resizeWindow':
				field.init();
				initMinutes();
				initSecond();
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
		//Указатель минутный
			drawMinutes();
		//Стрелка секундная
			drawSecond();
	};

	drawScoreboard = function(){//Табло часов
		ctx.shadowBlur = 10;
		ctx.shadowColor = "black";
		//createRadialGradient(X_star, Y_start, Radius_inner, X_end, Y_end, Radius_external)
		let grdr = ctx.createRadialGradient(field.center[0],field.center[1], 10, field.center[0], field.center[1], field.rClock);
		grdr.addColorStop( 0, Colors.scoreboard[0] );//Color_start
		grdr.addColorStop( 1, Colors.scoreboard[1] );//Color_end
		ctx.fillStyle = grdr; // меняем цвет
		
		ctx.beginPath();//context.arc(x,y,r,sAngle,eAngle,counterclockwise);
			ctx.arc(field.center[0], field.center[1], field.rClock, 0, 2*Math.PI);
		ctx.closePath();
		ctx.fill();
	};

	initHours = function(){
		
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

	initMinutes = function(){
		arrMinutes.splice(1, arrSecond.length);//очистить массив
		let drH = field.rClock/field.coeffSpiral;		 //За 12 часов радиус уменьшится на field.coeffSpiral
		let drM = field.rClock/(field.coeffSpiral*60);	 //За 60 минут радиус уменьшится на field.coeffSpiral
		let daM = Math.PI/30;							 //угол одной минуты
		let daMp = daM/3;								 //угол указателя минуты
		for(let m = 0; m < 60; m++){
			let position = [];
			k = m==0 ? 60 : m;
			let dr = field.rClock - 2*drH/3 - k*drM;
			
			let cos = Math.cos(field.startAngle + k*daM);
			let sin = Math.sin(field.startAngle + k*daM);
			let x0 = field.center[0] + (dr + field.hMinutes/2) * cos;
			let y0 = field.center[1] + (dr + field.hMinutes/2) * sin;
			let arr0 = [];
			arr0[0] = x0; 	arr0[1] = y0;
			position.push(arr0);
			
			cos = Math.cos(field.startAngle + k*daM - daMp);
			sin = Math.sin(field.startAngle + k*daM - daMp);
			let x1 = field.center[0] + (dr - field.hMinutes/2) * cos;
			let y1 = field.center[1] + (dr - field.hMinutes/2) * sin;
			let arr1 = [];
			arr1[0] = x1; 	arr1[1] = y1;
			position.push(arr1);
			
			cos = Math.cos(field.startAngle + k*daM + daMp);
			sin = Math.sin(field.startAngle + k*daM + daMp);
			let x2 = field.center[0] + (dr - field.hMinutes/2) * cos;
			let y2 = field.center[1] + (dr - field.hMinutes/2) * sin;
			let arr2 = [];
			arr2[0] = x2; 	arr2[1] = y2;
			position.push(arr2);
			
			arrMinutes.push(position);
		}
		console.log('minutes reinit');
	};
	drawMinutes = function(){//Указатель минутный
		let m = new Date().getMinutes();
		
		ctx.shadowBlur  = 6;
		ctx.shadowColor = Colors.minutes[1];
		ctx.strokeStyle = Colors.minutes[0];
		
		ctx.beginPath();
			ctx.moveTo( arrMinutes[m][0][0], arrMinutes[m][0][1] );
			ctx.lineTo( arrMinutes[m][1][0], arrMinutes[m][1][1] );
			ctx.lineTo( arrMinutes[m][2][0], arrMinutes[m][2][1] );
			ctx.lineTo( arrMinutes[m][0][0], arrMinutes[m][0][1] );
		ctx.closePath();
		ctx.lineCap = "round";
		ctx.lineWidth = 2;
		ctx.stroke();
	};

	initSecond = function(){
		arrSecond.splice(1, arrSecond.length);//очистить массив
		let drH = field.rClock/field.coeffSpiral;	 	 //За 12 часов радиус уменьшится на field.coeffSpiral
		let drS = field.rClock/(field.coeffSpiral*60);	 //За 60 минут радиус уменьшится на field.coeffSpiral
		let daS = Math.PI/30;							 //угол одной секунды
		let daSp = 2*daS;								 //угол секндной стрелки
		for (let s = 0; s < 60; s++){
			let position = [];
			let k = s==0 ? 60: s;
			
			let dr = field.rClock - 15*drH/9 - k*drS;
			let cos = Math.cos(field.startAngle + k*daS);
			let sin = Math.sin(field.startAngle + k*daS);
			let x0 = field.center[0] + (dr ) * cos;
			let y0 = field.center[1] + (dr ) * sin;
			let arr0 = [];
			arr0[0] = x0; 	arr0[1] = y0;
			position.push(arr0);
			
			cos = Math.cos(field.startAngle + k*daS + daSp);
			sin = Math.sin(field.startAngle + k*daS + daSp);
			let x1 = field.center[0] + (- 3*field.hSecond/4) * cos;
			let y1 = field.center[1] + (- 3*field.hSecond/4) * sin;
			let arr1 = [];
			arr1[0] = x1; 	arr1[1] = y1;
			position.push(arr1);
			
			cos = Math.cos(field.startAngle + k*daS);
			sin = Math.sin(field.startAngle + k*daS);
			let x2 = field.center[0] + (- field.hSecond/5) * cos;
			let y2 = field.center[1] + (- field.hSecond/5) * sin;
			let arr2 = [];
			arr2[0] = x2; 	arr2[1] = y2;
			position.push(arr2);
			
			cos = Math.cos(field.startAngle + k*daS - daSp);
			sin = Math.sin(field.startAngle + k*daS - daSp);
			let x3 = field.center[0] + (- 3*field.hSecond/4) * cos;
			let y3 = field.center[1] + (- 3*field.hSecond/4) * sin;
			let arr3 = [];
			arr3[0] = x3; 	arr3[1] = y3;
			position.push(arr3);
			
			arrSecond.push(position);
		}
		console.log('second reinit');
	};
	drawSecond = function(){//Стрелка секундная
		let s = new Date().getSeconds();
		ctx.shadowBlur  = 6;
		ctx.shadowColor = Colors.seconds[1];
		ctx.strokeStyle = Colors.seconds[0];
		
		ctx.beginPath();
			ctx.moveTo( arrSecond[s][0][0], arrSecond[s][0][1] );
			ctx.lineTo( arrSecond[s][1][0], arrSecond[s][1][1] );
			ctx.lineTo( arrSecond[s][2][0], arrSecond[s][2][1] );
			ctx.lineTo( arrSecond[s][3][0], arrSecond[s][3][1] );
			ctx.lineTo( arrSecond[s][0][0], arrSecond[s][0][1] );
		ctx.closePath();
		ctx.lineCap = "round";
		ctx.lineWidth = 2;
		ctx.stroke();
		//console.log('draw seconds');
	};

	function animation(){
		setTimeout(function(){
			requestAnimationFrame(animation);
			clear();
			draw();
			
		}, dt);
	}

})( this.engin = {});