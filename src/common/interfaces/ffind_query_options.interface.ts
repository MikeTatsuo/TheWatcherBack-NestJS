export interface FindQueryOptions<Entity> {
  skip?: number;
  take?: number;
  comment?: string;
  select?: (keyof Entity)[];
  where?: {
    [P in keyof Entity]?: P extends 'toString' ? unknown : unknown;
  };
  // relations?: FindOptionsRelations<Entity> | FindOptionsRelationByString;
  // relationLoadStrategy?: 'join' | 'query';
  order?: {
    [P in keyof Entity]?: P extends 'toString' ? unknown : unknown;
  };
  // cache?:
  //   | boolean
  //   | number
  //   | {
  //       id: any;
  //       milliseconds: number;
  //     };
  // lock?:
  //   | {
  //       mode: 'optimistic';
  //       version: number | Date;
  //     }
  //   | {
  //       mode:
  //         | 'pessimistic_read'
  //         | 'pessimistic_write'
  //         | 'dirty_read'
  //         | 'pessimistic_partial_write'
  //         | 'pessimistic_write_or_fail'
  //         | 'for_no_key_update'
  //         | 'for_key_share';
  //       tables?: string[];
  //       onLocked?: 'nowait' | 'skip_locked';
  //     };
  // withDeleted?: boolean;
  // loadRelationIds?:
  //   | boolean
  //   | {
  //       relations?: string[];
  //       disableMixedMap?: boolean;
  //     };
  // loadEagerRelations?: boolean;
  // transaction?: boolean;
}
