// 入口文件
var superagent = require('superagent');
var cheerio = require('cheerio');

var http = require('http');
var https = require('https');
var querystring = require('querystring');
var util = require('util');
var fs = require('fs');


function getWeixinList(begin, callback){
	var url = 'https://mp.weixin.qq.com/cgi-bin/appmsg?token=2052806918&lang=zh_CN&f=json&ajax=1&random=0.7998929288148617&action=list_ex&begin=0&count=5&query=%E6%9D%A5%E4%BA%86%EF%BC%81%E6%96%B0%E9%97%BB%E6%97%A9%E7%8F%AD%E8%BD%A6&fakeid=MjM5MjAxNDM4MA%3D%3D&type=9';
	var hostname = 'mp.weixin.qq.com';
//	var path = '/cgi-bin/appmsg?token=149910836&lang=zh_CN&f=json&ajax=1&random=0.8699264633810757&action=list_ex&begin='+ begin +'&count=5&query=%E6%9D%A5%E4%BA%86%EF%BC%81%E6%96%B0%E9%97%BB%E6%97%A9%E7%8F%AD%E8%BD%A6&fakeid=MjM5MjAxNDM4MA%3D%3D&type=9';
//	var path = '/cgi-bin/appmsg?token=994306359&lang=zh_CN&f=json&ajax=1&random=0.7602511725668888&action=list_ex&begin='+ begin +'&count=5&query=&fakeid=MjM5MjAxNDM4MA%3D%3D&type=9';

	var path = '/cgi-bin/appmsg?token=1715656335&lang=zh_CN&f=json&ajax=1&random=0.30860153375596333&action=list_ex&begin=0&count=5&query=%E6%9D%A5%E4%BA%86%EF%BC%81%E6%96%B0%E9%97%BB%E6%97%A9%E7%8F%AD%E8%BD%A6&fakeid=MjM5MjAxNDM4MA%3D%3D&type=9';
	
	var option = {
		hostname: 'mp.weixin.qq.com',
		path: path,
		headers: {
			"user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
			"host": "mp.weixin.qq.com",
			"referer": "https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=10&isMul=1&isNew=1&lang=zh_CN&token=1715656335",
			"cookie": "RK=cQVjT+zMcr; pgv_pvi=8529025024; tvfe_boss_uuid=d6881ac330f75442; ts_uid=5065673543; ua_id=7ZofPklMEuUns7x5AAAAACIAT90E2NToqpBzgDvSe8o=; pgv_pvid=4301079240; ptcz=6ea1f4cdf1eaa13248dbbdf027662fae2ff03e43df172559e4e4a01f3d5794dd; mm_lang=zh_CN; qb_qua=; qb_guid=81fb8423fe034e4f8211d2af13129866; Q-H5-GUID=81fb8423fe034e4f8211d2af13129866; NetType=; o_cookie=374452668; pac_uid=1_374452668; noticeLoginFlag=1; remember_acct=913735050%40qq.com; openid2ticket_oLMz854x7C6AgL995qqa_JRlv03w=S6Rj03P/okk8o8CwCln73CrwGVwN6ekUvClp+HSuqWw=; pgv_si=s9965456384; cert=0ZdLngDimg2gRapJTAxbur0VStGLaPHn; uuid=7da07043c4b7318a3a915500631a037b; data_bizuin=3892104236; bizuin=3892104236; data_ticket=h1ORr/RGMg9XKD/PZvArZgm24GcDvhbiZOFAiYp8jUmiD2Stz+dwawepwDFGOezE; slave_sid=dG0zOXZTMHptdWJ2anV3SFd2M2hzR3EzT1E2ZkdlQlBsZkNZaFN6UnlOWE4wcEdwVVdmMVRDR3NHMDRRZUZ0QjJoY0JyVWs2b0JWeEVPbTdya2Y0T01rYkNSdkR2VW9ObUZ2SER6NjgxSkdFS3p3aERKMTdQZG5qSDV1VTBpanhpOFp5dnd0aXpXWnFvTno1; slave_user=gh_dda34ac5201c; xid=da6cf27312ef476bb687f27ddf2f5f66"
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
function weiXinCrawler(url, callback) {
	// 用 superagent 去抓取“微信”的内容
	// var url = 'http://mp.weixin.qq.com/s?__biz=MjM5MjAxNDM4MA==&mid=2666258190&idx=1&sn=fab85cf2f26ad1513c376a37b97eefe0&chksm=bdb3b64d8ac43f5b7c34fcf9fad33925f5c11be3f9412acf5290c3d2c40beb9a935df297134d#rd'
	// var url = 'https://mp.weixin.qq.com/s/hcnFHhlzorK8l6JCLiaAPw';
	superagent.get(url)
		.end(function(err, sres) {
			// 常规的错误处理
			if(err) {
				console.error('\n\n\n请求出错：' + JSON.stringify(err) + '\n\n\n');
				callback(JSON.stringify(err));
				return;
			}
			// sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
			// 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
			// 剩下就都是 jquery 的内容了
			var $ = cheerio.load(sres.text);
			var item = new Object();

			$('#activity-name').each(function(idx, element) {
				var $element = $(element);
				item['activity-name'] = $element.text().replace(/\n\s+/g, '');
			});
			$('mpvoice').each(function(idx, element) {
				var $element = $(element);
				item['mpvoice'] = decodeURIComponent($element.attr('name').replace(/\s+/g, ''));
			});
			$('#js_name').each(function(idx, element) {
				var $element = $(element);
				item['js_name'] = $element.text().replace(/\s+/g, '');
			});
			$('script:contains("\",s=\"")').each(function(idx, element){
				var publish_time = element.children[0].data;
				item['publish_time'] = publish_time.substr(publish_time.indexOf('",s="') + 5, 10);
			});
			$('section:contains("早安")').each(function(idx, element) {
				var $element = $(element);
				item['text'] = $element.text().replace(/\s+/g, '');
			});
			item['link'] = url;
			console.log(item);
			callback(JSON.stringify(item));
		});
}

// 获取微信详情页数据
function getWeixinListResult(){
	fs.readFile('weixin-list-result.json', function(err, data){
		if(err) {
			console.error('文件读取错误：' + err);
			return;
		}
		var items = [];
		var begin = 0;
		var t = 0;
		var len = 0;
		var fileNameTime = [];
		
		data = JSON.parse(data);
		if(!data || data.length <= 0){
			return	console.error('数据异常');
		}
		len = data.length;
		

		fs.writeFile('weixin-data.json', '', function(err) {
			if(err) {
				return console.error(err);
			}
		});
	
		fs.writeFile('weixin-data-error.json', '[', function(err) {
			if(err) {
				return console.error(err);
			}
		});
		function polling() {
			if(begin >= len) {
				console.log('数据获取已完成，共 %s 条', len);
				fs.appendFile('weixin-data.json', '', function(err) {
					if(err) {
						return console.error(err);
					}
				});
				fs.appendFile('weixin-data-error.json', ']', function(err) {
					if(err) {
						return console.error(err);
					}
				});
				fs.writeFile('weixin-data-result.json', JSON.stringify(items), function(err) {
					if(err) {
						return console.error(err);
					}
				});
				return;
			}
			var app_msg_list = data[begin++].app_msg_list;
			if(!app_msg_list && app_msg_list.length <= 0) {
				polling();
				return;
			}
			var listLen = app_msg_list.length;
			var index = 0;
			function polling_app_msg_list(){
				if(index >= listLen){
					console.log('内循环 %s 完成，执行下一条数据集', begin);
					polling();
					return;
				}
				var link = app_msg_list[index++].link;
				if (!link) {
					console.error('数据源异常：%s', link);
					polling_app_msg_list();
					return;
				}
				setTimeout(function(){
					weiXinCrawler(link, function(item){
						var resultJson = JSON.parse(item);
						if(resultJson && resultJson.text) {
							var publish_time = resultJson.publish_time;
							if(publish_time && publish_time.length >= 4){
								var fileName = 'weixin-data-' + publish_time.substr(0, 4) + '.json';
								fs.appendFile(fileName, publish_time + '\r\n' + resultJson.text +'\r\n\r\n', function(err) {
									if(err) return console.log("追加文件失败" + err.message);
									console.log("追加成功\r\n");
								});
							}
							fs.appendFile('weixin-data.json', resultJson.publish_time + '\r\n' + resultJson.text +'\r\n\r\n', function(err) {
								if(err) return console.log("追加文件失败" + err.message);
								console.log("追加成功\r\n");
							});
							console.log("当前数量:%s, 耗时:%ss", items.length, ++t);
							items.push(JSON.parse(item));
							polling_app_msg_list();
						} else {
							fs.appendFile('weixin-data-error.json', item + ',\r\n', function(err) {
								if(err) return console.log("追加文件失败" + err.message);
								console.log("追加成功\r\n");
							});
							console.log("当前数量:%s, 耗时:%ss", items.length, ++t);
							polling_app_msg_list();
						}
					});
				}, 1000);
			}
			polling_app_msg_list();
		}
		polling();
	});
}

function exct() {
	var items = [];
	var page = 400 * 5;
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
//exct();
getWeixinListResult();
