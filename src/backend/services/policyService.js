
import { db } from '../firebase';
import { PrivacyPolicy } from '../models/privacyPolicy';


export const getPolicy = async function () {
    const query = await db.collection('Policy').get();

    let policies = [];

    query.docs.forEach((doc) => {
        const policy = PrivacyPolicy.fromFirestore(doc);
        if (policy) {
            policies.push(policy);
        }
    });

    return policies;
};

export const addPolicy = async function (data) {
    await db.collection('Policy').add(data);
};

export const deletePolicy = async function (id) {
    await db.collection('Policy').doc(id).delete();
};

export const updatePolicy = async function (id, data) {
    await db.collection('Policy').doc(id).set(data, { merge: true });
};
