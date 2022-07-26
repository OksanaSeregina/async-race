import { EngineRepository } from './engine.repository';
import { IDrive, IEngine, IEngineRequest } from '../models';

export class EngineService {
  private static _instance: EngineService;

  constructor(private engineRepository: EngineRepository) {
    if (!EngineService._instance) {
      EngineService._instance = this;
    }
    return EngineService._instance;
  }

  /**
   * Starts or stops engine
   */
  public startStop(request: IEngineRequest): Promise<IEngine> {
    return this.engineRepository.startStop(this.getQuery(request));
  }

  /**
   * Switches engine to drive mode
   */
  public switchToDrive(request: IEngineRequest): Promise<IDrive> {
    return this.engineRepository.switchToDrive(this.getQuery(request));
  }

  private getQuery(request: IEngineRequest): string {
    const { id, status } = request;
    return `id=${id}&status=${status}`;
  }
}
