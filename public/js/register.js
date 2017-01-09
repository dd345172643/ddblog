var reg = {
	flag:{},
	reg:{
		email:/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
	},
	init:function(){
		this.getDom();
		this.sendMail();
		this.listen();
	},
	getDom:function(){
		this.email = document.getElementsByName('email')[0];
		this.btn = document.getElementsByClassName('ver')[0];
		console.log(this.email)
	},
	listen:function(){
		this.emailReg();
	},
	sendMail:function(){
		var self = this;
		this.btn.addEventListener('click',function(){
			if(self.flag.email){
				var xhr = ajaxFunction();   
		        xhr.open("get","/register?mail="+self.email.value,true);  
		        xhr.send();        //send(null);  
		        xhr.onreadystatechange = function(){  
		            if(xhr.readyState==4){  
		                if(xhr.status==200||xhr.status==304){  
		                    var data = xhr.responseText;                       
		                    console.log('发送成功') 
		                }  
		            }  
		        }     
		    }  else {
		    	alert('请填写正确的邮箱格式')
		    }
		})  
	},
	emailReg:function(){
		var self = this;
		this.email.addEventListener('blur',function(){
			if(!self.reg.email.test(self.email.value)){
				self.flag.email = false;
				alert('邮箱格式不正确')
			}else{
				self.flag.email = true;
			}
		})
	}
}
reg.init();

function ajaxFunction(){  
   var xmlHttp;  
   try{ // Firefox, Opera 8.0+, Safari  
        xmlHttp=new XMLHttpRequest();  
    }  
    catch (e){  
       try{// Internet Explorer  
             xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");  
          }  
        catch (e){  
          try{  
             xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");  
          }  
          catch (e){}  
          }  
    }  
  
    return xmlHttp;  
}  

