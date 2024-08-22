export class CssVariables {
    static get backgroundColor(): string {
        const bodyElement = document.querySelector<HTMLElement>('body');
        if (!bodyElement) throw new Error('Body element not found');
        const computedBodyStyles = window.getComputedStyle(bodyElement);
        const bgColorProperty = computedBodyStyles.getPropertyValue('--bg-color');
        if (!bgColorProperty) throw new Error('Background color not found');
        return bgColorProperty;
    }
}