import * as N from '@nestjs/common';
import R from 'src/routes';
import G from 'src/guards/guards';
import * as M from './user_mdl';
import { UserService } from './user_srv';

@G.PanelRole(1)
@G.UsePanelGuards()
@N.Controller(R.panel.user)
export class UserController {
  //
  constructor(private userService: UserService) {}

  @N.Get()
  async getUsers(@N.Query() qp: M.UserQP): Promise<M.UserDTO[]> {
    const users = await this.userService.read(qp.toFindOptions());
    return users.map((user) => M.UserDTO.fromEntity(user));
  }

  @N.Get(':id')
  async getUserById(@N.Param('id') id: number): Promise<M.UserDTO> {
    return M.UserDTO.fromEntity(await this.userService.readOne(id));
  }

  @N.Put(':id')
  async putUser(@N.Param('id') id: number, @N.Body() body: M.UserPUD) {
    const user = body.toEntity(id);
    return M.UserDTO.fromEntity(await this.userService.update(user));
  }

  @N.Delete()
  async deleteUser(@N.Body() body: M.UserDD) {
    return await this.userService.delete(body.ids);
  }
}
