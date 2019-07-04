// 入口文件
var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

var http = require('http');
var https = require('https');
var querystring = require('querystring');
var util = require('util');

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
	var url = 'http://mp.weixin.qq.com/s?__biz=MjM5MjAxNDM4MA==&mid=2666258190&idx=1&sn=fab85cf2f26ad1513c376a37b97eefe0&chksm=bdb3b64d8ac43f5b7c34fcf9fad33925f5c11be3f9412acf5290c3d2c40beb9a935df297134d#rd'
//	var url = 'https://mp.weixin.qq.com/s/hcnFHhlzorK8l6JCLiaAPw';
	superagent.get(url)
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

//// 需要提交的数据
//var data = {
//	
//};
//
//var content = querystring.stringify(data);
//
//// 请求
//var options = {
//	hostname: 'https://mp.weixin.qq.com',
//	port: 80,
//	path: '/cgi-bin/appmsg?' + content,
//	method: 'GET'
//};
//
//var req = http.request(options, function(res) {
//	console.log('STATUS: ' + res.statusCode);
//	console.log('HEADERS: ' + JSON.stringify(res.headers));
//	res.setEncoding('utf8');
//	res.on('data', function(chunk) {
//		console.log('BODY: ' + chunk);
//	});
//});
//
//req.on('error', function(e) {
//	console.log('problem with request: ' + e.message);
//});
//
//req.end();

// 微信爬虫
app.get('/wx', function(req, res, next) {
	var url = 'https://mp.weixin.qq.com/cgi-bin/appmsg?token=2052806918&lang=zh_CN&f=json&ajax=1&random=0.7998929288148617&action=list_ex&begin=0&count=5&query=%E6%9D%A5%E4%BA%86%EF%BC%81%E6%96%B0%E9%97%BB%E6%97%A9%E7%8F%AD%E8%BD%A6&fakeid=MjM5MjAxNDM4MA%3D%3D&type=9';
	var hostname = 'https://mp.weixin.qq.com';
	var path = '/cgi-bin/appmsg?token=2052806918&lang=zh_CN&f=json&ajax=1&random=0.7998929288148617&action=list_ex&begin=0&count=5&query=%E6%9D%A5%E4%BA%86%EF%BC%81%E6%96%B0%E9%97%BB%E6%97%A9%E7%8F%AD%E8%BD%A6&fakeid=MjM5MjAxNDM4MA%3D%3D&type=9';
	var option = {
		hostname: hostname,
		path: path,
		headers: {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
			"Host": "mp.weixin.qq.com",
			"Referer": "https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=10&isMul=1&isNew=1&lang=zh_CN&token=2137494705",
			"Cookie": "pgv_pvid=9290460692; pgv_pvi=9613647872; ua_id=NJPiozYEeMSChFG0AAAAABR7pnosN-xmPSiM0Gym4Xg=; ts_uid=589866628; pt2gguin=o0374452668; RK=nYQhC8zlNr; ptcz=c76646d6ce5a0fb11009f4a6f33407e98950d97df82c0a4beeaed95c5c779e0c; noticeLoginFlag=1; mm_lang=zh_CN; o_cookie=374452668; pac_uid=1_374452668; rewardsn=; wxtokenkey=777; pgv_si=s269601792; cert=VAwe1H9YD8xusNzXyp4WsreJVmJcYL55; remember_acct=c54dxs%40163.com; uuid=9a283efd162b7328fbcf6d67128e20e5; ticket=720d9de6348aab86d5c25411d61edd27466deebd; ticket_id=gh_a2f9f4eb3766; data_bizuin=2398370484; bizuin=2398371314; data_ticket=+3lkIqn9FJc2My4GBbfg4DhGUynVEjJzUWrSxspylN8eQTOHP7g3JaUwMmxDhu3s; slave_sid=QktFRUVQcHlCdmM0R0R0SUhwRnVUTWdUWkNlU2xYc0RRU0ZJMkMyM0tRTGdzNzJNMk1jMjNvRnJRM055SnpLN3lIc0NjTTJpcHFZd2M2bUFLcGpvRHBuUHptZHhHVjZjN185bFVGV2hRYzhTdURXWTVGbDN3QThOVnl5WDhFSFEyNU81NjBaUjl3ZUpuaXNY; slave_user=gh_a2f9f4eb3766; xid=b93c71810863e9396d7e48e0607276f4; openid2ticket_otDr0jlpT8m__Hae_7qI1d_3iy-4=6yoAsJXuQ6vpgTS2DsjuisFoYkkJFDEr6BgKRsin8A8="
		}
	};
	https.get(option, function(res) {
		var chunks = [];
		res.on('data', function(chunk) {
			chunks.push(chunk);
		})
		res.on('end', function() {
			console.log(Buffer.concat(chunks).toString());
		})
	})
	
	
//	// 用 superagent 去抓取“微信”的内容
//	superagent.get('https://mp.weixin.qq.com/cgi-bin/appmsg?token=2052806918&lang=zh_CN&f=json&ajax=1&random=0.7998929288148617&action=list_ex&begin=0&count=5&query=%E6%9D%A5%E4%BA%86%EF%BC%81%E6%96%B0%E9%97%BB%E6%97%A9%E7%8F%AD%E8%BD%A6&fakeid=MjM5MjAxNDM4MA%3D%3D&type=9')
//		.end(function(err, sres) {
//			// 常规的错误处理
//			if(err) {
//				return next(err);
//			}
//			// sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
//			// 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
//			// 剩下就都是 jquery 的内容了
//			var $ = cheerio.load(sres.text);
//			var items = [];
//			var item = new Object();
//			console.log(sres.text);
//			
//			$('#activity-name').each(function(idx, element){
//				var $element = $(element);
//				item['activity-name'] = $element.text().replace(/\n\s+/g, '');
//			});
//			$('mpvoice').each(function(idx, element){
//				var $element = $(element);
//				item['mpvoice'] = $element.attr('name').replace(/\s+/g, '');
//			});
//			$('#js_name').each(function(idx, element){
//				var $element = $(element);
//				item['js_name'] = $element.text().replace(/\s+/g, '');
//			});
//			$('#publish_time').each(function(idx, element){
//				var $element = $(element);
//				item['publish_time'] = $element.text().replace(/\n\s+/g, '');
//			});
//			$('section:contains("早安")').each(function(idx, element){
//				var $element = $(element);
//				item['text'] = $element.text().replace(/\s+/g, '');
//			});
//			console.log(item);
//			items.push(item);
//			res.send(items);
//		});
});

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('应用实例，访问地址为 http://%s:%s', host, port);
})