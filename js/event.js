(function(self) {

	self.init = function() {
		$(window).resize(function(){
			engin.events( 'resizeWindow');
		});
		addEventListener("keydown", function(event) {
			switch(event.keyCode){
				case 32: /*to do*/ break;//key space
				case 37: /*to do*/ break;//key left
				case 38: /*to do*/ break;//key up
				case 39: /*to do*/ break;//key right
				case 40: /*to do*/ break;//key down
				default: break;
			}
		});
		$('#field').mousemove(function(event){
			engin.events( 'mousemove', [event.clientX, event.clientY] );
		});
		$('#field').click(function(event){
			engin.events( 'mouseClick', [event.clientX, event.clientY]);
		});
		/* $('#home').click(function(event){
			location.href = '/';
		}); */
	};

})( this.events = {} );