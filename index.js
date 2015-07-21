function RandomSTR(len)
{
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = len;
	var randomstring = '';
	for (var i = 0; i < string_length; i++)
	{
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum, rnum + 1);
	}
	return randomstring;
}
$(document).ready(function ()
{
	try
	{
		$('#createroom').click(function ()
		{
			var str = RandomSTR(50);
			var url = '/room.html';
			url += '?id=' + str;
			document.location.href = url;
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