<template>
    <div>
        <collapsible title="Table of contents" closed>
            <div v-html="parseContent(toc)"></div>
        </collapsible>

        <card :title="title">
            <div id="doc-content" v-html="parseContent(content)"></div>
        </card>
    </div>
</template>

<script>
import hljs from 'highlight.js/lib/core';

import php from 'highlight.js/lib/languages/php';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('php', php);
hljs.registerLanguage('css', php);
hljs.registerLanguage('javascript', php);

export default {
    props: {
        title: String,
        content: String,
        toc: String,
        path: String
    },
    methods: {
        parseContent(input) {
            let content = this.parseLinks(
                this.parseImages(
                    this.parseLists(
                        this.parseInfoBlocks(
                            this.parseHeadings(
                                this.parseCode(input)
                            )
                        )
                    )
                )
            );

            return content;
        },
        parseLinks(input) {
            return input.replace(/href=\"(.+)\"/g, (block, url) => {
                if (url.startsWith('#')) {
                    return `href="${url}"`;
                } else if (!url.startsWith('https://') && !url.startsWith('http://')) {
                    url = url.replaceAll('../', '');

                    return `href="${route('voyager.voyager-docs')}?path=${url}"`;
                }

                return `href="${url}" target="_blank"`;
            });
        },
        parseInfoBlocks(input) {
            return input.replace(/{% hint style=&quot;([^&]+)&quot; %}([^{]+){% endhint %}/gmi, (block, type, content) => {
                let color = 'red';
                if (type == 'info') {
                    color = 'blue';
                } else if (type == 'warning') {
                    color = 'yellow';
                }

                return `<div class="rounded-md p-2 border border-${color}-500 text-sm leading-5 text-${color}-500 my-2">${content}</div>`;
            });
        },
        parseImages(input) {
            return input.replace(/src=\"(.+)\"/g, (block, url) => {
                if (!url.startsWith('https://') && !url.startsWith('http://')) {
                    url = url.replaceAll('../', '').replace('.gitbook/assets/', '');

                    return `src="${route('voyager.voyager-docs-asset')}?path=${url}" class="mx-auto py-2"`;
                }

                return `src="${url}"`;
            });
        },
        parseLists(input) {
            return input.replaceAll('<ul>', '<ul class="pl-4">');
        },
        parseHeadings(input) {
            return input.replace(/<h([1-6])>([^<]+)/g, (block, heading, content) => {
                let slug = slugify(content, { lower: true });
                return `<h${parseInt(heading)+2} class="mt-6 mb-2"><a href="#${slug}" id="${slug}">${content}</a>`;
            });
        },
        parseCode(input) {
            return input.replace(/<code class=\"language-([^&]+)\">([^<]+)<\/code>/gmi, (block, language, content) => {
                return `<code>${hljs.highlight(this.decodeHtml(content), {language: language}).value}</code>`;
            });
        },
        decodeHtml(html) {
            var txt = document.createElement('textarea');
            txt.innerHTML = html;

            return txt.value;
        }
    }
}
</script>