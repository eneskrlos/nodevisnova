"use strict";
const httpresponse = require('../utils/httpresponse');
const https = require('https');
const axios = require('../../node_modules/axios');
const { json } = require('express');
const { from } = require('form-data');
const { OAuth2 } = require('fetch-mw-oauth2');
const { http } = require('winston');
const { stringify } = require('querystring');

class apienzona {
  apirUrltoken = "";
  consumerKey = "";
  consumerSecret = "";
  apiUrl = ""; 
  scope = ""; 
  base64 = "";
  httpsAgent ;
  axiosssl ;
  oauth2 ;
  access_token ;

  constructor() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = _config.Node_tls_reject_unanthorized;
    this.apirUrltoken = 'https://apisandbox.enzona.net/token';
    this.consumerKey = 'El17TuOJOisRNbCXiqAUuESDMgEa';
    this.consumerSecret = '81FL6KQ6AdRuzF_tFib3odjCz4Ea';
    this.apiUrl = 'https://apisandbox.enzona.net/payment/v1.0.0'; 
    this.scopepayament = 'enzona_business_payment';
    this.scopeqr = 'enzona_business_qr';
    this.base64 = new Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
    this.httpsAgent = new https.Agent({  rejectUnauthorized: false , path: 'https://apisandbox.enzona.net/token'});
    //this.access_token = "";
  }

