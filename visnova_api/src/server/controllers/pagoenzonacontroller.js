const axios = require('../../../node_modules/axios');
const apienzona = require('../../utils/apienzona');
const httpresponse = require('../../utils/httpresponse')
exports.pagoenzonacontroller =  {

	
	async pruebaCreateToken(req,res){
		let datauser = req.user;
		try {
			console.log('esta aqui');
			let zona = new apienzona(); 
			let token = await zona.generarAccessToken();
			console.log("dataToken",token);
			if(token.code != 200){
				//_useful.log('pagoenzonacontroller.js').error('Error al generar token.',datauser.user);
				let resphttp = new httpresponse(500,token.message,null,token.serverError);
				return res.send(resphttp);
			}
			console.log("token",token);
			_useful.log('pagoenzonacontroller.js').info('Se genero el token correctamente',datauser.user.user);
			let resphttp = new httpresponse(200,"Se genero el token correctamente",token.data,"");
			return res.send(resphttp);
		} catch (error) {
			//_useful.log('pagoenzonacontroller.js').error('Error al generar token.',datauser.user,error);
			let resphttp = new httpresponse(500,`Error al generar token:${error}`,null,"");
			return res.send(resphttp);
		}
	},  

	async pago_Transaction_uuid(req,res){
		let datauser = req.user;
		let { body } = req;
		let { transaction_uuid } = body;
		
		try {
			let zona = new apienzona(); 
			let resp = await zona.payments_Transaction_uuid(transaction_uuid);
			
        return res.send({code: resp.code,message: "Se ha mostrados los datos de la transación", data: resp.data});
		} catch (error) {
			_useful.log('pagoenzonacontroller.js').error(`Error al obtener los pagos del usuario ${datauser.user}.`,datauser.user,error);
			return res.send({
				code:500,
				message:`Error al obtener los pagos del usuario ${datauser.user}.`,
				data: null,
				servererror: error.message,
			});
		}
	},

	async crearPago(req, res){
		let datauser = req.user;
		let { body } = req;
		let {description, currency, amount, items, merchant_op_id, invoice_number, 
			return_url, cancel_url, terminal_id, buyer_identity_code} = body;
		try {
			let zona = new apienzona(); 
			let resp = await zona.payaments(body);
			return res.send({code: resp.code,message: resp.message, data: resp.data});
		} catch (error) {
			_useful.log('pagoenzonacontroller.js').error(`Error al crear el pago.`,datauser.user,error);
			return res.send({
				code:500,
				message:`Error al crear el pago.`,
				data: null,
				servererror: error.message,
			});
		}
	},

	async obtenerListaTodoslosPago(req, res){
		let datauser = req.user;
		let { body } = req;
		let {merchant_uuid, limit, offset, status_filter, start_date_filter, end_date_filter, 
			order_filter} = body;
		try {
			let zona = new apienzona(); 
			let resp = await zona.listpayments(body);
			return res.send({code: resp.code,message: resp.message, data: resp.data});
		} catch (error) {
			_useful.log('pagoenzonacontroller.js').error(`Error al crear el pago.`,datauser.user,error);
			return res.send({
				code:500,
				message:`Error al crear el pago.`,
				data: null,
				servererror: error.message,
			});
		}
	},

	async completarPago(req, res){
		let datauser = req.user;
		let { body } = req;
		let {transaction_uuid} = body;
		try {
			let zona = new apienzona(); 
			let resp = await zona.payamentsTransaction_uuidComplete(transaction_uuid);
			return res.send({code: resp.code,message: resp.message, data: resp.data});
		} catch (error) {
			_useful.log('pagoenzonacontroller.js').error(`Error al completar el pago.`,datauser.user,error);
			return res.send({
				code:500,
				message:`Error al completar el pago.`,
				data: null,
				servererror: error.message,
			});
		}
	},

	async cancelarPago(req,res){
		let datauser = req.user;
		let { body } = req;
		let {transaction_uuid} = body;
		try {
			let zona = new apienzona(); 
			let resp = await zona.payamentsTransaction_uuidCancel(transaction_uuid);
			return res.send({code: resp.code,message: resp.message, data: resp.data});
		} catch (error) {
			_useful.log('pagoenzonacontroller.js').error(`Error al cancelar el pago.`,datauser.user,error);
			return res.send({
				code:500,
				message:`Error al cancelat el pago.`,
				data: null,
				servererror: error.message,
			});
		}
	},

	async obtenerPago(req,res){
		let datauser = req.user;
		let { body } = req;
		let {uuid} = body;
		try {
			let zona = new apienzona(); 
			let resp = await zona.getpayamentCheckhout(uuid);
			return res.send({code: resp.code,message: resp.message, data: resp.data});
		} catch (error) {
			_useful.log('pagoenzonacontroller.js').error(`Error al obtener el pago.`,datauser.user,error);
			return res.send({
				code:500,
				message:`Error al obtener el pago.`,
				data: null,
				servererror: error.message,
			});
		}
	},

	async devolucionPago(req,res){
		let datauser = req.user;
		let { body } = req;
		let {transaction_uuid} = body;
		try {
			let zona = new apienzona(); 
			let resp = await zona.payamendRefund(transaction_uuid);
			return res.send({code: resp.code,message: resp.message, data: resp.data});
		} catch (error) {
			_useful.log('pagoenzonacontroller.js').error(`Error al realzar devolucion del pago.`,datauser.user,error);
			return res.send({
				code:500,
				message:`Error al realzar devolucion del pago.`,
				data: null,
				servererror: error.message,
			});
		}
	},

	async obtenerDetallesDevolucion(req,res){
		let datauser = req.user;
		let { body } = req;
		let {transaction_uuid} = body;
		try {
			let zona = new apienzona(); 
			let resp = await zona.payamentRedfundTransaction_uuid(transaction_uuid);
			return res.send({code: resp.code,message: resp.message, data: resp.data});
		} catch (error) {
			_useful.log('pagoenzonacontroller.js').error(`Error al realzar devolucion del pago.`,datauser.user,error);
			return res.send({
				code:500,
				message:`Error al realzar devolucion del pago.`,
				data: null,
				servererror: error.message,
			});
		}
	},

	async obtenerListaDevolucion(req,res){
		let datauser = req.user;
		let { body } = req;
		let {merchant_uuid,limit,offset,status_filter,start_date_filter,end_date_filter,order_filter} = body;
		try {
			let zona = new apienzona(); 
			let resp = await zona.payamentRedfundList(body);
			return res.send({code: resp.code,message: resp.message, data: resp.data});
		} catch (error) {
			_useful.log('pagoenzonacontroller.js').error(`Error al realzar devolucion del pago.`,datauser.user,error);
			return res.send({
				code:500,
				message:`Error al realzar devolucion del pago.`,
				data: null,
				servererror: error.message,
			});
		}
	},

	async listaDevolucionesPago(req,res){
		let datauser = req.user;
		let { body } = req;
		let {transaction_uuid,limit,offset,status_filter,start_date_filter,end_date_filter,order_filter} = body;
		try {
			let zona = new apienzona(); 
			let resp = await zona.ListRedfunBypayament(body);
			return res.send({code: resp.code,message: resp.message, data: resp.data});
		} catch (error) {
			_useful.log('pagoenzonacontroller.js').error(`Error al mostrar la lista de devoluciones de un pago.`,datauser.user,error);
			return res.send({
				code:500,
				message:`Error al mostrar la lista de devoluciones de un pago.`,
				data: null,
				servererror: error.message,
			});
		}
	},

	async pagarProducto(req,res){
		let datauser = req.user;
		let { body } = req;
		let {funding_source_uuid,description,currency,payment_password,amount,items} = body;
		try {
			let zona = new apienzona(); 
			let resp = await zona.payamentStore(body);
			return res.send({code: resp.code,message: resp.message, data: resp.data});
		} catch (error) {
			_useful.log('pagoenzonacontroller.js').error(`Error al mostrar la lista de devoluciones de un pago.`,datauser.user,error);
			return res.send({
				code:500,
				message:`Error al mostrar la lista de devoluciones de un pago.`,
				data: null,
				servererror: error.message,
			});
		}
	},



};