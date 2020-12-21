import { Model } from 'mongoose';
import { Box } from './interfaces/box.interface';
import { BoxClass } from './schemas/box.schema';
import { RackClass } from './schemas/rack.schema';
import { Rack } from './interfaces/rack.interface';
export declare class BoxService {
    private readonly boxModel;
    private readonly rackModel;
    constructor(boxModel: Model<BoxClass>, rackModel: Model<RackClass>);
    findAll(): Promise<Box[]>;
    findOne(id: string): Promise<Box>;
    getRacks(id: string): Promise<Rack[]>;
    createRack(rack: Rack): Promise<Rack>;
    create(box: Box): Promise<Box>;
    delete(id: string): Promise<Box>;
    update(id: string, box: Box): Promise<Box>;
}
