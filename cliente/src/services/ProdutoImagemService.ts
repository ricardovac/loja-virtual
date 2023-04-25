import axios from "axios";

export interface produtoImagens {
    idProduto: string,
    file: File | any,
    nome: string,
    nomeProduto: string;
}

export class ProdutoImagemService {
    url = process.env.REACT_APP_URL_API;

    async findAll() {
        return axios.get(this.url + '/produtoImagens/')
            .then(res => res);
    }

    async upload(objeto: produtoImagens) {
        const formData = new FormData()
        formData.append('idProduto', objeto.idProduto)
        formData.append('file', objeto.file)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        return axios.post(this.url + "/produtoImagens/", formData, config)
            .then(res => res)
    }

    async findProduto(idProduto: number) {
        return axios.get(this.url + "/produto/" + idProduto);
    }

    async deleteProduto(idProduto: string | undefined | number) {
        return axios.delete(this.url + "/produto/" + idProduto);
    }
}
