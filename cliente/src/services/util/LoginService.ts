import axios from "axios";

export class LoginService {
    url = process.env.REACT_APP_URL_API;
    access_token = "";
    refresh_token = "";
    async login(email: string, senha: string) {
        const login = { email, senha };

        try {
            const res = await axios.post(
                `${this.url}/pessoa-gerenciamento/login`,
                login
            );
            localStorage.setItem(this.access_token, res.data.token);
            window.location.href = "/";
        } catch (error: any) {
            throw error;
        }
    }

    autenticado() {
        return this.getToken() != null;
    }

    sair() {
        localStorage.removeItem(this.access_token);
    }

    getToken() {
        return localStorage.getItem(this.access_token);
    }
}
