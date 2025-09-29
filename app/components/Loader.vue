<!-- This is a Dynamic Loader that will always overlay over the container you bind it to -->
<template>
    <div v-if="active" :style="style" :class="props.class" class="fixed z-50 flex justify-center items-center pointer-events-auto">
        <!-- Semi-transparent background -->
        <div class="absolute w-full h-full bg-black/10"></div>
        <!-- Spinner -->
        <Spinner />
    </div>
</template>

<script setup lang="ts">
    interface Props {
        containerRef: HTMLElement | null;
        active?: boolean;
        class?: string;
    }

    const props = defineProps<Props>();
    const style = ref({});
    const active = ref(props.active ?? true);

    let resizeObserver: ResizeObserver;

    const updatePosition = () => {
        if (!props.containerRef) return;
        const rect = props.containerRef.getBoundingClientRect();
        style.value = {
            top: rect.top + 'px',
            left: rect.left + 'px',
            width: rect.width + 'px',
            height: rect.height + 'px',
        };
    };

    onMounted(() => {
        nextTick(() => {
            updatePosition();
            window.addEventListener('scroll', updatePosition);
            window.addEventListener('resize', updatePosition);

            if (props.containerRef) {
                resizeObserver = new ResizeObserver(updatePosition);
                resizeObserver.observe(props.containerRef);
            }
        });
    });

    onBeforeUnmount(() => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
        if (resizeObserver && props.containerRef) resizeObserver.unobserve(props.containerRef);
    });

    // Watching for enabling/disabling the loader
    watch(() => props.active, (val) => (active.value = val));
</script>
