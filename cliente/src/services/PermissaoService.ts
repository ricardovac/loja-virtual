import axios from "axios";

export type Permissao = {
    id: number
    nome: string
}

export class PermissaoService {
    url = process.env.REACT_APP_URL_API;

    async findAll() {
        return axios.get(this.url + '/permissao/')
            .then(res => res);
    }

    async create(objeto: Permissao) {
        return axios.post(this.url + "/permissao/", objeto)
            .then(res => res)
    }

    async edit(objeto: Permissao) {
        return axios.put(this.url + "/permissao/", objeto)
            .then(res => res)
    }

    async delete(id: number) {
        return axios.delete(this.url + "/permissao/" + id)
    }
}
