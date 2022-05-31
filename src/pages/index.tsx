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

 export default function Home({ posts }: Post) {
   return (
    <>
      <Head>
        <title>Posts | spacetraveling</title>
      </Head>
      <Header />
      <main className={styles.container}>
        <div className={styles.postContent}>
          { posts.map(post => (
            <div className={styles.post}>
              <Link href={post.uid}>
                <a><h1>{post.data.title}</h1></a>
              </Link>
                <p className={styles.subtitle}>{post.data.subtitle}</p>
                <div className={styles.meta}>
                  <time><FaCalendarAlt size={15}/> {post.first_publication_date}</time>
                  <span className={styles.author}><FaUserAlt size={15}/> {post.data.author}</span>
                </div>
            </div>
          )) }
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
      pageSize: 5,
    });
    
    const posts = postsResponse.results?.map((post:any) => {
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
  
   return{
     props: { posts }
   }
};
