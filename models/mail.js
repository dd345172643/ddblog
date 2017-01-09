var nodemailer  = require("nodemailer");
var user = '345172643@qq.com',
	pass = 'fllexqrppuhibhfj';
var smtpTransport = nodemailer.createTransport({
      service: "qq", 
      auth: {
        user: user,
        pass: pass
    	}
  	});

function sendMail(addressee,code){
	smtpTransport.sendMail({
	    from: user,
	  	to: addressee,
	  	subject: '东东博客注册验证码',
	  	html: '您好！你的东东博客注册验证码为'+code
	}, function(err, res) {
	    console.log(err, res);
	});
}
module.exports = sendMail;