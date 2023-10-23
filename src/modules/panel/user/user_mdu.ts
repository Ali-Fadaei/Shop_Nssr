import * as N from '@nestjs/common';
import * as NTO from '@nestjs/typeorm';
import { User } from './user_mdl';
import { UserService } from './user_srv';
import { UserController } from './user_ctrl';

@N.Module({
  imports: [NTO.TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
