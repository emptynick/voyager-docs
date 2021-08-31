<template>
    <Card :title="title">
        <div class="w-full my-4 flex space-x-1">
            <template v-for="(main, title) in toc">
                <template v-if="title !== ''">
                    <Dropdown class="self-center" placement="bottom-start">
                        <template v-for="(sub, subtitle) in main">
                            <a v-if="sub.title" :href="getLink(sub.href)" class="link rounded">{{ sub.title }}</a>
                            <div v-else class="block mx-6 my-3 leading-tight">
                                <span class="block px-6">{{ subtitle }}</span>
                                <a v-for="subsub in sub" :href="getLink(subsub.href)" class="link rounded mx-2">
                                    {{ subsub.title }}
                                </a>
                            </div>
                        </template>
                        <template #opener>
                            <button class="button accent">
                                <span>{{ title }}</span>
                                <Icon icon="chevron-down" />
                            </button>
                        </template>
                    </Dropdown>
                </template>
                <template v-else>
                    <a class="button accent" :href="getLink(main[0].href)">{{ main[0].title }}</a>
                </template>
            </template>
        </div>
        <div id="doc-content" v-html="parseContent(content, true)"></div>
    </Card>
</template>

<script>
import hljs from 'highlight.js/lib/core';

import php from 'highlight.js/lib/languages/php';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('php', php);
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);
hljs.registerLanguage('javascript', javascript);

export default {
    props: {
        title: String,
        content: String,
        toc: Object,
        path: String,
        current: String,
    },
    methods: {
        parseContent(input, relative) {
            let content = this.parseLinks(
                this.parseImages(
                    this.parseLists(
                        this.parseInfoBlocks(
                                this.parseCode(
                                    this.parseHeadings(input)
                                )
                        )
                    )
                )
            , relative);

            return content;
        },
        parseLinks(input, relative) {
            return input.replace(/href=\"(.+)\"/g, (block, url) => {
                if (url.startsWith('#')) {
                    return `href="${url}"`;
                } else if (!url.startsWith('https://') && !url.startsWith('http://')) {
                    if (!relative) {
                        url = url.replaceAll('./', '');
                        return `href="${route('voyager.voyager-docs')}?path=${url}"`;
                    }
                    let current = this.current.substring(0, this.current.lastIndexOf('/'));
                    url = this.resolveRelativePath(current+'/'+url);
                    url = url.replaceAll('./', '');

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
            return input.replace(/<code class=\"language-(.*?)\"\>(.*?)<\/code>/gmis, (block, language, content) => {
                return `<code style="padding: 0 !important">${hljs.highlight(this.decodeHtml(content), {language: language}).value}</code>`;
            });
        },
        decodeHtml(html) {
            var txt = document.createElement('textarea');
            txt.innerHTML = html;

            return txt.value;
        },
        resolveRelativePath(path) {
            var parts = path.split('/');
            var i = 1;
            while (i < parts.length) {
                if (parts[i] === '..' && i > 0 && parts[i-1] !== '..') {
                    parts.splice(i-1, 2);
                    i -= 2;
                }
                i++;
            }

            return parts.join('/');
        },
        getLink(link) {
            return `${this.route('voyager.voyager-docs')}?path=${link}`;
        }
    }
}
</script>