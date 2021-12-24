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
		let { descripcion, tipoProd, material, tipoMaterial, precio, activo, fotoprod1, fotoprod2, fotoprod3, cantDisponible } = body;
		//verifico q estan todas los  atributos de producto.
		//if ( !descripcion || !tipoProd || !material || !tipoMaterial || !precio || !activo || !fotoprod1 || !fotoprod2 || !fotoprod3 || !cantDisponible ) return res.json(new httpresponse(500,"Error al adicionar un producto: Compruebe que los campos esten llenos",null,""));
		try {
			//Busco si existe un producto en base datos 
			let dbproduc = await _database.zunpc.repository.productorepository.getByDescProd(descripcion);
			if ( dbproduc && dbproduc.descripcion === descripcion ) return res.json(new httpresponse(500,"Error al adicionar el producto: El producto ya existe.",null,""));

			let newprod = await _database.zunpc.repository.productorepository.addProducto(body);
			_useful.log('productocontroller.js').info('Se ha creado un producto nuevo.', req.user.nick, JSON.stringify(newprod));
			var listproduct = await _database.zunpc.repository.productorepository.listProd("");
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
		let { idProd,descripcion, tipoProd, material, tipoMaterial, precio, activo, fotoprod1, fotoprod2, fotoprod3, cantDisponible} = body;
		//let act = activo.toString();
		if (idProd == undefined || descripcion == undefined || tipoProd == undefined || material == undefined || tipoMaterial == undefined 
			|| precio == undefined  || activo == undefined || fotoprod1 == undefined || fotoprod2 == undefined || fotoprod3 == undefined 
			|| cantDisponible == undefined ) return res.json(new httpresponse(500,"Error al editar un servicio: Compruebe que los campos esten llenos",null,""));

			if(descripcion == "" || tipoProd == "" || precio == "") return res.json(new httpresponse(500,"Error al editar un servicio: Verifique q los campos obligatorios esten llenos",null,""));
		try {
			let produc = await _database.zunpc.repository.productorepository.updateProducto(body);
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

	
};
