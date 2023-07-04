
import { db } from '../firebase';
import { Brand } from '../models/brand';

export const getBrands = async function () {
    const query = await db.collection('Brands').get();

    let brands = [];

    query.docs.forEach((doc) => {
        const brand = Brand.fromFirestore(doc);
        if (brand) {
            brands.push(brand);
        }
    });

    return brands;
};



export const addBrand = async function (data) {
    await db.collection('Brands').add(data);
};

export const deleteBrand = async function (id) {
    await db.collection('Brands').doc(id).delete();
};

export const updateBrand = async function (id, data) {
    await db.collection('Brands').doc(id).set(data, { merge: true });
};

export const getBrandById = async function (id) {
    const query = await db.collection('Brands').doc(id).get();
    return Brand.fromFirestore(query);
};