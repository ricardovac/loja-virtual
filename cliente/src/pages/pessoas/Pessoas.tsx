import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import MaterialReactTable, {
    type MaterialReactTableProps,
    type MRT_Cell,
    type MRT_ColumnDef,
    type MRT_Row,
} from "material-react-table";
import { Delete, Edit } from "@mui/icons-material";
import Toolbar from "@mui/material/Toolbar";
import { Pessoa, PessoaService } from "../../services/PessoaService";
import {
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
} from "@mui/material";
import { Cidade, CidadeService } from "../../services/CidadeService";
import InputMask from "react-input-mask";
import { Permissao, PermissaoService } from "../../services/PermissaoService";

const Pessoas = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [todasPessoas, setTodasPessoas] = useState<Pessoa[]>([]);
    const [todasCidades, setTodasCidades] = useState<Cidade[]>([]);
    const [selectedCidade, setSelectedCidade] = useState("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefetching, setIsRefetching] = useState(true);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});
    const pessoaService = new PessoaService();
    const cidadeService = new CidadeService();

    const fetchData = () => {
        setIsLoading(true);
        setIsRefetching(true);

        try {
            pessoaService.findAll().then((r) => setTodasPessoas(r.data));
            cidadeService.findAll().then((r) => setTodasCidades(r.data));
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

    const handleCriarPessoa = async (values: Pessoa) => {
        const response = await pessoaService.create(values);
        try {
            if (response.status == 200) {
                setTodasPessoas(response.data);
                setCreateModalOpen(false); // close the create modal
            }
        } finally {
            window.location.reload();
        }
    };

    const handleSaveRowEdits: MaterialReactTableProps<Pessoa>["onEditingRowSave"] =
        async ({ exitEditingMode, row, values }) => {
            if (!Object.keys(validationErrors).length) {
                const updatedPessoa: Pessoa = {
                    id: row.original.id,
                    nome: values.nome,
                    cidade: {
                        id: Number(selectedCidade),
                        nome: "",
                    },
                    cpf: values.cpf,
                    email: values.email,
                    endereco: values.endereco,
                    cep: values.cep,
                    permissaoPessoas: row.original.permissaoPessoas.map(
                        (permissaoPessoa: any) => ({
                            permissao: {
                                id: permissaoPessoa.permissao.id,
                                nome: permissaoPessoa.permissao.nome,
                            },
                        })
                    ),
                };
                //send/receive api updates here, then refetch or update local table data for re-render
                const response = await pessoaService.edit(updatedPessoa);
                if (response.status == 200) {
                    todasPessoas[row.index] = response.data;
                    setTodasPessoas([...todasPessoas]);
                    exitEditingMode(); //required to exit editing mode and close modal
                }
            }
        };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };

    const handleDeletarPessoa = useCallback(
        async (row: MRT_Row<Pessoa>) => {
            if (
                !confirm(
                    `Are you sure you want to delete ${row.getValue("nome")}`
                )
            ) {
                return;
            }
            const response = await pessoaService.delete(row.getValue("id"));
            if (response.status == 200) {
                setTodasPessoas(
                    todasPessoas.filter((p) => p.id !== row.getValue("id"))
                );
            }
        },
        [todasPessoas]
    );

    const getCommonEditTextFieldProps = useCallback(
        (
            cell: MRT_Cell<Pessoa>
        ): MRT_ColumnDef<Pessoa>["muiTableBodyCellEditTextFieldProps"] => {
            return {
                error: !!validationErrors[cell.id],
                helperText: validationErrors[cell.id],
                onBlur: (event: any) => {
                    const isValid =
                        cell.column.id === "cidade.nome"
                            ? validateRequired(event.target.value)
                            : validateNome(event.target.value);
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

    const columns = useMemo<MRT_ColumnDef<Pessoa>[]>(
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
                accessorKey: "cidade.nome",
                header: "Cidade",
                muiTableBodyCellEditTextFieldProps: {
                    select: true, //change to select for a dropdown
                    onBlur: (e) => {
                        setSelectedCidade(e.target.value);
                    },
                    children: todasCidades.map((cidades) => (
                        <MenuItem key={cidades.id} value={cidades.id}>
                            {cidades.nome}
                        </MenuItem>
                    )),
                },
            },
            {
                accessorKey: "cpf",
                header: "CPF",
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }: any) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: "email",
                header: "Email",
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }: any) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: "endereco",
                header: "Endereco",
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }: any) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: "cep",
                header: "CEP",
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }: any) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                id: "permissaoPessoas",
                accessorKey: "permissaoPessoas",
                header: "",
                columns: [
                    {
                        accessorFn: (row) =>
                            `${row.permissaoPessoas.map(
                                (r: any) => r.permissao.nome
                            )}`, //accessorFn used to join multiple data into a single cell
                        id: "permissoesPessoas", //id is still required when using accessorFn instead of accessorKey
                        header: "Permissões",
                        enableColumnOrdering: false,
                        enableEditing: false, //disable editing on this column
                        enableSorting: false,
                        size: 250,
                    },
                ],
            },
        ],
        [getCommonEditTextFieldProps, todasCidades]
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
                    data={todasPessoas}
                    editingMode="modal" //default
                    enableEditing
                    onEditingRowSave={handleSaveRowEdits}
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
                            <Tooltip arrow placement="right" title="Delete">
                                <IconButton
                                    color="error"
                                    onClick={() => handleDeletarPessoa(row)}
                                >
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                    renderTopToolbarCustomActions={() => (
                        <Button
                            color="secondary"
                            onClick={() => setCreateModalOpen(true)}
                            variant="contained"
                        >
                            Adicionar Pessoa
                        </Button>
                    )}
                    state={{
                        isLoading,
                        showAlertBanner: isError,
                        showProgressBars: isRefetching,
                    }}
                />
                <ModalCriarPessoa
                    columns={columns}
                    open={createModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    onSubmit={handleCriarPessoa}
                />
            </Box>
        </>
    );
};

