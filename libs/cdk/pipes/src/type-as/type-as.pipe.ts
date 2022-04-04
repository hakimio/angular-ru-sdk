import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'typeAs' })
export class TypeAsPipe implements PipeTransform {
    public transform<T, K = any>(value: K | T | undefined | null | unknown, _typedValue: T): T {
        return value as T;
    }
}
