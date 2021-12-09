<template>
    <div>
        <Card title="Menu">
            <TOC :toc="toc" :base="base"></TOC>
            
            <Card title="On this page" class="mt-4">
                <div class="flex-wrap space-x-2 space-y-2">
                    <a class="button accent" v-for="heading in headings" :key="`heading-${heading}`" :href="`#${slugify(heading, { lower: true })}`">
                        {{ heading }}
                    </a>
                </div>
            </Card>
        </Card>
        
        <Card :title="title">
            <template #actions>
                <a :href="`https://github.dev/voyager-admin/voyager/tree/2.x/docs/${page}`" target="_blank" class="button accent">Edit on Github</a>
            </template>
            <div id="doc-content">
                <MarkdownView :options="{ baseUrl: path }" :renderer="renderer()" ref="mdcontent">{{ content }}</MarkdownView>
            </div>
        </Card>
        <Modal ref="imageModal" :title="selectedImageTitle" size="full">
            <div class="w-full inline-flex justify-center">
                <img :src="selectedImageSource" class="max-w-full">
            </div>
        </Modal>
    </div>
</template>

<script>
import hljs from 'highlight.js/lib/core';

import php from 'highlight.js/lib/languages/php';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import javascript from 'highlight.js/lib/languages/javascript';

import EventBus from 'eventbus';

hljs.registerLanguage('php', php);
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);
hljs.registerLanguage('javascript', javascript);

import TOC from './TOC.vue';

export default {
    props: {
        title: String,
        content: String,
        toc: String,
        base: String,
        path: String,
        page: String,
    },
    components: {
        TOC,
    },
    methods: {
        renderer() {
            let base = this.base;
            let path = this.path;
            return {
                image(href, title, text) {
                    return `<img src="${base}${href.replace('../', '')}" alt="${title || text}" class="mx-auto py-2 max-w-full lg:max-w-4/6 cursor-pointer">`;
                },
                table(header, body) {
                    return `<div class="voyager-table striped"><table><thead>${header}</thead>${body}</table></div>`;
                },
                heading(src, level) {
                    // Strip out first heading (shown in card header)
                    if (level == 1) {
                        return '';
                    }
                    EventBus.emit('docs-push-heading', src);

                    return `<h${level+1} class="mt-4" id="${slugify(src, { lower: true })}">${src}</h${level+1}>`;
                },
                link(href, title, text) {
                    if (href.startsWith('http://') || href.startsWith('https://')) {
                        return `<a href="${href}" target="_blank">${text}</a>`;
                    }

                    return `<a href="${path}${href}">${text}</a>`;
                }
            }
        },
    },
    data() {
        return {
            selectedImageSource: null,
            selectedImageTitle: null,
            headings: [],
        }
    },
    mounted() {
        document.getElementById('doc-content').getElementsByTagName('img').forEach((image) => {
            if (image.src.startsWith(this.base)) {
                image.addEventListener('click', () => {
                    this.selectedImageSource = image.src;
                    this.selectedImageTitle = image.alt;

                    this.$refs.imageModal.open();
                });
            }
        });
    },
    created() {
        document.addEventListener('DOMContentLoaded', (event) => {
            document.querySelectorAll('pre code').forEach((el) => {
                hljs.highlightElement(el);
            });
        });

        EventBus.on('docs-push-heading', (src) => {
            this.headings.push(src);
        });
    }
}
</script>