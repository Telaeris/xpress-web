/**
 * Global confirmation dialog state. Controls the visibility, text, and action of the dialog.
 */
export const useConfirm = () => {
    const confirmDialogVisible = useState<boolean>('confirmDialogVisible', () => false);
    const confirmDialogText = useState<string>('confirmDialogText', () => '');
    const confirmAction = useState<(() => void) | undefined>('confirmAction', () => undefined);

    const showConfirmDialog = (text: string, action: () => void) => {
        confirmDialogText.value = text;
        confirmAction.value = () => {
            hideConfirmDialog();
            action();
        };
        confirmDialogVisible.value = true;
    }

    const hideConfirmDialog = () => {
        confirmDialogVisible.value = false;
    }

    return {
        confirmDialogVisible,
        confirmDialogText,
        confirmAction,
        showConfirmDialog,
        hideConfirmDialog,
    }
}

/**
 * Usage: wrap any action that requires confirmation with showConfirmDialog.
 * Example:
 * showConfirmDialog('Are you sure you want to delete this item?', () => {
 *     // Action to perform on confirmation
 * });
 * 
 * The confirmation dialog component should be included in the root layout to function properly.
 */
export const withConfirm = (text: string, action: () => void) => {
    const { showConfirmDialog } = useConfirm();
    showConfirmDialog(text, action);
}
