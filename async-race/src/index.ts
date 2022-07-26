import { Garage } from './components';
import { GarageService, GarageRepository, EngineService, EngineRepository } from './core';

const garageService = new GarageService(new GarageRepository());
const engineService = new EngineService(new EngineRepository());

// TODO: Remove me
const garage: Garage = new Garage(garageService, engineService);
void garage.init();
