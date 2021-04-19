/* eslint-disable react/display-name */
import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
function MapPage() {
  const Map = React.useMemo(() =>
    dynamic(
      () => import('../components/Map'), // replace '@components/map' with your component's location
      {
        loading: () => <p>Loading Map</p>,
        ssr: false,
      } // This line is important. It's what prevents server-side render
    )
  );
  return (
    <>
      <Head>
        {/* <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
          integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
          crossOrigin=""
        ></script> */}
      </Head>
      {/* <div id="mapid"></div> */}
      <Map />
    </>
  );
}

export default MapPage;
