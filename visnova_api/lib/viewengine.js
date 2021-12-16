const swig = require('swig-templates');
const fs = require('fs');

module.exports = class ViewEngine {

    constructor(rootpath){
        this.rootpath = rootpath;
        swig.setDefaults({ cache: false });
    }

    renderFile(file, data){
        try{
            file = this.rootpath + '/src/server/views/' + file;
            data = (!data) ? {} : data;
            return swig.render(fs.readFileSync(file,'utf-8'), { locals: data, filename: Date.now().toString()});
        }
        catch (error) {
            console.log('\x1b[31m[ERROR]\x1b[0m - %s', 'File to render not found. Path: ' + file + ' ' + error.stack);
            _logs.logger('viewengine.js').error('File to render not found. Path: ' + file + ' ' + error.stack);
            return "Error!! file not found";
        }
    };

};