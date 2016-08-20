import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'duration'})
export class DurationPipe implements PipeTransform {
    transform(value, args): any {
        let num = parseFloat(value);
        if(isNaN(num)){
            throw new Error("\'value\' is not number");
        }
        return parseFloat(value).toFixed(2);
    }
}