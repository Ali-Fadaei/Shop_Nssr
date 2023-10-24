import * as N from '@nestjs/common';
import G from 'src/guards/guards';
import * as M from './user_mdl';
import { UserService } from './user_srv';

@G.PanelRole(1)
@G.UsePanelGuards()
@N.Controller('panel/user/')
export class UserController {
  //
  constructor(private userService: UserService) {}

  @N.Get()
  async getUsers(@N.Query() qp: M.UserQP) {
    const users = await this.userService.read(qp.toFindOptions());
    return users.map((user) => M.User.toDto(user));
  }

  @N.Get(':id')
  async getUser(@N.Param('id') id: number) {
    return M.User.toDto(await this.userService.readOne(id));
  }

  @N.Post()
  async createUser(@N.Body() body: M.UserPD) {
    const user = body.toEntity();
    return M.User.toDto(await this.userService.create(user));
  }

  @N.Put(':id')
  async editUser(@N.Param('id') id: number, @N.Body() body: M.UserPUD) {
    const user = body.toEntity(id);
    return M.User.toDto(await this.userService.update(user));
  }

  @N.Delete()
  async deleteUser(@N.Body() body: M.UserDD) {
    return await this.userService.delete(body.ids);
  }
}
