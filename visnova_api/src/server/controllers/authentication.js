const https = require('https');
const needle = require('needle');
const request = require('request');
const { exec } = require('child_process');

const axios = require('axios');
const qs = require('qs');
var HTMLParser = require('node-html-parser');
const Auth = require('../../utils/logforauth');
const Logs = require('../../utils/newlogs');
const axiosRetry = require('axios-retry');
const httpresponse = require('../../utils/httpresponse');
const { response } = require('express');
const email = require('../../utils/mailer');




function loginUtility (user , pass, idface, ident, res, chtoken, checkin) {

	if (!user || !pass) {
		_useful.log('authentication.js').info('Parámetros incorrectos', 'system' );
		return res.sendStatus(400);
	}

	let nickname = user,
		password = _useful.encrypt(pass);

	_database.zunpc.repository.authentication.checkUserAndPass(nickname, password).then(response => {

		if (!response) {
			_useful.log('authentication.js').info('Usuario o contraseña incorrectos', nickname );
			return res.sendStatus(401);
		}

		let user = {};
		let permission = response.role.permissions.map(item => {
			return item.id;
		});


		user.id = response.id;
		user.name = response.name;
		user.nick = response.user;
		user.idface = idface.toString();
		user.ident = ident;
		user.cht = chtoken;
		user.check = checkin;
		user.permission = permission;

		_useful.generateToken({ user }).then(token => {

			_useful.log('authentication.js').info('Se genero un token',nickname,JSON.stringify(response));
			return res.send({token,user})

		}).catch(error => {

			_useful.log('authentication.js').error('Error al generar el token', nickname, error );
			return res.sendStatus(500);

		});

	}).catch(error => {

		_useful.log('authentication.js').error('Error autenticando el usuario', nickname, error );
		return res.sendStatus(500);

	})
}

function validadUsuario(user,pass,res){
	try {
		if (!user || !pass) {
			_useful.log('authentication.js').info('Parámetros incorrectos', 'system' );
			return new httpresponse(500,"Parámetros incorrectos", null,"");
		}
		let nickname = user;
		let password = pass;
		if(nickname.length  < 8 || nickname.length  > 16 ){
			_useful.log('authentication.js').info('El usuario debe contener entre 8 y 16 caracteres', 'system' );
			return new httpresponse(500,"El usuario debe contener entre 8 y 16 caracteres", null,"");
		}
	
		if(password.length  < 8 || password.length  > 16 ){
			_useful.log('authentication.js').info('La contraseña debe contener entre 8 y 16 caracteres', 'system' );
			return new httpresponse(500,"La contraseña debe contener entre 8 y 16 caracteres", null,"");
		}
		//var hresponse =  new httpresponse(200,"ok", null,"");
	return new httpresponse(200,"ok", null,"");
	} catch (error) {
		_useful.log('authentication.js').error(error.toString(), 'system' );
		return new httpresponse(500,"A ocurrido un error inesperado al validar usuario.", null,error.toString());
	}
}

function registerUser(user,res) {
	try {
		//validar que no exista el usuario.
	_database.zunpc.repository.authentication.checkUserAndEmail(user.user, user.correo).then(response =>{
		if(response != null){
			return new httpresponse(500,"Este (usuario o correo) ya están siendo utilizado.", null,"");
		}else{
			_database.zunpc.repository.authentication.adicionarUsuario(user).then(response1 =>{
				_useful.log('authentication.js').info('Se ha registrado un usuario nuevo',user.user,JSON.stringify(response1));
				//obtengo el usuariio recien insertado
				_database.zunpc.repository.authentication.getUser(user.user, user.correo).then(response2=>{
					if(response2 == null){
						return new httpresponse(500,"ha ocurrido un error inesperado: Usuario no encontrado.", null,"");
					}
					let nickname = response2.name;
					let _userinsert ={};
					_userinsert.id = response2.id;
					_userinsert.name = response2.name;
					_userinsert.user = response2.user;
					_userinsert.correo = response2.correo;
					_userinsert.pconfirmado = response2.pconfirmado;
					_userinsert.activate = response2.activate;
					//genero token de activacion para ese nuevo usuario
					_useful.generateTokenToUser(_userinsert).then(tokenactivacion => {
						
						var objecresult = {};
						objecresult.token = tokenactivacion;
						//guardo token en base d edatos
						var newtokenactiv = {};
						newtokenactiv.confirmado = false;
						newtokenactiv.token = tokenactivacion.toString();
						newtokenactiv.fecha = Date.now.toString();
						_database.zunpc.repository.authentication.saveTokenActivation(newtokenactiv).then(response3 => {
							_useful.log('authentication.js').info('Se ha registrado el token de activacion del usuario',_userinsert.user,JSON.stringify(response3));
						});

						let link = _config.Vinculos.linkconfirmacion+"/"+ tokenactivacion.toString();
						// send mail with defined transport object
						let data = {};
						data.correo = _userinsert.correo;
						data.link = link;
						let e = new email(data.correo,data.link);
						e.enviarEmail();
						  
						return res.json(new httpresponse(200,"Se ha creado la cuenta correctamente", objecresult,""));
					}).catch(error => {
						
						_useful.log('authentication.js').info('Error al generar el token de activacion', nickname, error );
						return res.sendStatus(500);

					});
				});
				
				
				return new httpresponse(200,"ok", null,"");
			});

			return new httpresponse(200,"ok", null,"");
		}
	});
	} catch (error) {
		_useful.log('authentication.js').error(error.toString(), 'system' );
		return new httpresponse(500,error.toString(), null,"");
	}
	
}

