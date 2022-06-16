export interface IEntity {
   readonly ID: number;
}

export abstract class Repository<T extends {}> {
   protected readonly store: Array<IEntity & T> = [];

   public add(newEntry: T): Promise<number> {
      const ID = this.store.length + 1;
      this.store.push({ ID, ...newEntry });
      return Promise.resolve(ID);
   }

   public find(ID: number): Promise<IEntity & T | null> {
      const user = this.store[ID - 1];
      return Promise.resolve(user || null);
   }

   public list(): Promise<Array<IEntity & T>> {
      return Promise.resolve(this.store);
   }

   public delete(ID: number): Promise<void> {
      delete this.store[ID];
      return Promise.resolve();
   }
}