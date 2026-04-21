<script lang="ts">
	import { type CategoryDTO, type SectionDTO } from '$lib/dtos/section-dto';
	import { categoryService } from '$lib/services/CategoryService';
	import { sectionService } from '$lib/services/SectionService';
	import { sectionList } from '$lib/stores/structure';
	import { onMount } from 'svelte';

	let selectedSectionId = $state<number | null>(null);
	let selectedCategoryId = $state<number | null>(null);

	let categoriesInSection = $state<CategoryDTO[]>([]);

	let isCategory = $state(false);
	let name = $state('');
	let description = $state('');

	onMount(() => {
		sectionService.list();
	});

	async function selectSection(id: number | null) {
		if (id === null) return;
		selectedSectionId = id;
		const res = await categoryService.listFromSection(selectedSectionId);
		if (res) {
			categoriesInSection = res;
		}
	}

	async function handleAddSection() {
		let section: SectionDTO = { id: null, name: name, description: description, categories: [] };
		sectionService.add(section);

		sectionService.list();
		name = '';
		description = '';
	}

	function handleNew() {
		selectedSectionId = null;
		selectedCategoryId = null;
	}

	async function handleAddCategory() {
		if (!selectedSectionId) return;

		let category: CategoryDTO = {
			id: null,
			name: name,
			description: description,
			sectionId: selectedSectionId
		};

		let cat: CategoryDTO | null = await categoryService.add(category);
		selectSection(selectedSectionId);
		name = '';
		description = '';
	}
</script>

<div class="grid h-full grid-cols-[300px_1fr] grid-rows-[200px_1fr] gap-4">
	<section class="overflow-y-auto border-2 border-red-500 bg-gray-800 p-4">
		<h4 class="mb-2 border-b font-bold text-gray-100">Sections</h4>
		<div class="flex flex-col gap-1">
			{#if $sectionList}
				{#each $sectionList as section}
					<button
						onclick={() => selectSection(section.id)}
						class="rounded p-2 text-left text-gray-300 hover:bg-gray-100 {selectedSectionId ===
						section.id
							? 'border-l-4 border-red-500 bg-red-50 font-bold'
							: ''}"
					>
						{section.name}
					</button>
				{/each}
			{/if}
		</div>
	</section>

	<section class="row-span-2 border-2 border-red-500 bg-gray-500 p-4">
		<h4 class="mb-2 border-b font-bold">Edition/Adding</h4>

		<form onsubmit={(e) => e.preventDefault()} class="flex flex-col gap-3">
			<div class="flex gap-4">
				<label><input type="radio" value={false} bind:group={isCategory} /> Section</label>
				<label><input type="radio" value={true} bind:group={isCategory} /> Category</label>
			</div>

			{#if isCategory}
				<div class="flex flex-col gap-1">
					<label class="text-xs font-bold text-gray-600">Assign to Section:</label>
					<select bind:value={selectedSectionId} class="rounded border bg-white p-2">
						<option value={null}>-- Select Section --</option>
						{#each $sectionList! as section}
							<option value={section.id}>{section.name}</option>
						{/each}
					</select>
				</div>
			{/if}

			<div class="flex flex-col gap-1">
				<label>Name</label>
				<input class="rounded border p-2" bind:value={name} />
			</div>

			<div class="flex flex-col gap-1">
				<label>Description</label>
				<input class="rounded border p-2" bind:value={description} />
			</div>

			{#if !isCategory}
				<button
					onclick={handleAddSection}
					class="rounded bg-red-500 p-2 font-bold text-white hover:bg-red-600"
				>
					Add Section
				</button>
			{:else}
				<button
					onclick={handleAddCategory}
					disabled={!selectedSectionId}
					class="rounded bg-blue-600 p-2 font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
				>
					Add Category to Section
				</button>
			{/if}
		</form>
	</section>

	<section class="overflow-y-auto border-2 border-red-500 bg-gray-800 p-4">
		<h4 class="mb-2 border-b font-bold text-blue-600">Categories in section</h4>
		{#if selectedSectionId}
			<div class="flex flex-col gap-2">
				{#each categoriesInSection as cat}
					<div class="rounded border-b bg-gray-500 p-2 text-sm">
						<strong class="text-gray-800">{cat.name}</strong>
						<p class="text-xs text-gray-700">{cat.description}</p>
					</div>
				{/each}
				{#if categoriesInSection.length === 0}
					<p class="text-sm text-gray-400 italic">No categories found.</p>
				{/if}
			</div>
		{:else}
			<p class="text-sm text-gray-400 italic">Choose section from the list above...</p>
		{/if}
	</section>
</div>
