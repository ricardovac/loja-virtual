import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Inventory from '@mui/icons-material/Inventory';
import Link from "@mui/material/Link";
import {LocationCity, Lock, Place} from "@mui/icons-material";

export const mainListItems = (
    <React.Fragment>
        <Link href="/dashboard" underline={"none"} color={"black"}>
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon/>
                </ListItemIcon>
                <ListItemText primary="Dashboard"/>
            </ListItemButton>
        </Link>
        <Link href="/" underline={"none"} color={"black"}>
            <ListItemButton>
                <ListItemIcon>
                    <Inventory/>
                </ListItemIcon>
                <ListItemText primary="Produtos"/>
            </ListItemButton>
        </Link>
        <ListItemButton>
            <ListItemIcon>
                <PeopleIcon/>
            </ListItemIcon>
            <ListItemText primary="Pessoas"/>
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <Lock/>
            </ListItemIcon>
            <ListItemText primary="Permissões"/>
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <LocationCity/>
            </ListItemIcon>
            <ListItemText primary="Cidades"/>
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <Place/>
            </ListItemIcon>
            <ListItemText primary="Estados"/>
        </ListItemButton>
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