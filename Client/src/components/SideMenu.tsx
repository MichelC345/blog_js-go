"use client";
import { useEffect, useState } from "react";
import { Lexend_Deca } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/sidemenu.css";

import { Box, Modal, TextField, TextareaAutosize, Typography } from "@mui/material";
import { Button } from "react-bootstrap";
import axios from "axios";
import { PostInterface, usePostContext } from "@/context/PostContext";
import { Post } from "./PostComponent";


const lexend_deca = Lexend_Deca({
    subsets: ['latin'],
    display: 'swap',
});

export const SideMenu = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);

    const [author, setAuthor] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");

    const [searchInputText, setSearchInputText] = useState("");
    const [filteredPosts, setFilteredPosts] = useState<PostInterface[]>();

    const {posts, addPost} = usePostContext();

    const [msgError, setMsgError] = useState("");
    const [isInLandingPage, setIsInLandingPage] = useState<boolean>(false);

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

    useEffect(() => {
        if(window.location.pathname.toLowerCase() === "/"){
            setIsInLandingPage(true);
        } else {
            setIsInLandingPage(false);
        }
    }, []);

    const handleSearchForPosts = () => {
        if (searchInputText.startsWith("#")) { // Filtrar por tag
            const tagToSearch = searchInputText.substring(1); // Remove o caractere "#" do início
            const filteredByTag = posts.filter(post => post.tags.some(tag => tag.toLowerCase().includes(tagToSearch)));
            setFilteredPosts(filteredByTag);
        } else if (searchInputText.startsWith("@")) { // Filtrar por autor
            const authorToSearch = searchInputText.split("@")[1].trim(); // Remover o "@", e trim() para remover espaços em branco extras
            const filteredByAuthor = posts.filter(post => post.author.toLowerCase().includes(authorToSearch.toLowerCase()));
            setFilteredPosts(filteredByAuthor);
        } else { // Filtrar por conteúdo
            const filteredByContent = posts.filter(post => post.title.toLowerCase().includes(searchInputText) || post.content.toLowerCase().includes(searchInputText));
            setFilteredPosts(filteredByContent);
        }   
    }

    const handleAddNewPost = () => {
        const tagsArray = tags.split(",").map(item=> item.trim());
        const tagsArrayFiltered = tags.split(",").filter(item=> item.length >= 4).map(item=> item.trim());

        axios.post('http://localhost:8080/create', {
            title: title,
            content: content,
            tags: tagsArrayFiltered,
            tagsOriginalSize: tagsArray.length,
            author: author
        }, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
            if(response.status === 200){
                console.log("Deu certo!");
                const realId = response.data.id;
                addPost({
                    id: realId,
                    title: title,
                    content: content,
                    date: new Date(),
                    tags: tagsArrayFiltered,
                    author: author,
                })
                setShowAddModal(false);
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

    return (
        <>
            <div className={`${lexend_deca.className} sidemenu`}>
                <div className={isInLandingPage ? "hidden text-center" : "block text-center"} onClick={() => document.location.assign("/")}>
                    <i className="bi-house text-green-blog"></i>
                    <p className="menuText">home</p>
                </div>
                <div className={isInLandingPage ? "block text-center" : "hidden text-center"} onClick={() => setShowSearchModal(true)}>
                    <i className="bi-search text-green-blog"></i>
                    <p className="menuText">search</p>
                </div>
                <div className="text-center" onClick={() => setShowAddModal(true)}>
                    <i className="bi-plus-circle text-green-blog"></i>
                    <p className="menuText">add</p>
                </div>
            </div>

            <Modal // Modal de inserção
                open={showAddModal} 
                onClose={() => setShowAddModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={{...style}}>
                    <ul>{msgError}</ul>
                    <Typography id="modal-modal-title" variant="h6" component="h2" style={{fontWeight: "bold"}}>
                    Criar novo post:
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <input type="text" placeholder="Título do Post" className="input" value={title} onChange={name => setTitle(name.target.value)}/>
                        <TextareaAutosize placeholder="Comente sobre algo..." className="input textArea" value={content} onChange={cont => setContent(cont.target.value)}/>
                        <input type="text" placeholder="Tags do post... ex: programming, technology, culture" className="input" value={tags} onChange={text => setTags(text.target.value)}/>
                        <input type="text" placeholder="Digite o seu nome de usuário" className="input" value={author} onChange={author => setAuthor(author.target.value)}/>
                        <Button onClick={handleAddNewPost}>Adicionar</Button>
                    </Typography>
                </Box>
            </Modal>

            <Modal // Modal de busca
                open={showSearchModal} 
                onClose={() => setShowSearchModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={{...style}}>
                    <ul>{msgError}</ul>
                    <Typography id="modal-modal-title" variant="h6" component="h2" style={{fontWeight: "bold"}}>
                    Procurar por posts:
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <div className="upperSearchPanel">
                            <input type="text" placeholder="Procurar por título, @autor, #tags" className="inputSearch" value={searchInputText} onChange={text => {setSearchInputText(text.target.value); handleSearchForPosts();}}/>
                        </div>
                        <div className="foundPosts">
                        {searchInputText && filteredPosts && 
                        filteredPosts.sort((a: PostInterface, b: PostInterface) => (b.id && a.id) ? b.id - a.id : 0) // Ordenar por id de forma decrescente
                        .map((post, index) => (
                            <Post
                                key={post.id || posts.length - 1 - index}
                                title={post["title"]}
                                content={post["content"]}
                                id={post["id"] ?? 0}
                                tags={post["tags"]}
                                date={post["date"]}
                                author={post["author"]}
                            />
                        ))}
                        </div>
                    </Typography>
                </Box>
            </Modal>
        </>
    );
}