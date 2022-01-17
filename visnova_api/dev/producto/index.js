module.exports = {
	data: [
		{ idProd: 1, descripcion: "Pintura de buena calidad", tipoProd: 1, material: 2, tipoMaterial: 3, precio: 3.24, activo: 1, fotoprod1:null, fotoprod2: null, fotoprod3: null, cantDisponible: 40, en_promosion: 1, tiempoelavoracion: 6, en_oferta: 1 },
		{ idProd: 2, descripcion: "Pintura azul para coches", tipoProd: 1, material: 2, tipoMaterial: 4, precio: 2.5, activo: 1, fotoprod1:null, fotoprod2: null, fotoprod3: null, cantDisponible: 28, en_promosion: 1, tiempoelavoracion: 3, en_oferta: 1 },
		{ idProd: 3, descripcion: "Pintura para muebles y estanterias", tipoProd: 1, material: 2, tipoMaterial: 6, precio: 5.4, activo: 1, fotoprod1:null, fotoprod2: null, fotoprod3: null, cantDisponible: 14, en_promosion: 1, tiempoelavoracion: 15, en_oferta: 1 },
		{ idProd: 4, descripcion: "Producto de calidad A", tipoProd: 7, material: 11, tipoMaterial: 15, precio: 3, activo: 1, fotoprod1:null, fotoprod2: null, fotoprod3: null, cantDisponible: 32, en_promosion: 1, tiempoelavoracion: 20, en_oferta: 1 },
		{ idProd: 5, descripcion: "Producto de calidad B", tipoProd: 8, material: 12, tipoMaterial: 17, precio: 2.1, activo: 1, fotoprod1:null, fotoprod2: null, fotoprod3: null, cantDisponible: 8, en_promosion: 1, tiempoelavoracion: 10, en_oferta: 1 },
	],
	async create () {
		await _database.zunpc.model.producto.bulkCreate(this.data);
	},
};