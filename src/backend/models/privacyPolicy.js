
export class PrivacyPolicy {
    constructor(x) {
        this.uuid = x.uuid;
        this.privacyPolicy = x.privacyPolicy;
        this.timestampAdded = x.timestampAdded;
    }

    static fromFirestore(doc) {
        const data = doc.data();

        if (!data) return null;

        return new PrivacyPolicy({
            uuid: doc.id,
            privacyPolicy: data['privacyPolicy'] ? data['privacyPolicy'] : '',
            timestampAdded: new Date(),
        });
    }

    toJson(x) {
        return {
            uuid: x.uuid,
            privacyPolicy: x.privacyPolicy,
            timestampAdded: x.timestampAdded,
        };
    }
}