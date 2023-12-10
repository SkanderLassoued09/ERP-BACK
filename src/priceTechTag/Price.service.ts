import { Injectable } from '@nestjs/common';

@Injectable()
export class PriceTechService {
  private priceTech: number = 10; 

  getPriceTech(): number {
    return this.priceTech;
  }

  updatePriceTech(newPriceTech: number): void {
    this.priceTech = newPriceTech;
  }
}
