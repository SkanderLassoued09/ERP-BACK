import { Injectable } from '@nestjs/common';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel('Location') private locationModel: Model<Location>,
  ) {}
  async generateClientId(): Promise<number> {
    let index = 0;
    const lastTicket = await this.locationModel.findOne(
      {},
      {},
      { sort: { createdAt: -1 } },
    );

    console.log(lastTicket, 'last ticket');

    if (lastTicket) {
      console.log('is entered');
      index = +lastTicket._id.substring(1);

      return index + 1;
    }

    return index;
  }
  async create(createLocationInput: CreateLocationInput): Promise<Location> {
    const index = await this.generateClientId();
    console.log(index, 'index location');
    createLocationInput._id = `E${index}`; // E => Emplacement
    return await new this.locationModel(createLocationInput)
      .save()
      .then((res) => {
        console.log(res, 'location');
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async getAllLocations() {
    return await this.locationModel
      .find({})
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  findOne(id: number) {
    return `This action returns a #${id} location`;
  }

  update(id: number, updateLocationInput: UpdateLocationInput) {
    return `This action updates a #${id} location`;
  }

  async deletLocation(_id: string) {
    return await this.locationModel
      .deleteOne({ _id })
      .then((res) => {
        console.log('location deleted', _id);
        return true;
      })
      .catch((err) => {
        console.log('err');
        return false;
      });
  }
}
