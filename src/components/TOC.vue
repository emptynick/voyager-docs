<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
</template>

<script>
export default {
    props: {
        toc: String,
        base: String,
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
    methods: {
        markdownToLink(input) {
            return input.replace(/\[(.*?)\]\((.*?)\)/gim, `<a href="${this.base}$2">$1</a>`);
        }
    }
}
</script>