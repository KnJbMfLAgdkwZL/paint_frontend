function ClientSocketLogic()
{
	this.conectionopen = false;
	this.id = '';
	this.connection = null;
	this.stilaliveinterval = null;
	//
	this.ports = [6780, 6781, 6782, 6783, 6784, 6785, 6786, 6787, 6788, 6789];
	//
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
			/*var tmpclient = this;
			 setInterval(function ()
			 {
			 if (tmpclient.conectionopen == false)
			 {
			 if (tmpclient.connection)
			 {
			 tmpclient.connection.close();
			 }
			 delete tmpclient.connection;
			 tmpclient.start();
			 }
			 }, 10000);*/
			var curport = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
			this.connection = new WebSocket('ws://' + url + ':' + this.ports[curport]);
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
		var message = ['mclk', x, y, color, size, item];
		this.SendMesage(message);
	}
	this.DrawLine = function (x1, y1, x2, y2, color, size)
	{
		var message = ['dlin', x1, y1, x2, y2, color, size];
		this.SendMesage(message);
	}
	this.ClearCanvas = function ()
	{
		var message = ['clca'];
		this.SendMesage(message);
	}
	this.stilalive = function ()
	{
		var client = this;
		this.stilaliveinterval = setInterval(function ()
		{
			var message = ['live'];
			client.SendMesage(message);
		}, 1000);
	}
	this.ChangeNikName = function (name)
	{
		var message = ['nick', name];
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
			var message = e.data;
			if (message.length > 10)
			{
				message = JSON.parse(message);
				var com = message[0];
				switch (com)
				{
					case 'upus':
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
					case 'mclk':
					{
						var x = message[1];
						var y = message[2];
						var color = message[3];
						var size = message[4];
						var item = message[5];
						paint.FromServerClick(x, y, color, size, item);
					}
						break;
					case 'dlin':
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
					case 'clca':
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
		console.log('Connection open!');
		this.client.conectionopen = true;
		this.client.connection.apply_mask = false;
		var message = ['conn', navigator.userAgent];
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