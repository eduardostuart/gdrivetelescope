declare global {
  interface Window {
    onGapiLoad: Function;
    gapi: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

export {}
