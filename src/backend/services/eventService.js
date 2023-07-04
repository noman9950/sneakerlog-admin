
import { db } from '../firebase';
import { Event } from '../models/event';

export const getEvents = async function () {
    const query = await db.collection('Events').get();

    let events = [];

    query.docs.forEach((doc) => {
        const event = Event.fromFirestore(doc);
        if (event) {
            events.push(event);
        }
    });

    return events;
};

export const addEvent = async function (data) {
    await db.collection('Events').add(data);
};

export const deleteEvent = async function (id) {
    await db.collection('Events').doc(id).delete();
};

export const updateEvent = async function (id, data) {
    await db.collection('Events').doc(id).set(data, { merge: true });
};

export const getEventById = async function (id) {
    const query = await db.collection('Events').doc(id).get();
    return Event.fromFirestore(query);
};