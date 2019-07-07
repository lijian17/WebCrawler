// 入口文件
var superagent = require('superagent');
var cheerio = require('cheerio');

var http = require('http');
var https = require('https');
var querystring = require('querystring');
var util = require('util');
var fs = require('fs');

/**
 * --------------------------------------------------------------------------------------------
 * ---微信列表页爬虫-2019-07-06 23:08:49----------------------------------------------------------
 * --------------------------------------------------------------------------------------------
 */
/**
 * 获取微信列表页
 * 
 * @param {Object} begin 起始角标
 * @param {Object} callback 回调方法
 */
function getWeixinList(begin, callback) {
	var path = '/cgi-bin/appmsg?token=1759345781&lang=zh_CN&f=json&ajax=1&random=0.8711302121382885&action=list_ex&begin='+ begin +'&count=5&query=%E6%97%A9%E7%9F%A5%E5%A4%A9%E4%B8%8B%E4%BA%8B&fakeid=MzA4NDI3NjcyNA%3D%3D&type=9';
	var referer = "https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=10&isMul=1&isNew=1&lang=zh_CN&token=1759345781";
	var cookie = "RK=cQVjT+zMcr; pgv_pvi=8529025024; tvfe_boss_uuid=d6881ac330f75442; ts_uid=5065673543; ua_id=7ZofPklMEuUns7x5AAAAACIAT90E2NToqpBzgDvSe8o=; pgv_pvid=4301079240; ptcz=6ea1f4cdf1eaa13248dbbdf027662fae2ff03e43df172559e4e4a01f3d5794dd; mm_lang=zh_CN; qb_qua=; qb_guid=81fb8423fe034e4f8211d2af13129866; Q-H5-GUID=81fb8423fe034e4f8211d2af13129866; NetType=; o_cookie=374452668; pac_uid=1_374452668; noticeLoginFlag=1; openid2ticket_oLMz854x7C6AgL995qqa_JRlv03w=S6Rj03P/okk8o8CwCln73CrwGVwN6ekUvClp+HSuqWw=; rewardsn=; wxtokenkey=777; pgv_si=s9088671744; uuid=9d6c4881521b604794c2a9a8265e7db0; ticket=85ac71cbc97979b89bd8f4394bf61ea317bfdaa6; ticket_id=gh_a2f9f4eb3766; cert=bIKg6rvM3KnuAN29be38GwfOGP0KnJb1; remember_acct=c54dxs%40163.com; data_bizuin=2398370484; bizuin=2398371314; data_ticket=0VTgqmJa135i+EYk9WUDEd7VWc+OuaKic3vNM6gqsvy5keh8CCdZEXy4QXnomMI7; slave_sid=R0hEazIzbjVwanJwWkZJTDQwNTFGNmNhR2doUW00ZXVlOTNKNnlINzF3WGlEVGJQR2ZDVF9hV2h4WF9PR2wyVlVOVm1aN0xqWHFmTjZ1cmVXQk5kUmtLb25VSjJXc1BRV3pZcWZQNjllbjNhdXJ6ZmpadzdvZ0lMZDRPcWdwSTh0bXAwWjVGUkQ5MGJiOVBB; slave_user=gh_a2f9f4eb3766; xid=c85a58e81594bd41238cd560dfdb9a3f; openid2ticket_otDr0jlpT8m__Hae_7qI1d_3iy-4=xjzlFvyd+UMeIH2IhOTO/KYotsdT/S2vlAiwoQGgnyA=";

	var option = {
		hostname: 'mp.weixin.qq.com',
		path: path,
		headers: {
			"user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
			"host": "mp.weixin.qq.com",
			"referer": referer,
			"cookie": cookie
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
	}).on('error', function(err) {
		console.error('\n\n\n请求出错：' + JSON.stringify(err) + '\n\n\n');
		setTimeout(function() {
			callback(JSON.stringify(err))
		}, 10000);
	})
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

/**
 * --------------------------------------------------------------------------------------------
 * ---微信详情页爬虫-2019-07-06 23:08:49----------------------------------------------------------
 * --------------------------------------------------------------------------------------------
 */

// 微信爬虫
function weiXinCrawler(url, callback) {
	// 用 superagent 去抓取“微信”的内容
//	var url = 'https://mp.weixin.qq.com/s/8du8Qb6BAxx2jazNVKvIkA';
//	var url = 'https://mp.weixin.qq.com/s?__biz=MzA4NDI3NjcyNA==&mid=2649354777&idx=1&sn=5d3af91565fbf60533fc259a7d7b67b2&chksm=87f4f682b0837f94c773d642e5b3b5469a97e37024b78d94bc4a6aa19844a8c463cdf5d20aec#rd';
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
			$('script:contains("\",s=\"")').each(function(idx, element) {
				var publish_time = element.children[0].data;
				item['publish_time'] = publish_time.substr(publish_time.indexOf('",s="') + 5, 10);
			});
//			var temp = '';
//			var $text = $('span[style$="rgb(136, 136, 136);"]')
//			console.log($text.length)
//			$text.each(function(idx, element) {
//				var $element = $(element);
//				if (idx == $text.length - 2) {
//					temp = $element.text();
//				} else if(idx == $text.length - 1){
//					item['text'] = temp + '\r\n' + $element.text();
//				}
//			});

//			var $text = $('span,p');
//			console.log($text.length);
//			var index = 0;
//			var temp = '';
//			$text.each(function(idx, element){
//				var $element = $(element);
////				console.log(idx + '-----------' + $element.text());
//				if(/^[a-zA-Z\s'"’”,，.。;；\!！\?？-—]{15,}[.]{1,1}$/.test($element.text().trim())) {
//					item['text'] = temp + '\r\n' + $element.text();
//					console.log('\r\n\r\n\r\n\r\n\r\n配置到的数据：', $element.text());
//				} else {
//					if($element.text() && $element.text().trim().length > 0) {
//						temp = $element.text().trim();
//					}
//				}
//			});

			var $text = $('span,p');
			var index = 0;
			var temp = '';
			$text.each(function(idx, element){
				var $element = $(element);
				if(/^[^\u4e00-\u9fa5]{15,}[.]{1,1}$/.test($element.text().trim())) {
					item['text'] = temp + '\r\n' + $element.text().trim();
					console.log('\r\n配置到的数据：', $element.text());
				} else {
					if($element.text() && $element.text().trim().length > 0) {
						temp = $element.text().trim();
					}
				}
			});
			
			if(!item['text']) {
				var $temp = $('span:contains("每日一语")');
				$temp.each(function(idx, element) {
					var txt = $temp.next().text().trim();
					if (txt && txt.length > 0) {
						item['text'] = '每日一语：' + txt;
					} else {
						console.log('数据未匹配到---------------------');
					}
				});
			}
			
			item['link'] = url;
			console.log(item);
			callback(JSON.stringify(item));
		});
}

