import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Tooltip,
} from "@mui/material";
import MaterialReactTable, {
    MaterialReactTableProps,
    type MRT_Cell,
    type MRT_ColumnDef,
    type MRT_Row,
} from "material-react-table";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Image from "@mui/icons-material/Image";
import { Produto, ProdutoService } from "../../services/ProdutoService";
import Toolbar from "@mui/material/Toolbar";
import { Categoria, CategoriaService } from "../../services/CategoriaService";
import { Marca, MarcaService } from "../../services/MarcaService";
import Categorias from "./Categorias";
import Marcas from "./Marcas";
import Link from "@mui/material/Link";

// FIX: Fazer a selection box para a edição de produtos.
// FIX: re-render na categoria e marca na criação de produtos.
const Produtos = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [todosProdutos, setTodosProdutos] = useState<Produto[]>([]);
    const [todasCategorias, setTodasCategorias] = useState<Categoria[]>([]);
    const [todasMarcas, setTodasMarcas] = useState<Marca[]>([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMarca, setSelectedMarca] = useState("");
    const [selectedCategoria, setSelectedCategoria] = useState("");
    const [isRefetching, setIsRefetching] = useState(true);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});
    const produtoService = new ProdutoService();
    const marcaService = new MarcaService();
    const categoriaService = new CategoriaService();

    const fetchData = () => {
        try {
            produtoService.findAll().then((r) => setTodosProdutos(r.data));
            marcaService.findAll().then((r) => setTodasMarcas(r.data));
            categoriaService.findAll().then((r) => setTodasCategorias(r.data));
        } catch (e) {
            setIsError(true);
            console.error(e);
            return;
        }
        setIsError(false);
        setIsLoading(false);
        setIsRefetching(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCriarProduto = async (values: Produto) => {
        try {
            const response = await produtoService.create(values);
            if (response.status === 200) {
                setTodosProdutos([...todosProdutos, response.data]); // add newly created Produto to the todosProdutos array
            }
        } catch (error) {
            console.error(error);
        } finally {
            setCreateModalOpen(false); // close the create modal
            window.location.reload();
        }
    };

    const handleEditarProduto: MaterialReactTableProps<Produto>["onEditingRowSave"] =
        async ({ exitEditingMode, row, values }) => {
            if (!Object.keys(validationErrors).length) {
                const updatedProduto: Produto = {
                    id: row.original.id,
                    nome: values.nome,
                    descricao: values.descricao,
                    valor_venda: values.valor_venda,
                    categoria: {
                        id: Number(selectedCategoria),
                        nome: "",
                    },
                    marca: {
                        id: Number(selectedMarca),
                        nome: "",
                    },
                };
                const response = await produtoService.edit(updatedProduto);
                todosProdutos[row.index] = response.data; // update edited Produto in todosProdutos array
                setTodosProdutos([...todosProdutos]); // trigger a re-render by updating todosProdutos state
                exitEditingMode(); // exit editing mode and close modal
            }
        };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };

    const handleDeletarProduto = useCallback(
        async (row: MRT_Row<Produto>) => {
            if (
                !confirm(
                    `Tem certeza que deseja deletar ${row.getValue("nome")}`
                )
            ) {
                return;
            }
            //send api delete request here, then refetch or update local table data for re-render
            const response = await produtoService.delete(row.getValue("id"));
            if (response.status === 200) {
                setTodosProdutos(
                    todosProdutos.filter((p) => p.id !== row.getValue("id"))
                ); // remove deleted Produto from todosProdutos array
            }
        },
        [todosProdutos]
    );

    const getCommonEditTextFieldProps = useCallback(
        (
            cell: MRT_Cell<Produto>
        ): MRT_ColumnDef<Produto>["muiTableBodyCellEditTextFieldProps"] => {
            return {
                error: !!validationErrors[cell.id],
                helperText: validationErrors[cell.id],
                onBlur: (event: any) => {
                    const isValid =
                        cell.column.id === "preco"
                            ? validatePreco(event.target.value)
                            : cell.column.id === "nome"
                            ? validateNome(event.target.value)
                            : validateRequired(event.target.value);
                    if (!isValid) {
                        //set validation error for cell if invalid
                        setValidationErrors({
                            ...validationErrors,
                            [cell.id]: `${cell.column.columnDef.header} é obrigatório`,
                        });
                    } else {
                        //remove validation error for cell if valid
                        delete validationErrors[cell.id];
                        setValidationErrors({
                            ...validationErrors,
                        });
                    }
                },
            };
        },
        [validationErrors]
    );

    const columns = useMemo<MRT_ColumnDef<Produto>[]>(
        () => [
            {
                accessorKey: "id",
                header: "ID",
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: false,
                size: 80,
            },
            {
                accessorKey: "nome",
                header: "Nome",
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }: any) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: "descricao",
                header: "Descrição",
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }: any) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: "valor_venda",
                header: "Preço",
                muiTableBodyCellEditTextFieldProps: ({ cell }: any) => ({
                    ...getCommonEditTextFieldProps(cell),
                    type: "number",
                }),
            },
            {
                accessorKey: "categoria.nome",
                header: "Categoria",
                muiTableBodyCellEditTextFieldProps: {
                    select: true, //change to select for a dropdown
                    onBlur: (e) => {
                        setSelectedCategoria(e.target.value);
                    },
                    children: todasCategorias.map((categoria) => (
                        <MenuItem key={categoria.id} value={categoria.id}>
                            {categoria.nome}
                        </MenuItem>
                    )),
                },
            },
            {
                accessorKey: "marca.nome",
                header: "Marca",
                muiTableBodyCellEditTextFieldProps: {
                    select: true, //change to select for a dropdown
                    onBlur: (e) => {
                        setSelectedMarca(e.target.value);
                    },
                    children: todasMarcas.map((marca) => (
                        <MenuItem key={marca.id} value={marca.id}>
                            {marca.nome}
                        </MenuItem>
                    )),
                },
            },
        ],
        [getCommonEditTextFieldProps, todasCategorias, todasMarcas]
    );

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
                <MaterialReactTable
                    displayColumnDefOptions={{
                        "mrt-row-actions": {
                            muiTableHeadCellProps: {
                                align: "center",
                            },
                            size: 120,
                        },
                    }}
                    columns={columns}
                    data={todosProdutos}
                    editingMode="modal" //default
                    enableEditing
                    onEditingRowSave={handleEditarProduto}
                    muiToolbarAlertBannerProps={
                        isError
                            ? {
                                  color: "error",
                                  children: "Error loading data",
                              }
                            : undefined
                    }
                    onEditingRowCancel={handleCancelRowEdits}
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: "flex", gap: "1rem" }}>
                            <Tooltip arrow placement="left" title="Editar">
                                <IconButton
                                    onClick={() => table.setEditingRow(row)}
                                >
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="right" title="Deletar">
                                <IconButton
                                    color="error"
                                    onClick={() => handleDeletarProduto(row)}
                                >
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="right" title="Imagem">
                                <Link href={`/imagens/${row.getValue("id")}`}>
                                    <IconButton color="info">
                                        <Image />
                                    </IconButton>
                                </Link>
                            </Tooltip>
                        </Box>
                    )}
                    renderTopToolbarCustomActions={() => (
                        <Button
                            color="secondary"
                            onClick={() => setCreateModalOpen(true)}
                            variant="contained"
                        >
                            Adicionar Produto
                        </Button>
                    )}
                    state={{
                        isLoading,
                        showAlertBanner: isError,
                        showProgressBars: isRefetching,
                    }}
                />
                <Box sx={{ display: "flex", gap: "2rem" }}>
                    <Categorias />
                    <Marcas />
                </Box>
                <ModalCriarProduto
                    columns={columns}
                    open={createModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    onSubmit={handleCriarProduto}
                />
            </Box>
        </>
    );
};

