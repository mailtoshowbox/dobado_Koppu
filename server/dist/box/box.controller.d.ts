import { CreateBoxDto } from './dto/create-box.dto';
import { Box } from './interfaces/box.interface';
import { Rack } from './interfaces/rack.interface';
import { BoxService } from './Box.service';
export declare class BoxController {
    private readonly BoxService;
    constructor(BoxService: BoxService);
    findAll(): Promise<Box[]>;
    findOne(id: string): Promise<Box>;
    getRacks(id: string): Promise<Rack[]>;
    create(createBoxDto: CreateBoxDto): Promise<Box>;
    delete(id: string): Promise<Box>;
    update(id: string, updateBoxDto: CreateBoxDto): Promise<Box>;
}
