<script lang="ts">
	import { page } from '$app/state';
	import type { ArticleDTO } from '$lib/dtos/article-dto';
	import { articleService } from '$lib/services/articleService';
	import { markdownParserService } from '$lib/services/markdownParserService';
	import { username } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	let isLoading = $state<boolean>(false);
	let article = $state<ArticleDTO | null>(null);
	let articleHtml = $state<string>('');

	const articleId = $derived(page.params.id);

	function formatDate(date: string) {
		const parsedDate = new Date(date);
		return parsedDate.toLocaleDateString('pl-PL', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	onMount(async () => {
		try {
			article = await articleService.getById(articleId!);
			if (article) articleHtml = await markdownParserService.renderVisual(article.content);
		} catch (error) {
			console.error('Błąd ładowania:', error);
		} finally {
			isLoading = false;
		}
	});
</script>

<div class="mx-auto max-w-4xl p-6">
	{#if isLoading}
		<div class="flex h-64 items-center justify-center text-gray-500 italic">
			Ładowanie treści...
		</div>
	{:else if article}
		<header class="mb-8 flex items-start justify-between border-b-2 border-red-900 pb-6">
			<div class="mb-4 flex items-center gap-4 text-sm text-gray-500">
				<span class="rounded bg-red-900/20 px-2 py-1 font-bold text-red-400 uppercase">
					ID: {article.category}
				</span>
				<span>{formatDate(article.creationDate)}</span>
				<span class="text-gray-700">|</span>
				<span class="font-medium text-orange-500">{article.author}</span>
			</div>

			<h1 class="text-4xl font-extrabold text-gray-100">{article.title}</h1>

			{#if $username === article.author}
				<a
					href="/articles/{article.id}/edit"
					class="rounded-md px-4 py-2 text-sm font-bold text-orange-500 transition-all hover:bg-orange-500 hover:text-white"
				>
					Edit Post
				</a>
			{/if}

			<div class="flex gap-2">
				{#each article.tags || [] as tag}
					<span class="text-xs text-gray-400 italic">#{tag}</span>
				{/each}
			</div>
		</header>

		<article class="prose max-w-none prose-invert prose-orange">
			<div class="markdown-content">
				{@html articleHtml}
			</div>
		</article>

		<footer
			class="mt-12 flex items-center justify-between border-t border-gray-800 pt-6 text-sm text-gray-500"
		>
			<a href="/articles" class="transition-colors hover:text-red-500">← Powrót do listy</a>
			{#if article.edited}
				<span class="text-xs text-gray-600 italic">
					Ostatnia edycja: {formatDate(article.lastEditDate!)}
				</span>
			{/if}
		</footer>
	{:else}
		<div class="rounded-xl border-2 border-red-900 bg-[#1a1a1a] py-20 text-center">
			<p class="font-bold text-red-500">Artykuł nie został odnaleziony.</p>
			<a href="/articles" class="mt-4 inline-block text-gray-400 hover:underline">
				Wróć do strony głównej
			</a>
		</div>
	{/if}
</div>
