"use strict";
const nodemailer = require("nodemailer");

class email {
  correo = "";
  link = "";
  transporter ;

  constructor(_correo, _link) {
    this.correo = _correo;
    this.link = _link;


    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "erneskrlos@gmail.com", // generated ethereal user
        pass: "pqztlvvcktwngzel ", // generated ethereal password
      },
    });



  }

  async enviarEmail (){
    await this.transporter.sendMail({
      from: '"Active su cuenta 👻" <erneskrlos@gmail.com>', // sender address
      to: this.correo.toString(), // list of receivers
      subject: "Active su cuenta ✔", // Subject line
      text: "Bienvenido", // plain text body
      html: `
      <b>Se ha creado una cuenta en el sitio Visnova, para activar su cuenta pinche el siguiente <a href="${this.link}">link</a>  </b>

      `, // html body
    }); 
 }


 async enviarEmailCodigo (codigo){
  await this.transporter.sendMail({
    from: '"Solicitud de cambio de contraseña 👻" <erneskrlos@gmail.com>', // sender address
    to: this.correo.toString(), // list of receivers
    subject: "Solicitud de cambio de contraseña ✔", // Subject line
    text: "Bienvenido", // plain text body
    html: `
    <b>Se ha enviado el codigo de la cuenta : ${codigo} , clickee el siguiente <a href="${this.link}">link</a> para validar su cuenta. </b>

    `, // html body
  }); 
}

}

// create reusable transporter object using the default SMTP transport
 
//  transporter.verify().then(()=>{
//     console.log('Listo para enviar email');
//  });

 
 
 
 

 
  module.exports = email;

