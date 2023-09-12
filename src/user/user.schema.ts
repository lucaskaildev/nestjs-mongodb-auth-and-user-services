import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserPhoneNumber } from './dtos/user-phone-number';
import { UserRoles } from './interfaces/user-roles';
import { TwoFactorAuthMethods } from 'src/auth/enums/2fa-methods.enum';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    default: false,
  })
  emailVerified: boolean;

  @Prop({
    default: false
  })
  phoneNumberVerified: boolean;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({
    type: UserPhoneNumber,
    required: false,
  })
  phoneNumber: UserPhoneNumber;

  @Prop({
    required: true,
  })
  dateOfBirth: Date;

  @Prop({
    default: false,
  })
  isAdmin: boolean;

  @Prop({
    default: [UserRoles.USER],
  })
  roles: string[];

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    default: false,
  })
  twoFactorAuthEnabled: boolean;

  @Prop()
  twoFactorAuthMethods: TwoFactorAuthMethods[];

  @Prop()
  defaultTwoFactorAuthMethod: TwoFactorAuthMethods;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: any) {
  if (this.isModified('password')) {
    const hashedPassword = await bcrypt.hash(this['password'], 10);

    this['password'] = hashedPassword;
  }
  next();
}
)