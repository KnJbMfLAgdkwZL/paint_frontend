function ClientSocketLogic()
{
	this.conectionopen = false;
	this.id = '';
	this.connection = null;
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
	this.getUrl = function ()
	{
		return window.location.hostname;
	}
	this.RedirectTo = function (url)
	{
		document.location.href = url;
	}
	this.start = function ()
	{
		var url = this.getUrl();
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
		if (this.conectionopen == false)
		{
			try
			{
				this.connection = new WebSocket('ws://' + url + ':6780');
			}
			catch (error)
			{
				var str = error.name + '\n';
				str += error.message + '\n';
				str += error.stack;
				console.log(str);
				location.reload();
			}
			this.connection.onopen = this.onopen;
			this.connection.onmessage = this.onmessage;
			this.connection.onclose = this.onclose;
			this.connection.onerror = this.onerror;
			this.connection.client = this;
		}
	}
	this.SendMesage = function (message)
	{
		if (this.conectionopen == true)
		{
			message[message.length] = this.id;
			message = JSON.stringify(message);
			this.connection.send(message);
		}
	}
	this.MouseClick = function (x, y, color, size, item)
	{
		var message = ['m', x, y, color, size, item];
		this.SendMesage(message);
	}
	this.DrawLine = function (x1, y1, x2, y2, color, size)
	{
		var message = ['d', x1, y1, x2, y2, color, size];
		this.SendMesage(message);
	}
	this.ClearCanvas = function ()
	{
		var message = ['l'];
		this.SendMesage(message);
	}
	this.ChangeNikName = function (name)
	{
		var message = ['n', name];
		this.SendMesage(message);
	}
	this.onmessage = function (e)
	{
		try
		{
			var message = e.data;
			if (message.length > 10)
			{
				message = JSON.parse(message);
				var com = message[0];
				switch (com)
				{
					case 'u':
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
					case 'm':
					{
						var x = message[1];
						var y = message[2];
						var color = message[3];
						var size = message[4];
						var item = message[5];
						paint.FromServerClick(x, y, color, size, item);
					}
						break;
					case 'd':
					{
						var x1 = message[1];
						var y1 = message[2];
						var x2 = message[3];
						var y2 = message[4];
						var color = message[5];
						var size = message[6];
						paint.FromDrawLine(x1, y1, x2, y2, color, size);
					}
						break;
					case 'l':
					{
						paint.ClearCanvas();
					}
						break;
				}
			}
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
		$('#connecting').css('display', 'none');
		console.log('Connection open!');
		this.client.conectionopen = true;
		this.client.connection.apply_mask = false;
		var message = ['c', navigator.userAgent];
		this.client.SendMesage(message);
	}
	this.onclose = function ()
	{
		console.log('Connection closed');
		this.client.conectionopen = false;
		location.reload();
	}
	this.onerror = function (error)
	{
		console.log('Socket Error');
		this.client.conectionopen = false;
		location.reload();
	}
}