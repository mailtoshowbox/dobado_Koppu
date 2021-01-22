import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsModule } from './products/products.module';
import { BoxModule } from './box/box.module';
import { DocCategoryModule } from './docCategory/docCategory.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import config from './config/keys';


@Module({
  imports: [MongooseModule.forRoot(config.mongoURI), DocumentsModule,BoxModule, DocCategoryModule, AuthModule ]
 
})
export class AppModule {}
