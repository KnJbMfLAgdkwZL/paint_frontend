function Paint()
{
	this.ContexMyCanvas = null;
	this.CurItem = 'pen';
	this.CurColor = '#000000';
	this.CurSize = 4;
	this.Prev_X = -1;
	this.Prev_Y = -1;
	this.MousDown = false;
	this.X = 0;
	this.Y = 0;
	this.SetContexMyCanvas = function (canvasContext)
	{
		this.ContexMyCanvas = canvasContext;
	}
	this.SetItem = function (item)
	{
		if (this.CurItem != item)
		{
			this.CurItem = item;
		}
	}
	this.SetColor = function (color)
	{
		if (this.CurColor != color)
		{
			this.CurColor = color;
		}
	}
	this.SetCurSize = function (size)
	{
		if (this.CurSize != size)
		{
			this.CurSize = size;
		}
	}
	this.SetPrev = function (x, y)
	{
		this.prev_X = x;
		this.prev_Y = y;
	}
	this.MousState = function (x, y, state)
	{
		this.MousDown = state;
		if (x < 0 || y < 0 || x >= this.ContexMyCanvas.canvas.width || y >= this.ContexMyCanvas.canvas.height)
		{
			this.MousDown = false;
		}
		if (this.MousDown == true)
		{
			//this.MouseClick(x, y);
			client.MouseClick(x, y, this.CurColor, this.CurSize, this.CurItem);
		}
		else if (this.MousDown == false)
		{
			this.SetPrev(-1, -1);
		}
	}
	this.MousMove = function (x, y)
	{
		if (this.MousDown == true)
		{
			switch (this.CurItem)
			{
				case 'pen':
					if (this.prev_X != -1 && this.prev_Y != -1)
					{
						/*$('#MyCanvas').drawLine({
						 strokeStyle: this.CurColor,
						 strokeWidth: this.CurSize,
						 rounded: true,
						 x1: this.prev_X,
						 y1: this.prev_Y,
						 x2: x,
						 y2: y
						 });*/
						client.DrawLine(this.prev_X, this.prev_Y, x, y, this.CurColor, this.CurSize);
					}
					break;
			}
			this.SetPrev(x, y);
		}
		else if (this.MousDown == false)
		{
			this.SetPrev(-1, -1);
			this.ShowArea(x, y);
		}
	}
	this.Set_XY = function (x, y)
	{
		this.X = x;
		this.Y = y;
	}
	this.MouseClick = function (x, y)
	{
		switch (this.CurItem)
		{
			case 'pen':
				$("#MyCanvas").drawArc({
					draggable: false,
					fillStyle: this.CurColor,
					x: x,
					y: y,
					radius: this.CurSize / 2
				});
				break;
			case 'bucket':
				var cff = new CanvasFloodFiller();
				var fillcolor = this.ColorRGBA();
				cff.floodFill(this.ContexMyCanvas, x, y, fillcolor);
				break;
		}
	}
	this.FromServerClick = function (x, y, color, size, item)
	{
		x = parseInt(x);
		y = parseInt(y);
		size = parseInt(size);
		switch (item)
		{
			case 'pen':
				$("#MyCanvas").drawArc({
					draggable: false,
					fillStyle: color,
					x: x,
					y: y,
					radius: size / 2
				});
				break;
			case 'bucket':
				var cff = new CanvasFloodFiller();
				var fillcolor = this.ColorRGBA(color);
				cff.floodFill(this.ContexMyCanvas, x, y, fillcolor);
				break;
		}
	}
	this.GetData = function ()
	{
		var width = this.ContexMyCanvas.canvas.width;
		var height = this.ContexMyCanvas.canvas.height;
		var idata = this.ContexMyCanvas.getImageData(0, 0, width, height);
		var pixels = idata.data;
		return pixels;
	}
	this.FromDrawLine = function (x1, y1, x2, y2, color, size)
	{
		$('#MyCanvas').drawLine({
			strokeStyle: color,
			strokeWidth: size,
			rounded: true,
			x1: x1,
			y1: y1,
			x2: x2,
			y2: y2
		});
	}
	this.ColorRGBA = function (color)
	{
		var hex = this.CurColor;
		if (color)
		{
			hex = color;
		}
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		var collorRGBA = result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16),
			a: 255
		} : null;
		return collorRGBA;
	}
	this.ClearAll = function ()
	{
		client.ClearCanvas();
	}
	this.ClearCanvas = function ()
	{
		$('#MyCanvas').clearCanvas();
	}
	this.ShowArea = function (x, y)
	{
		if (this.CurSize != 1)
		{
			$('#MyCanvasShowArea').clearCanvas();
			$('#MyCanvasShowArea').drawArc({
				strokeStyle: this.CurColor,
				strokeWidth: 0.5,
				x: x, y: y,
				radius: this.CurSize / 2 - 1
			});
		}
		else
		{
			$('#MyCanvasShowArea').clearCanvas();
		}
	}
}