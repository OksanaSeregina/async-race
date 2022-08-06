import { IWinners } from '../models';
import { WinnersRepository } from './winners.repository';

/**
 * Winners service
 */
export class WinnersService {
  private static _instance: WinnersService;

  constructor(private winnersRepository: WinnersRepository) {
    if (!WinnersService._instance) {
      WinnersService._instance = this;
    }
    return WinnersService._instance;
  }

  /* Returns winners */
  public getWinners(query?: string): Promise<Array<IWinners>> {
    return this.winnersRepository.getWinners(query);
  }

  /* Returns a winner */
  public getWinner(id: number): Promise<IWinners> {
    return this.winnersRepository.getWinner(id);
  }

  /* Create a winner */
  public createWinner(request: IWinners): Promise<IWinners> {
    return this.winnersRepository.createWinner(request);
  }

  /* Delete a winner */
  public deleteWinner(id: number): Promise<void> {
    return this.winnersRepository.deleteWinner(id);
  }

  /* Update a winner */
  public updateWinner(request: IWinners): Promise<IWinners> {
    return this.winnersRepository.updateWinner(request);
  }
}
