/**
 * Interface for Engine request
 */
export interface IEngineRequest {
  /**
   * Car id
   */
  id: number;

  /**
   * Engine status
   */
  status: 'started' | 'stopped' | 'drive';
}
