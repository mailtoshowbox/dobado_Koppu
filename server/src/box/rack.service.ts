import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; 
import { Racks } from './schemas/rack.schema';
import { Rack } from './interfaces/rack.interface';
@Injectable()
export class RackService {
  constructor(
    @InjectModel(Racks.name)     
    private rackModel: Model<Racks>,
  ) {}

  async create(box: Rack): Promise<Rack> {

    const inestRakcks = new this.rackModel(listOfRacks);
    const racks=0;
    console.log("RACJS,", racks);
    
    if(racks>0){
      var listOfRacks = [];
      var n=0;
      while(n<racks){
        let rack= {name : n+1, status : 1};
        listOfRacks.push(rack);        
        n++;      
      } 

      console.log("listOfRacks--", listOfRacks);
    

      //const options = { ordered: true };
      const result = await inestRakcks.save();
  
      console.log("box----", box);
    } 
    return await inestRakcks.save();
  
  }
 
}
