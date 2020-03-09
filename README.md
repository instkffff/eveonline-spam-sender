# eve-mail-bomber

-------------------------------

# 使用说明

* defaultdb.js 用于初始化数据库

* index.js 用于获取refresh_token （请替换成你自己的firebase密钥 我这个删掉了）

* idlist.js 用于写入数据库 新人物的characterId 可能会卡住 运行时请使用守护进程 卡住了请手动重启并定位错误（ccp有空id的情况）

* refreshtoken.js 用于刷新access_token 运行时请使用守护进程 我设定是10分钟一刷新（远低于20分钟的过期时间，当然你可以改成5分钟一刷新以便抵消网络错误）

* sender.js 用于发送垃圾邮件 运行时请使用守护进程 我设的是3s一封 发送比较平滑 esi或网络出错不会重发

* dbreader.js 用于执行来将db托管http文件服务器，来方便用浏览器查看或下载（数据库里内含access_token 可能会造成安全问题）

## 垃圾邮件格式

请在sender.js内设置

```
"approved_cost" : 0,
			"body" : "test" ,
			"recipients" : [
				{
					"recipient_id": `${id}`,
					"recipient_type": "character"
				}
			],
			"subject": "subject empty"

```


仅需更改body（内容） subject（主题）

## 初始id设置

请在defaultdb.js中设置初始检索的id

## refresh_token输入

请在refreshtoken.js中设置refresh_token client_id client_secret

-----------------------------------------

这个程序不是特别稳定（几乎没有错误处理机制，且db会越来越大），请定期手动维护，例如日常重启和定期的db备份及初始化。
