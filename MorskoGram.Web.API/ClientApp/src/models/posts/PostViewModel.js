import {Mergeable} from '../Mergeable';

export class PostViewModel extends Mergeable {
    constructor(obj) {
        super(obj);

        if (!obj) {
            this.id = '';
            this.imageLink = '';
            this.creatorEmail = '';
            this.createdOn = '';
            this.caption = '';
            this.likes = [];
            this.comments = [];
        }
    }
}
