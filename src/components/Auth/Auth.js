import { React, useState } from "react";
import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import useStyles from './styles'
import Input from "./Input";
import { GoogleLogin } from "react-google-login"
import { useDispatch } from "react-redux";
import Icon from "./icon";
import { useNavigate } from "react-router-dom";
import { signin, signup } from '../../actions/auth'

const initialState = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
};
const Auth = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if(isSignup){
            dispatch(signup(formData, navigate));
        } else {
            dispatch(signin(formData, navigate));
        }
        console.log(formData);
    };

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    };

    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword)
    };

    const switchMode = () => {
        setIsSignup((isSignup) => !isSignup)
        setShowPassword(false)
    };

    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;

        try {
            dispatch({type: 'AUTH', data: { result, token } });
            navigate("/");
        } catch (error) {
            console.log(error)
        }
    };
    const googleFailure = (error) => {
        console.log('Google Sign In was unsuccessful, please try again')
        console.log(error);
    };

    return(
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign in'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {   isSignup && (
                                <>
                                <Input name="firstname" label="First Name" handleChange={handleChange} autoFocus half></Input>
                                <Input name="lastname" label="Last Name" handleChange={handleChange} half></Input>
                                </>
                            )}
                            <Input name="email" label="Email Address" handleChange={handleChange} type="email"/>
                            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                            { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        { isSignup ? 'Sign Up' : 'Sign In'}
                    </Button>
                    <GoogleLogin
                                clientId="68914266286-q4m77ulp6gj38i7o7e2sbidpr0hqieeg.apps.googleusercontent.com"
                                render={(renderProps) => (
                                    <Button className={classes.googleButton} color='primary' fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                                        Google Sign In
                                    </Button>
                                )}
                                onSuccess={googleSuccess}
                                onFailure={googleFailure}
                                cookiePolicy="single_host_origin"
                            />
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button onClick={switchMode} color="primary" size="small">
                                { isSignup ? (<span> Already have an account? <b><i>Sign In</i></b> </span>) : (<span> "Don't have an account? <b><i>Sign Up</i></b></span>)}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth;