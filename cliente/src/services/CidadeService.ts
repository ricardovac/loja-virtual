import axios from "axios";
import { Estado } from "./EstadoService";
import { ServiceBase } from "./ServiceBase";

export type Cidade = {
    id: number;
    nome: string;
    estado: Estado;
};

export class CidadeService extends ServiceBase {
    constructor() {
        super("cidade");
    }
}
