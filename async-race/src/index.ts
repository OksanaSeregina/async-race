import { App } from './app';
import { Garage, Header, Pagination } from './components';
import { GarageService, GarageRepository, EngineService, EngineRepository } from './core';
import { Winners } from './pages';
import './global.scss';

const root = <HTMLElement>document.querySelector('#root');

const garageService = new GarageService(new GarageRepository());
const engineService = new EngineService(new EngineRepository());

const header: Header = new Header(root);
const winners: Winners = new Winners(root);
const pagination: Pagination = new Pagination(root);
const garage: Garage = new Garage(garageService, engineService, pagination);

const app = new App(root, header, garage, winners, pagination);
void app.start();
