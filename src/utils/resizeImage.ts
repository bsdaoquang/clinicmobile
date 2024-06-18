/** @format */

import FileResizer from 'react-image-file-resizer';

export const handleResize = (file: any) => {
	const resizeImage = new Promise((resolve) => {
		FileResizer.imageFileResizer(
			file,
			1024,
			512,
			'JPEG',
			100,
			0,
			(uri) => resolve(uri),
			'file'
		);
	});

	return resizeImage;
};
