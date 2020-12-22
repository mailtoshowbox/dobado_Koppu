import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoxController } from './box.controller';
import { BoxService } from './box.service';
import { Boxes, BoxSchema } from './schemas/box.schema';
import { Racks, RackSchema } from './schemas/rack.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Boxes.name, schema: BoxSchema },
      { name: Racks.name, schema: RackSchema },
    ]),
  ],
  controllers: [BoxController],
  providers: [BoxService ],
})
export class BoxModule {}
