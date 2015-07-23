function CanvasFloodFiller()
{
	var _cWidth = -1, _cHeight = -1;
	var _rR = 0, _rG = 0, _rB = 0, _rA = 0;
	var _nR = 0, _nG = 0, _nB = 0, _nA = 0;
	var _data = null;
	var getDot = function (x, y)
	{
		var dstart = (y * _cWidth * 4) + (x * 4);
		var dr = _data[dstart];
		var dg = _data[dstart + 1];
		var db = _data[dstart + 2];
		var da = _data[dstart + 3];
		return {r: dr, g: dg, b: db, a: da};
	}
	var isNeededPixel = function (x, y)
	{
		var dstart = (y * _cWidth * 4) + (x * 4);
		var dr = _data[dstart];
		var dg = _data[dstart + 1];
		var db = _data[dstart + 2];
		var da = _data[dstart + 3];
		return (dr == _rR && dg == _rG && db == _rB && da == _rA);
	}
	var findLeftPixel = function (x, y)
	{
		var lx = x - 1;
		var dCoord = (y * _cWidth * 4) + (lx * 4);
		while (lx >= 0 && _data[dCoord] == _rR && _data[dCoord + 1] == _rG &&
		_data[dCoord + 2] == _rB && _data[dCoord + 3] == _rA)
		{
			_data[dCoord] = _nR;
			_data[dCoord + 1] = _nG;
			_data[dCoord + 2] = _nB;
			_data[dCoord + 3] = _nA;
			lx--;
			dCoord -= 4;
		}
		return lx + 1;
	}
	var findRightPixel = function (x, y)
	{
		var rx = x;
		var dCoord = (y * _cWidth * 4) + (x * 4);
		while (rx < _cWidth && _data[dCoord] == _rR && _data[dCoord + 1] == _rG &&
		_data[dCoord + 2] == _rB && _data[dCoord + 3] == _rA)
		{
			_data[dCoord] = _nR;
			_data[dCoord + 1] = _nG;
			_data[dCoord + 2] = _nB;
			_data[dCoord + 3] = _nA;
			rx++;
			dCoord += 4;
		}
		return rx - 1;
	}
	var effectiveFill = function (cx, cy)
	{
		var lineQueue = new Array();
		var fx1 = findLeftPixel(cx, cy);
		var fx2 = findRightPixel(cx, cy);
		lineQueue.push({x1: fx1, x2: fx2, y: cy});
		while (lineQueue.length > 0)
		{
			var cLine = lineQueue.shift();
			var nx1 = cLine.x1;
			var nx2 = cLine.x1;
			var currx = nx2;
			if (cLine.y > 0)
			{
				if (isNeededPixel(cLine.x1, cLine.y - 1))
				{
					nx1 = findLeftPixel(cLine.x1, cLine.y - 1);
					nx2 = findRightPixel(cLine.x1, cLine.y - 1);
					lineQueue.push({x1: nx1, x2: nx2, y: cLine.y - 1});
				}
				currx = nx2;
				while (cLine.x2 >= nx2 && currx <= cLine.x2 && currx < (_cWidth - 1))
				{
					currx++;
					if (isNeededPixel(currx, cLine.y - 1))
					{
						nx1 = currx;
						nx2 = findRightPixel(currx, cLine.y - 1);
						lineQueue.push({x1: nx1, x2: nx2, y: cLine.y - 1});
						currx = nx2;
					}
				}
			}
			nx1 = cLine.x1;
			nx2 = cLine.x1;
			if (cLine.y < (_cHeight - 1))
			{
				if (isNeededPixel(cLine.x1, cLine.y + 1))
				{
					nx1 = findLeftPixel(cLine.x1, cLine.y + 1);
					nx2 = findRightPixel(cLine.x1, cLine.y + 1);
					lineQueue.push({x1: nx1, x2: nx2, y: cLine.y + 1});
				}
				currx = nx2;
				while (cLine.x2 >= nx2 && currx <= cLine.x2 && currx < (_cWidth - 1))
				{
					currx++;
					if (isNeededPixel(currx, cLine.y + 1))
					{
						nx1 = currx;
						nx2 = findRightPixel(currx, cLine.y + 1);
						lineQueue.push({x1: nx1, x2: nx2, y: cLine.y + 1});
						currx = nx2;
					}
				}
			}
		}
	}
	this.floodFill = function (canvasContext, x, y, color)
	{
		_cWidth = canvasContext.canvas.width;
		_cHeight = canvasContext.canvas.height;
		_nR = color.r;
		_nG = color.g;
		_nB = color.b;
		_nA = color.a;
		var idata = canvasContext.getImageData(0, 0, _cWidth, _cHeight);
		var pixels = idata.data;
		_data = pixels;
		var toReplace = getDot(x, y);
		_rR = toReplace.r;
		_rG = toReplace.g;
		_rB = toReplace.b;
		_rA = toReplace.a;
		if (_rR == _nR && _rG == _nG && _rB == _nB && _rA == _nA)
		{
			return;
		}
		effectiveFill(x, y);
		canvasContext.putImageData(idata, 0, 0);
	}
}
function Paint()
{
	this.ContexMyCanvas = null;
	this.CurItem = 'pen';
	this.CurColor = '#000000';
	this.CurSize = 4;
	this.Prev_X = -1, Prev_Y = -1;
	this.MousDown = false;
	this.PushArray = new Array();
	this.Step = -1;
	this.SetContexMyCanvas = function (canvasContext)
	{
		this.ContexMyCanvas = canvasContext;
		this.PushToHistory();
	}
	this.SetItem = function (item)
	{
		this.CurItem = item;
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
		this.CurSize = size;
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
			this.MouseClick(x, y);
		}
		else if (this.MousDown == false)
		{
			this.SetPrev(-1, -1);
			this.PushToHistory();
		}
	}
	this.MousMove = function (x, y)
	{
		if (this.MousDown == true)
		{
			switch (this.CurItem)
			{
				case 'pen':
					this.MouseClick(x, y);
					if (this.prev_X != -1 && this.prev_Y != -1)
					{
						this.ContexMyCanvas.lineWidth = this.CurSize;
						this.ContexMyCanvas.strokeStyle = this.CurColor;
						this.ContexMyCanvas.beginPath();
						this.ContexMyCanvas.moveTo(this.prev_X, this.prev_Y);
						this.ContexMyCanvas.lineTo(x, y);
						this.ContexMyCanvas.stroke();
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
	this.MouseClick = function (x, y)
	{
		switch (this.CurItem)
		{
			case 'pen':
				//
				this.ContexMyCanvas.lineWidth = this.CurSize;
				this.ContexMyCanvas.strokeStyle = this.CurColor;
				this.ContexMyCanvas.fillStyle = this.CurColor;
				//
				this.ContexMyCanvas.beginPath();
				this.ContexMyCanvas.arc(x, y, 0.1, 0, 2 * Math.PI);
				this.ContexMyCanvas.fill();
				this.ContexMyCanvas.stroke();
				//
				this.ContexMyCanvas.lineWidth = 0.1;
				this.ContexMyCanvas.beginPath();
				this.ContexMyCanvas.arc(x, y, this.CurSize / 2, 0, 2 * Math.PI, false);
				this.ContexMyCanvas.fill();
				this.ContexMyCanvas.stroke();
				//
				break;
			case 'bucket':
				var data = this.PushArray[this.Step];
				this.ContexMyCanvas.putImageData(data, 0, 0);
				var cff = new CanvasFloodFiller();
				var fillcolor = this.ColorRGBA();
				cff.floodFill(this.ContexMyCanvas, x, y, fillcolor);
				break;
		}
	}
	this.ColorRGBA = function ()
	{
		var hex = this.CurColor;
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
		var width = this.ContexMyCanvas.canvas.width;
		var height = this.ContexMyCanvas.canvas.height;
		this.ContexMyCanvas.clearRect(0, 0, width, height);
		this.PushToHistory();
	}
	this.PushToHistory = function ()
	{
		if (this.Step < 10)
		{
			this.Step++;
		}
		else
		{
			var arr = new Array();
			for (var i = 0; i < 10; i++)
			{
				arr[i] = this.PushArray[i + 1];
			}
			this.PushArray = arr;
		}
		if (this.Step <= this.PushArray.length)
		{
			this.PushArray.length = this.Step;
		}
		var width = this.ContexMyCanvas.canvas.width;
		var height = this.ContexMyCanvas.canvas.height;
		var data = this.ContexMyCanvas.getImageData(0, 0, width, height);
		this.PushArray.push(data);
	}
	this.Undo = function ()
	{
		if (this.Step > 0)
		{
			this.Step--;
			var data = this.PushArray[this.Step];
			this.ContexMyCanvas.putImageData(data, 0, 0);
		}
	}
	this.Redo = function ()
	{
		if (this.Step < this.PushArray.length - 1)
		{
			this.Step++;
			var data = this.PushArray[this.Step];
			this.ContexMyCanvas.putImageData(data, 0, 0);
		}
	}
	this.ShowArea = function (x, y)
	{
		var data = this.PushArray[this.Step];
		this.ContexMyCanvas.putImageData(data, 0, 0);
		this.ContexMyCanvas.beginPath();
		this.ContexMyCanvas.arc(x, y, this.CurSize / 2 - 1, 0, 2 * Math.PI);
		this.ContexMyCanvas.lineWidth = 1;
		this.ContexMyCanvas.strokeStyle = this.CurColor;
		this.ContexMyCanvas.stroke();
	}
}
$(document).ready(function ()
{
	try
	{
		Main();
	}
	catch (error)
	{
		var str = error.name + '\n';
		str += error.message + '\n';
		str += error.stack;
		console.log(str);
	}
});
function ClientSocketLogic()
{
	this.conectionopen = false;
	this.id = '';
	this.connection = null;
	this.stilaliveinterval = null;
	this.getUrlVar = function (key)
	{
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for (var i = 0; i < hashes.length; i++)
		{
			var hash = hashes[i].split('=');
			if (hash[0] == key)
			{
				return hash[1];
			}
		}
	}
	this.RedirectTo = function (url)
	{
		document.location.href = url;
	}
	this.start = function ()
	{
		this.id = this.getUrlVar('id');
		if (!this.id)
		{
			this.RedirectTo('/');
		}
		if (!('WebSocket' in window))
		{
			console.log('WebSockets не поддерживается.');
			RedirectTo('/');
		}
		console.log('WebSocket поддерживается.');
		this.connection = new WebSocket('ws://192.168.0.100:6789');
		this.connection.onopen = this.onopen;
		this.connection.onmessage = this.onmessage;
		this.connection.onclose = this.onclose;
		this.connection.onerror = this.onerror;
		this.connection.client = this;
	}
	this.SendMesage = function (message)
	{
		if (this.conectionopen == true)
		{
			message.id = this.id;
			message = JSON.stringify(message);
			//console.log("Sending mesage");
			//console.log(message);
			this.connection.send(message);
		}
	}
	this.stilalive = function ()
	{
		var client = this;
		this.stilaliveinterval = setInterval(function ()
		{
			var message =
			{
				command: 'stilalive'
			}
			client.SendMesage(message);
		}, 500);
	}
	this.ChangeNikName = function (name)
	{
		var message =
		{
			command: 'changenick',
			name: name
		}
		this.SendMesage(message);
	}
	this.stilalivestop = function ()
	{
		if (this.stilaliveinterval)
		{
			clearInterval(this.stilaliveinterval);
			this.stilaliveinterval = null;
		}
	}
	this.onmessage = function (e)
	{
		try
		{
			//console.log("Resiving mesage");
			var message = e.data;
			//console.log(message);
			if (message.length > 10)
			{
				message = JSON.parse(message);
				//console.log(message);
				var command = message[0];
				switch (command)
				{
					case 'UpdateUsers':
					{
						var users = message[1];
						var str = "";
						for (var k in users)
						{
							str += "<li>" + users[k] + "</li>"
						}
						$('#UsersList').html(str);
					}
						break;
					case 'mousepaintclick':
					{
						var x = message[1];
						var y = message[2];
						var item = message[3];
						var color = message[4];
						var size = message[5];
					}
						break;
				}
			}
			//console.log(e.data);
			//console.log(message);
		}
		catch (error)
		{
			var str = error.name + '\n';
			str += error.message + '\n';
			str += error.stack;
			console.log(str);
		}
	}
	this.onopen = function ()
	{
		console.log('Connection open!');
		this.client.conectionopen = true;
		this.client.connection.apply_mask = false;
		var message =
		{
			command: 'room',
			userinfo: navigator.userAgent
		}
		this.client.SendMesage(message);
		this.client.stilalive();
	}
	this.onclose = function ()
	{
		console.log('Connection closed');
		this.client.conectionopen = false;
		this.client.stilalivestop();
	}
	this.onerror = function (error)
	{
		console.log('Socket Error');
		this.client.conectionopen = false;
		this.client.stilalivestop();
	}
}
function Main()
{
	var client = new ClientSocketLogic();
	client.start();
	$('#nicknamechange').click(function ()
	{
		var name = $('#nicknamevalue').val();
		if (name.length > 0)
		{
			client.ChangeNikName(name);
		}
	});
	var MyCanvas = document.getElementById("MyCanvas");
	var ContexMyCanvas = MyCanvas.getContext("2d");
	paint = new Paint();
	paint.SetContexMyCanvas(ContexMyCanvas);
	$('.paintitems').click(function ()
	{
		$('.paintitems').css('border', '1px solid lightblue');
		$(this).css('border', '1px solid red');
		var str = $(this).attr('id');
		paint.SetItem(str);
	});
	$('#clear').click(function ()
	{
		paint.ClearAll();
	});
	$('#Undo').click(function ()
	{
		paint.Undo();
	});
	$('#Redo').click(function ()
	{
		paint.Redo();
	});
	$('#MyCanvas').mousedown(function (e)
	{
		var color = $('#color').val();
		var size = $('#size').val();
		paint.SetCurSize(size);
		paint.SetColor(color);
		var x = e.pageX;
		var y = e.pageY;
		paint.SetPrev(x, y);
		paint.MousState(x, y, true);
	});
	$('#MyCanvas').mouseup(function (e)
	{
		var x = e.pageX;
		var y = e.pageY;
		paint.MousState(x, y, false);
	});
	$('#MyCanvas').mousemove(function (e)
	{
		var color = $('#color').val();
		var size = $('#size').val();
		paint.SetCurSize(size);
		paint.SetColor(color);
		var x = e.pageX;
		var y = e.pageY;
		paint.MousMove(x, y);
	});
}