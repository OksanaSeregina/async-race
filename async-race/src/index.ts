import { App } from './app';
import { Garage, Header } from './components';
import { GarageService, GarageRepository, EngineService, EngineRepository } from './core';
import { Winners } from './pages';
import './global.scss';

const garageService = new GarageService(new GarageRepository());
const engineService = new EngineService(new EngineRepository());

const garage: Garage = new Garage(garageService, engineService);
const header: Header = new Header(document.querySelector('#root'));
const winners: Winners = new Winners(document.querySelector('#root'));

const app = new App(header, garage, winners);
void app.start();
