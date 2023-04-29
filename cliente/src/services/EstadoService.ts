import axios from "axios";

export type Estado = {
    id: number | undefined;
    nome: string;
    sigla: string;
};

export class EstadoService {
    url = process.env.REACT_APP_URL_API;

    async findAll() {
        return axios.get(this.url + "/estado/").then((res) => res);
    }

    async create(objeto: Estado) {
        return axios.post(this.url + "/estado/", objeto).then((res) => res);
    }

    async edit(objeto: Estado) {
        return axios.put(this.url + "/estado/", objeto).then((res) => res);
    }

    async delete(id: number) {
        return axios.delete(this.url + "/estado/" + id);
    }
}
