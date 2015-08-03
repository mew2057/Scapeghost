var app = app || {};

//=================================================

app.SpriteSheet = function()
{
	this.packer  = new SpritePacker();
	this.sheets  = [];
	this.sprites = [];
	
	this.canvas = document.createElement("canvas");
	this.canvas.width = this.canvas.height = 0;
	
	this.ctx    = this.canvas.getContext("2d");
	this.spriteSheet;
};

app.SpriteSheet.prototype = {
	
	ClearSpriteSheet : function()
	{
		this.sprites = [];
		this.packer = new SpritePacker();
		this.canvas.width = this.canvas.height = 0;
	},
	
	AppendSpriteSheet : function ( image, positionCollection, firstgid )
	{
		// TODO sort, largest first.
		var node   = this.packer.Insert(image.width, image.height);
		
		this.sheets.push({"image":image, "x":node.x, "y":node.y } );
		
		// Adjust the positions for the sprites according to their packing.
		var spritePosition; 
		for ( var index = 0; index < positionCollection.length; ++index )
		{
			spritePosition = positionCollection[index];
			spritePosition.x += node.x;
			spritePosition.y += node.y;
			this.sprites[ index + firstgid ] = spritePosition;
		}
	},
	
	// Anchor is in the top left.
	FinalizeSpriteSheet : function()
	{
		this.canvas.width  = this.packer.root.w;
		this.canvas.height = this.packer.root.h;
		
		for(var index in this.sheets )
		{
			// Draw
			this.ctx.drawImage(this.sheets[ index ].image, this.sheets[ index ].x, this.sheets[ index ].y);
		}
	},
	
	DrawSprite : function ( ctx, spriteID, x, y, scale )
	{
		if( this.sprites[spriteID] )
		{		
			ctx.drawImage(this.canvas,
				this.sprites[spriteID].x, 
				this.sprites[spriteID].y,  
				this.sprites[spriteID].w, 
				this.sprites[spriteID].h, 
				x, y - this.sprites[spriteID].h,
				this.sprites[spriteID].w, 
				this.sprites[spriteID].h);
		}
	}
	
}

//=================================================
function SpritePacker()
{
	this.root={x:0,y:0,w:0,h:0};
}

SpritePacker.prototype = {	
	Insert:function(w,h) {	
		if(!this.root.used)
		{
			this.root.w = w;
			this.root.h = h;
		}
		
		var node = this.FindSpace(this.root, w, h);
		
		if(node)
			return this.PrepNode(node, w, h);
		else
			return this.GrowSheet(w, h);
	},
	
	FindSpace:function(node, w, h) {
		if(node.used)
				return this.FindSpace(node.down, w, h) || this.FindSpace(node.right, w, h);
		else if(node.w >= w && node.h >= h)
			return node;
		else
			return null;
	},
	
	PrepNode:function(node, w, h) {
		node.right = { x:node.x + w, y:node.y,     w: node.w - w, h: node.h     };
		node.down  = { x:node.x,     y:node.y + h, w: node.w,     h: node.h - h };
		node.used  = true; 
		return node;
	},

	GrowSheet:function(w,h) {
		// > 0 down
		// < 0 right
		// == 0 down
		var growthPreference = this.root.w - this.root.h;
		
		// This moves the root up!
		// It's so stupidly elegant >.<
		//   r   ->  r'   Down transform
		//  / \     / \
		// d  ri   d'  r
		//            / \
		//           d  ri
		
		//   r   ->  r'   Right transform
		//  / \     / \
		// d  ri   r   ri'
		//        / \
		//       d  ri
		
		if( growthPreference >= 0)  // Down
			this.root = {
				used  : true,
				x     : 0,
				y     : 0,
				w     : this.root.w,
				h     : this.root.h + h,
				down  : { x:0, y: this.root.h, w: this.root.w, h: h},
				right : this.root
			}			
		else						// Right
			this.root = {
				used  : true,
				x     : 0,
				y     : 0,
				w     : this.root.w + w,
				h     : this.root.h,
				down  : this.root,
				right : { x: this.root.w, y: 0, w: w, h: this.root.h}
			}			
			
		return this.Insert(w, h);
	}
}

//=================================================

