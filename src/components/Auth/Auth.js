import { React, useState } from "react";
import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from "@mui/material";
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
                <Typography variant="h5">{isSignup ? '注册' : '登录'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {   isSignup && (
                                <>
                                <Input name="firstname" label="名" handleChange={handleChange} autoFocus half></Input>
                                <Input name="lastname" label="姓" handleChange={handleChange} half></Input>
                                </>
                            )}
                            <Input name="email" label="邮箱" handleChange={handleChange} type="email"/>
                            <Input name="password" label="密码" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                            { isSignup && <Input name="confirmPassword" label="确认密码" handleChange={handleChange} type="password" />}
                    </Grid>
                        <Grid container mt={1} spacing={1} direction="row" justifyContent="center" alignItems="center">
                        <Grid item xs={12} sm={12}>
                            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                                { isSignup ? '注册' : '登录'}
                            </Button>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                            <GoogleLogin
                                        clientId="68914266286-q4m77ulp6gj38i7o7e2sbidpr0hqieeg.apps.googleusercontent.com"
                                        render={(renderProps) => (
                                            <Button className={classes.googleButton} color='primary' fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                                                使用Google账号登录
                                            </Button>
                                        )}
                                        onSuccess={googleSuccess}
                                        onFailure={googleFailure}
                                        cookiePolicy="single_host_origin"
                                    />
                            </Grid>
                            </Grid>
                    <Grid container mt={2} justifyContent="flex-end">
                        <Grid item>
                            <Button onClick={switchMode} color="primary" size="small">
                                { isSignup ? (<span> 已有账号? <b><i>登录</i></b> </span>) : (<span> 没有账号？ <b><i>注册</i></b></span>)}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth;