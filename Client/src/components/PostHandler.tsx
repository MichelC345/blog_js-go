"use client";
import { Post } from "./PostComponent";
import { PostInterface } from "@/context/PostContext";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { TablePagination } from "@mui/material";
import "../styles/posts.css";
import { usePostContext } from "@/context/PostContext";


export const PostHandler = () => {
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const {addPost} = usePostContext();
    const {posts} = usePostContext();
    const [message, setMessage] = useState("Procurando por postagens...");
    const [showPost, canShowPost] = useState(true);

    let curPage: number;
    const initialized = useRef(false);
    useEffect(() => {  
        if(!initialized.current){
            initialized.current = true;
            canShowPost(true);
            const queryParameters = new URLSearchParams(window.location.search);
            const pageQueryParam = queryParameters.get("page");
            const rowsQueryParam = queryParameters.get("rows");
            if(pageQueryParam){
                curPage = Number.parseInt(pageQueryParam || "0", 10);
                setPage(curPage);
            } else {
                setPage(0);
            }
            if(rowsQueryParam){
                setRowsPerPage(Number.parseInt(rowsQueryParam || "0", 10));
            } else {
                setRowsPerPage(10);
            }
    
            const fetchPosts = async () => {
                try {
                    const response = await axios.get("http://localhost:8080/posts");
                    console.log(response.data);

                    // Adiciona os posts ao contexto usando a função addPost
                    response.data.forEach((postDb: PostInterface) => {
                        addPost({
                            id: postDb.id,
                            title: postDb.title,
                            content: postDb.content,
                            tags: postDb.tags,
                            date: postDb.date,
                            author: postDb.author,
                        });
                    });
  
                } catch (error) {
                    console.error("Houve um erro ao tentar procurar pelos posts:", error);
                    setMessage("Não há publicações disponíveis...");
                }
            };
            fetchPosts();
        }      
    }, []);

    const handleNextPage = (event: any, newPage: number) => {
        canShowPost(false);
        setPage(newPage);
        document.location.href = `?page=${newPage}&rows=${rowsPerPage}`;
    };

    return(
        <div className="postsContainer">
            {(posts.length > 0 && showPost) && 
                (
                <div className="">
                    <div className="overflow-auto scrollbar posts">       
                    {posts
                    .sort((a, b) => (b.id && a.id) ? b.id - a.id : 0) // Ordenar por id de forma decrescente
                    .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
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
                    </div><br/>
                    <TablePagination
                    style={{color: "white"}}
                    className="pagination"
                    component="span"
                    count={100}
                    page={page}
                    onPageChange={handleNextPage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {setRowsPerPage(+event?.target.value)}}
                    labelRowsPerPage={"Posts:"}
                    />
                </div>
                )
            }  
            {posts.length == 0 && <div className="w-fullFlex h-full flex items-center justify-center"><div className="text-center">{message}</div></div>}
        </div>
    );
}