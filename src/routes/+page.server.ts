import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	create: async ({ request }) => {
		// Sleep for 2-5 second before returning the response
		const sleep = Math.random() * 2000 + 3000;
		await new Promise((resolve) => setTimeout(resolve, sleep));

		const formData = await request.formData();

		const id = formData.get('id');
		const content = formData.get('content') as string;

		// A little mockup validation
		if (content.length < 1) {
			return fail(400, { id, message: '❌ The content cannot be blank.' });
		}

		if (content.includes('กวย')) {
			return fail(400, { id, message: '❌ Content cannot contain with `กวย` .' });
		}

		return {
			success: true,
			message: 'Note was created successfully'
		};
	}
};
