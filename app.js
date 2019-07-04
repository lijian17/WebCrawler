// 入口文件
var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

var app = express();

// 静态文件路径设置
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res, next) {
	// 用 superagent 去抓取 https://cnodejs.org/ 的内容
	superagent.get('https://cnodejs.org/')
		.end(function(err, sres) {
			// 常规的错误处理
			if(err) {
				return next(err);
			}
			// sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
			// 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
			// 剩下就都是 jquery 的内容了
			var $ = cheerio.load(sres.text);
			var items = [];
			$('#topic_list .topic_title').each(function(idx, element) {
				var $element = $(element);
				items.push({
					title: $element.attr('title'),
					href: $element.attr('href')
				});
			});
			res.send(items);
		});
});

// 微信爬虫
app.get('/weixin', function(req, res, next) {
	// 用 superagent 去抓取“微信”的内容
	superagent.get('https://mp.weixin.qq.com/s/hcnFHhlzorK8l6JCLiaAPw')
		.end(function(err, sres) {
			// 常规的错误处理
			if(err) {
				return next(err);
			}
			// sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
			// 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
			// 剩下就都是 jquery 的内容了
			var $ = cheerio.load(sres.text);
			var items = [];
			var item = new Object();
			console.log(sres.text);
			
			$('#activity-name').each(function(idx, element){
				var $element = $(element);
				item['activity-name'] = $element.text().replace(/\n\s+/g, '');
			});
			$('mpvoice').each(function(idx, element){
				var $element = $(element);
				item['mpvoice'] = $element.attr('name').replace(/\s+/g, '');
			});
			$('#js_name').each(function(idx, element){
				var $element = $(element);
				item['js_name'] = $element.text().replace(/\s+/g, '');
			});
			$('#publish_time').each(function(idx, element){
				var $element = $(element);
				item['publish_time'] = $element.text().replace(/\n\s+/g, '');
			});
			$('section:contains("早安")').each(function(idx, element){
				var $element = $(element);
				item['text'] = $element.text().replace(/\s+/g, '');
			});
			console.log(item);
			items.push(item);
			res.send(items);
		});
});

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('应用实例，访问地址为 http://%s:%s', host, port);
})