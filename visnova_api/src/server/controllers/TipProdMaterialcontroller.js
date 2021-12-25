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
const { tmpdir } = require('os');

exports.TipProdMaterialcontroller = {

	GetTipProdMaterial(req,res){
		
		const ident = req.user.user;
		let { body } = req;
		let { buscar } = body;
		try {
			
			_database.zunpc.repository.TipProdMaterialrepository.listTipProdMaterial(buscar).then(response => {
				_useful.log('TipProdMaterialcontroller.js').info('Listó los tipo de productos material ',req.user.user, JSON.stringify(response));
	
				return res.json(new httpresponse(200,"ok",response,""));
			}).catch(error => {
				_useful.log('TipProdMaterialcontroller.js').error('No se pudo listar los tipo de productos material',ident,error);
				return res.json(new httpresponse(500,"No se pudo listar los servicios",null,""));
			});
		} catch (error) {
			_useful.log('TipProdMaterialcontroller.js').error('No se pudo listar los tipo de productos material',ident,error);
			return res.json(new httpresponse(500,"No se ha podido listar los tipo de productos material",null,""));
		}
		
	},
	GetTipProdMaterialById(req,res){
		const id = req.body.idProd;
		_database.zunpc.repository.TipProdMaterialrepository.obtenerTipProdMaterialByid(id).then(response => {
			_useful.log('TipProdMaterialcontroller.js').info('Se obtubo el tipo de producto material',req.user.user, JSON.stringify(response));
			return res.json(new httpresponse(200,"ok",response,""));
		}).catch(error => {
			_useful.log('TipProdMaterialcontroller.js').error('No se ha podido obtener el tipo de producto material','req.user.user',error);
			return res.json(new httpresponse(500,"No se ha podido obtener el tipo de producto material",null,""));
		});
	},
	/* async adicionarTipProdMaterial(req,res){
		let nick = req.user.user;
		let { body } = req;
		let {  nombre, tipoProducto, material, tipoMaterial } = body;
		let tpm = {};
		let mensaje = ""; 
		//verifico q estan todas los  atributos de producto.
		//if ( !nombre || !tipoProducto || !material || !tipoMaterial) return res.json(new httpresponse(500,"Error al adicionar un tipo de producto material: Compruebe que los campos esten llenos",null,""));
		if ( nombre == undefined || tipoProducto == undefined || material == undefined || tipoMaterial == undefined) return res.json(new httpresponse(500,"Error al adicionar un tipo de producto material: Compruebe que no le falte ningun dato por el enviar",null,""));

		try {
			
			//Busco si existe un tipo de producto en base datos 
			let dbTPM = await _database.zunpc.repository.TipProdMaterialrepository.getByNameTPM(nombre);
			if ( dbTPM && dbTPM.nombre === nombre ) return res.json(new httpresponse(500,"Error al adicionar el tipo de producto material: Este registro ya existe.",null,""));
			if (tipoMaterial != "") {
				tpm.nombre = nombre;
				tpm.idFk = parseInt(material.value);
				mensaje = "Se ha insertado el tipo de material ";
			} else if(material != "") {
				tpm.nombre = nombre;
				tpm.idFk = parseInt(material.value);
				mensaje = "Se ha insertado el tipo de material ";
			}else if(tipoProducto != ""){
				tpm.nombre = nombre;
                tpm.idFk = parseInt(tipoProducto.value);
                mensaje = "Se ha insertado el tipo de material ";
			}else{
				console.log("llego aqui con el nombre :", nombre);
				tpm.nombre = nombre;
                tpm.idFk = parseInt(0);
                mensaje = "Se ha insertado el tipo producto ";
			}
			let newTPM = await _database.zunpc.repository.TipProdMaterialrepository.addTPM(tpm);
			_useful.log('TipProdMaterialcontroller.js').info(mensaje, req.user.nick, JSON.stringify(newTPM)); 
			var listTPM = await _database.zunpc.repository.TipProdMaterialrepository.listTipProdMaterial("");
			return res.json(new httpresponse(200,"ok",listTPM,""));
		}
		catch (error) {
			_useful.log('TipProdMaterialcontroller.js').error('No se ha podido crear el tipo de producto material',nick,error);
			return res.json(new httpresponse(500,"No se ha podido crear el tipo de producto material",null,""));
		} 
	}, */
	// cambiar este motodo
	/* async adicionarTipProdMaterial(req,res){
		let nick = req.user.user;
		let { body } = req;
		let {  nombre, tipoProducto, material, tipoMaterial } = body;
		let tpm = {};
		let mensaje = ""; 
		//verifico q estan todas los  atributos de producto.
		//if ( !nombre || !tipoProducto || !material || !tipoMaterial) return res.json(new httpresponse(500,"Error al adicionar un tipo de producto material: Compruebe que los campos esten llenos",null,""));
		if ( nombre == undefined  || nombre == "") return res.json(new httpresponse(500,"Error al adicionar un tipo de producto material: Compruebe que no le falte ningun dato por el enviar",null,""));

		try {
			
			//Busco si existe un tipo de producto en base datos 
			let dbTPM = await _database.zunpc.repository.TipProdMaterialrepository.getByNameTPM(nombre);
			if ( dbTPM && dbTPM.nombre === nombre ) return res.json(new httpresponse(500,"Error al adicionar el tipo de producto material: Este registro ya existe.",null,""));
			if (tipoMaterial != undefined) {
				tpm.nombre = nombre;
				tpm.idFk = parseInt(material.value);
				mensaje = "Se ha insertado el tipo de material ";
			} else if(material != undefined) {
				tpm.nombre = nombre;
				tpm.idFk = parseInt(material.value);
				mensaje = "Se ha insertado el tipo de material ";
			}else if(tipoProducto != undefined){
				tpm.nombre = nombre;
                tpm.idFk = parseInt(tipoProducto.value);
                mensaje = "Se ha insertado el tipo de material ";
			}else{
				tpm.nombre = nombre;
                tpm.idFk = parseInt(0);
                mensaje = "Se ha insertado el tipo producto ";
			}
			let newTPM = await _database.zunpc.repository.TipProdMaterialrepository.addTPM(tpm);
			_useful.log('TipProdMaterialcontroller.js').info(mensaje, req.user.nick, JSON.stringify(newTPM)); 
			var listTPM = await _database.zunpc.repository.TipProdMaterialrepository.listTipProdMaterial("");
			return res.json(new httpresponse(200,"ok",listTPM,""));
		}
		catch (error) {
			_useful.log('TipProdMaterialcontroller.js').error('No se ha podido crear el tipo de producto material',nick,error);
			return res.json(new httpresponse(500,"No se ha podido crear el tipo de producto material",null,""));
		} 
	}, */


	async adicionarTipProdMaterial(req,res){
		let nick = req.user.user;
		let { body } = req;
		let {  nombre, value } = body;
		let tpm = {};
		let mensaje = ""; 
		//verifico q estan todas los  atributos de producto.
		//if ( !nombre || !tipoProducto || !material || !tipoMaterial) return res.json(new httpresponse(500,"Error al adicionar un tipo de producto material: Compruebe que los campos esten llenos",null,""));
		if ( nombre == undefined  || nombre == "") return res.json(new httpresponse(500,"Error al adicionar un tipo de producto material: Compruebe que no le falte ningun dato por el enviar",null,""));

		try {
			
			//Busco si existe un tipo de producto en base datos 
			let dbTPM = await _database.zunpc.repository.TipProdMaterialrepository.getByNameTPM(nombre);
			if ( dbTPM && dbTPM.nombre === nombre ) return res.json(new httpresponse(500,"Error al adicionar el tipo de producto material: Este registro ya existe.",null,""));
			let nuevoTPM = {
				nombre: nombre,
				idFk: value
			};
			let newTPM = await _database.zunpc.repository.TipProdMaterialrepository.addTPM(nuevoTPM);
			_useful.log('TipProdMaterialcontroller.js').info(mensaje, req.user.nick, JSON.stringify(newTPM)); 
			var listTPM = await _database.zunpc.repository.TipProdMaterialrepository.listTipProdMaterial("");
			return res.json(new httpresponse(200,"ok",listTPM,""));
		}
		catch (error) {
			_useful.log('TipProdMaterialcontroller.js').error('No se ha podido crear el tipo de producto material',nick,error);
			return res.json(new httpresponse(500,"No se ha podido crear el tipo de producto material",null,""));
		} 
	},

	async editarTipoProdMater(req,res){
		let nick = req.user.user;
		let { body } = req;
		let { idPk,nombre, value} = body;
		if (nombre == "" ) return res.json(new httpresponse(500,"Error al editar un tipo de producto material: El campo nombre no debe estar vacio.",null,""));
		if ( idPk == undefined || nombre == undefined || value == undefined ) return res.json(new httpresponse(500,"Error al editar un tipo de producto material: parametro de entrada no definido",null,""));

		try {
			let existe  = await _database.zunpc.repository.TipProdMaterialrepository.obtenerTipProdMaterialByid(idPk);
			if (!existe) {
				return res.json(new httpresponse(500,"No se ha podido editar: Elemento no econtrado",null,""));
			}
			let element = {
				idPk : idPk,
				nombre : nombre,
				idFk : value
			};
			
			let TPM = await _database.zunpc.repository.TipProdMaterialrepository.updateTPM(element);
			_useful.log('TipProdMaterialcontroller.js').info('Se ha editado correctamente',nick,JSON.stringify(TPM));
			var listprod = await _database.zunpc.repository.TipProdMaterialrepository.listTipProdMaterial("");
			return res.json(new httpresponse(200,"Se ha editado el tipo de producto material correctamente",listprod,""));
		} catch (error) {
			_useful.log('TipProdMaterialcontroller.js').error('No se ha podido editar el tipo de producto material',nick,error);
			return res.json(new httpresponse(500,"No se ha podido editar el tipo de producto material",null,""));
		}
	},

	async DeleteTipProdMaterial (req, res) {
		let nick = req.user.user;
		let { id } = req.params;
		if ( id == undefined ) return res.json(new httpresponse(500,"Ha ocurrido un error al intentar eliminar el registro: parametro de entrada no definido",null,""));

		try {
			//busco el elemento a eliminar segun el id
			let tpm = await  _database.zunpc.repository.TipProdMaterialrepository.obtenerTipProdMaterialByid(id);
			//verifico si existe
			if(!tpm){
				_useful.log('TipProdMaterialcontroller.js').info('Ha ocurrido un error al intentar eliminar el registro:Tipo de producto material no encontrado.',nick,JSON.stringify(id));
				return res.json(new httpresponse(500,"Ha ocurrido un error al intentar eliminar el registro:Tipo de producto material no encontrado.",null,""));
			}
			//busco sus hijos si es que tiene
			var hijostpm = await  _database.zunpc.repository.TipProdMaterialrepository.obtenerHijosTipProdMaterialByid(id);
			if(!hijostpm){ // si no tiene hijos elimino el tipo producto material
				await _database.zunpc.repository.TipProdMaterialrepository.deleteTMP(id);
				_useful.log('TipProdMaterialcontroller.js').info('Se ha eliminado el tipo de producto material',nick,JSON.stringify(id));
				var listtmp = _database.zunpc.repository.TipProdMaterialrepository.listTipProdMaterial("");
				return res.json(new httpresponse(200,"Se ha eliminado correctamente",listtmp,""));
			}else{//si tiene hijos
				//recorro los hijos
				for (let i = 0; i < hijostpm.length; i++) {
					let elementhijo = hijostpm[i];//obtenego el hijo
					var nietos = await  _database.zunpc.repository.TipProdMaterialrepository.obtenerHijosTipProdMaterialByid(elementhijo.idPk);//obtengo los nietos
					if(nietos){//si tiene nieto
						//recorro los nietos
						for (let j = 0; j < nietos.length; j++) {
							let elementnieto = nietos[j];//obtengo el nieto
							await _database.zunpc.repository.TipProdMaterialrepository.deleteTMP(elementnieto.idPk);//elimino el nieto
						}
					}
				}
				//procedo a eliminar los hijos
				for (let k = 0; k < hijostpm.length; k++) {
					let hijoelem = hijostpm[k];
					await _database.zunpc.repository.TipProdMaterialrepository.deleteTMP(hijoelem.idPk);//elimino el hijo
				}
				//elimino el padre
				await _database.zunpc.repository.TipProdMaterialrepository.deleteTMP(id);
				_useful.log('TipProdMaterialcontroller.js').info('Se ha eliminado el tipo de producto material',nick,JSON.stringify(id));
				var listtmp = _database.zunpc.repository.TipProdMaterialrepository.listTipProdMaterial("");
				return res.json(new httpresponse(200,"Se ha eliminado correctamente",listtmp,""));
			}
			
		}
		catch (error) {
			_useful.log('TipProdMaterialcontroller.js').error('Ha ocurrido un error al intentar eliminar el tipo de producto material',nick,error);
			return res.json(new httpresponse(500,"Ha ocurrido un error al intentar eliminar el tipo de producto material.",null,""));
		}
	},

	async getTipoProducto(req, res){
		let nick = req.user.user;
		let { body } = req;
		let { buscar } = body;
		try {
			let listtipoproducto = await  _database.zunpc.repository.TipProdMaterialrepository.obtenerTipProd(buscar);
			return res.json(new httpresponse(200,"Se ha listado los tipos de productos correctamente",listtipoproducto,""));
		} catch (error) {
			_useful.log('TipProdMaterialcontroller.js').error('Ha ocurrido un error al obtener tipo de producto',nick,error);
			return res.json(new httpresponse(500,"Ha ocurrido un error al obtener tipo de producto.",null,""));
		}		
	},

	async getMaterialesByIdTipoProducto(req,res){
		let nick = req.user.user;
		let { body } = req;
		let { idTipoProducto } = body;
		if ( idTipoProducto == undefined ) return res.json(new httpresponse(500,"Ha ocurrido un error al obtener los materiales: parametro de entrada no definido",null,""));
		try {
			var listmateriales = await  _database.zunpc.repository.TipProdMaterialrepository.obtenerMateriales(idTipoProducto);
			return res.json(new httpresponse(200,"Se ha listado los materiales correctamente",listmateriales,""));
		} catch (error) {
			_useful.log('TipProdMaterialcontroller.js').error('Ha ocurrido un error al obtener los materiales',nick,error);
			return res.json(new httpresponse(500,"Ha ocurrido un error al obtener los materiales.",null,""));
		}
	},

	async getMaterialesByIdMaterial(req,res){
		let nick = req.user.user;
		let { body } = req;
		let { idMaterial } = body;
		if ( idMaterial == undefined ) return res.json(new httpresponse(500,"Ha ocurrido un error al obtener los tipos de materiales: parametro de entrada no definido",null,""));
		
		try {
			var listmateriales = await  _database.zunpc.repository.TipProdMaterialrepository.obtenerTipMateriales(idMaterial);
			return res.json(new httpresponse(200,"Se ha listado los tipos de  materiales correctamente",listmateriales,""));
		} catch (error) {
			_useful.log('TipProdMaterialcontroller.js').error('Ha ocurrido un error al obtener los tipos de materiales',nick,error);
			return res.json(new httpresponse(500,"Ha ocurrido un error al obtener los tipos de materiales.",null,""));
		}
	},

	async getMateriales(req,res){
		let nick = req.user.user;
			let { body } = req;
			let { buscar } = body;
		try {
			let listaMateriales = await  _database.zunpc.repository.TipProdMaterialrepository.getAllMateriales(buscar);
			return res.json(new httpresponse(200,"Se ha listado todos los materiales",listaMateriales,""));
		} catch (error) {
			_useful.log('TipProdMaterialcontroller.js').error('Ha ocurrido un error al obtener todos los materiales',nick,error);
			return res.json(new httpresponse(500,"Ha ocurrido un error al obtener los filtros.",null,""));
		}
	},

	async getFiltrosReferencias(req,res){
		let nick = req.user.user;
		let { body } = req;
		let { id } = body;
		try {
			let arrobj = [];
			let elemnt = await  _database.zunpc.repository.TipProdMaterialrepository.obtenerTipProdMaterialByid(id);
			if(!elemnt) return res.json(new httpresponse(500,"Ha ocurrido un error al obtener el elemento: elemento no encontrado",null,""));
			let referencias ;
			//obtengo la referencia de este elemento
			if(elemnt.idFk == 0 ){
				//busco todos las referencias q son tipos de cobros( idfk = 0)
				
				return res.json(new httpresponse(200,"Se ha listado el filtro",referencias,""));
			}else{
				//supongo q sea un material
				let elemntrefe = await  _database.zunpc.repository.TipProdMaterialrepository.obtenerTipProdMaterialByid(elemnt.idFk);
				if(elemntrefe.idFk == 0){
					//envio todos los tipos de productos
					referencias = await  _database.zunpc.repository.TipProdMaterialrepository.obtenerTipProd("");
					return res.json(new httpresponse(200,"Se ha listado el filtro",referencias,""));
				}else{
					//busco los materiales
					let tp = await  _database.zunpc.repository.TipProdMaterialrepository.obtenerTipProd("");
					for (let i = 0; i < tp.length; i++) {
						let idpk = tp[i].dataValues.value;
						let obtengoMaterial = await  _database.zunpc.repository.TipProdMaterialrepository.obtenerTipMateriales(idpk);
						if(obtengoMaterial.length != 0){
							for (let j = 0; j < obtengoMaterial.length; j++) {
								arrobj.push(obtengoMaterial[j].dataValues);
							}
						}
					}
					referencias = arrobj;
					return res.json(new httpresponse(200,"Se ha listado el filtro",referencias,""));
				}	
			}	
		} catch (error) {
			_useful.log('TipProdMaterialcontroller.js').error('Ha ocurrido un error al obtener los filtros',nick,error);
			return res.json(new httpresponse(500,"Ha ocurrido un error al obtener los filtros.",null,""));
		}
	},
	 
	async getFiltros(req,res){
		let nick = req.user.user;
		try {
			let list = await  _database.zunpc.repository.TipProdMaterialrepository.obtenerFiltro();
			let auxobj = {};
			let arrobj = [];
			for (let i = 0; i < list.length; i++) {
				let referencia = (list[i].idFk == 0)? "": await  _database.zunpc.repository.TipProdMaterialrepository.getReferencia(list[i].idFk);
				auxobj = {id:list[i].idPk, nombre:list[i].nombre,referencia : referencia.nombre };
				arrobj.push(auxobj);
				
			}
			return res.json(new httpresponse(200,"Se ha listado el filtro",arrobj,""));
		} catch (error) {
			_useful.log('TipProdMaterialcontroller.js').error('Ha ocurrido un error al obtener los filtros',nick,error);
			return res.json(new httpresponse(500,"Ha ocurrido un error al obtener los filtros.",null,""));
		}
	 },
	 async getFiltrosById(req,res){
		let nick = req.user.user;
		let { body } = req;
		let { id } = body;
		try {
			//asumo q el id que entra por paramtro es de un tipo de material.
			let tipmat = await  _database.zunpc.repository.TipProdMaterialrepository.obtenerTipProdMaterialByid(id);
			let result = {};
			//obtenego el supuesto tipo de material
			if (tipmat.idFk != 0) {
				//obtengo el supuesto material dado el id del tipo material
				let objmaterial = await  _database.zunpc.repository.TipProdMaterialrepository.obtenerTipProdMaterialByid(tipmat.idFk);
				if (objmaterial.idFk != 0) {
					let objtipoproducto = await  _database.zunpc.repository.TipProdMaterialrepository.obtenerTipProdMaterialByid(objmaterial.idFk);
					result = {
						nombre : tipmat.nombre,
						tipoProducto : {label : objtipoproducto.nombre, value :  objtipoproducto.idPk},
						material : { label : objmaterial.nombre, value : objmaterial.idPk},
						tipoMaterial : {label : tipmat.nombre, value : tipmat.idPk},
					};
				} else {
					result =
                        {
                            nombre : tipmat.nombre,
                            tipoProducto : { label : objmaterial.nombre, value : objmaterial.idPk },
                            material : { label : tipmat.nombre, value : tipmat.idPk },
                            tipoMaterial : ""
                        };
				}
			} else {
				result =
                    {
                        nombre : tipmat.nombre,
                        tipoProducto :  { label : tipmat.nombre, value : tipmat.idPk },
                        material : "",
                        tipoMaterial : ""
                    };
			}
			return res.json(new httpresponse(200,"Se ha listado el filtro",result,""));
		} catch (error) {
			_useful.log('TipProdMaterialcontroller.js').error('Ha ocurrido un error al obtener el filtros',nick,error);
			return res.json(new httpresponse(500,"Ha ocurrido un error al obtener el filtros.",null,""));
		}
	 },

	 async ejemplotp(producto, user){
		let u = user;
		let tpname = await  _database.zunpc.repository.TipProdMaterialrepository.obtenerTPM(producto.tipoProd);
		let respuesta = "";
		if(!tpname){
			
			return respuesta;
		} 
		respuesta = tpname.nombre;
		return new httpresponse(200,"ok",respuesta,"");
	 }

	
};
