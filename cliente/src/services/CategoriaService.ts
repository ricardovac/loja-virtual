import axios from "axios";

export type Categoria = {
    id: number
    nome: string
}

export class CategoriaService {
    url = process.env.REACT_APP_URL_API;

    async findAll() {
        return axios.get(this.url + '/categoria/')
            .then(res => res);
    }

    async create(objeto: Categoria) {
        return axios.post(this.url + "/categoria/", objeto)
            .then(res => res)
    }

    async edit(objeto: Categoria) {
        return axios.put(this.url + "/categoria/", objeto)
            .then(res => res)
    }

    async delete(id: number) {
        return axios.delete(this.url + "/categoria/" + id)
    }
}
