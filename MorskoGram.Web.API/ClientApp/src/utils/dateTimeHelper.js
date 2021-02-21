import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import {DATE_TIME_FORMAT} from '../constants/global';

dayjs.extend(utc);
dayjs.extend(LocalizedFormat);

export const utcToLocal = (dateTime) => dayjs.utc(dateTime)
    .local()
    .format(DATE_TIME_FORMAT);
