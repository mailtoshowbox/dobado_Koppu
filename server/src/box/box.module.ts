import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoxController } from './box.controller';
import { BoxService } from './box.service';
import { BoxClass, BoxSchema } from './schemas/box.schema';
import { RackClass, RackSchema } from './schemas/rack.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BoxClass.name, schema: BoxSchema },
      { name: RackClass.name, schema: RackSchema },
    ]),
  ],
  controllers: [BoxController],
  providers: [BoxService ],
})
export class BoxModule {}
