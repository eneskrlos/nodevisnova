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
const pag = require('../../utils/paginate');

exports.homecontroller = {

	async indexhome(req,res){
		let { body } = req;
		try {
			//_useful.log('homecontroller.js').info('El servicio esta iniciado','', "");
			//const arrEndPoint = {"endpoint1": "home", "endpoint2": "Listarproductos"};
			return res.json(new httpresponse(200,"El servicio esta iniciado"));
		} catch (error) {
			_useful.log('homecontroller.js').error('No se pudo iniciar el servicio','',error);
			return res.json(new httpresponse(500,"No se pudo iniciar el servicio por la siguiente razon :" + error));
		}
	},
};
