import { ReadBusiness } from './read';
import { WriteBusiness } from './write';

export interface BaseBusiness<T> extends ReadBusiness<T>, WriteBusiness<T> { }