import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Inventory from "@mui/icons-material/Inventory";
import Link from "@mui/material/Link";
import { LocationCity, Lock, Place } from "@mui/icons-material";

export const mainListItems = (
    <React.Fragment>
        <Link
            href="/"
            underline={"none"}
            color={(theme) =>
                theme.palette.mode === "light" ? "black" : "white"
            }
        >
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItemButton>
        </Link>
        <Link
            href="/produtos"
            underline={"none"}
            color={(theme) =>
                theme.palette.mode === "light" ? "black" : "white"
            }
        >
            <ListItemButton>
                <ListItemIcon>
                    <Inventory />
                </ListItemIcon>
                <ListItemText primary="Produtos" />
            </ListItemButton>
        </Link>
        <Link
            href="/pessoas"
            underline={"none"}
            color={(theme) =>
                theme.palette.mode === "light" ? "black" : "white"
            }
        >
            <ListItemButton>
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Pessoas" />
            </ListItemButton>
        </Link>
        <Link
            href="/permissoes"
            underline={"none"}
            color={(theme) =>
                theme.palette.mode === "light" ? "black" : "white"
            }
        >
            <ListItemButton>
                <ListItemIcon>
                    <Lock />
                </ListItemIcon>
                <ListItemText primary="Permissões" />
            </ListItemButton>
        </Link>
        <Link
            href="/estados"
            underline={"none"}
            color={(theme) =>
                theme.palette.mode === "light" ? "black" : "white"
            }
        >
            <ListItemButton>
                <ListItemIcon>
                    <Place />
                </ListItemIcon>
                <ListItemText primary="Estados" />
            </ListItemButton>
        </Link>
        <Link
            href="/cidades"
            underline={"none"}
            color={(theme) =>
                theme.palette.mode === "light" ? "black" : "white"
            }
        >
            <ListItemButton>
                <ListItemIcon>
                    <LocationCity />
                </ListItemIcon>
                <ListItemText primary="Cidades" />
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
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Mês atual" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Ultimos 6 Mêses" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Todo Ano" />
        </ListItemButton>
    </React.Fragment>
);
