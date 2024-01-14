import { Module } from '@nestjs/common';
import { PriceTechService } from './price-tech.service';
import { PriceTechResolver } from './price-tech.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { PriceTechSchema } from './entities/price-tech.entity';

@Module({
  providers: [PriceTechResolver, PriceTechService],
  imports: [
    MongooseModule.forFeature([{ name: 'PriceTech', schema: PriceTechSchema }]),
  ],
})
export class PriceTechModule {}
