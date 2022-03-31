import React from "react";
import { useSelector } from "react-redux";
import { Grid, CircularProgress, Box } from "@mui/material";
import Post from "./Post/Post";

import useStyles from './styles';

const Posts = ({ setCurrentId }) => {
    const { posts, isLoading } = useSelector((state)=>state.posts)
    const classes = useStyles();

    if(!posts.length && !isLoading) return 'No Post is Available'

    return(
        isLoading ? (<Box alignItems="center"><CircularProgress/> </Box>): (
            <Grid className={classes.container} container alignItems="stretch" spacing={3}>
                {posts.map((post) => (
                    <Grid key={post.id} item xs={12} sm={12} md={6} lg={4}>
                        <Post post={post} setCurrentId={setCurrentId}/>
                    </Grid>
                ))}
            </Grid>
        )
    );
}

export default Posts;