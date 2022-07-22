const axios = require('../../../node_modules/axios');
const apienzona = require('../../utils/apienzona');
const httpresponse = require('../../utils/httpresponse')
exports.pagoenzonacontroller =  {

	
	async pruebaCreateToken(req,res){
		let datauser = req.user;
		try {
			let zona = new apienzona(); 
			let token = await zona.generarAccessToken();
			if(token.code != 200){
				//_useful.log('pagoenzonacontroller.js').error('Error al generar token.',datauser.user);
				let resphttp = new httpresponse(500,token.message,null,token.serverError);
				return res.send(resphttp);
			}
			let datatoken = {};
			datatoken.access_token = token.data.access_token;
			datatoken.scope = token.data.scope;
			datatoken.token_type = token.data.token_type;
			datatoken.expires_in = token.data.expires_in;
			datatoken.fecha = Date.now;
			let newtoken = await _database.zunpc.repository.pagoenzonarepository.createToken(datatoken);
			_useful.log('pagoenzonacontroller.js').info('Se genero el token correctamente',datauser.user.user);
			let resphttp = new httpresponse(200,"Se genero el token correctamente",token.data,"");
			return res.send(resphttp);
		} catch (error) {
			//_useful.log('pagoenzonacontroller.js').error('Error al generar token.',datauser.user,error);
			let resphttp = new httpresponse(500,`Error al generar token:${error}`,null,"");
			return res.send(resphttp);
		}
	}, 
	
	async pruebaRefreshToken(req,res){
		let datauser = req.user;
		let tokenexpire = req.token;
		try {
			let zona = new apienzona(); 
			let token = await zona.refreshAccessToken(tokenexpire);
			if(token.code != 200){
				//_useful.log('pagoenzonacontroller.js').error('Error al generar token.',datauser.user);
				let resphttp = new httpresponse(500,token.message,null,token.serverError);
				return res.send(resphttp);
			}
			let tokenbd = await _database.zunpc.repository.pagoenzonarepository.getToken();
			let datatoken = {};
			datatoken.identoken = tokenbd.identoken;
			datatoken.access_token = token.data.access_token;
			datatoken.scope = token.data.scope;
			datatoken.token_type = token.data.token_type;
			datatoken.expires_in = token.data.expires_in;
			datatoken.fecha = Date.now;
			let newtoken = await _database.zunpc.repository.pagoenzonarepository.update(datatoken);
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
		console.log("crear pago entro aqui")
		let datauser = req.user;
		let { body } = req;
		let {description, currency, amount, items, merchant_op_id, invoice_number, 
			return_url, cancel_url, terminal_id, buyer_identity_code} = body;
			let newtoken = {};
		try {
			let zona = new apienzona(); 
			let datatoken = await _database.zunpc.repository.pagoenzonarepository.getToken();
			let token = (datatoken.length != 0)? datatoken[0].access_token: '';
			let scope = (datatoken.length != 0)? datatoken[0].scope: '';
			if(token == ''){
				let token = await zona.generarAccessToken();
				if(token.code != 200){
					let resphttp = new httpresponse(token.code,token.message,null,token.serverError);
					return res.send(resphttp);
				}
				let objtoken = {};
				objtoken.access_token = token.data.access_token;
				objtoken.scope = token.data.scope;
				objtoken.token_type = token.data.token_type;
				objtoken.expires_in = token.data.expires_in;
				objtoken.fecha = Date.now;
				newtoken = await _database.zunpc.repository.pagoenzonarepository.createToken(objtoken);
				let datatoken = await _database.zunpc.repository.pagoenzonarepository.getToken();
				token = (datatoken.length != 0)? datatoken[0].access_token: '';
				_useful.log('pagoenzonacontroller.js/crearPago').info('Se genero el token correctamente',datauser.user.user);
			}
			console.log("crear pago seguimos aqui")
			let resp = await zona.payaments(body,token);
			if(resp.code != 200){
				if(resp.code == 401){
					//var respactualizar = await zona.refreshAccessToken(token,scope);
					var respactualizar = await zona.generarAccessToken();

					if(respactualizar.code != 200){
						let resphttp = new httpresponse(respactualizar.code,respactualizar.message,null,respactualizar.serverError);
						return res.send(resphttp);
					}
					let tokennevo = {};
					tokennevo.access_token = respactualizar.data.access_token;
					tokennevo.scope = respactualizar.data.scope;
					tokennevo.token_type = respactualizar.data.token_type;
					tokennevo.expires_in = respactualizar.data.expires_in;
					tokennevo.fecha = Date.now;
					let newtoken = await _database.zunpc.repository.pagoenzonarepository.createToken(tokennevo);
					/* else {
						token = respactualizar.data.access_token;
						let datatoken = await _database.zunpc.repository.pagoenzonarepository.getToken();
						let objt = {};
						objt.identoken = datatoken.identoken;
						objt.access_token = respactualizar.data.access_token;
						objt.scope = respactualizar.data.scope;
						objt.expires_in = respactualizar.data.expires_in;
						objt.fecha = Date.now.toString();
						newtoken = await _database.zunpc.repository.pagoenzonarepository.update(objt);
					} */
					token = respactualizar.data.access_token;
					resp = await zona.payaments(body,token);
					if(resp.code != 200){
						_useful.log('pagoenzonacontroller.js').error(`Error al crear el pago.${resp.message}`,datauser.user,"");
						let resphttp = new httpresponse(respactualizar.code,respactualizar.message,null,respactualizar.serverError);
						return res.send(resphttp);
					}
				}else{
					_useful.log('pagoenzonacontroller.js').error(`Error al crear el pago.${resp.message}`,datauser.user,error);
					return res.send({code: resp.code,message: resp.message, data: null});
				}
			}

			//let newpayament = await this.guardarPago(resp.data);
			let nuevopago = {
				transaction_uuid: resp.data.transaction_uuid,
				currency: resp.data.currency,
				created_at: resp.data.created_at,
				update_at: resp.data.update_at,
				status_code: resp.data.status_code,
				status_denom: resp.data.status_denom,
				description: resp.data.description,
				invoice_number: resp.data.invoice_number,
				merchant_op_id: resp.data.merchant_op_id,
				terminal_id: resp.data.terminal_id,
				amount: JSON.stringify(resp.data.amount),
				items: JSON.stringify(resp.data.items),
				links: JSON.stringify(resp.data.links),
				commission: resp.data.commission
			};
			let okpago = await _database.zunpc.repository.pagoenzonarepository.createpayament(nuevopago);
			_useful.log('pagoenzonacontroller.js').info('Se creo el pago correctamente',datauser.user);
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

	async guardarPago(pago){
		
		let nuevopago = {
			transaction_uuid: pago.transaction_uuid,
			currency: pago.currency,
			created_at: pago.created_at,
			update_at: pago.update_at,
			status_code: pago.status_code,
			status_denom: pago.status_denom,
			description: pago.description,
			invoice_number: pago.invoice_number,
			merchant_op_id: pago.merchant_op_id,
			terminal_id: pago.terminal_id,
			amount: pago.amount,
			items: JSON.stringify(pago.items),
			links: JSON.stringify(pago.links),
			commission: pago.commission
		};
		let okpago = await _database.zunpc.repository.pagoenzonarepository.createpayament(nuevopago);
		return okpago;
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