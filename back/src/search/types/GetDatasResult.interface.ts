import { GetDatasBody } from './GetDatasBody.interface';

export interface GetDatasResult {
  hits: {
    total: number;
    hits: Array<{
      _source: GetDatasBody;
    }>;
  };
}