// 获取微信详情页数据
function getWeixinListResult() {
	fs.readFile('weixin-list-result.json', function(err, data) {
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
		if(!data || data.length <= 0) {
			return console.error('数据异常');
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

			function polling_app_msg_list() {
				if(index >= listLen) {
					console.log('内循环 %s 完成，执行下一条数据集', begin);
					polling();
					return;
				}
				var link = app_msg_list[index++].link;
				if(!link) {
					console.error('数据源异常：%s', link);
					polling_app_msg_list();
					return;
				}
				setTimeout(function() {
					weiXinCrawler(link, function(item) {
						var resultJson = JSON.parse(item);
						if(resultJson && resultJson.text) {
							var publish_time = resultJson.publish_time;
							if(publish_time && publish_time.length >= 4) {
								var fileName = 'weixin-data-' + publish_time.substr(0, 4) + '.json';
								fs.appendFile(fileName, publish_time + '\r\n' + resultJson.text + '\r\n\r\n', function(err) {
									if(err) return console.log("追加文件失败" + err.message);
									console.log("追加成功\r\n");
								});
							}
							fs.appendFile('weixin-data.json', resultJson.publish_time + '\r\n' + resultJson.text + '\r\n\r\n', function(err) {
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

//exct();// 获取微信列表页
getWeixinListResult(); // 获取微信详情页
//weiXinCrawler('https://mp.weixin.qq.com/s/8du8Qb6BAxx2jazNVKvIkA', function(data){});
