import {Mergeable} from '../Mergeable';

export class CommentViewModel extends Mergeable {
    constructor(obj) {
        super(obj);

        if (!obj) {
            this.id = '';
            this.content = '';
            this.creatorEmail = '';
        }
    }
}
