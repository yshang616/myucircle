import React, { useState }from "react";
import useStyles from './styles'
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Fade, CardHeader, Avatar, IconButton, CardActionArea, Tooltip} from "@mui/material";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined'
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import Edit from "@material-ui/icons/Edit"
import moment from 'moment';
import { useDispatch } from "react-redux";
import { deletePost, likePost, getPosts } from "../../../actions/posts";
import { useNavigate } from "react-router-dom";

const Post = ({ post, setCurrentId }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));
    const [likes, setLikes] = useState(post?.likes);
    const userId = user?.result.googleId || user?.result?._id

    const hasLikedPost = post.likes.find((like) => like === userId);
    const handleLike = async () => {
      dispatch(likePost(post._id));

      if(hasLikedPost){
        setLikes(post.likes.filter((id) => id !== userId));
      } else {
        setLikes([...post.likes, userId]);
      }
    }
    
    const Likes = () => {
        if (likes.length > 0) {
            return likes.find((like) => like === userId)
              ? (
                <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
              ) : (
                <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
              );
          }
      
          return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
    };

    const openPost = () => navigate(`/posts/${post._id}`);

    return(
      <Fade in="true">
      <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar aria-label="profile">{post?.name?.charAt(0)}</Avatar>}
          title={post.name}
          action={(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
            <IconButton aria-label="settings" onClick={() => setCurrentId(post._id)} style={{ color: 'white' }} size="small">
            <Edit />
            </IconButton>)}
          subheader={moment(post.createdAt).fromNow()}
        />
        <CardActionArea onClick={openPost}>
          <CardMedia className={classes.media} component="img" image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'}  />
          <CardContent>
            <Typography variant="h6">{post.title}</Typography>
            <Typography variant="body1" rows={2} color="textSecondary" noWrap>{post.message}</Typography>
            <div>
              <Typography variant="body2" color="textSecondary" component='p'>{post.tags.map((tag) => `#${tag} `)}</Typography>
            </div>
          </CardContent>
        </CardActionArea>

        <CardActions className={classes.cardActions}>
        <Tooltip title="请登录以使用点赞功能哦">
          <span>
          <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
            <Likes />
          </Button>
          </span>
          </Tooltip>
          {(user && (user?.result?.googleId === post?.creator || user?.result?._id === post?.creator)) && (
          <Button size="small" color="secondary" onClick={() => {dispatch(deletePost(post._id)); dispatch(getPosts());}}>
            <DeleteIcon fontSize="small" /> Delete
          </Button>
          )}
        </CardActions>
        
      </Card>
      </Fade>
    );
  };
  

export default Post;