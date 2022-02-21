module.exports = {

	data: [
		//---por ahora solo la habana
		{ idprov: 1, nombre: "La Habana" }
		//----------------------------------
		/* { idprov: 1, nombre: "Pinar del Rio" },
		{ idprov: 2, nombre: "Artiemisa" },
		{ idprov: 3, nombre: "La Habana" },
		{ idprov: 4, nombre: "Mayabeque" },
		{ idprov: 5, nombre: "Matanzas" },
		{ idprov: 6, nombre: "Cienfuegos" },
		{ idprov: 7, nombre: "Villa Clara" },
		{ idprov: 8, nombre: "Sancti Spíritus" },
		{ idprov: 9, nombre: "Ciego de Ávila" },
		{ idprov: 10, nombre: "Camagüey" },
		{ idprov: 11, nombre: "Las Tunas" },
		{ idprov: 12, nombre: "Holguín" },
		{ idprov: 13, nombre: "Granma" },
		{ idprov: 14, nombre: "Santiago de Cuba" },
		{ idprov: 15, nombre: "Guantánamo" },
		{ idprov: 16, nombre: "Isla de la Juventud" } */
	],

	async create () {
		await _database.zunpc.model.provincia.bulkCreate(this.data);
	},
};