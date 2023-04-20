import { Alert, Button, Card, CardContent, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import Center from "./Center";
import useForm from "../hooks/useForm";
import { ENDPOINTS, createAPIWithoutAuthentication } from "../api";
import useStateContext from "../hooks/useStateContext";
import { useNavigate } from "react-router-dom";
import CreateDialog from "./CreateDialog";
const getFreshModel = () => ({
    password:'',
    email:'',
    name:'',
})
export default function Login(){
    const {resetContext} = useStateContext();
    const navigate = useNavigate();
    const [loginResult, setLoginResult]= useState();
    const [open, setOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const { values,
        errors,
        setErrors,
        hadleInputChange} = useForm(getFreshModel);
    useEffect(()=>{
        resetContext()
    },[])
    const login = e=> {
        e.preventDefault();
        if (validate()){
            createAPIWithoutAuthentication(ENDPOINTS.participant)
            .getLogin(
                {
                    email:values.email,
                    password:values.password
                })
            .then(res =>
            {
                if(res.data !== "")
                {
                    if(res.data !== "Wrong password")
                    {
                        navigate('/quiz');
                    }
                    else  setLoginResult(res.data);
                }
                else
                {
                    setLoginResult("Account not found");
                }
                setShowDialog(true);
            })
            .catch(err => console.log(err))
        }  
    }
    const validate = () => {
        let temp = {}
        temp.email = (/\S+@\S+\.\S+/).test(values.email)?"":"Email is not value"
        temp.password = values.password !== ""?"":"This field is required."
        setErrors(temp);
        return Object.values(temp).every(x=>x === "")
    }
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose =  () => {
        setOpen(false);
    };
    return (
        <Center>
            <Card sx={{width:400}}>
            <CardContent sx={{textAlign:'center'}}>
                <Typography variant="h3" sx={{my:3}}>
                    Quiz App
                </Typography>
                    <Box sx={{
                        '& .MuiTextField-root':{
                            m :1,
                            width:'90%'
                        }
                    }}>
                    <form noValidate autoComplete="off" onSubmit={login}>
                        <TextField 
                            label="Emall"
                            name = "email"
                            type="email"
                            value= {values.email}
                            onChange={hadleInputChange}
                            variant ="outlined"
                            {...(errors.email && {error:true, helperText:errors.email})} />
                        <TextField 
                            label="Password"
                            name = "password"
                            type="password"
                            value= {values.password}
                            onChange={hadleInputChange}
                            variant ="outlined"
                            {...(errors.password && {error:true, helperText:errors.password})} />
                        <Button
                            type = "submit"
                            variant="contained"
                            size = "large"
                            sx={{width:'30%',marginRight:'20px',marginTop:'10px'}}>Login 
                        </Button>
                        <Button
                            onClick={handleClickOpen}
                            type = "button"
                            variant="contained"
                            size = "large"
                            sx={{width:'50%',marginTop:'10px'}}>Create Account 
                        </Button>
                        <CreateDialog 
                        open={open}
                        onClose={handleClose}
                        />
                    </form>
                    <Alert
                        severity="error"
                        variant="string"
                        sx = {{
                            width:'60%',
                            m: 'auto',
                            color:'red',
                            visibility: showDialog?'visible': 'hidden'
                        }}>
                        {loginResult}
                    </Alert>
                </Box>
            </CardContent>
            </Card>
        </Center>     
    )
}
