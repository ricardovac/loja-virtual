import * as React from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  Snackbar,
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
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const produtoService = new ProdutoService();
  const produtoImagensService = new ProdutoImagemService();
  const { id } = useParams();

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const res = await produtoService.findById(id);
      setProduto(res.data);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    setIsLoading(true);
    // Busca a imagem apartir do Id do produto
    const fetchData = async () => {
      if (!isUploading && produto.id) {
        const res = await produtoImagensService
          .buscandoImagem(produto.id)
          .finally(() => setIsLoading(false));
        setImagem(res.data);
      }
    };
    fetchData();
  }, [produto, isUploading]);

  const handleUploadImagens = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      let files = event.target.files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          await produtoImagensService.upload({
            file: files[i],
            idProduto: produto.id,
          });
        }
      }
      setOpenModal(true);
      setIsUploading(false);
      event.stopPropagation();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenModal(false);
  };

  const handleDeletarImagem = async (imagemId: number) => {
    if (!confirm(`Tem certeza de que deseja excluir?`)) {
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
            theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Snackbar open={openModal} autoHideDuration={6000} onClose={handleCloseModal}>
          <Alert onClose={handleCloseModal} severity="info" sx={{ width: "100%" }}>
            Imagem criada com sucesso!
          </Alert>
        </Snackbar>
        <Toolbar />
        <Box
          sx={{
            display: "flex",
            gap: "2rem",
            alignItems: "center",
            margin: "20px",
          }}
        >
          <Button variant="contained" component="label" disabled={isLoading}>
            Selecione imagens
            <input
              type="file"
              hidden
              onChange={(e) => handleUploadImagens(e)}
              accept="image/*"
              multiple
            />
          </Button>
          Imagens: <strong>{produto.nome}</strong>
        </Box>
        {isLoading ? (
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "60vh" }}
          >
            <Grid item xs={3}>
              <CircularProgress />
            </Grid>
          </Grid>
        ) : (
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
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))!important",
              }}
            >
              {imagem.map((r, index) => (
                <ImageListItem key={index} sx={{ height: "100% !important" }}>
                  <img
                    src={`data:image/png;base64,${r.imagem}`}
                    loading="lazy"
                    alt={"Imagem não encontrada"}
                    style={{
                      width: 150,
                      height: 150,
                      borderRadius: "8px",
                    }}
                  />
                  <IconButton
                    sx={{
                      color: "black",
                      position: "absolute",
                    }}
                    onClick={() => handleDeletarImagem(r.id)}
                  >
                    <Close />
                  </IconButton>
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        )}
      </Box>
    </>
  );
};

export default ProdutoImagens;
