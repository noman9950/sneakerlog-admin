
import { db } from '../firebase';
import { SneakerReleaseDate } from '../models/sneakerReleaseDate';

export const getSneakersReleaseDates = async function () {
    const query = await db.collection('SneakersReleaseDates').get();

    let sneakerReleaseDates = [];

    query.docs.forEach((doc) => {
        const sneakersReleaseDates = SneakerReleaseDate.fromFirestore(doc);
        if (sneakersReleaseDates) {
            sneakerReleaseDates.push(sneakersReleaseDates);
        }
    });

    return sneakerReleaseDates;
};

export const addSneakersReleaseDate = async function (data) {
    await db.collection('SneakersReleaseDates').add(data);
};

export const deleteSneakersReleaseDate = async function (id) {
    await db.collection('SneakersReleaseDates').doc(id).delete();
};

export const updateSneakersReleaseDate = async function (id, data) {
    await db.collection('SneakersReleaseDates').doc(id).set(data, { merge: true });
};

export const getSneakersReleaseDateById = async function (id) {
    const query = await db.collection('SneakersReleaseDates').doc(id).get();
    return SneakerReleaseDate.fromFirestore(query);
};