/** @format */

import axios from 'axios';

export const sendMail = async (email: string, { html, subject }: { html: string, subject: string; }) => {
	try {
		await axios(`https://rncomponent.com/scheduler/sendmail`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			data: {
				from: 'bsdaoquang@gmail.com',
				to: email,
				subject,
				html: html ?? `Bạn nhận được 1 yêu cầu chuyển tiền`
			},

		});

	} catch (error) {
		console.log(error);
	}
};
