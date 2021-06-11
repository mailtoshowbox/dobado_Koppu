import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,UseGuards
} from '@nestjs/common';
import { CreateDocRequestDto } from './dto/create-docRequest.dto';
import { DocRequest } from './interfaces/docRequest.interface';
import { DocRequestService } from './docRequest.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('DocRequests')
@UseGuards(AuthGuard('jwt'))
export class DocRequestsController {
  constructor(private readonly DocRequestsService: DocRequestService,) {}

  @Get(':mode')
  findAll(@Param('mode') mode: string): Promise<DocRequest[]> {
    if(mode === 'request'){
      return this.DocRequestsService.findAll();
    }else{
      return this.DocRequestsService.findAll();
    }
   
  }

  
  @Get()
  findAllAprove(): Promise<DocRequest[]> {
    console.log("fsdfsdf");
    return this.DocRequestsService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string): Promise<DocRequest> {
    return this.DocRequestsService.findOne(id);
  }


  

  @Post()
  create(@Body() createDocRequestsDto: CreateDocRequestDto): Promise<DocRequest> {

    console.log("createDocRequestsDto--", createDocRequestsDto);
    const d=  this.DocRequestsService.create(createDocRequestsDto);
    d.then((res)=>{
      const {} = res;
      console.log("res---------", res);

    })
    
    return d;
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<DocRequest> {
    return this.DocRequestsService.delete(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocRequestsDto: CreateDocRequestDto,
  ): Promise<DocRequest> { 
    console.log("updateDocRequestsDto---", updateDocRequestsDto);
    return this.DocRequestsService.update(id, updateDocRequestsDto);
  }
}
