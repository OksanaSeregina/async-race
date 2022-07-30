import { Garage, BtnHeader, BtnControl } from './components';
import { GarageService, GarageRepository, EngineService, EngineRepository } from './core';

import './global.scss';

const garageService = new GarageService(new GarageRepository());
const engineService = new EngineService(new EngineRepository());

// TODO: Remove me
const garage: Garage = new Garage(garageService, engineService);
void garage.init();

const btnControl: BtnControl = new BtnControl(document.querySelector('#root'));
btnControl.init();

const buttons: BtnHeader = new BtnHeader(document.querySelector('#root'));
buttons.init();
