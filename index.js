function CanvasFloodFiller()//Заливка канваса
{
	var _cWidth = -1, _cHeight = -1;// Ширина и высота канвы
	var _rR = 0, _rG = 0, _rB = 0, _rA = 0;// Заменяемый цвет
	var _nR = 0, _nG = 0, _nB = 0, _nA = 0;// Цвет закраски
	var _data = null;
	var getDot = function (x, y)//Получить точку из данных
	{
		var dstart = (y * _cWidth * 4) + (x * 4);// Точка: y * ширину_канвы * 4 + (x * 4)
		var dr = _data[dstart];
		var dg = _data[dstart + 1];
		var db = _data[dstart + 2];
		var da = _data[dstart + 3];
		return {r: dr, g: dg, b: db, a: da};
	}
	var isNeededPixel = function (x, y)//Пиксель по координатам x,y - готовый к заливке?
	{
		var dstart = (y * _cWidth * 4) + (x * 4);
		var dr = _data[dstart];
		var dg = _data[dstart + 1];
		var db = _data[dstart + 2];
		var da = _data[dstart + 3];
		return (dr == _rR && dg == _rG && db == _rB && da == _rA);
	}
	var findLeftPixel = function (x, y)//Найти левый пиксель, по пути закрашивая все попавшиеся
	{
		// Крутим пикселы влево, заодно красим. Возвращаем левую границу.
		// Во избежание дубляжа и ошибок, findLeftPixel НЕ красит текущий
		// пиксел! Это сделает обязательный поиск вправо.
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
	var findRightPixel = function (x, y)//Найти правый пиксель, по пути закрашивая все попавшиеся
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
	var effectiveFill = function (cx, cy)//Эффективная (строчная) заливка
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
			// Сперва для первого пиксела, если верхний над ним цвет подходит,
			// пускаем поиск левой границы.
			// Можно искать вверх?
			if (cLine.y > 0)
			{
				// Сверху строка может идти левее текущей?
				if (isNeededPixel(cLine.x1, cLine.y - 1))
				{
					// Ищем в том числе влево
					nx1 = findLeftPixel(cLine.x1, cLine.y - 1);
					nx2 = findRightPixel(cLine.x1, cLine.y - 1);
					lineQueue.push({x1: nx1, x2: nx2, y: cLine.y - 1});
				}
				currx = nx2;
				// Добираем недостающее, ищем только вправо, но пока не
				// доползли так или иначе далее края текущей строки
				while (cLine.x2 >= nx2 && currx <= cLine.x2 && currx < (_cWidth - 1))
				{
					currx++;
					if (isNeededPixel(currx, cLine.y - 1))
					{
						// Сохраняем найденный отрезок
						nx1 = currx;
						nx2 = findRightPixel(currx, cLine.y - 1);
						lineQueue.push({x1: nx1, x2: nx2, y: cLine.y - 1});
						// Прыгаем далее найденного
						currx = nx2;
					}
				}
			}
			nx1 = cLine.x1;
			nx2 = cLine.x1;
			// Те же яйца, но можно ли искать вниз?
			if (cLine.y < (_cHeight - 1))
			{
				// Снизу строка может идти левее текущей?
				if (isNeededPixel(cLine.x1, cLine.y + 1))
				{
					// Ищем в том числе влево
					nx1 = findLeftPixel(cLine.x1, cLine.y + 1);
					nx2 = findRightPixel(cLine.x1, cLine.y + 1);
					lineQueue.push({x1: nx1, x2: nx2, y: cLine.y + 1});
				}
				currx = nx2;
				// Добираем недостающее, ищем только вправо, но пока не
				// доползли так или иначе далее края текущей строки
				while (cLine.x2 >= nx2 && currx <= cLine.x2 && currx < (_cWidth - 1))
				{
					currx++;
					if (isNeededPixel(currx, cLine.y + 1))
					{
						// Сохраняем найденный отрезок
						nx1 = currx;
						nx2 = findRightPixel(currx, cLine.y + 1);
						lineQueue.push({x1: nx1, x2: nx2, y: cLine.y + 1});
						// Прыгаем далее найденного
						currx = nx2;
					}
				}
			}
		}
	}
	this.floodFill = function (canvasContext, x, y, color)//Выполняет заливку на канве
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
		if (_rR == _nR && _rG == _nG && _rB == _nB && _rA == _nA)// Всё зависнет к известной матери если цвета совпадают
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
	this.SetContexMyCanvas = function (canvasContext)
	{
		this.ContexMyCanvas = canvasContext;
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
			this.Prev_X = x;
			this.Prev_Y = y;
		}
		else if (this.MousDown == false)
		{
			this.Prev_X = -1;
			this.Prev_Y = -1;
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
						this.ContexMyCanvas.beginPath();
						this.ContexMyCanvas.moveTo(this.prev_X, this.prev_Y);
						this.ContexMyCanvas.lineTo(x, y);
						this.ContexMyCanvas.lineWidth = this.CurSize;
						this.ContexMyCanvas.strokeStyle = this.CurColor;
						this.ContexMyCanvas.stroke();
					}
					break;
			}
			this.prev_X = x;
			this.prev_Y = y;
		}
		else if (this.MousDown == false)
		{
			this.prev_X = -1;
			this.prev_Y = -1;
		}
	}
	this.MouseClick = function (x, y)
	{
		switch (this.CurItem)
		{
			case 'pen':
				this.ContexMyCanvas.beginPath();
				this.ContexMyCanvas.lineWidth = this.CurSize;
				this.ContexMyCanvas.arc(x, y, 0.1, 0, 2 * Math.PI);
				this.ContexMyCanvas.fill();
				this.ContexMyCanvas.strokeStyle = this.CurColor;
				this.ContexMyCanvas.stroke();
				break;
			case 'bucket':
				var cff = new CanvasFloodFiller();
				var hex = this.CurColor;
				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
				var collorRGBA = result ? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
					a: 255
				} : null;
				cff.floodFill(this.ContexMyCanvas, x, y, collorRGBA);
				break;
		}
	}
	this.ClearAll = function ()
	{
		var width = this.ContexMyCanvas.canvas.width;
		var height = this.ContexMyCanvas.canvas.height;
		this.ContexMyCanvas.clearRect(0, 0, width, height);
	}
}
$(document).ready(function ()
{
	try
	{
		/*
		 if ('WebSocket' in window)
		 {
		 console.log('WebSocket поддерживается. Вы можете писать свой код');
		 var connection = new WebSocket('ws://192.168.0.100:7890');
		 connection.onopen = function ()
		 {
		 console.log('Connection open!');
		 }
		 connection.onclose = function ()
		 {
		 console.log('Connection closed');
		 }
		 connection.onerror = function (error)
		 {
		 console.log('Error detected: ' + error);
		 }
		 connection.onmessage = function (e)
		 {
		 console.log("Resiving mesage");
		 var server_message = e.data;
		 console.log(server_message);
		 }
		 setTimeout(function ()
		 {
		 connection.apply_mask = false;
		 console.log("Sending mesage");
		 var str = "Hello from client";
		 connection.send(str);
		 }, 2000)
		 //connection.close();
		 }
		 else
		 {
		 console.log('WebSockets не поддерживается. Попробуйте использовать старые методы связи');
		 }
		 */
		var MyCanvas = document.getElementById("MyCanvas");
		var ContexMyCanvas = MyCanvas.getContext("2d");
		var paint = new Paint();
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
		$('html').mousedown(function (e)
		{
			var color = $('#color').val();
			var size = $('#size').val();
			paint.SetCurSize(size);
			paint.SetColor(color);
			paint.MousState(e.pageX, e.pageY, true);
		});
		$('html').mouseup(function (e)
		{
			paint.MousState(e.pageX, e.pageY, false);
		});
		$('html').mousemove(function (e)
		{
			paint.MousMove(e.pageX, e.pageY);
		});
	}
	catch (error)
	{
		var str = error.name + '\n';
		str += error.message + '\n';
		str += error.stack;
		console.log(str);
	}
});