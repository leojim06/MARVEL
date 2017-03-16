export interface WriteBusiness<T> {
   create: (item: T, callback: (error: any, result: T) => void) => void;
   update: (_id: string, item: T, callback: (error: any, result: any) => void) => void;
   delete: (_id: string, callback: (error: any, result: any) => void) => void;
}