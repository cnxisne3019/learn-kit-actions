<script lang="ts">
	import type { SubmitFunction, error } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-french-toast';

	let requestsQueue: { id: string; content: string; state: string }[] = [];
	$: uid = requestsQueue.length.toString() || '0';

	// use:enhace cannot mutate the data before the form submission
	// this is a workaround to store or validate the form data before the submission
	const submitCreateName: SubmitFunction = async ({ formData, cancel }) => {
		const formDataObject = Object.fromEntries(formData) as { id: string; content: string };
		const newItem = { ...formDataObject, state: 'pending' };
		requestsQueue = [...requestsQueue, newItem];

		return async ({ result, update }) => {
			const index = requestsQueue.findIndex((req) => req.id === formDataObject.id);
			if (index !== -1) {
				if (result.type === 'success') {
					requestsQueue[index].state = 'success';
					toast.success(`#${formDataObject.id} อัพโหลดสำเร็จ!`);
				} else if (result.type === 'failure') {
					requestsQueue[index].state = 'failure';
					toast.error(`#${formDataObject.id} reason: ${result?.data?.message}`);
					cancel();
				}
				await update({ reset: false });
			}
		};
	};
</script>

<div class="space-y-2 p-4">
	<form action="?/create" method="POST" use:enhance={submitCreateName}>
		<div class="grid grid-cols-3 items-center pb-2">
			<label for="name">Content</label>
			<input
				class="col-span-2 border p-1"
				type="text"
				name="content"
				placeholder="Enter content.."
			/>
			<input class="hidden" type="text" name="id" bind:value={uid} />
		</div>

		<div class="grid gap-2">
			<button class="bg-black p-2 text-white" name="reset" type="submit">Submit Request</button>
		</div>
	</form>

	<p>Request Queue</p>
	{#each requestsQueue as request}
		<li class="p-2 {request.state === 'pending' ? 'animate-pulse bg-slate-100' : ''}">
			{#if request.state === 'pending'}
				🍿 id: {request.id}, content: {request.content}
				<span class="rounded-full bg-amber-300 p-1 px-2 text-xs text-amber-500">Uploading...</span>
			{:else if request.state === 'success'}
				✅ id: {request.id}, content: {request.content}
				<span class="rounded-full bg-green-300 p-1 px-2 text-xs text-green-500">Submit Successfully!</span>
			{:else if request.state === 'failure'}
				❌ id: {request.id}, content: {request.content}
				<span class="rounded-full bg-red-300 p-1 px-2 text-xs text-red-500">Cause some error!</span>
			{/if}
		</li>
	{/each}
</div>
