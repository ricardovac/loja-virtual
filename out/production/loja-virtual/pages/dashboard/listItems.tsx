import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Inventory from '@mui/icons-material/Inventory';
import Link from "@mui/material/Link";

export const mainListItems = (
    <React.Fragment>
        <Link href="/" underline={"none"} color={"black"}>
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon/>
                </ListItemIcon>
                <ListItemText primary="Dashboard"/>
            </ListItemButton>
        </Link>
        <ListItemButton>
            <ListItemIcon>
                <ShoppingCartIcon/>
            </ListItemIcon>
            <ListItemText primary="Pedidos"/>
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <PeopleIcon/>
            </ListItemIcon>
            <ListItemText primary="Clientes"/>
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <BarChartIcon/>
            </ListItemIcon>
            <ListItemText primary="Relátorios"/>
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <LayersIcon/>
            </ListItemIcon>
            <ListItemText primary="Integrações"/>
        </ListItemButton>
        <Link href="produtos" underline={"none"} color={"black"}>
            <ListItemButton>
                <ListItemIcon>
                    <Inventory/>
                </ListItemIcon>
                <ListItemText primary="Produtos"/>
            </ListItemButton>
        </Link>
    </React.Fragment>
);

export const secondaryListItems = (
    <React.Fragment>
        <ListSubheader component="div" inset>
            Relátorios salvos
        </ListSubheader>
        <ListItemButton>
            <ListItemIcon>
                <AssignmentIcon/>
            </ListItemIcon>
            <ListItemText primary="Mês atual"/>
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <AssignmentIcon/>
            </ListItemIcon>
            <ListItemText primary="Ultimos 6 Mêses"/>
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <AssignmentIcon/>
            </ListItemIcon>
            <ListItemText primary="Todo Ano"/>
        </ListItemButton>
    </React.Fragment>
);