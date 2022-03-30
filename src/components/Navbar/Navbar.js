import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate }  from "react-router-dom";
import { AppBar, Avatar, Toolbar, Typography, Button } from "@material-ui/core";
import memoriesLogo from '../../images/sail2.png'
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
    <AppBar className={classes.appBar} position='static' color='inherit'>
        <Link to='/' className={classes.brandContainer}>
        {/* <Typography component={Link} to= "/" className={classes.heading} variant='h2' align='center'>Memories</Typography> */}
        <img component={Link} to= "/" src={memoriesText} alt='icon' height='60px'/>
        {/* <img className={classes.image} src={memoriesLogo} alt='icon' height='40px'/> */}
        </Link>
        <Toolbar className={classes.toolbar}>
            {user ? (
                <div className={classes.profile}>
                    <Avatar className={classes.purple} alt={user.result.name} src={user.result.image}>
                        {user.result.name.charAt(0)}</Avatar>
                    <Typography className={classes.userName} variant='h6'>Welcome back, {user.result.name}</Typography>
                    <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Log Out</Button>
                </div>) : (
                     <Button component={Link} to="/auth" variant="contained" color="primary">Log in</Button>
                ) }
        </Toolbar>
    </AppBar>
    )
}

export default Navbar;