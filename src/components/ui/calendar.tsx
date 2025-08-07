"use client";

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, parse } from 'date-fns';
import { FaChevronLeft, FaChevronRight, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

interface Task {
  id: string;
  text: string;
  date: string;
  time: string;
}

interface CalendarProps {
  tasks: Task[];
  onDateClick?: (date: Date) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  shouldReopenTaskModal?: { date: Date; shouldOpen: boolean };
  onTaskModalReopened?: () => void;
}

export function Calendar({ tasks, onDateClick, onEditTask, onDeleteTask, shouldReopenTaskModal, onTaskModalReopened }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return tasks.filter(task => task.date === dateString);
  };

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Effect to handle reopening task modal when edit is cancelled
  useEffect(() => {
    if (shouldReopenTaskModal?.shouldOpen && shouldReopenTaskModal.date) {
      setSelectedDate(shouldReopenTaskModal.date);
      setShowTaskModal(true);
      onTaskModalReopened?.();
    }
  }, [shouldReopenTaskModal, onTaskModalReopened]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Today
          </button>
          <button
            onClick={previousMonth}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 text-sm md:text-base">
        {/* Empty cells for days before the month starts */}
        {Array.from({ length: monthStart.getDay() }, (_, i) => (
          <div key={`empty-${i}`} className="h-16 md:h-24 p-1"></div>
        ))}
        
        {/* Days of the month */}
        {days.map((day) => {
          const dayTasks = getTasksForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);
          
          return (
            <div
              key={day.toISOString()}
              className={`h-16 md:h-24 p-1 border border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 ${
                !isCurrentMonth ? 'text-gray-400' : ''
              } ${isTodayDate ? 'bg-blue-50 border-blue-300' : ''}`}
              onClick={() => {
                if (dayTasks.length > 0) {
                  setSelectedDate(day);
                  setShowTaskModal(true);
                } else {
                  onDateClick?.(day);
                }
              }}
            >
              <div className={`text-sm font-medium mb-1 ${
                isTodayDate ? 'text-blue-600' : 'text-gray-900'
              }`}>
                {format(day, 'd')}
              </div>
              
              {/* Task indicators */}
              <div className="space-y-1">
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate"
                    title={`${task.text} at ${task.time}`}
                  >
                    {task.text}
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <div className="text-xs text-gray-500 px-1">
                    +{dayTasks.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-50 border border-blue-300 rounded"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-100 rounded"></div>
          <span>Tasks</span>
        </div>
      </div>

      {/* Task Details Modal */}
      {showTaskModal && selectedDate && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white font-mono">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Tasks for {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {getTasksForDate(selectedDate).map((task) => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 break-words">{task.text}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Time: {format(parse(task.time, 'HH:mm', new Date()), 'h:mm a')}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-3">
                      <button
                        onClick={() => {
                          onEditTask?.(task);
                          setShowTaskModal(false);
                        }}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Edit task"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          onDeleteTask?.(task);
                          setShowTaskModal(false);
                        }}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Delete task"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button
                onClick={() => {
                  onDateClick?.(selectedDate);
                  setShowTaskModal(false);
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Task to This Date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
