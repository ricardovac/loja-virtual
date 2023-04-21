export type Produto = {
    id: string;
    nome: string;
    imagem: any;
    preco: number;
    categoria: string;
    status: boolean;
};

export const data: Produto[] = [
    {
        id: "1",
        nome: "Produto 1",
        imagem: "imagem1.jpg",
        preco: 10.99,
        categoria: "Categoria 1",
        status: true,
    },
    {
        id: "2",
        nome: "Produto 2",
        imagem: "imagem2.jpg",
        preco: 20.99,
        categoria: "Categoria 2",
        status: false,
    },
    {
        id: "3",
        nome: "Produto 3",
        imagem: "imagem3.jpg",
        preco: 30.99,
        categoria: "Categoria 1",
        status: true,
    },
    {
        id: "4",
        nome: "Produto 4",
        imagem: "imagem4.jpg",
        preco: 40.99,
        categoria: "Categoria 2",
        status: true,
    },
    {
        id: "5",
        nome: "Produto 5",
        imagem: "imagem5.jpg",
        preco: 50.99,
        categoria: "Categoria 1",
        status: false,
    },
    {
        id: "6",
        nome: "Produto 6",
        imagem: "imagem6.jpg",
        preco: 60.99,
        categoria: "Categoria 2",
        status: true,
    },
    {
        id: "7",
        nome: "Produto 7",
        imagem: "imagem7.jpg",
        preco: 70.99,
        categoria: "Categoria 1",
        status: false,
    },
    {
        id: "8",
        nome: "Produto 8",
        imagem: "imagem8.jpg",
        preco: 80.99,
        categoria: "Categoria 2",
        status: true,
    },
    {
        id: "9",
        nome: "Produto 9",
        imagem: "imagem9.jpg",
        preco: 90.99,
        categoria: "Categoria 1",
        status: true,
    },
    {
        id: "10",
        nome: "Produto 10",
        imagem: "imagem10.jpg",
        preco: 100.99,
        categoria: "Categoria 2",
        status: false,
    },
];

//50 us states array
export const states = [
    'Em estoque', 'Sem Estoque'
];