import axios from "axios";

export interface IProdutoImagens {
    idProduto: string;
    file: File | any;
}

export class ProdutoImagemService {
    url = process.env.REACT_APP_URL_API;

    async findAll() {
        return axios.get(this.url + "/produtoImagens/").then((res) => res);
    }

    async upload(objeto: IProdutoImagens) {
        const formData = new FormData();
        formData.append("idProduto", objeto.idProduto);
        formData.append("file", objeto.file);
        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };

        return axios
            .post(this.url + "/produtoImagens/", formData, config)
            .then((res) => res);
    }

    async buscandoImagem(idProduto: number) {
        return axios
            .get(this.url + "/produtoImagens/produto/" + idProduto)
            .then((res) => res);
    }

    async deleteProduto(idProduto: string | undefined | number) {
        return axios.delete(this.url + "/produtoImagens/" + idProduto);
    }
}
