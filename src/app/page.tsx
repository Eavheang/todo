"use client";

import { useState, FormEvent, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { format, parse } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { FaInfoCircle, FaEdit, FaList, FaCalendarAlt, FaTrash } from 'react-icons/fa';
import { createTask, getAllTasks, updateTask, deleteTask } from "@/actions/task";
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

interface Task {
  id: number; 
  text: string;
  date: string;
  time: string;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;           // ← new
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedTaskText, setEditedTaskText] = useState("");
  const [editedTaskDate, setEditedTaskDate] = useState("");
  const [editedTaskTime, setEditedTaskTime] = useState("");
  const [currentView, setCurrentView] = useState<'list' | 'calendar'>('list');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Load tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await getAllTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        toast.error("Failed to load tasks");
        console.error(error);
      }
    };

    loadTasks();
  }, []);

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (newTask.trim() !== "" && newDate && newTime) {
      try {
        const taskText = newTask.trim();
        const newTaskItem = await createTask({
          text: taskText,
          date: newDate,
          time: newTime,
        });
        // default completed to false
        setTasks([...tasks, { ...newTaskItem, completed: false }]);
        setNewTask("");
        setNewDate("");
        setNewTime("");
        toast.success(`Task "${taskText}" scheduled for ${newDate} at ${newTime}`);
      } catch (error) {
        toast.error("Failed to create task");
        console.error(error);
      }
    } else {
      toast.error("Please provide a task, date, and time.");
    }
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setEditedTaskText(task.text);
    setEditedTaskDate(task.date);
    setEditedTaskTime(task.time);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
    
  };

  const handleEditTask = async () => {
    if (!selectedTask) return;

    try {
      const updatedTask = await updateTask(Number(selectedTask.id), {
        text: editedTaskText,
        date: editedTaskDate,
        time: editedTaskTime
      });

      if (updatedTask) {
        const updatedTasks = tasks.map(task => {
          if (task.id === selectedTask.id) {
            return updatedTask;
          }
          return task;
        });

        setTasks(updatedTasks);
        setIsEditModalOpen(false);
        setSelectedTask(null);
        toast.success("Task updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update task");
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const success = await deleteTask(taskId);
      if (success) {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
        toast.success("Task deleted successfully!");
      }
    } catch (error) {
      toast.error("Failed to delete task");
      console.error(error);
    }
  };

  const openDeleteModal = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      handleDeleteTask(taskToDelete.id);
      closeDeleteModal();
    }
  };

  const handleToggleTaskCompletion = async (taskId: number, checked: boolean) => {
    try {
      await updateTask(taskId, { completed: checked });
      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, completed: checked } : t
      ));
      toast.success(`Task ${checked ? 'completed' : 'uncompleted'} successfully!`);
    } catch (error) {
      toast.error("Failed to update task status");
      console.error(error);
    }
  };


  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50 mx-auto">
      <Toaster position="bottom-right" richColors />
      <div className="z-10 w-full max-w-4xl items-start justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">My To-Do List</h1>

        <div className="w-full bg-white p-6 rounded-xl shadow-md">
          <form onSubmit={handleAddTask} className="space-y-4 mb-6">
            <div>
              <label htmlFor="task-input" className="sr-only">Task</label>
              <input
                id="task-input"
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What do you need to do?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-grow">
                <label htmlFor="date-input" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  id="date-input"
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div className="flex-grow">
                <label htmlFor="time-input" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  id="time-input"
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div className="flex-shrink-0">
                <button
                  type="submit"
                  className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors w-full sm:w-auto"
                >
                  Add Task
                </button>
              </div>
            </div>
          </form>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-700">Tasks</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentView('list')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    currentView === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <FaList className="inline mr-1" /> List
                </button>
                <button
                  onClick={() => setCurrentView('calendar')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    currentView === 'calendar' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <FaCalendarAlt className="inline mr-1" /> Calendar
                </button>
              </div>
            </div>

            {currentView === 'list' ? (
              tasks.length > 0 ? (
                <ul className="space-y-3">
                  {tasks.map(task => (
                    <li key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <label className="flex items-center gap-3 min-w-0">
                        <CheckboxPrimitive.Root
                          checked={task.completed}
                          onCheckedChange={checked => handleToggleTaskCompletion(task.id, checked as boolean)}
                          className="flex-shrink-0 h-5 w-5 rounded border border-gray-400 flex items-center justify-center text-blue-500"
                        >
                          <CheckboxPrimitive.Indicator>
                            <Check className="h-4 w-4" />
                          </CheckboxPrimitive.Indicator>
                        </CheckboxPrimitive.Root>

                        <span
                          className={`flex-1 min-w-0 break-words ${
                            task.completed ? 'line-through text-gray-400' : 'text-gray-900'
                          }`}
                          title={task.text}
                        >
                          {task.text}
                        </span>
                      </label>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-600">
                          {task.date} at {task.time}
                        </span>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <FaInfoCircle />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] font-mono">
                              <DialogHeader>
                                <DialogTitle className="text-left">Task Details</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4 space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                  <div className="mb-3">
                                    <label className="text-sm font-medium text-gray-600 block mb-1">Task:</label>
                                    <p className="text-gray-900 break-all whitespace-pre-wrap">{task.text}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <label className="font-medium text-gray-600 block mb-1">Date:</label>
                                      <p className="text-gray-900">{task.date}</p>
                                    </div>
                                    <div>
                                      <label className="font-medium text-gray-600 block mb-1">Time:</label>
                                      <p className="text-gray-900">
                                        {(() => {
                                          try {
                                            if (task.time && typeof task.time === 'string' && task.time.trim() !== '') {
                                              // Determine whether to use HH:mm or HH:mm:ss format
                                              const timeParts = task.time.split(':');
                                              const timeFormat = timeParts.length === 3 ? 'HH:mm:ss' : 'HH:mm';
                                              const timeDate = parse(task.time, timeFormat, new Date());
                                              return format(timeDate, 'h:mm a');
                                            } else {
                                              return 'No time set';
                                            }
                                          } catch (error) {
                                            console.error('Error parsing time in details:', task.time, error);
                                            return 'Invalid time';
                                          }
                                        })()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <button
                            onClick={() => openEditModal(task)}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => openDeleteModal(task)}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:text-red-600 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            title="Delete task"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  Your task list is empty. Add a task to get started!
                </p>
              )
            ) : (
                <Calendar
                  tasks={tasks}
                  onDateClick={(date) => {
                    const dateString = format(date, 'yyyy-MM-dd');
                    setNewDate(dateString);
                    setCurrentView('list');
                  }}
                  onEditTask={(task) => openEditModal(task)}
                  onDeleteTask={(task) => openDeleteModal(task)}
                  onToggleTaskCompletion={handleToggleTaskCompletion}
                />
            )}
          </div>
        </div>
      </div>
      {/* Edit Modal */}
      {isEditModalOpen && selectedTask && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white font-mono">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Task</h3>
              <div className="mt-2">
                <input
                  type="text"
                  value={editedTaskText}
                  onChange={(e) => setEditedTaskText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 mb-2 font-mono"
                />
                <input
                  type="date"
                  value={editedTaskDate}
                  onChange={(e) => setEditedTaskDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 mb-2 font-mono"
                />
                <input
                  type="time"
                  value={editedTaskTime}
                  onChange={(e) => setEditedTaskTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 mb-2 font-mono"
                />
              </div>
            </div>
            <div className="items-center px-4 py-3">
              <button
                className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleEditTask}
              >
                Update
              </button>
              <button
                className="px-4 py-2 bg-white text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 border border-gray-300"
                onClick={closeEditModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        taskText={taskToDelete?.text || ''}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />
    </main>
  );
}