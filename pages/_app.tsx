import "../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <title>Blogging Application</title>
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
