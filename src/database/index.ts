import Dexie from 'dexie';
import type {Table} from 'dexie';

const VERSION = 1;

type BatchClose = {
  id?: number;
  timestamp: string;
  creditCount: string;
  creditAmount: string;
  list: string;
};

class MySubClassedDexie extends Dexie {
  listBatchClose!: Table<BatchClose>;
  constructor() {
    super('myDatabase');
    this.version(VERSION).stores({
      listBatchClose: '++id, timestamp, creditCount, creditAmount, list',
    });
  }
}

export const db = new MySubClassedDexie();
