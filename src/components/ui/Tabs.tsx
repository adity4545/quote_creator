import React, { createContext, useContext, useState } from 'react';

type TabsContextType = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex bg-neutral-700 rounded-lg p-1 ${className}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ 
  value, 
  children,
  className = ''
}) => {
  const { value: selectedValue, onValueChange } = useTabs();
  const isActive = selectedValue === value;
  
  return (
    <button
      type="button"
      onClick={() => onValueChange(value)}
      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
        isActive 
          ? 'bg-neutral-800 text-primary-400 shadow-sm' 
          : 'text-neutral-300 hover:text-white'
      } ${className}`}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children }) => {
  const { value: selectedValue } = useTabs();
  
  if (selectedValue !== value) {
    return null;
  }
  
  return <div className="mt-2">{children}</div>;
};