import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsString({ message: 'Incorrect name' })
	name: string;

	@IsEmail({}, { message: 'Incorrect email' })
	email: string;

	@IsString({ message: 'Incorrect password' })
	password: string;
}
