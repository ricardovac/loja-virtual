import axios from "axios";
import { ServiceBase } from "./ServiceBase";

export interface IProdutoImagens {
  idProduto: string;
  file: File | any;
}

export class ProdutoImagemService extends ServiceBase {
  constructor() {
    super("produtoImagens");
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

    return this.axiosInstance.post(this.url, formData, config).then((res) => res);
  }

  async buscandoImagem(idProduto: number) {
    return this.axiosInstance.get(this.url + "produto/" + idProduto).then((res) => res);
  }

  async deleteProduto(idProduto: string | undefined | number) {
    return this.axiosInstance.delete(this.url + idProduto);
  }
}
