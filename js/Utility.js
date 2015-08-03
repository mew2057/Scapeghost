var app = app || {};

app.Utils = function ()
{
	function Util ()
	{
	
	}
	
	Util.prototype = 
	{
		Lerp : function ( v0, v1, t )
		{
			return ( 1 - t ) * v0 + t * v1;
		},
		
		// This may benefit from some browser specific calibrations.
		Min : function (a, b)
		{
			return a < b ? a : b;
		},
		
		Max : function (a, b)
		{
			return a > b ? a : b;
		},
		
		Clamp : function (f, minv, maxv)
		{
			return this.Min(this.Max(f, minv), maxv);
		}
		
	}
	
	return new Util();
}();
