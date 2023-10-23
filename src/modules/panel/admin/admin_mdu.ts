import * as N from '@nestjs/common';
import * as NTO from '@nestjs/typeorm';
import { Admin } from './admin_mdl';
import { AdminController } from './admin_ctrl';
import { AdminService } from './admin_srv';

@N.Module({
  imports: [NTO.TypeOrmModule.forFeature([Admin])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
