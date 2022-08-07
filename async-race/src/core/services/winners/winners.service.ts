import { WinnersApi } from '../../api';
import { IWinners } from '../../models';

/**
 * Winners service
 */
export class WinnersService {
  private static _instance: WinnersService;

  constructor(private api: WinnersApi) {
    if (!WinnersService._instance) {
      WinnersService._instance = this;
    }
    return WinnersService._instance;
  }

  /* Returns winners */
  public getWinners(query?: string): Promise<Array<IWinners>> {
    return this.api.getWinners(query);
  }

  /* Returns a winner */
  public getWinner(id: number): Promise<IWinners> {
    return this.api.getWinner(id);
  }

  /* Create a winner */
  public createWinner(request: IWinners): Promise<IWinners> {
    return this.api.createWinner(request);
  }

  /* Delete a winner */
  public deleteWinner(id: number): Promise<void> {
    return this.api.deleteWinner(id);
  }

  /* Update a winner */
  public updateWinner(request: IWinners): Promise<IWinners> {
    return this.api.updateWinner(request);
  }
}
