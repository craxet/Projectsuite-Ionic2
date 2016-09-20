import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'durationType'})
export class DurationTypePipe implements PipeTransform {
    transform(value, args): any {
        if (args === 'minutes') {
            return (parseFloat(value) * 60).toString();
        } else if (args === 'hours') {
            return (parseFloat(value) / 60).toString();
        }
        return value;
    }
}