export interface WriteRepository<T> {
   create: (item: T, callback: (error: any, result: T) => void) => void;
   update: (item: T, data: T, callback: (error: any, result: any) => void) => void;
   delete: (item: T, callback: (error: any, result: any) => void) => void;
}