
export class Admin {
    constructor(x) {
        this.uuid = x.uuid;
        this.name = x.name;
        this.email = x.email;
        this.timestampAdded = x.timestampAdded;
    }

    static fromFirestore(doc) {
        const data = doc.data();

        if (!data) return null;

        return new Admin({
            uuid: doc.id,
            name: data['name'] ? data['name'] : '',
            email: data['email'] ? data['email'] : [],
            timestampAdded: new Date(),
        });
    }

    toJson(x) {
        return {
            uuid: x.uuid,
            name: x.name,
            email: x.email,
            timestampAdded: x.timestampAdded,
        };
    }
}