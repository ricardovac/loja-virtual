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
import { Cidade, CidadeService } from "../../services/CidadeService";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Estado, EstadoService } from "../../services/EstadoService";

const Cidades = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [todasCidades, setTodasCidades] = useState<Cidade[]>([]);
    const [todosEstados, setTodosEstados] = useState<Estado[]>([]);
    const [selectedEstado, setSelectedEstado] = useState("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefetching, setIsRefetching] = useState(true);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});
    const cidadeService = new CidadeService();
    const estadoService = new EstadoService();

    const fetchData = () => {
        setIsLoading(true);
        setIsRefetching(true);

        try {
            cidadeService.findAll().then((r) => setTodasCidades(r.data));
            estadoService.findAll().then((r) => setTodosEstados(r.data));
        } catch (e) {
            setIsError(true);
            return;
        }
        setIsError(false);
        setIsLoading(false);
        setIsRefetching(false);
    };

    useEffect(() => {
        if (!todosEstados.length && !todasCidades.length) {
            fetchData();
        }
    }, [todosEstados, todasCidades]);

    const handleCriarCidade = async (values: Cidade) => {
        const response = await cidadeService.create(values);
        if (response.status == 200) {
            setTodasCidades([...todasCidades, response.data]);
            setCreateModalOpen(false); // close the create modal
        }
    };

    const handleSaveRowEdits: MaterialReactTableProps<Cidade>["onEditingRowSave"] =
        async ({ exitEditingMode, row, values }) => {
            if (!Object.keys(validationErrors).length) {
                const updatedCidade: Cidade = {
                    id: row.original.id,
                    nome: values.nome,
                    estado: {
                        id: Number(selectedEstado),
                        nome: "",
                        sigla: "",
                    },
                };
                const response = await cidadeService.edit(updatedCidade);
                if (response.status == 200) {
                    todasCidades[row.index] = response.data;
                    setTodasCidades([...todasCidades]);
                    exitEditingMode(); //required to exit editing mode and close modal
                }
            }
        };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };

    const handleDeletarCidade = useCallback(
        async (row: MRT_Row<Cidade>) => {
            if (
                !confirm(
                    `Tem certeza que você deseja quer deletar ${row.getValue(
                        "nome"
                    )}?`
                )
            ) {
                return;
            }
            const response = await cidadeService.delete(row.getValue("id"));
            if (response.status == 200) {
                setTodasCidades(
                    todasCidades.filter((p) => p.id !== row.getValue("id"))
                );
            }
        },
        [todasCidades]
    );

    const getCommonEditTextFieldProps = useCallback(
        (
            cell: MRT_Cell<Cidade>
        ): MRT_ColumnDef<Cidade>["muiTableBodyCellEditTextFieldProps"] => {
            return {
                error: !!validationErrors[cell.id],
                helperText: validationErrors[cell.id],
                onBlur: (event: any) => {
                    const isValid =
                        cell.column.id === "nome"
                            ? validateRequired(event.target.value)
                            : cell.column.id === "estado.nome"
                            ? validateEstado(event.target.value)
                            : validateRequired(event.target.value);
                    if (!isValid) {
                        //set validation error for cell if invalid
                        setValidationErrors({
                            ...validationErrors,
                            [cell.id]: `Campo obrigatório`,
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

    const columns = useMemo<MRT_ColumnDef<Cidade>[]>(
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
                header: "Cidade",
                size: 140,
            },
            {
                accessorKey: "estado.nome",
                header: "Estado",
                muiTableBodyCellEditTextFieldProps: {
                    select: true, //change to select for a dropdown
                    onBlur: (e) => {
                        setSelectedEstado(e.target.value);
                    },
                    children: todosEstados.map((estados) => (
                        <MenuItem key={estados.id} value={estados.id}>
                            {estados.nome}
                        </MenuItem>
                    )),
                },
            },
        ],
        [getCommonEditTextFieldProps, todosEstados]
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
                                align: "left",
                            },
                            size: 120,
                        },
                    }}
                    columns={columns}
                    data={todasCidades}
                    editingMode="modal" //default
                    enableEditing
                    onEditingRowSave={handleSaveRowEdits}
                    onEditingRowCancel={handleCancelRowEdits}
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: "flex", gap: "1rem" }}>
                            <Tooltip arrow placement="left" title="Edit">
                                <IconButton
                                    onClick={() => table.setEditingRow(row)}
                                >
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="right" title="Delete">
                                <IconButton
                                    color="error"
                                    onClick={() => handleDeletarCidade(row)}
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
                            Adicionar Cidade
                        </Button>
                    )}
                    state={{
                        isLoading,
                        showAlertBanner: isError,
                        showProgressBars: isRefetching,
                    }}
                />
                <ModalCriarCidade
                    columns={columns}
                    open={createModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    onSubmit={handleCriarCidade}
                />
            </Box>
        </>
    );
};

interface CreateModalProps {
    columns: MRT_ColumnDef<Cidade>[];
    onClose: () => void;
    onSubmit: (values: Cidade) => void;
    open: boolean;
}

export const ModalCriarCidade = ({
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
    const [todosEstados, setTodosEstados] = useState<Estado[]>([]);
    const [selectedEstado, setSelectedEstado] = useState("");
    const estadoService = new EstadoService();

    useEffect(() => {
        estadoService.findAll().then((r) => setTodosEstados(r.data));
    }, []);

    const handleSubmit = () => {
        const valuesWithSelections = {
            ...values,
            estado: { id: selectedEstado },
        };
        onSubmit(valuesWithSelections);
        onClose();
    };

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Adicionar Cidade</DialogTitle>
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
                            column.accessorKey === "estado.nome" ? (
                                <FormControl fullWidth key={column.accessorKey}>
                                    <InputLabel id="estado">Estado</InputLabel>
                                    <Select
                                        value={selectedEstado}
                                        key={column.accessorKey}
                                        onChange={(event) =>
                                            setSelectedEstado(
                                                event.target.value
                                            )
                                        }
                                    >
                                        {todosEstados.map((estados) => (
                                            <MenuItem
                                                key={estados.id}
                                                value={estados.id}
                                            >
                                                {estados.nome}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : (
                                <TextField
                                    key={column.accessorKey}
                                    label={column.header}
                                    disabled={column.accessorKey === "id"}
                                    name={column.accessorKey}
                                    onChange={(e) =>
                                        setValues({
                                            ...values,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
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
                    AdicionarCidade
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const validateRequired = (value: string) => !!value.length;
const validateEstado = (sigla: string) =>
    sigla.length >= 2 && sigla.length <= 20;

export default Cidades;
