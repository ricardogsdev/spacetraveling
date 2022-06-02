import { GetStaticPaths, GetStaticProps, PreviewData } from 'next';
import Header from '../components/Header';
import Head from 'next/head';
import Link from 'next/link';
import { PrismicText } from '@prismicio/react';
import * as prismicH from '@prismicio/helpers';
import { FaCalendarAlt, FaUserAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useEffect, useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

 export default function Home({ postsPagination }: HomeProps) {
    const [posts, setPosts] = useState();
    const [nextPage, setNextPage] = useState();

    function loadPosts(){
      setPosts(postsPagination.results);
      setNextPage(postsPagination.next_page);
    }
    useEffect(() => {
      loadPosts()
    }, [])

    async function loadMorePosts(): Promise<void> {
      const response = await fetch(`${nextPage}`).then(data =>
        data.json()
      );

     
      const newPosts = response.results?.map((post:any) => {
        return {
          uid: post.uid,
          first_publication_date: format(
            new Date(post.first_publication_date),
            'dd MMM yyyy',
            { locale: ptBR }
          ),
          data: {
            title: post.data.title,
            subtitle: post.data.subtitle,
            author: post.data.author
          }
        }
      })

      newPosts.unshift(...posts);
          
      setPosts(newPosts);
      setNextPage(response.next_page);
    }

    console.log(posts); 

   return (
    <>
      <Head>
        <title>Posts | spacetraveling</title>
      </Head>
      <Header />
      <main className={styles.container}>
        <div className={styles.postContent}>
          { posts && posts.map(post => (
            <div className={styles.post} key={post.uid}>
              <Link href={'post/'+post.uid}>
                <a><h1>{post.data.title}</h1></a>
              </Link>
                <p className={styles.subtitle}>{post.data.subtitle}</p>
                <div className={styles.meta}>
                  <time><FaCalendarAlt size={15}/> {post.first_publication_date}</time>
                  <span className={styles.author}><FaUserAlt size={15}/> {post.data.author}</span>
                </div>
            </div>
          )) 
        }
        {nextPage != null && (
          <a href='#' className={styles.btnLoadPost} onClick={loadMorePosts}>
            Carregar mais posts
          </a>
        )}
          
        </div>
        
      </main>
    </>
  );
 }

 export const getStaticPaths: GetStaticPaths = async () => {
   return {
     paths: [],
     fallback: true
   }
 }

 export const getStaticProps: GetStaticProps = async ({ previewData }) => {
    const prismic = getPrismicClient({ previewData });
    const postsResponse= await prismic.getByType('posts', {
      pageSize: 1,
    });

    const postsPagination = {
      next_page: postsResponse.next_page,
      results: postsResponse.results?.map((post:any) => {
        return {
          uid: post.uid,
          first_publication_date: format(
            new Date(post.first_publication_date),
            'dd MMM yyyy',
            { locale: ptBR }
          ),
          data: {
            title: post.data.title,
            subtitle: post.data.subtitle,
            author: post.data.author
          }
        }
      })
    };
    

   return{
     props: { 
       postsPagination
      }
   }
};
