import { logger } from '../services/logger';

function get_xs_dateTime(str: string): Date | undefined {
    const format =
        /^([1-9]\d\d\d+|0\d\d\d)-(0[1-9]|1\d)-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-4]):([0-5]\d):([0-5]\d\.\d+)(Z|[\+-]([01]\d|2[0-4]):([0-5]\d))$/;
    const xs_dateTime = str.match(format);
    if (xs_dateTime) {
        let d: Date = new Date();
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
        return d;
    } else {
        logger.error('Invalid xs:dateTime string < ' + str + ' >');
        return;
    }
}

function get_xs_date(str: string): Date | undefined {
    const format =
        /^([1-9]\d\d\d+|0\d\d\d)-(0[1-9]|1\d)-(0[1-9]|[12]\d|3[01])$/;
    const xs_date = str.match(format);
    if (xs_date) {
        let d: Date = new Date();
        const date = [
            Number(xs_date[1]),
            Number(xs_date[2]),
            Number(xs_date[3])
        ];
        d = new Date(Date.UTC(date[0], --date[1], date[2], 0, 0, 0, 0));
        return d;
    } else {
        logger.error('Invalid xs:date string < ' + str + ' >');
        return;
    }
}

export namespace xs {
    export class dateTime {
        private _date: Date;
        private _original_input: string;
        private _valid: boolean;
        public constructor(str: string) {
            const d = get_xs_dateTime(str);
            if (d) {
                this._date = d;
                this._valid = true;
            } else {
                this._date = new Date();
                this._valid = false;
            }
            this._original_input = str;
        }
        get value(): string {
            return this._date.toISOString();
        }
        set value(str: string) {
            const d = get_xs_dateTime(str);
            if (d) {
                this._date = d;
                this._valid = true;
            } else {
                this._date = new Date();
                this._valid = false;
            }
            this._original_input = str;
        }
        get date(): Date {
            return new Date(this._date);
        }
        set date(d: Date) {
            this._date = new Date(d);
            this._original_input = d.toISOString();
            this._valid = true;
        }
        get input_string(): string {
            return this._original_input;
        }

        toJSON() {
            if (this._valid) {
                return this._original_input;
            } else {
                return 'N/A';
            }
        }
    }
    export class date {
        private _date: Date;
        private _original_input: string;
        private _valid: boolean;
        public constructor(str: string) {
            const d = get_xs_date(str);
            if (d) {
                this._date = d;
                this._valid = true;
            } else {
                this._date = new Date();
                this._valid = false;
            }
            this._original_input = str;
        }
        get value(): string {
            const dateTime = this._date.toISOString();
            const date = dateTime.substring(0, dateTime.indexOf('T'));
            return date;
        }
        set value(str: string) {
            const d = get_xs_date(str);
            if (d) {
                this._date = d;
                this._valid = true;
            } else {
                this._date = new Date();
                this._valid = false;
            }
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

        toJSON() {
            if (this._valid) {
                const dateTime = this._date.toISOString();
                return dateTime.substring(0, dateTime.indexOf('T'));
            } else {
                return 'N/A';
            }
        }
    }
}
