
export class SneakerReleaseDate {
    constructor(x) {
        this.uuid = x.uuid;
        this.name = x.name;
        this.image = x.image;
        this.releaseDate = x.releaseDate;
        this.timestampAdded = x.timestampAdded;
    }

    static fromFirestore(doc) {
        const data = doc.data();

        if (!data) return null;

        return new SneakerReleaseDate({
            uuid: doc.id,
            name: data['name'] ? data['name'] : '',
            image: data['image'] ? data['image'] : '',
            releaseDate: data['releaseDate'] ? data['releaseDate'] : '',
            timestampAdded: new Date(),
        });
    }

    toJson(x) {
        return {
            uuid: x.uuid,
            name: x.name,
            image: x.image,
            releaseDate: x.releaseDate,
            timestampAdded: x.timestampAdded,
        };
    }
}