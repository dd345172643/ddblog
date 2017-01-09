// var mongodb = require('./db');
//	markdown = require('markdown').markdown;
var mongodb = require('mongodb').MongoClient,
	setting = require('../settings');
function Post(name,title,post){
	this.name = name;
	this.title = title;
	this.cont = post;
}
module.exports = Post;

//存储一篇文章及其相关信息

Post.prototype.save = function(callback){
	var date = new Date();
	var year = date.getFullYear()
		month = date.getMonth()+1<10?("0"+(date.getMonth()+1)):(date.getMonth()+1),
		day = date.getDate()<10?("0"+date.getDate()):date.getDate(),
		hours = date.getHours()<10?("0"+date.getHours()):date.getHours(),
		minute = date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes();
	//存储的时间格式
	var time = {
		date:date,
		year:year,
		month:year+'-'+month,
		day:year+'-'+month+'-'+day,
		hours:year+'-'+month+'-'+day+' '+hours,
		minute:year+'-'+month+'-'+day+' '+hours+':'+minute,
	}
	var timeStamp = Date.parse(new Date())+'';
	//要存入数据库的文档
//	console.log('post内容:'+this.name+'postname:'+this.cont)
	var post = {
		name:this.name,
		title:this.title,
		timeStamp:timeStamp,
		time:time,
		cont:this.cont
	}
	//打开数据库
	mongodb.connect(setting.url,function(err,db){
		if(err){
			return callback(err);
		}
		//读取post集合
		db.collection('post',function(err,collection){
			if(err){
				db.close();
				return callback(err);
			}
			//将文档存入post集合
			collection.insert(post,{
				safe:true
			},function(err){
				db.close();
				if(err){
					return callback(err);
				}
				callback(null);
			})
		})
	})
}

//根据作者获取该坐着的所有文章，如name为null则返回所有的文章
Post.prototype.getAll =function(name,callback){
	//打开数据库
	mongodb.connect(setting.url,function(err,db){
		if(err){
			return callback(err);
		}
//		console.log('docs='+name)
		//读取post集合
		db.collection('post',function(err,collection){
			if(err){
				db.close();
				return callback(err);
			}
			var query = {};
			
			if(name){
				query.name = name;
			}
			//依据query对象查询文章
			collection.find(query).sort({
				time:-1
			}).toArray(function(err,docs){
				db.close();
				if(err){
					return callback(err);
				}
				
//				docs.forEach(function(doc){					
//					doc.cont = markdown.toHTML(doc.cont)
//					console.log(doc)
//				})
				callback(null,docs);
			})
		})
	})
}
//获取一篇文章
Post.prototype.getOne = function(name,day,title,callback){
	mongodb.connect(setting.url,function(err,db){
		if(err){
			return callback(err)
		}
//		console.log(name+'/'+day+'/'+title)
		//读取post文章集合
		db.collection('post',function(err,collection){
			if(err){
				db.close();
				callback(err);
			}
			collection.findOne({
				name:name,
				timeStamp:day,
//				title:title
			},function(err,doc){
				db.close();
				if(err){
					return callback(err)
				}
				callback(null,doc);
			})
		})
	})
}
//更新文章内容，这里不给于更新标题的权利
Post.prototype.update = function(name,day,title,post,callback){
	mongodb.connect(setting.url,function(err,db){
		if(err){
			return callback(err)
		}
		db.collection('post',function(err,collection){
			
			if(err){
					db.close();
					return callback(err);
			}			
			collection.update({
				name:name,
//				title:title,
				timeStamp:day
			},{
				$set:{cont:post}
			},function(err){
				db.close();
				if(err){
					return callback(err)
				}
				callback(null);
			})
		})
	})
}
//删除一篇文章
Post.prototype.remove = function(name,day,title,callback){
	mongodb.connect(setting.url,function(err,db){
		if(err){
			return callback(err);
		}
		//读取post集合
		db.collection('post',function(err,collection){
			if(err){
				db.close();
				return callback(err);
			}
			collection.remove({
				name:name,
//				title:title,
				timeStamp:day	
			},1,function(err,doc){
				db.close();
				if(err){
					return callback(err);
				}
				return callback(null);
			})
		})
	})
}