//genera token de acceso
  async generarAccessToken(){
    try {
       const instance = axios.create({
        headers: {
          'content-type':'application/x-www-form-urlencoded',
          'Authorization': `Basic ${this.base64}`,
        },
      });
      const data = new URLSearchParams();
      data.append('grant_type', 'client_credentials');
      data.append('scope',this.scopepayament)
       const resp = await instance.post(this.apirUrltoken,data); 
      
      if(resp.status != 200 ){
        _useful.log('apienzona.js/generarAccessToken').error(resp.statusText, "", "" );
        return new httpresponse(resp.status,resp.statusText,resp.data,"")
      }
      return new httpresponse(resp.status,resp.statusText,resp.data,"");
    } catch (error) {
      console.log('sadsad', error)
      _useful.log('apienzona.js').error(error.toString(),"","");
		  return new httpresponse(500,`A ocurrido un error inesperado:${error.toString()}.`, null,error.toString());
    }
  }

  // Actualizar token de acceso
  async refreshAccessToken(token,scope){
    try {
       const instance = axios.create({
        //httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        headers: {
          //'content-type': 'application/x-www-form-urlencoded', //'application/x-www-form-urlencoded'
          'Accept': 'application/json',
          'Authorization': `Basic ${this.base64}`
        },
      });
      const data = new URLSearchParams();
      data.append('grant_type', 'refresh_token');
      data.append('refresh_token', token);
      data.append('scope',scope)
      
      const resp = await instance.post(this.apirUrltoken,data); 
      
      return new httpresponse(resp.status,resp.statusText,resp.data,"");
    } catch (error) {
      console.log('error:',error );
      _useful.log('apienzona.js').error(error.toString(),"","");
		  return new httpresponse(500,`A ocurrido un error inesperado:${error.toString()}.`, null,error.toString());
    }
  }

  async payments_Transaction_uuid(transaction_uuid){
    try {
      if(this.access_token == "" || this.access_token == null){
        const respuesta = await generarAccessToken();
        if(respuesta.code != 200){
          _useful.log('apienzona.js').error(respuesta.message, "","" );
          return new httpresponse(respuesta.code,respuesta.message, null,"");
        }
        this.access_token = respuesta.data.access_token;
      }

      const respuesta_uuid = await axios.get(`https://apisandbox.enzona.net/payment/v1.0.0/payments/${transaction_uuid}`,{
			 headers: {
          'Authorization': `Bearer ${this.access_token}`,
          'Accept': 'application/json'
        }
			}); 
      console.log(transaction_uuid);
      const resp = respuesta_uuid.json();
      return new httpresponse(200,"ok",resp,"");
    } catch (error) {
      _useful.log('apienzona.js').error(error.toString(), "","" );
		  return new httpresponse(500,`A ocurrido un error inesperado:${error.toString()}.`, null,error.toString());
    }
  }

  //Permite crear un pago
  async payaments(datapayaments, token){
    try {
      console.log("entro al metodo payaments")
      
      const respuesta_payments = await axios.post('https://apisandbox.enzona.net/payment/v1.0.0/payments',datapayaments,{
			  headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type':'application/json'
        }
			});
      console.log("paso el axios")
      console.log("data",respuesta_payments.data)
      console.log("amount",JSON.stringify(respuesta_payments.data.amount) );
      console.log("items",JSON.stringify(respuesta_payments.data.items));
      console.log("links",JSON.stringify(respuesta_payments.data.links));

      return new httpresponse(respuesta_payments.status,respuesta_payments.statusText,respuesta_payments.data,"");
    } catch (error) {
      console.log("error:",error.response.statusText)
      _useful.log('apienzona.js/payament').error(error.toString(), "","" );
		  return new httpresponse(error.response.status,`A ocurrido un error inesperado:${error.response.statusText}.`, null,error.toString());
    }
  }

  //Obtiene un listado de todos los pagos realizados
  async listpayments(datapayaments){
    try {
      let resptoken = await generarAccessToken();
      if(resptoken.code != 200){
        _useful.log('apienzona.js').error(resptoken.message, "","" );
		    return new httpresponse(resptoken.code,resptoken.message, null,"");
      }
      const respuesta = await axios.get(`https://apisandbox.enzona.net/payment/v1.0.0/payments`,{datapayaments},{
			 headers: {
          'Authorization': `Basic ${this.base64}`,
          'Content-Type':'application/json',
          'Accept': 'application/json'
        }
			});
      let resp = respuesta.json(); 
      return new httpresponse(200,"Se ha mostrado el listado",resp,"");
    } catch (error) {
      _useful.log('apienzona.js').error(error.toString(), "","" );
		  return new httpresponse(500,`A ocurrido un error inesperado:${error.toString()}.`, null,error.toString());
    }
  }

  //Permite completar un pago
  async payamentsTransaction_uuidComplete(transaction_uuid){
    try {
      let resptoken = await generarAccessToken();
      if(resptoken.code != 200){
        _useful.log('apienzona.js').error(resptoken.message, "","" );
		    return new httpresponse(resptoken.code,resptoken.message, null,"");
      }
      const respuesta = await axios.post(`https://apisandbox.enzona.net/payment/v1.0.0/payments/${transaction_uuid}/complete`,{
			 headers: {
          'Authorization': `Basic ${this.base64}`,
          'Content-Type':'application/json',
          'Accept': 'application/json'
        }
			});
      let resp = respuesta.json(); 
      return new httpresponse(200,"Se ha completado el pago",resp,"");
    } catch (error) {
      _useful.log('apienzona.js').error(error.toString(), "","" );
		  return new httpresponse(500,`A ocurrido un error inesperado:${error.toString()}.`, null,error.toString());
    }
  }

  //Permite cancelar un pago
  async payamentsTransaction_uuidCancel(transaction_uuid){
    try {
      let resptoken = await generarAccessToken();
      if(resptoken.code != 200){
        _useful.log('apienzona.js').error(resptoken.message, "","" );
		    return new httpresponse(resptoken.code,resptoken.message, null,"");
      }
      const respuesta = await axios.post(`https://apisandbox.enzona.net/payment/v1.0.0/payments/${transaction_uuid}/cancel`,{
			 headers: {
          'Authorization': `Basic ${this.base64}`,
          'Content-Type':'application/json',
          'Accept': 'application/json'
        }
			});
      let resp = respuesta.json(); 
      return new httpresponse(200,"Se ha cancelado el pago",resp,"");
    } catch (error) {
      _useful.log('apienzona.js').error(error.toString(), "","" );
		  return new httpresponse(500,`A ocurrido un error inesperado:${error.toString()}.`, null,error.toString());
    }
  }

  //Permite obtener un pago
  async getpayamentCheckhout(uuid){
    try {
      let resptoken = await generarAccessToken();
      if(resptoken.code != 200){
        _useful.log('apienzona.js').error(resptoken.message, 'system' );
		    return new httpresponse(resptoken.code,resptoken.message, null,"");
      }
      const respuesta = await axios.get(`https://apisandbox.enzona.net/payment/v1.0.0/payments/checkout/${uuid}`,{
			 headers: {
          'Authorization': `Basic ${this.base64}`,
          'Content-Type':'application/json',
          'Accept': 'application/json'
        }
			});
      let resp = respuesta.json(); 
      return new httpresponse(200,"Se ha mostrado el pago",resp,"");
    } catch (error) {
      _useful.log('apienzona.js').error(error.toString(), "","" );
		  return new httpresponse(500,`A ocurrido un error inesperado:${error.toString()}.`, null,error.toString());
    }
  }

  //Permite realizar la devolución de un pago
  async payamendRefund(transaction_uuid){
    try {
      let resptoken = await generarAccessToken();
      if(resptoken.code != 200){
        _useful.log('apienzona.js').error(resptoken.message, 'system' );
		    return new httpresponse(resptoken.code,resptoken.message, null,"");
      }
      const respuesta = await axios.get(`https://apisandbox.enzona.net/payment/v1.0.0/payments/${transaction_uuid}/refund`,{
			 headers: {
          'Authorization': `Basic ${this.base64}`,
          'Content-Type':'application/json',
          'Accept': 'application/json'
        }
			});
      let resp = respuesta.json(); 
      return new httpresponse(200,"Se ha mostrado el pago",resp,"");
    } catch (error) {
      _useful.log('apienzona.js').error(error.toString(),"","" );
		  return new httpresponse(500,`A ocurrido un error inesperado:${error.toString()}.`, null,error.toString());
    }
  }

  //Obtiene los detalles de una devolución realizada
  async payamentRedfundTransaction_uuid(transaction_uuid){
    try {
      const respuesta = await axios.get(`https://apisandbox.enzona.net/payment/v1.0.0/payments/refund/${transaction_uuid}`,{
			 headers: {
          'Authorization': `Basic ${this.base64}`,
          'Content-Type':'application/json',
          'Accept': 'application/json'
        }
			});
      let resp = respuesta.json(); 
      return new httpresponse(200,"Se ha mostrado el pago",resp,"");
    } catch (error) {
      _useful.log('apienzona.js').error(error.toString(),"","" );
		  return new httpresponse(500,`A ocurrido un error inesperado:${error.toString()}.`, null,error.toString());
    }
  }

  //Obtiene una lista de devoluciones realizadas
  async payamentRedfundList(data){
    try {
      let body = JSON.stringify({data});
      const respuesta = await axios.get(`https://apisandbox.enzona.net/payment/v1.0.0/payments/refund`,{body},{
			 headers: {
          'Authorization': `Basic ${this.base64}`,
          'Content-Type':'application/json',
          'Accept': 'application/json'
        }
			});
      let resp = respuesta.json(); 
      return new httpresponse(200,"Se ha mostrado el pago",resp,"");
    } catch (error) {
      _useful.log('apienzona.js').error(error.toString(),"","" );
		  return new httpresponse(500,`A ocurrido un error inesperado:${error.toString()}.`, null,error.toString());
    }
  }

  //Lista de devoluciones de un pago
  async ListRedfunBypayament(data){
    try {
      let transaction_uuid = data.transaction_uuid;
      let body = JSON.stringify({data});
      const respuesta = await axios.get(`https://apisandbox.enzona.net/payment/v1.0.0/payments/refund/payments/${transaction_uuid}/refunds`,{body},{
			 headers: {
          'Authorization': `Basic ${this.base64}`,
          'Content-Type':'application/json',
          'Accept': 'application/json'
        }
			});
      let resp = respuesta.json(); 
      return new httpresponse(200,"Se ha mostrado la lista",resp,"");
    } catch (error) {
      _useful.log('apienzona.js').error(error.toString(),"","" );
		  return new httpresponse(500,`A ocurrido un error inesperado:${error.toString()}.`, null,error.toString());
    }
  }

  //Permite pagar un producto
  async payamentStore(data){
    try {
      let body = JSON.stringify({data});
      const respuesta = await axios.get(`https://apisandbox.enzona.net/payment/v1.0.0/payments/refund/payments/store`,{body},{
			 headers: {
          'Authorization': `Basic ${this.base64}`,
          'Content-Type':'application/json',
          'Accept': 'application/json'
        }
			});
      let resp = respuesta.json(); 
      return new httpresponse(200,"Se ha pagado el producto",resp,"");
    } catch (error) {
      _useful.log('apienzona.js').error(error.toString(),"","" );
		  return new httpresponse(500,`A ocurrido un error inesperado:${error.toString()}.`, null,error.toString());
    }
  }
}


 
module.exports = apienzona;

