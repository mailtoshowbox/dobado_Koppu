import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CreateBoxDto } from './dto/create-box.dto';
import { Box } from './interfaces/box.interface';
import { BoxService } from './Box.service';

@Controller('Box')
export class BoxController {
  constructor(private readonly BoxService: BoxService) {}

  @Get()
  findAll(): Promise<Box[]> {
    return this.BoxService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Box> {
    return this.BoxService.findOne(id);
  }

  @Post()
  create(@Body() createBoxDto: CreateBoxDto): Promise<Box> {
    console.log("!!!-");
    return this.BoxService.create(createBoxDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Box> {
    return this.BoxService.delete(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateBoxDto: CreateBoxDto,
  ): Promise<Box> {
    return this.BoxService.update(id, updateBoxDto);
  }
}
