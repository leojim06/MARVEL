import { ReadController } from './read';
import { WriteController } from './write';

export interface BaseController<T> extends ReadController, WriteController { }