interface CreateModalProps {
    columns: MRT_ColumnDef<Produto>[];
    onClose: () => void;
    onSubmit: (values: Produto) => void;
    open: boolean;
}

export const ModalCriarProduto = ({
    open,
    columns,
    onClose,
    onSubmit,
}: CreateModalProps) => {
    const [values, setValues] = useState<any>(() =>
        columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ""] = "";
            return acc;
        }, {} as any)
    );
    const [selectedCategoria, setSelectedCategoria] = useState("");
    const [selectedMarca, setSelectedMarca] = useState("");
    const [todasCategorias, setTodasCategorias] = useState<Categoria[]>([]);
    const [todasMarcas, setTodasMarcas] = useState<Marca[]>([]);
    const categoriaService = new CategoriaService();
    const marcaService = new MarcaService();

    useEffect(() => {
        marcaService.findAll().then((r) => setTodasMarcas(r.data));
        categoriaService.findAll().then((r) => setTodasCategorias(r.data));
    }, []);

    const handleSubmit = () => {
        const valuesWithSelections = {
            ...values,
            categoria: { id: selectedCategoria },
            marca: { id: selectedMarca },
        };
        onSubmit(valuesWithSelections);
        onClose();
    };

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Adicionar Produto</DialogTitle>
            <DialogContent>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Stack
                        sx={{
                            width: "100%",
                            minWidth: { xs: "300px", sm: "360px", md: "400px" },
                            gap: "1.5rem",
                        }}
                    >
                        {columns.map((column) =>
                            column.accessorKey === "categoria.nome" ? (
                                <FormControl fullWidth key={column.accessorKey}>
                                    <InputLabel id="categoriaLabel">
                                        Categoria
                                    </InputLabel>
                                    <Select
                                        labelId="categoriaLabel"
                                        id="label"
                                        value={selectedCategoria}
                                        label="Categoria"
                                        onChange={(event) =>
                                            setSelectedCategoria(
                                                event.target.value
                                            )
                                        }
                                    >
                                        {todasCategorias.map((categoria) => (
                                            <MenuItem
                                                value={categoria.id}
                                                key={categoria.id}
                                            >
                                                {categoria.nome}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : column.accessorKey === "marca.nome" ? (
                                <FormControl fullWidth key={column.accessorKey}>
                                    <InputLabel id="marcaLabel">
                                        Marca
                                    </InputLabel>
                                    <Select
                                        labelId="marcaLabel"
                                        id="marca"
                                        value={selectedMarca}
                                        label="Marca"
                                        onChange={(event) =>
                                            setSelectedMarca(event.target.value)
                                        }
                                    >
                                        {todasMarcas.map((marca) => (
                                            <MenuItem
                                                value={marca.id}
                                                key={marca.id}
                                            >
                                                {marca.nome}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : (
                                <TextField
                                    key={column.accessorKey}
                                    label={column.header}
                                    minRows={0}
                                    name={column.accessorKey}
                                    InputProps={
                                        column.accessorKey === "valor_venda"
                                            ? {
                                                  startAdornment: (
                                                      <InputAdornment position="start">
                                                          $
                                                      </InputAdornment>
                                                  ),
                                              }
                                            : {}
                                    }
                                    type={
                                        column.accessorKey === "valor_venda"
                                            ? "number"
                                            : "text"
                                    }
                                    onChange={(e) =>
                                        setValues({
                                            ...values,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                    onKeyPress={(e) => {
                                        if (
                                            column.accessorKey === "valor_venda"
                                        ) {
                                            const inputChar =
                                                String.fromCharCode(e.charCode);
                                            if (!/^\d+$/.test(inputChar)) {
                                                // check if keystroke is a numeric character
                                                e.preventDefault(); // prevent the keystroke from being entered
                                            }
                                        }
                                    }}
                                    disabled={column.accessorKey === "id"}
                                />
                            )
                        )}
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{ p: "1.25rem" }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    color="secondary"
                    onClick={handleSubmit}
                    variant="contained"
                >
                    Adicionar Produto
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const validateRequired = (value: string) => !!value.length;
const validatePreco = (preco: number) => preco > 0;
const validateNome = (nome: string) => nome.length >= 3 && nome.length <= 20;

export default Produtos;
