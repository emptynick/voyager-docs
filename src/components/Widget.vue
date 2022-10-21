<template>
    <TOC :toc="toc" :base="base" />
</template>

<script>
import TOC from './TOC.vue';

export default {
    props: {
        toc: Object,
        base: String,
    },
    components: { TOC }
}
</script>