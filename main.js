import express from 'express';
const app = express();
import { port, path, finalUrl } from './config.js';

/*app.use('/favicons', express.static(process.cwd() + '/assets/website/favicons'));*/
app.use(express.static('public'));
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at ${finalUrl}`);
});
