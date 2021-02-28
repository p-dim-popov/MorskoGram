import {Mergeable} from '../Mergeable';

export class LikeViewModel extends Mergeable {
    constructor(obj) {
        super(obj);

        if (!obj) {
            this.giverId = '';
        }
    }
}
