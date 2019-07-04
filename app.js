// 入口文件
var express = require('express');
var app = express();

// 静态文件路径设置
app.use('/static', express.static(__dirname + '/static'));

// 主页输出 "Hello World"
app.get('/', function(req, res){
	res.send('Hello World');
})

var server = app.listen(3000, function(){
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('应用实例，访问地址为 http://%s:%s', host, port);
})


