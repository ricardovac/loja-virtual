import axios from "axios";

export type Produto = {
    id: string;
    nome: string;
    descricao: string;
    valor_venda: number;
    categoria: {
        id: number;
        nome: string;
    };
    marca: {
        id: number;
        nome: string;
    };
    status: boolean;
};

export class ProdutoService {
    url = process.env.REACT_APP_URL_API;

    async findAll() {
        return axios.get(this.url + '/produto/')
            .then(res => res);
    }

    async create(objeto: Produto) {
        return axios.post(this.url + "/produto/", objeto)
            .then(res => res)
    }

    async edit(objeto: Produto) {
        return axios.put(this.url + "/produto/", objeto)
            .then(res => res)
    }

    async delete(id: number) {
        return axios.delete(this.url + "/produto/" + id)
    }
}