function changePassword(idUser,passold,passnew,confirpass,res) {
	try {
		let id = idUser;
		let _passold = _useful.encrypt(passold);
		let _passnew = _useful.encrypt(passnew);
		let _confirpass = _useful.encrypt(confirpass); 
		_database.zunpc.repository.authentication.checkUser(id, _passold).then(response =>{
			if (!response) {
				_useful.log('authentication.js').info('Las contraseñas no son correcta', 'System' );
				var hresp = new httpresponse(500,"Las contraseñas no son correcta", null,"");
				return res.json(hresp);
			}else{
				if(_passnew.toString() == _confirpass.toString()){
					let user = {};
					user.id = response.id;
					user.name = response.name;
					user.user = response.user;
					user.pass = _passnew.toString();
					user.correo = response.correo;
					user.pconfirmado = response.pconfirmado;
					user.activate = response.activate;

					_database.zunpc.repository.authentication.updateUser(user).then(response1 => {
						_useful.log('authentication.js').info('Se ha cambiado la contraseña correctamente',user.user,JSON.stringify(response1));
						var hresp = new httpresponse(200,"Se ha cambiado la contraseña correctamente", null,"");
						return res.json(hresp);
					});
				}else{
					_useful.log('authentication.js').error('Las contraseñas no son correcta', 'System' );
					var hresp = new httpresponse(200,"Las contraseñas no son correctas", null,"");
					return res.json(hresp);
				}
			}
		});
	} catch (error) {
		_useful.log('authentication.js').error(error.toString(), 'System' );
		var hresp = new httpresponse(500,error.toString(), null,"System");
		return res.json(hresp);
	}
	
}

async function recoverPassword(correo,res) {
	try {
		let _correo = correo;
	_database.zunpc.repository.authentication.checkEmail(_correo).then(response =>{
		if(!response){
			//_useful.log('authentication.js').info('Correo incorrecto', 'System' );
				var hresp = new httpresponse(500,"Correo incorrecto", null,"");
				return res.json(hresp);
		}else{
			let user = {};
			user.id = response.id;
			user.name = response.name;
			user.user = response.user;
			user.pass = response.pass;
			user.correo = response.correo;
			user.pconfirmado = response.pconfirmado;
			user.roleId = response.roleId;
			user.activate = response.activate;
			var hrepcodigo = generarCodigo(user,res);
			let codigo = hrepcodigo.data;
			if(hrepcodigo.code != 200){
				return res.json(hrepcodigo) 
			}
			//envio correo con el codigo para recuperar contraseña
			let link = _config.Vinculos.linkrecuperacion+"/"+ codigo;
						// send mail with defined transport object
						let data = {};
						data.correo = user.correo;
						data.link = link;
						let e = new email(data.correo,data.link);
						e.enviarEmailCodigo(codigo);
			//var hresp = new httpresponse(200,"Se ha realizado el proceso satisfactoriament", codigo,"");
			return res.json(hrepcodigo);

		}
	});
	} catch (error) {
		_useful.log('authentication.js').error(error.toString(), 'System' );
		var hresp = new httpresponse(500,error.toString(), null,"System");
		return res.json(hresp);
	}
	
}
function generarCodigo(user,res) {
	var min = 1000;	
	var max = 9999;
	let semilla = Math.floor(Math.random()*(max-min+1)+min).toString();
	let idrol = user.roleId;
	let activo = (user.active)? 1: 2;
	let id = user.id;
	var codigo = id.toString() + idrol.toString() + activo.toString() + semilla ;
	let cc = {};
	cc.id_usuario = user.id;
	cc.codigo = codigo;
	cc.fecha = Date.now();
	//luego inserto el codigo con el id d el usaurio en el modelo CodigoCuenta
	_database.zunpc.repository.authentication.addCodigoCuenta(cc).then(response => {
		_useful.log('authentication.js').info('Se ha adicionado un nuevo codigo de cuenta para el usuario ',user.user,JSON.stringify(cc));
	});
	return new httpresponse(200,"ok", codigo,"");
}

function activeCuenta(token,res) {
	let _token = token;
	
	_express.verifyTokenUser(token,res).then(response => {
		 if (response.code === 500){
			_useful.log('authentication.js').info(response.message);
			var hrep = new httpresponse(response.code,response.message,null,"");
			return res.json(response) ;
		} else {
			//busco en base de datos si existe ese token
			let user = {};
			user.id = response.data.id;
			user.name = response.data.name;
			user.user = response.data.user;
			user.pass = response.data.pass;
			user.correo = response.data.correo;
			user.pconfirmado = response.data.pconfirmado;
			user.roleId = response.data.roleId;
			user.activate = response.data.activate; 
			
			_database.zunpc.repository.authentication.existeToken(token).then(response => {
				if(!response){
					return res.json({code:500,message: 'Token de verificación no encontrado.', data: null});
				}else{
					//verifico si el token ya fue conformado
					 if(response.confirmado == true){
						 //envio un error y elimino el token alacenado
						_database.zunpc.repository.authentication.eliminarTokenUsuario(response.id_token).then(rep3 => {
							_useful.log('authentication.js').info('Se ha eliminado el token del usuario',user.user,JSON.stringify(rep3));
						});
						var hresp = new httpresponse(500,"Ya usted  activó su cuenta..", null,"");
						return res.json(hresp);
					}
					//actualizo el estado del token 
					let tokenverificado ={};
					tokenverificado.id_token = response.id_token;
					tokenverificado.confirmado = true;
					tokenverificado.token = response.token;
					tokenverificado.fecha = Date.now();
					_database.zunpc.repository.authentication.actualizarEstadoToken(tokenverificado).then(resp1 => {
						_useful.log('authentication.js').info('Se ha actualizado el estado del token',user.user,JSON.stringify(resp1));
					});
					user.activate = true;
					_database.zunpc.repository.authentication.updateUser(user).then(rep2 =>{
						_useful.log('authentication.js').info('Se ha actualizado el usuario',user.user,JSON.stringify(rep2));
					});	 
				}

				var hrep = new httpresponse(200,"Su cuenta ha sido activada satisfactoriamente",null,"");
				return res.json(hrep) ;
			}); 
			  
			
		}  
	}).catch(error => {
		_useful.log('authentication.js').info('Error token expirado', error );
		var hrep = new httpresponse(500,error,null,"");
		return res.json(hrep) ;
	});
}

