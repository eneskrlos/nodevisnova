"use strict";
const httpresponse = require('../utils/httpresponse');
const https = require('https');
const axios = require('../../node_modules/axios');
const { json } = require('express');
const { from } = require('form-data');
const { OAuth2 } = require('fetch-mw-oauth2');
const { http } = require('winston');


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

  constructor() {
    
    this.apirUrltoken = 'https://apisandbox.enzona.net/token';
    this.consumerKey = 'El17TuOJOisRNbCXiqAUuESDMgEa';
    this.consumerSecret = '81FL6KQ6AdRuzF_tFib3odjCz4Ea';
    this.apiUrl = 'https://apisandbox.enzona.net/payment/v1.0.0'; 
    this.scope = 'enzona_business_payment enzona_business_qr';
    this.base64 = new Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
    this.httpsAgent = new https.Agent({ rejectUnauthorized: false });
    this.axiosssl = axios.create({
      httpsAgent: this.httpsAgent
    });
    this.oauth2 = new OAuth2({
      grantType:'client_credentials',
      clientId:this.consumerKey,
      clientSecret:this.consumerSecret,
      tokenEndpoint:this.apirUrltoken,
      scope: this.scope
    });
  }
//genera token de acceso
  async generarAccessToken(){
    console.log(this.base64);
    try {
      
       let data = JSON.stringify({"grant_type": "client_credentials"});
       const resp = await  this.axiosssl.post(this.apirUrltoken,data,{
        headers: {
          'Authorization': `Basic ${this.base64}`
        },
      });  
      console.log(resp.json());
      const respuesta = resp.json();
      /*  if(respuesta.getStatusCode < 200 || respuesta.getStatusCode >= 300){
        _useful.log('apienzona.js').error(respuesta.getBody );
        return new httpresponse(respuesta.getStatusCode,respuesta.getBody)
      }  */
      return new httpresponse(200,"ok",respuesta,"");
    } catch (error) {
      _useful.log('apienzona.js').error(error.toString(),"","");
		  return new httpresponse(500,`A ocurrido un error inesperado:${error.toString()}.`, null,error.toString());
    }
  }

  async payments_Transaction_uuid(transaction_uuid){
    try {
      let resptoken = await generarAccessToken();
      if(resptoken.code != 200){
        _useful.log('apienzona.js').error(resptoken.message, "","" );
		    return new httpresponse(resptoken.code,resptoken.message, null,"");
      }

      const respuesta = await axios.get(`https://apisandbox.enzona.net/payment/v1.0.0/payments/${transaction_uuid}`,{
			 headers: {
          'Authorization': `Bearer ${resptoken.data.access_token}`,
          'Accept': 'application/json'
        }
			}); 
      console.log(transaction_uuid);
      let resp = respuesta.json();
      return new httpresponse(200,"ok",resp,"");
    } catch (error) {
      _useful.log('apienzona.js').error(error.toString(), "","" );
		  return new httpresponse(500,`A ocurrido un error inesperado:${error.toString()}.`, null,error.toString());
    }
  }

  //Permite crear un pago
  async payaments(datapayaments){
    try {
      /* let resptoken = await generarAccessToken();
      if(resptoken.code != 200){
        _useful.log('apienzona.js').error(resptoken.message, "","" );
		    return new httpresponse(resptoken.code,resptoken.message, null,"");
      } */
      const respuesta = await axios.post(`https://apisandbox.enzona.net/payment/v1.0.0/payments`,{datapayaments},{
			 headers: {
          'Authorization': 'Bearer 94a466d9-9d87-3416-9f89-75d10af6341d',//`Basic ${this.base64}`,
          'Content-Type':'application/json',
          'Accept': 'application/json'
        }
			});
      let resp = respuesta.json(); 
      return new httpresponse(200,"Se ha creado el pago",resp,"");
    } catch (error) {
      _useful.log('apienzona.js').error(error.toString(), "","" );
		  return new httpresponse(500,`A ocurrido un error inesperado:${error.toString()}.`, null,error.toString());
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

