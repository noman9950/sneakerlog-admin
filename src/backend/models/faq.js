
export class FAQ {
    constructor(x) {
        this.uuid = x.uuid;
        this.faq = x.faq;
        this.timestampAdded = x.timestampAdded;
    }

    static fromFirestore(doc) {
        const data = doc.data();

        if (!data) return null;

        return new FAQ({
            uuid: doc.id,
            faq: data['faq'] ? data['faq'] : '',
            timestampAdded: new Date(),
        });
    }

    toJson(x) {
        return {
            uuid: x.uuid,
            faq: x.faq,
            timestampAdded: x.timestampAdded,
        };
    }
}