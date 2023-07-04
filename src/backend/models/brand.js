
export class Brand {
    constructor(x) {
        this.uuid = x.uuid;
        this.name = x.name;
        this.image = x.image;
        this.timestampAdded = x.timestampAdded;
    }

    static fromFirestore(doc) {
        const data = doc.data();

        if (!data) return null;

        return new Brand({
            uuid: doc.id,
            name: data['name'] ? data['name'] : '',
            image: data['image'] ? data['image'] : [],
            timestampAdded: new Date(),
        });
    }

    toJson(x) {
        return {
            uuid: x.uuid,
            name: x.name,
            image: x.image,
            timestampAdded: x.timestampAdded,
        };
    }
}