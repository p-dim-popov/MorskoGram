import {Mergeable} from '../Mergeable';

export class UserViewModel extends Mergeable {
    constructor(obj) {
        super(obj);

        if (!obj) {
            this.id = '';
            this.email = '';
            /**
             * @type {FollowViewModel[]}
             */
            this.followers = [];
            /**
             * @type {FollowViewModel[]}
             */
            this.followings = [];
        }
    }
}
