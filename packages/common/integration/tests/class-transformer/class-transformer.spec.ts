import 'reflect-metadata';

import { Exclude, Expose, plainToClass, Transform, Type } from 'class-transformer';
import {
    ONLY_TO_CLASS,
    transformAsPrepareFieldsFromClass,
    transformParseFloat,
    transformParseInt,
    transformToClass,
    transformToFormatDateTime,
    transformToNumber,
    transformToPrettyFormat,
    transformToStringVal,
    transformToTrim,
    transformToUnix
} from '@angular-ru/common/class-transformer';

describe('[TEST]: Integration with class-transformer', () => {
    @Exclude()
    class IsoDto {
        @Expose() @Transform(transformToNumber, ONLY_TO_CLASS) public a?: string;
        @Expose() @Transform(transformToNumber, ONLY_TO_CLASS) public b?: string;
    }

    @Exclude()
    class DemoDto {
        @Expose() @Transform(transformToFormatDateTime, ONLY_TO_CLASS) public startDate?: number;
        @Expose() @Transform(transformToUnix, ONLY_TO_CLASS) public endDate?: string;
        @Expose() @Transform(transformToTrim, ONLY_TO_CLASS) public comment?: string;
        @Expose() @Transform(transformToPrettyFormat, ONLY_TO_CLASS) public lastChanged?: number;
        @Expose() @Transform(transformToStringVal, ONLY_TO_CLASS) public enabled?: boolean;
        @Expose() @Transform(transformParseFloat, ONLY_TO_CLASS) public floatVal?: number;
        @Expose() @Transform(transformParseInt, ONLY_TO_CLASS) public intVal?: number;
        @Expose() @Transform(transformToNumber, ONLY_TO_CLASS) public numVal?: string;

        @Expose()
        @Type(transformToClass(IsoDto))
        @Transform(transformAsPrepareFieldsFromClass(IsoDto), ONLY_TO_CLASS)
        public iso?: IsoDto;
    }

    it('should be correct use @Transform', () => {
        expect(
            plainToClass(DemoDto, {
                startDate: 757803600000,
                endDate: '01.06.1994',
                comment: '   Hello World   ',
                lastChanged: 757803600000,
                enabled: false,
                floatVal: 123.25,
                intVal: 11.5,
                numVal: '1234',
                iso: {
                    a: ' 2 ',
                    b: ' 3 ',
                    c: false
                }
            } as DemoDto)
        ).toEqual({
            startDate: expect.any(String),
            endDate: expect.any(Number),
            comment: 'Hello World',
            lastChanged: expect.any(String),
            enabled: 'false',
            floatVal: 123.25,
            intVal: 11,
            numVal: 1234,
            iso: { a: 2, b: 3 }
        });
    });

    it('should be invalid transform to number as NaN', (): void => {
        const actual: DemoDto = new DemoDto();
        actual.numVal = 'INVALID NUMBER';
        expect(actual.numVal).toEqual('INVALID NUMBER');
        expect(plainToClass(DemoDto, actual).numVal).toEqual(NaN);
    });

    it('should be correct transform to number', (): void => {
        const actual: DemoDto = new DemoDto();
        actual.numVal = ' 100 ';
        expect(actual.numVal).toEqual(' 100 ');
        expect(plainToClass(DemoDto, actual).numVal).toEqual(100);
    });
});