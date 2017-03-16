export interface ReadRepository<T> {
   getAll: (callback: (error: any, result: T[]) => void) => void;
   findById: (id: string, callback: (error: any, result: T) => void) => void;
}