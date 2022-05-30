import { GetStaticPaths, GetStaticProps, PreviewData } from 'next';
import Head from 'next/head';

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

 export default function Home() {
   return (
    <>
      <Head>
        <title>spacetraveling</title>
      </Head>
      <main>
        <section>
          <span>Olá, eu aqui</span>
        </section>
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
    const postsResponse = await prismic.getByType('posts', {
      pageSize: 5,
    });

    const post = {}

   return{
     props: { post }
   }
};
