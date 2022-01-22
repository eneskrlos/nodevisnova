const { editDireccionofUser } = require("../repository/user");

exports.User = {

	listAll (req, res) {
		const ident = req.user.user;
		let { body } = req;
		let { buscar } = body;
		if (req.user.user === 'admin') {
			_database.zunpc.repository.user.list(buscar).then(response => {
				_useful.log('user.js').info('Listó los usuarios',req.user.user, JSON.stringify(response));
				return res.send({
					code:200,
					message:'Se ha listado los usuarios',
					data: response,
					servererror: '',
				});
			}).catch(error => {
				_useful.log('user.js').error('No se pudo listar los usuarios','req.user.user',error);
				return res.send({
					code:500,
					message:'No se pudo lisar los usuarios:.' + error,
					data: null,
					servererror: '',
				});
			})
		}else{
			_useful.log('user.js').error('No se pudo listar los usuarios','req.user.user','Usted no tiene acceso');
			return res.send({
				code:500,
				message:'No se pudo lisar los usuarios: Usted no tiene acceso.',
				data: null,
				servererror: '',
			});
		} 
	},

	list (req, res) {
		try {
			_database.zunpc.repository.user.getById(req.params.id).then(response => {
				_useful.log('user.js').info('Listó un usuario',req.user.user,JSON.stringify(response));
				return res.send({
					code:200,
					message:'Se ha obtenido el usuario correctamente',
					data: response,
					servererror: '',
				});
			}).catch(error => {
				_useful.log('user.js').error('No se pudo obtener el usuario',req.user.user,error);
				return res.send({
					code:500,
					message:'No se pudo obtener el usuario',
					data: null,
					servererror: '',
				});
			});
		} catch (error) {
			_useful.log('user.js').error('No se pudo obtener el usuario','req.user.user',error);
			return res.send({
				code:500,
				message:'No se pudo obtener el usuario',
				data: null,
				servererror: '',
			});
		}
		
	},

	async desactivarUsuario(req,res){
		const ident = req.user.user;
		let id = req.params.id;
		if(id == undefined || !id || id.toString() == "")
			return res.send({
				code:500,
				message:'Compruebe que esta enviando los datos correctos.',
				data: null,
				servererror: '',
			});
		
		try {
			let user = await _database.zunpc.repository.user.getById(id);
			if(!user){
				return res.send({
					code:500,
					message:'Usuario no encontrado',
					data: null,
					servererror: '',
				});
			}
			let desactivado = await _database.zunpc.repository.user.desactivarUser(user);
			_useful.log('user.js').info('Se ha desactivado el usuario: ' + user.name ,req.user.user,JSON.stringify(desactivado));
			var listuser = await _database.zunpc.repository.user.list("");
			return res.send({
				code:200,
				message:'Se ha desactivado el usuario correctamente',
				data: listuser,
				servererror: '',
			});
		} catch (error) {
			_useful.log('user.js').error('Ha ocuirrido un error al desactivar usuario',ident,error);
			return res.send({
				code:500,
				message:'Ha ocuirrido un error al desactivar usuario',
				data: null,
				servererror: '',
			});
		}
	},

	getByUser (req, res) {
		let { user } = req;
		_database.zunpc.repository.user.getallbyUser(user.user).then(response => {
			_useful.log('user.js').info('Listó un usuario',req.user.user,JSON.stringify(response));
			return res.send(response.entities);
		}).catch(error => {
			_useful.log('user.js').error('No se pudo listar el usuario',req.user.user,error);
			return res.sendStatus(500);
		});
	},

	async saveUsuario(req, res){
		const ident = req.user.user;
		let { body } = req;
		let { id } = body;
		if (!id || id.toString() == "" || id == undefined) {
			return res.send({
				code:500,
				message:'Compruebe que esta enviando los datos correctos. ',
				data: null,
				servererror: '',
			});
		}
		try {
			let user = await  _database.zunpc.repository.user.getById(id);
			if(!user){
				return res.send({
					code:500,
					message:'Usuario no encontrado',
					data: null,
					servererror: '',
				});
			}
			let userget = {};
			userget.id = user.id;
			userget.name = user.name;
			userget.user = user.user;
			userget.pass = user.pass;
			userget.correo = user.correo;
			userget.pconfirmado = user.pconfirmado;
			userget.telefono = user.telefono;
			userget.roleId = user.roleId;
			userget.show = user.show;
			userget.activate = (user.activate == false)? true: false;
			let salvado  = await _database.zunpc.repository.user.salvarUsuario(userget);
			_useful.log('user.js').info('Se ha salvado el usuario: ' + user.name ,req.user.user,JSON.stringify(salvado));
			var listuser = await _database.zunpc.repository.user.list("");
			return res.send({
				code:200,
				message:'Se ha salvado el usuario correctamente',
				data: listuser,
				servererror: '',
			});
		} catch (error) {
			_useful.log('user.js').error('Ha ocuirrido un error al salvar usuario',ident,error);
			return res.send({
				code:500,
				message:'Ha ocuirrido un error al salvar usuario',
				data: null,
				servererror: '',
			});
		}
	},

	async new (req, res) {
		let { body } = req;
		let { name, user, pass, roleId, entitySelect } = body;
		if ( !name || !user || !pass || !roleId ) return res.sendStatus(400);

		body.pass = _useful.encrypt(pass);

		try {
			let dbUser = await _database.zunpc.repository.user.getByUser(user);
			_useful.log('user.js').info('Listó un usuario',req.user.nick,JSON.stringify(dbUser));

			if ( dbUser && dbUser.user === user ) return res.sendStatus(400);

			let newUser = await _database.zunpc.repository.user.create(body);
			_useful.log('user.js').info('Creó un usuario', req.user.nick, JSON.stringify(newUser));

			await _database.zunpc.repository.user_entity.createByUser(newUser.id, entitySelect);
			_useful.log('role.js').info('Se asignó las entidades al usuario', req.user.nick, JSON.stringify(newUser));
			return res.send(newUser);
		}
		catch (error) {
			_useful.log('user.js').error('No se pudo crear el usuario',req.user.nick,error);
			return res.sendStatus(500);
		}
	},

	async edit (req, res) {
		let datauser = req.user;
		let { body } = req;
		let { updateUser } = body;
		if ( !updateUser || updateUser.length == 0 ){
			_useful.log('userController/edit').error('No se pudo editar el usuario',user,'El objeto pasado por parametro esta vacio');
			return res.send({
				code:500,
				message:'No se pudo editar el usuario. Objeto indefinido o vacio.',
				data: null,
				servererror: 'Objeto indefinido o vacio.',
			});;
		} 
		try{
			if(datauser.id == undefined || datauser.id == 0) {
				_useful.log('user.js').error('No se pudo editar el usuario',datauser.user,'Identificador de usuario no esta definido');
				return res.send({
					code:500,
					message:'No se pudo editar el usuario: Existen campos undefinidos. ',
					data: listuser,
					servererror: 'Identificador de usuario no esta definido',
				});
			}
			let usuario = await  _database.zunpc.repository.user.getById(datauser.id);
			let userget = {
				id: 0, name: '', user: '', pass: '', correo: '', pconfirmado: false, 
				telefono: '', roleId: '', show: '', activate: ''				
			};
			userget.id = usuario.id;
			if(updateUser.name != undefined ){
				if(updateUser.name == '' ){
					return res.send({
						code:500,
						message:'No se pudo editar el usuario: Nombre no puede estar vacio. ',
						data: null,
						servererror: '',
					});
				}
				userget.name = updateUser.name ;
			} else{
				userget.name = usuario.name ;
			}
			if(updateUser.user != undefined ){
				if(updateUser.user == '' ){
					return res.send({
						code:500,
						message:'No se pudo editar el usuario: Nombre usuario no puede estar vacio.',
						data: null,
						servererror: '',
					});
				}
				userget.user = updateUser.user;
			} else{
				userget.user = usuario.user;
			}
			userget.pass = usuario.pass;
			userget.pconfirmado = usuario.pconfirmado;
			if(updateUser.correo != undefined ){
				if(updateUser.correo == '' ){
					return res.send({
						code:500,
						message:'No se pudo editar el usuario: El correo no puede estar vacio.',
						data: null,
						servererror: '',
					});
				}
				userget.correo = updateUser.correo;
			} else{
				userget.correo = usuario.correo ;
			}
			if(updateUser.telefono != undefined ){
				if(updateUser.telefono == '' ){
					return res.send({
						code:500,
						message:'No se pudo editar el usuario: El telefono no puede estar vacio.',
						data: null,
						servererror: '',
					});
				}
				userget.telefono = updateUser.telefono;
			}
			else{
				userget.telefono = usuario.telefono ;
			}
			userget.roleId = usuario.roleId;
			userget.show = usuario.show;
			userget.activate = usuario.activate;
			let salvado  = await _database.zunpc.repository.user.salvarUsuario(userget);
			_useful.log('user.js').info('Se ha editado el usuario: ' + updateUser.name ,datauser.user,JSON.stringify(userget));
			let usuarioeditado = await  _database.zunpc.repository.user.getById(userget.id);
			return res.send({
				code:200,
				message:'Se ha editado el usuario correctamente',
				data: usuarioeditado,
				servererror: '',
			});
		}
		catch (error) {
			_useful.log('user.js').error('No se pudo editar el usuario',datauser.user,error);
			return res.send({
				code:500,
				message:'No se ha editado el usuario correctamente',
				data: null,
				servererror: '',
			});
		}
	},

	resetPassword (req, res) {
		let { pass, id } = req.body;

		if (pass && id) {
			pass = _useful.encrypt(pass);
		}
		else {
			return res.sendStatus(400);
		}

		try {
			let user = _database.zunpc.repository.user.resetPassword(pass, id);
			_useful.log('user.js').info(`Reseteó la constraseña al usuario con ID ${id}`,req.user.nick,JSON.stringify(user));
			return res.send();
		}
		catch (error) {
			_useful.log('user.js').error(`No se pudo resetear la contraseña al usuario con ID ${id}`,req.user.nick,error);
			return res.sendStatus(500);
		}
	},

	async remove (req, res) {
		let { id } = req.params;
		if ( id ) {
			id = parseInt(id);
			if ( id ===1 || id === 2 || id === 3 ) return res.sendStatus(400);
		}
		else {
			return res.sendStatus(400);
		}

		try {
			await _database.zunpc.repository.user.delete(id);
			_useful.log('user.js').info('Eliminó un usuario',req.user.nick,JSON.stringify(id));
			return res.send('OK');
		}
		catch (error) {
			_useful.log('user.js').error('No se pudo eliminar el usuario',req.user.nick,error);
			return res.sendStatus(500);
		}
	},

	async listaddressbyidUser(req, res){
		let user = req.user;
		let { body } = req;
		try {
			let listdirecciones = await _database.zunpc.repository.user.listdirecciones(user.id);
			if(!listdirecciones || listdirecciones.length <= 0){
				_useful.log('user.js').error('Error al listar las direcciones',user.user,'No existe dirección');
				return res.send({
					code:200,
					message:'No existe dirección.',
					data: null,
					servererror: '',
				});
			}
			return res.send({
				code:200,
				message:'Se ha listado las direcciones',
				data: listdirecciones,
				servererror: '',
			});
		} catch (error) {
			_useful.log('user.js').error('Error al listar las direcciones',user.user,error);
			return res.send({
				code:500,
				message:'Error al listar las direcciones',
				data: null,
				servererror: '',
			});
		}
	},

	async addDireccion(req, res){
		let user = req.user;
		let { body } = req;
		let { direccion, municipio, provincia } = body;
		try {
			if( direccion == undefined || municipio == undefined || provincia == undefined ){
				_useful.log('user.js').error('Error al adicionar direccion del usuario: Existen valores indefinidos.',user.user,'Verifique que los datos que esta enviando no esten undefined.');
				return res.send({
					code:500,
					message:'Error al adicionar direccion del usuario: Existen valores indefinidos.',
					data: null,
					servererror: '',
				});
			}
			let datos = {};
			datos.direccion = direccion;
			datos.municipio = municipio;
			datos.provincia = provincia;
			datos.userId = user.id;

			let adddir = await _database.zunpc.repository.user.addDireccionofUser(datos);
			if(!adddir){
				_useful.log('user.js').error('Error al adicionar direccion del usuario.',user.user,);
				return res.send({
					code:500,
					message:'Error al adicionar direccion del usuario..',
					data: null,
					servererror: '',
				});
			}
			_useful.log('user.js').info('Se ha adicionado correctamente la dirección.', req.user.user, JSON.stringify(adddir));
			let listdirecciones = await _database.zunpc.repository.user.listdirecciones(adddir.dataValues.userId);
			return res.send({
				code:200,
				message:'Se ha adicionado correctamente la dirección.',
				data: listdirecciones,
				servererror: '',
			});
		} catch (error) {
			_useful.log('user.js').error('Error al adicionar la dirección',user.user,error);
			return res.send({
				code:500,
				message:'Error al adicionar la dirección',
				data: null,
				servererror: '',
			});
		}
	},
	async editDireccion(req, res){
		let user = req.user;
		let { body } = req;
		let {idLD, direccion, municipio, provincia } = body;
		try {
			if(idLD == undefined || direccion == undefined || municipio == undefined || provincia == undefined ){
				_useful.log('user.js').error('Error al editar direccion del usuario: Existen valores indefinidos.',user.user,'Verifique que los datos que esta enviando no esten undefined.');
				return res.send({
					code:500,
					message:'Error al editar direccion del usuario: Existen valores indefinidos.',
					data: null,
					servererror: '',
				});
			}
			let datos = {};
			datos.idLD = idLD;
			datos.direccion = direccion;
			datos.municipio = municipio;
			datos.provincia = provincia;
			datos.userId = user.id;
			let editdir = await _database.zunpc.repository.user.editDireccionofUser(datos);
			if(!editdir){
				_useful.log('user.js').error('Error al editar dirección del usuario.',user.user,);
				return res.send({
					code:500,
					message:'Error al editar dirección del usuario..',
					data: null,
					servererror: '',
				});
			}
			_useful.log('user.js').info('Se ha editado correctamente la dirección.', user.user, JSON.stringify(editdir));
			let listdirecciones = await _database.zunpc.repository.user.listdirecciones(user.id);
			return res.send({
				code:200,
				message:'Se ha editado correctamente la dirección.',
				data: listdirecciones,
				servererror: '',
			});

		} catch (error) {
			_useful.log('user.js').error('Error al editar las dirección',user,error);
			return res.send({
				code:500,
				message:'Error al editar las dirección',
				data: null,
				servererror: '',
			});
		}
	},
	async deleteDireccion(req, res){
		let user = req.user;
		let { idLD } = req.params;
		try {
			if( idLD == undefined ){
				_useful.log('user.js').error('Error al eliminar la direccion del usuario: Existen valores indefinidos.',user.user,'Verifique que los datos que esta enviando no esten undefined.');
				return res.send({
					code:500,
					message:'Error al eliminar la direccion del usuario: Existen valores indefinidos.',
					data: null,
					servererror: '',
				});
			}
			let dir = await _database.zunpc.repository.user.obtenerDireccionByIdLD(idLD);
			if(!dir){
				return res.send({
					code:500,
					message:'Error al eliminar la direccion del usuario: Direccion no encontrada.',
					data: null,
					servererror: '',
				});
			}
			let deletedir = await _database.zunpc.repository.user.removeDireccionofUser(idLD);
			if(!deletedir){
				_useful.log('user.js').error('Error al eliminar la dirección del usuario.',user.user,);
				return res.send({
					code:500,
					message:'Error al eliminar la dirección del usuario.',
					data: null,
					servererror: '',
				});
			}
			_useful.log('user.js').info('Se ha eliminado correctamente la dirección.', user.user, JSON.stringify(deletedir));
			let listdirecciones = await _database.zunpc.repository.user.listdirecciones(dir.userId);
			return res.send({
				code:200,
				message:'Se ha eliminado correctamente la dirección.',
				data: listdirecciones,
				servererror: '',
			});
		} catch (error) {
			_useful.log('user.js').error('Error al eliminar la dirección',user.user,error);
			return res.send({
				code:500,
				message:'Error al eliminar la dirección',
				data: null,
				servererror: '',
			});
		}
	},
	async getSimilares(req, res){
		let user = req.user;
		let { body } = req;
		let { id } = body;
		try {
			let tresultimos = await _database.zunpc.repository.user.obtenerTresUltimosProd(id);
			let listasimilares = [];
			if(!tresultimos || tresultimos.length <= 0){
				listasimilares = await _database.zunpc.repository.user.obtenerProductos();
			}else{
				let tp1 = tresultimos[0].tipoProd;
				let tp2 = tresultimos[1].tipoProd;
				let tp3 = tresultimos[2].tipoProd;
				listasimilares = await _database.zunpc.repository.user.obtenerProductosSimilares(tp1,tp2,tp3);
			}
			return res.send({
				code:200,
				message:'ok.',
				data: listasimilares,
				servererror: '',
			});
		} catch (error) {
			_useful.log('user.js').error('Error al obtener los productos',user.user,error);
			return res.send({
				code:500,
				message:'Error al obtener los productos',
				data: null,
				servererror: '',
			});
		}
	},

	async getAllFavorites(req, res){
		let datauser = req.user;
		let { body } = req;
		try {
			let listfavor = await _database.zunpc.repository.user.obtenerTodosFavoritos(datauser.id);
			return res.send({
				code:200,
				message:`Se ha listado los favoritos del usuario:${datauser.user}`,
				data: listfavor,
				servererror: '',
			});
		} catch (error) {
			_useful.log('user.js').error(`Error al listar los favoritos del usuario ${datauser.user}.`,datauser.user,error);
			return res.send({
				code:500,
				message:`Error al listar los favoritos del usuario ${datauser.user}.`,
				data: null,
				servererror: '',
			});
		}
	},

	async addFavorite(req, res){
		let datauser = req.user;
		let { body } = req;
		let { prodId } = body;
		if( prodId == undefined || prodId == 0){
			_useful.log('user.js').error(`Error al adicionar elemento favorito para el usuario ${datauser.user}.`,datauser.user,'Existen campos indefinidos');
			return res.send({
				code:500,
				message:`Error al listar los favoritos del usuario ${datauser.user}.Existen campos indefinidos`,
				data: null,
				servererror: '',
			});
		}
		try {
			let favorito = { userId: datauser.id, prodId: prodId}
			let favor = await _database.zunpc.repository.user.adicionarFavoritos(favorito);
			if(!favor){
				_useful.log('user.js').error(`Error al adicionar elemento favorito para el usuario ${datauser.user}.`,datauser.user,'Ha ocurrido una error inesperado');
				return res.send({
					code:500,
					message:`Error al adicionar elemento favorito para el usuario ${datauser.user}.`,
					data: null,
					servererror: '',
				});
			}
			_useful.log('user.js').info(`Se ha adicionado correctamente el elemento favorito para el usuario ${datauser.user}.`, datauser.user, JSON.stringify(favor));
			let listfavor = await _database.zunpc.repository.user.obtenerTodosFavoritos(datauser.id);
			return res.send({
				code:200,
				message:`Se ha adicionado correctamente el elemento favorito para el usuario ${datauser.user}.`,
				data: listfavor,
				servererror: '',
			});
		} catch (error) {
			_useful.log('user.js').error(`Error al adicionar elemento favorito para el usuario ${datauser.user}.`,datauser.user,error);
			return res.send({
				code:500,
				message:`Error al adicionar elemento favorito para el usuario ${datauser.user}.`,
				data: null,
				servererror: '',
			});
		}
	},

	async deleteFavorite(req,res){
		let datauser = req.user;
		let { idProd } = req.params;
		if(idProd == undefined || idProd == 0) {
			_useful.log('user.js').error(`Error al eliminar elemento favorito para el usuario ${datauser.user}.`,datauser.user,'El id del elemento favorito esta indefinidos');
			return res.send({
				code:500,
				message:`Error al eliminar elemento favorito para el usuario ${datauser.user}. Existen elementos indefinidos`,
				data: null,
				servererror: '',
			});
		}
		try {
			let favor = await _database.zunpc.repository.user.eliminarFavorito(idProd,datauser.id);
			if(!favor){
				_useful.log('user.js').error(`Error al eliminar elemento favorito para el usuario ${datauser.user}.`,datauser.user,'Ha ocurrido una error inesperado');
				return res.send({
					code:500,
					message:`Error al eliminar elemento favorito para el usuario ${datauser.user}.`,
					data: null,
					servererror: '',
				});
			}
			_useful.log('user.js').info(`Se ha eliminado correctamente el elemento favorito para el usuario ${datauser.user}.`, datauser.user, JSON.stringify(favor));
			let listfavor = await _database.zunpc.repository.user.obtenerTodosFavoritos(datauser.id);
			return res.send({
				code:200,
				message:`Se ha eliminado correctamente el elemento favorito para el usuario ${datauser.user}.`,
				data: listfavor,
				servererror: '',
			});
		} catch (error) {
			_useful.log('user.js').error(`Error al eliminar elemento favorito para el usuario ${datauser.user}.`,datauser.user,error);
			return res.send({
				code:500,
				message:`Error al eliminar elemento favorito para el usuario ${datauser.user}.`,
				data: null,
				servererror: '',
			});
		}
	},

	async obtenerRegistroComprasUsuario(req,res){
		let datauser = req.user;
		let { body } = req;
		let { buscar } = body;
		try {
			let listregistrio = await _database.zunpc.repository.user.obtenerRegisterUser(buscar); 
			if(listregistrio.length == 0){
				return res.send({
					code:200,
					message:`No existen compra realizadas.`,
					data: listregistrio,
					servererror: '',
				});
			}
			return res.send({
				code:200,
				message:`Se ha listado correctamente el registro de compras .`,
				data: listregistrio,
				servererror: '',
			});
		} catch (error) {
			_useful.log('user.js').error(`Error al obtener el registro de venta .`,datauser.user,error);
			return res.send({
				code:500,
				message:`Error al obtener el registro de venta .`,
				data: null,
				servererror: '',
			});
		}
	},
	async obtenerRegistroComprasPorUsuario(req,res){
		let datauser = req.user;
		let { body } = req;
		let { buscar } = body;
		try {
			let listregistrio = await _database.zunpc.repository.user.obtenerRegisterUser(buscar,req.user.id); 
			if(listregistrio.length == 0){
				return res.send({
					code:200,
					message:`El usuario ${datauser.user} no ha realizado ninguna compra.`,
					data: listregistrio,
					servererror: '',
				});
			}
			return res.send({
				code:200,
				message:`Se ha listado correctamente el registro de compras del usuario ${datauser.user}.`,
				data: listregistrio,
				servererror: '',
			});
		} catch (error) {
			_useful.log('user.js').error(`Error al obtener el registro de venta del usuario ${datauser.user}.`,datauser.user,error);
			return res.send({
				code:500,
				message:`Error al obtener el registro de venta del usuario ${datauser.user}.`,
				data: null,
				servererror: '',
			});
		}
	}


};