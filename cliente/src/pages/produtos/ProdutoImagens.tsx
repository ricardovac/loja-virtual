import * as React from "react";
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    IconButton,
    ImageList,
    ImageListItem,
} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import { ProdutoImagemService } from "../../services/ProdutoImagemService";
import { Produto, ProdutoService } from "../../services/ProdutoService";
import { useParams } from "react-router-dom";
import { Close } from "@mui/icons-material";

interface Imagem {
    dataAtualizacao: string;
    dataCriacao: string;
    id: number;
    imagem: any;
    nome: string;
    produto: Produto;
    tipo: string;
}

const ProdutoImagens = () => {
    const [imagem, setImagem] = useState<Imagem[]>([]);
    const [produto, setProduto] = useState<any>({});
    const produtoService = new ProdutoService();
    const produtoImagensService = new ProdutoImagemService();
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const res = await produtoService.findById(id);
            setProduto(res.data);
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            // Busca a imagem apartir do Id do produto
            if (produto.id) {
                const res = await produtoImagensService.buscandoImagem(
                    produto.id
                );
                setImagem(res.data);
            }
        };
        fetchData();
    }, [produto]);

    const uploadImagens = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        try {
            if (event.target.files) {
                await produtoImagensService.upload({
                    file: event.target.files[0],
                    idProduto: produto.id,
                });
            }
            event.stopPropagation();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeletarImagem = async (imagemId: number) => {
        if (!confirm(`Are you sure you want to delete it?`)) {
            return;
        }
        await produtoImagensService.deleteProduto(imagemId);
        const imagensAtualizadas = imagem.filter((img) => img.id !== imagemId);
        setImagem(imagensAtualizadas);
    };

    return (
        <>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === "light"
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: "100vh",
                    overflow: "auto",
                }}
            >
                <Toolbar />
                <Box
                    sx={{
                        display: "flex",
                        gap: "2rem",
                        alignItems: "center",
                        margin: "20px",
                    }}
                >
                    <Button variant="contained" component="label">
                        Selecione imagens
                        <input
                            type="file"
                            hidden
                            onChange={(e) => uploadImagens(e)}
                            accept="image/*"
                        />
                    </Button>
                    Imagens: <strong>{produto.nome}</strong>
                </Box>
                <Box
                    sx={{
                        gap: "2rem",
                    }}
                >
                    {imagem.length === 0 && <div></div>}
                    <ImageList
                        cols={3}
                        sx={{
                            margin: "20px",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(150px, 1fr))!important",
                        }}
                    >
                        {imagem.map((r, index) => (
                            <ImageListItem
                                key={index}
                                sx={{ height: "100% !important" }}
                            >
                                <img
                                    src={`data:image/png;base64,${r.imagem}`}
                                    loading="lazy"
                                    alt={"Imagem não encontrada"}
                                    style={{ width: 150, height: 150 }}
                                />
                                <IconButton
                                    sx={{
                                        color: "white",
                                        position: "absolute",
                                    }}
                                    onClick={() => handleDeletarImagem(r.id)}
                                >
                                    <Close />
                                </IconButton>
                            </ImageListItem>
                        ))}
                    </ImageList>
                    {/* {imagem.length > 0 && (
                        <Box>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                            >
                                {produto.nome}{" "}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Descrição: {produto.descricao}
                            </Typography>
                            <Typography
                                gutterBottom
                                variant="h6"
                                component="div"
                            >
                                R${produto.valor_venda}
                            </Typography>
                        </Box>
                    )} */}
                </Box>
            </Box>
        </>
    );
};

export default ProdutoImagens;
