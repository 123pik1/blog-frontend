import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaid';
import rehypeStringify from 'rehype-stringify';

function renderMermaid(mermaidString: string) {

}




async function renderMarkdown(rawMarkdown: string): Promise<string> {

    const file = await unified()
        .use(remarkParse)          // Parsuj Markdown do drzewa (AST)
        .use(remarkMath)           // Wykryj wzory matematyczne $ i $$
        .use(remarkRehype)         // Zamień Markdown na drzewo HTML
        .use(rehypeKatex)          // Zamień wzory matematyczne na HTML/CSS
        .use(rehypeMermaid, {      // Znajdź bloki ```mermaid i zamień na <svg>
            strategy: 'inline-svg',
            mermaidConfig: {
                theme: 'base', // Używamy bazy, aby mieć pełną kontrolę
                themeVariables: {
                    primaryColor: '#3b82f6', // np. niebieski dla boksów
                    primaryTextColor: '#ffffff',
                    lineColor: '#f8fafc',    // KOLOR STRZAŁEK (jasny szary/biały)
                    tertiaryColor: '#1e293b'
                },
                // Wstrzykujemy surowy CSS, który nadpisze wszystko inne
                themeCSS: `
      .edgePath .path { stroke: #f8fafc !important; stroke-width: 2px !important; }
      #mermaid-main .arrowheadPath { fill: #f8fafc !important; }
      .marker { fill: #f8fafc !important; }
      g.edgePath path { stroke: #f8fafc !important; }
    `
            }
        })
        .use(rehypeStringify)      // Zamień drzewo HTML na finalny string
        .process(rawMarkdown);

    return String(file);
}

export const markdownParserService = {
    renderVisual: (str: string) => renderMarkdown(str) as Promise<string>,
}
