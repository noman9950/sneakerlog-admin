
export class TermsofService {
    constructor(x) {
        this.uuid = x.uuid;
        this.termsOfService = x.termsOfService;
        this.timestampAdded = x.timestampAdded;
    }

    static fromFirestore(doc) {
        const data = doc.data();

        if (!data) return null;

        return new TermsofService({
            uuid: doc.id,
            termsOfService: data['termsOfService'] ? data['termsOfService'] : '',
            timestampAdded: new Date(),
        });
    }

    toJson(x) {
        return {
            uuid: x.uuid,
            termsOfService: x.termsOfService,
            timestampAdded: x.timestampAdded,
        };
    }
}