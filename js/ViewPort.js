var app = app || {};

app.ViewPort = function() {
	this.x = app.Config.initViewport.x; // World X
	this.y = app.Config.initViewport.y; // World Y
	
	this.width  = app.Config.initViewport.w;
    this.halfWidth = this.width / 2;
    
	this.height = app.Config.initViewport.h;
    this.halfHeight = this.height / 2;

    this.staticView = false; // Indicates the view port doesn't scroll.
    this.worldBounds; // width, height
	
	// The transform focused on by the viewport.
	this.focus; // Assumes the object has an x and y component.
};


app.ViewPort.prototype = {
	Update : function ()
	{
		// EARLY RETURN!
		if( this.staticView )
			return;
	
        // TODO this needs scaling support.
        this.x = this.focus.x - this.halfWidth;
        
		// This code fails when the level is smaller than the viewport.
        if( this.x < 0 )
        {
            this.x = 0;
        }
        else if( this.x + this.width > this.worldBounds.width )
        {
            this.x = this.worldBounds.width - this.width;
        }
        
        this.y = this.focus.y - this.halfHeight;
		
        if( this.y < 0 )
        {
            this.y = 0;
        }
        else if( this.y + this.height > this.worldBounds.height )
        {
            this.y = this.worldBounds.height - this.height;
        }
	},
	
	SetFocus : function ( focus )
	{
		this.focus = focus;
	},
    
    // Bounds should have width and height in pixels
    SetWorldBounds : function ( bounds )
    {
        this.worldBounds = bounds;
    },
    
    SetHeight : function ( height )
    {
        this.height = height;
        this.halfHeight = height / 2;  
    },
    
    SetWidth : function ( width )
    {
        this.width = width;
        this.halfWidth = width / 2;  
    }
}