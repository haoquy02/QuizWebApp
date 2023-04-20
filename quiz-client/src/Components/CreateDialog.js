import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import useForm from "../hooks/useForm";
import { ENDPOINTS, createAPIWithoutAuthentication } from "../api";
import { useNavigate } from "react-router-dom";
const getFreshModel = () => ({
    password:'',
    email:'',
    name:'',
})
export default function CreateDialog(props) {
    const {onClose, open } = props;
    const [showDialog, setShowDialog] = useState(false)
    const [showCreateResult, setShowCreateResult] = useState(false)
    const [showResultDialog, setShowResultDialog] = useState("")
    const navigate = useNavigate()
    const { values,
        errors,
        hadleInputChange} = useForm(getFreshModel);
    const submitAccount = () =>{
        if(values.password === values.ConfirmPassword)
        {
          createAPIWithoutAuthentication(ENDPOINTS.createAccount)
          .postCreateAccount(values,values.password)
          .then(res =>
          {
            setShowCreateResult(res.data)
            if(res.data === false)
            {
              setShowResultDialog('Account already exits');
            }
            else
            {
               setShowResultDialog('Create account success');
                setTimeout(()=>{
                  navigate("/");
                },4000)
            }
          })
          .catch(err => console.log(err)) 
        } 
        else
        {
          setShowResultDialog("Password doesn't match");
        }
        setShowDialog(true);
    }
    const handleClose =  () => {
        onClose();
        setShowDialog(false);
    };
    return (
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Create new account</DialogTitle>
          <DialogContent sx={{width:400}}>
            <TextField
              autoComplete="off"
              margin="dense"
              name = "email"
              label="Email Address"
              type="email"
              fullWidth
              value= {values.email}
              onChange={hadleInputChange}
              {...(errors.email && {error:true, helperText:errors.email})}
            />
            <TextField
              autoComplete="off"
              margin="dense"
              name="name"
              label="Name"
              fullWidth
              value= {values.name}
              onChange={hadleInputChange}
              {...(errors.email && {error:true, helperText:errors.name})}
            />
            <TextField
              autoComplete="off"
              margin="dense"
              name="password"
              label="Password"
              type="password"
              fullWidth
              value= {values.password}
              onChange={hadleInputChange}
              {...(errors.password && {error:true, helperText:errors.password})}
            />
             <TextField
              autoComplete="off"
              margin="dense"
              name="ConfirmPassword"
              label="ConfirmPassword"
              type="password"
              fullWidth
              value= {values.ConfirmPassword}
              onChange={hadleInputChange}
              {...(errors.ConfirmPassword && {error:true, helperText:errors.password})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={submitAccount}>Create new account</Button>
          </DialogActions>
          <Alert
            {...{severity: showCreateResult?"success":"error"}}
            variant="string"
            sx = {{
                width:'60%',
                m: 'auto',
                color: showCreateResult?'green':'red',
                visibility: showDialog?'visible': 'hidden'
            }}>
               {showResultDialog}
            </Alert>
        </Dialog>
      </div>
    );
  }