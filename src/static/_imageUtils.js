

import Resizer from 'react-image-file-resizer';

export const imageResizeFileUri = ({ file }) =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            700,
            700,
            'JPEG',
            95,
            0,
            (uri) => {
                resolve(uri);
            },
            'base64'
        );
    });