import {Mergeable} from '../Mergeable';

export class ListPostsViewModel extends Mergeable {
    constructor(obj) {
        super(obj);

        if (!obj) {
            this.id = '';
            this.imageLink = '';
            this.creatorEmail = '';
            this.createdOn = '';
            this.caption = '';
            this.likesCount = 0;
            this.commentsCount = 0;
        }
    }
}
