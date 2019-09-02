const express = require('express');
const routes = new express.Router();

const path = require('path');
const multer = require('multer');

const upload = multer({dest: path.resolve(__dirname,'..','..','tmp','csv')})

const SimuladorControl = require('../controllers/SimuladorControl');

routes.get('/', SimuladorControl.getAll);
routes.post('/cadastrar', SimuladorControl.postCadastro);
routes.post('/simular', SimuladorControl.postParcelas);
routes.post('/cadastrarcsv',upload.single('file') ,SimuladorControl.postCSV);
routes.put('/alterar/:_id', SimuladorControl.putAlterar);
routes.delete('/deletar/:_id', SimuladorControl.delete);
routes.delete('/deletarall',SimuladorControl.deleteAll);

module.exports = routes;