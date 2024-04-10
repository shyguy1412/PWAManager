const api = (await import('./main/preload')).API_IDENTIFIER;
declare interface Window {
  [api]: typeof import('./main/preload').API;
}