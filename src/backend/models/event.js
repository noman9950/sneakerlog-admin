
export class Event {
    constructor(x) {
        this.uuid = x.uuid;
        this.name = x.name;
        this.image = x.image;
        this.date = x.date;
        this.time = x.time;
        this.location = x.location;
        this.about = x.about;
        this.timestampAdded = x.timestampAdded;
    }

    static fromFirestore(doc) {
        const data = doc.data();

        if (!data) return null;

        return new Event({
            uuid: doc.id,
            name: data['name'] ? data['name'] : '',
            image: data['image'] ? data['image'] : [],
            date: data['date'] ? data['date'] : [],
            time: data['time'] ? data['time'] : [],
            location: data['location'] ? data['location'] : [],
            about: data['about'] ? data['about'] : [],
            timestampAdded: new Date(),
        });
    }

    toJson(x) {
        return {
            uuid: x.uuid,
            name: x.name,
            image: x.image,
            date: x.date,
            time: x.time,
            location: x.location,
            about: x.about,
            timestampAdded: x.timestampAdded,
        };
    }
}