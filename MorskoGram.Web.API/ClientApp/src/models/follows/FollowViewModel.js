import {Mergeable} from '../Mergeable';

export class FollowViewModel extends Mergeable {
    constructor(obj) {
        super(obj);

        if (!obj) {
            this.followerId = '';
            this.followerEmail = '';
            this.followedId = '';
            this.followedEmail = '';
        }
    }
}

export const FollowTypes = Object.freeze({
    follower: 1,
    followed: 2,
});
