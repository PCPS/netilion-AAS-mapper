import { logger } from '../services/logger';

function get_xs_dateTime(str: string): Date {
    const format =
        /^([1-9]\d\d\d+|0\d\d\d)-(0[1-9]|1\d)-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-4]):([0-5]\d):([0-5]\d\.\d+)(Z|[\+-]([01]\d|2[0-4]):([0-5]\d))$/;
    let d: Date = new Date();
    const xs_dateTime = str.match(format);
    if (xs_dateTime) {
        const date = [
            Number(xs_dateTime[1]),
            Number(xs_dateTime[2]),
            Number(xs_dateTime[3])
        ];
        const time = [
            Number(xs_dateTime[4]),
            Number(xs_dateTime[5]),
            Number.parseInt(xs_dateTime[6]),
            (Number(xs_dateTime[6]) % 1.0) * 1000
        ];
        let timezone = [0, 0];
        switch (xs_dateTime[7][0]) {
            case 'Z':
                break;
            case '+':
                timezone = [Number(xs_dateTime[8]), Number(xs_dateTime[9])];
                break;
            case '-':
                timezone = [-Number(xs_dateTime[8]), -Number(xs_dateTime[9])];
                break;
            default:
                break;
        }
        d = new Date(
            Date.UTC(
                date[0],
                --date[1],
                date[2],
                time[0] + timezone[0],
                time[1] + timezone[1],
                time[2],
                time[3]
            )
        );
    } else {
        logger.error('Invalid xs:dateTime string < ' + str + ' >');
    }
    return d;
}

function get_xs_date(str: string): Date {
    const format =
        /^([1-9]\d\d\d+|0\d\d\d)-(0[1-9]|1\d)-(0[1-9]|[12]\d|3[01])$/;
    let d: Date = new Date();
    const xs_date = str.match(format);
    if (xs_date) {
        const date = [
            Number(xs_date[1]),
            Number(xs_date[2]),
            Number(xs_date[3])
        ];
        d = new Date(Date.UTC(date[0], --date[1], date[2], 0, 0, 0, 0));
    } else {
        logger.error('Invalid xs:date string < ' + str + ' >');
    }
    return d;
}

export namespace xs {
    export class dateTime {
        private _date: Date;
        private _original_input: string;
        public constructor(str: string) {
            this._date = get_xs_dateTime(str);
            this._original_input = str;
        }
        get value(): string {
            return this._date.toISOString();
        }
        set value(str: string) {
            this._date = get_xs_dateTime(str);
            this._original_input = str;
        }
        get date(): Date {
            return new Date(this._date);
        }
        set date(d: Date) {
            this._date = new Date(d);
            this._original_input = d.toISOString();
        }
        get input_string(): string {
            return this._original_input;
        }
    }
    export class date {
        private _date: Date;
        private _original_input: string;
        public constructor(str: string) {
            this._date = get_xs_date(str);
            this._original_input = str;
        }
        get value(): string {
            const dateTime = this._date.toISOString();
            const date = dateTime.substring(0, dateTime.indexOf('T'));
            return date;
        }
        set value(str: string) {
            this._date = get_xs_date(str);
            this._original_input = str;
        }
        get date(): Date {
            return new Date(this._date);
        }
        set date(d: Date) {
            this._date = new Date(d);
            const dateTime = this._date.toISOString();
            const date = dateTime.substring(0, dateTime.indexOf('T'));
            this._original_input = date;
        }
        get input_string(): string {
            return this._original_input;
        }
    }
}
