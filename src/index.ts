import { App } from './App';
import 'bootstrap/dist/css/bootstrap.css';
import './index.scss';

const app = new App();

const main = document.querySelector('.main');
main?.append(app.render());