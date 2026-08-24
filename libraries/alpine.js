<!DOCTYPE html>
<html lang="en" data-theme="dark">
  <head>
    <title>getFile: An easy way to save any file over the internet!</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, interactive-widget=resizes-content">
    <meta name="description" content="An easy way to save any file over the internet!">
    <meta name="author" content="Michael Schwartz">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="application-name" content="getFile: An easy way to save any file over the internet!">
    <meta name="theme-color" content="hsl(205deg 18.75% 87.45%)">
    <meta name="apple-mobile-web-app-title" content="getFile: An easy way to save any file over the internet!">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="msapplication-starturl" content="./index.html">
    <meta name="msapplication-navbutton-color" content="hsl(205deg 18.75% 87.45%)">
    <meta property="og:url" content="https://michaelsboost.com/getFile" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="getFile: An easy way to save any file over the internet!" />
    <meta property="og:description" content="An easy way to save any file over the internet!" />
    <link rel="manifest" href="manifest.json">
    <link rel="shortcut icon" type="image/x-icon" href="imgs/logo.svg">
    <link rel="icon" type="image/svg+xml" href="imgs/logo.svg" />
    <link rel="apple-touch-icon" href="imgs/logo.svg">
    <link rel="stylesheet" href="dist/bundle.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
    
  </head>
  <body>
    
<div id="root" class="absolute inset-0 overflow-auto"></div>

    <script src="dist/script.js" type="module"></script>
    <script src="https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"></script>
    <script>
      // service worker for progressive web app
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js')
        })
      }
    </script>
  </body>
</html>