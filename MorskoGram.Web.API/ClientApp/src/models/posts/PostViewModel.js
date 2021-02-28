import {Mergeable} from '../Mergeable';

export class PostViewModel extends Mergeable {
    constructor(obj) {
        super(obj);

        if (!obj) {
            this.id = '';
            this.imageLink = '';
            this.creatorEmail = '';
            this.creatorId = '';
            this.createdOn = '';
            this.caption = '';
            /**
             * @type {LikeViewModel[]}
             */
            this.likes = [];
            this.comments = [];
        }
    }
}
