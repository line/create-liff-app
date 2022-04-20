// This function is executed before instantiating the app
// only in client-side.
// document: https://nuxtjs.org/docs/2.x/directory-structure/plugins 

// import NPM version LIFF JS SDK
import liff from '@line/liff';

export default (_, inject) => {
  // You can access liff object as this.$liff by inject()
  inject('liff', liff);

  // execute liff.init()
  const initResult = liff.init({liffId: process.env.LIFF_ID})
    .then(() => {
      console.log('LIFF init succeeded.');
    })
    .catch(error => {
      console.log('LIFF init failed.');
      return Promise.reject(error);
    });

  // You can access liff.init()'s return value (Promise object)
  // as this.$liffInit() by inject()
  inject('liffInit', initResult);
}
