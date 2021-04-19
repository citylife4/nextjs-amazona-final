import React from 'react';
import Head from 'next/head';
import { Typography } from '@material-ui/core';

export default function About() {
  return (
    <div>
      <Head>
        <title>About Amazona</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>About Amazona</h1>
        <Typography variant="body1" component="p">
          Description
        </Typography>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <img src="/vercel.svg" alt="Vercel Logo" />
        </a>
      </footer>
    </div>
  );
}
