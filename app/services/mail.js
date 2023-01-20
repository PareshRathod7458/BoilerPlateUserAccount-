const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'Gmail',
    secure: false,
    port: 25,
    auth:{
        user:'pareshrathod.shivinfotech@gmail.com',
        pass:'ibkqqnhckvojsztk'
    }
})

const sendOTP = (email,otp)=>{
const mailSend = {
    to:email,
    subject:'OTP for New Password',
    html:"OTP for New Password" + "<b>" + "  " + otp +"</b>"
}

 const mail =transport.sendMail(mailSend,function(error){
    if(error){
        console.log(error);

    }
    else{
        console.log('Email is  sent'); 
    }
})
return mail;

}

module.exports={sendOTP};