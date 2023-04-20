import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ENDPOINTS, createAPIEndpoint } from "../api";
export default function Layout(){
    const navigate = useNavigate()
    const logout = () =>{
        createAPIEndpoint(ENDPOINTS.authenticate)
        .delete()
        .catch(err=> {console.log(err);})
        navigate("/")
    }
    return (
        <>
        <AppBar position="sticky">
            <Toolbar sx={{width:640,m:'auto'}}>
                <Typography
                variant="h4"
                align="center"
                sx={{flexGrow:1}}>
                    Quiz App
                </Typography>
                <Button onClick={logout}>Logout</Button>
            </Toolbar>
        </AppBar>
        <Outlet/>
        </>
    )
}