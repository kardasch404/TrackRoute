import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRole {
  name: string;
  permissions: Types.ObjectId[];
}

export interface IRoleDocument extends IRole, Document {}

const roleSchema = new Schema<IRoleDocument>(
  {
    name: { type: String, required: true, unique: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
  },
  { timestamps: true }
);

roleSchema.index({ name: 1 });

export const RoleModel = mongoose.model<IRoleDocument>('Role', roleSchema);
