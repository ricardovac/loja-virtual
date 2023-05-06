import axios from "axios";
import { ServiceBase } from "./ServiceBase";

export type Categoria = {
    id: number;
    nome: string;
};

export class CategoriaService extends ServiceBase {
    constructor() {
        super("categoria");
    }
}
