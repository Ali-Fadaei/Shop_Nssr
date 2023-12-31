import * as N from '@nestjs/common';
import G from 'src/guards/guards';
import * as M from './admin_mdl';
import { AdminService } from './admin_srv';

@G.PanelRole(0)
@G.UsePanelGuards()
@N.Controller('/panel/admin')
export class AdminController {
  //
  constructor(private adminService: AdminService) {}

  @N.Get()
  async getAdmins(@N.Query() qp: M.AdminQP) {
    const admins = await this.adminService.read(qp.toFindOptions());
    return admins.map((admin) => M.Admin.toDto(admin));
  }

  @N.Get(':id')
  async getAdmin(@N.Param('id') id: number) {
    return M.Admin.toDto(await this.adminService.readOne(id));
  }

  @N.Post()
  async createAdmin(@N.Body() data: M.AdminPD) {
    return M.Admin.toDto(await this.adminService.create(data.toEntity()));
  }

  @N.Put(':id')
  async editAdmin(@N.Param('id') id: number, @N.Body() data: M.AdminPUD) {
    return M.Admin.toDto(await this.adminService.update(data.toEntity(id)));
  }

  @N.Delete()
  async deleteAdmin(@N.Body() body: M.AdminDD): Promise<any> {
    return await this.adminService.delete(body.ids);
  }
}
