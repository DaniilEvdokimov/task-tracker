import { create } from 'zustand';

interface ModalState {
	isTaskCreationModalOpen: boolean;
	openTaskCreationModal: () => void;
	closeTaskCreationModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
	isTaskCreationModalOpen: false,
	openTaskCreationModal: () => set({ isTaskCreationModalOpen: true }),
	closeTaskCreationModal: () => set({ isTaskCreationModalOpen: false }),
}));