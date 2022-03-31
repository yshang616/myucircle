import React, { useState, useEffect } from "react";
import { Container, Grow, Grid, Paper, AppBar, TextField, Button } from "@mui/material";
import { useDispatch } from 'react-redux';
import useStyles from "./styles.js"
import { useNavigate, useLocation } from "react-router-dom";
import ChipInput from 'material-ui-chip-input';

import { getPosts, getPostsBySearch } from '../../actions/posts'
import Pagination from '../Pagination'
import Posts from "../Posts/Posts";
import Form from "../Form/Form";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
    
    const classes = useStyles();
    const query = useQuery();
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');

    const [currentId, setCurrentId] = useState(null);
    const dispatch = useDispatch();
    
    
    
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);
    const navigate = useNavigate();

    // useEffect(()=> {
    //   dispatch(getPosts());
    // }, [currentId, dispatch]);

    const searchPost = () => {
      if(search.trim() || tags){
        dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
        navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
      } else {
        navigate('/')
      }
    };

    const handleKeyDown = (e) => {
      if(e.keyCode === 13) {
        searchPost();
      }
    }

    const handleAdd = (tag) => setTags([...tags, tag]);

    const handleDelete = (tagToDelete) => setTags(tags.filter((tag)=>tag!==tagToDelete));

    return(
    <Grow in>
        <Container maxWidth="xl">
          <Grid className={classes.gridcontainer} container justifyContent='space-between' alignItems='stretch' spacing={3}>
            <Grid item xs={12} sm={8} md={9}>
              <Posts setCurrentId = {setCurrentId}/>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <AppBar className={classes.appBarSearch} position="static" color="inherit">
                <TextField 
                  name='search' 
                  variant="outlined" 
                  label="查找标题 / 内容"
                  onKeyDown={handleKeyDown}
                  fullWidth
                  value={search}
                  onChange={(e)=>setSearch(e.target.value)}/>
                  <ChipInput
                    style={{ margin:'10px 0' }}
                    value={tags}
                    onAdd={handleAdd}
                    onDelete={handleDelete}
                    label="查找标签"
                    variant="outlined"
                  />
                  <Button onClick={searchPost} className={classes.searchButton} variant="contained" color="primary">查找</Button>
              </AppBar>
              <Form currentId = {currentId} setCurrentId = {setCurrentId}/>
              {(!searchQuery && !tags.length) && (
                <Paper className={classes.pagination}>
                <Pagination page={page}/>
              </Paper>
              )}
              
            </Grid>
          </Grid>
        </Container>
      </Grow>
    )

}

export default Home;