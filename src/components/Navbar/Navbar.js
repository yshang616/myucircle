import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate }  from "react-router-dom";
import { Avatar, Typography, CssBaseline } from "@material-ui/core";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import memoriesText from '../../images/ucircleorg.png'
import decode from 'jwt-decode'

import useStyles from './styles'
import { useDispatch } from "react-redux";

const Navbar = () => {
    const classes = useStyles();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/');
        setUser(null);
    };

    useEffect(() => {
        const token = user?.token;

        if(token){
            const decodedToken = decode(token);
            if(decodedToken.exp * 1000 < new Date().getTime()) logout();
        }
        setUser(JSON.parse(localStorage.getItem('profile')))
    }, [location])

    return(
        <React.Fragment>
            <CssBaseline/>
            <AppBar className={classes.appBar} position='relative' color='inherit'>
                <Toolbar variant="dense" >
                <Box sx={{flexGrow: 1}}>
                <Link to='/' className={classes.brandContainer}>
                <img className={classes.image} component={Link} to= "/" src={memoriesText} alt='icon' height='60px'/>
               
                </Link>
                </Box>
                <Toolbar className={classes.toolbar}>
                    {user ? (
                        <div>
                            <Box sx={{display: {xs: "none", sm: "inline"}}} >
                            <Avatar className={classes.purple} alt={user.result.name} src={user.result.image}>
                                {user?.result?.name?.charAt(0)}</Avatar>
                            <Typography className={classes.userName} variant='h6'>欢迎回来, {user.result.name}</Typography>
                            </Box>
                            <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>退出登录</Button>
                        </div>) : (
                            <Button component={Link} to="/auth" variant="contained" color="primary">登录</Button>
                        ) }
                </Toolbar>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    )
}

export default Navbar;