import axios from "axios";
import { ServiceBase } from "./ServiceBase";

export type Permissao = {
    id: number;
    nome: string;
};

export class PermissaoService extends ServiceBase {
    constructor() {
        super("permissao");
    }
}
