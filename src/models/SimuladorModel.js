const mongoose = require('mongoose');

const SimuladorSchema = new mongoose.Schema({
    banco:{
        type:String,
        required:true
    },
    tabela:{
        type:String,
        required:true
    },
    operacao:{
        type:String,
        required:true
    },
    orgao:{
        type:String,
        required:true
    },
    fator:{
        type:Number,
        required:true
    },
    parcelas:{
        type:Number,
        required:true
    },
    data:{
        type:String,
        required:true
    }
    

})

module.exports = mongoose.model('Simulador', SimuladorSchema);