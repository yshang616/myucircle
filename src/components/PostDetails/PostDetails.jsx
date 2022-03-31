import React, { useEffect } from 'react';
import { Paper, Typography, CircularProgress, Divider, Card, Grid, CardHeader, CardActionArea, CardMedia } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';

import CommentSection from './CommentSection';
import { getPost, getPostsBySearch } from '../../actions/posts';
import useStyles from './styles'
import { CardContent } from '@material-ui/core';

const PostDetails = () => {
    const { post, posts, isLoading } = useSelector((state) => state.posts);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const classes = useStyles();
    const{ id } = useParams();

    useEffect(()=>{
      dispatch(getPost(id))
    }, [id]);

    useEffect(()=>{
      if(post) {
        dispatch(getPostsBySearch({search: 'none', tags: post?.tags.join(',')}));
      }
    }, [post]);

    if(!post) return null;

    if(isLoading) {
      return <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em"/>
      </Paper>
    }

    const recommendedPosts = posts.filter(({ _id })=>_id!==post._id);

    const openPost = (_id) => navigate(`/posts/${_id}`);

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={3}>
      {/* <Grid> */}
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h4">{post.title}</Typography>
          <Typography variant="h6" color="textSecondary">Posted by: {post.name}</Typography>
          <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
          <Typography gutterBottom variant="body1" color="textSecondary" component="p">{post.tags.map((tag) => `#${tag} `)}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography gutterBottom variant="h6" component="h2">{post.message}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          {/* <Typography variant="body1"><strong>Realtime Chat - coming soon!</strong></Typography>
          <Divider style={{ margin: '20px 0' }} /> */}
          <CommentSection post={post} style={{ mt: '20px', mb: '20px'}} ></CommentSection>
          <Divider style={{ margin: '20px 0' }} />
        </div>
        <div className={classes.imageSection}>
          <img className={classes.media} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
        </div>
      </div>
      {recommendedPosts.length && (
        <div className={classes.section}>
          <Typography gutterBottom variant="h6">你可能会喜欢:</Typography>
          <Divider />
          <div className={classes.recommendedPosts}>
          <Grid className={classes.container} container alignItems="stretch" spacing={3}>

            {recommendedPosts.map(({ title, message, name, likes, selectedFile, _id})=>(
              <Grid key={post.id} item xs={3} sm={3} md={3} lg={3}>
                 
                <Card style={{ margin:'20px', cursor:"pointer"}}>
                <CardActionArea onClick={()=>openPost(_id)} key={_id}>
                <CardHeader
                  title={name}
                  subheader={title}
                />
                <img src={selectedFile} width="200px" alt="img"/>
                <CardContent>
                  {console.log(selectedFile)}
                  
                </CardContent>
                </CardActionArea>
                </Card>
              </Grid>
            ))}
            </Grid>
          </div>
        </div>
      )}
      </Paper>
  )
}

export default PostDetails