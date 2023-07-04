
import { db } from '../firebase';
import {About} from "../models/about";


export const getAbout = async function () {
    const query = await db.collection('About').get();

    let abouts = [];

    query.docs.forEach((doc) => {
        const about = About.fromFirestore(doc);
        if (about) {
            abouts.push(about);
        }
    });

    return abouts;
};

export const updateAbout = async function (id, data) {
    await db.collection('About').doc(id).set(data, { merge: true });
};
