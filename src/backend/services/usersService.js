
import { db } from '../firebase';
import { User } from '../models/user';


const getCollectionByUser=(user)=>{
    return new Promise((resolve,reject)=>{
        db.collection("Collections").doc(user.uuid).get().then((snapshot)=>{
            if(snapshot.data() && snapshot.data().Collections){
                resolve((snapshot.data().Collections).length)
            }else{
                resolve(0)
            }
        })
    })
}

export const getUsers = async function () {
    const query = await db.collection('Users').get();

    let users = [];

    query.docs.forEach(async (doc) => {
        const user = User.fromFirestore(doc);
        if (user) {
            users.push(user);
        }
    });

    let usersWithCollection=[];
    for(let i=0; i<users.length; i++){
        const user=users[i];
        const collection=await getCollectionByUser(user);
        user.collections=collection;
        if (user) {
            usersWithCollection.push(user);
        }
    }

    return users;
};

export const deleteMultiple=async (data,collection)=>{
    const batch = db.batch();
    for(let d of data){
        batch.delete(db.collection(collection).doc(d.uuid))
    }
    await batch.commit()
}

export const addUser = async function (data) {
    await db.collection('Users').add(data);
};

export const deleteUser = async function (id) {
    await db.collection('Users').doc(id).delete();
};

export const updateUser = async function (id, data) {
    await db.collection('Users').doc(id).set(data, { merge: true });
};

export const getUserById = async function (id) {
    const query = await db.collection('Users').doc(id).get();
    return User.fromFirestore(query);
};