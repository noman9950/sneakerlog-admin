
export class About {
    constructor(x) {
        this.uuid = x.uuid;
        this.about = x.about;
        this.timestampAdded = x.timestampAdded;
    }

    static fromFirestore(doc) {
        const data = doc.data();

        if (!data) return null;

        return new About({
            uuid: doc.id,
            about: data['about'] ? data['about'] : '',
            timestampAdded: new Date(),
        });
    }

    toJson(x) {
        return {
            uuid: x.uuid,
            about: x.about,
            timestampAdded: x.timestampAdded,
        };
    }
}