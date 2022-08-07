import { EngineApi } from './engine.api';
import { IDrive, IEngine, IEngineRequest } from '../models';

/**
 * Engine facade service
 */
export class EngineService {
  private static _instance: EngineService;

  constructor(private api: EngineApi) {
    if (!EngineService._instance) {
      EngineService._instance = this;
    }
    return EngineService._instance;
  }

  /**
   * Starts or stops engine
   */
  public startStop(request: IEngineRequest): Promise<IEngine> {
    return this.api.startStop(this.getQuery(request));
  }

  /**
   * Switches engine to drive mode
   */
  public switchToDrive(request: IEngineRequest): Promise<IDrive> {
    return this.api.switchToDrive(this.getQuery(request));
  }

  private getQuery(request: IEngineRequest): string {
    const { id, status } = request;
    return `id=${id}&status=${status}`;
  }
}
