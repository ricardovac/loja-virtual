import * as React from "react";
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar,
} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import { ProdutoImagemService } from "../../services/ProdutoImagemService";
import { ProdutoService } from "../../services/ProdutoService";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Close } from "@mui/icons-material";

const ProdutoImagens = () => {
    const [imagem, setImagem] = useState<any>(null);
    const [produto, setProduto] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isRefetching, setIsRefetching] = useState(true);

    const produtoImagensService = new ProdutoImagemService();
    const produtoService = new ProdutoService();
    let params = useParams();

    const fetchData = () => {
        setIsLoading(true);
        setIsRefetching(true);
        try {
            produtoService.findById(params.id).then((result) => {
                setProduto(result.data);
            });
        } catch (e) {
            console.error(e);
            return;
        }
        setIsLoading(false);
        setIsRefetching(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const uploadImagens = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            produtoImagensService
                .upload({ file: event.target.files[0], idProduto: produto.id })
                .then((data) => {
                    setImagem(null);
                });
        }
        event.stopPropagation();
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
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: "20px",
                    }}
                >
                    <Typography fontSize={18}>{produto.nome}</Typography>
                    <Button variant="contained" component="label">
                        Selecione imagens
                        <input
                            type="file"
                            hidden
                            onChange={(e) => uploadImagens(e)}
                            accept="image/*"
                        />
                    </Button>
                </Box>
                <ImageList
                    sx={{ width: 500, height: 450, margin: "20px" }}
                    cols={3}
                    rowHeight={164}
                >
                    <ImageListItem>
                        <img
                            src={`data:image/png;base64,${produto.arquivo}`}
                            loading="lazy"
                            alt={""}
                        />
                        <IconButton
                            sx={{
                                color: "white",
                                position: "absolute",
                            }}
                        >
                            <Close />
                        </IconButton>
                    </ImageListItem>
                </ImageList>
            </Box>
        </>
    );
};

export default ProdutoImagens;
