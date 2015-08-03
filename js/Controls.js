var app = app || {};



// Designed as a one stop shop for configuring directory structures.
app.Controls = function()
{
	function Keyboard()
	{
		// up, left, right, down, actions...
		this.actions = [38, 37,  39, 40, 32, 65, 68, 83]; // up, left, right, down, space, a, s, d
	}

	function Controls()
	{
		// Keyboard 
		this.keyboardConfig = new Keyboard();
		
		this.inputFlags = []; // up, left, right, down, actions...
		this.cacheInput = []; // If an action is flagged to be cached, the input flag is not removed by the controller.
		this.flagOwner = {};
	}
	
	Controls.prototype = {
		BindElement : function ( elementId )
		{
			if(elementId)
				{
				$( "#" + elementId ).keydown(this.onKeyDown.bind(this));
				$( "#" + elementId ).keyup(this.onKeyUp.bind(this));
			}
			else
			{
				$( window ).keydown(this.onKeyDown.bind(this));
				$( window ).keyup(this.onKeyUp.bind(this));
			}
		},
		
		BindInputFlags : function ( owner )
		{
			this.inputFlags = owner.inputFlags || [];
			this.cacheInput = owner.cacheInput || [];
		},
		
		// TODO This is not responsive/input doesn't stack.
		onKeyDown : function ( event )
		{
			event.stopPropagation();
			event.preventDefault();

			this.inputFlags[this.keyboardConfig.actions.indexOf( event.keyCode )] = true;
		},
		
		onKeyUp : function( event )
		{
			event.stopPropagation();
			event.preventDefault();
			
			this.inputFlags[this.keyboardConfig.actions.indexOf( event.keyCode )] = false
		}
	}
	
	return new Controls();
}();