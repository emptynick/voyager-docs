<template>
    <div>
        <Card :title="title">
            <template #actions>
                <SlideIn>
                    <MarkdownView :options="{ baseUrl: base }" :renderer="renderer()">{{ toc }}</MarkdownView>
                    <template #opener>
                        <button class="button blue">Menu</button>
                    </template>
                </SlideIn>
            </template>
            <div id="doc-content">
                <MarkdownView :options="{ baseUrl: path }" :renderer="renderer()" ref="mdcontent">{{ content }}</MarkdownView>
            </div>
        </Card>
        <Modal ref="imageModal" :title="selectedImageTitle" size="full">
            <div class="w-full inline-flex self-center">
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

hljs.registerLanguage('php', php);
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);
hljs.registerLanguage('javascript', javascript);

export default {
    props: {
        title: String,
        content: String,
        toc: String,
        base: String,
        path: String,
    },
    methods: {
        renderer() {
            let base = this.base;
            return {
                heading(text, level) {
                    return `<h${level} class="my-2" id="${slugify(text, { lower: true })}">${text}</h${level}>`;
                },
                image(href, title, text) {
                    return `<img src="${base}${href.replace('../', '')}" alt="${title || text}" class="mx-auto py-2 max-w-full lg:max-w-4/6 cursor-pointer">`;
                },
                table(header, body) {
                    return `<div class="voyager-table striped"><table><thead>${header}</thead>${body}</table></div>`;
                }
            }
        }
    },
    data() {
        return {
            selectedImageSource: null,
            selectedImageTitle: null,
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
    }
}
</script>