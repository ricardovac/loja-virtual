import axios from "axios";
import { ServiceBase } from "./ServiceBase";

export type Pessoa = {
    id: number;
    nome: string;
    cidade: {
        id: number;
        nome: string;
    };
    cpf: string;
    email: string;
    endereco: string;
    cep: string;
    permissaoPessoas: any;
};

export class PessoaService extends ServiceBase {
    constructor() {
        super("pessoa");
    }
}
