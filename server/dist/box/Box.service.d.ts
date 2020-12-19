import { Model } from 'mongoose';
import { Box } from './interfaces/box.interface';
import { BoxClass } from './schemas/box.schema';
export declare class BoxService {
    private boxModel;
    constructor(boxModel: Model<BoxClass>);
    findAll(): Promise<Box[]>;
    findOne(id: string): Promise<Box>;
    create(box: Box): Promise<Box>;
    delete(id: string): Promise<Box>;
    update(id: string, box: Box): Promise<Box>;
}
