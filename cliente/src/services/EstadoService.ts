import axios from "axios";
import { ServiceBase } from "./ServiceBase";

export type Estado = {
    id: number | undefined;
    nome: string;
    sigla: string;
};

export class EstadoService extends ServiceBase {
    constructor() {
        super("estado");
    }
}
