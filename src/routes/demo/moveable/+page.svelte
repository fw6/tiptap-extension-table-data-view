<script lang="ts">
    import Moveable from 'moveable'
    import { onMount } from 'svelte'

    let wrapperEle: HTMLElement

    onMount(() => {
        const clientRect = wrapperEle.getBoundingClientRect()

        const moveable = new Moveable(wrapperEle, {
            target: document.querySelectorAll<HTMLElement>('.rect'),
            draggable: true,
            throttleDrag: 1,

            edgeDraggable: false,
            edge: true,
            // horizontalGuidelines: [0, clientRect.width],
            // verticalGuidelines: [0, clientRect.height],

            snappable: true,
            snapThreshold: 5,
            snapDirections: {
                top: true,
                left: true,
                bottom: true,
                right: true,
            },
            // elementGuidelines
        })

        moveable.on('drag', ({ target, transform }) => {
            target.style.transform = transform
        })
        moveable.on('dragStart', ({ target }) => {
            target.style.cursor = 'grabbing'
        })
        moveable.on('dragEnd', ({ target }) => {
            target.style.cursor = 'default'
        })

        moveable.on('resize', ({ target, transform }) => {
            target.style.transform = transform
        })
    })
</script>

<div class="wrapper" bind:this={wrapperEle}>
    <div class="content-container">
        <div class="rect">Rect1</div>
        <!-- <div class="rect">Rect2</div>
        <div class="rect">Rect3</div>
        <div class="rect">Rect4</div> -->
    </div>
</div>

<style lang="postcss">
    .wrapper {
        height: 640px;
        width: 100%;
        border: 1px solid cyan;

        .content-container {
            position: relative;
            height: 100%;
            width: 100%;

            .rect {
                position: absolute;
                width: 100px;
                height: 100px;
                background-color: red;
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 20px;
                cursor: default;
            }
        }
    }
</style>
