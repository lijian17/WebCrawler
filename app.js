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

var getWeixinList = function(begin, callback){
	var url = 'https://mp.weixin.qq.com/cgi-bin/appmsg?token=2052806918&lang=zh_CN&f=json&ajax=1&random=0.7998929288148617&action=list_ex&begin=0&count=5&query=%E6%9D%A5%E4%BA%86%EF%BC%81%E6%96%B0%E9%97%BB%E6%97%A9%E7%8F%AD%E8%BD%A6&fakeid=MjM5MjAxNDM4MA%3D%3D&type=9';
	var hostname = 'mp.weixin.qq.com';
	var path = '/cgi-bin/appmsg?token=149910836&lang=zh_CN&f=json&ajax=1&random=0.8699264633810757&action=list_ex&begin='+ begin +'&count=5&query=%E6%9D%A5%E4%BA%86%EF%BC%81%E6%96%B0%E9%97%BB%E6%97%A9%E7%8F%AD%E8%BD%A6&fakeid=MjM5MjAxNDM4MA%3D%3D&type=9';
	var option = {
		hostname: 'mp.weixin.qq.com',
		path: path,
		headers: {
			"user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
			"host": "mp.weixin.qq.com",
			"referer": "https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=10&isMul=1&isNew=1&lang=zh_CN&token=149910836",
			"cookie": "RK=cQVjT+zMcr; pgv_pvi=8529025024; tvfe_boss_uuid=d6881ac330f75442; ts_uid=5065673543; ua_id=7ZofPklMEuUns7x5AAAAACIAT90E2NToqpBzgDvSe8o=; pgv_pvid=4301079240; ptcz=6ea1f4cdf1eaa13248dbbdf027662fae2ff03e43df172559e4e4a01f3d5794dd; mm_lang=zh_CN; qb_qua=; qb_guid=81fb8423fe034e4f8211d2af13129866; Q-H5-GUID=81fb8423fe034e4f8211d2af13129866; NetType=; o_cookie=374452668; pac_uid=1_374452668; noticeLoginFlag=1; openid2ticket_otDr0jlpT8m__Hae_7qI1d_3iy-4=CabEVpTPnGyMM3GGCJa2kOTn2tMrMaUyoJlH5E1jmps=; remember_acct=913735050%40qq.com; openid2ticket_oLMz854x7C6AgL995qqa_JRlv03w=S6Rj03P/okk8o8CwCln73CrwGVwN6ekUvClp+HSuqWw=; pgv_si=s8812719104; uuid=cad67fe41f6bc61dab704a9cab8b5611; data_bizuin=2398370484; bizuin=2398371314; data_ticket=HCsb0M2qgTq8MbQx56bChBwDYUYNLSH/Bx9tNhHf7Zf5wM9UY/YxGeTfcY7+S2wy; slave_sid=d01UcE84TkZreDdBOFB5aldTOFoyelZISkdranpqcnA0d3dQZXBlc0NmS1JmaFBRWHdrZUtqcjRFeFlYUFczUUlDYlhVR1lQMTdfOXZ4R1ZzdkVNc0RCSTVlRUFVSzg4YmwzbG9rWjFyQ0dSQWI4MTVoZlJtOFZIcTZFektBbkVYWGVLeUN1NW8wbnhGS25I; slave_user=gh_a2f9f4eb3766; xid=d50f408499b07d9dfeaaabed2305ba7c"
		}
	};
	https.get(option, function(res) {
		var chunks = [];
		res.on('data', function(chunk) {
			chunks.push(chunk);
		})
		res.on('end', function() {
			var data = Buffer.concat(chunks).toString();
			console.log(data);
			callback(data);
		})
	})
}

// 微信爬虫
app.get('/wx', function(req, res, next) {
	var items = [];
	var page = 10;
	
	for (var i = 0; i < page; i++) {
		getWeixinList(i, function(item) {
			items.push(JSON.parse(item));
		});
	}
	
	var t = 1;
	var timeer = setInterval(function() {
		if(items && items.length >= page) {
			res.send(items);
			clearInterval(timeer);
		} else {
			console.log("当前数量:%s, 耗时:%ss", items.length, t++);
		}
	}, 1000);
});


var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('应用实例，访问地址为 http://%s:%s', host, port);
})