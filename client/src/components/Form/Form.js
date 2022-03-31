import React, {useState, useEffect} from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import FileBase from 'react-file-base64';
import useStyles from './styles';
import { useDispatch } from "react-redux";
import { createPost, updatePost } from "../../actions/posts"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";




const Form = ({currentId, setCurrentId}) => {
    const [postData, setPostData] = useState({ title: '', message: '', tags: '', selectedFile: '' });
    const classes = useStyles();
    const dispatch = useDispatch();
    const post = useSelector((state)=> currentId ? state.posts.posts.find((post)=>post._id===currentId) : null)
    const user = JSON.parse(localStorage.getItem('profile'));
    const navigate = useNavigate();

    useEffect(()=>{
        if(post) setPostData(post);
    }, [post])

    const clear = () => {
        setCurrentId(null);
        setPostData({ title: '', message: '', tags: '', selectedFile: '' });
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if(currentId){
            dispatch(updatePost(currentId, { ...postData, name: user?.result?.name, creator: user?.result?._id}));
        } else {
            dispatch(createPost({ ...postData, name: user?.result?.name, creator: user?.result?._id}, navigate));
        }
        clear();
    }
    
    if(!user?.result?.name) {
        return (
            <Paper className={classes.paper}>
                <Typography variant="body1" align="center">
                    请登录以点赞或发布帖子
                    {/* Please log in to post your own stories or like other's stories. */}
                </Typography>
            </Paper>
        )
    }

    return(
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant='h6'>
                    { currentId ? '编辑' : '创建' } 帖子
                </Typography>
                {/* <TextField name="creator" variant="outlined" label="creator" fullWidth value={postData.creator} onChange={(event) => setPostData({ ...postData, creator: event.target.value })}/> */}
                <TextField name="title" variant="outlined" label="title" fullWidth value={postData.title} onChange={(event) => setPostData({ ...postData, title: event.target.value })}/>
                <TextField name="message" variant="outlined" label="Message" fullWidth multiline rows={4} value={postData.message} onChange={(event) => setPostData({ ...postData, message: event.target.value })} />
                <TextField name="tags" variant="outlined" label="tags" fullWidth value={postData.tags} onChange={(event) => setPostData({ ...postData, tags: event.target.value.split(',') })}/>
                <div className={classes.fileInput}>
                    <FileBase
                        type="file"
                        multiple={false}
                        onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })}
                        />
                </div>
                <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>发布</Button>
                <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>清除</Button>
            </form>
        </Paper>
    );
}

export default Form;