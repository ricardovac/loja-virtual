import axios from "axios";

export type Marca = {
    id: number
    nome: string
}

export class MarcaService {
    url = process.env.REACT_APP_URL_API;

    async findAll() {
        return axios.get(this.url + '/marca/')
            .then(res => res);
    }

    async create(objeto: Marca) {
        return axios.post(this.url + "/marca/", objeto)
            .then(res => res)
    }

    async edit(objeto: Marca) {
        return axios.put(this.url + "/marca/", objeto)
            .then(res => res)
    }

    async delete(id: number) {
        return axios.delete(this.url + "/marca/" + id)
    }
}
