import * as N from '@nestjs/common';
import R from 'src/routes';
import G from 'src/guards/guards';
import * as M from './admin_mdl';
import T from 'src/toolkit/toolkit';
import { AdminService } from './admin_srv';

@G.PanelRole(0)
@G.UsePanelGuards()
@N.Controller(R.panel.admin)
export class AdminController {
  //
  constructor(private adminService: AdminService) {}

  @N.Get()
  async getAdmins(@N.Query() qp: M.AdminQP): Promise<M.AdminDTO[]> {
    const admins = await this.adminService.read(qp.toFindOptions());
    return admins.map((admin) => M.AdminDTO.fromEntity(admin));
  }

  @N.Get(':id')
  async getAdminById(@N.Param('id') id: number): Promise<M.AdminDTO> {
    return M.AdminDTO.fromEntity(await this.adminService.readOne(id));
  }

  @N.Post()
  async postAdmin(@N.Body() data: M.AdminPD): Promise<M.AdminDTO> {
    return M.AdminDTO.fromEntity(
      await this.adminService.create(data.toEntity()),
    );
  }

  @N.Put(':id')
  async putAdmin(
    @N.Param('id') id: number,
    @N.Body() data: M.AdminPUD,
  ): Promise<M.AdminDTO> {
    return M.AdminDTO.fromEntity(
      await this.adminService.update(data.toEntity(id)),
    );
  }

  @N.Delete()
  async deleteAdmin(@N.Body() body: M.AdminDD): Promise<any> {
    return await this.adminService.delete(body.ids);
  }

  @N.Patch()
  async patch() {
    return 'ok';
  }
}
