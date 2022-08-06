import { Endpoints } from '../../constants';
import { headers } from '../garage';
import { IWinners } from '../models';

function getResponse<T>(response: Response, result?: Promise<T>): Promise<T> {
  const isNotSuccess = !response.ok;
  if (isNotSuccess) {
    throw new Error();
  }
  return result || response.json();
}

export class WinnersRepository {
  private static _instance: WinnersRepository;

  constructor() {
    if (!WinnersRepository._instance) {
      WinnersRepository._instance = this;
    }
    return WinnersRepository._instance;
  }

  /* Returns json data about winners */
  public getWinners(query?: string): Promise<Array<IWinners>> {
    return fetch(`${Endpoints.AppHost}/${query ? `winners?${query}` : 'winners'}`, {
      method: 'GET',
    }).then((res) => getResponse<Array<IWinners>>(res));
  }

  /* Returns json data about specified winner */
  public getWinner(id: number): Promise<IWinners> {
    return fetch(`${Endpoints.AppHost}/winners/${id}`, {
      method: 'GET',
    }).then((res) => getResponse(res));
  }

  /* Creates a new records in a winners table */
  public createWinner(request: IWinners): Promise<IWinners> {
    return fetch(`${Endpoints.AppHost}/winners`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    }).then((res) => getResponse(res));
  }

  /* Delete specified car from a garage */
  public deleteWinner(id: number): Promise<void> {
    return fetch(`${Endpoints.AppHost}/winners/${id}`, {
      method: 'DELETE',
    }).then((res) => getResponse(res));
  }

  /* Updates attributes of specified winner */
  public updateWinner(request: IWinners): Promise<IWinners> {
    const { id, ...car } = request;
    return fetch(`${Endpoints.AppHost}/winners/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(car),
    }).then((res) => getResponse(res));
  }
}
