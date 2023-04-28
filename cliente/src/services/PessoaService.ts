import axios from "axios";

export type Pessoa = {
    id: number
    nome: string
    cidade: {
        nome: string
    }
    cpf: string
    email: string
    endereco: string
    cep: string
    permissaoPessoas: [{
        permissao: {
            id: number
            nome: string
        }
    }]
}

export class PessoaService {
    url = process.env.REACT_APP_URL_API;

    async findAll() {
        return axios.get(this.url + '/pessoa/')
            .then(res => res);
    }

    async create(objeto: Pessoa) {
        return axios.post(this.url + "/pessoa/", objeto)
            .then(res => res)
    }

    async edit(objeto: Pessoa) {
        return axios.put(this.url + "/pessoa/", objeto)
            .then(res => res)
    }

    async delete(id: number) {
        return axios.delete(this.url + "/pessoa/" + id)
    }
}
