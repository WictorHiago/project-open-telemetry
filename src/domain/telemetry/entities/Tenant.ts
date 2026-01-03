export default class Tenant {
    public id: string;
    public username: string;
    public password: string;

    constructor(id: string, username: string, password: string) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    static create(id: string, username: string, password: string) {
        return new Tenant(id, username, password);
    }
}
