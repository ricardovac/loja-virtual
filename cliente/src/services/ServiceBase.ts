import axios from "axios";
import { LoginService } from "./util/LoginService";

export class ServiceBase {
    url;

    constructor(urlBase: string) {
        this.url = urlBase + "/";
        this.inicializarAxios();
    }

    axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_URL_API,
    });

    inicializarAxios() {
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = new LoginService().getToken();
                const authRequestToken = token ? `Bearer ${token}` : "";
                config.headers!.Authorization = authRequestToken;
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    findAll() {
        return this.axiosInstance.get(this.url);
    }

    findById(id: string | undefined) {
        return this.axiosInstance.get(this.url + id);
    }

    create(objeto: any) {
        return this.axiosInstance.post(this.url, objeto);
    }

    edit(objeto: any) {
        return this.axiosInstance.put(this.url, objeto);
    }

    delete(id: number) {
        return this.axiosInstance.delete(this.url + id);
    }
}
