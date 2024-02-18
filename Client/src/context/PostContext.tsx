"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface PostInterface {
  id?: number;
  title: string;
  content: string;
  tags: string[];
  author: string;
  date: Date;
}

interface PostContextProps {
  posts: PostInterface[];
  addPost: (newPost: PostInterface) => void;
}

const PostContext = createContext<PostContextProps | undefined>(undefined);

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePostContext must be used within a PostProvider');
  }
  return context;
};

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<PostInterface[]>([]);

  const addPost = (newPost: PostInterface) => {
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };

  return (
    <PostContext.Provider value={{ posts, addPost }}>
      {children}
    </PostContext.Provider>
  );
};
