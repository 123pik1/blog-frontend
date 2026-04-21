<script lang="ts">
	import { page } from '$app/stores';
	import { articleService } from '$lib/services/articleService';
	import { sectionService } from '$lib/services/SectionService';
	import { sectionList } from '$lib/stores/structure';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { ArticleDTO } from '$lib/dtos/article-dto';
	import { categoryService } from '$lib/services/CategoryService';
	import type { CategoryDTO } from '$lib/dtos/section-dto';

	let title = $state('');
	let content = $state('');
	let tagsInput = $state('');
	let selectedSectionId = $state<number | null>(null);
	let selectedCategoryId = $state<number | null>(null);
	let isPublic = $state(true);

	let availableCategories = $state<CategoryDTO[]>([]);
	let isLoading = $state(true);
	$effect(() => {
		if (selectedSectionId) {
			// Nie robimy całego efektu async.
			// Po prostu wywołujemy funkcję i obsługujemy wynik.
			categoryService
				.listFromSection(selectedSectionId)
				.then((data) => {
					// Naprawiamy błąd z nullem: jeśli data jest nullem, dajemy pustą tablicę
					availableCategories = data ?? [];
				})
				.catch((err) => {
					console.error('Błąd kategorii:', err);
					availableCategories = [];
				});
		} else {
			availableCategories = [];
		}
	});
	onMount(async () => {
		const id = $page.params.id;
		const [article, _] = await Promise.all([articleService.getById(id!), sectionService.list()]);

		if (article) {
			title = article.title;
			content = article.content;
			tagsInput = article.tags.join(', ');
			isPublic = article.isPublic;
			selectedCategoryId = article.category;

			// Szukamy sekcji tylko po to, by ustawić selectedSectionId
			for (const section of $sectionList) {
				try {
					const cats = await categoryService.listFromSection(section.id!);
					if (cats && cats.some((c: any) => c.id === article.category)) {
						selectedSectionId = section.id;
						// NIE musisz tu przypisywać availableCategories, $effect to zrobi!
						break;
					}
				} catch (err) {
					console.error(err);
				}
			}
			isLoading = false;
		}
	});
	async function handleUpdate() {
		if (!selectedCategoryId) return;

		const updatedArticle: ArticleDTO = {
			id: Number($page.params.id),
			title,
			content,
			tags: tagsInput
				.split(',')
				.map((t) => t.trim())
				.filter((t) => t),
			category: selectedCategoryId,
			isPublic,
			// Backend zazwyczaj ignoruje te pola przy PUT, jeśli tak ustawisz
			author: '',
			creationDate: '',
			rating: { downvotes: 0, rating: 0, upvotes: 0 },
			edited: true,
			comments: [],
			lastEditDate: new Date().toISOString()
		};

		try {
			await articleService.update(updatedArticle);
			goto(`/articles/${$page.params.id}`);
		} catch (err) {
			console.error('Błąd zapisu:', err);
			// Tutaj możesz dodać np. errorMessage = "Nie udało się zapisać";
		}
	}
</script>

<div class="mx-auto max-w-5xl p-6">
	<div class="mb-6 flex items-center justify-between border-b border-gray-800 pb-4">
		<button onclick={() => history.back()} class="text-sm text-gray-500 hover:text-white">
			Cancel
		</button>
	</div>

	{#if isLoading}
		<p class="text-gray-500 italic">Loading article data...</p>
	{:else}
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
			<div class="space-y-6">
				<div class="flex flex-col gap-2">
					<label class="text-xs font-bold text-gray-500 uppercase">Title</label>
					<input
						bind:value={title}
						class="w-full rounded-lg border border-gray-800 bg-[#1a1a1a] p-3 text-xl text-white outline-none focus:border-red-500"
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label class="text-xs font-bold text-gray-500 uppercase">Content</label>
					<textarea
						bind:value={content}
						class="min-h-[500px] w-full resize-y rounded-lg border border-gray-800 bg-[#1a1a1a] p-4 text-gray-300 outline-none focus:border-red-500"
					></textarea>
				</div>
			</div>

			<aside class="space-y-6">
				<div class="space-y-4 rounded-xl border border-gray-800 bg-[#1a1a1a] p-5">
					<div class="flex flex-col gap-1">
						<label class="text-[10px] font-bold text-red-500 uppercase">Section</label>
						<select
							bind:value={selectedSectionId}
							class="rounded border border-gray-800 bg-[#252525] p-2 text-sm text-white"
						>
							<option value={null}>Select Section</option>
							{#each $sectionList as section}
								<option value={section.id}>{section.name}</option>
							{/each}
						</select>
					</div>

					<div class="flex flex-col gap-1">
						<label class="text-[10px] font-bold text-red-500 uppercase">Category</label>
						<select
							bind:value={selectedCategoryId}
							class="rounded border border-gray-800 bg-[#252525] p-2 text-sm text-white"
						>
							<option value={null}>Select Category</option>
							{#each availableCategories as cat}
								<option value={cat.id}>{cat.name}</option>
							{/each}
						</select>
					</div>

					<div class="flex flex-col gap-1">
						<label class="text-[10px] font-bold text-gray-500 uppercase">Tags</label>
						<input
							bind:value={tagsInput}
							class="rounded border border-gray-800 bg-[#252525] p-2 text-sm text-white"
							placeholder="tag1, tag2..."
						/>
					</div>

					<label class="flex cursor-pointer items-center gap-2 pt-2">
						<input type="checkbox" bind:checked={isPublic} class="accent-red-600" />
						<span class="text-sm text-gray-300">Public visibility</span>
					</label>

					<button
						onclick={handleUpdate}
						class="mt-4 w-full rounded-lg bg-red-700 py-3 font-bold text-white transition-all hover:bg-red-600"
					>
						Save Changes
					</button>
				</div>
			</aside>
		</div>
	{/if}
</div>
