const Simulador = require('../models/SimuladorModel');
const csv = require('csv-parser');
const fs = require('fs');
const Dirpath = require('path');
const format = require('date-fns/format')

module.exports={

    

    //Trazer todos os registros da tabela//
    async getAll(req, res){
        try{
            const simulacoes = await Simulador.find();
                return res.json(simulacoes)
        }
        catch(e){
            return res.status(404).send(`${e} Não foi Encontrado`);
        }
    },

    //Cadastrar dados nas tabelas//
    async postCadastro(req, res){

        const {banco, tabela, operacao, orgao, fator, parcelas, data} = req.body

        try{
            const cadastro = await Simulador.create({
                banco,
                tabela,
                operacao,
                orgao,
                fator,
                parcelas,
                data
            })
                return res.json(cadastro);
        }
        catch(e){
            return res.status(404).send(`${e} Verifique os dados digitados`);
        }
    },

    //Alterar dados da tabela//

    async putAlterar(req,res){
        const {_id} = req.params;
       
        try{
            const alterado = await Simulador.findByIdAndUpdate(_id, req.body, {new:true});
                return res.json(alterado);
        }
        catch(e){
            return res.status(404).send(`${e} Verifique os dados digitados`);
        }
    },

    //Deletar Dados da tabela//

    async delete(req,res){
        const {_id} = req.params;
        try{
            await Simulador.findByIdAndDelete(_id);
                return res.json({deletado:true})
        }
        catch(e){
            return res.status(404).send(`${e} Item nao encontrado`);
        }
    },

    //simular Parcelas Pela margem //

    async postParcelas(req,res){
            //recebe do form do fron-end via body//
        const{margem, orgao} = req.body;

            //pega o dia atual do servidor//
        const diaAtual = await format(new Date(), 'dd');
      
        // console.log(diaAtual);

        try{                                            //filtra pelo orgao e o dia atual//
            const ResultOrgao = await Simulador.find({'orgao':orgao, 'data':diaAtual});
                                            //mapeia o resultado e gera um novo array com a resposta//
                const resultadoFinal =  await ResultOrgao.map(resultado =>(
                   {
                       id:resultado._id,
                       banco:resultado.banco,
                       parcelas:resultado.parcelas,
                       valor:margem/resultado.fator

                    }

               ))
                    return res.json(resultadoFinal);

        }
        catch(e){
            return res.status(404).send(`${e} favor verifique os dados digitados`);
        }
    },

    //upload de CSV de tabelas de fator //

   postCSV(req,res){

    //pega o csv do input file //
        const {path, filename} = req.file
        

        try{
           //le o input file //
            fs.createReadStream(path)
            .pipe(csv())
            .on('data', (row) => {
                //recebe as linhas da tabela como parametro e insere no banco //
                //CSV precisa ser separado por virgula, com o titulo da tabela na primeira linha //
                Simulador.create(row)
              
            })
            .on('end', () => {
               // console.log('CSV file successfully processed')
           
                   //remove o csv da pasta temporaria //
               fs.unlinkSync(Dirpath.resolve(__dirname,'..','..','tmp','csv',filename))
              

               res.json({cadastrado:true});
              
            })
            

            
        }
        catch(e){
            return res.status(404).send(`${e} Verifique o arquivo csv`);
        }

    },

    async deleteAll(req,res){

        try{
            await Simulador.deleteMany();
            res.json({deletado:true});
        }
        catch(e){
            return res.status(404).send(`${e} houve um erro ao tentar deletar`);
        }

    }


}