import React from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Typography } from '@material-ui/core';

export default function About() {
  return (
    <div className={styles.container}>
      <Head>
        <title>About Amazona</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>About Amazona</h1>
        <Typography variant="body1" component="p">
          Description
        </Typography>
        <p className={styles.description}></p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
