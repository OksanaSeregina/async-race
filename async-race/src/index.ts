import { App } from './app';
import { Header, Pagination, Modal } from './components';
import { GarageService, GarageApi, EngineService, EngineApi, WinnersService, WinnersApi } from './core';
import { Garage, Winners } from './pages';
import './global.scss';

const root = <HTMLElement>document.querySelector('#root');

const garageService = new GarageService(new GarageApi());
const engineService = new EngineService(new EngineApi());
const winnersService = new WinnersService(new WinnersApi());

const modal: Modal = new Modal(root);
const header: Header = new Header(root);
const pagination: Pagination = new Pagination(root);
const garage: Garage = new Garage(garageService, engineService, pagination);
const winners: Winners = new Winners(root, modal, garage, winnersService, pagination);

const app = new App(root, header, garage, winners, pagination);
void app.start();
