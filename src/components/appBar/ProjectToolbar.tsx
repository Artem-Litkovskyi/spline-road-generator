import { useRef, useState } from 'react';
import { Toolbar } from '@mui/material';

import { AppBarButton } from '../MuiWrappers.tsx';
import { ConfirmDiscardDialog } from './ConfirmDiscardDialog.tsx';

import { useProjectContext } from '../../hooks/useProjectContext.ts';
import { SaveDialog } from './SaveDialog.tsx';

type PendingAction =
    | { type: 'new' }
    | { type: 'open'; file?: File }
    | null;

export function ProjectToolbar() {
    const projectContext = useProjectContext();

    const [saveOpen, setSaveOpen] = useState(false);
    const [saveFilename, setSaveFilename] = useState(projectContext.filename);

    const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<PendingAction>(null);
    const [saveThenExecute, setSaveThenExecute] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Toolbar buttons
    const handleNew = () => {
        if (!projectContext.dirty) {
            projectContext.newProject();
            return;
        }

        setPendingAction({ type: 'new' });
        setConfirmDiscardOpen(true);
    };

    const handleOpen = () => {
        if (!projectContext.dirty) {
            fileInputRef.current?.click();
            return;
        }

        setPendingAction({ type: 'open' });
        setConfirmDiscardOpen(true);
    };

    const handleSave = () => {
        setSaveFilename(projectContext.filename);
        setSaveOpen(true);
    };

    // Dialog buttons
    const handleCancel = () => {
        setSaveOpen(false);
        setConfirmDiscardOpen(false);
        setPendingAction(null);
    }

    const handleSaveConfirm = async () => {
        projectContext.saveProject(saveFilename);
        setSaveOpen(false);

        if (saveThenExecute) {
            setSaveThenExecute(false);
            await executePending();
        }
    }

    const handleConfirmDiscardDontSave = async () => {
        await executePending();
        setConfirmDiscardOpen(false);
    };

    const handleConfirmDiscardSave = async () => {
        setConfirmDiscardOpen(false);
        setSaveThenExecute(true);
        handleSave();
    };

    const executePending = async () => {
        if (!pendingAction) return;

        if (pendingAction.type === 'new') {
            projectContext.newProject();
        }

        if (pendingAction.type === 'open') {
            if (pendingAction.file) {
                await projectContext.openProject(pendingAction.file);
            } else {
                fileInputRef.current?.click();
            }
        }

        setPendingAction(null);
    };

    // File input
    const handleFileSelected = async (file: File) => {
        await projectContext.openProject(file);
    };

    return (
        <Toolbar variant='dense'>
            <AppBarButton onClick={handleNew}>New</AppBarButton>
            <AppBarButton onClick={handleOpen}>Open</AppBarButton>
            <AppBarButton onClick={handleSave}>Save</AppBarButton>

            <SaveDialog
                filename={saveFilename}
                setFilename={setSaveFilename}
                open={saveOpen}
                onCancel={handleCancel}
                onConfirm={handleSaveConfirm}
            />

            <ConfirmDiscardDialog
                open={confirmDiscardOpen}
                onCancel={handleCancel}
                onDontSave={handleConfirmDiscardDontSave}
                onSave={handleConfirmDiscardSave}
            />

            <input
                type='file'
                accept='application/json'
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleFileSelected(file);
                }}
            />
        </Toolbar>
    );
}