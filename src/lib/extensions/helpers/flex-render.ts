import { SvelteComponent } from "svelte";
import Placeholder from './Placeholder.svelte';
import { renderComponent } from "./render-component";

function isSvelteServerComponent(component: any) {
    return (
        typeof component === 'object' &&
        typeof component.$$render === 'function' &&
        typeof component.render === 'function'
    )
}

function isSvelteClientComponent(component: any) {
    const isHMR = '__SVELTE_HMR' in window

    return (
        component.prototype instanceof SvelteComponent ||
        (isHMR &&
            component.name?.startsWith('Proxy<') &&
            component.name?.endsWith('>'))
    )
}

function isSvelteComponent(component: any) {
    if (typeof document === 'undefined') {
        return isSvelteServerComponent(component)
    } else {
        return isSvelteClientComponent(component)
    }
}

function wrapInPlaceholder(content: any) {
    return renderComponent(Placeholder, { content })
}

export function flexRender(component: any, props: any) {
    if (!component) return null;

    if (isSvelteComponent(component)) {
        return renderComponent(component, props) as unknown as ConstructorOfATypedSvelteComponent
    }

    if (typeof component === 'function') {
        const result = component(props)
        if (result === null || result === undefined) return null

        if (isSvelteComponent(result)) {
            return renderComponent(result, props) as unknown as ConstructorOfATypedSvelteComponent
        }

        return wrapInPlaceholder(result) as unknown as ConstructorOfATypedSvelteComponent
    }

    return wrapInPlaceholder(component) as unknown as ConstructorOfATypedSvelteComponent
}
