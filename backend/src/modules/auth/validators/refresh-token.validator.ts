import Joi from 'joi';

export interface RefreshTokenDto {
  refreshToken: string;
}

export const refreshTokenSchema = Joi.object<RefreshTokenDto>({
  refreshToken: Joi.string().required(),
});
