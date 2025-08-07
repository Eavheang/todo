"use server";

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { tasks, NewTask, Task } from '@/db/schema';
import { eq } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(pool);

// Helper function to handle both 12-hour and 24-hour time formats
function normalizeTime(timeInput: string): string {
  if (!timeInput || typeof timeInput !== 'string') {
    throw new Error('Invalid time format');
  }
  
  const trimmedTime = timeInput.trim();
  
  // Check if it's already in 24-hour format (HH:MM, H:MM, or HH:MM:SS)
  if (trimmedTime.match(/^\d{1,2}:\d{2}(:\d{2})?$/) && !trimmedTime.toLowerCase().includes('am') && !trimmedTime.toLowerCase().includes('pm')) {
    const timeParts = trimmedTime.split(':');
    const hours = timeParts[0];
    const minutes = timeParts[1];
    const seconds = timeParts[2] || '00'; // Default to '00' if no seconds provided
    const hour = parseInt(hours, 10);
    
    if (hour >= 0 && hour <= 23) {
      return `${hour.toString().padStart(2, '0')}:${minutes}:${seconds}`;
    }
  }
  
  // Handle 12-hour format with AM/PM
  const parts = trimmedTime.split(' ');
  if (parts.length !== 2) {
    throw new Error(`Time must be in "HH:MM", "HH:MM:SS" or "HH:MM AM/PM" format. Received: "${timeInput}"`);
  }
  
  const [time, modifier] = parts;
  const timeParts = time.split(':');
  
  if (timeParts.length !== 2) {
    throw new Error('Time must be in HH:MM format');
  }
  
  const [hours, minutes] = timeParts;
  let hour24 = parseInt(hours, 10);
  
  if (isNaN(hour24) || hour24 < 1 || hour24 > 12) {
    throw new Error('Invalid hour value for 12-hour format');
  }
  
  const normalizedModifier = modifier.toUpperCase();
  
  if (normalizedModifier === 'AM') {
    if (hour24 === 12) {
      hour24 = 0; // 12 AM = 00:xx
    }
  } else if (normalizedModifier === 'PM') {
    if (hour24 !== 12) {
      hour24 += 12; // 1 PM = 13:xx, but 12 PM stays 12:xx
    }
  } else {
    throw new Error(`Invalid AM/PM modifier: "${modifier}"`);
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minutes}:00`;
}

// Insert a new task
export async function createTask(taskData: Omit<NewTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
  try {
    const [newTask] = await db.insert(tasks).values({
      text: taskData.text,
      date: taskData.date,
      time: normalizeTime(taskData.time), // Use the new function
    }).returning();
    
    return newTask;
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }
}

// Get all tasks
export async function getAllTasks(): Promise<Task[]> {
  try {
    const allTasks = await db.select().from(tasks);
    return allTasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
}

// Update a task
export async function updateTask(id: number, taskData: Partial<Omit<NewTask, 'id' | 'createdAt'>>): Promise<Task | null> {
  try {
    const updateData: Partial<Omit<NewTask, 'id' | 'createdAt'>> & { updatedAt: Date; time?: string } = { 
      ...taskData, 
      updatedAt: new Date() 
    };
    
    // Convert time format if time is being updated
    if (taskData.time) {
      updateData.time = normalizeTime(taskData.time); // Use the new function
    }
    
    const [updatedTask] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning();
    
    return updatedTask || null;
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }
}

// Delete a task
export async function deleteTask(id: number): Promise<boolean> {
  try {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return result.rowCount! > 0;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }
}

// Get a single task by ID
export async function getTaskById(id: number): Promise<Task | null> {
  try {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || null;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw new Error('Failed to fetch task');
  }
}