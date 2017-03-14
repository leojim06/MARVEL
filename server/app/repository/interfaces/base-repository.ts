import { ReadRepository } from './Read';
import { WriteRepository } from './Write';

export interface BaseRepository<T> extends ReadRepository<T>, WriteRepository<T> { }