/* function validarToken(token,res)  {
	_express.verifyTokenUser(token,res).then(data => {
		
		
		 if (data.code === 500){
			_useful.log('authentication.js').info(data.message);
			var hrep = new httpresponse(data.code,data.message,null,"");
			return res.json(hrep) ;
		} else {
			//_useful.log('authentication.js').info('Token correcto');
			var hrep = new httpresponse(data.code,'Token correcto',data.data,"");
			
			return res.json(hrep) ;
		} 
	}).catch(error => {
		_useful.log('authentication.js').error('Error token expirado', error );
		var hrep = new httpresponse(500,error,null,"");
		return res.json(hrep) ;
	});
} */

function loginUtil (user , pass, res) {
	
	if (!user || !pass) {
		_useful.log('authentication.js').info('Parámetros incorrectos', 'system' );
		return res.send({
			"code" : 400,
			"message" : "Parámetros incorrectos",
			"data" : null,
			"serverError" : '',
		}); 
	}

	let nickname = user,
		password = _useful.encrypt(pass);

	_database.zunpc.repository.authentication.checkUserAndPass(nickname, password).then(response => {

		if (!response) {
			_useful.log('authentication.js').info('Usuario o contraseña incorrectos', nickname );
			//return res.sendStatus(401);
			return res.send( {
				"code" : 401,
				"message" : "Usuario o contraseña incorrectos",
				"data" : null,
				"serverError" : '',

			}); 
		}

		let user = {};
		let permission = response.role.permissions.map(item => {
			return item.id;
		});
		 
		 if(response.activate == false){
		 	_useful.log('authentication.js').info('El usuario no se encuentra activo', nickname );
		 	//return res.sendStatus(401);
			 return res.send( {
				"code" : 401,
				"message" : "El usuario no se encuentra activo",
				"data" : null,
				"serverError" : "",

			}); 
		 }

		user.id = response.id;
		user.name = response.name;
		user.user = response.user;
		user.pass = password;
		user.correo = response.correo;
		user.pconfirmado = response.pconfirmado;
		user.activate = response.activate;
		user.permission = permission;

		_useful.generateToken({ user }).then(token => {
			_useful.generateTokenRefresh({user}).then(tokenrefresh => {
				_useful.log('authentication.js').info('Se genero el token de seguridad y el token refresh',nickname,JSON.stringify(response));
				return res.send({token, tokenrefresh,user})
			}).catch(error => {

				_useful.log('authentication.js').error('Error al generar el token refresh', nickname, error );
				return res.send( {
					"code" : 500,
					"message" : "Error al generar el token",
					"data" : null,
					"serverError" : "",
	
				}); 
	
			});
		}).catch(error => {

			_useful.log('authentication.js').error('Error al generar el token', nickname, error );
			return res.send( {
				"code" : 500,
				"message" : "Error al generar el token",
				"data" : null,
				"serverError" : "",

			}); 

		});

	}).catch(error => {

		_useful.log('authentication.js').error('Error autenticando el usuario', nickname, error );
		return res.send( {
			"code" : 500,
			"message" : "Error autenticando el usuario",
			"data" : null,
			"serverError" : "",

		}); 

	})
}

///norbee-----------------------------------------------------------------------------------
function lokingforEntity (ssid, ip, user, pass,idface, res, chtoken, checking) {
	if (ssid) {
		// _database.zunpc.repository.entity.list().then(response => {
		_database.zunpc.repository.entity.checkSsidAndIp(ssid, ip).then(response => {
			if (!response) {
				_useful.log('authentication.js').info('Ssid o Ip incorrectos', nickname );
				return res.sendStatus(401);
			}

			let users = response.users;
			let bool = false;
			users.forEach(function (item) {
				if (item.user === user){
					bool = true;
				}
			})
			if (bool === false){
				_useful.log('authentication.js').info('Ssid o Ip incorrectos', nickname );
				return res.sendStatus(401);
			}

			let ident = response.id.toString();
			_useful.log('authentication.js').info('Se accedio a la informacion de la entidad');
			loginUtility(user , pass, idface, ident, res, chtoken, checking);
		}).catch(error => {
			_useful.log('authentication.js').error('Error accediendo a la informacion de la entidad', error );
			return res.sendStatus(500);
		})
	}
	else {
		_useful.log('authentication.js').info('No fue posible acceder a la informacion de la entidad');
		return res.sendStatus(401);
	}
}

