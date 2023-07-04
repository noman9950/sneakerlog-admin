
import { db } from '../firebase';
import {TermsofService} from "../models/termsOfService"


export const getTerms = async function () {
    const query = await db.collection('Terms').get();

    let terms = [];

    query.docs.forEach((doc) => {
        const term = TermsofService.fromFirestore(doc);
        if (term) {
            terms.push(term);
        }
    });

    return terms;
};

export const addTerms = async function (data) {
    await db.collection('Terms').add(data);
};

export const deleteTerms = async function (id) {
    await db.collection('Terms').doc(id).delete();
};

export const updateTerms = async function (id, data) {
    await db.collection('Terms').doc(id).set(data, { merge: true });
};
