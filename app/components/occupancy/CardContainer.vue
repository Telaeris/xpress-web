<template>
    <div 
        class="
            grow border-1 border-gray-300 p-2 overflow-y-auto overflow-x-hidden
            grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2
            auto-rows-min justify-center items-start
        "
    >
        <slot></slot>
    </div>
</template>
