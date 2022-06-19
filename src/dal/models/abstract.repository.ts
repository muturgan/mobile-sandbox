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

   public async update(ID: number, data: Partial<T>): Promise<void> {
      const item = await this.find(ID);
      if (item === null) {
         throw new Error(`item ${ID} not found`);
      }

      Object.keys(data).forEach((key) => {
         // @ts-ignore
         const newValue = data?.[key];
         if (newValue) {
            // @ts-ignore
            item[key] = newValue;
         }
      });
   }

   public delete(ID: number): Promise<void> {
      delete this.store[ID];
      return Promise.resolve();
   }
}