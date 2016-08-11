import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'durationType'})
export class DurationTypePipe implements PipeTransform {
    transform(value, args): any {
        console.log('type',value);
        if (args === 'minutes') {
            console.log('min',value, parseFloat(value));
            return (parseFloat(value) * 60).toString();
        } else if (args === 'hours') {
            return (parseFloat(value) / 60).toString();
        }
        console.log('res',value);
        return value;
    }
}