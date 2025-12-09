import mongoose, { Schema, Document } from 'mongoose';

export interface IPermission {
  key: string;
  description: string;
}

export interface IPermissionDocument extends IPermission, Document {}

const permissionSchema = new Schema<IPermissionDocument>(
  {
    key: { type: String, required: true, unique: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

permissionSchema.index({ key: 1 });

export const PermissionModel = mongoose.model<IPermissionDocument>('Permission', permissionSchema);
