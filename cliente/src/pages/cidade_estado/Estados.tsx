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
import { Estado, EstadoService } from "../../services/EstadoService";

const Estados = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [todosEstados, setTodosEstados] = useState<Estado[]>([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefetching, setIsRefetching] = useState(true);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});
    const estadoService = new EstadoService();

    const fetchData = () => {
        setIsLoading(true);
        setIsRefetching(true);

        try {
            estadoService.findAll().then((r) => setTodosEstados(r.data));
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

    const handleCriarEstado = async (values: Estado) => {
        const response = await estadoService.create(values);
        if (response.status == 200) {
            setTodosEstados([...todosEstados, response.data]);
            setCreateModalOpen(false); // close the create modal
        }
    };

    const handleSaveRowEdits: MaterialReactTableProps<Estado>["onEditingRowSave"] =
        async ({ exitEditingMode, row, values }) => {
            if (!Object.keys(validationErrors).length) {
                const response = await estadoService.edit(values);
                if (response.status == 200) {
                    todosEstados[row.index] = response.data;
                    setTodosEstados([...todosEstados]);
                    exitEditingMode(); //required to exit editing mode and close modal
                }
            }
        };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };

    const handleDeletarEstado = useCallback(
        async (row: MRT_Row<Estado>) => {
            if (
                !confirm(
                    `Are you sure you want to delete ${row.getValue("nome")}`
                )
            ) {
                return;
            }
            const response = await estadoService.delete(row.getValue("id"));
            if (response.status == 200) {
                setTodosEstados(
                    todosEstados.filter((p) => p.id !== row.getValue("id"))
                );
            }
        },
        [todosEstados]
    );

    const getCommonEditTextFieldProps = useCallback(
        (
            cell: MRT_Cell<Estado>
        ): MRT_ColumnDef<Estado>["muiTableBodyCellEditTextFieldProps"] => {
            return {
                error: !!validationErrors[cell.id],
                helperText: validationErrors[cell.id],
                onBlur: (event: any) => {
                    const isValid =
                        cell.column.id === "nome"
                            ? validateRequired(event.target.value)
                            : cell.column.id === "sigla"
                            ? validateSigla(event.target.value)
                            : validateRequired(event.target.value);
                    if (!isValid) {
                        //set validation error for cell if invalid
                        setValidationErrors({
                            ...validationErrors,
                            [cell.id]: `O nome do estado é obrigatório e a sigla deve ter apenas 2 dígitos,`,
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

    const columns = useMemo<MRT_ColumnDef<Estado>[]>(
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
                accessorKey: "sigla",
                header: "Sigla",
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }: any) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
        ],
        [getCommonEditTextFieldProps]
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
                    data={todosEstados}
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
                                    onClick={() => handleDeletarEstado(row)}
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
                            Adicionar Estado
                        </Button>
                    )}
                    state={{
                        isLoading,
                        showAlertBanner: isError,
                        showProgressBars: isRefetching,
                    }}
                />
                <ModalCriarEstado
                    columns={columns}
                    open={createModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    onSubmit={handleCriarEstado}
                />
            </Box>
        </>
    );
};

interface CreateModalProps {
    columns: MRT_ColumnDef<Estado>[];
    onClose: () => void;
    onSubmit: (values: Estado) => void;
    open: boolean;
}

export const ModalCriarEstado = ({
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

    const handleSubmit = () => {
        onSubmit(values);
        onClose();
    };

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Adicionar Estado</DialogTitle>
            <DialogContent>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Stack
                        sx={{
                            width: "100%",
                            minWidth: { xs: "300px", sm: "360px", md: "400px" },
                            gap: "1.5rem",
                        }}
                    >
                        {columns.map(
                            (column) =>
                                column.accessorKey !== "id" && (
                                    <TextField
                                        key={column.accessorKey}
                                        label={column.header}
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
                    Adicionar Estado
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const validateRequired = (value: string) => !!value.length;
const validateSigla = (sigla: string) => sigla.length >= 2 && sigla.length <= 2;

export default Estados;
