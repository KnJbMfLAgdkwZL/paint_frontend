client = null;
paint = null;
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
function Main()
{
	client = new ClientSocketLogic();
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
	//$('#MyCanvasShowArea').mousedown(function (e)
	$('body').mousedown(function (e)
	{
		var color = $('#color').val();
		var size = $('#size').val();
		var x = e.pageX;
		var y = e.pageY;
		paint.SetColor(color);
		paint.SetCurSize(size);
		paint.SetPrev(x, y);
		paint.MousState(x, y, true);
	});
	//$('#MyCanvasShowArea').mouseup(function (e)
	$('body').mouseup(function (e)
	{
		var x = e.pageX;
		var y = e.pageY;
		paint.MousState(x, y, false);
	});
	//$('#MyCanvasShowArea').mousemove(function (e)
	$('body').mousemove(function (e)
	{
		var color = $('#color').val();
		var size = $('#size').val();
		var x = e.pageX;
		var y = e.pageY;
		paint.SetColor(color);
		paint.SetCurSize(size);
		paint.MousMove(x, y);
		paint.Set_XY(x, y);
	});
	$('body').bind('DOMMouseScroll', function (e)
	{
		var val = $('#size').val();
		val = parseInt(val);
		if (e.originalEvent.detail > 0)
		{
			if (val != 1)
			{
				val += 2;
			}
			else
			{
				val += 1;
			}
			if (val > 30)
			{
				val = 30
			}
		}
		else
		{
			val -= 2;
			if (val < 1)
			{
				val = 1
			}
		}
		$('#size').val(val);
		paint.SetCurSize(val);
		paint.ShowArea(paint.X, paint.Y);
		return false;
	});
	$('body').bind('mousewheel', function (e)
	{
		var val = $('#size').val();
		val = parseInt(val);
		if (e.originalEvent.wheelDelta < 0)
		{
			if (val != 1)
			{
				val += 2;
			}
			else
			{
				val += 1;
			}
			if (val > 30)
			{
				val = 30
			}
		}
		else
		{
			val -= 2;
			if (val < 1)
			{
				val = 1
			}
		}
		$('#size').val(val);
		paint.SetCurSize(val);
		paint.ShowArea(paint.X, paint.Y);
		return false;
	});
}