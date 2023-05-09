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

function get_xs_duration(str: string):
    | {
          sign: 1 | -1;
          year: number;
          month: number;
          day: number;
          hour: number;
          minute: number;
          second: number;
          ms: number;
      }
    | undefined {
    const format =
        /^-?P((\d+)Y)?((\d+)M)?((\d+)D)?(T((\d+)H)?((\d+)M)?((\d+)(.(\d+))?S)?)?$/;
    const p = str.match(format);
    if (p) {
        let year = 0;
        let month = 0;
        let day = 0;
        let hour = 0;
        let minute = 0;
        let second = 0;
        let ms = 0;
        let sign: 1 | -1 = 1;
        if (p[0][0] === '-') {
            sign = -1;
        }
        if (p[2] !== undefined) {
            year = Number(p[2]);
        }
        if (p[4] !== undefined) {
            month = Number(p[4]);
        }
        if (p[6] !== undefined) {
            day = Number(p[6]);
        }
        if (p[9] !== undefined) {
            hour = Number(p[9]);
        }
        if (p[11] !== undefined) {
            minute = Number(p[11]);
        }
        if (p[13] !== undefined) {
            second = Number(p[13]);
        }
        if (p[15] !== undefined) {
            ms = Number(p[15]);
        }
        return { sign, year, month, day, hour, minute, second, ms };
    } else {
        logger.error('Invalid xs:duration string < ' + str + ' >');
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
    export class duration {
        private sign: 1 | -1 = 1;
        private year: number = 0;
        private month: number = 0;
        private day: number = 0;
        private hour: number = 0;
        private minute: number = 0;
        private second: number = 0;
        private ms: number = 0;
        private _original_input: string;
        private _valid: boolean = false;
        public constructor(str: string) {
            const d = get_xs_duration(str);
            if (d) {
                this.sign = d.sign;
                this.year = d.year;
                this.month = d.month;
                this.day = d.day;
                this.hour = d.hour;
                this.minute = d.minute;
                this.second = d.second;
                this.ms = d.ms;
                this._valid = true;
            } else {
                this.sign = 1;
                this.year = 0;
                this.month = 0;
                this.day = 0;
                this.hour = 0;
                this.minute = 0;
                this.second = 0;
                this.ms = 0;
                this._valid = false;
            }
            this._original_input = str;
        }
        public elapse(d: Date): Date {
            let elapsed = new Date(
                Date.UTC(
                    d.getFullYear() + this.year * this.sign,
                    d.getMonth() + this.month * this.sign,
                    d.getDay() + this.day * this.sign,
                    d.getHours() + this.hour * this.sign,
                    d.getMinutes() + this.minute * this.sign,
                    d.getSeconds() + this.second * this.sign,
                    d.getMilliseconds() + this.ms * this.sign
                )
            );
            return elapsed;
        }
        get value(): string {
            let val: string = 'P';
            if (this.sign == -1) {
                val = '-' + val;
            }
            if (this.year) {
                val += this.year + 'Y';
            }
            if (this.month) {
                val += this.month + 'M';
            }
            if (this.day) {
                val += this.day + 'D';
            }
            if (this.hour || this.minute || this.second) {
                val += 'T';
                if (this.hour) {
                    val += this.hour + 'H';
                }
                if (this.minute) {
                    val += this.minute + 'M';
                }
                if (this.second || this.ms) {
                    val += this.second;
                    if (this.ms) {
                        val += '.' + this.ms;
                    }
                    val += 'S';
                }
            }
            return val;
        }
        set value(str: string) {
            const d = get_xs_duration(str);
            if (d) {
                this.sign = d.sign;
                this.year = d.year;
                this.month = d.month;
                this.day = d.day;
                this.hour = d.hour;
                this.minute = d.minute;
                this.second = d.second;
                this.ms = d.ms;
                this._valid = true;
            } else {
                this.sign = 1;
                this.year = 0;
                this.month = 0;
                this.day = 0;
                this.hour = 0;
                this.minute = 0;
                this.second = 0;
                this.ms = 0;
                this._valid = false;
            }
            this._original_input = str;
        }
        get input_string(): string {
            return this._original_input;
        }

        toJSON() {
            if (this._valid) {
                return this.value;
            } else {
                return 'N/A';
            }
        }
    }
}
