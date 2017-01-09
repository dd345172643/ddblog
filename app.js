var express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),//中间件引用，主要用于拿取别的网站上的logo？
	logger = require('morgan'),//express日志组件，也可独立于express作为单独日志组件
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	multer = require('multer');

var routes = require('./routes/index'),//路由模板
	settings = require('./settings'),
	
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),//session和mongoStore模块实现将会话信息存储到mongodb
	flash = require('connect-flash');//将信息写入flash，在下一次显示完毕后立即清除

//var users = require('./routes/users');

var app = express();//生成实例APP

// view engine setup
app.set('port', process.env.poty || 3000);
app.set('views', path.join(__dirname, 'views'));//设置views文件夹为存放视图的目录
app.set('view engine', 'ejs');//设置视图模板引擎为ejs

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));//设置favicon图标

app.use(logger('dev'));//加载日志中间件

app.use(bodyParser.json());//加载解析json中间件

app.use(bodyParser.urlencoded({ extended: true }));//加载解析urlencoded请求体的中间件

app.use(cookieParser());//加载解析cookies中间件

app.use(express.static(path.join(__dirname, 'public')));//设置public文件夹为存放静态文件的目录

app.use(session({
	secret:settings.cookieSecret,
	// key:settings.db,
	cookie:{maxAge:1000*60*60*24*30},//30天
	/*store:new MongoStore({
		url:'mongodb://localhost:27017/blog',
		db:settings.db,
		host:settings.host,
		port:settings.port
	})*/
	url:settings.url
}));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});
//app.use('/', index);
//app.use('/users', users);//路由控制器

routes(app);

app.listen(app.get('port'),function(){
	console.log('Express server listening on port' + app.get('port'));
})
//// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//var err = new Error('Not Found');
//err.status = 404;
//next(err);
//});//捕获404错误并转发到错误处理器
//
//// error handler
//app.use(function(err, req, res, next) {
//// set locals, only providing error in development
//res.locals.message = err.message;
//res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//// render the error page
//res.status(err.status || 500);
//res.render('error');
//});//生产环境下的错误处理器.将错误信息渲染error模板并显示到浏览器中.
//
//module.exports = app;//导出app模板供其他模板调用
