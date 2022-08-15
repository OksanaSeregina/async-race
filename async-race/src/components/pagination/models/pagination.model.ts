export interface IPagination {
  garage: number;
  winners: number;
  selected: 'garage' | 'winners';
  maxGarage?: number;
  maxWinners?: number;
}
