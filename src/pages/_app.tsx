import { AppProps } from 'next/app';
import '../styles/globals.scss';

import Header from '../components/Header';
import { PrismicPreview } from '@prismicio/next';
import { PrismicProvider } from '@prismicio/react';
import Link from 'next/link';
import { linkResolver, repositoryName } from '../services/prismic';


function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <PrismicProvider
    linkResolver={linkResolver}
    internalLinkComponent={({ href, children, ...props }) => (
      <Link href={href}>
        <a {...props}>
          {children}
        </a>
      </Link>
    )}
  >
    <PrismicPreview repositoryName={repositoryName}>
      <Header />
      <Component {...pageProps} />
    </PrismicPreview>
  </PrismicProvider>
  );
}

export default MyApp;
