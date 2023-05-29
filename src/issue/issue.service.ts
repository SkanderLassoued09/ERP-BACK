import { Injectable } from '@nestjs/common';
import { CreateIssueInput } from './dto/create-issue.input';
import { UpdateIssueInput } from './dto/update-issue.input';
import { Issue } from './entities/issue.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class IssueService {
  constructor(@InjectModel('Issue') private issueModel: Model<Issue>) {}
  async generateClientId(): Promise<number> {
    let index = 0;
    const lastTicket = await this.issueModel.findOne(
      {},
      {},
      { sort: { createdAt: -1 } },
    );

    if (lastTicket) {
      console.log('is entered');
      index = +lastTicket._id.substring(1);

      return index + 1;
    }

    return index;
  }
  async create(createIssueInput: CreateIssueInput): Promise<Issue> {
    const index = await this.generateClientId();
    createIssueInput._id = `I${index}`;
    return await new this.issueModel(createIssueInput)
      .save()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async getAllIssue() {
    return await this.issueModel
      .find({})
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  findOne(id: number) {
    return `This action returns a #${id} issue`;
  }

  update(id: number, updateIssueInput: UpdateIssueInput) {
    return `This action updates a #${id} issue`;
  }

  remove(id: number) {
    return `This action removes a #${id} issue`;
  }
}
