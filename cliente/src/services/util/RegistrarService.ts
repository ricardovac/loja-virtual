import axios from "axios";

export class RegistrarService {
    url = process.env.REACT_APP_URL_API;
    async registrar(formData: {
        nome: string;
        cpf: string;
        email: string;
        endereco: string;
        cep: string;
        cidade: string;
    }) {
        const { nome, cpf, email, endereco, cep, cidade } = formData;
        const registro = { nome, cpf, email, endereco, cep, cidade };

        try {
            const res = await axios.post(`${this.url}/cliente/`, registro);
            window.location.href = "/login";
        } catch (error: any) {
            throw error;
        }
    }
}
