import axios from "axios";
import { ServiceBase } from "./ServiceBase";

export type Produto = {
    id: number;
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
};

export class ProdutoService extends ServiceBase {
    constructor() {
        super("produto");
    }
}
