import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,UseGuards
} from '@nestjs/common';
import { CreateDocTypeDto } from './dto/create-docType.dto';
import { DocType } from './interfaces/docType.interface';
import { DocTypeService } from './docType.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('DocType')
@UseGuards(AuthGuard('jwt'))
export class DocTypeController {
  constructor(private readonly DocTypeService: DocTypeService) {}

  @Get()
  findAll(): Promise<DocType[]> {
    return this.DocTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<DocType> {
    return this.DocTypeService.findOne(id);
  }

  @Post()
  create(@Body() createDocTypeDto: CreateDocTypeDto): Promise<DocType> {
    return this.DocTypeService.create(createDocTypeDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<DocType> {
    return this.DocTypeService.delete(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocTypeDto: CreateDocTypeDto,
  ): Promise<DocType> {
    return this.DocTypeService.update(id, updateDocTypeDto);
  }
}
