/*
 生成一个路由实例来捕获访问主页的GET请求，导出这个路由并在app.js中通过app.user('/',route)加载。
 这样当访问主页时，就会调用res.render('index',{title:'Express'}),
 渲染 views/index.ejs文件
 */
//var express = require('express');
//var router = express.Router();

///* GET home page. */
//router.get('/', function(req, res, next) {
//res.render('index', { title: 'Express' });
//});
//
//module.exports = router;

var crypto = require('crypto'),//生成散列值加密密码
	User = require('../models/user'),
	Post = require('../models/post'),
	mail = require('../models/mail'),
	upload = require('../models/upload');

module.exports = function(app){
	//主页
	app.get('/',function(req,res){
			var post = new Post(),
				posts = [];
			post.getAll(null,function(err,post){	
				
				if(!err){
					console.log('错误:'+err)
					posts = post;
				}	
				res.render('index',{//res.render为会与其他js代码同步运行
					title:'主页',
					user:req.session.user,
					posts:posts
				})
			})
		
	})
	
	//登陆
	app.get('/login',checkNotLogin);
	app.get('/login',function(req,res){
		res.render('login',{
			title:'登录',
			user:req.session.user,
		})
	});
	app.post('/login',checkNotLogin);
	app.post('/login',function(req,res){
//		console.log(req.body)
		var md5 = crypto.createHash('md5'),
		password = req.body.password;
		if(req.body.name!='admin'){
			password= md5.update(req.body.password).digest('hex');
		}	
		var newUser = new User({
			name:req.body.name,
			password:password,
			email:req.body.email
		})
		newUser.get(req.body.name,function(err,user){
//			console.log(user)
			//检测用户是否存在
			if(!user){
				req.flash('error','用户不存在');
				return res.redirect('/login');
			}
			
			//检查密码是否一致
			if(user.password!=password){
				req.flash('error','密码错误');
				return res.redirect('/login');
			}
			//用户密码和账号都匹配后，将用户信息存入session中
			req.session.user = newUser;
			req.flash('success','登陆成功');
			return res.redirect('/');
		})
		
	})
	//登陆end
	//注册
	app.get('/refister',checkNotLogin);
	app.get('/register',function(req,res){
		if(req.query.mail){
//			console.log(req.query.mail);
			var code = parseInt(Math.random()*10000);
			console.log('你的博客注册验证码为：'+code);
			req.session.code = code;
			mail(req.query.mail,code);
		}
		res.render('register',{
			title:'注册',
			user:req.session.user,
		})
	});
	app.post('/refister',checkNotLogin);
	app.post('/register',function(req,res){
		if(req.session.code==req.body.verCode){
			var name = req.body.name,
				password = req.body.password,
				password_re = req.body['password-repeat'];
//				console.log(req.body)
			if(password_re != password){
				req.flash('error','两次输入的密码不一致');
				return res.redirect('register');//返回注册页
			}
			
			var md5 = crypto.createHash('md5'),
				password = md5.update(req.body.password).digest('hex');
			var newUser = new User({
				name:req.body.name,
				password:password,
				email:req.body.email
			})
			
			//检查用户名是否存在
			newUser.get(newUser.name,function(err,user){
//				console.log('...........123123123：'+user)
				if(err){
					req.flash('error',err);//提示信息变量error的值赋给了res.local.errors
					return res.redirect('/')
				}
				if(user){
					req.flash('error','用户已存在')
					return res.redirect('register')
				}
				//不存在则增加新用户
				newUser.save(function(err,user){
					if(err){
						req.flash('error',err);
						return res.redirect('register');
					}
					req.session.user = newUser;
					req.session.code = null;
//					console.log(user)
					req.flash('success','注册成功');//提示信息变量error的值赋给了res.local.errors
					res.redirect('/');
				})
			})				
		}else{
			req.flash('error','验证码不正确');
			res.redirect('/register');
		}
	});
	//注册结束
	//上传
	app.get('/upload',checkLogin);
	app.get('/upload',function(req, res){
		res.render('upload',{
			title:'文件上传',
			user:req.session.user,
		})
	})
	

	app.post('/upload', function(req, res){
		var Upload = upload.fields([
		    {name: 'file1'},
		    {name: 'file2'},
		    {name: 'file3'},
		    {name: 'file4'},
		    {name: 'file5'}
		]);
		Upload(req, res,function(err){
//			console.log(1)
			if(err){
//				console.log(2)
				 req.flash('error', '文件上传失败!');
			}else {
				req.flash('error', '文件上传成功!');
			}
			return res.redirect('/upload');
		})	    
	});
	//上传结束
	
	//发表
	app.get('/post',checkLogin);
	app.get('/post',function(req,res){
		res.render('post',{
			title:'发表',
			user:req.session.user,
			
			})
	})
	app.post('/post',checkLogin);
	app.post('/post',function(req,res){
		var currentUser =req.session.user,
			post = new Post(currentUser.name,req.body.title,req.body.cont);
//		console.log('req.body.cont:'+req.body.cont)
		post.save(function(err){
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			req.flash('success','发布成功!');
			return res.redirect('/')
		})
	})
	app.get('/logout',function(req,res){
		req.session.user = null;
		req.flash('success','登出成功');
		return res.redirect('/');
	});
	//发表end
	
	//个人主页
	app.get('/user/:name',function(req,res){
		//检查用户是否存在
//		var user = new User();
		var user = new User({
				name:req.params.name,
			});
		var post = new Post();
		user.get(req.params.name,function(err,user){
//			console.log(user)
			if(!user){
				req.flash('error','用户不存在！');
				return res.redirect('/');
			}
			post.getAll(user.name,function(err,posts){
				if(err){
					req.flash('error',err);
					return res.redirect('/')
				}
				res.render('user',{
					title:user.name,
					posts:posts,
					user:req.session.user,
				})
			})
		})
	})
	//文章页
	app.get('/user/:name/:timeStamp/:title',function(req,res){
		var posts = new Post();
		posts.getOne(req.params.name,req.params.timeStamp,req.params.title,function(err,post){
//			console.log('+++++++++++'+post.cont)
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			res.render('article',{
				title:req.params.title,
				post:post,
				user:req.session.user
			})
		})
	})
	//文章页end
	
	//文章编辑页  edit
	app.get('/edit/:name/:day/:title',checkLogin);
	app.get('/edit/:name/:day/:title',function(req,res){
		var currentUser = req.session.user;
		var post = new Post();
		post.getOne(currentUser.name,req.params.day,req.params.title,function(err,post){
//			console.log(post)
			if(err){
				req.flash('error',err);
				return res.redirect('back')
			}
			res.render('edit',{
				title:'编辑',
				posts:post,
				user:req.session.user,
			})
		})
	})
	
	app.post('/edit/:name/:day/:title',function(req,res){
		var post = new Post();
		var currentUser = req.session.user;
		post.update(currentUser.name,req.params.day,req.params.title,req.body.cont,function(err){
			var url = encodeURI('/user/'+req.params.name+'/'+req.params.day+'/'+req.params.title);
			if(err){
				req.flash('error',err);
				return res.redirect(url)
			}
			req.flash('success','修改成功！');
			return res.redirect(url);
		})
	})
	//编辑页end
	
	//文章删除页
	app.get('/remove/:name/:day/:title',checkLogin);
	app.get('/remove/:name/:day/:title',function(req,res){
		var post = new Post();
		var currentUser = req.session.user;
		post.remove(currentUser.name,req.params.day,req.params.title,function(err){
			var url = encodeURI('/user/'+req.params.name+'/'+req.params.day+'/'+req.params.title);
			if(err){
				req.flash('error',err);
				return res.redirect(url)
			}
			req.flash('success','删除成功！');
			return res.redirect(url);
		})
	})
}

function checkLogin(req,res,next){
	if(!req.session.user){
		req.flash("error",'未登录!');
		res.redirect('/login');
	}
	next();
}

function checkNotLogin(req,res,next){
	if(req.session.user){
		req.flash('error','已登录!');
		res.redirect('back');
	}
	next();
}
