import axios from "axios";

export type Cidade = {
    id: number
    nome: string
}

export class CidadeService {
    url = process.env.REACT_APP_URL_API;

    async findAll() {
        return axios.get(this.url + '/cidade/')
            .then(res => res);
    }

    async create(objeto: Cidade) {
        return axios.post(this.url + "/cidade/", objeto)
            .then(res => res)
    }

    async edit(objeto: Cidade) {
        return axios.put(this.url + "/cidade/", objeto)
            .then(res => res)
    }

    async delete(id: number) {
        return axios.delete(this.url + "/cidade/" + id)
    }
}
