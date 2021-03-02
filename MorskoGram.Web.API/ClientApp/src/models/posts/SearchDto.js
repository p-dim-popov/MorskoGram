import {Mergeable} from '../Mergeable';

export class SearchDto extends Mergeable {
    constructor(obj) {
        super(obj);

        if (!obj) {
            this.availableCount = 0;
            /**
             * @type {PostViewModel[]}
             */
            this.list = [];
        }
    }
}
