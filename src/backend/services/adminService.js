
import { db } from '../firebase';
import { Admin } from '../models/admin';
// import * as admin from 'firebase-admin';

export const getAdmins = async function () {
    const query = await db.collection('Admins').limit(20).get();
    let admins = [];

    query.docs.forEach((doc) => {
        const admin = Admin.fromFirestore(doc);
        if (admin) {
            admins.push(admin);
        }
    });

    return admins;
};

export const addAdmin = async function (data) {
    await db.collection('Admins').add(data);
};

export const deleteAdmin = async function (id) {
    await db.collection('Admins').doc(id).delete();
};

export const updateAdmin = async function (id, data) {
    await db.collection('Admins').doc(id).set(data, { merge: true });
};

export const getAdminById = async function (id) {
    const query = await db.collection('Admins').doc(id).get();
    return Admin.fromFirestore(query);
};

// export const getAllAdmins = () => {
//     admin.auth().listUsers(100)
//       .then(function(listUsersResult) {
//         listUsersResult.users.forEach(function(userRecord) {
//           console.log('user', userRecord.toJSON());
//         });
//       })
//       .catch(function(error) {
//         console.log('Error listing users:', error);
//       });
//   }
