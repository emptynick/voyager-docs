<template>
    <div>
        <Card title="Menu">
            <div class="grid grid-cols-4 gap-4">
                <Collapsible v-for="heading in tocs" :title="heading.title" :key="`heading-${heading.title}`" :titleSize="5" closed>
                    <ul>
                        <li v-for="child in heading.children" :key="`child-${child.title}`">
                            <span v-html="markdownToLink(child.title)"></span>
                            <ul v-if="child.children.length > 0" class="ml-4">
                                <li v-for="subChild in child.children" :key="`subchild-${subChild.title}`">
                                    <span v-html="markdownToLink(subChild.title)"></span>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </Collapsible>
            </div>
        </Card>
        <Card title="On this page">
            <div class="flex-wrap space-x-2 space-y-2">
                <a class="button accent" v-for="heading in headings" :key="`heading-${heading}`" :href="`#${slugify(heading, { lower: true })}`">
                    {{ heading }}
                </a>
            </div>
        </Card>
        <Card :title="title">
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
        markdownToLink(input) {
            return input.replace(/\[(.*?)\]\((.*?)\)/gim, `<a href="${this.base}$2">$1</a>`);
        }
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
    computed: {
        tocs() {
            let toc = [];
            this.toc.split(/\r?\n/).filter((x) => x !== '').forEach((line) => {
                if (line.startsWith('##')) {
                    toc.push({
                        title: line.substr(3),
                        children: []
                    });
                } else if (toc.length > 0) {
                    if (line.startsWith('*')) {
                        toc[toc.length - 1].children.push({
                            title: line.substr(2),
                            children: [],
                        });
                    } else if (line.startsWith('  *')) {
                        let l = toc.length - 1;
                        toc[l].children[toc[l].children.length - 1].children.push({
                            title: line.substr(4),
                            children: [],
                        });
                    }
                }
            });

            return toc;
        }
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