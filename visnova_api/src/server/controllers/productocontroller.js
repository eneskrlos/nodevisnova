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
const { resolve } = require('path');

exports.productocontroller = {
    
	
	async GetProductos(req,res){
		
		const ident = req.user.user;
		let { body } = req;
		let { buscar } = body;
		try {
			const prod = await _database.zunpc.repository.productorepository.prodquery(buscar);
			_useful.log('productocontroller.js').info('Se ha listado los productos',ident);
			return res.json(new httpresponse(200,"ok",prod,""));
		} catch (error) {
			_useful.log('productocontroller.js').error('No se pudo listar los productos',ident,error);
			return res.json(new httpresponse(500,"No se ha podido listar los productos",null,""));
		} 
		
	},
	obtenerProducto(req,res){
		const id = req.body.idProd;
		let paux = {};
		let tp = "";
		let m = "";
		let tm = "";
		_database.zunpc.repository.productorepository.GetProductoporid(id).then(response => {
			let producto = response;
			
			_useful.log('productocontroller.js').info('Se obtubo el producto',req.user.user, JSON.stringify(paux));
			return res.json(new httpresponse(200,"ok",producto,""));
		}).catch(error => {
			_useful.log('productocontroller.js').error('No se ha podido obtener el producto',req.user.user,error);
			return res.json(new httpresponse(500,"No se ha podido obtener el producto",null,""));
		});
	},
	async adiconarProducto(req,res){
		let nick = req.user.user;
		let { body } = req;
		let { descripcion, tipoProd, material, tipoMaterial, precio, activo, fotoprod1, fotoprod2, fotoprod3, cantDisponible, en_promosion, tiempoelavoracion, en_oferta } = body;
		//verifico q estan todas los  atributos de producto.
		if ( tipoProd == "" || tipoProd == undefined || material == undefined
		|| material == ""  || tipoMaterial == undefined || tipoMaterial == ""  ) 
		return res.json(new httpresponse(500,"Error al adicionar un producto: Compruebe que los campos de tipo de producto, material y tipo de material esten llenos",null,""));
		try {
			//Busco si existe un producto en base datos 
			let dbproduc = await _database.zunpc.repository.productorepository.getByDescProd(descripcion);
			if ( dbproduc && dbproduc.descripcion === descripcion ) return res.json(new httpresponse(500,"Error al adicionar el producto: El producto ya existe.",null,""));
			let insertarporducto = {
				descripcion: descripcion,
				tipoProd: tipoProd.value,
				material: material.value,
				tipoMaterial: tipoMaterial.value,
				precio:precio,
				activo: (activo == undefined)?false:activo,
				fotoprod1:fotoprod1,
				fotoprod2: fotoprod2,
				fotoprod3: fotoprod3,
				cantDisponible: cantDisponible,
				en_promosion: (en_promosion == undefined)?false:en_promosion, 
				tiempoelavoracion: tiempoelavoracion, 
				en_oferta: (en_oferta == undefined)?false:en_oferta
			};
			let newprod = await _database.zunpc.repository.productorepository.addProducto(insertarporducto);
			_useful.log('productocontroller.js').info('Se ha creado un producto nuevo.', req.user.nick, JSON.stringify(newprod));
			var listproduct = await _database.zunpc.repository.productorepository.prodquery("");
			return res.json(new httpresponse(200,"ok",listproduct,""));
		}
		catch (error) {
			_useful.log('productocontroller.js').error('No se ha podido crear el producto',nick,error);
			return res.json(new httpresponse(500,"No se ha podido crear el producto",null,""));
		}
	},

	async EditarProducto(req,res){
		let nick = req.user.user;
		let { body } = req;
		let { idProd,descripcion, tipoProd, material, tipoMaterial, precio, activo, fotoprod1, fotoprod2, fotoprod3, cantDisponible, en_promosion, tiempoelavoracion, en_oferta} = body;
		
		//let act = activo.toString();
		if (idProd == undefined || descripcion == undefined || tipoProd == undefined || material == undefined || tipoMaterial == undefined 
			|| precio == undefined  || cantDisponible == undefined ) 
			return res.json(new httpresponse(500,"Error al editar un servicio: Elementos no definido",null,""));

		if ( tipoProd == "" || tipoProd == undefined || material == undefined
			|| material == ""  || tipoMaterial == undefined || tipoMaterial == ""  ) 
		return res.json(new httpresponse(500,"Error al editar un producto: Compruebe que los campos de tipo de producto, material y tipo de material esten llenos",null,""));
		try {
			
			let updateporducto = {
				idProd: idProd,
				descripcion: descripcion,
				tipoProd: tipoProd.value,
				material: material.value,
				tipoMaterial: tipoMaterial.value,
				precio:precio,
				activo: (activo == undefined)? 0:activo,
				fotoprod1:fotoprod1,
				fotoprod2: fotoprod2,
				fotoprod3: fotoprod3,
				cantDisponible: cantDisponible,
				en_promosion: (en_promosion == undefined)?false:en_promosion, 
				tiempoelavoracion: tiempoelavoracion, 
				en_oferta: (en_oferta == undefined)?false:en_oferta
			};
			let produc = await _database.zunpc.repository.productorepository.updateProducto(updateporducto);
			_useful.log('productocontroller.js').info('Se ha editado el producto',nick,JSON.stringify(produc));
			var listprod = await _database.zunpc.repository.productorepository.prodquery("");
			return res.json(new httpresponse(200,"Se ha editado el producto correctamente",listprod,""));
		} catch (error) {
			_useful.log('productocontroller.js').error('No se ha podido editar el producto',nick,error);
			return res.json(new httpresponse(500,"No se ha podido editar el producto",null,""));
		}
	},

	async eliminarProducto (req, res) {
		let nick = req.user.user;
		let { id } = req.params;
		try {
			let prod = await  _database.zunpc.repository.productorepository.GetProductoporid(id);
			if(!prod){
				return res.json(new httpresponse(500,"Ha ocurrido un error al intentar eliminar producto:Producto no encontrado.",null,""));
			}
			await _database.zunpc.repository.productorepository.deleteProducto(prod);
			_useful.log('productocontroller.js').info('Se ha eliminado el producto',nick,JSON.stringify(id));
			var listprod = _database.zunpc.repository.productorepository.prodquery("");
			return res.json(new httpresponse(200,"Se ha eliminado el producto",listprod,""));
		}
		catch (error) {
			_useful.log('productocontroller.js').error('Ha ocurrido un error al intentar eliminar producto',nick,error);
			return res.json(new httpresponse(500,"Ha ocurrido un error al intentar eliminar el producto.",null,""));
		}
	},


	async getDatosTipoProductoMaterialbyId(req, res){
		let nick = req.user.user;
		let { body } = req;
		let { idProd } = body;
		try {
			var tp = await _database.zunpc.repository.productorepository.GetDatosProductoporid(idProd);
			if(!tp ){
				return res.json(new httpresponse(500,"Ha ocurrido un error al obtener los datos:Producto no encontrado.",null,""));
			}
			let result = {
				selector1:{label:tp[0].nombreTP,value:tp[0].valueTP},
				selector2:{label:tp[0].nombreM,value:tp[0].valueM},
				selector3:{label:tp[0].nombreTM,value:tp[0].valueTM}
			};
			return res.json(new httpresponse(200,"ok",result,""));
		} catch (error) {
			_useful.log('productocontroller.js').error('Ha ocurrido un error al obtener los datos',nick,error);
			return res.json(new httpresponse(500,"Ha ocurrido un error al obtener los datos.",null,""));
		}
	}

	
};
