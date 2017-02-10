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