interface CreateModalProps {
    columns: MRT_ColumnDef<Pessoa>[];
    onClose: () => void;
    onSubmit: (values: Pessoa) => void;
    open: boolean;
}

export const ModalCriarPessoa = ({
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
    const [selectedCidade, setSelectedCidade] = useState("");
    const [todasCidades, setTodasCidades] = useState<Cidade[]>([]);
    const [selectedPermissao, setSelectedPermissao] = useState({});
    const [todasPermissoes, setTodasPermissoes] = useState<Permissao[]>([]);
    const cidadeService = new CidadeService();
    const permissaoService = new PermissaoService();
    const [cpf, onChange] = useState();

    useEffect(() => {
        cidadeService.findAll().then((r) => setTodasCidades(r.data));
        permissaoService.findAll().then((r) => setTodasPermissoes(r.data));
    }, []);

    const handleSubmit = () => {
        const selectedPermissionIds = Object.values(selectedPermissao)
            .filter((permissionId) => permissionId !== null)
            .map((permissionId) => Number(permissionId));

        const permissaoPessoas = selectedPermissionIds.map((permissionId) => ({
            permissao: { id: permissionId },
        }));

        const valuesWithSelections = {
            ...values,
            cidade: { id: selectedCidade },
            permissaoPessoas,
        };
        onSubmit(valuesWithSelections);
        onClose();
    };

    const handleChangePermissao = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSelectedPermissao((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.checked
                ? Number(event.target.name)
                : null,
        }));
    };

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Adicionar Pessoa</DialogTitle>
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
                            column.accessorKey == "cidade.nome" ? (
                                <FormControl fullWidth key={column.accessorKey}>
                                    <InputLabel id="cidadeLabel">
                                        Cidade
                                    </InputLabel>
                                    <Select
                                        labelId="cidadeLabel"
                                        id="cidade"
                                        key={column.accessorKey}
                                        value={selectedCidade}
                                        label="Cidade"
                                        onChange={(event) =>
                                            setSelectedCidade(
                                                event.target.value
                                            )
                                        }
                                    >
                                        {todasCidades.map((cidade) => (
                                            <MenuItem
                                                value={cidade.id}
                                                key={cidade.id}
                                            >
                                                {cidade.nome}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : column.accessorKey == "cpf" ? (
                                <InputMask
                                    mask="999.999.999-99"
                                    value={cpf}
                                    disabled={false}
                                    maskChar=" "
                                    key={column.accessorKey}
                                    label={column.header}
                                    name={column.accessorKey}
                                    onChange={(e: {
                                        target: { name: any; value: any };
                                    }) =>
                                        setValues({
                                            ...values,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                >
                                    {() => (
                                        <TextField
                                            key={column.accessorKey}
                                            label={column.header}
                                            name={column.accessorKey}
                                        />
                                    )}
                                </InputMask>
                            ) : column.accessorKey == "permissaoPessoas" ? (
                                <FormControl
                                    component="fieldset"
                                    variant="standard"
                                    key={column.accessorKey}
                                >
                                    <FormLabel component="legend">
                                        Permissões
                                    </FormLabel>
                                    <FormGroup>
                                        {todasPermissoes.map((permissoes) => (
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        onChange={
                                                            handleChangePermissao
                                                        }
                                                        name={String(
                                                            permissoes.id
                                                        )}
                                                    />
                                                }
                                                label={permissoes.nome}
                                            />
                                        ))}
                                    </FormGroup>
                                </FormControl>
                            ) : (
                                column.accessorKey !== "id" && (
                                    <TextField
                                        key={column.accessorKey}
                                        label={column.header}
                                        name={column.accessorKey}
                                        onKeyPress={(e) => {
                                            if (column.accessorKey === "cep") {
                                                const inputChar =
                                                    String.fromCharCode(
                                                        e.charCode
                                                    );
                                                if (!/^\d+$/.test(inputChar)) {
                                                    // check if keystroke is a numeric character
                                                    e.preventDefault(); // prevent the keystroke from being entered
                                                }
                                            }
                                        }}
                                        inputProps={
                                            column.accessorKey === "cep"
                                                ? { maxLength: 8 }
                                                : {}
                                        }
                                        onChange={(e) =>
                                            setValues({
                                                ...values,
                                                [e.target.name]: e.target.value,
                                            })
                                        }
                                    />
                                )
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
                    Adicionar Pessoa
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const validateRequired = (value: string) => !!value.length;
const validateNome = (nome: string) => nome.length >= 3 && nome.length <= 20;

export default Pessoas;
