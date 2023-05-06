import * as React from "react";
import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";
import theme from "../../theme";
import { blue } from "@mui/material/colors";
import { LoginService } from "../../services/util/LoginService";

export default function Login() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState("");
    const loginService = new LoginService();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email") as string;
        const password = data.get("password") as string;

        try {
            await loginService.login(email, password);
        } catch (error: any) {
            setErrorMessage(error.response.data);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

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
                        justifyContent: "center",
                        minHeight: "75vh",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Já tem uma conta?
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoFocus
                            error={isError}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Senha"
                            type="password"
                            id="password"
                            error={isError}
                            helperText={errorMessage}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox value="remember" color="primary" />
                            }
                            label="Lembrar meus dados"
                        />
                        <Box sx={{ m: 1, position: "relative" }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={isLoading}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Acessar conta
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
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Esqueci minha senha
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Não tem uma conta? Inscrever-se"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
