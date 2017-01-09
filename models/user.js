// var mongodb = require('./db');
var mongodb = require('mongodb').MongoClient,
    setting = require('../settings');
	
function User(user){
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
}

module.exports = User;
//存储新用户信息
User.prototype.save = function(callback){
	var user = {
		name:this.name,
		password:this.password,
		email:this.email
	}
	//打开数据库
	mongodb.connect(setting.url,function(err,db){

		if(err){
			return callback(err);
		}
		
		//读取users集合
		db.collection('users',function(err,collection){
			if(err){
				db.close();
				return callback(err);
			}
			//插入用户信息
//			console.log(collection)
			collection.insert(user,{
				safe:true
			},function(err,user){
				db.close();
				if(err){
					return callback(err);
				}
				callback(null,user)
			})
		})
	})
}

//获取用户信息
User.prototype.get = function(name,callback){
	mongodb.connect(setting.url,function(err,db){
        console.log('12321321312'+err);
		if(err){
			return callback(err);
		}
		db.collection('users',function(err,collection){
			if(err){
				db.close();
				return callback(err);
			}
			//查询用户信息 find  findOne查询某一条
			collection.findOne({
				name:name
			},function(err,user){
				db.close();
				if(err){
					return callback(err)
				}
				callback(null,user);
			})
		})
	})
}
