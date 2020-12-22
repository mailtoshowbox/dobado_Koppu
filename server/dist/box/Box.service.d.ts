import { Model } from 'mongoose';
import { Box } from './interfaces/box.interface';
import { Boxes } from './schemas/box.schema';
import { Racks } from './schemas/rack.schema';
import { Rack } from './interfaces/rack.interface';
export declare class BoxService {
    private readonly boxModel;
    private readonly rackModel;
    constructor(boxModel: Model<Boxes>, rackModel: Model<Racks>);
    findAll(): Promise<Box[]>;
    findOne(id: string): Promise<Box>;
    getRacks(id: string): Promise<Rack[]>;
    createRack(rack: Rack): Promise<Rack>;
    create(box: Box): Promise<Box>;
    delete(id: string): Promise<Box>;
    update(id: string, box: Box): Promise<Box>;
}
