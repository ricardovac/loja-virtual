import * as React from 'react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {Box, IconButton, ImageList, ImageListItem, Tooltip} from "@mui/material";
import {type MRT_Cell, type MRT_ColumnDef,} from 'material-react-table';
import Toolbar from "@mui/material/Toolbar";
import {ProdutoImagemService, produtoImagens} from "../../services/ProdutoImagemService";
import {ProdutoService} from "../../services/ProdutoService";
import {useParams} from "react-router-dom";
import {Delete} from "@mui/icons-material";
import Typography from "@mui/material/Typography";

const ProdutoImagens = () => {
    const [allProdutoImagem, setAllProdutoImagem] = useState<produtoImagens[]>([]);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});
    const produtoImagensService = new ProdutoImagemService()
    const produtoService = new ProdutoService();
    const [file, setFile] = useState<File | null>(null)
    const [produto, setProduto] = useState<any>({})
    let params = useParams();

    useEffect(() => {
        produtoImagensService.findAll().then((r) => setAllProdutoImagem(r.data));
        produtoService.findById(params.id).then((r) => setProduto(r.data))
    }, []);

    const handleCriarProdutoImagem = async (values: produtoImagens) => {
        await produtoImagensService.upload(values);
    };
    //
    // const handleSaveRowEdits: MaterialReactTableProps<ProdutoImagemService>['onEditingRowSave'] =
    //     async ({exitEditingMode, row, values}) => {
    //         if (!Object.keys(validationErrors).length) {
    //             if (allProdutoImagem) {
    //                 allProdutoImagem[row.index] = values;
    //             }
    //             //send/receive api updates here, then refetch or update local table data for re-render
    //             await produtoImagensService.edit(values)
    //             exitEditingMode(); //required to exit editing mode and close modal
    //         }
    //     };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };

    const handleDeletarProdutoImagem = useCallback(
        async (row: string | undefined) => {
            if (
                !confirm(`Are you sure you want to delete ${row}`)
            ) {
                return;
            }
            //send api delete request here, then refetch or update local table data for re-render
            await produtoImagensService.deleteProduto(row)
        },
        [],
    );

    const getCommonEditTextFieldProps = useCallback(
        (
            cell: MRT_Cell<produtoImagens>,
        ): MRT_ColumnDef<produtoImagens>['muiTableBodyCellEditTextFieldProps'] => {
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

    const columns = useMemo<MRT_ColumnDef<produtoImagens>[]>(
        () => [
            {
                accessorKey: 'idProduto',
                header: 'idProduto',
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: false,
                size: 80,
            },
            {
                accessorKey: 'file',
                header: 'File',
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
                <Box sx={{display: "flex", gap: "2rem"}}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setFile(e.target.files[0]);
                            }
                        }}
                    />
                    <Typography variant="h3" component="h3">
                        {produto.nome}
                    </Typography>
                </Box>
                <ImageList sx={{width: 500, height: 450}} cols={3} rowHeight={164}>
                    {allProdutoImagem.map((item) => (
                        <ImageListItem key={item.idProduto}>
                            <img src={`${item.file}?w=164&h=164&fit=crop&auto=format`}
                                 alt={item.nomeProduto}
                                 loading="lazy"/>
                            <Tooltip arrow placement="right" title="Delete">
                                <IconButton color="error" onClick={() => handleDeletarProdutoImagem(params.id)}>
                                    <Delete/>
                                </IconButton>
                            </Tooltip>
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>
        </>
    );
};

const validateRequired = (value: string) => !!value.length;
const validateNome = (nome: string) => nome.length >= 3 && nome.length <= 20;

export default ProdutoImagens;
