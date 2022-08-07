import { App } from './app';
import { Garage, Header, Pagination, Modal } from './components';
import { GarageService, GarageRepository, EngineService, EngineRepository, WinnersService, WinnersRepository } from './core';
import { Winners } from './pages';
import './global.scss';

const root = <HTMLElement>document.querySelector('#root');

const garageService = new GarageService(new GarageRepository());
const engineService = new EngineService(new EngineRepository());
const winnersService = new WinnersService(new WinnersRepository());

const modal: Modal = new Modal(root);
const header: Header = new Header(root);
const pagination: Pagination = new Pagination(root);
const garage: Garage = new Garage(garageService, engineService, pagination);
const winners: Winners = new Winners(root, modal, garage, winnersService, pagination);

const app = new App(root, header, garage, winners, pagination);
void app.start();
