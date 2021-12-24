import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Box } from './interfaces/box.interface';
import { Boxes } from './schemas/box.schema';
import { Racks } from './schemas/rack.schema';
import { Rack } from './interfaces/rack.interface';

@Injectable()
export class BoxService {
/*   constructor(
    @InjectModel(BoxClass.name)
    private boxModel: Model<BoxClass>,
  ) {} */
  constructor(
    @InjectModel(Boxes.name) private readonly boxModel:Model<Boxes>,
    @InjectModel(Racks.name) private readonly rackModel:Model<Racks>
    ){}

  async findAll(): Promise<Box[]> {
    return await this.boxModel.find({ name: { "$ne": "" } ,isActive: true}).exec();
  }

  async findOne(id: string): Promise<Box> {
    return await this.boxModel.findOne({ _id: id });
  }

  async getRacks(id: string): Promise<Rack[]> { 
    return await this.rackModel.find({ box: id }).sort({name: 1}).collation({locale: "en_US", numericOrdering: true});
  }
  


  async createRack(rack: any): Promise<Rack> { 


   return await this.rackModel.findOne({ name: rack.name ,box: rack.box}).then((res)=>{
      if(res === null){
        const newRack = new this.rackModel(rack);   
        return newRack.save();  
      } 
    }); 
  }

  async create(box: Box): Promise<Box> {

    const {racks = 0} = box;
    const newBox = new this.boxModel(box);
    newBox.isActive = true;
    return await newBox.save().then((savedResult)=>{
      const {_id= ""} = savedResult;
      if(racks>0){
        var n=0;
        while(n<racks){
          let name = n+1;
          let rack= {name : name.toString(), status : "Available", box : _id, picked:false };       
          n++;      
          this.createRack(rack); 
        }        
      }
      return savedResult; 
    });
    /* if(newBox.save()){

      const {racks = 0} = box;

      if(racks>0){
        var n=0;
        while(n<racks){
          let name = n+1;
          let rack= {name : name.toString(), status : true, };
          //listOfRacks.push(rack);            
          n++;      
           this.createRack(rack); 
        }
        
      } */
       

  

    
    
     
    
  
  }

  async delete(id: string): Promise<Box> {
    return await this.boxModel.findByIdAndRemove(id);
  }

  async update(id: string, box: Box): Promise<Box> {
    return await this.boxModel.findByIdAndUpdate(id, box, {
      new: true,
    }).then((savedResult)=>{

      const {racks = 0} = box;
      const {_id= ""} = savedResult;
      if(racks>0){
        var n=0;
        while(n<racks){
          let name = n+1;
          let rack= {name : name.toString(), status : "Available", box : _id, picked:false };       
          n++;      
          this.createRack(rack); 
        }        
      }
    
     
      return savedResult;
    });
  }
}
