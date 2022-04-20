import './style.css';
import liff from '@line/liff';

liff
  .init({
    liffId: import.meta.env.VITE_LIFF_ID
  })
  .then(() => {
    document.querySelector('#app').innerHTML = `
    <h1>create-liff-app</h1>
    <p>LIFF init succeeded.</p>
    <a href="https://developers.line.biz/ja/docs/liff/" target="_blank" rel="noreferrer">
      LIFF Documentation
    </a>
  `;
  })
  .catch((error) => {
    document.querySelector('#app').innerHTML = `
    <h1>create-liff-app</h1>
    <p>LIFF init failed.</p>
    <p><code>${error}</code></p>
    <a href="https://developers.line.biz/ja/docs/liff/" target="_blank" rel="noreferrer">
      LIFF Documentation
    </a>
  `;
  });
