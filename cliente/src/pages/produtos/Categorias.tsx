import * as React from 'react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Tooltip
} from "@mui/material";
import MaterialReactTable, {
    type MaterialReactTableProps,
    type MRT_Cell,
    type MRT_ColumnDef,
    type MRT_Row,
} from 'material-react-table';
import {Delete, Edit} from '@mui/icons-material';
import Toolbar from "@mui/material/Toolbar";
import {Categoria, CategoriaService} from "../../services/CategoriaService";

const Categorias = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [allCategoria, setAllCategoria] = useState<Categoria[]>([]);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});
    const categoriaService = new CategoriaService()

    useEffect(() => {
        categoriaService.findAll().then((r) => setAllCategoria(r.data));
    }, []);

    const handleCriarCategoria = async (values: Categoria) => {
        await categoriaService.create(values);
    };

    const handleSaveRowEdits: MaterialReactTableProps<Categoria>['onEditingRowSave'] =
        async ({exitEditingMode, row, values}) => {
            if (!Object.keys(validationErrors).length) {
                if (allCategoria) {
                    allCategoria[row.index] = values;
                }
                //send/receive api updates here, then refetch or update local table data for re-render
                await categoriaService.edit(values)
                exitEditingMode(); //required to exit editing mode and close modal
            }
        };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };

    const handleDeletarCategoria = useCallback(
        async (row: MRT_Row<Categoria>) => {
            if (
                !confirm(`Are you sure you want to delete ${row.getValue('nome')}`)
            ) {
                return;
            }
            //send api delete request here, then refetch or update local table data for re-render
            await categoriaService.delete(row.getValue('id'))
        },
        [],
    );

    const getCommonEditTextFieldProps = useCallback(
        (
            cell: MRT_Cell<Categoria>,
        ): MRT_ColumnDef<Categoria>['muiTableBodyCellEditTextFieldProps'] => {
            return {
                error: !!validationErrors[cell.id],
                helperText: validationErrors[cell.id],
                onBlur: (event: any) => {
                    const isValid =
                        cell.column.id === 'nome'
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
        [validationErrors],
    );

    const columns = useMemo<MRT_ColumnDef<Categoria>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: false,
                size: 80,
            },
            {
                accessorKey: 'nome',
                header: 'Nome',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({cell}: any) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
        ],
        [getCommonEditTextFieldProps],
    );

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
                <MaterialReactTable
                    displayColumnDefOptions={{
                        'mrt-row-actions': {
                            muiTableHeadCellProps: {
                                align: 'center',
                            },
                            size: 120,
                        },
                    }}
                    columns={columns}
                    data={allCategoria}
                    editingMode="modal" //default
                    enableColumnOrdering
                    enableEditing
                    onEditingRowSave={handleSaveRowEdits}
                    onEditingRowCancel={handleCancelRowEdits}
                    renderRowActions={({row, table}) => (
                        <Box sx={{display: 'flex', gap: '1rem'}}>
                            <Tooltip arrow placement="left" title="Edit">
                                <IconButton onClick={() => table.setEditingRow(row)}>
                                    <Edit/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="right" title="Delete">
                                <IconButton color="error" onClick={() => handleDeletarCategoria(row)}>
                                    <Delete/>
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
                            Adicionar Categoria
                        </Button>
                    )}
                />
                <ModalCriarCategoria
                    columns={columns}
                    open={createModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    onSubmit={handleCriarCategoria}
                />
            </Box>
        </>
    );
};

interface CreateModalProps {
    columns: MRT_ColumnDef<Categoria>[];
    onClose: () => void;
    onSubmit: (values: Categoria) => void;
    open: boolean;
}

export const ModalCriarCategoria = ({
                                        open,
                                        columns,
                                        onClose,
                                        onSubmit,
                                    }: CreateModalProps) => {
    const [values, setValues] = useState<any>(() =>
        columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {} as any),
    );

    const handleSubmit = () => {
        onSubmit(values);
        onClose();
    };

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Adicionar Categoria</DialogTitle>
            <DialogContent>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Stack
                        sx={{
                            width: '100%',
                            minWidth: {xs: '300px', sm: '360px', md: '400px'},
                            gap: '1.5rem',
                        }}
                    >
                        {columns.map((column) =>
                                column.accessorKey !== 'id' && (
                                    <TextField
                                        key={column.accessorKey}
                                        label={column.header}
                                        name={column.accessorKey}
                                        onChange={(e) =>
                                            setValues({...values, [e.target.name]: e.target.value})
                                        }
                                    />
                                )
                        )}
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{p: '1.25rem'}}>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="secondary" onClick={handleSubmit} variant="contained">Adicionar Categoria</Button>
            </DialogActions>
        </Dialog>
    );
};

const validateRequired = (value: string) => !!value.length;
const validateNome = (nome: string) => nome.length >= 3 && nome.length <= 20;

export default Categorias;
