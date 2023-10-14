import { Pipe, PipeTransform } from '@angular/core';
import * as lang from './lang';

@Pipe({ name: 'errorMsg' })
export class TakErrorMsgPipe implements PipeTransform {
  transform(parameter: string): string {
    let resources = lang.es;
    return resources[parameter];
  }
}
