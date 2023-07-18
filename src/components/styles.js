const bookOfStyles = {
  purchase: [
    'bg-white',
    'px-4',
    'py-3',
    'gap-x-4',
    'sm:border-b',
    'sm:border-gray-200',
    'flex',
  ],
  purchaseTitle: ['text-lg', 'font-medium', 'text-gray-900', 'flex-1'],
  purchaseQuantity: [
    'w-[50px]',
    'text-center',
    'py-1',
    'px-2',
    'border',
    'border-emerald-500',
    'border-2',
    'disabled:border-0',
    'rounded',
    'text-emerald-500',
    'text-sm',
    'leading-tight',
    'font-bold',
    'disabled:text-gray-700',
    'focus:outline-none',
    'focus:shadow-outline',
  ],
  purchaseQuantityWrapper: ['flex', 'flex-row', 'flex-1'],
  purchaseType: [
    'w-fit',
    'py-1',
    'px-2',
    'border',
    'border-emerald-500',
    'border-2',
    'py-px',
    'disabled:border-transparent',
    'disabled:appearance-none',
    'disabled:text-gray-900',
    'disabled:border-2',
    'disabled:pl-3',
    'rounded',
    'leading-tight',
    'focus:outline-none',
    'focus:shadow-outline',
    'text-sm',
    'font-bold',
    'text-emerald-500',
    'flex-1'
  ],
  purchaseTypeWrapper: ['flex', 'flex-row', 'justify-end', 'flex-1'],
  purchaseDate: ['text-center', 'flex-1', 'hidden', 'md:flex'],
  purchasePrice: ['text-center', 'w-12', 'hidden', 'md:flex'],
  actions: ['sm:mt-0', 'sm:text-right', 'w-28'],
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
