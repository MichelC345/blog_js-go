"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { DM_Serif_Display, Lexend_Deca} from "next/font/google";
import { ContainerS } from "@/components/ContainerS";
import { SideMenu } from "@/components/SideMenu";
import "../../../styles/fullPost.css";
import { PostInterface } from "@/context/PostContext";
import { PostProvider } from "@/context/PostContext";
import { Author } from "@/components/Author";
import { Button } from "react-bootstrap";
import { Box, Modal, SpeedDial, SpeedDialAction, SpeedDialIcon, TextField, TextareaAutosize, Typography } from "@mui/material";
import { Comment, CommentType } from "@/components/Comment";

const dms_d = DM_Serif_Display({ subsets: ['latin'], weight: "400", variable: "--font-dmsd"});
const lex_d = Lexend_Deca({subsets: ['latin']});

const post = ({params}: {params: { id: string}}) => {
    const [post, setPostData] = useState<PostInterface>();
    const [comments, setComments] = useState<CommentType[]>();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [msgError, setMsgError] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const [commentAuthor, setCommentAuthor] = useState("");
    const [commentContent, setCommentContent] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/posts/${Number.parseInt(params.id)}`);
                setPostData(response.data);

                setTitle(response.data.title);
                setContent(response.data.content);
                setTags(response.data.tags.join());
            } catch (error) {
                console.error("Houve um erro ao tentar procurar pelos posts:", error);
            }
        }

        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/comments/${Number.parseInt(params.id)}`);
                if(response.status === 200){
                    console.log(response.data);
                    setComments(response.data);
                }
            } catch (error) {
                console.error("Houve um erro ao tentar procurar pelos comentários:", error);
            }
        }

        fetchPost();
        fetchComments();
    }, [params.id]);

    const dataParsed = post && post.date ? new Date(post.date.toString()) : null;
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dec"];

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "80%",
        bgcolor: "#272727",
        color: "#fff",
        border: '1px solid #0a70b8',
        borderRadius: '10px',
        pt: 2,
        px: 4,
        pb: 3,
    };

    const commentsStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "80%",
        bgcolor: "#272727",
        color: "#fff",
        border: '1px solid #0a70b8',
        borderRadius: '10px',
        pt: 2,
        px: 4,
        pb: 3,
    };

    const handleEditPost = () => {
        const tagsArray = tags.split(",").map(item=> item.trim());
        const tagsArrayFiltered = tags.split(",").filter(item=> item.length >= 4).map(item=> item.trim());
        axios.post(`http://localhost:8080/posts/${Number.parseInt(params.id)}/edit`, {
            editedTitle: title,
            editedContent: content,
            editedTags: tagsArrayFiltered,
            editedTagsOriginalSize: tagsArray.length
        }, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
            if(response.status === 200){
                console.log("Edição feita com sucesso.");
                setShowEditModal(false);
                setTitle("");
                setContent("");
                setTags("");
            }
        })
        .catch(error => {
          console.error(error);
          setMsgError(error.response.data);
        });
    }

    const handleRemovePost = () => {
        axios.get(`http://localhost:8080/posts/${params.id}/remove`)
        .then((response) => {
            if(response.status === 200){
                console.log("Item removido com sucesso!");
            }
        })
        document.location.assign("/");
    }

    const handleAddComment = () => {
        console.log("Autor: ", commentAuthor);
        console.log("Conteúdo: ", commentContent);
        axios.post(`http://localhost:8080/posts/${params.id}/createComment`, {
            author: commentAuthor,
            comment: commentContent,
        }, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
            if(response.status === 200){
                console.log("Deu certo!");
                /*
                addPost({
                    id: realId,
                    title: title,
                    content: content,
                    date: new Date(),
                    tags: tagsArrayFiltered,
                    author: author,
                })
                */
                setShowCommentsModal(false);
                setCommentAuthor("");
                setCommentContent("");
            }
        })
        .catch(error => {
          console.error(error);
          setMsgError(error.response.data);
        });
    }

    const actions = [
        { icon: <i className="bi-pencil-fill"/>, name: 'Editar', do: () => setShowEditModal(true)},
        { icon: <i className="bi-trash3-fill"/>, name: 'Remover', do: () => setShowRemoveModal(true)},
    ];


    return(
        <PostProvider>
            <ContainerS>
                <SideMenu />
                <Modal //modal para editar posts
                    open={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                    <Box sx={{...style}}>
                        <ul>{msgError}</ul>
                        <Typography id="modal-modal-title" variant="h6" component="h2" style={{fontWeight: "bold"}}>
                        Editar este post:
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <input type="text" placeholder="Título do Post" className="input" value={title} onChange={name => setTitle(name.target.value)}/>
                            <TextareaAutosize placeholder="Comente sobre algo..." className="input textArea" value={content} onChange={cont => setContent(cont.target.value)}/>
                            <input type="text" placeholder="Tags do post... ex: programming, technology, culture" className="input" value={tags} onChange={text => setTags(text.target.value)}/>
                            <Button onClick={handleEditPost}>Editar</Button>
                        </Typography>
                    </Box>
                </Modal>

                <Modal //modal para confirmar remoção de um post
                    open={showRemoveModal}
                    onClose={() => setShowRemoveModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                    <Box sx={{...style}}>
                        <ul>{msgError}</ul>
                        <Typography id="modal-modal-title" variant="h6" component="h2" style={{fontWeight: "bold"}}>
                        Deseja realmente remover este post?
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <Button onClick={handleRemovePost}>Sim</Button>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <Button onClick={() => setShowRemoveModal(false)}>Não</Button>
                        </Typography>
                    </Box>
                </Modal>

                <div className="containerFullPost">
                    {post && dataParsed && (<div className="postAndComments">
                    <div className="content">
                        <div className="headerPost">
                            <div className="mb-10 w-76pc text-left">
                                <p className={`${dms_d.className} titlePost text-green-blog`}>{post.title}</p>
                                <p className={`${lex_d.className} subtitlePost font-light text-subtitle-gray`}>written by <Author name={post.author}></Author></p>
                                <p className={`${lex_d.className} subtitlePost font-light text-subtitle-gray`}>on {dataParsed.getDate() < 10 ? "0" + dataParsed.getDate() : dataParsed.getDate()} {monthNames[dataParsed.getMonth()]} {dataParsed.getFullYear()}</p>
                            </div>
                            
                            <SpeedDial 
                                ariaLabel="Post actions" 
                                icon={<i className="bi-chevron-down"/>}
                                direction="down"
                                className="dialButton"
                                >
                                    { actions.map((action) => (
                                        <SpeedDialAction
                                            key={action.name}
                                            tooltipTitle={action.name}
                                            icon={action.icon}
                                            onClick={action.do}
                                        />
                                    ))}
                            </SpeedDial>
                        </div>
                   
                        <div className="postContent has-dropcap overflow-auto scrollbar">
                            <p>
                            {post.content}
                            </p>
                        </div>
                    </div>

                    <button className="commentButton" onClick={() => setShowCommentsModal(true)}><i className="bi-chat-dots text-xl"></i></button>
                    </div>)}
                </div>

                <Modal // Modal dos comentários
                open={showCommentsModal} 
                onClose={() => setShowCommentsModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={{...commentsStyle}}>
                    <ul>{msgError}</ul>
                    <Typography id="modal-modal-title" variant="h6" component="h2" style={{fontWeight: "bold"}}>
                    Comentários nesse post:
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <div className="comments">
                            {comments ? comments.map((comment: CommentType, index: number) => (
                                <Comment
                                    key={index}
                                    author={comment.author}
                                    content={comment.content}
                                    date={comment.date}
                                />
                            )) : "Sem comentários disponíveis...."}
                        </div>
                        <div className="addCommentPanel"> 
                            <input type="text" placeholder="Digite o seu nome de usuário" className="input" value={commentAuthor} onChange={author => setCommentAuthor(author.target.value)}/>
                            <TextareaAutosize placeholder="Conteúdo do comentário..." className="input textArea" value={commentContent} onChange={cont => setCommentContent(cont.target.value)}/>
                            <Button onClick={handleAddComment}>Adicionar</Button>
                        </div>
                    </Typography>
                </Box>
                </Modal>
            </ContainerS>
        </PostProvider>
    );
}

export default post;