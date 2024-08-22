export class CssVariables {
    static get primaryColor(): string {
        const bodyElement = document.querySelector<HTMLElement>('body');
        if (!bodyElement) throw new Error('Body element not found');
        const computedBodyStyles = window.getComputedStyle(bodyElement);
        const bgColorProperty = computedBodyStyles.getPropertyValue('--mat-primary');
        if (!bgColorProperty) throw new Error('Background color not found');
        return bgColorProperty;
    }
}