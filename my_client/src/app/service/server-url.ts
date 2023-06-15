import { environment } from 'src/environments/environment';

let baseUrl = '';
let proxyCase = '';
if (environment.production) {
  // baseUrl = 'https://us-central1-ueldaily-hubing.cloudfunctions.net/app';
  baseUrl = 'https://c927-2001-ee1-d702-f800-cdc6-e799-d55a-770c.ngrok-free.app';
  proxyCase = 'https://us-central1-ueldaily-hubing.cloudfunctions.net/app';
  // This is only for Production Build Locally
  // baseUrl = 'http://localhost:3000';
  // proxyCase = 'http://localhost:3000';
} else {
  // baseUrl = 'https://us-central1-ueldaily-hubing.cloudfunctions.net/app';
  // baseUrl = 'https://localhost:3000';
  baseUrl = 'https://c927-2001-ee1-d702-f800-cdc6-e799-d55a-770c.ngrok-free.app';
  proxyCase = '';
}
export { baseUrl, proxyCase };
