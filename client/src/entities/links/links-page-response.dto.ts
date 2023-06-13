import { Column } from '../../decorators/column';
import { CommonPageEntity } from '../common-page.entity';
import { LinksResponseDto } from './links-response.dto';

export class LinksPageResponseDto extends CommonPageEntity {
  @Column((e) => new LinksResponseDto().buildAll(e.items))
  items: LinksResponseDto[];
}