function userBackend (user, pass, ent, res) {
	let chtoken = '';
	let checkin = '';
	if (!ent) {
		_database.zunpc.repository.user.getallbyUser(user).then(response => {
			if (response === null) {
				_useful.log('authentication.js').info('Usuario o contraseña incorrectos');
				return res.sendStatus(401);
			}
			let ent = response.entities;
			if (ent.length === 1){
				let idface = '';
				let ident = ent[0].id;
				loginUtility(user , pass, idface, ident, res, chtoken, checkin);
			} else {
				_useful.log('authentication.js').info('Se accedio a la informacion del usuario',user);
				return res.send(ent);
			}
		}).catch(error => {
			_useful.log('authentication.js').error('Error accediendo a la informacion de la entidad', error );
			return res.sendStatus(500);
		})
	}
	else {
		let idface = '';
		let ident = ent;
		loginUtility(user , pass, idface, ident, res, checkin);
	}
}

function GetNautaInfo(user, pass, ssid, res) {
	_useful.log('authentication.js').info('Llego a get nauta con '+ user +' - '+ pass +' - '+ ssid +' ', 'system');
	console.log(ssid);
	var [param1, param2] = ssid.split("_");
	let ssid2 = '';
	console.log(param1);
	console.log(param2);
	if (param1 !== undefined && param2 !== undefined){
		ssid2 = param1+" "+param2;
	} else {
		ssid2 = ssid;
	}
	console.log("Buscar entidad by: " + ssid2);
	_database.zunpc.repository.entity.getBySsid(ssid2).then(data => {
		let entity = data;
		let parameters = [];
		let habForStart ="";
		parameters.push(entity.ssid);
		parameters.push(habForStart);
		parameters.push(user);
		parameters.push(pass);
		if (entity !== null) {
			console.log(entity.zunnauta);
			if (entity.zunnauta){
				console.log("C fue por el hotel");
				// peticion a Nauta En el Hotel
				let params ={
					Entity: entity.token,
					Database: entity.zunnauta,
					//CommandText:"SELECT f.id_face FROM HOTEHABI h INNER JOIN HOTEFACE f on h.id_habi = f.id_habi WHERE h.habitacion like "+ room +"",
					CommandText:"Select * From cuenta Where email = '"+ user +"' And estado = 'activada'",
					//CommandText:"Select * From cuenta Where email = '"+ user +"'",
					Parameters:[{
						ParameterName:"",
						Value:""
					}]
				}

				axios.post(`${_config.MK.url}`, params).then(({ data }) => {
					console.log(data);
					let resp;
					if (data['Records'] !== null && data['Records'] !== '') {
						resp = data.Records['Table'];
					} else {
						resp = [];
					}
					let habnew = ""; // simulando respuesta de NAUTA ASIEL
					if (resp.length > 0) {
						if (resp[0].habitacion){
							habnew = resp[0].habitacion;
							habnew = habnew.trim();
						}
					}

					console.log(resp);

					let parametersViaHotel = [];
					parametersViaHotel.push(entity.ssid);
					parametersViaHotel.push(habnew);
					parametersViaHotel.push(user);
					parametersViaHotel.push(pass);

					parameters = parametersViaHotel;

					console.log(parametersViaHotel);

					if (habnew !== ""){
						let paramsForRoom ={
							Entity: entity.token,
							Database: entity.zunpms,
							CommandText:"SELECT f.id_face FROM HOTEHABI h INNER JOIN HOTEFACE f on h.id_habi = f.id_habi WHERE h.habitacion like "+ habnew +"",
							Parameters:[{
								ParameterName:"",
								Value:""
							}]
						}

						axios.post(`${_config.MK.url}`, paramsForRoom).then(({ data }) => {
							if (data['Records'] !== null && data['Records'] !== '') {
								if (data.Records['Table'] !== null && data.Records['Table'] !== '') {
									let resp = data.Records['Table'];
									let num = resp[0];
									let idface = num['id_face'];

									//Logs de auth
									let params1 ={
										Entity: entity.token,
										Database: entity.zunpms,
										CommandText:"SELECT nombre,dni_cif as dni,HOTEFACE.fecha_ent,HOTEFACE.fecha_sal,adulto,HOTEHABI.habitacion from HOTEHABI inner join HOTEFACE on(HOTEHABI.id_habi=HOTEFACE.id_habi) inner join HOTEFACN on(HOTEFACE.id_face=HOTEFACN.id_face)where HOTEFACE.id_face = "+ idface +"",
										Parameters:[{
											ParameterName:"",
											Value:""
										}]
									}

									axios.post(`${_config.MK.url}`, params1).then(({ data }) => {
										console.log(data);
										let resp;
										if (data['Records'] !== null && data['Records'] !== '') {
											if (data.Records['Table'] !== null && data.Records['Table'] !== ''){
												resp = data.Records['Table'];
											} else {
												resp = [];
											}
										} else {
											resp = [];
										}
										let date = new Date().toISOString();
										let _auth = new Auth();
										_auth.logauth(user, 'Datos: ' + JSON.stringify(resp), date);
										_auth.toFtp(user, date);
										return res.send(parameters)
									}).catch(error => {
										console.log(error);
										let _logs = new Logs;
										_logs.logs(user, 'Error autenticando el usuario'+ JSON.stringify(error), 'error');
										return res.send(parameters)
									});
								} else {
									let resp = [];
									let date = new Date().toISOString();
									let _auth = new Auth();
									_auth.logauth(user, 'Datos: ' + JSON.stringify(resp), date);
									_auth.toFtp(user, date);
									return res.send(parameters)
								}

							} else {
								let resp = [];
								let date = new Date().toISOString();
								let _auth = new Auth();
								_auth.logauth(user, 'Datos: ' + JSON.stringify(resp), date);
								_auth.toFtp(user, date);
								return res.send(parameters)
							}
						}).catch(error => {
							console.log(error);
							let _logs = new Logs;
							_logs.logs(user, 'Error autenticando el usuario'+ JSON.stringify(error), 'error');
							return res.send(parameters)
						});

					} else {
						_useful.log('authentication.js').info('Se autentico el user', user);
						return res.send(parameters)
					}

				}).catch(error => {
					console.log(error);
					let _logs = new Logs;
					_logs.logs(user, 'Error autenticando el usuario'+ JSON.stringify(error), 'error');
					return res.send(parameters)
				});
			} else {
				console.log("envio peticion nauta Asiel");
				// peticion a Nauta Corporativo
				const agent = new https.Agent({
					rejectUnauthorized: false
				});
				axios.get(`${_config.Nauta.url}${user}`, { httpsAgent: agent }).then(({ data }) => {
					let resp = data;
					console.log("LLega respo Nauta");
					console.log(resp);
					let hab = ""; // simulando respuesta de NAUTA ASIEL
					let MK = ""; // simulando respuesta de NAUTA ASIEL
					if (resp.code !== 500) {
						if (resp.data !== null){
							console.log("Entro a comparar");
							hab = resp.data.habitacion;
							if(hab !== null) {
								hab = hab.trim();
							} else {
								hab = "";
							}
							MK = resp.data.tokenMK;
							console.log(hab);
							console.log(MK);
						}

						if (MK !== entity.token) { //Matchear contra el token del mk q me envia asiel
							hab = "";
							console.log("No coinciden los tokens log invitado");
						}
					}

					let parametersViaHotel = [];
					parametersViaHotel.push(entity.ssid);
					parametersViaHotel.push(hab);
					parametersViaHotel.push(user);
					parametersViaHotel.push(pass);

					parameters = parametersViaHotel;
					console.log("Respuesta via nauta corporativo");
					console.log(parameters);

					console.log(hab);

					if (hab !== ""){
						let paramsForRoom ={
							Entity: entity.token,
							Database: entity.zunpms,
							CommandText:"SELECT f.id_face FROM HOTEHABI h INNER JOIN HOTEFACE f on h.id_habi = f.id_habi WHERE h.habitacion like "+ hab +"",
							Parameters:[{
								ParameterName:"",
								Value:""
							}]
						}

						axios.post(`${_config.MK.url}`, paramsForRoom).then(({ data }) => {
							console.log(data);
							if (data['Records'] !== null  && data['Records'] !== '') {
								if (data.Records['Table'] !== null && data.Records['Table'] !== ''){
									let resp = data.Records['Table'];
									let num = resp[0];
									let idface = num['id_face'];

									//Logs de auth
									let params1 ={
										Entity: entity.token,
										Database: entity.zunpms,
										CommandText:"SELECT nombre,dni_cif as dni,HOTEFACE.fecha_ent,HOTEFACE.fecha_sal,adulto,HOTEHABI.habitacion from HOTEHABI inner join HOTEFACE on(HOTEHABI.id_habi=HOTEFACE.id_habi) inner join HOTEFACN on(HOTEFACE.id_face=HOTEFACN.id_face)where HOTEFACE.id_face = "+ idface +"",
										Parameters:[{
											ParameterName:"",
											Value:""
										}]
									}

									axios.post(`${_config.MK.url}`, params1).then(({ data }) => {
										console.log(data);
										let resp;
										if (data.Records !== null && data['Records'] !== '') {
											if (data.Records['Table'] !== null && data.Records['Table'] !== '') {
												resp = data.Records['Table'];
											} else {
												resp = [];
											}
										} else {
											resp = [];
										}
										console.log("!!!!!!!!!!!!!!!!!!!!!voy a crear un puto log")
										let _auth = new Auth();
										let date = new Date().toISOString();
										_auth.logauth(user, 'Datos: ' + JSON.stringify(resp), date);
										_auth.toFtp(user, date);
										return res.send(parameters)
									}).catch(error => {
										console.log(error);
										let _logs = new Logs;
										_logs.logs(user, 'Error Con MK'+ JSON.stringify(error), 'error');
										return res.send(parameters)
									});
								} else {
									let resp = [];
									let date = new Date();
									let _auth = new Auth();
									_auth.logauth(user, 'Datos: ' + JSON.stringify(resp), date);
									_auth.toFtp(user, date);
									return res.send(parameters)
								}
							} else {
								let resp = [];
								let date = new Date().toISOString();
								let _auth = new Auth();
								_auth.logauth(user, 'Datos: ' + JSON.stringify(resp), date);
								_auth.toFtp(user, date);
								return res.send(parameters)
							}

						}).catch(error => {
							console.log(error);
							let _logs = new Logs;
							_logs.logs(user, 'Error Con MK'+ JSON.stringify(error), 'error');
							return res.send(parameters)
						});

					} else {
						let date = new Date().toISOString();
						let _auth = new Auth();
						_auth.logauth(user, 'Datos: ' + JSON.stringify(resp), date);
						_auth.toFtp(user, date);
						return res.send(parameters)
					}

				}).catch(error => {
					console.log(error);
					let _logs = new Logs;
					_logs.logs(user, 'Error autenticando el usuario'+ JSON.stringify(error), 'error');
					return res.send(parameters);
				});
			}
		} else {
			let _logs = new Logs;
			_logs.logs(user, 'Error No fue posible autenticar ssid incorrecto', 'error');
			return res.sendStatus(403);
		}

	}).catch(error => {
		let _logs = new Logs;
		_logs.logs(user, 'Error No se pudo cargar datos de la entidad'+ JSON.stringify(error), 'error');
		return res.sendStatus(500);
	});
}


