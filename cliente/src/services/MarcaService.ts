import axios from "axios";
import { ServiceBase } from "./ServiceBase";

export type Marca = {
    id: number
    nome: string
}

export class MarcaService extends ServiceBase{
    constructor() {
        super("marca")
    }
}
