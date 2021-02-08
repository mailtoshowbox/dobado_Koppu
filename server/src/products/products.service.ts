import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document } from './interfaces/product.interface';
import { Documents } from './schemas/product.schema';

import { Boxes } from './schemas/box.schema';
import { Racks } from './schemas/rack.schema';
import { promises } from 'dns';

var QRCode = require('qrcode')


@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Documents.name)
    private productModel: Model<Documents>,
    @InjectModel(Boxes.name) private readonly boxModel: Model<Boxes>,
    @InjectModel(Racks.name) private readonly rackModel: Model<Racks>) { }

  async findAll(): Promise<Document[]> {
    return await this.productModel.aggregate([
      { $match: { category: { "$ne": "" } , rack: { "$ne": "" } },  },
      {
        $project: {
          rack: {
            $toObjectId: "$rack"
          },
          category: {
            $toObjectId: "$category"
          }, box: {
            $toObjectId: "$box"
          },
          boxInfo: 1,
          name: 1,
          manufacturedate:1, 
          expiredate:1,
          qr_code:1,
          type_of_space:1,
          _id: 1
        }
      },
      {
        $lookup:
        {
          from: "boxes",
          localField: "box",
          foreignField: "_id",
          as: "box_info"
        }
      },
      { $match: { "box_info": { $ne: [] } } },
      {
        $lookup:
        {
          from: "racks",
          localField: "rack",
          foreignField: "_id",
          as: "rack_info"
        }
      },
      {
        $lookup:
        {
          from: "doccategories",
          localField: "category",
          foreignField: "_id",
          as: "category_info"
        }
      },


    ])
  }

  async findOne(id: string) {
    return await this.productModel.findOne({ _id: id });
  }

  async create(product: Document) {
    const newProduct = new this.productModel(product);
    return await newProduct.save();
  }

  async delete(id: string) {
    return await this.productModel.findByIdAndRemove(id);
  }

  async update(id: string, product: Document) {
    return await this.productModel.findByIdAndUpdate(id, product, {
      new: true,
    });
  }

  async getQRCode(qrData) {
    return await this.runAsyncFunctions(qrData).then((result) => {
      let string = result.box + '/' + qrData.rack + '/' + qrData.name;
      return QRCode.toDataURL(string)
        .then(url => {
          return { qrImage: url };
        })
        .catch(err => {
          //reject(url)
        })
    }); 
  }



  async runAsyncFunctions(qrData) {
    const loopdat = [{ field: 'box' }, { field: 'rack' }]

    const resiluSet = qrData;
    return Promise.all(
      loopdat.map(async ({ field }, ind) => {
        if (field === 'box') {
          await this.boxModel.findOne({ _id: qrData.box }).then(({ name = "" }) => {
            resiluSet.box = name;
          }).catch((err) => {

          });
          ///  console.log(boxName)
        } else if (field === 'rack') {
          await this.rackModel.findOne({ _id: qrData.rack }).then(({ name = "" }) => {
            resiluSet.rack = name;
          }).catch((err) => {

          });
        }
      })
    ).then(() => {
      return resiluSet;
    })
  }
}
