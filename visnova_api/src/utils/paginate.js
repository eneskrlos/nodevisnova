const paginate = async (list = [], cantidad, pageSize, pageLimit) => {
    try {
        const limit = parseInt(pageLimit, 15) || 15;
        const page = parseInt(pageSize, 15) || 1;
        // create an options object
        let options = {
            inicio: getOffset(page, limit),
            fin: endIndex(page, limit),
        };

        // check if the search object is empty
        // if (Object.keys(search).length) {
        //     options = {options, ...search};
        // }

        // check if the order array is empty
        // if (order && order.length) {
        //     options['order'] = order;
        // }

        // take in the model, take in the options
        //let {count, rows} = await model.findAndCountAll(options);

        // check if the transform is a function and is not null
        // if (transform && typeof transform === 'function') {
        //    rows = transform(rows);
        // }
        const  rows = await obtenerRows(list,options);
        return {
            previousPage: getPreviousPage(page),
            currentPage: page,
            nextPage: getNextPage(page, limit, cantidad),
            total: cantidad,
            limit: limit,
            data: rows
        }
    } catch (error) {
        console.log(error);
    }
}

const getOffset = (page, limit) => {
    return (page - 1) * limit;
}
const endIndex = (page, limit) => {
    return page * limit;
} 
const getNextPage = (page, limit, total) => {
    if ((total/limit) > page) {
        return page + 1;
    }

    return null
}

const getPreviousPage = (page) => {
    if (page <= 1) {
        return null
    }
    return page - 1;
}

const obtenerRows = async (list,options) =>  {
    const rowstemp = [];
    let tem  =  list.slice(options.inicio,options.fin);
    for (let index = 0; index < tem.length; index++) {
        if(tem[index].dataValues != undefined){
            rowstemp.push(tem[index].dataValues);
        }else{
            rowstemp.push(tem[index]);
        }
    }
    return rowstemp;
}

module.exports = paginate;