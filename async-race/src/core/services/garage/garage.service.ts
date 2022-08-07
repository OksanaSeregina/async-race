import { GarageApi } from '../../api';
import { ICar } from '../../models';

/**
 * Garage facade service
 */
export class GarageService {
  private static _instance: GarageService;

  constructor(private api: GarageApi) {
    if (!GarageService._instance) {
      GarageService._instance = this;
    }
    return GarageService._instance;
  }

  /**
   * Returns cars
   */
  public getCars(query?: string): Promise<Array<ICar>> {
    return this.api.getCars(query);
  }

  /**
   * Returns a car
   */
  public getCar(id: number): Promise<ICar> {
    return this.api.getCar(id);
  }

  /**
   * Create a car
   */
  public createCar(request: Omit<ICar, 'id'>): Promise<ICar> {
    return this.api.createCar(request);
  }

  /**
   * Delete a car
   */
  public deleteCar(id: number): Promise<void> {
    return this.api.deleteCar(id);
  }

  /**
   * Update a car
   */
  public updateCar(request: ICar): Promise<ICar> {
    return this.api.updateCar(request);
  }
}
