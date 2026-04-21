<script lang="ts">
	import { articleList } from '$lib/stores/article';
	import { articleService } from '$lib/services/articleService';
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores/auth';

	onMount(() => {
		articleService.getAll();
	});

	// Pomocnicza funkcja do formatowania daty
	function formatDate(dateStr: string) {
		if (!dateStr) return 'Unknown date';
		return new Date(dateStr).toLocaleDateString('pl-PL');
	}
</script>

<div class="p-6">
	<div class="mb-8 flex items-center justify-between">
		<h2 class="text-3xl font-bold text-gray-100">All Articles</h2>
		<span
			class="rounded-full border border-orange-800 bg-orange-900/30 px-4 py-1 text-sm text-orange-500"
		>
			Total: {$articleList.length}
		</span>
		{#if $currentUser?.canBlog}
			<a
				href="/articles/add"
				class="flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-900/20 transition-all hover:bg-orange-500 active:scale-95"
			>
			</a>
		{/if}
	</div>

	<div class="grid gap-4">
		{#each $articleList as article}
			<article
				class="group relative flex flex-col gap-2 rounded-xl border-2 border-gray-800 bg-[#1a1a1a] p-5 shadow-lg transition-all hover:border-orange-600"
			>
				<div class="flex items-center justify-between">
					<span class="text-xs font-bold tracking-tighter text-blue-500 uppercase">
						Category ID: {article.category}
					</span>
					<span class="text-xs text-gray-500">{formatDate(article.creationDate)}</span>
				</div>

				<h3 class="text-xl font-bold text-white group-hover:text-orange-400">
					<a href="/articles/{article.id}">{article.title}</a>
				</h3>

				<p class="line-clamp-2 text-sm text-gray-400">
					{article.content}
				</p>

				<div class="mt-2 flex items-center justify-between border-t border-gray-800 pt-4">
					<div class="flex items-center gap-2">
						<div class="h-6 w-6 rounded-full bg-gradient-to-tr from-orange-600 to-red-600"></div>
						<span class="text-sm font-medium text-gray-300">{article.author}</span>
					</div>

					<div class="flex gap-2">
						{#each article.tags as tag}
							<span class="rounded bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400 italic">
								#{tag}
							</span>
						{/each}
					</div>
				</div>

				{#if !article.isPublic}
					<div
						class="absolute -top-2 -right-2 rounded bg-red-600 px-2 py-1 text-[10px] font-bold text-white shadow-md"
					>
						DRAFT
					</div>
				{/if}
			</article>
		{:else}
			<div
				class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-800 py-20"
			>
				<p class="text-gray-500 italic">No articles found. Be the first to write something!</p>
			</div>
		{/each}
	</div>
</div>
