<template>
    <TOC :toc="toc" :base="base" />
</template>

<script>
import TOC from './TOC.vue';

export default {
    props: {
        toc: String,
        base: String,
    },
    components: { TOC }
}
</script>