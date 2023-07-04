const bookOfStyles = {
  purchase: [
    'bg-white',
    'px-4',
    'py-3',
    'sm:grid',
    'sm:grid-cols-3',
    'sm:gap-4',
    'sm:items-start',
    'sm:border-b',
    'sm:border-gray-200',
  ],
  purchaseTitle: ['text-lg', 'font-medium', 'text-gray-900', 'sm:col-span-2'],
  purchaseQuantity: [
    'w-[50px]',
    'text-center',
    'py-1',
    'px-2',
    'border',
    'border-emerald-500',
    'border-2',
    'disabled:border-gray-700',
    'rounded',
    'text-emerald-500',
    'text-sm',
    'leading-tight',
    'font-bold',
    'disabled:text-gray-700',
    'focus:outline-none',
    'focus:shadow-outline',
  ],
  purchaseQuantityWrapper: ['flex', 'flex-row', 'justify-end'],
  purchaseType: [
    'w-fit',
    'py-1',
    'px-2',
    'border',
    'border-emerald-500',
    'border-2',
    'disabled:border-gray-700',
    'rounded',
    'leading-tight',
    'focus:outline-none',
    'focus:shadow-outline',
    'text-sm',
    'font-bold',
    'text-emerald-500',
    'sm:col-span-2',
    'disabled:text-gray-700',
  ],
  actions: ['mt-4', 'sm:mt-0', 'sm:col-start-3', 'sm:text-right'],
  actionButton: [
    'ml-2',
    'text-xl',
    'ps-2',
    'font-medium',
    'underline',
    'text-gray-700',
  ],
  deleteButton: ['hover:text-red-500'],
  cancelButton: ['hover:text-red-500'],
  saveButton: ['hover:text-green-500'],
  editButton: ['hover:text-blue-500'],
  hiddenButton: ['hidden'],
};

export function useStyle(type) {
  if (typeof type === 'string') return bookOfStyles[type];
  else {
    const allStyles = type.map((t) => bookOfStyles[t]);
    return allStyles.flat();
  }
}
