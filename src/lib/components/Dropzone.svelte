<script>
	import { createEventDispatcher } from 'svelte';
	import Dropzone from 'svelte-file-dropzone/Dropzone.svelte';

	export let dontRead = false;
	export let readAs = 'text';

	const dispatch = createEventDispatcher();

	async function readFile(file) {
		return new Promise((resolve, reject) => {
			let fileReader = new FileReader();
			fileReader.onload = function () {
				return resolve({
					data: fileReader.result,
					name: file.name,
					size: file.size,
					type: file.type
				});
			};
			if (readAs === 'buffer') {
				fileReader.readAsArrayBuffer(file);
				return;
			}
			if (readAs === 'binary') {
				fileReader.readAsBinaryString(file);
				return;
			}
			if (readAs === 'url') {
				fileReader.readAsDataURL(file);
				return;
			}
			fileReader.readAsText(file);
		});
	}

	async function handleFilesSelect(e) {
		const { acceptedFiles } = e.detail;
		if (dontRead) {
			dispatch('readFile', acceptedFiles[0]);
			return;
		}
		const text = await readFile(acceptedFiles[0]);
		dispatch('readFile', text.data);
	}
</script>

<Dropzone containerStyles={'background-color: transparent'} on:drop={handleFilesSelect} />
