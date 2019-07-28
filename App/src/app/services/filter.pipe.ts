import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(values: any[], field: string, value: string): any {
        if (!values || !value) {
            return values;
        }
        return values.filter(item => item[field].toUpperCase().indexOf(value.toUpperCase()) !== -1);
    }
}