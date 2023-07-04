
import { db } from '../firebase';
import {FAQ} from "../models/faq"


export const getFAQ = async function () {
    const query = await db.collection('FAQ').get();

    let FAQs = [];

    query.docs.forEach((doc) => {
        const faq = FAQ.fromFirestore(doc);
        if (faq) {
            FAQs.push(faq);
        }
    });

    return FAQs;
};

export const updateFAQ = async function (id, data) {
    await db.collection('FAQ').doc(id).set(data, { merge: true });
};
