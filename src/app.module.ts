import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketModule } from './ticket/ticket.module';
import { ProfileModule } from './profile/profile.module';
import { ClientModule } from './client/client.module';
import { LocationModule } from './location/location.module';
import { IssueModule } from './issue/issue.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CategoryModule } from './category/category.module';

import { NotificationHatewayModule } from './notifications/notification.module';
import { ComposantModule } from './composant/composant.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://skander009:pAkAJsxUvBbzsIv8@tpedb.yy1h9.mongodb.net/ERP?retryWrites=true&w=majority',
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,

      playground: true,
      introspection: true,

      context: ({ req }) => ({ req }),
    }),

    TicketModule,
    ProfileModule,
    ClientModule,
    LocationModule,
    IssueModule,
    AuthModule,
    CategoryModule,
    NotificationHatewayModule,
    ComposantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
