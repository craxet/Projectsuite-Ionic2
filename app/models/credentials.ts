export interface Credentials {
    username: string;
    password: string;
}

//TODO is it correct ?
export class Credentials implements Credentials {

    constructor() {
        this.username = '';
        this.password = '';
    }
}