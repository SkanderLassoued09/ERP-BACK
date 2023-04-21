import { Injectable } from '@nestjs/common';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel('Profile') private profileModel: Model<ProfileDocument>,
  ) {}
  async create(
    createProfileInput: CreateProfileInput,
  ): Promise<Profile | undefined> {
    return (await this.profileModel.create(createProfileInput))
      .save()
      .then((res) => {
        console.log('created', res);
        return res;
      })
      .catch((err) => {
        console.log('Err:', err);
        return err;
      });
  }

  findAll() {
    return `This action returns all profile`;
  }

  async findOneForAuth(username: string): Promise<Profile | undefined> {
    return await this.profileModel
      .findOne({ username })
      .then((res) => {
        console.log('find one auth ', res);
        return res;
      })
      .catch((err) => {
        console.log('Err find one auth', err);
        return err;
      });
  }

  update(id: number, updateProfileInput: UpdateProfileInput) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
