import "../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { Firebase } from "../firebase/firebase";
import { useRouter } from "next/router";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  if (router && !Firebase.auth.currentUser) {
    router.push("/login");
  }
  // useEffect(() => {
  // }, [router]);

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