exports.Authentication = {

	login (req, res) {

		if (req.body.entId !== undefined){

			_database.zunpc.repository.entity.getById(req.body.entId).then(data => {
				let entity = data;
				let idface = "";
				loginUtility(req.body.user, req.body.pass, idface, req.body.entId, res, entity.chattoken, entity.checking);
			}).catch(error => {
				_useful.log('entity.js').error('No se pudo cargar datos de la entidad',req.user.nick,error);
				return res.sendStatus(500);
			});
		} else if(req.body.ent === null) {
			userBackend(req.body.user , req.body.pass, req.body.ent, res);
		} else{
			let idface = "";
			let chattoken = "";
			let checking = "";
			loginUtility(req.body.user, req.body.pass, idface, req.body.ent, res, chattoken, checking);
		}
	},

	loginUser(req, res){
		let {token} = req.params;
		loginUtil(req.body.user, req.body.password,res);
	},

	registrarUser(req,res){
		//const {code,message,data,serverError} =  validadUsuario(req.body.user,req.body.pass,res);
		const hrep = validadUsuario(req.body.user,req.body.pass,res);
		if(hrep['code'] == 200){
			let user = {};
			let password = _useful.encrypt(req.body.pass);
			user.name = req.body.name;
			user.user = req.body.user;
			user.pass = password;
			user.correo = req.body.correo;
			user.pconfirmado = req.body.pconfirmado;
			user.roleId = 2;
			user.active = false;
			registerUser(user,res);
			//return res.send(hrep1);
		}else{
			return res.json(hrep); 
		}
	},

	cambiarContrasenna(req,res){
		 changePassword(req.body.idUser,req.body.passold,req.body.passnew,req.body.confirpass,res);
		//return res.send(hrep);
	},

	recuperarContrasenna(req,res){
		recoverPassword(req.body.correo,res);
	},

	activarCuenta(req,res){
		//const { token } = req.body;
		let { token } = req.params;
		activeCuenta(token,res);
	},

	validarCodigoPass(req,res){
		const { codigo,password,passconfirm } = req.body;
		_database.zunpc.repository.authentication.verifyCodigoCuenta(codigo).then(data => {
			if(!data){
				var hrep = new httpresponse(500,"El codigo es incorrecto",null,"");
				return res.json(hrep);
			}else{
				let iduser = data.id_usuario;
				_database.zunpc.repository.authentication.getUserById(iduser).then(response1 =>{
					if(!response1){
						var hrep = new httpresponse(500,"No existe el usuario",null,"");
						return res.json(hrep);
					}else{
						let user = {};
						user.id = response1.id;
						user.name = response1.name;
						user.user = response1.user;
						user.pass = response1.pass;
						user.correo = response1.correo;
						user.pconfirmado = response1.pconfirmado;
						user.activate = response1.activate; 

						if(password == passconfirm){
							user.pass =_useful.encrypt(password);
							_database.zunpc.repository.authentication.updateUser(user).then(resp => {
								_useful.log('authentication.js').info('Se actualizó el password del usuario',user.name,JSON.stringify(resp));
							});
							_database.zunpc.repository.authentication.eliminarCodigoCuenta(data.id_codigo).then(rep1=>{
								let obj = { codigo: codigo, usuario: user}
								_useful.log('authentication.js').info('Se eliminó el codigo del usuario.',user.name,JSON.stringify(obj));
							});
							return res.json(new httpresponse(200,"Se ha modificado correctamente la contraseña",null,""));
						}else{
							return res.json(new httpresponse(500,"Las contraseñas no son correctas",null,""));
						}
					}
				});
			}
		});
	},


	async loginGuest (req, res) {
		const { room , entId} = req.body;
		let entity = "";
		await _database.zunpc.repository.entity.getById(entId).then(data => {
			entity = data;

			if (!room) {
				_useful.log('authentication.js').info('Parámetros incorrectos', 'system' );
				return res.sendStatus(400);
			}

			let params ={
				Entity: entity.token,
				Database: entity.zunpms,
				CommandText:"SELECT f.id_face FROM HOTEHABI h INNER JOIN HOTEFACE f on h.id_habi = f.id_habi WHERE h.habitacion like "+ room +"",
				Parameters:[{
					ParameterName:"",
					Value:""
				}]
			}
			console.log("Peticion a MK");
			axios.post(`${_config.MK.url}`, params).then(({ data }) => {
				console.log("respuesta MK");
				console.log(data);
				let resp;
				let idface = '';
				if (data['Records'] !== null && data['Records'] !== '' && data.Records['Table'].length > 0) {
					resp = data.Records['Table'];
					let num = resp[0];
					idface = num['id_face'];
				}
				if (idface !== ''){
					_useful.log('authentication.js').info('Se obtiene un huesped',JSON.stringify(data));
					loginUtility("guest", "12345", idface, entId, res, entity.chattoken, entity.checking);
				}
				else{
					_useful.log('authentication.js').info('Error habitacion o pin incorrecto');
					return res.sendStatus(500);
				}
			}).catch(error => {
				console.log(error);
				let _logs = new Logs;
				_logs.logs(user, 'Error en login guest por MK'+ JSON.stringify(e.message), 'error');
				return res.sendStatus(500);
			});
		}).catch(error => {
			_useful.log('entity.js').error('No se pudo cargar datos de la entidad',req.user.nick,error);
			let _logs = new Logs;
			_logs.logs(user, 'Error No se pudo cargar datos de la entidad'+ JSON.stringify(error.message), 'error');
			return res.sendStatus(500);
		});

	},

	authUser (req, res) {
		_useful.log('authentication.js').info('Llego al  metodo de autenticacion contra etecsa', 'system');
		const { user } = req.body; // Para etecsa
		const { pass } = req.body; // Para etecsa
		const { ip } = req.body; // Para etecsa
		const { mac } = req.body; // Para Logs
		const { entId } = req.body; // Para Logs
		_useful.log('authentication.js').info('Accede usuario: '+ user +' - MAC: '+ mac +' - Direccion IP: '+ ip +' ', 'system');
		const { ssid } = req.body;

			// Bloque de cod para fingir respuesta de etecsa
		// console.log("Y el Ssid: " + ssid);
		// let ssid1 = '';
		// var [param1, param2] = ssid.split("_");
		// if (param1 !== undefined && param2 !== undefined){
		// 	ssid1 = param1+" "+param2;
		// }
		// var [param3, param4] = ssid.split("%5F");
		// if (param3 !== undefined && param4 !== undefined){
		// 	ssid1 = param3+" "+param4;
		// }
		//
		// _useful.log('authentication.js').info('pa get nauta con '+ user +' - '+ mac +' - '+ ssid1 +' ', 'system');
		// //Metodo para obtener ZunNautaInfo
		// GetNautaInfo(user, pass, ssid1, res);

		let data = qs.stringify({
			'wlanuserip': ip,
			'username': user,
			'password': pass
		});

		axios.post(`${_config.AAAEtecsa.url}`, data, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			maxRedirects: 0
		}).then(({ data }) => {
			console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!respuesta de etecsa")
			console.log(data);
			let root = HTMLParser.parse(data);
			let arr = [];
			arr =  root.querySelectorAll('script')
			let str = arr[arr.length-1].childNodes[0].rawText;
			var [p1, p2] = str.split("(");
			var [p3, p4] = p2.split(")");
			var [p5, p6] = p3.split('"');
			console.log(p6);
			const dateForLog = new Date();
			console.log(dateForLog);
			const logs = {
				name: "AAA Etecsa",
				user: user,
				action: "Login Insatisfactorio en AAA de etecsa con mac:"+ mac,
				date: dateForLog,
				response: p6,
				entityId: entId
			}

			_database.zunpc.repository.logs.create(logs).then(data => {
				let response = data;
				_useful.log('authentication.js').info('Error al loguear al usuario '+ user + ' en NAUTA ETECSA', 'system');
				console.log("toFTP");
				return res.send({
					status: 403,
					data: p6
				});
			}).catch(error => {
				_useful.log('entity.js').error('No se pudo crear el log de auth',req.user.nick,error);
				let _logs = new Logs;
				_logs.logs(user, 'Error No se pudo crear el log de auth'+ JSON.stringify(error.message), 'error');
				return res.sendStatus(500);
			});
		}).catch((e) => {
			if (e.response.status === 302) {
				let location = e.response.headers.location
				let cookie = e.response.headers['set-cookie'][0]
				console.log(location);
				console.log(cookie);
				let JSESSION = cookie.split(";")[0];
				console.log(JSESSION);

				// TO-DO Bloque de cod para setear cookie y obtener Id para tiempo y desconexion
				// axios.get(`${location}`,{
				// 	headers: {
				// 		'Cookie': `${JSESSION}`
				// 	},
				// 	maxRedirects: 0
				// }).then(({ data1 }) => {
				// 	console.log("!!!!!respuesta de location");
				// 	console.log(data1);
				// }).catch(error1 => {
				// 	console.log("error de location");
				// 	console.log(error1);
				// 	// _useful.log('entity.js').error('No se pudo crear el log de auth',req.user.nick,error);
				// 	// let _logs = new Logs;
				// 	// _logs.logs(user, 'Error No se pudo crear el log de auth'+ JSON.stringify(error.message), 'error');
				// 	// return res.sendStatus(500);
				// });

				_useful.log('authentication.js').info('Se logueo al usuario '+ user + ' en NAUTA ETECSA' + ' con MAC: '+ mac, 'system');
				let ssid1 = '';
				var [param1, param2] = ssid.split("_");
				if (param1 !== undefined && param2 !== undefined){
					ssid1 = param1+" "+param2;
				}
				var [param3, param4] = ssid.split("%5F");
				if (param3 !== undefined && param4 !== undefined){
					ssid1 = param3+" "+param4;
				}

				const dateForLog = new Date();
				console.log(dateForLog);

				const logs = {
					name: "AAA Etecsa",
					user: user,
					action: "Login satisfactorio en AAA de etecsa con mac:"+ mac,
					date: dateForLog,
					response: "Usted esta Conectado",
					entityId: entId
				}

				_database.zunpc.repository.logs.create(logs).then(data => {
					let response = data;
					//Metodo para obtener ZunNautaInfo
					GetNautaInfo(user, pass, ssid1, res);
				}).catch(error => {
					_useful.log('entity.js').error('No se pudo crear el log de auth',req.user.nick,error);
					let _logs = new Logs;
					_logs.logs(user, 'Error No se pudo crear el log de auth'+ JSON.stringify(error.message), 'error');
					return res.sendStatus(500);
				});
			} else {
				console.log("error")
				console.log(e);
				const dateForLog = new Date();
				console.log(dateForLog);
				const logs = {
					name: "AAA Etecsa",
					user: user,
					action: "Login Insatisfactorio en AAA de etecsa con mac:"+ mac,
					date: dateForLog,
					response: e.message,
					entityId: entId
				}
				_database.zunpc.repository.logs.create(logs).then(data => {
					let response = data;
					_useful.log('authentication.js').info('Error de conexion a NAUTA ETECSA con logs', 'system');
					let _logs = new Logs;
					_logs.logs(user, 'Error de conexion a NAUTA ETECSA con logs'+ JSON.stringify(e.message), 'error');
					return res.send({
						status: 403,
						data: e.message
					});
				}).catch(error => {
					_useful.log('entity.js').error('No se pudo crear el log de auth',req.user.nick,error);
					let _logs = new Logs;
					_logs.logs(user, 'Error No se pudo crear el log de auth'+ JSON.stringify(error.message), 'error');
					_useful.log('authentication.js').info('Error de conexion a NAUTA ETECSA sin logs', 'system');
					_logs.logs(user, 'Error de conexion a NAUTA ETECSA sin logs'+ JSON.stringify(e.message), 'error');
					return res.send({
						status: 403,
						data: e.message
					});
				});
			}
		});
	},

	userInfo (req, res) {
		if (req.user) {
			_useful.log('authentication.js').info('Se accedio a la informacion del usuario',req.user.nick,req.user);
			return res.send(user)
		}
		else {
			_useful.log('authentication.js').info('No fue posible aceder a la informacion de usuario');
			return res.sendStatus(401);
		}
	},


	async enableAuthorizationFor (req, res) {

		_useful.log('authentication.js').info('Llego al  metodo de autorizacion ', 'system');
		let precheckin = '';
		if (req.query.precheckin){
			precheckin = req.query.precheckin;
		}
		const { ssid } = req.query;
		let ssid1 = ssid.split("/")[0];
		if (precheckin){
			_useful.log('authentication.js').info('Parámetro de pre auth');
			_database.zunpc.repository.entity.getBySsid(ssid1).then(response => {
				if (!response) {
					_useful.log('authentication.js').info('SSID incorrecto', "system" );
					return res.sendStatus(401);
				}

				let ident = response.id.toString();
				_useful.log('authentication.js').info('Se accedio a la informacion de la entidad');
				return res.send(ident);
			}).catch(error => {
				_useful.log('entity.js').error('No se pudo cargar datos de la entidad',req.user.nick,error);
				return res.sendStatus(500);
			});

		} else {
			if (!ssid) {
				_useful.log('authentication.js').info('No fue posible autenticar contra el Access Control faltan parametros');
				return res.sendStatus(404);
			}

			_useful.log('authentication.js').info('Parámetro 1 de url '+ssid+':', 'system');

			// let ip = devip.split("/")[0];
			var [param1, param2] = ssid1.split("_");
			let ssid2 = '';
			if (param1 !== undefined && param2 !== undefined){
				ssid2 = param1+" "+param2;
			} else {
				ssid2 = ssid1;
			}


			_useful.log('authentication.js').info('Parámetros de url '+ssid1+' :', 'system');
			// _useful.log('authentication.js').info('Parámetros de url '+ip+' :', 'system');

			try {
				_database.zunpc.repository.entity.getBySsid(ssid2).then(response => {
					if (!response) {
						_useful.log('authentication.js').info('Ssid incorrectos', "system" );
						return res.sendStatus(401);
					}

					let ident = response.id.toString();
					_useful.log('authentication.js').info('Se accedio a la informacion de la entidad');
					// const { data } = await Axios.post(`${_config.AC.url}?username=${mac}&password=${mac}`);
					_useful.log('authentication.js').info(`Se autentico el ${ssid} en el access control`);
					// return res.send(data);
					return res.send(ident);
				}).catch(error => {
					_useful.log('entity.js').error('No se pudo cargar datos de la entidad',req.user.nick,error);
					let _logs = new Logs;
					_logs.logs(user, 'Error No se pudo cargar datos de la entidad'+ JSON.stringify(error.message), 'error');
					return res.sendStatus(500);
				});
			}
			catch (err) {
				_useful.log('authentication.js').info('No fue posible autenticar contra el Access Control');
				let _logs = new Logs;
				_logs.logs(user, 'Error No fue posible autenticar contra el Access Control'+ JSON.stringify(err.message), 'error');
				return res.sendStatus(500);
			}
		}
	},

	verifToken (req, res){
		const { token } = req.body;

		_express.verifyhuespedToken(token).then(data => {
			if (data === 500){
				_useful.log('authentication.js').info('Error token expirado');
				return res.send('Error token expirado');
			} else {
				_useful.log('authentication.js').info(`Token correcto`);
				return res.sendStatus(200);
			}
		}).catch(error => {
			_useful.log('authentication.js').error('Error token expirado', error );
			let _auth = new Auth();
			_auth.logauth(user, 'Error token expirado'+ JSON.stringify(error.message), 'error');
			return res.sendStatus(500);
		});
	}

};
