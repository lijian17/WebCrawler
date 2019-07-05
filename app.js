// 入口文件
var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

var http = require('http');
var https = require('https');
var querystring = require('querystring');
var util = require('util');
var fs = require('fs');

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
//	var path = '/cgi-bin/appmsg?token=149910836&lang=zh_CN&f=json&ajax=1&random=0.8699264633810757&action=list_ex&begin='+ begin +'&count=5&query=%E6%9D%A5%E4%BA%86%EF%BC%81%E6%96%B0%E9%97%BB%E6%97%A9%E7%8F%AD%E8%BD%A6&fakeid=MjM5MjAxNDM4MA%3D%3D&type=9';
	
	var path = '/cgi-bin/appmsg?token=994306359&lang=zh_CN&f=json&ajax=1&random=0.7602511725668888&action=list_ex&begin='+ begin +'&count=5&query=&fakeid=MjM5MjAxNDM4MA%3D%3D&type=9';
	
	var option = {
		hostname: 'mp.weixin.qq.com',
		path: path,
		headers: {
			"user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
			"host": "mp.weixin.qq.com",
			"referer": "https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=10&isMul=1&isNew=1&lang=zh_CN&token=994306359",
			"cookie": "noticeLoginFlag=1; remember_acct=c54dxs%40163.com; pgv_pvid=9290460692; pgv_pvi=9613647872; ua_id=NJPiozYEeMSChFG0AAAAABR7pnosN-xmPSiM0Gym4Xg=; ts_uid=589866628; pt2gguin=o0374452668; RK=nYQhC8zlNr; ptcz=c76646d6ce5a0fb11009f4a6f33407e98950d97df82c0a4beeaed95c5c779e0c; noticeLoginFlag=1; mm_lang=zh_CN; o_cookie=374452668; pac_uid=1_374452668; rewardsn=; wxtokenkey=777; pgv_si=s269601792; cert=VAwe1H9YD8xusNzXyp4WsreJVmJcYL55; remember_acct=c54dxs%40163.com; ticket_id=gh_a2f9f4eb3766; uuid=921e088e46b30253eda618a64883fd4b; ticket=4bec8212a46697f633ad9140a515487beef0ecd1; data_bizuin=2398370484; bizuin=2398371314; data_ticket=1TKTwgewVN3xx/FjzSQJ3+qkiKllx8JS4mrKMpWZvOOH3BVs8pIy9BVOiEiXM+vM; slave_sid=djB0MkRVMDFxSjZEdUVvWWtKTmZ6TFRpTDJhQl8xMl95ZWxJNFJhQnBsbVZKMVg4Vk1BRG1oYjdROWwzSVc0WndyRlVtWE5KZ2hmVEttVk5sYUVkVzdPNXZWMTZRNm0zbFhNN1BYWGE3UEk3YThrN0RCWmhYMzU5aDEwRm15VXlKRG03YXlsV2d5UFNyRUxZ; slave_user=gh_a2f9f4eb3766; xid=61e66a2029db8a23eea7c757c5595eef; openid2ticket_otDr0jlpT8m__Hae_7qI1d_3iy-4=O+rLgFMPYO4vhlR7EChhBP0bWOUL0cdwSKwca7+1TAk="
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
	}).on('error', function(err){
		console.error('\n\n\n请求出错：' + JSON.stringify(err) + '\n\n\n');
		setTimeout(function(){callback(JSON.stringify(err))}, 10000);
	})
}

// 微信爬虫
app.get('/wx', function(req, res, next) {
	var items = [];
	var page = 400 * 5;
	var begin = 0;
	var t = 0;

	function polling() {
		if(begin >= page) {
			console.log("已完成！数量:%s, 耗时:%ss", items.length, t++);
			fs.writeFile('weixin-list-result.json', JSON.stringify(items), function(err) {
				if(err) {
					return console.error(err);
				}
			});
			res.send(items);
			return;
		}
		setTimeout(function() {
			getWeixinList(begin, function(item) {
				fs.appendFile('weixin-list.json', item, function(err) {
					if(err) return console.log("追加文件失败" + err.message);
					console.log("追加成功");
				});
				begin += 5;
				items.push(JSON.parse(item));
				console.log("当前数量:%s, 耗时:%ss", items.length, ++t);
				polling();
			});
		}, 1000);
	}
	polling();
});

// 获取微信详情页数据
function getWeixinListResult(){
	fs.readFile('weixin-list-result.json', function(err, data){
		if(err) return console.error('文件读取错误：' + err);
		var begin = 0;
		var t = 0;
		var len = 0;
		
		data = JSON.parse(data);
		if(!data || data.length <= 0){
			console.error('数据异常');
		}
		len = data.length;
		
		
	});
}

function exct() {
	var items = [];
	var page = 262 * 5;
	var begin = 0;
	var t = 0;

	fs.writeFile('weixin-list.json', '[', function(err) {
		if(err) {
			return console.error(err);
		}
	});

	fs.writeFile('weixin-list-error.json', '[', function(err) {
		if(err) {
			return console.error(err);
		}
	});
	function polling() {
		if(begin >= page) {
			console.log("已完成！数量:%s, 耗时:%ss", items.length, ++t);
			fs.appendFile('weixin-list.json', ']', function(err) {
				if(err) {
					return console.error(err);
				}
			});
			fs.appendFile('weixin-list-error.json', ']', function(err) {
				if(err) {
					return console.error(err);
				}
			});
			fs.writeFile('weixin-list-result.json', JSON.stringify(items), function(err) {
				if(err) {
					return console.error(err);
				}
			});
			return;
		}
		setTimeout(function() {
			getWeixinList(begin, function(item) {
				var resultJson = JSON.parse(item);
				if(resultJson && resultJson.base_resp && resultJson.base_resp.err_msg && resultJson.base_resp.err_msg == 'ok') {
					fs.appendFile('weixin-list.json', item + ',\r\n', function(err) {
						if(err) return console.log("追加文件失败" + err.message);
						console.log("追加成功");
					});
					console.log("当前数量:%s, 耗时:%ss", items.length, ++t);
					begin += 5;
					items.push(JSON.parse(item));
					polling();
				} else {
					fs.appendFile('weixin-list-error.json', item + ',\r\n', function(err) {
						if(err) return console.log("追加文件失败" + err.message);
						console.log("追加成功");
					});
					console.log("当前数量:%s, 耗时:%ss", items.length, ++t);
					polling();
				}
			});
		}, 1000);
	}
	polling();
}
exct();

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('应用实例，访问地址为 http://%s:%s', host, port);
})