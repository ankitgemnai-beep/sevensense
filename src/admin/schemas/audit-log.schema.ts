import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AuditLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  actorId: Types.ObjectId; // The admin who performed the action

  @Prop({ required: true })
  action: string; // e.g., 'user.suspend', 'model.deploy'

  @Prop()
  targetId: string; // ID of the affected resource

  @Prop()
  reason: string;

  @Prop({ type: Object })
  previousState: any;

  @Prop({ type: Object })
  newState: any;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
