<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <template v-for="heading in toc" :key="`heading-${heading.text}`">
            <Collapsible v-if="heading.hasOwnProperty('children') && heading.children.length > 0" :title="heading.text" :titleSize="5" closed>
                <ul>
                    <li v-for="child in heading.children" :key="`child-${child.text}`">
                        <template v-if="child.hasOwnProperty('children') && child.children.length > 0">
                            <a :href="linkToUrl(child.link)">{{ child.text }}</a>
                            <ul class="pl-2 rtl:pr-2">
                                <li v-for="subchild in child.children">
                                    <a :href="linkToUrl(subchild.link)">{{ subchild.text }}</a>
                                </li>
                            </ul>
                        </template>
                        <a v-else :href="linkToUrl(child.link)">{{ child.text }}</a>
                    </li>
                </ul>
            </Collapsible>
            <Card v-else>
                <template v-slot:title>
                    <a :href="linkToUrl(heading.link)">
                        <h5 class="leading-6 font-medium">{{ heading.text }}</h5>
                    </a>
                </template>
            </Card>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        toc: Object,
        base: String,
    },
    methods: {
        linkToUrl(link) {
            return (this.base + link).split(/\/{1,}/).filter(a=>!a.match(/^\s*$/)).join('/').replace(':/','://');
        }
    }
}
</script>