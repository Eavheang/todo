"use client";

import React from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  taskText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({ isOpen, taskText, onConfirm, onCancel }: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
      <div className="relative top-20 mx-auto p-6 border w-96 shadow-lg rounded-md bg-white font-mono">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Delete Task
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2 font-mono">
            Are you sure you want to delete this task?
          </p>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900 break-words font-mono" title={taskText}>
              {taskText}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2 font-mono">
            This action cannot be undone.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-white text-gray-700 text-base font-medium rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
