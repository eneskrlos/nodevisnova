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
      host: _config.mailerconfig.host, //"smtp.gmail.com",
      port: _config.mailerconfig.port , //465,
      secure: true, // true for 465, false for other ports
      auth: {
        user:  _config.mailerconfig.correovisnova,//"erneskrlos@gmail.com", // generated ethereal user
        pass:  _config.mailerconfig.pass,//"pqztlvvcktwngzel ", // generated ethereal password
      },
    });



  }

  async enviarEmail (){
    await this.transporter.sendMail({
      from: '"Active su cuenta 👻" '+"<"+ _config.mailerconfig.correovisnova+">", // sender address
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
      from: '"Solicitud de cambio de contraseña 👻" '+"<"+ _config.mailerconfig.correovisnova+">", // sender address
      to: this.correo.toString(), // list of receivers
      subject: "Solicitud de cambio de contraseña ✔", // Subject line
      text: "Bienvenido", // plain text body
      html: `
      <b>Se ha enviado el codigo de la cuenta : ${codigo} , clickee el siguiente <a href="${this.link}">link</a> para validar su cuenta. </b>

      `, // html body
    }); 

  }

  async enviarCorreoContactenos(nombre,correo,texto){
    await this.transporter.sendMail({
      from: nombre.toString() + "<" +correo.toString()+ ">", // sender address
      to: _config.mailerconfig.correovisnova.toString(), // list of receivers
      subject: "Correo de Contactenos de visnova ✔", // Subject line
      text: "Hola", // plain text body
      html: `
      <p>${texto}</p>
      
      `, // html body
    });
  }

}

// create reusable transporter object using the default SMTP transport
 
//  transporter.verify().then(()=>{
//     console.log('Listo para enviar email');
//  });

 
 
 
 

 
  module.exports = email;

