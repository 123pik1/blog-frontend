<script lang="ts">
	import { page } from '$app/stores';
	import { articleService } from '$lib/services/articleService';
	import type { ArticleDTO } from '$lib/dtos/article-dto';
	import { onMount, tick } from 'svelte';
	import { username } from '$lib/stores/auth';

	import { marked, type Tokens } from 'marked';
	import mermaid from 'mermaid';
	import markedKatex from 'marked-katex-extension';
	import 'katex/dist/katex.min.css';

	let article = $state<ArticleDTO | null>(null);
	let isLoading = $state(true);
	const articleId = $page.params.id;

	// 1. Konfiguracja renderera - to rozwiązuje problem z &gt; i strukturą HTML
	const renderer = {
		code(token: Tokens.Code) {
			if (token.lang === 'mermaid') {
				// Czyścimy encje, tak jak wcześniej
				const cleanText = token.text
					.replace(/&amp;/g, '&')
					.replace(/&lt;/g, '<')
					.replace(/&gt;/g, '>');

				// UŻYWAMY <pre>, aby zachować znaki nowej linii (\n)
				// Dodajemy margin, aby zachować odstępy
				return `<pre class="mermaid" style="background: transparent; margin: 2rem 0;">${cleanText}</pre>`;
			}
			return false;
		}
	};

	marked.use(markedKatex({ throwOnError: false }));
	marked.use({ renderer });

	// Reaktywne przetwarzanie Markdown
	const articleHtml = $derived(article ? marked.parse(article.content) : '');

	mermaid.initialize({
		startOnLoad: false,
		theme: 'dark',
		securityLevel: 'loose'
	});

	async function renderVisuals() {
		await tick(); // Czekamy na Svelte

		const nodes = document.querySelectorAll<HTMLElement>('.mermaid');
		if (nodes.length > 0) {
			// KLUCZOWE: Mermaid nie dotknie elementu, który ma już ten atrybut
			nodes.forEach((node) => {
				node.removeAttribute('data-processed');
			});

			try {
				// Wywołujemy run bez parametrów lub z konkretnymi nodami
				await mermaid.run({
					nodes: Array.from(nodes)
				});
			} catch (err) {
				console.error('Błąd Mermaid:', err);
			}
		}
	}

	onMount(async () => {
		mermaid.initialize({
			startOnLoad: false,
			theme: 'dark',
			securityLevel: 'loose',
			fontFamily: 'inherit'
		});
		try {
			article = await articleService.getById(articleId!);
			if (article) await renderVisuals();
		} catch (error) {
			console.error('Błąd ładowania:', error);
		} finally {
			isLoading = false;
		}
	});

	// Dodatkowe zabezpieczenie: jeśli treść zmieni się dynamicznie
	$effect(() => {
		// Obserwujemy articleHtml - gdy się zmieni, odpalamy logikę
		if (articleHtml) {
			renderVisuals();
		}
	});
	function formatDate(dateStr: string | undefined) {
		if (!dateStr) return '';
		return new Date(dateStr).toLocaleDateString('pl-PL');
	}
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
					class="rounded-md border border-orange-500 px-4 py-2 text-sm font-bold text-orange-500 transition-all hover:bg-orange-500 hover:text-white active:scale-95"
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
