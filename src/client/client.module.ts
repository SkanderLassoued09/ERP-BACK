import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientResolver } from './client.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientSchema } from './entities/client.entity';

@Module({
  providers: [ClientResolver, ClientService],
  imports: [
    MongooseModule.forFeature([{ name: 'Client', schema: ClientSchema }]),
  ],
})
export class ClientModule {}
