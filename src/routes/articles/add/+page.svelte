<script lang="ts">
	import { goto } from '$app/navigation';
	import type { ArticleDTO } from '$lib/dtos/article-dto';
	import { categoryService } from '$lib/services/CategoryService';
	import { sectionService } from '$lib/services/SectionService';
	import { articleService } from '$lib/services/articleService';
	import { sectionList } from '$lib/stores/structure';
	import { onMount } from 'svelte';

	// Pola formularza
	let title = $state('');
	let content = $state('');
	let tagsInput = $state(''); // Tagi jako tekst rozdzielony przecinkami
	let selectedSectionId = $state<number | null>(null);
	let selectedCategoryId = $state<number | null>(null);
	let isPublic = $state(true);

	// Dane pomocnicze
	let availableCategories = $state<any[]>([]);

	onMount(() => {
		sectionService.list(); // Pobierz sekcje do listy rozwijanej
	});

	// Reaktywne ładowanie kategorii po zmianie sekcji
	$effect(() => {
		if (selectedSectionId) {
			loadCategories(selectedSectionId);
		} else {
			availableCategories = [];
		}
	});

	async function loadCategories(id: number) {
		const res = await categoryService.listFromSection(id);
		if (res) {
			availableCategories = res;
		}
	}

	async function handlePublish() {
		const article: ArticleDTO = {
			id: null,
			title: title,
			content: content,
			author: '',
			creationDate: '',
			rating: { downvotes: 0, upvotes: 0, rating: 0 },
			edited: false,
			lastEditDate: null,
			comments: [],
			tags: tagsInput.split(',').map((t) => t.trim()),
			category: selectedCategoryId!,
			isPublic: true
		};

		await articleService.add(article);
		// Reset formularza lub przekierowanie
		goto('/');
	}
</script>

<div class="mx-auto max-w-5xl rounded-xl border border-gray-800 bg-[#1a1a1a] p-6 shadow-2xl">
	<h1 class="mb-6 border-b border-gray-800 pb-4 text-2xl font-bold text-gray-100">
		Create New Article
	</h1>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
		<div class="flex flex-col gap-6">
			<div class="flex flex-col gap-2">
				<label for="title" class="text-sm font-semibold tracking-wider text-gray-400 uppercase"
					>Title</label
				>
				<input
					id="title"
					bind:value={title}
					placeholder="Enter a catchy title..."
					class="rounded-lg border border-gray-700 bg-[#252525] p-3 text-xl text-white transition-all outline-none focus:border-orange-500"
				/>
			</div>

			<div class="flex flex-col gap-2">
				<label for="content" class="text-sm font-semibold tracking-wider text-gray-400 uppercase"
					>Content (Markdown supported)</label
				>
				<textarea
					id="content"
					bind:value={content}
					placeholder="Write your story here..."
					class="min-h-[400px] resize-y rounded-lg border border-gray-700 bg-[#252525] p-4 text-white transition-all outline-none focus:border-orange-500"
				></textarea>
			</div>
		</div>

		<aside class="flex h-fit flex-col gap-6 rounded-lg border border-gray-800 bg-[#202020] p-5">
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-1">
					<label class="text-xs font-bold text-orange-500 uppercase">Section</label>
					<select
						bind:value={selectedSectionId}
						class="rounded border border-gray-700 bg-[#2a2a2a] p-2 text-sm text-white"
					>
						<option value={null}>Select Section</option>
						{#each $sectionList as section}
							<option value={section.id}>{section.name}</option>
						{/each}
					</select>
				</div>

				<div class="flex flex-col gap-1">
					<label class="text-xs font-bold text-orange-500 uppercase">Category</label>
					<select
						bind:value={selectedCategoryId}
						disabled={!selectedSectionId}
						class="rounded border border-gray-700 bg-[#2a2a2a] p-2 text-sm text-white disabled:opacity-30"
					>
						<option value={null}>Select Category</option>
						{#each availableCategories as cat}
							<option value={cat.id}>{cat.name}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<label class="text-xs font-bold text-blue-500 uppercase">Tags</label>
				<input
					bind:value={tagsInput}
					placeholder="java, spring, svelte..."
					class="rounded border border-gray-700 bg-[#2a2a2a] p-2 text-sm text-white outline-none focus:border-blue-500"
				/>
				<p class="text-[10px] text-gray-500 italic">Separate tags with commas</p>
			</div>

			<hr class="my-2 border-gray-800" />

			<label class="flex items-center gap-2">
				<input type="checkbox" bind:checked={isPublic} />
				Publiczny artykuł
			</label>

			<button
				onclick={handlePublish}
				disabled={!title || !content || !selectedCategoryId}
				class="rounded-lg bg-orange-600 py-3 font-bold text-white shadow-lg transition-all hover:bg-orange-500 active:scale-95 disabled:bg-gray-700"
			>
				Publish Article
			</button>
		</aside>
	</div>
</div>
