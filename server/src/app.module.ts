import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { BoxModule } from './box/box.module';
import { DocCategoryModule } from './docCategory/docCategory.module';
import config from './config/keys';

@Module({
  imports: [MongooseModule.forRoot(config.mongoURI), ProductsModule,BoxModule, DocCategoryModule, ],
})
export class AppModule {}
