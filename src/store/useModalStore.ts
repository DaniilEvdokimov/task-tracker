import { create } from 'zustand';

interface ModalState {
	isTaskCreationModalOpen: boolean;
	openTaskCreationModal: () => void;
	closeTaskCreationModal: () => void;

	isProjectCreationModalOpen: boolean;
	openProjectCreationModal: () => void;
	closeProjectCreationModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
	isTaskCreationModalOpen: false,
	openTaskCreationModal: () => set({ isTaskCreationModalOpen: true }),
	closeTaskCreationModal: () => set({ isTaskCreationModalOpen: false }),

	isProjectCreationModalOpen: false,
	openProjectCreationModal: () => set({ isProjectCreationModalOpen: true }),
	closeProjectCreationModal: () => set({ isProjectCreationModalOpen: false }),
}));
