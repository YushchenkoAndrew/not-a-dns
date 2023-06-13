import { Column } from '../../decorators/column';
import { CommonEntity } from '../common.entity';

export class LinksResponseDto extends CommonEntity {
  @Column()
  favorite: boolean = false;

  // @ResponseProperty()
  from: string = '';

  // @ResponseProperty()
  to: string = '';
  id: any = '';

  // @ResponseProperty({ recursive: true })
  relations: any[] = [];
}
