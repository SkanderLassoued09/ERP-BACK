import { ObjectType, Field, Int } from '@nestjs/graphql';
import mongoose from 'mongoose';
import { OPEN_DISCOUNT, STATUS_COORDINATOR, STATUS_TICKET } from '../ticket';

export type TicketDocument = Ticket & Document;

export const TicketSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    designiation: String,
    emplacement: String,
    numSerie: String,
    numero: String,
    pdr: String,
    remarqueManager: String,
    remarqueTech: String,
    reparable: String,

    typeClient: String,
    createdBy: String,
    assignedTo: String, // tech does diag
    assignedToRep: String, // tech does rep
    affectedToCompany: String,
    affectedToClient: String,
    issue: String,
    status: { type: String, required: false, default: STATUS_TICKET.PENDING },
    // to handle btn final affectaion price // before discount
    isFinalPriceAffected: { type: Boolean, required: false, default: false },
    isOpenByTech: { type: Boolean, required: false, default: false },
    diagnosticTimeByTech: String,
    reparationTimeByTech: String,
    priority: String,
    toMagasin: Boolean,

    bl: String,
    bc: String,
    facture: String,
    Devis: String,
    image: String,

    composants: Array,
    magasinDone: { type: Boolean, required: false, default: false },
    finalPriceToAdminTech: { type: Boolean, required: false, default: false },
    finalPriceToAdminManager: {
      type: Boolean,
      required: false,
      default: false,
    },
    isReparationFinishedByTech: {
      type: Boolean,
      required: false,
      default: false,
    },

    price: String,
    finalPrice: String,
    pdfPath: String,
    IsFinishedAdmins: { type: Boolean, required: false, default: false },

    // ticket sent to coordinator but not consulted => false = not checked by coordinbator | true = ticket checked by coordinator
    toCoordinator: { type: Boolean, required: false, default: false },
    isReparable: { type: Boolean, required: false, default: false },
    isReadyForDiag: { type: Boolean, required: false, default: false },
    coordinatorToAdmin: { type: Boolean, required: false, default: false },
    // In discount component AKA modal final component user set ticket to annuler
    statusFinal: { type: Boolean, required: false, default: true },

    // openDiscount For differnnt profile
    openDiscount: {
      type: String,
      required: false,
    },

    //! to add time
  },
  { _id: false, timestamps: true },
);

@ObjectType()
export class Composants {
  @Field()
  _id: string;
  @Field()
  nameComposant: string;
  @Field(() => Int)
  quantity: number;
  @Field({ nullable: true })
  sellPrice: string;
  @Field({ nullable: true })
  purchasePrice: string;
  @Field({ nullable: true })
  statusComposant: string;
  @Field({ nullable: true })
  comingDate: string;
  @Field({ nullable: true })
  isAffected: boolean;
  @Field({ nullable: true })
  package: string;
  @Field({ nullable: true })
  linkProvider: string;
  @Field({ nullable: true })
  pdfComposant: string;
}

@ObjectType()
export class Ticket {
  @Field({ nullable: true })
  _id: string;
  @Field({ nullable: true })
  title: string;
  @Field({ nullable: true })
  designiation: string;
  @Field({ nullable: true })
  emplacement: string;
  @Field({ nullable: true })
  numero: string;
  @Field({ nullable: true })
  remarqueManager: string;
  @Field({ nullable: true })
  remarqueTech: string;
  @Field({ nullable: true })
  reparable: string;
  @Field({ nullable: true })
  issue: string;
  @Field({ nullable: true })
  pdr: string;
  @Field({ nullable: true })
  techNameSug: string;
  @Field({ nullable: true })
  statusFinal: string;

  @Field({ nullable: true })
  price: string;
  @Field({ nullable: true })
  typeClient: string;
  @Field({ nullable: true })
  isReadyForDiag: boolean;
  @Field({ nullable: true })
  isReparationFinishedByTech: boolean;
  @Field({ nullable: true })
  createdBy: string;
  @Field({ nullable: true })
  assignedTo: string;
  @Field({ nullable: true })
  assignedToRep: string;
  @Field({ nullable: true })
  createdAt: Date;
  @Field({ nullable: true })
  updatedAt: Date;
  @Field({ nullable: true })
  status: string;
  @Field({ nullable: true })
  isOpenByTech: boolean;
  @Field({ nullable: true })
  image: string;
  @Field({ nullable: true })
  coordinatorToAdmin: boolean;
  @Field({ nullable: true })
  diagnosticTimeByTech: string;
  @Field({ nullable: true })
  reparationTimeByTech: string;
  @Field({ nullable: true })
  priority: string;
  @Field({ nullable: true })
  toMagasin: boolean;
  @Field({ nullable: true })
  toCoordinator: boolean;
  @Field({ nullable: true })
  finalPriceToAdminTech: boolean;
  @Field({ nullable: true })
  finalPriceToAdminManager: boolean;
  @Field({ nullable: true })
  Devis: string;
  @Field({ nullable: true })
  facture: string;
  @Field({ nullable: true })
  bc: string;
  @Field({ nullable: true })
  bl: string;
  @Field({ nullable: true })
  titre: string;
  @Field({ nullable: true })
  pdfComposant: string;
  @Field({ nullable: true })
  affectedToCompany: string;
  @Field({ nullable: true })
  affectedToClient: string;
  @Field(() => [Composants], { nullable: true })
  composants: Composants[];
  @Field({ nullable: true })
  magasinDone: boolean;
  // admins affected the final price
  @Field({ nullable: true })
  finalPrice: string;
  @Field({ nullable: true })
  openDiscount: string;

  // to chech if the admins finish his task or not
  @Field({ nullable: true })
  IsFinishedAdmins: boolean;

  // to handle reparable butn // validated or not // to confirm with client
  @Field({ nullable: true })
  isReparable: boolean;

  // for final status ticket after passing all flow
  @Field({ nullable: true })
  isFinalPriceAffected: boolean;
  @Field({ nullable: true })
  pdfPath: string;
}

@ObjectType()
export class TotalityType {
  @Field()
  name: string;
  @Field()
  value: string;
}
@ObjectType()
export class Totality {
  @Field(() => [TotalityType])
  totality: TotalityType[];
  @Field()
  count: number;
}

@ObjectType()
export class ResponseError {
  @Field()
  message: string;
  @Field()
  code: number;
}

@ObjectType()
export class Delete_Ticket {
  @Field()
  acknowledged: boolean;
  @Field()
  deletedCount: number;
}
@ObjectType()
export class ResponseDelete {
  @Field(() => Delete_Ticket, { nullable: true })
  deleteTicket?: Delete_Ticket | null;
  @Field(() => ResponseError, { nullable: true })
  responseError?: ResponseError | null;
}

@ObjectType()
export class NotificationTech {
  @Field({ nullable: true })
  techname: string;
  @Field({ nullable: true })
  message: string;
}

@ObjectType()
export class User {
  @Field()
  _id: number;
  @Field()
  name: string;
}
