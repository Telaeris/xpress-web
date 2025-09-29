<template>
    <div class="bg-dark-blue p-3 flex flex-row items-center justify-between">
        <span class="text-white text-lg tracking-wider flex-row items-center gap-x-2 inline-flex">
            <slot name="title"></slot>
            <slot name="leftActions"></slot>
        </span>
        <slot name="rightActions"></slot>
    </div>
</template>        
