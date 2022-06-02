import { GetStaticPaths, GetStaticProps, PreviewData  } from 'next';
import Head from 'next/head';
import { PrismicText } from '@prismicio/react'

import { getPrismicClient } from '../../services/prismic';
import { FaCalendarAlt, FaClock, FaUserAlt } from 'react-icons/fa';
import { format} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { stringify } from 'querystring';
import Header from '../../components/Header';
import { useEffect, useState } from 'react';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

interface StaticProps extends GetStaticProps {
  previewData: PreviewData;
  params: {
      slug: string;
  };
}



export default function Post({ post }: PostProps) {
  const [readTime, setReadTime] = useState(0);

  useEffect(() => {
    function contWords(){
      let fullText = '';
      const readWordsPerMinute = 200;

      post.data.content.forEach(postContent => {
        fullText += postContent.heading;
        fullText += RichText.asText(postContent.body);
      });

      const time = Math.ceil(fullText.split(/\s/g).length / readWordsPerMinute);
  
      setReadTime(time);
    }

    contWords();
  }, []);

  
  return (
    <>
      <Head>
        <title> {post.data.title} | spacetraveling</title>
      </Head>
      <Header />
      <div className={styles.banner}>
        <img src={post.data.banner.url} alt='banner'/>
      </div>
      <main className={styles.container}>
        <article className={styles.post}>
            <h1>{post.data.title}</h1>
            <div className={styles.info}>
              <time><FaCalendarAlt size={12}/> {post.first_publication_date}</time>
              <span className={styles.author}><FaUserAlt size={12}/> {post.data.author}</span>
              <span className={styles.reading}><FaClock size={12} /> {readTime} min</span>
            </div>
            
            <div className={styles.content}>
              {post.data.content.map(item => (
                <div>
                  <p className={styles.heading} >{item.heading}</p> 
                  <p className={styles.body}>{RichText.asText(item.body)}</p>
                   
                </div>
              ))}
            </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts= await prismic.getByType('posts', {
    pageSize: 1,
  });

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({previewData, params }: StaticProps ) => {
  const { slug } = params
  const prismic = getPrismicClient({ previewData });
  const response = await prismic.getByUID('posts', slug);
  


  const post= {
      first_publication_date: format(
        new Date(response.first_publication_date),
        'dd MMM yyyy',
        { locale: ptBR }
      ),
      data: {
        title: response.data.title,
        banner: {
          url: response.data.banner.url
        },
        author: response.data.author,
        content: response.data.content.map(item => {
          return {
            heading: item.header,
            body: item.body
          }  
      })
      }
  }
 
  return {
    props: { post }, // Will be passed to the page component as props
}
};
