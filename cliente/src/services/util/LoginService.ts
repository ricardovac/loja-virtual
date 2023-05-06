import axios from "axios";

export class LoginService {
    url = process.env.REACT_APP_URL_API;
    CHAVE_TOKEN = "";
    async login(email: string, senha: string) {
        const login = { email, senha };

        try {
            const res = await axios.post(
                `${this.url}/pessoa-gerenciamento/login`,
                login
            );
            localStorage.setItem(this.CHAVE_TOKEN, res.data.token);
            window.location.href = "/";
        } catch (error: any) {
            throw error;
        }
    }

    autenticado() {
        return this.getToken() != null;
    }

    sair() {
        localStorage.removeItem(this.CHAVE_TOKEN);
    }

    getToken() {
        return localStorage.getItem(this.CHAVE_TOKEN);
    }
}
