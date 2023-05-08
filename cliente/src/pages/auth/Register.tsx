import * as React from "react";
import Avatar from "@mui/material/Avatar";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme";
import { RegistrarService } from "../../services/util/RegistrarService";
import { CircularProgress } from "@mui/material";
import InputMask from "react-input-mask";
import { blue } from "@mui/material/colors";

const formFields = [
  { name: "nome", label: "Nome" },
  { name: "email", label: "Email" },
  { name: "cpf", label: "CPF" },
  { name: "cep", label: "CEP" },
  { name: "endereco", label: "Endereço" },
  { name: "cidade", label: "Cidade" },
];

interface IValidacao {
  campo: string;
  mensagem: string;
}

export default function Register() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [erroValidacao, setErroValidacao] = useState<IValidacao[]>([]);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    endereco: "",
    cep: "",
    cidade: "",
  });
  const registrarService = new RegistrarService();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await registrarService.registrar(formData);
    } catch (error: any) {
      setErroValidacao(error.response.data.erros);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  function handleFormChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  useEffect(() => {
    document.body.style.cursor = isLoading ? "wait" : "default";
  }, [isLoading]);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Criar minha conta
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
              {formFields.map((field, index) => (
                <Grid
                  item
                  xs={12}
                  sm={field.name === "cep" || field.name === "endereco" ? 6 : 12}
                  key={index}
                >
                  <InputMask
                    mask={
                      field.name === "cpf"
                        ? "999.999.999-99"
                        : field.name === "cep"
                        ? "99999-999"
                        : ""
                    }
                    maskChar=" "
                    onChange={handleFormChange}
                    key={index}
                  >
                    {() => (
                      <TextField
                        required
                        fullWidth
                        onChange={handleFormChange}
                        label={field.label}
                        name={field.name}
                        id={field.name}
                        error={isError && erroValidacao?.some((erro) => erro.campo === field.name)}
                        helperText={
                          erroValidacao?.find((erro) => erro.campo === field.name)?.mensagem
                        }
                      />
                    )}
                  </InputMask>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ m: 1, position: "relative" }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
              >
                Criar conta
              </Button>
              {isLoading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: blue[500],
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              )}
            </Box>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Já possui uma conta? Entrar
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
