import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, ImageList, ImageListItem} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import {ProdutoImagemService} from "../../services/ProdutoImagemService";
import {ProdutoService} from "../../services/ProdutoService";
import {useParams} from "react-router-dom";
import Typography from "@mui/material/Typography";

const ProdutoImagens = () => {
    const [objetos, setObjetos] = useState<any>(null);
    const [produto, setProduto] = useState<any>({});

    const produtoImagensService = new ProdutoImagemService()
    const produtoService = new ProdutoService();
    let params = useParams();

    useEffect(() => {
        if (objetos == null) {
            produtoService.findById(params.id).then((result) => {
                setProduto(result.data);
                // Apenas o id do produto para buscar
                buscarPorProduto(result.data.id);
            });
        }
    }, [objetos]);

    const buscarPorProduto = (idProduto: number) => {
        produtoImagensService.buscarPorProduto(idProduto).then((result) => {
            setObjetos(result.data);
        });
    };

    const uploadImagens = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            produtoImagensService.upload({file: event.target.files[0], idProduto: produto.id}).then((data) => {
                console.log("imagem criada")
                setObjetos(null);
            });
        }
        event.stopPropagation()
    };

    return (
        <>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar/>
                <Box sx={{display: "flex", gap: "2rem"}}>
                    <input type="file" onChange={(e) => uploadImagens(e)}
                           accept="image/*"/>
                    <Typography variant="h3" component="h3">
                        {produto.nome}
                    </Typography>
                </Box>
                <ImageList sx={{width: 500, height: 450}} cols={3} rowHeight={164}>
                    <ImageListItem>
                        <img src={""} alt={""}/>
                    </ImageListItem>
                </ImageList>
            </Box>
        </>
    );
};

export default ProdutoImagens;
